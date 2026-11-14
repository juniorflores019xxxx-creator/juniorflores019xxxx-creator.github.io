<?php
// CRM de SIBNOVA (bandeja): solicitudes, clientes y datos de proyectos. Solo para el equipo, protegido con contraseña.
declare(strict_types=1);
require dirname(__DIR__) . '/api/_lib.php';

$https = ($_SERVER['HTTPS'] ?? '') === 'on' || ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https';
header("Content-Security-Policy: default-src 'none'; style-src 'unsafe-inline'; img-src 'self'; form-action 'self' https://wa.me https://api.whatsapp.com https://web.whatsapp.com; frame-ancestors 'none'; base-uri 'none'");
header('X-Robots-Tag: noindex, nofollow');
header('Cache-Control: no-store');
header('Referrer-Policy: no-referrer');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');

session_name('sibnova_bandeja');
session_set_cookie_params(['lifetime' => 0, 'path' => '/admin/', 'secure' => $https, 'httponly' => true, 'samesite' => 'Strict']);
session_start();

try { $cat = catalogo(); db(); } catch (Throwable $e) {
    error_log('bandeja: servidor no disponible: ' . $e->getMessage());
    http_response_code(503); exit('El almacén de solicitudes no está disponible.');
}
$ESTADOS = $cat['estados'];
$FUNC = array_column($cat['funciones'], 'label', 'id');

if (empty($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(32));
$csrf = $_SESSION['csrf'];
$logged = !empty($_SESSION['ok']) && ($_SESSION['vence'] ?? 0) > time();
if ($logged) $_SESSION['vence'] = time() + 7200;
$hash = setting('admin_hash');
$msg = '';
// Etapas de las cotizaciones que registra el agente: clave => [nombre, color]
const ETAPAS_COT = ['proforma' => ['Proforma lista', '#4c8dff'], 'enviada' => ['Enviada', '#a78bfa'], 'negociacion' => ['En negociación', '#fb923c'], 'ganado' => ['Ganada', '#22c55e'], 'perdido' => ['Perdida', '#ef4444']];
const COT_ABIERTAS = ['proforma', 'enviada', 'negociacion'];

function solicitud_labels(): array {
    return ['nombre' => 'Nombre', 'empresa' => 'Empresa', 'nit' => 'NIT', 'cargo' => 'Cargo', 'correo' => 'Correo', 'telefono' => 'Teléfono / WhatsApp', 'ciudad' => 'Ciudad', 'pais' => 'País',
        'nombre_comercial' => 'Nombre comercial', 'rubro' => 'Rubro', 'descripcion' => 'Descripción', 'servicios' => 'Servicios o productos', 'publico' => 'Público objetivo', 'objetivos' => 'Objetivos',
        'colores' => 'Colores', 'logo' => 'Logo', 'manual' => 'Manual de marca', 'referencias' => 'Referencias', 'cambios' => 'Conservar o cambiar',
        'catalogo' => 'Catálogo con WhatsApp', 'productos' => 'Cantidad de productos', 'dominio' => 'Dominio propio', 'hosting' => 'Hosting propio', 'adicionales' => 'Funciones adicionales',
        'fecha_entrega' => 'Fecha deseada', 'presupuesto' => 'Presupuesto', 'aprobador' => 'Aprueba', 'observaciones' => 'Observaciones', 'archivos_whatsapp' => 'Archivos enviados por WhatsApp'];
}

// Nombre de carpeta seguro para el ZIP (sin tildes ni símbolos)
function slug(string $t): string {
    $t = strtr(mb_strtolower($t), ['á' => 'a', 'é' => 'e', 'í' => 'i', 'ó' => 'o', 'ú' => 'u', 'ñ' => 'n', 'ü' => 'u']);
    return trim(preg_replace('/[^a-z0-9]+/', '-', $t) ?? '', '-') ?: 'archivo';
}

// ZIP sin compresión, sin depender de la extensión zip de PHP. $entries: [ruta dentro del ZIP => ['data' => texto] | ['file' => ruta]]
function send_zip(string $name, array $entries): never {
    $tmp = tempnam(sys_get_temp_dir(), 'sbz');
    $out = fopen($tmp, 'wb');
    $central = ''; $offset = 0; $n = 0;
    $dt = getdate();
    $time = ($dt['hours'] << 11) | ($dt['minutes'] << 5) | intdiv($dt['seconds'], 2);
    $date = (($dt['year'] - 1980) << 9) | ($dt['mon'] << 5) | $dt['mday'];
    foreach ($entries as $path => $e) {
        $data = isset($e['data']) ? $e['data'] : (is_file($e['file']) ? file_get_contents($e['file']) : null);
        if ($data === null || $data === false) continue;
        $crc = crc32($data); $len = strlen($data);
        $head = pack('vvvvvVVVvv', 20, 0x0800, 0, $time, $date, $crc, $len, $len, strlen($path), 0);
        fwrite($out, "PK\x03\x04" . $head . $path); fwrite($out, $data);
        $central .= "PK\x01\x02" . pack('vvvvvvVVVvvvvvVV', 20, 20, 0x0800, 0, $time, $date, $crc, $len, $len, strlen($path), 0, 0, 0, 0, 0, $offset) . $path;
        $offset += 30 + strlen($path) + $len; $n++;
    }
    fwrite($out, $central . "PK\x05\x06" . pack('vvvvVVv', 0, 0, $n, $n, strlen($central), $offset, 0));
    fclose($out);
    header('Content-Type: application/zip');
    header('Content-Disposition: attachment; filename="' . $name . '"');
    header('Content-Length: ' . filesize($tmp));
    readfile($tmp); @unlink($tmp);
    exit;
}

function csrf_ok(): bool { return hash_equals($_SESSION['csrf'] ?? '', (string)($_POST['csrf'] ?? '')); }
function go(string $q = ''): never { header('Location: /admin/' . $q, true, 303); exit; }
function bs(int $n): string { return 'Bs ' . number_format($n, 0, ',', '.'); }

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!csrf_ok()) { http_response_code(400); exit('Sesión vencida. Vuelve a cargar la página.'); }
    $a = $_POST['accion'] ?? '';
    if ($a === 'crear' && $hash === null) {
        if (too_many('setup', 5, 900)) $msg = 'Demasiados intentos. Espera 15 minutos.';
        elseif (!password_verify((string)($_POST['token'] ?? ''), SETUP_TOKEN_HASH)) $msg = 'La clave de activación no es correcta.';
        elseif (mb_strlen((string)($_POST['clave'] ?? '')) < 12) $msg = 'La contraseña debe tener al menos 12 caracteres.';
        elseif (($_POST['clave'] ?? '') !== ($_POST['clave2'] ?? '')) $msg = 'Las contraseñas no coinciden.';
        else { set_setting('admin_hash', password_hash((string)$_POST['clave'], PASSWORD_DEFAULT)); session_regenerate_id(true); $_SESSION['ok'] = 1; $_SESSION['vence'] = time() + 7200; go(); }
    } elseif ($a === 'entrar' && $hash !== null) {
        if (too_many('login', 5, 900, false)) $msg = 'Demasiados intentos fallidos. Espera 15 minutos.';
        elseif (password_verify((string)($_POST['clave'] ?? ''), $hash)) { session_regenerate_id(true); $_SESSION['ok'] = 1; $_SESSION['vence'] = time() + 7200; go(); }
        else { too_many('login', 99, 900); $msg = 'Contraseña incorrecta.'; }
    } elseif ($a === 'salir') { $_SESSION = []; session_destroy(); go(); }
    elseif ($logged && $a === 'estado') {
        $id = (int)($_POST['id'] ?? 0); $e = (string)($_POST['estado'] ?? '');
        $nota = clean($_POST['nota'] ?? '', 500);
        if (in_array($e, $ESTADOS, true) && $id > 0) {
            $f = now_iso();
            db()->prepare('UPDATE solicitudes SET estado = ?, actualizado = ? WHERE id = ?')->execute([$e, $f, $id]);
            db()->prepare('INSERT INTO historial (solicitud_id, fecha, estado, nota) VALUES (?, ?, ?, ?)')->execute([$id, $f, $e, $nota]);
        }
        go('?ver=' . $id);
    } elseif ($logged && $a === 'revisado') {
        $id = (int)($_POST['id'] ?? 0);
        db()->prepare('UPDATE entregas SET revisado = CASE revisado WHEN 1 THEN 0 ELSE 1 END WHERE id = ?')->execute([$id]);
        go('?entrega=' . $id);
    } elseif ($logged && $a === 'cot_etapa') {
        $id = (int)($_POST['id'] ?? 0); $e = (string)($_POST['etapa'] ?? '');
        $nota = clean($_POST['nota'] ?? '', 500);
        if (isset(ETAPAS_COT[$e]) && $id > 0) {
            $f = now_iso();
            db()->prepare('UPDATE cotizaciones SET etapa = ?, actualizado = ? WHERE id = ?')->execute([$e, $f, $id]);
            db()->prepare('INSERT INTO cotizaciones_actividad (cotizacion_id, fecha, texto) VALUES (?, ?, ?)')->execute([$id, $f, 'Etapa: ' . ETAPAS_COT[$e][0] . ($nota !== '' ? ' — ' . $nota : '')]);
        }
        go('?cot=' . $id);
    } elseif ($logged && $a === 'cot_seguir') {
        $id = (int)($_POST['id'] ?? 0);
        $fs = (string)($_POST['proximo'] ?? '');
        $fs = preg_match('/^\d{4}-\d{2}-\d{2}$/', $fs) ? $fs : '';
        db()->prepare('UPDATE cotizaciones SET proximo_seguimiento = ?, notas = ?, actualizado = ? WHERE id = ?')->execute([$fs, clean($_POST['notas'] ?? '', 3000), now_iso(), $id]);
        go('?cot=' . $id);
    } elseif ($logged && $a === 'agente') {
        set_setting('agente_apagado', setting('agente_apagado') === '1' ? '0' : '1');
        go('?cuenta=1');
    } elseif ($logged && $a === 'clave') {
        $nueva = (string)($_POST['clave'] ?? '');
        if (!password_verify((string)($_POST['actual'] ?? ''), (string)$hash)) $msg = 'La contraseña actual no es correcta.';
        elseif (mb_strlen($nueva) < 12 || $nueva !== ($_POST['clave2'] ?? '')) $msg = 'La nueva contraseña debe tener 12 caracteres o más y coincidir.';
        else { set_setting('admin_hash', password_hash($nueva, PASSWORD_DEFAULT)); $msg = 'Contraseña cambiada.'; }
    }
}

