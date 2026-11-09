<?php
// Recibe los formularios de datos que SIBNOVA envía a sus clientes (/datos-proyecto/?f=…).
// Cada campo se valida contra formularios.json (generado desde src/lib/forms.ts); los archivos
// se guardan fuera de la carpeta pública y todo aparece en la bandeja (/admin/ → Datos recibidos).
declare(strict_types=1);
require __DIR__ . '/_lib.php';

const MIME = [
    'jpg' => ['image/jpeg'], 'jpeg' => ['image/jpeg'], 'png' => ['image/png'], 'webp' => ['image/webp'],
    'pdf' => ['application/pdf'], 'txt' => ['text/plain'],
    'doc' => ['application/msword', 'application/vnd.ms-office'], 'xls' => ['application/vnd.ms-excel', 'application/vnd.ms-office'], 'ppt' => ['application/vnd.ms-powerpoint', 'application/vnd.ms-office'],
    'docx' => ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip'],
    'xlsx' => ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/zip'],
    'pptx' => ['application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/zip'],
    'mp4' => ['video/mp4'], 'mov' => ['video/quicktime'],
];

function fail(string $msg, int $code = 422): never { json_out(['ok' => false, 'error' => $msg], $code); }

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') { header('Allow: POST'); fail('Método no permitido.', 405); }
if (!origin_ok()) fail('Origen no permitido.', 403);
if ((int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 90 * 1024 * 1024) fail('El envío es demasiado grande. Comparte los videos con un enlace de Drive.', 413);
if (empty($_POST)) fail('No recibimos datos. Si subiste archivos muy pesados, reduce su tamaño o usa un enlace de Drive.', 400);

try { $cfg = formularios(); db(); } catch (Throwable $e) {
    error_log('datos: servidor no disponible: ' . $e->getMessage());
    fail('El servidor no está disponible en este momento.', 503);
}

if (clean($_POST['sitio_web'] ?? '', 200) !== '') json_out(['ok' => true, 'numero' => 'DP-' . date('Ymd') . '-000000']);
$t0 = (int)($_POST['t0'] ?? 0);
if ($t0 <= 0 || (int)(microtime(true) * 1000) - $t0 < 8000) fail('Revisa el formulario antes de enviarlo.', 400);
if (too_many('datos-intento', 30, 3600)) fail('Recibimos demasiados intentos desde tu conexión. Intenta más tarde.', 429);

$form = find_by_id($cfg['formularios'], clean($_POST['formulario'] ?? '', 60));
if (!$form) fail('Formulario no válido.');
if (($_POST['acepto'] ?? '') !== 'si') fail('Debes aceptar el uso de tus datos para continuar.');

$datos = [];
$err = [];
$fileFields = [];
$visible = [];
foreach ($form['campos'] as $c) {
    $n = $c['name'];
    $max = max(1, (int)$c['max']);
    // Preguntas condicionales: si la pregunta de la que dependen no tiene ese valor, no se piden ni se guardan
    $w = $c['when'] ?? null;
    $visible[$n] = !$w || (($visible[$w['field']] ?? true) && array_intersect((array)($datos[$w['field']] ?? ''), (array)$w['in']));
    if ($c['type'] === 'note') continue;
    if (!$visible[$n]) { $datos[$n] = $c['type'] === 'multi' || $c['type'] === 'colors' ? [] : ''; continue; }
    switch ($c['type']) {
        case 'file':
            $fileFields[] = $c;
            continue 2;
        case 'multi':
            $v = array_values(array_unique(array_filter(array_map(fn($x) => clean($x, 400), (array)($_POST[$n] ?? [])), fn($x) => in_array($x, $c['options'], true))));
            if ($c['required'] && !$v) $err[] = $c['label'];
            $datos[$n] = $v;
            continue 2;
        case 'colors':
            $usar = array_map('intval', (array)($_POST[$n . '_usar'] ?? []));
            $vals = array_values((array)($_POST[$n] ?? []));
            $out = [];
            foreach ($usar as $i) if (isset($vals[$i]) && is_string($vals[$i]) && preg_match('/^#[0-9a-fA-F]{6}$/', $vals[$i])) $out[] = strtolower($vals[$i]);
            $datos[$n] = array_slice(array_values(array_unique($out)), 0, 3);
            continue 2;
        case 'select':
            $v = clean($_POST[$n] ?? '', 120);
            if ($v !== '' && !in_array($v, $c['options'], true)) $err[] = $c['label'];
            break;
        default:
            $v = clean($_POST[$n] ?? '', $max);
            if ($v !== '') {
                if ($c['type'] === 'email' && !filter_var($v, FILTER_VALIDATE_EMAIL)) $err[] = $c['label'];
                if ($c['type'] === 'tel' && (!preg_match('/^\+?[0-9 ()\-]{7,20}$/', $v) || strlen(preg_replace('/\D/', '', $v)) < 7)) $err[] = $c['label'];
                if ($c['type'] === 'url' && !preg_match('#^https?://#i', $v)) $err[] = $c['label'];
                if ($c['type'] === 'date' && !DateTimeImmutable::createFromFormat('!Y-m-d', $v)) $err[] = $c['label'];
            }
    }
    if ($c['required'] && $v === '') $err[] = $c['label'];
    $datos[$n] = $v;
}
// Archivos que el cliente marcó como enviados por WhatsApp (pesaban más del límite)
$porWhatsapp = array_slice(array_values(array_filter(array_map(fn($x) => clean($x, 200), (array)($_POST['archivos_whatsapp'] ?? [])))), 0, 30);
$datos['archivos_whatsapp'] = $porWhatsapp;
if (($datos['nombre'] ?? '') === '' || ($datos['telefono'] ?? '') === '') $err[] = 'nombre y WhatsApp';
if ($err) fail('Revisa estos datos: ' . implode(', ', array_unique($err)) . '.');

// Archivos de cada campo: cantidad, tamaño, extensión y tipo real del contenido.
$lim = $cfg['archivos'];
$files = [];
$total = 0;
$finfo = new finfo(FILEINFO_MIME_TYPE);
foreach ($fileFields as $c) {
    $up = $_FILES[$c['name']] ?? null;
    if (!$up || !is_array($up['name'] ?? null)) continue;
    foreach ($up['name'] as $i => $name) {
        $code = $up['error'][$i];
        if ($code === UPLOAD_ERR_NO_FILE) continue;
        if ($code === UPLOAD_ERR_INI_SIZE || $code === UPLOAD_ERR_FORM_SIZE) fail('Un archivo supera el tamaño permitido. Compártelo con un enlace de Drive.');
        if ($code !== UPLOAD_ERR_OK) fail('No pudimos recibir uno de los archivos. Intenta de nuevo.');
        $tmp = $up['tmp_name'][$i];
        $size = (int)$up['size'][$i];
        $orig = clean(basename((string)$name), 120);
        $ext = strtolower(pathinfo($orig, PATHINFO_EXTENSION));
        if (!is_uploaded_file($tmp)) fail('Archivo no válido.');
        if (!in_array($ext, $c['ext'], true) || !isset(MIME[$ext])) fail("«{$orig}» no es un formato permitido en «{$c['label']}».");
        if ($size <= 0 || $size > $lim['maxFileMB'] * 1024 * 1024) fail("«{$orig}» supera los {$lim['maxFileMB']} MB. Compártelo con un enlace de Drive.");
        $mime = (string)$finfo->file($tmp);
        if (!in_array($mime, MIME[$ext], true)) fail("El contenido de «{$orig}» no coincide con su formato.");
        if (str_starts_with($mime, 'image/') && @getimagesize($tmp) === false) fail("«{$orig}» no es una imagen válida.");
        $total += $size;
        $files[] = ['tmp' => $tmp, 'campo' => $c['label'], 'nombre' => $orig, 'ext' => $ext, 'tipo' => $mime, 'bytes' => $size];
    }
}
if (count($files) > $lim['maxFiles']) fail("Puedes subir hasta {$lim['maxFiles']} archivos. Comparte el resto con un enlace de Drive.");
if ($total > $lim['maxTotalMB'] * 1024 * 1024) fail("Entre todos los archivos no pueden pasar de {$lim['maxTotalMB']} MB.");
if (too_many('datos', 10, 3600)) fail('Recibimos varios envíos desde tu conexión. Intenta más tarde o escríbenos por WhatsApp.', 429);

$pdo = db();
$fecha = now_iso();
$dir = null;
try {
    $pdo->beginTransaction();
    do {
        $numero = 'DP-' . date('Ymd') . '-' . strtoupper(bin2hex(random_bytes(3)));
        $st = $pdo->prepare('SELECT 1 FROM entregas WHERE numero = ?');
        $st->execute([$numero]);
    } while ($st->fetchColumn());
    $pdo->prepare('INSERT INTO entregas (numero, creado, formulario, titulo, nombre, empresa, telefono, correo, datos) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')->execute([
        $numero, $fecha, $form['id'], $form['titulo'], $datos['nombre'], $datos['empresa'] ?? '', $datos['telefono'], $datos['correo'] ?? '', json_encode($datos, JSON_UNESCAPED_UNICODE),
    ]);
    $eid = (int)$pdo->lastInsertId();
    if ($files) {
        $dir = data_dir() . '/archivos/' . $numero;
        if (!mkdir($dir, 0700, true)) throw new RuntimeException('no se pudo crear la carpeta');
        $ins = $pdo->prepare('INSERT INTO entregas_archivos (entrega_id, campo, nombre, guardado, tipo, bytes) VALUES (?, ?, ?, ?, ?, ?)');
        foreach ($files as $f) {
            $saved = bin2hex(random_bytes(12)) . '.' . $f['ext'];
            if (!move_uploaded_file($f['tmp'], "$dir/$saved")) throw new RuntimeException('no se pudo guardar un archivo');
            $ins->execute([$eid, $f['campo'], $f['nombre'], $saved, $f['tipo'], $f['bytes']]);
        }
    }
    $pdo->commit();
} catch (Throwable $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    if ($dir && is_dir($dir)) { array_map('unlink', glob("$dir/*") ?: []); @rmdir($dir); }
    error_log('datos: error al guardar: ' . $e->getMessage());
    fail('No pudimos guardar tus datos. Intenta de nuevo en unos minutos.', 500);
}

$body = "Un cliente completó un formulario de datos\n\nNúmero: {$numero}\nFormulario: {$form['titulo']}\nCliente: {$datos['nombre']}" . (($datos['empresa'] ?? '') !== '' ? " · {$datos['empresa']}" : '') . "\nArchivos: " . count($files) . "\n\nRevísalo en " . SITE_URL . "/admin/?datos=1\n";
@mail(NOTIFY_EMAIL, "=?UTF-8?B?" . base64_encode("Datos recibidos {$numero}") . "?=", $body, "From: SIBNOVA <" . MAIL_FROM . ">\r\nContent-Type: text/plain; charset=UTF-8");

json_out(['ok' => true, 'numero' => $numero]);
