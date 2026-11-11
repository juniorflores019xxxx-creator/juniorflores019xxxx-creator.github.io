<?php
// Puerta del agente de cotización de SIBNOVA: registra o actualiza una cotización en el CRM (/admin/ → Cotizaciones)
// y guarda el PDF de la proforma. Solo responde a la llave del agente (cabecera X-Sibnova-Agente), que se puede
// apagar desde el CRM. Nunca recibe costos, precios mínimos ni márgenes: si llegan, se descartan.
declare(strict_types=1);
require __DIR__ . '/_lib.php';

const ETAPAS = ['proforma', 'enviada', 'negociacion', 'ganado', 'perdido'];

function fail(string $msg, int $code = 422): never { json_out(['ok' => false, 'error' => $msg], $code); }
function fecha_ok(string $v): string { return preg_match('/^\d{4}-\d{2}-\d{2}$/', $v) && DateTimeImmutable::createFromFormat('!Y-m-d', $v) ? $v : ''; }

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') { header('Allow: POST'); fail('Método no permitido.', 405); }
try { db(); } catch (Throwable $e) { error_log('agente: ' . $e->getMessage()); fail('El servidor no está disponible.', 503); }

// Llave: se compara su huella; los intentos fallidos se limitan para frenar adivinanzas
if (too_many('agente-fallo', 10, 3600, false)) fail('Demasiados intentos fallidos. Espera una hora.', 429);
$llave = (string)($_SERVER['HTTP_X_SIBNOVA_AGENTE'] ?? '');
if ($llave === '' || !hash_equals(AGENT_TOKEN_SHA256, hash('sha256', $llave))) { too_many('agente-fallo', 99, 3600); fail('Llave no válida.', 401); }
if (setting('agente_apagado') === '1') fail('El acceso del agente está apagado en el CRM (Cuenta).', 403);
if (too_many('agente', 120, 3600)) fail('Demasiados envíos en una hora.', 429);

$accion = (string)($_POST['accion'] ?? '');
$clave = strtolower(clean($_POST['clave'] ?? '', 80));
if (!preg_match('/^[a-z0-9][a-z0-9-]{2,79}$/', $clave)) fail('Clave de cotización no válida (usa la carpeta del cliente, p. ej. 2026-11-10-empresa).');
$pdo = db();
$st = $pdo->prepare('SELECT * FROM cotizaciones WHERE clave = ?');
$st->execute([$clave]);
$actual = $st->fetch() ?: null;

if ($accion === 'leer') {
    if (!$actual) fail('No existe esa cotización.', 404);
    $actual['opciones'] = json_decode($actual['opciones'], true) ?: [];
    json_out(['ok' => true, 'cotizacion' => $actual]);
}
if ($accion !== 'guardar') fail('Acción no válida.');

$in = json_decode((string)($_POST['datos'] ?? ''), true);
if (!is_array($in)) fail('Faltan los datos (campo «datos» en JSON).');
$txt = fn(string $k, int $max) => clean(is_scalar($in[$k] ?? null) ? (string)$in[$k] : '', $max);
$v = [
    'nombre' => $txt('nombre', 120), 'empresa' => $txt('empresa', 120), 'telefono' => $txt('telefono', 30), 'correo' => $txt('correo', 120),
    'ciudad' => $txt('ciudad', 80), 'rubro' => $txt('rubro', 200), 'proyecto' => $txt('proyecto', 300), 'origen' => $txt('origen', 200),
    'prioridad' => in_array($in['prioridad'] ?? '', ['Alta', 'Media', 'Baja'], true) ? $in['prioridad'] : '',
    'proforma' => $txt('proforma', 60), 'vigencia' => fecha_ok($txt('vigencia', 10)),
    'monto' => max(0, (int)($in['monto'] ?? 0)), 'soporte_mensual' => max(0, (int)($in['soporte_mensual'] ?? 0)),
    'opcion_elegida' => $txt('opcion_elegida', 60), 'mensaje_cliente' => $txt('mensaje_cliente', 3000), 'resumen_equipo' => $txt('resumen_equipo', 3000),
    'proximo_seguimiento' => fecha_ok($txt('proximo_seguimiento', 10)),
];
// Opciones: solo lo que ve el cliente (nombre, precio, semanas). Cualquier otro campo (mínimo, costo…) se descarta.
$ops = [];
foreach (array_slice((array)($in['opciones'] ?? []), 0, 6) as $o) {
    if (!is_array($o)) continue;
    $ops[] = ['id' => clean((string)($o['id'] ?? ''), 40), 'nombre' => clean((string)($o['nombre'] ?? ''), 120), 'precio' => max(0, (int)($o['precio'] ?? 0)),
        'semanas' => clean((string)($o['semanas'] ?? ''), 20), 'recomendada' => !empty($o['recomendada'])];
}
$etapa = in_array($in['etapa'] ?? '', ETAPAS, true) ? $in['etapa'] : ($actual['etapa'] ?? 'proforma');
if (!$actual && $v['nombre'] === '') fail('Falta el nombre del cliente.');

