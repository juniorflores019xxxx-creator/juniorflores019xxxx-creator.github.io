<?php
// Recibe la solicitud de página web del catálogo: valida todo en el servidor, calcula el precio
// inicial desde catalogo.json, guarda los archivos fuera de la carpeta pública y avisa por correo.
declare(strict_types=1);
require __DIR__ . '/_lib.php';

const FILE_TYPES = [
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
if ((int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 45 * 1024 * 1024) fail('La solicitud es demasiado grande. Reduce el tamaño de los archivos.', 413);
if (empty($_POST)) fail('No recibimos datos. Si subiste archivos muy pesados, reduce su tamaño.', 400);

try {
    $cat = catalogo();
    db();
} catch (Throwable $e) {
    error_log('solicitud: servidor no disponible: ' . $e->getMessage());
    fail('El servidor de solicitudes no está disponible en este momento.', 503);
}

// Protección contra spam: campo trampa, tiempo mínimo de llenado y límite por visitante.
if (clean($_POST['sitio_web'] ?? '', 200) !== '') json_out(['ok' => true, 'numero' => 'SW-' . date('Ymd') . '-000000']);
$t0 = (int)($_POST['t0'] ?? 0);
if ($t0 <= 0 || (int)(microtime(true) * 1000) - $t0 < 5000) fail('Revisa el formulario antes de enviarlo.', 400);
// Límite amplio para intentos (incluye errores de llenado) y otro estricto para solicitudes válidas.
if (too_many('intento', 30, 3600)) fail('Recibimos demasiados intentos desde tu conexión. Intenta más tarde o escríbenos por WhatsApp.', 429);

$err = [];
$req = function (string $k, int $max, int $min = 1) use (&$err): string {
    $v = clean($_POST[$k] ?? '', $max);
    if (mb_strlen($v) < $min) $err[] = $k;
    return $v;
};
$opt = fn(string $k, int $max): string => clean($_POST[$k] ?? '', $max);
$one = function (string $k, array $allowed) use (&$err): string {
    $v = clean($_POST[$k] ?? '', 40);
    if (!in_array($v, $allowed, true)) $err[] = $k;
    return $v;
};

$diseno = find_by_id($cat['disenos'], clean($_POST['diseno'] ?? '', 60));
$paquete = find_by_id($cat['paquetes'], clean($_POST['paquete'] ?? '', 40));
if (!$diseno) $err[] = 'diseno';
if (!$paquete) $err[] = 'paquete';

$d = [
    'nombre' => $req('nombre', 120, 3), 'empresa' => $opt('empresa', 120), 'nit' => $opt('nit', 15), 'cargo' => $opt('cargo', 80),
    'correo' => $req('correo', 120, 5), 'telefono' => $req('telefono', 20, 7), 'ciudad' => $req('ciudad', 60, 2), 'pais' => $req('pais', 60, 2),
    'nombre_comercial' => $opt('nombre_comercial', 120), 'rubro' => $req('rubro', 60, 2), 'descripcion' => $req('descripcion', 1500, 15),
    'servicios' => $opt('servicios', 1500), 'publico' => $opt('publico', 300), 'objetivos' => $req('objetivos', 1000, 10),
    'colores' => $opt('colores', 200), 'logo' => $one('logo', ['si', 'no', 'en_proceso']), 'manual' => $one('manual', ['si', 'no']),
    'referencias' => $opt('referencias', 800), 'cambios' => $opt('cambios', 1000),
    'dominio' => $one('dominio', ['si', 'no', 'no_se']), 'hosting' => $one('hosting', ['si', 'no', 'no_se']), 'adicionales' => $opt('adicionales', 1000),
    'fecha_entrega' => $opt('fecha_entrega', 10), 'presupuesto' => $one('presupuesto', $cat['presupuestos']),
    'aprobador' => $opt('aprobador', 120), 'observaciones' => $opt('observaciones', 1500),
];
if (!filter_var($d['correo'], FILTER_VALIDATE_EMAIL)) $err[] = 'correo';
if (!preg_match('/^\+?[0-9 ()\-]{7,20}$/', $d['telefono']) || strlen(preg_replace('/\D/', '', $d['telefono'])) < 7) $err[] = 'telefono';
if ($d['nit'] !== '' && !preg_match('/^[0-9]{5,15}$/', $d['nit'])) $err[] = 'nit';
if ($d['fecha_entrega'] !== '' && !DateTimeImmutable::createFromFormat('!Y-m-d', $d['fecha_entrega'])) $err[] = 'fecha_entrega';
if (($_POST['acepto'] ?? '') !== 'si') $err[] = 'acepto';

$validas = array_column($cat['funciones'], 'label', 'id');
$funciones = [];
foreach ((array)($_POST['funciones'] ?? []) as $f) {
    $f = clean($f, 30);
    if (isset($validas[$f]) && !in_array($f, $funciones, true)) $funciones[] = $f;
}

if ($err) fail('Revisa estos datos: ' . implode(', ', array_unique($err)) . '.');

// Archivos: cantidad, tamaño, extensión y tipo real del contenido.
$lim = $cat['archivos'];
$files = [];
if (isset($_FILES['archivos']) && is_array($_FILES['archivos']['name'] ?? null)) {
    $total = 0;
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    foreach ($_FILES['archivos']['name'] as $i => $name) {
        $code = $_FILES['archivos']['error'][$i];
        if ($code === UPLOAD_ERR_NO_FILE) continue;
        if ($code === UPLOAD_ERR_INI_SIZE || $code === UPLOAD_ERR_FORM_SIZE) fail('Un archivo supera el tamaño permitido.');
        if ($code !== UPLOAD_ERR_OK) fail('No pudimos recibir uno de los archivos. Intenta de nuevo.');
        $tmp = $_FILES['archivos']['tmp_name'][$i];
        $size = (int)$_FILES['archivos']['size'][$i];
        $orig = clean(basename((string)$name), 120);
        $ext = strtolower(pathinfo($orig, PATHINFO_EXTENSION));
        if (!is_uploaded_file($tmp)) fail('Archivo no válido.');
        if (!in_array($ext, $lim['ext'], true) || !isset(FILE_TYPES[$ext])) fail("«{$orig}» no es un formato permitido.");
        if ($size <= 0 || $size > $lim['maxFileMB'] * 1024 * 1024) fail("«{$orig}» supera los {$lim['maxFileMB']} MB.");
        $mime = (string)$finfo->file($tmp);
        if (!in_array($mime, FILE_TYPES[$ext], true)) fail("El contenido de «{$orig}» no coincide con su formato.");
        if (str_starts_with($mime, 'image/') && @getimagesize($tmp) === false) fail("«{$orig}» no es una imagen válida.");
        $total += $size;
        $files[] = ['tmp' => $tmp, 'nombre' => $orig, 'ext' => $ext, 'tipo' => $mime, 'bytes' => $size];
    }
    if (count($files) > $lim['maxFiles']) fail("Puedes subir hasta {$lim['maxFiles']} archivos.");
    if ($total > $lim['maxTotalMB'] * 1024 * 1024) fail("Entre todos los archivos no pueden pasar de {$lim['maxTotalMB']} MB.");
}

if (too_many('solicitud', 5, 3600)) fail('Recibimos varias solicitudes desde tu conexión. Intenta más tarde o escríbenos por WhatsApp.', 429);

$pdo = db();
$fecha = now_iso();
$dir = null;
try {
    $pdo->beginTransaction();
    do {
        $numero = 'SW-' . date('Ymd') . '-' . strtoupper(bin2hex(random_bytes(3)));
        $st = $pdo->prepare('SELECT 1 FROM solicitudes WHERE numero = ?');
        $st->execute([$numero]);
    } while ($st->fetchColumn());

    $estado = $cat['estados'][0];
    $pdo->prepare('INSERT INTO solicitudes (numero, creado, actualizado, estado, nombre, empresa, correo, telefono, ciudad, diseno_id, diseno_nombre, paquete_id, paquete_nombre, precio_inicial, funciones, datos)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')->execute([
        $numero, $fecha, $fecha, $estado, $d['nombre'], $d['empresa'], $d['correo'], $d['telefono'], $d['ciudad'],
        $diseno['id'], $diseno['n'] . ' ' . $diseno['nombre'], $paquete['id'], $paquete['nombre'], (int)$paquete['precio'],
        json_encode($funciones), json_encode($d, JSON_UNESCAPED_UNICODE),
    ]);
    $sid = (int)$pdo->lastInsertId();
    $pdo->prepare('INSERT INTO historial (solicitud_id, fecha, estado, nota) VALUES (?, ?, ?, ?)')->execute([$sid, $fecha, $estado, 'Solicitud recibida desde el catálogo']);

    if ($files) {
        $dir = data_dir() . '/archivos/' . $numero;
        if (!mkdir($dir, 0700, true)) throw new RuntimeException('no se pudo crear la carpeta');
        $ins = $pdo->prepare('INSERT INTO archivos (solicitud_id, nombre, guardado, tipo, bytes) VALUES (?, ?, ?, ?, ?)');
        foreach ($files as $f) {
            $saved = bin2hex(random_bytes(12)) . '.' . $f['ext'];
            if (!move_uploaded_file($f['tmp'], "$dir/$saved")) throw new RuntimeException('no se pudo guardar un archivo');
            $ins->execute([$sid, $f['nombre'], $saved, $f['tipo'], $f['bytes']]);
        }
    }
    $pdo->commit();
} catch (Throwable $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    if ($dir && is_dir($dir)) { array_map('unlink', glob("$dir/*") ?: []); @rmdir($dir); }
    error_log('solicitud: error al guardar: ' . $e->getMessage());
    fail('No pudimos registrar la solicitud. Intenta de nuevo en unos minutos.', 500);
}

// Aviso al equipo: sin datos de contacto del cliente; el detalle está en la bandeja protegida.
$body = "Nueva solicitud de página web\n\nNúmero: {$numero}\nFecha: {$fecha}\nDiseño: {$diseno['n']} {$diseno['nombre']}\nPaquete: {$paquete['nombre']} (desde Bs " . number_format((int)$paquete['precio'], 0, ',', '.') . ")\nCliente: {$d['nombre']}" . ($d['empresa'] ? " · {$d['empresa']}" : '') . "\nArchivos: " . count($files) . "\n\nRevísala en " . SITE_URL . "/admin/\n";
@mail(NOTIFY_EMAIL, "=?UTF-8?B?" . base64_encode("Nueva solicitud {$numero}") . "?=", $body, "From: SIBNOVA <" . MAIL_FROM . ">\r\nContent-Type: text/plain; charset=UTF-8");

json_out(['ok' => true, 'numero' => $numero]);