// Descarga de archivos: solo con sesión iniciada; nunca se muestran en el navegador.
if ($logged && isset($_GET['archivo'])) {
    $st = db()->prepare('SELECT a.*, s.numero FROM archivos a JOIN solicitudes s ON s.id = a.solicitud_id WHERE a.id = ?');
    $st->execute([(int)$_GET['archivo']]);
    $f = $st->fetch();
    $path = $f ? data_dir() . '/archivos/' . $f['numero'] . '/' . basename($f['guardado']) : '';
    if (!$f || !is_file($path)) { http_response_code(404); exit('Archivo no encontrado.'); }
    $name = preg_replace('/[^A-Za-z0-9._ -]/', '_', $f['nombre']);
    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename="' . $name . '"; filename*=UTF-8\'\'' . rawurlencode($f['nombre']));
    header('Content-Length: ' . filesize($path));
    readfile($path);
    exit;
}
if ($logged && isset($_GET['archivo_dp'])) {
    $st = db()->prepare('SELECT a.*, e.numero FROM entregas_archivos a JOIN entregas e ON e.id = a.entrega_id WHERE a.id = ?');
    $st->execute([(int)$_GET['archivo_dp']]);
    $f = $st->fetch();
    $path = $f ? data_dir() . '/archivos/' . $f['numero'] . '/' . basename($f['guardado']) : '';
    if (!$f || !is_file($path)) { http_response_code(404); exit('Archivo no encontrado.'); }
    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename="' . preg_replace('/[^A-Za-z0-9._ -]/', '_', $f['nombre']) . '"; filename*=UTF-8\'\'' . rawurlencode($f['nombre']));
    header('Content-Length: ' . filesize($path));
    readfile($path);
    exit;
}
if ($logged && isset($_GET['archivo_cot'])) {
    $st = db()->prepare('SELECT a.*, c.clave FROM cotizaciones_archivos a JOIN cotizaciones c ON c.id = a.cotizacion_id WHERE a.id = ?');
    $st->execute([(int)$_GET['archivo_cot']]);
    $f = $st->fetch();
    $path = $f ? data_dir() . '/archivos/cotizaciones/' . basename($f['clave']) . '/' . basename($f['guardado']) : '';
    if (!$f || !is_file($path)) { http_response_code(404); exit('Archivo no encontrado.'); }
    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename="' . preg_replace('/[^A-Za-z0-9._ -]/', '_', $f['nombre']) . '"; filename*=UTF-8\'\'' . rawurlencode($f['nombre']));
    header('Content-Length: ' . filesize($path));
    readfile($path);
    exit;
}
// «Descargar para Claude»: ZIP con brief.md (todos los datos ordenados) y los archivos del cliente
if ($logged && (isset($_GET['brief_dp']) || isset($_GET['brief_sw']))) {
    $md = []; $entries = []; $files = []; $dir = '';
    if (isset($_GET['brief_dp'])) {
        $st = db()->prepare('SELECT * FROM entregas WHERE id = ?'); $st->execute([(int)$_GET['brief_dp']]); $e = $st->fetch();
        if (!$e) { http_response_code(404); exit('No encontrado.'); }
        $d = json_decode($e['datos'], true) ?: [];
        $def = find_by_id(formularios()['formularios'], $e['formulario']);
        $dir = slug(($e['empresa'] ?: $e['nombre']) . '-' . $e['numero']);
        $md[] = '# Brief: ' . $e['titulo'];
        $md[] = ''; $md[] = '- Número: ' . $e['numero']; $md[] = '- Formulario: `' . $e['formulario'] . '`'; $md[] = '- Recibido: ' . $e['creado']; $md[] = '- Cliente: ' . $e['nombre'] . ($e['empresa'] ? ' · ' . $e['empresa'] : '');
        $sec = '';
        foreach (($def['campos'] ?? []) as $c) {
            if ($c['type'] === 'file') continue;
            $v = $d[$c['name']] ?? '';
            if ($v === '' || $v === []) continue;
            if ($c['seccion'] !== $sec) { $sec = $c['seccion']; $md[] = ''; $md[] = '## ' . $sec; }
            $val = is_array($v) ? implode(', ', $v) : (string)$v;
            $md[] = str_contains($val, "\n") ? '**' . $c['label'] . ':**' . "\n\n" . $val : '- **' . $c['label'] . ':** ' . $val;
        }
        if (!empty($d['archivos_whatsapp'])) { $md[] = ''; $md[] = '## Archivos enviados por WhatsApp'; foreach ((array)$d['archivos_whatsapp'] as $x) $md[] = '- ' . $x . ' (pídelos del chat del cliente)'; }
        $fa = db()->prepare('SELECT * FROM entregas_archivos WHERE entrega_id = ? ORDER BY campo, id'); $fa->execute([$e['id']]);
        foreach ($fa->fetchAll() as $f) $files[] = ['campo' => $f['campo'], 'nombre' => $f['nombre'], 'path' => data_dir() . '/archivos/' . $e['numero'] . '/' . basename($f['guardado'])];
        $tipo = $e['formulario'];
    } else {
        $st = db()->prepare('SELECT * FROM solicitudes WHERE id = ?'); $st->execute([(int)$_GET['brief_sw']]); $s = $st->fetch();
        if (!$s) { http_response_code(404); exit('No encontrado.'); }
        $d = json_decode($s['datos'], true) ?: [];
        $dir = slug(($s['empresa'] ?: $s['nombre']) . '-' . $s['numero']);
        $md[] = '# Brief: solicitud de página web';
        $md[] = ''; $md[] = '- Número: ' . $s['numero']; $md[] = '- Recibido: ' . $s['creado']; $md[] = '- Diseño elegido: ' . $s['diseno_nombre'] . ' (`' . $s['diseno_id'] . '` en el catálogo de SIBNOVA)'; $md[] = '- Paquete: ' . $s['paquete_nombre'] . ' · precio de referencia ' . bs((int)$s['precio_inicial']);
        $fn = array_map(fn($x) => $FUNC[$x] ?? $x, json_decode($s['funciones'], true) ?: []);
        if ($fn) $md[] = '- Funciones pedidas: ' . implode(', ', $fn);
        $md[] = ''; $md[] = '## Datos del cliente y del negocio';
        foreach (solicitud_labels() as $k => $l) { $v = (string)($d[$k] ?? ''); if ($v !== '' && $v !== 'no') $md[] = str_contains($v, "\n") ? '**' . $l . ':**' . "\n\n" . $v : '- **' . $l . ':** ' . $v; }
        $fa = db()->prepare('SELECT * FROM archivos WHERE solicitud_id = ?'); $fa->execute([$s['id']]);
        foreach ($fa->fetchAll() as $f) $files[] = ['campo' => 'Materiales', 'nombre' => $f['nombre'], 'path' => data_dir() . '/archivos/' . $s['numero'] . '/' . basename($f['guardado'])];
        $tipo = 'solicitud-' . $s['paquete_id'];
    }
    $used = [];
    if ($files) { $md[] = ''; $md[] = '## Archivos del cliente'; }
    foreach ($files as $f) {
        $p = 'archivos/' . slug($f['campo']) . '/' . preg_replace('/[^A-Za-z0-9._-]/', '_', $f['nombre']);
        while (isset($used[$p])) $p = preg_replace('/(\.[a-z0-9]+)?$/i', '-2$1', $p, 1);
        $used[$p] = true;
        $entries[$dir . '/' . $p] = ['file' => $f['path']];
        $md[] = '- `' . $p . '` (' . $f['campo'] . ')';
    }
    $md[] = ''; $md[] = '## Para Claude';
    $md[] = 'Proyecto de SIBNOVA de tipo `' . $tipo . '`. Usa la habilidad **crear-proyecto-cliente**: trabaja con estos datos y archivos, no inventes información del cliente y marca lo que falte como «Dato pendiente de confirmación». Muestra la vista previa y no publiques nada sin la aprobación de SIBNOVA.';
    $entries = [$dir . '/brief.md' => ['data' => implode("\n", $md) . "\n"]] + $entries;
    send_zip($dir . '.zip', $entries);
}
// Abre WhatsApp con el enlace del formulario ya escrito para el cliente
if ($logged && isset($_GET['enviar'])) {
    $fm = find_by_id(formularios()['formularios'], (string)$_GET['enviar']);
    $tel = preg_replace('/\D/', '', (string)($_GET['tel'] ?? ''));
    if (strlen($tel) === 8) $tel = '591' . $tel;
    if ($fm && strlen($tel) >= 8) {
        $nombre = clean($_GET['nombre'] ?? '', 60);
        $url = SITE_URL . '/datos-proyecto/?f=' . rawurlencode($fm['id']);
        $txt = 'Hola' . ($nombre !== '' ? ' ' . $nombre : '') . ', te saluda SIBNOVA. Para avanzar con tu proyecto necesitamos algunos datos. Puedes completarlos aquí: ' . $url . "\n\nSi tienes dudas, respóndenos por este chat.";
        header('Location: https://wa.me/' . $tel . '?text=' . rawurlencode($txt), true, 303);
        exit;
    }
}

// Catálogos de servicios para enviar por WhatsApp. Cada opción dice qué formulario mandar cuando el cliente la elige.
// Precios iguales a los PDF de public/catalogos/ (se generan en la computadora de SIBNOVA). Al cambiar un precio, cambiar ambos.
const CATALOGOS = [
    [
        'id' => 'redes-sociales',
        'titulo' => 'Redes sociales: logo, creación de redes y manejo mensual',
        'resumen' => 'Precio de cada servicio por separado y 3 combos mensuales (Esencial, Profesional y Premium) con videos grabados en el negocio, publicaciones y manejo de redes. Aparte: logo y creación de redes.',
        'enlace' => '/redes-sociales/',
        'pdf' => '/catalogos/sibnova-servicios-redes-sociales.pdf',
        'promo' => 'Promoción del 20 % para quienes contraten hasta el 31 de enero de 2027, durante los 3 primeros meses.',
        'opciones' => [
            ['Combo Esencial: 2 videos, 5 publicaciones, Facebook e Instagram', 'Bs 1.960/mes con promoción · normal Bs 2.450', 'combo-esencial'],
            ['Combo Profesional: 4 videos, 8 publicaciones, 8 historias, 3 redes', 'Bs 3.500/mes con promoción · normal Bs 4.380', 'combo-profesional'],
            ['Combo Premium: 8 videos, 12 publicaciones, 12 historias, 3 redes y publicidad', 'Bs 6.010/mes con promoción · normal Bs 7.520', 'combo-premium'],
            ['Logo + creación de Facebook, Instagram y TikTok', 'Bs 2.640 con promoción (por separado Bs 3.300)', 'logo-redes'],
            ['Solo logo', 'Bs 2.400', 'logo'],
            ['Solo creación de redes', 'Bs 300 por red', 'redes-sociales'],
            ['Servicios sueltos (videos, publicaciones, dron…)', 'Según lo que elija', 'servicios-sueltos'],
        ],
    ],
    [
        'id' => 'paginas-web',
        'titulo' => 'Páginas web y catálogo con WhatsApp',
        'resumen' => 'Paquetes Presencia y Empresa, catálogo de productos con botón de WhatsApp y los 20 diseños para elegir.',
        'enlace' => '/catalogo/',
        'promo' => 'Páginas web desde Bs 1.500.',
        'opciones' => [
            ['Página web Presencia', 'Bs 1.500', 'pagina-web'],
            ['Sitio web Empresa', 'Bs 4.990', 'pagina-web'],
            ['Catálogo con WhatsApp (adicional del paquete Empresa)', '+ Bs 2.390', 'catalogo-whatsapp'],
        ],
    ],
];
// Abre WhatsApp con el catálogo: para el cliente, o para alguien que lo reenviará a un conocido
if ($logged && isset($_GET['enviar_catalogo'])) {
    $cat = find_by_id(CATALOGOS, (string)$_GET['enviar_catalogo']);
    $tel = preg_replace('/\D/', '', (string)($_GET['tel'] ?? ''));
    if (strlen($tel) === 8) $tel = '591' . $tel;
    if ($cat && strlen($tel) >= 8) {
        $nombre = clean($_GET['nombre'] ?? '', 60);
        $hola = 'Hola' . ($nombre !== '' ? ' ' . $nombre : '') . ', te saluda SIBNOVA 👋';
        $url = SITE_URL . $cat['enlace'];
        $txt = ($_GET['modo'] ?? '') === 'referido'
            ? $hola . ' Gracias por recomendarnos. Te dejo nuestro catálogo de ' . mb_strtolower($cat['titulo']) . ' para que se lo reenvíes a quien quieras: ' . $url . "\n\n" . $cat['promo'] . ' Si tu conocido nos escribe a este número diciendo que va de tu parte, lo atendemos con mucho gusto.'
            : $hola . ' Te comparto nuestro catálogo de ' . mb_strtolower($cat['titulo']) . ': ' . $url . "\n\nAhí ves el precio de cada servicio por separado y los combos. " . $cat['promo'] . "\n\nCuando elijas, avísame y te envío un formulario corto con las preguntas de lo que elegiste para empezar.";
        header('Location: https://wa.me/' . $tel . '?text=' . rawurlencode($txt), true, 303);
        exit;
    }
}