// PDF opcional (la proforma). Se guardan todas las versiones.
$pdf = null;
if (isset($_FILES['pdf']) && ($_FILES['pdf']['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE) {
    $f = $_FILES['pdf'];
    if ($f['error'] !== UPLOAD_ERR_OK || !is_uploaded_file($f['tmp_name'])) fail('No se pudo recibir el PDF.');
    if ($f['size'] <= 0 || $f['size'] > 15 * 1048576) fail('El PDF debe pesar menos de 15 MB.');
    if ((new finfo(FILEINFO_MIME_TYPE))->file($f['tmp_name']) !== 'application/pdf') fail('El archivo no es un PDF.');
    $nombre = clean(basename((string)$f['name']), 120);
    if (!str_ends_with(strtolower($nombre), '.pdf')) $nombre .= '.pdf';
    $pdf = ['tmp' => $f['tmp_name'], 'nombre' => $nombre, 'bytes' => (int)$f['size']];
}

$ahora = now_iso();
$dir = null;
try {
    $pdo->beginTransaction();
    if ($actual) {
        // Actualiza solo lo que vino con valor; las notas y el seguimiento que escribiste en el CRM no se pisan si el agente no los manda
        $set = ['actualizado = ?', 'etapa = ?']; $par = [$ahora, $etapa];
        foreach ($v as $k => $x) if ($x !== '' && $x !== 0) { $set[] = "$k = ?"; $par[] = $x; }
        if ($ops) { $set[] = 'opciones = ?'; $par[] = json_encode($ops, JSON_UNESCAPED_UNICODE); }
        $par[] = $actual['id'];
        $pdo->prepare('UPDATE cotizaciones SET ' . implode(', ', $set) . ' WHERE id = ?')->execute($par);
        $id = (int)$actual['id'];
    } else {
        $cols = array_keys($v);
        $pdo->prepare('INSERT INTO cotizaciones (clave, creado, actualizado, etapa, opciones, notas, ' . implode(', ', $cols) . ') VALUES (?, ?, ?, ?, ?, \'\', ' . implode(', ', array_fill(0, count($cols), '?')) . ')')
            ->execute(array_merge([$clave, $ahora, $ahora, $etapa, json_encode($ops, JSON_UNESCAPED_UNICODE)], array_values($v)));
        $id = (int)$pdo->lastInsertId();
    }
    $act = $pdo->prepare('INSERT INTO cotizaciones_actividad (cotizacion_id, fecha, texto) VALUES (?, ?, ?)');
    foreach (array_slice((array)($in['actividad'] ?? []), 0, 10) as $a) {
        $t = clean(is_array($a) ? (string)($a['texto'] ?? '') : (string)$a, 300);
        $fa = is_array($a) ? clean((string)($a['fecha'] ?? ''), 40) : '';
        if ($t !== '') $act->execute([$id, strtotime($fa) ? $fa : $ahora, $t]);
    }
    if ($pdf) {
        $dir = data_dir() . '/archivos/cotizaciones/' . $clave;
        if (!is_dir($dir) && !mkdir($dir, 0700, true)) throw new RuntimeException('no se pudo crear la carpeta');
        $saved = bin2hex(random_bytes(12)) . '.pdf';
        if (!move_uploaded_file($pdf['tmp'], "$dir/$saved")) throw new RuntimeException('no se pudo guardar el PDF');
        $pdo->prepare('INSERT INTO cotizaciones_archivos (cotizacion_id, nombre, guardado, bytes, subido) VALUES (?, ?, ?, ?, ?)')->execute([$id, $pdf['nombre'], $saved, $pdf['bytes'], $ahora]);
        $act->execute([$id, $ahora, 'PDF subido: ' . $pdf['nombre']]);
    }
    $pdo->commit();
} catch (Throwable $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    error_log('agente: error al guardar: ' . $e->getMessage());
    fail('No se pudo guardar la cotización.', 500);
}
json_out(['ok' => true, 'id' => $id, 'nuevo' => !$actual, 'url' => SITE_URL . '/admin/?cot=' . $id]);