/* ============================================================
   Interfaz del CRM (HTML sin JavaScript: la política de seguridad no permite scripts)
   ============================================================ */
const COLOR = [
    'Nueva solicitud' => '#4c8dff', 'Pendiente de revisión' => '#f5b700', 'Contactado' => '#22c3ee', 'Cotización enviada' => '#a78bfa',
    'En negociación' => '#fb923c', 'Aprobado' => '#34d399', 'En desarrollo' => '#2dd4bf', 'Entregado' => '#22c55e', 'Cancelado' => '#ef4444',
];
const NUEVAS = ['Nueva solicitud', 'Pendiente de revisión'];
const EN_PROCESO = ['Contactado', 'Cotización enviada', 'En negociación'];
const GANADAS = ['Aprobado', 'En desarrollo', 'Entregado'];

function badge(string $estado): string {
    return '<span class="badge" style="--c:' . (COLOR[$estado] ?? '#8e96a8') . '">' . h($estado) . '</span>';
}
function fecha(string $iso): string {
    $t = strtotime($iso);
    if (!$t) return h($iso);
    $m = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'][(int)date('n', $t) - 1];
    return date('j', $t) . ' ' . $m . ' ' . date('Y · H:i', $t);
}
// Clave de cliente: últimos 8 dígitos del teléfono (Bolivia) o el correo
function cliente_key(string $tel, string $correo): string {
    $d = preg_replace('/\D/', '', $tel);
    return strlen($d) >= 7 ? substr($d, -8) : strtolower(trim($correo));
}
function wa_link(string $tel): string {
    $d = preg_replace('/\D/', '', $tel);
    if (strlen($d) === 8) $d = '591' . $d;
    return 'https://wa.me/' . $d;
}
function kpi(string $label, string $value, string $sub = '', string $href = ''): string {
    $in = '<span class="k">' . h($label) . '</span><b>' . $value . '</b>' . ($sub ? '<small>' . $sub . '</small>' : '');
    return $href ? '<a class="stat" href="' . h($href) . '">' . $in . '</a>' : '<div class="stat">' . $in . '</div>';
}
function tamano(int $b): string { return $b < 1048576 ? max(1, (int)round($b / 1024)) . ' KB' : round($b / 1048576, 1) . ' MB'; }
function empty_state(string $t, string $d = ''): string { return '<div class="empty"><b>' . h($t) . '</b>' . ($d ? '<p>' . $d . '</p>' : '') . '</div>'; }

function page(string $title, string $body, string $active = '', bool $bare = false): never {
    global $tok;
    $nav = [['inicio', '/admin/', 'Inicio', 'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z'], ['clientes', '/admin/?clientes=1', 'Clientes', 'M16 19a4 4 0 0 0-8 0M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM20 19a3 3 0 0 0-3-3M17 11a2.5 2.5 0 1 0 0-5M4 19a3 3 0 0 1 3-3M7 11a2.5 2.5 0 1 1 0-5'],
        ['solicitudes', '/admin/?solicitudes=1', 'Solicitudes', 'M4 5h16v14H4zM4 9h16M8 13h5'], ['cotizaciones', '/admin/?cotizaciones=1', 'Cotizaciones', 'M7 3h10v18l-5-3-5 3zM10 8h4M10 12h4'], ['datos', '/admin/?datos=1', 'Datos recibidos', 'M12 3v12M7 10l5 5 5-5M4 21h16'],
        ['catalogos', '/admin/?catalogos=1', 'Catálogos', 'M4 4h7v16H4zM13 4h7v16h-7M6.5 8h2M15.5 8h2'], ['formularios', '/admin/?formularios=1', 'Formularios', 'M6 3h9l4 4v14H6zM14 3v5h5M9 13h7M9 17h5'], ['cuenta', '/admin/?cuenta=1', 'Cuenta', 'M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0']];
    $links = implode('', array_map(fn($n) => '<a href="' . $n[1] . '"' . ($n[0] === $active ? ' aria-current="page"' : '') . '><svg viewBox="0 0 24 24" aria-hidden="true"><path d="' . $n[3] . '"/></svg>' . $n[2] . '</a>', $nav));
    $side = $bare ? '' : '<aside class="side"><a class="brand" href="/admin/"><img src="/brand/sn-logo-256.webp" alt="" width="40" height="19"><span>SIBNOVA<small>CRM</small></span></a><nav>' . $links . '</nav>
        <form method="post" class="logout">' . $tok . '<input type="hidden" name="accion" value="salir"><button class="ghost sm">Salir</button></form><a class="site" href="/" target="_blank" rel="noopener">Ver sibnova.com.bo ↗</a></aside>';
    echo '<!doctype html><html lang="es-BO"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>' . h($title) . ' · CRM SIBNOVA</title><link rel="icon" href="/icon.png"><style>
:root{color-scheme:dark;--bg:#06070a;--panel:#0d1016;--panel2:#12161e;--line:#1e2430;--line2:#2a3242;--text:#e9edf5;--muted:#8a93a6;--blue:#2e7dff;--blue2:#7aa2ff}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font:15px/1.5 "Segoe UI",system-ui,-apple-system,Roboto,sans-serif}
a{color:var(--blue2);text-decoration:none}a:hover{text-decoration:underline}
.app{display:grid;grid-template-columns:minmax(0,1fr);min-height:100vh}@media(min-width:960px){.app{grid-template-columns:240px 1fr}}
.side{min-width:0;display:flex;flex-direction:column;gap:6px;padding:16px;border-right:1px solid var(--line);background:linear-gradient(180deg,#0a0d13,#07090d)}
@media(min-width:960px){.side{position:sticky;top:0;height:100vh}}
.brand{display:flex;align-items:center;gap:10px;padding:6px 8px 14px;color:var(--text);text-decoration:none!important}.brand img{background:#fff;border-radius:8px;padding:4px 6px;width:52px;height:auto}
.brand span{font-weight:700;letter-spacing:.04em}.brand small{display:block;font-size:.68rem;font-weight:600;color:var(--blue2);letter-spacing:.2em}
.side nav{display:flex;gap:4px;overflow-x:auto}@media(min-width:960px){.side nav{flex-direction:column;overflow:visible}}
.side nav a{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;color:var(--muted);font-weight:600;font-size:.92rem;white-space:nowrap;text-decoration:none}
.side nav a:hover{background:var(--panel2);color:var(--text)}.side nav a[aria-current]{background:rgba(46,125,255,.14);color:#fff;box-shadow:inset 3px 0 0 var(--blue)}
.side svg{width:18px;height:18px;flex:none;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
.logout{margin-top:auto}.site{font-size:.82rem;color:var(--muted);padding:4px 8px}@media(max-width:959px){.logout,.site{display:none}}
main{min-width:0;padding:24px clamp(16px,3vw,36px) 60px;max-width:1320px;width:100%}
.top{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:12px;margin-bottom:22px}
h1{font-size:1.6rem;margin:0;letter-spacing:-.02em}h2{font-size:1.05rem;margin:0 0 12px}.sub{color:var(--muted);margin:4px 0 0}
.card{background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:18px}
.grid{display:grid;gap:14px}@media(min-width:900px){.two{grid-template-columns:1fr 1fr}.main-side{grid-template-columns:1.6fr 1fr}}
.stats{display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));margin-bottom:18px}
.stat{display:grid;gap:2px;padding:16px;border-radius:16px;background:linear-gradient(160deg,var(--panel2),var(--panel));border:1px solid var(--line);color:var(--text);text-decoration:none!important}
a.stat:hover{border-color:var(--line2)}.stat .k{color:var(--muted);font-size:.82rem;font-weight:600}.stat b{font-size:1.7rem;letter-spacing:-.02em}.stat small{color:var(--muted);font-size:.82rem}
.board{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(220px,1fr);gap:12px;overflow-x:auto;padding-bottom:6px}
.col{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:12px;min-height:120px}
.col h3{display:flex;justify-content:space-between;align-items:center;margin:0 0 10px;font-size:.85rem;color:var(--muted)}.col h3 i{font-style:normal;background:var(--panel2);border-radius:999px;padding:1px 9px;color:var(--text)}
.col h3 span{display:flex;align-items:center;gap:8px}.dot{width:9px;height:9px;border-radius:50%;background:var(--c)}
.mini{display:block;padding:10px;border-radius:10px;background:var(--panel2);border:1px solid var(--line);margin-bottom:8px;color:var(--text);text-decoration:none!important}
.mini:hover{border-color:var(--line2)}.mini b{display:block;font-size:.88rem}.mini small{color:var(--muted);font-size:.78rem}
.badge{display:inline-flex;align-items:center;gap:6px;padding:3px 10px;border-radius:999px;font-size:.78rem;font-weight:600;white-space:nowrap;color:var(--c);background:color-mix(in srgb,var(--c) 14%,transparent);border:1px solid color-mix(in srgb,var(--c) 35%,transparent)}
.badge::before{content:"";width:6px;height:6px;border-radius:50%;background:var(--c)}
table{width:100%;border-collapse:collapse;font-size:.92rem}th,td{text-align:left;padding:12px 10px;border-bottom:1px solid var(--line);vertical-align:middle}
th{color:var(--muted);font-weight:600;font-size:.8rem;text-transform:uppercase;letter-spacing:.04em}tbody tr:hover{background:rgba(255,255,255,.02)}tbody tr:last-child td{border-bottom:0}
.scroll{overflow-x:auto}.muted{color:var(--muted)}.who b{display:block}.who small{color:var(--muted)}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px}.chip{display:inline-flex;gap:6px;align-items:center;padding:7px 12px;border-radius:999px;border:1px solid var(--line2);color:var(--muted);font-size:.85rem;font-weight:600;text-decoration:none!important}
.chip:hover{color:var(--text)}.chip[aria-current]{background:rgba(46,125,255,.16);border-color:var(--blue);color:#fff}.chip i{font-style:normal;opacity:.75}
input,select,textarea,button{font:inherit;color:inherit;background:var(--panel2);border:1px solid var(--line2);border-radius:10px;padding:10px 12px;min-height:42px}
input:focus,select:focus,textarea:focus{outline:none;border-color:var(--blue)}
button,.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;background:var(--blue);border:1px solid var(--blue);color:#fff;font-weight:600;cursor:pointer;border-radius:10px;padding:9px 14px;min-height:42px;text-decoration:none!important}
.ghost{background:transparent;border-color:var(--line2);color:var(--text)}.wa{background:#1fa855;border-color:#1fa855}.sm{min-height:36px;padding:6px 12px;font-size:.88rem}
form.inline{display:flex;flex-wrap:wrap;gap:8px;align-items:center}.search{display:flex;gap:8px;flex-wrap:wrap}.search input{min-width:240px}
dl{display:grid;grid-template-columns:minmax(130px,210px) 1fr;gap:8px 14px;margin:0}dt{color:var(--muted);font-size:.9rem}dd{margin:0;white-space:pre-wrap;word-break:break-word}
.sec{grid-column:1/-1;margin-top:10px;padding-top:12px;border-top:1px solid var(--line);color:var(--blue2);font-weight:700;font-size:.85rem;text-transform:uppercase;letter-spacing:.05em}
.sec:first-child{margin-top:0;padding-top:0;border-top:0}
.head-card{display:flex;flex-wrap:wrap;gap:14px;align-items:center;justify-content:space-between;margin-bottom:16px}
.head-card .id{font-family:ui-monospace,Consolas,monospace;color:var(--blue2);font-size:.85rem}.actions{display:flex;flex-wrap:wrap;gap:8px}
.files{list-style:none;margin:0;padding:0;display:grid;gap:8px}.files li{display:flex;justify-content:space-between;gap:10px;padding:10px 12px;border-radius:10px;background:var(--panel2);border:1px solid var(--line)}
.timeline{list-style:none;margin:0;padding:0 0 0 18px;border-left:2px solid var(--line2);display:grid;gap:14px}.timeline li{position:relative}
.timeline li::before{content:"";position:absolute;left:-25px;top:6px;width:10px;height:10px;border-radius:50%;background:var(--c,var(--blue));box-shadow:0 0 0 3px var(--bg)}
.timeline small{color:var(--muted)}.feed{list-style:none;margin:0;padding:0;display:grid;gap:10px}.feed li{display:flex;gap:10px;align-items:flex-start;padding-bottom:10px;border-bottom:1px solid var(--line)}
.feed li:last-child{border-bottom:0}.feed .dot{margin-top:7px;flex:none}.feed small{display:block;color:var(--muted)}
.msg{padding:12px 14px;border-radius:12px;background:rgba(245,183,0,.08);border:1px solid rgba(245,183,0,.3);margin-bottom:14px}
.warn{color:#ffd666}.empty{padding:28px;text-align:center;color:var(--muted);border:1px dashed var(--line2);border-radius:14px}.empty b{display:block;color:var(--text);margin-bottom:4px}
.forms{display:grid;gap:14px}@media(min-width:900px){.forms{grid-template-columns:1fr 1fr}}.forms .card{display:grid;gap:12px}.forms .url{font-family:ui-monospace,Consolas,monospace;font-size:.82rem;width:100%}
.auth{min-height:100vh;display:grid;place-items:center;padding:20px;background:radial-gradient(60% 60% at 50% 0%,rgba(46,125,255,.18),transparent 70%),var(--bg)}
.auth .card{width:min(100%,420px);display:grid;gap:14px;padding:28px}.auth .brand{justify-content:center}.auth label{display:grid;gap:6px;font-size:.9rem}
.swatch{display:inline-block;width:14px;height:14px;border-radius:4px;vertical-align:-2px;border:1px solid rgba(255,255,255,.2)}
</style></head><body>' . ($bare ? $body : '<div class="app">' . $side . '<main>' . $body . '</main></div>') . '</body></html>';
    exit;
}

$m = $msg ? '<p class="msg" role="alert">' . h($msg) . '</p>' : '';
$tok = '<input type="hidden" name="csrf" value="' . h($csrf) . '">';

/* ---------- Acceso ---------- */
if (!$logged) {
    $brand = '<a class="brand" href="/admin/"><img src="/brand/sn-logo-256.webp" alt="" width="52" height="25"><span>SIBNOVA<small>CRM</small></span></a>';
    if ($hash === null) {
        page('Activar', '<div class="auth"><form method="post" class="card">' . $brand . '<h1 style="text-align:center">Activar el CRM</h1>' . $m . $tok . '<input type="hidden" name="accion" value="crear">
        <label>Clave de activación<input name="token" required autocomplete="off"></label>
        <label>Nueva contraseña (12 caracteres o más)<input type="password" name="clave" required minlength="12" autocomplete="new-password"></label>
        <label>Repite la contraseña<input type="password" name="clave2" required minlength="12" autocomplete="new-password"></label>
        <button>Activar</button><p class="muted" style="margin:0;text-align:center">La clave de activación sirve una sola vez.</p></form></div>', '', true);
    }
    page('Ingresar', '<div class="auth"><form method="post" class="card">' . $brand . '<h1 style="text-align:center">Ingresar</h1><p class="sub" style="text-align:center;margin-top:-8px">Solicitudes, clientes y datos de proyectos</p>' . $m . $tok . '<input type="hidden" name="accion" value="entrar">
    <label>Contraseña<input type="password" name="clave" required autocomplete="current-password" autofocus></label><button>Entrar</button></form></div>', '', true);
}

/* ---------- Datos comunes ---------- */
$sols = db()->query('SELECT id, numero, creado, actualizado, estado, nombre, empresa, telefono, correo, diseno_nombre, paquete_nombre, precio_inicial FROM solicitudes ORDER BY id DESC')->fetchAll();
$ents = db()->query('SELECT e.id, e.numero, e.creado, e.titulo, e.nombre, e.empresa, e.telefono, e.correo, e.revisado, (SELECT COUNT(*) FROM entregas_archivos a WHERE a.entrega_id = e.id) n FROM entregas e ORDER BY e.id DESC')->fetchAll();
$porEstado = array_fill_keys($ESTADOS, []);
foreach ($sols as $s) $porEstado[$s['estado']][] = $s;
$suma = fn(array $estados) => array_sum(array_map(fn($s) => (int)$s['precio_inicial'], array_merge(...array_map(fn($e) => $porEstado[$e] ?? [], $estados))));
$cuenta = fn(array $estados) => array_sum(array_map(fn($e) => count($porEstado[$e] ?? []), $estados));
$cots = db()->query('SELECT id, clave, creado, actualizado, etapa, nombre, empresa, telefono, correo, proyecto, proforma, vigencia, monto, prioridad, proximo_seguimiento FROM cotizaciones ORDER BY actualizado DESC')->fetchAll();
$hoy = date('Y-m-d');
function etapa_badge(string $e): string { $x = ETAPAS_COT[$e] ?? [$e, '#8e96a8']; return '<span class="badge" style="--c:' . $x[1] . '">' . h($x[0]) . '</span>'; }
function fecha_corta(string $ymd): string { $t = strtotime($ymd); return $t ? date('j', $t) . ' ' . ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'][(int)date('n', $t) - 1] . ' ' . date('Y', $t) : '—'; }
// Enlace de WhatsApp al cliente con el mensaje de la proforma ya escrito
function wa_texto(string $tel, string $txt): string { return wa_link($tel) . ($txt !== '' ? '?text=' . rawurlencode($txt) : ''); }

/* ---------- Cotizaciones ---------- */
if (isset($_GET['cotizaciones'])) {
    $fe = (string)($_GET['etapa'] ?? '');
    $q = mb_strtolower(clean($_GET['q'] ?? '', 80));
    $lista = array_filter($cots, fn($c) => (!isset(ETAPAS_COT[$fe]) || $c['etapa'] === $fe) && ($q === '' || str_contains(mb_strtolower($c['nombre'] . ' ' . $c['empresa'] . ' ' . $c['proforma'] . ' ' . $c['proyecto']), $q)));
    $chips = '<a class="chip" href="/admin/?cotizaciones=1"' . ($fe === '' ? ' aria-current="page"' : '') . '>Todas <i>' . count($cots) . '</i></a>';
    foreach (ETAPAS_COT as $k => $x) $chips .= '<a class="chip" href="/admin/?cotizaciones=1&amp;etapa=' . $k . '"' . ($fe === $k ? ' aria-current="page"' : '') . '><span class="dot" style="--c:' . $x[1] . '"></span>' . h($x[0]) . ' <i>' . count(array_filter($cots, fn($c) => $c['etapa'] === $k)) . '</i></a>';
    $abiertas = array_filter($cots, fn($c) => in_array($c['etapa'], COT_ABIERTAS, true));
    $vencidas = array_filter($abiertas, fn($c) => $c['proximo_seguimiento'] !== '' && $c['proximo_seguimiento'] !== null && $c['proximo_seguimiento'] <= $hoy);
    $trs = '';
    foreach ($lista as $c) {
        $seg = $c['proximo_seguimiento'] ? (in_array($c['etapa'], COT_ABIERTAS, true) && $c['proximo_seguimiento'] <= $hoy ? '<span class="warn">' . fecha_corta($c['proximo_seguimiento']) . ' · toca hoy</span>' : fecha_corta($c['proximo_seguimiento'])) : '<span class="muted">—</span>';
        $trs .= '<tr><td><a class="who" href="/admin/?cot=' . (int)$c['id'] . '"><b>' . h($c['nombre']) . '</b><small>' . h($c['empresa'] ?: '—') . '</small></a></td><td>' . h($c['proyecto']) . '<br><small class="muted">' . h($c['proforma']) . '</small></td><td>' . bs((int)$c['monto']) . '</td><td>' . $seg . '</td><td class="muted">' . ($c['vigencia'] ? fecha_corta($c['vigencia']) : '—') . '</td><td>' . etapa_badge($c['etapa']) . '</td></tr>';
    }
    page('Cotizaciones', '<div class="top"><div><h1>Cotizaciones</h1><p class="sub">Las proformas que prepara el agente de cotización, con su PDF, etapa y seguimiento.</p></div>
    <form method="get" class="search"><input type="hidden" name="cotizaciones" value="1"><input name="q" value="' . h($q) . '" placeholder="Buscar cliente, proyecto o proforma"><button class="ghost">Buscar</button></form></div>
    <div class="stats">' . kpi('Abiertas', (string)count($abiertas), bs(array_sum(array_column($abiertas, 'monto'))) . ' en juego') . kpi('Seguimientos para hoy', (string)count($vencidas), 'Clientes a los que toca escribir') . kpi('Ganadas', (string)count(array_filter($cots, fn($c) => $c['etapa'] === 'ganado')), bs(array_sum(array_map(fn($c) => $c['etapa'] === 'ganado' ? (int)$c['monto'] : 0, $cots))) . ' vendidos') . '</div>
    <div class="chips">' . $chips . '</div>
    <div class="card scroll">' . ($trs ? '<table><thead><tr><th>Cliente</th><th>Proyecto y proforma</th><th>Monto</th><th>Próximo seguimiento</th><th>Vigencia</th><th>Etapa</th></tr></thead><tbody>' . $trs . '</tbody></table>' : empty_state('Todavía no hay cotizaciones', 'Aparecen cuando el agente de cotización termina una proforma.')) . '</div>', 'cotizaciones');
}

if (isset($_GET['cot'])) {
    $st = db()->prepare('SELECT * FROM cotizaciones WHERE id = ?');
    $st->execute([(int)$_GET['cot']]);
    $c = $st->fetch();
    if (!$c) go('?cotizaciones=1');
    $ops = json_decode($c['opciones'], true) ?: [];
    $otr = '';
    foreach ($ops as $o) $otr .= '<tr><td><b>' . h($o['nombre']) . '</b>' . (!empty($o['recomendada']) ? ' <span class="badge" style="--c:#2e7dff">Recomendada</span>' : '') . ($o['id'] === $c['opcion_elegida'] ? ' <span class="badge" style="--c:#22c55e">Elegida</span>' : '') . '</td><td>' . bs((int)$o['precio']) . '</td><td class="muted">' . h($o['semanas']) . ' semanas</td></tr>';
    $fa = db()->prepare('SELECT * FROM cotizaciones_archivos WHERE cotizacion_id = ? ORDER BY id DESC'); $fa->execute([$c['id']]);
    $pdfs = $fa->fetchAll();
    $files = '';
    foreach ($pdfs as $i => $f) $files .= '<li><span><a href="/admin/?archivo_cot=' . (int)$f['id'] . '">' . h($f['nombre']) . '</a>' . ($i === 0 ? ' <small class="muted">· la más reciente</small>' : '') . '<br><small class="muted">' . fecha($f['subido']) . '</small></span><span class="muted">' . tamano((int)$f['bytes']) . '</span></li>';
    $ac = db()->prepare('SELECT * FROM cotizaciones_actividad WHERE cotizacion_id = ? ORDER BY fecha DESC, id DESC'); $ac->execute([$c['id']]);
    $hist = '';
    foreach ($ac->fetchAll() as $x) $hist .= '<li><b>' . h($x['texto']) . '</b><br><small>' . fecha($x['fecha']) . '</small></li>';
    $opts = implode('', array_map(fn($k) => '<option value="' . $k . '"' . ($k === $c['etapa'] ? ' selected' : '') . '>' . h(ETAPAS_COT[$k][0]) . '</option>', array_keys(ETAPAS_COT)));
    $key = cliente_key((string)$c['telefono'], (string)$c['correo']);
    $tel = (string)$c['telefono'];
    $acciones = ($pdfs ? '<a class="btn" href="/admin/?archivo_cot=' . (int)$pdfs[0]['id'] . '">Descargar PDF</a>' : '')
        . ($tel !== '' ? '<a class="btn wa" href="' . h(wa_texto($tel, (string)$c['mensaje_cliente'])) . '" target="_blank" rel="noopener">Abrir WhatsApp con el mensaje</a>' : '')
        . '<a class="btn ghost" href="/admin/?cliente=' . h(rawurlencode($key)) . '">Ficha del cliente</a>';
    page($c['proforma'] ?: $c['nombre'], '<p><a href="/admin/?cotizaciones=1">← Cotizaciones</a></p>
    <div class="head-card"><div><span class="id">' . h($c['proforma'] ?: $c['clave']) . '</span><h1>' . h($c['nombre']) . ($c['empresa'] ? ' <span class="muted" style="font-weight:400">· ' . h($c['empresa']) . '</span>' : '') . '</h1><p class="sub">' . h($c['proyecto']) . ' · ' . etapa_badge($c['etapa']) . '</p></div><div class="actions">' . $acciones . '</div></div>
    <div class="stats">' . kpi('Monto de la propuesta', bs((int)$c['monto']), 'Opción recomendada') . kpi('Soporte mensual', $c['soporte_mensual'] ? bs((int)$c['soporte_mensual']) : '—') . kpi('Válida hasta', $c['vigencia'] ? fecha_corta($c['vigencia']) : '—', $c['vigencia'] && $c['vigencia'] < $hoy ? '<span class="warn">Vencida: renueva la proforma</span>' : '') . kpi('Prioridad', h($c['prioridad'] ?: '—'), h($c['origen'] ?: '')) . '</div>
    <div class="grid main-side"><div class="grid" style="align-content:start">
      <section class="card scroll"><h2>Opciones de la proforma</h2>' . ($otr ? '<table><tbody>' . $otr . '</tbody></table>' : '<p class="muted">Sin opciones registradas.</p>') . '</section>
      ' . (function () use ($c, $ops) {
        // Solo equipo: lo que le cuesta a SIBNOVA cada opción y la ganancia estimada al precio de la proforma
        $in = (json_decode((string)($c['interno'] ?? '{}'), true) ?: [])['opciones'] ?? [];
        if (!$in) return '<section class="card"><h2>Costo para SIBNOVA <span class="badge" style="--c:#f5b700">Solo equipo</span></h2><p class="muted" style="margin:0">El agente todavía no registró los costos de esta cotización.</p></section>';
        $trs = '';
        foreach ($ops as $o) {
            $x = $in[$o['id']] ?? null;
            if (!$x) continue;
            $gan = (int)$o['precio'] - $x['costo'];
            $pct = $o['precio'] > 0 ? round($gan / $o['precio'] * 100) : 0;
            $trs .= '<tr><td><b>' . h($o['nombre']) . '</b>' . (!empty($o['recomendada']) ? ' <small class="muted">· recomendada</small>' : '') . '<br><small class="muted">' . h($x['horas']) . '</small></td><td>' . bs((int)$o['precio']) . '</td><td><b>' . bs($x['costo']) . '</b><br><small class="muted">hasta ' . bs($x['costo_max']) . ' si se usan las horas máximas</small></td><td>' . bs($x['minimo']) . '</td><td class="' . ($gan > 0 ? '' : 'warn') . '"><b>' . bs($gan) . '</b><br><small class="muted">' . $pct . ' % del precio</small></td></tr>';
        }
        return '<section class="card scroll" style="border-color:rgba(245,183,0,.35)"><h2>Costo para SIBNOVA <span class="badge" style="--c:#f5b700">Solo equipo</span></h2><table><thead><tr><th>Opción</th><th>Precio al cliente</th><th>Te cuesta hacerlo</th><th>No bajar de</th><th>Ganancia estimada</th></tr></thead><tbody>' . $trs . '</tbody></table><p class="muted" style="margin:10px 0 0;font-size:.85rem">El costo incluye las horas del equipo y un margen para imprevistos. No incluye servicios de terceros sin monto confirmado. Nunca copies estos números al cliente.</p></section>';
      })() . '
      <section class="card"><h2>Resumen para el equipo</h2><p style="white-space:pre-wrap;margin:0">' . h($c['resumen_equipo'] ?: '—') . '</p></section>
      <section class="card"><h2>Mensaje para el cliente</h2><p style="white-space:pre-wrap;margin:0 0 12px">' . h($c['mensaje_cliente'] ?: '—') . '</p>' . ($tel !== '' ? '<a class="btn wa sm" href="' . h(wa_texto($tel, (string)$c['mensaje_cliente'])) . '" target="_blank" rel="noopener">Abrir WhatsApp de ' . h($c['nombre']) . ' con este mensaje</a><p class="muted" style="margin:8px 0 0;font-size:.85rem">Descarga el PDF y adjúntalo en WhatsApp con el clip → Documento.</p>' : '') . '</section>
      <section class="card"><h2>Datos del cliente</h2><dl><dt>WhatsApp</dt><dd>' . h($tel ?: '—') . '</dd><dt>Correo</dt><dd>' . h($c['correo'] ?: '—') . '</dd><dt>Ciudad</dt><dd>' . h($c['ciudad'] ?: '—') . '</dd><dt>Rubro</dt><dd>' . h($c['rubro'] ?: '—') . '</dd><dt>Carpeta local</dt><dd class="muted">sibnova-clientes\\' . h($c['clave']) . '</dd></dl></section>
    </div><div class="grid" style="align-content:start">
      <section class="card"><h2>Cambiar etapa</h2><form method="post" class="grid">' . $tok . '<input type="hidden" name="accion" value="cot_etapa"><input type="hidden" name="id" value="' . (int)$c['id'] . '"><select name="etapa">' . $opts . '</select><input name="nota" maxlength="500" placeholder="Nota (opcional): envié el PDF, pidió descuento…"><button>Guardar</button></form></section>
      <section class="card"><h2>Seguimiento</h2><form method="post" class="grid">' . $tok . '<input type="hidden" name="accion" value="cot_seguir"><input type="hidden" name="id" value="' . (int)$c['id'] . '"><label class="grid">Próximo seguimiento<input type="date" name="proximo" value="' . h((string)$c['proximo_seguimiento']) . '"></label><label class="grid">Notas<textarea name="notas" rows="4" maxlength="3000">' . h((string)$c['notas']) . '</textarea></label><button class="ghost">Guardar seguimiento</button></form></section>
      <section class="card"><h2>PDF de la proforma</h2>' . ($files ? '<ul class="files">' . $files . '</ul>' : '<p class="muted">El agente todavía no subió el PDF.</p>') . '</section>
      <section class="card"><h2>Actividad</h2>' . ($hist ? '<ul class="timeline">' . $hist . '</ul>' : '<p class="muted">Sin actividad.</p>') . '</section>
    </div></div>', 'cotizaciones');
}

/* ---------- Catálogos ---------- */
if (isset($_GET['catalogos'])) {
    try { $fs = formularios()['formularios']; } catch (Throwable $e) { $fs = []; }
    $cards = '';
    foreach (CATALOGOS as $cat) {
        $url = SITE_URL . $cat['enlace'];
        $rows = '';
        foreach ($cat['opciones'] as [$op, $precio, $fid]) {
            $fm = find_by_id($fs, $fid);
            $rows .= '<tr><td><b>' . h($op) . '</b><br><small class="muted">' . h($precio) . '</small></td><td>' . ($fm
                ? '<small class="muted">' . h($fm['titulo']) . '</small> · <a href="' . h(SITE_URL . '/datos-proyecto/?f=' . rawurlencode($fid)) . '" target="_blank" rel="noopener">ver ↗</a>'
                : '<span class="warn">Formulario aún no publicado</span>') . '</td><td>' . ($fm
                ? '<form method="get" class="inline" target="_blank"><input type="hidden" name="enviar" value="' . h($fid) . '"><input name="nombre" placeholder="Nombre" maxlength="60" style="width:120px"><input name="tel" required placeholder="WhatsApp" inputmode="tel" maxlength="20" style="width:130px"><button class="wa sm">Enviar formulario</button></form>'
                : '') . '</td></tr>';
        }
        $cards .= '<section class="card grid"><div><h2 style="margin:0">' . h($cat['titulo']) . '</h2><p class="sub">' . h($cat['resumen']) . '</p><span class="badge" style="--c:#34d399">' . h($cat['promo']) . '</span></div>
        <input class="url" readonly value="' . h($url) . '" aria-label="Enlace del catálogo" style="font-family:ui-monospace,Consolas,monospace;font-size:.82rem">
        <form method="get" class="inline" target="_blank"><input type="hidden" name="enviar_catalogo" value="' . h($cat['id']) . '"><input name="nombre" placeholder="Nombre" maxlength="60" style="flex:1;min-width:130px"><input name="tel" required placeholder="WhatsApp: 7xxxxxxx" inputmode="tel" maxlength="20" style="flex:1;min-width:140px"><select name="modo"><option value="cliente">Para el cliente</option><option value="referido">Para que lo reenvíe a un conocido</option></select><button class="wa">Enviar catálogo por WhatsApp</button></form>
        <p style="margin:0"><a href="' . h($url) . '" target="_blank" rel="noopener">Ver el catálogo como el cliente ↗</a>' . (!empty($cat['pdf']) ? ' · <a href="' . h(SITE_URL . $cat['pdf']) . '" target="_blank" rel="noopener">Descargar el PDF para adjuntarlo ↗</a>' : '') . '</p>
        <div class="scroll"><h3 style="margin:6px 0 0;font-size:.95rem">Cuando el cliente elija, envíale este formulario</h3><table><thead><tr><th>Lo que eligió</th><th>Formulario</th><th>Enviar</th></tr></thead><tbody>' . $rows . '</tbody></table></div></section>';
    }
    page('Catálogos', '<div class="top"><div><h1>Catálogos de servicios</h1><p class="sub">1) Envía el catálogo por WhatsApp al cliente, o a quien te recomienda para que lo reenvíe. 2) Cuando el cliente elija un combo o servicio, envíale el formulario de esa fila: sus respuestas llegan a «Datos recibidos».</p></div></div><div class="grid">' . $cards . '</div>', 'catalogos');
}

/* ---------- Formularios ---------- */
if (isset($_GET['formularios'])) {
    try { $fs = formularios()['formularios']; } catch (Throwable $e) { $fs = []; }
    $cards = '';
    foreach ($fs as $fm) {
        $url = SITE_URL . '/datos-proyecto/?f=' . rawurlencode($fm['id']);
        $n = count(array_filter($ents, fn($e) => $e['titulo'] === $fm['titulo']));
        $cards .= '<section class="card"><div><h2 style="margin:0">' . h($fm['titulo']) . '</h2><p class="sub">' . h($fm['resumen']) . '</p><small class="muted">' . $n . ' envío' . ($n === 1 ? '' : 's') . ' recibido' . ($n === 1 ? '' : 's') . '</small></div>
        <input class="url" readonly value="' . h($url) . '" aria-label="Enlace del formulario">
        <form method="get" class="inline" target="_blank"><input type="hidden" name="enviar" value="' . h($fm['id']) . '"><input name="nombre" placeholder="Nombre del cliente" maxlength="60" style="flex:1;min-width:140px"><input name="tel" required placeholder="WhatsApp: 7xxxxxxx" inputmode="tel" maxlength="20" style="flex:1;min-width:140px"><button class="wa">Enviar por WhatsApp</button></form>
        <a href="' . h($url) . '" target="_blank" rel="noopener">Ver el formulario como el cliente ↗</a></section>';
    }
    page('Formularios', '<div class="top"><div><h1>Formularios para clientes</h1><p class="sub">Escribe el WhatsApp del cliente y pulsa «Enviar por WhatsApp»: se abre el chat con el mensaje y el enlace listos. Las respuestas llegan a «Datos recibidos». ¿Necesitas otro formulario? Pídeselo a Claude.</p></div></div><div class="forms">' . ($cards ?: empty_state('No hay formularios publicados')) . '</div>', 'formularios');
}

/* ---------- Detalle de datos recibidos ---------- */
if (isset($_GET['entrega'])) {
    $st = db()->prepare('SELECT * FROM entregas WHERE id = ?');
    $st->execute([(int)$_GET['entrega']]);
    $e = $st->fetch();
    if (!$e) go('?datos=1');
    $d = json_decode($e['datos'], true) ?: [];
    try { $def = find_by_id(formularios()['formularios'], $e['formulario']); } catch (Throwable $x) { $def = null; }
    $rows = ''; $sec = '';
    foreach (($def['campos'] ?? []) as $c) {
        if ($c['type'] === 'file') continue;
        $v = $d[$c['name']] ?? '';
        if ($v === '' || $v === []) continue;
        if ($c['seccion'] !== $sec) { $sec = $c['seccion']; $rows .= '<div class="sec">' . h($sec) . '</div>'; }
        $val = $c['type'] === 'colors'
            ? implode(' ', array_map(fn($x) => '<span class="swatch" style="background:' . h($x) . '"></span> ' . h($x) . ' ', (array)$v))
            : h(is_array($v) ? implode(', ', $v) : (string)$v);
        $rows .= '<dt>' . h($c['label']) . '</dt><dd>' . $val . '</dd>';
    }
    $fa = db()->prepare('SELECT * FROM entregas_archivos WHERE entrega_id = ? ORDER BY campo, id'); $fa->execute([$e['id']]);
    $files = '';
    foreach ($fa->fetchAll() as $f) $files .= '<li><span><small class="muted">' . h($f['campo']) . '</small><br><a href="/admin/?archivo_dp=' . (int)$f['id'] . '">' . h($f['nombre']) . '</a></span><span class="muted">' . tamano((int)$f['bytes']) . '</span></li>';
    $wa = !empty($d['archivos_whatsapp']) ? '<p class="warn" style="margin:12px 0 0"><b>Enviados por WhatsApp (revisa el chat):</b> ' . h(implode('; ', (array)$d['archivos_whatsapp'])) . '</p>' : '';
    $key = cliente_key((string)$e['telefono'], (string)$e['correo']);
    page($e['numero'], '<p><a href="/admin/?datos=1">← Datos recibidos</a></p>
    <div class="head-card"><div><span class="id">' . h($e['numero']) . '</span><h1>' . h($e['nombre']) . ($e['empresa'] ? ' <span class="muted" style="font-weight:400">· ' . h($e['empresa']) . '</span>' : '') . '</h1><p class="sub">' . h($e['titulo']) . ' · ' . fecha($e['creado']) . ' · ' . badge($e['revisado'] ? 'Entregado' : 'Nueva solicitud') . '</p></div>
    <div class="actions"><a class="btn" href="/admin/?brief_dp=' . (int)$e['id'] . '">Descargar para Claude</a>' . ($e['telefono'] ? '<a class="btn wa" href="' . h(wa_link((string)$e['telefono'])) . '" target="_blank" rel="noopener">WhatsApp</a>' : '') . '<a class="btn ghost" href="/admin/?cliente=' . h(rawurlencode($key)) . '">Ficha del cliente</a>
    <form method="post">' . $tok . '<input type="hidden" name="accion" value="revisado"><input type="hidden" name="id" value="' . (int)$e['id'] . '"><button class="ghost">' . ($e['revisado'] ? 'Marcar como pendiente' : 'Marcar como revisado') . '</button></form></div></div>
    <div class="grid main-side"><section class="card"><h2>Datos del formulario</h2><dl>' . ($rows ?: '<dd class="muted">Sin datos.</dd>') . '</dl></section>
    <section class="card"><h2>Archivos</h2>' . ($files ? '<ul class="files">' . $files . '</ul>' : '<p class="muted">Sin archivos adjuntos.</p>') . $wa . '</section></div>', 'datos');
}

/* ---------- Lista de datos recibidos ---------- */
if (isset($_GET['datos'])) {
    $trs = '';
    foreach ($ents as $e) $trs .= '<tr><td><a href="/admin/?entrega=' . (int)$e['id'] . '" class="who"><b>' . h($e['nombre']) . '</b><small>' . h($e['empresa'] ?: $e['numero']) . '</small></a></td><td>' . h($e['titulo']) . '</td><td class="muted">' . fecha($e['creado']) . '</td><td>' . (int)$e['n'] . '</td><td>' . ($e['revisado'] ? badge('Entregado') : badge('Nueva solicitud')) . '</td></tr>';
    $sin = count(array_filter($ents, fn($e) => !$e['revisado']));
    page('Datos recibidos', '<div class="top"><div><h1>Datos recibidos</h1><p class="sub">Lo que tus clientes envían desde los formularios de datos. ' . $sin . ' sin revisar.</p></div><a class="btn" href="/admin/?formularios=1">Enviar un formulario</a></div>
    <div class="card scroll">' . ($trs ? '<table><thead><tr><th>Cliente</th><th>Formulario</th><th>Recibido</th><th>Archivos</th><th>Estado</th></tr></thead><tbody>' . $trs . '</tbody></table>' : empty_state('Todavía no hay datos recibidos', 'Envía un formulario a tu cliente desde «Formularios».')) . '</div>', 'datos');
}

/* ---------- Cuenta ---------- */
if (isset($_GET['cuenta'])) {
    page('Cuenta', '<div class="top"><div><h1>Cuenta</h1><p class="sub">Cambia la contraseña de acceso al CRM.</p></div></div>' . $m . '<form method="post" class="card grid" style="max-width:460px">' . $tok . '<input type="hidden" name="accion" value="clave">
    <label class="grid">Contraseña actual<input type="password" name="actual" required autocomplete="current-password"></label>
    <label class="grid">Nueva contraseña (12 caracteres o más)<input type="password" name="clave" required minlength="12" autocomplete="new-password"></label>
    <label class="grid">Repite la nueva<input type="password" name="clave2" required minlength="12" autocomplete="new-password"></label><button>Guardar contraseña</button></form>
    <section class="card grid" style="max-width:460px;margin-top:14px"><h2 style="margin:0">Agente de cotización</h2>' . (setting('agente_apagado') === '1'
        ? '<p style="margin:0">Estado: ' . etapa_badge('perdido') . ' <b>Apagado</b>. El agente no puede registrar cotizaciones.</p>'
        : '<p style="margin:0">Estado: ' . etapa_badge('ganado') . ' <b>Encendido</b>. El agente registra aquí cada proforma que prepara, con su PDF.</p>') . '
    <p class="muted" style="margin:0;font-size:.88rem">Usa una llave propia guardada solo en la computadora de SIBNOVA. No conoce tu contraseña ni puede ver ni cambiar solicitudes, formularios o tu cuenta.</p>
    <form method="post">' . $tok . '<input type="hidden" name="accion" value="agente"><button class="ghost">' . (setting('agente_apagado') === '1' ? 'Encender el acceso del agente' : 'Apagar el acceso del agente') . '</button></form></section>', 'cuenta');
}

/* ---------- Detalle de solicitud ---------- */
if (isset($_GET['ver'])) {
    $st = db()->prepare('SELECT * FROM solicitudes WHERE id = ?');
    $st->execute([(int)$_GET['ver']]);
    $s = $st->fetch();
    if (!$s) go('?solicitudes=1');
    $d = json_decode($s['datos'], true) ?: [];
    $grupos = ['Cliente' => ['nombre', 'empresa', 'nit', 'cargo', 'correo', 'telefono', 'ciudad', 'pais'], 'Negocio' => ['nombre_comercial', 'rubro', 'descripcion', 'servicios', 'publico', 'objetivos'],
        'Diseño' => ['colores', 'logo', 'manual', 'referencias', 'cambios'], 'Proyecto' => ['catalogo', 'productos', 'dominio', 'hosting', 'adicionales', 'fecha_entrega', 'presupuesto', 'aprobador', 'observaciones', 'archivos_whatsapp']];
    $labels = solicitud_labels(); $rows = '';
    foreach ($grupos as $g => $keys) {
        $part = '';
        foreach ($keys as $k) if (($d[$k] ?? '') !== '' && ($d[$k] ?? '') !== 'no') $part .= '<dt>' . h($labels[$k]) . '</dt><dd' . ($k === 'archivos_whatsapp' ? ' class="warn"' : '') . '>' . h((string)$d[$k]) . '</dd>';
        if ($part) $rows .= '<div class="sec">' . $g . '</div>' . $part;
    }
    $fn = array_map(fn($x) => h($FUNC[$x] ?? $x), json_decode($s['funciones'], true) ?: []);
    $fa = db()->prepare('SELECT * FROM archivos WHERE solicitud_id = ?'); $fa->execute([$s['id']]);
    $files = '';
    foreach ($fa->fetchAll() as $f) $files .= '<li><a href="/admin/?archivo=' . (int)$f['id'] . '">' . h($f['nombre']) . '</a><span class="muted">' . tamano((int)$f['bytes']) . '</span></li>';
    $hi = db()->prepare('SELECT * FROM historial WHERE solicitud_id = ? ORDER BY id DESC'); $hi->execute([$s['id']]);
    $hist = '';
    foreach ($hi->fetchAll() as $x) $hist .= '<li style="--c:' . (COLOR[$x['estado']] ?? '#8e96a8') . '"><b>' . h($x['estado']) . '</b><br><small>' . fecha($x['fecha']) . '</small>' . ($x['nota'] ? '<p style="margin:4px 0 0">' . h($x['nota']) . '</p>' : '') . '</li>';
    $opts = implode('', array_map(fn($e) => '<option' . ($e === $s['estado'] ? ' selected' : '') . '>' . h($e) . '</option>', $ESTADOS));
    $key = cliente_key((string)$s['telefono'], (string)$s['correo']);
    page($s['numero'], '<p><a href="/admin/?solicitudes=1">← Solicitudes</a></p>
    <div class="head-card"><div><span class="id">' . h($s['numero']) . '</span><h1>' . h($s['nombre']) . ($s['empresa'] ? ' <span class="muted" style="font-weight:400">· ' . h($s['empresa']) . '</span>' : '') . '</h1><p class="sub">' . fecha($s['creado']) . ' · ' . badge($s['estado']) . '</p></div>
    <div class="actions"><a class="btn" href="/admin/?brief_sw=' . (int)$s['id'] . '">Descargar para Claude</a><a class="btn wa" href="' . h(wa_link((string)$s['telefono'])) . '" target="_blank" rel="noopener">WhatsApp</a><a class="btn ghost" href="/admin/?cliente=' . h(rawurlencode($key)) . '">Ficha del cliente</a></div></div>
    <div class="stats">' . kpi('Paquete', h($s['paquete_nombre']), 'Precio de referencia ' . bs((int)$s['precio_inicial'])) . kpi('Diseño elegido', h($s['diseno_nombre'])) . kpi('Funciones pedidas', (string)count($fn), $fn ? implode(', ', $fn) : 'Ninguna') . '</div>
    <div class="grid main-side"><section class="card"><h2>Información de la solicitud</h2><dl>' . $rows . '</dl></section>
    <div class="grid" style="align-content:start"><section class="card"><h2>Cambiar estado</h2><form method="post" class="grid">' . $tok . '<input type="hidden" name="accion" value="estado"><input type="hidden" name="id" value="' . (int)$s['id'] . '"><select name="estado">' . $opts . '</select><input name="nota" maxlength="500" placeholder="Nota (opcional): llamé, envié proforma…"><button>Guardar</button></form></section>
    <section class="card"><h2>Archivos</h2>' . ($files ? '<ul class="files">' . $files . '</ul>' : '<p class="muted">Sin archivos adjuntos.</p>') . '</section>
    <section class="card"><h2>Historial</h2><ul class="timeline">' . $hist . '</ul></section></div></div>', 'solicitudes');
}

/* ---------- Ficha de cliente ---------- */
if (isset($_GET['cliente'])) {
    $key = (string)$_GET['cliente'];
    $mis = array_values(array_filter($sols, fn($s) => cliente_key((string)$s['telefono'], (string)$s['correo']) === $key));
    $misE = array_values(array_filter($ents, fn($e) => cliente_key((string)$e['telefono'], (string)$e['correo']) === $key));
    $misC = array_values(array_filter($cots, fn($c) => cliente_key((string)$c['telefono'], (string)$c['correo']) === $key));
    if (!$mis && !$misE && !$misC) go('?clientes=1');
    $ref = $mis[0] ?? $misE[0] ?? $misC[0];
    $items = [];
    foreach ($misC as $c) $items[] = [$c['creado'], '<tr><td><a href="/admin/?cot=' . (int)$c['id'] . '">' . h($c['proforma'] ?: $c['clave']) . '</a></td><td>Cotización · ' . h($c['proyecto']) . ' · ' . bs((int)$c['monto']) . '</td><td class="muted">' . fecha($c['creado']) . '</td><td>' . etapa_badge($c['etapa']) . '</td></tr>'];
    foreach ($mis as $s) $items[] = [$s['creado'], '<tr><td><a href="/admin/?ver=' . (int)$s['id'] . '">' . h($s['numero']) . '</a></td><td>Solicitud · ' . h($s['paquete_nombre']) . '</td><td class="muted">' . fecha($s['creado']) . '</td><td>' . badge($s['estado']) . '</td></tr>'];
    foreach ($misE as $e) $items[] = [$e['creado'], '<tr><td><a href="/admin/?entrega=' . (int)$e['id'] . '">' . h($e['numero']) . '</a></td><td>' . h($e['titulo']) . '</td><td class="muted">' . fecha($e['creado']) . '</td><td>' . badge($e['revisado'] ? 'Entregado' : 'Nueva solicitud') . '</td></tr>'];
    usort($items, fn($a, $b) => strcmp($b[0], $a[0]));
    $valor = array_sum(array_map(fn($s) => in_array($s['estado'], GANADAS, true) ? (int)$s['precio_inicial'] : 0, $mis)) + array_sum(array_map(fn($c) => $c['etapa'] === 'ganado' ? (int)$c['monto'] : 0, $misC));
    page($ref['nombre'], '<p><a href="/admin/?clientes=1">← Clientes</a></p>
    <div class="head-card"><div><h1>' . h($ref['nombre']) . '</h1><p class="sub">' . h($ref['empresa'] ?: 'Sin empresa') . ' · ' . h($ref['telefono'] ?: '—') . ($ref['correo'] ? ' · <a href="mailto:' . h($ref['correo']) . '">' . h($ref['correo']) . '</a>' : '') . '</p></div>
    <div class="actions">' . ($ref['telefono'] ? '<a class="btn wa" href="' . h(wa_link((string)$ref['telefono'])) . '" target="_blank" rel="noopener">Escribir por WhatsApp</a>' : '') . '<a class="btn ghost" href="/admin/?formularios=1">Enviarle un formulario</a></div></div>
    <div class="stats">' . kpi('Solicitudes', (string)count($mis)) . kpi('Cotizaciones', (string)count($misC)) . kpi('Formularios enviados', (string)count($misE)) . kpi('Ventas ganadas', bs($valor), 'Aprobadas o ganadas') . '</div>
    <section class="card scroll"><h2>Todo lo de este cliente</h2><table><thead><tr><th>Número</th><th>Qué es</th><th>Fecha</th><th>Estado</th></tr></thead><tbody>' . implode('', array_column($items, 1)) . '</tbody></table></section>', 'clientes');
}

/* ---------- Lista de clientes ---------- */
if (isset($_GET['clientes'])) {
    $cl = [];
    foreach ($sols as $s) { $k = cliente_key((string)$s['telefono'], (string)$s['correo']); $cl[$k] ??= ['n' => $s['nombre'], 'emp' => $s['empresa'], 'tel' => $s['telefono'], 'mail' => $s['correo'], 's' => 0, 'e' => 0, 'ult' => '', 'estado' => $s['estado']]; $cl[$k]['s']++; $cl[$k]['ult'] = max($cl[$k]['ult'], $s['creado']); }
    foreach ($ents as $e) { $k = cliente_key((string)$e['telefono'], (string)$e['correo']); $cl[$k] ??= ['n' => $e['nombre'], 'emp' => $e['empresa'], 'tel' => $e['telefono'], 'mail' => $e['correo'], 's' => 0, 'e' => 0, 'ult' => '', 'estado' => '']; $cl[$k]['e']++; $cl[$k]['ult'] = max($cl[$k]['ult'], $e['creado']); }
    foreach ($cots as $c) { $k = cliente_key((string)$c['telefono'], (string)$c['correo']); $cl[$k] ??= ['n' => $c['nombre'], 'emp' => $c['empresa'], 'tel' => $c['telefono'], 'mail' => $c['correo'], 's' => 0, 'e' => 0, 'ult' => '', 'estado' => '']; $cl[$k]['s']++; $cl[$k]['ult'] = max($cl[$k]['ult'], $c['creado']); $cl[$k]['cot'] ??= $c['etapa']; }
    $q = mb_strtolower(clean($_GET['q'] ?? '', 80));
    if ($q !== '') $cl = array_filter($cl, fn($c) => str_contains(mb_strtolower($c['n'] . ' ' . $c['emp'] . ' ' . $c['tel'] . ' ' . $c['mail']), $q));
    uasort($cl, fn($a, $b) => strcmp($b['ult'], $a['ult']));
    $trs = '';
    foreach ($cl as $k => $c) $trs .= '<tr><td><a class="who" href="/admin/?cliente=' . h(rawurlencode((string)$k)) . '"><b>' . h($c['n']) . '</b><small>' . h($c['emp'] ?: '—') . '</small></a></td><td>' . h($c['tel']) . '<br><small class="muted">' . h($c['mail']) . '</small></td><td>' . $c['s'] . '</td><td>' . $c['e'] . '</td><td class="muted">' . fecha($c['ult']) . '</td><td>' . ($c['estado'] ? badge($c['estado']) : (isset($c['cot']) ? etapa_badge($c['cot']) : '<span class="muted">Solo formularios</span>')) . '</td></tr>';
    page('Clientes', '<div class="top"><div><h1>Clientes</h1><p class="sub">Cada cliente con todas sus solicitudes y formularios. Se agrupan por teléfono o correo.</p></div>
    <form method="get" class="search"><input type="hidden" name="clientes" value="1"><input name="q" value="' . h($q) . '" placeholder="Buscar nombre, empresa, teléfono o correo"><button class="ghost">Buscar</button></form></div>
    <div class="card scroll">' . ($trs ? '<table><thead><tr><th>Cliente</th><th>Contacto</th><th>Solicitudes y cotizaciones</th><th>Formularios</th><th>Último contacto</th><th>Estado actual</th></tr></thead><tbody>' . $trs . '</tbody></table>' : empty_state('Todavía no hay clientes', 'Aparecen cuando alguien envía una solicitud o un formulario.')) . '</div>', 'clientes');
}

/* ---------- Lista de solicitudes ---------- */
if (isset($_GET['solicitudes'])) {
    $fe = (string)($_GET['estado'] ?? '');
    $q = mb_strtolower(clean($_GET['q'] ?? '', 80));
    $lista = array_filter($sols, fn($s) => (!in_array($fe, $ESTADOS, true) || $s['estado'] === $fe) && ($q === '' || str_contains(mb_strtolower($s['numero'] . ' ' . $s['nombre'] . ' ' . $s['empresa']), $q)));
    $chips = '<a class="chip" href="/admin/?solicitudes=1"' . ($fe === '' ? ' aria-current="page"' : '') . '>Todas <i>' . count($sols) . '</i></a>';
    foreach ($ESTADOS as $e) $chips .= '<a class="chip" href="/admin/?solicitudes=1&amp;estado=' . rawurlencode($e) . '"' . ($fe === $e ? ' aria-current="page"' : '') . '><span class="dot" style="--c:' . COLOR[$e] . '"></span>' . h($e) . ' <i>' . count($porEstado[$e]) . '</i></a>';
    $trs = '';
    foreach ($lista as $s) $trs .= '<tr><td><a class="who" href="/admin/?ver=' . (int)$s['id'] . '"><b>' . h($s['nombre']) . '</b><small>' . h($s['empresa'] ?: $s['numero']) . '</small></a></td><td>' . h($s['paquete_nombre']) . '<br><small class="muted">' . h($s['diseno_nombre']) . '</small></td><td>' . bs((int)$s['precio_inicial']) . '</td><td class="muted">' . fecha($s['creado']) . '</td><td>' . badge($s['estado']) . '</td></tr>';
    page('Solicitudes', '<div class="top"><div><h1>Solicitudes</h1><p class="sub">Pedidos de páginas web y proyectos que llegan desde el catálogo.</p></div>
    <form method="get" class="search"><input type="hidden" name="solicitudes" value="1">' . ($fe !== '' ? '<input type="hidden" name="estado" value="' . h($fe) . '">' : '') . '<input name="q" value="' . h($q) . '" placeholder="Buscar número, nombre o empresa"><button class="ghost">Buscar</button></form></div>
    <div class="chips">' . $chips . '</div>
    <div class="card scroll">' . ($trs ? '<table><thead><tr><th>Cliente</th><th>Paquete y diseño</th><th>Referencia</th><th>Recibida</th><th>Estado</th></tr></thead><tbody>' . $trs . '</tbody></table>' : empty_state('No hay solicitudes con este filtro')) . '</div>', 'solicitudes');
}

/* ---------- Inicio: panel ---------- */
$mes = date('Y-m');
$delMes = count(array_filter($sols, fn($s) => str_starts_with($s['creado'], $mes)));
$sinRevisar = count(array_filter($ents, fn($e) => !$e['revisado']));
$stats = kpi('Solicitudes nuevas', (string)$cuenta(NUEVAS), 'Por atender', '/admin/?solicitudes=1&estado=' . rawurlencode('Nueva solicitud'))
    . kpi('En proceso', (string)$cuenta(EN_PROCESO), bs($suma(EN_PROCESO)) . ' en juego')
    . kpi('Ganadas', (string)$cuenta(GANADAS), bs($suma(GANADAS)) . ' en ventas')
    . kpi('Cotizaciones abiertas', (string)count(array_filter($cots, fn($c) => in_array($c['etapa'], COT_ABIERTAS, true))), count(array_filter($cots, fn($c) => in_array($c['etapa'], COT_ABIERTAS, true) && $c['proximo_seguimiento'] && $c['proximo_seguimiento'] <= $hoy)) . ' seguimientos para hoy', '/admin/?cotizaciones=1')
    . kpi('Datos sin revisar', (string)$sinRevisar, 'De formularios de clientes', '/admin/?datos=1')
    . kpi('Este mes', (string)$delMes, 'Solicitudes recibidas');
$cols = '';
foreach (array_diff($ESTADOS, ['Cancelado']) as $e) {
    $cards = '';
    foreach (array_slice($porEstado[$e], 0, 6) as $s) $cards .= '<a class="mini" href="/admin/?ver=' . (int)$s['id'] . '"><b>' . h($s['nombre']) . '</b><small>' . h($s['paquete_nombre']) . ' · ' . bs((int)$s['precio_inicial']) . '</small></a>';
    $more = count($porEstado[$e]) > 6 ? '<a class="muted" href="/admin/?solicitudes=1&amp;estado=' . rawurlencode($e) . '">Ver las ' . count($porEstado[$e]) . ' →</a>' : '';
    $cols .= '<div class="col"><h3><span><span class="dot" style="--c:' . COLOR[$e] . '"></span>' . h($e) . '</span><i>' . count($porEstado[$e]) . '</i></h3>' . ($cards ?: '<small class="muted">Sin solicitudes</small>') . $more . '</div>';
}
$feed = [];
foreach (db()->query('SELECT h.fecha, h.estado, h.nota, s.id, s.nombre, s.numero FROM historial h JOIN solicitudes s ON s.id = h.solicitud_id ORDER BY h.id DESC LIMIT 12') as $x)
    $feed[] = [$x['fecha'], '<li><span class="dot" style="--c:' . (COLOR[$x['estado']] ?? '#8e96a8') . '"></span><div><a href="/admin/?ver=' . (int)$x['id'] . '">' . h($x['nombre']) . '</a> · ' . h($x['estado']) . ($x['nota'] ? ' — ' . h($x['nota']) : '') . '<small>' . fecha($x['fecha']) . '</small></div></li>'];
foreach (db()->query('SELECT a.fecha, a.texto, c.id, c.nombre FROM cotizaciones_actividad a JOIN cotizaciones c ON c.id = a.cotizacion_id ORDER BY a.fecha DESC LIMIT 12') as $x)
    $feed[] = [$x['fecha'], '<li><span class="dot" style="--c:#a78bfa"></span><div><a href="/admin/?cot=' . (int)$x['id'] . '">' . h($x['nombre']) . '</a> · ' . h($x['texto']) . '<small>' . fecha($x['fecha']) . '</small></div></li>'];
foreach (array_slice($ents, 0, 12) as $e) $feed[] = [$e['creado'], '<li><span class="dot" style="--c:#7aa2ff"></span><div><a href="/admin/?entrega=' . (int)$e['id'] . '">' . h($e['nombre']) . '</a> envió «' . h($e['titulo']) . '»<small>' . fecha($e['creado']) . '</small></div></li>'];
usort($feed, fn($a, $b) => strcmp($b[0], $a[0]));
$feedHtml = implode('', array_column(array_slice($feed, 0, 12), 1));
page('Inicio', '<div class="top"><div><h1>Hola, equipo SIBNOVA</h1><p class="sub">Resumen de solicitudes, clientes y datos de proyectos.</p></div><div class="actions"><a class="btn" href="/admin/?formularios=1">Enviar un formulario</a><a class="btn ghost" href="/catalogo/" target="_blank" rel="noopener">Ver catálogo ↗</a></div></div>
' . $m . '<div class="stats">' . $stats . '</div>
<section style="margin-bottom:18px"><h2>Embudo de ventas</h2><div class="board">' . $cols . '</div></section>
<div class="grid two"><section class="card"><h2>Actividad reciente</h2>' . ($feedHtml ? '<ul class="feed">' . $feedHtml . '</ul>' : empty_state('Sin actividad todavía')) . '</section>
<section class="card"><h2>Accesos rápidos</h2><ul class="feed">
<li><span class="dot" style="--c:#34d399"></span><div><a href="/admin/?catalogos=1">Enviar un catálogo de servicios</a><small>Redes sociales y páginas web, con el formulario de cada combo</small></div></li>
<li><span class="dot" style="--c:#1fa855"></span><div><a href="/admin/?formularios=1">Enviar un formulario a un cliente</a><small>Página web, logo, redes, apps, IA o automatización</small></div></li>
<li><span class="dot" style="--c:#4c8dff"></span><div><a href="/admin/?solicitudes=1&amp;estado=' . rawurlencode('Nueva solicitud') . '">Atender solicitudes nuevas</a><small>' . $cuenta(NUEVAS) . ' por atender</small></div></li>
<li><span class="dot" style="--c:#a78bfa"></span><div><a href="/admin/?clientes=1">Ver todos los clientes</a><small>Historial completo de cada cliente</small></div></li>
<li><span class="dot" style="--c:#f5b700"></span><div><a href="/diagnostico/" target="_blank" rel="noopener">Abrir el diagnóstico gratuito ↗</a><small>Para compartir con prospectos</small></div></li>
</ul></section></div>', 'inicio');
