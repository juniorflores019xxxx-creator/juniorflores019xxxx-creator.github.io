<?php
// Bandeja de solicitudes de SIBNOVA: solo para el equipo, protegida con clave.
declare(strict_types=1);
require dirname(__DIR__) . '/api/_lib.php';

$https = ($_SERVER['HTTPS'] ?? '') === 'on' || ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https';
header("Content-Security-Policy: default-src 'none'; style-src 'unsafe-inline'; img-src 'self'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'");
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

function page(string $title, string $body): never {
    echo '<!doctype html><html lang="es-BO"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>' . h($title) . ' · SIBNOVA</title><style>
    :root{color-scheme:dark}*{box-sizing:border-box}body{margin:0;background:#050609;color:#f5f7fb;font:15px/1.55 system-ui,-apple-system,"Segoe UI",sans-serif}
    a{color:#779eff}.wrap{max-width:1180px;margin:0 auto;padding:24px 16px}header{display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid #1d2130}
    h1{font-size:1.5rem;margin:0 0 16px}h2{font-size:1.1rem;margin:24px 0 10px}.card{background:#0b0d12;border:1px solid #1d2130;border-radius:14px;padding:18px}
    table{width:100%;border-collapse:collapse;font-size:.92rem}th,td{text-align:left;padding:10px;border-bottom:1px solid #1d2130;vertical-align:top}th{color:#8e96a8;font-weight:600}
    .scroll{overflow-x:auto}input,select,textarea,button{font:inherit;color:inherit;background:#11141b;border:1px solid #2a3040;border-radius:10px;padding:10px 12px;min-height:44px}
    button{background:#1c64e6;border-color:#1c64e6;color:#fff;font-weight:600;cursor:pointer}.ghost{background:transparent;border-color:#2a3040}
    form.inline{display:flex;flex-wrap:wrap;gap:8px;align-items:center}.grid{display:grid;gap:10px}@media(min-width:800px){.two{grid-template-columns:1fr 1fr}}
    dl{display:grid;grid-template-columns:minmax(140px,220px) 1fr;gap:6px 14px;margin:0}dt{color:#8e96a8}dd{margin:0;white-space:pre-wrap;word-break:break-word}
    .tag{display:inline-block;padding:2px 9px;border-radius:999px;background:rgba(46,125,255,.15);border:1px solid rgba(119,158,255,.3);font-size:.82rem;white-space:nowrap}
    .msg{padding:10px 14px;border-radius:10px;background:rgba(255,196,0,.08);border:1px solid rgba(255,196,0,.3);margin-bottom:14px}.muted{color:#8e96a8}
    </style></head><body>' . $body . '</body></html>';
    exit;
}

$m = $msg ? '<p class="msg" role="alert">' . h($msg) . '</p>' : '';
$tok = '<input type="hidden" name="csrf" value="' . h($csrf) . '">';

if (!$logged) {
    if ($hash === null) {
        page('Activar bandeja', '<main class="wrap" style="max-width:460px"><h1>Activar la bandeja de solicitudes</h1>' . $m . '<form method="post" class="card grid">' . $tok . '<input type="hidden" name="accion" value="crear">
        <label class="grid">Clave de activación<input name="token" required autocomplete="off"></label>
        <label class="grid">Nueva contraseña (12 caracteres o más)<input type="password" name="clave" required minlength="12" autocomplete="new-password"></label>
        <label class="grid">Repite la contraseña<input type="password" name="clave2" required minlength="12" autocomplete="new-password"></label>
        <button>Activar</button><p class="muted">La clave de activación sirve una sola vez.</p></form></main>');
    }
    page('Ingresar', '<main class="wrap" style="max-width:420px"><h1>Bandeja de solicitudes</h1>' . $m . '<form method="post" class="card grid">' . $tok . '<input type="hidden" name="accion" value="entrar">
    <label class="grid">Contraseña<input type="password" name="clave" required autocomplete="current-password" autofocus></label><button>Entrar</button></form></main>');
}

$top = '<header><b>SIBNOVA · Solicitudes</b><form method="post" class="inline">' . $tok . '<a href="/admin/">Todas</a> <a href="/admin/?cuenta=1">Contraseña</a><input type="hidden" name="accion" value="salir"><button class="ghost">Salir</button></form></header>';

if (isset($_GET['cuenta'])) {
    page('Contraseña', $top . '<main class="wrap" style="max-width:460px"><h1>Cambiar contraseña</h1>' . $m . '<form method="post" class="card grid">' . $tok . '<input type="hidden" name="accion" value="clave">
    <label class="grid">Contraseña actual<input type="password" name="actual" required autocomplete="current-password"></label>
    <label class="grid">Nueva contraseña<input type="password" name="clave" required minlength="12" autocomplete="new-password"></label>
    <label class="grid">Repite la nueva<input type="password" name="clave2" required minlength="12" autocomplete="new-password"></label><button>Guardar</button></form></main>');
}

if (isset($_GET['ver'])) {
    $st = db()->prepare('SELECT * FROM solicitudes WHERE id = ?');
    $st->execute([(int)$_GET['ver']]);
    $s = $st->fetch();
    if (!$s) go();
    $d = json_decode($s['datos'], true) ?: [];
    $labels = ['nombre' => 'Nombre', 'empresa' => 'Empresa', 'nit' => 'NIT', 'cargo' => 'Cargo', 'correo' => 'Correo', 'telefono' => 'Teléfono / WhatsApp', 'ciudad' => 'Ciudad', 'pais' => 'País',
        'nombre_comercial' => 'Nombre comercial', 'rubro' => 'Rubro', 'descripcion' => 'Descripción', 'servicios' => 'Servicios o productos', 'publico' => 'Público objetivo', 'objetivos' => 'Objetivos',
        'colores' => 'Colores', 'logo' => 'Logo', 'manual' => 'Manual de marca', 'referencias' => 'Referencias', 'cambios' => 'Conservar o cambiar',
        'dominio' => 'Dominio propio', 'hosting' => 'Hosting propio', 'adicionales' => 'Funciones adicionales', 'fecha_entrega' => 'Fecha deseada', 'presupuesto' => 'Presupuesto', 'aprobador' => 'Aprueba', 'observaciones' => 'Observaciones'];
    $rows = '';
    foreach ($labels as $k => $l) if (($d[$k] ?? '') !== '') $rows .= '<dt>' . h($l) . '</dt><dd>' . h((string)$d[$k]) . '</dd>';
    $fn = array_map(fn($x) => h($FUNC[$x] ?? $x), json_decode($s['funciones'], true) ?: []);
    $fa = db()->prepare('SELECT * FROM archivos WHERE solicitud_id = ?'); $fa->execute([$s['id']]);
    $files = '';
    foreach ($fa->fetchAll() as $f) $files .= '<li><a href="/admin/?archivo=' . (int)$f['id'] . '">' . h($f['nombre']) . '</a> <span class="muted">(' . round($f['bytes'] / 1048576, 1) . ' MB)</span></li>';
    $hi = db()->prepare('SELECT * FROM historial WHERE solicitud_id = ? ORDER BY id DESC'); $hi->execute([$s['id']]);
    $hist = '';
    foreach ($hi->fetchAll() as $x) $hist .= '<tr><td>' . h($x['fecha']) . '</td><td><span class="tag">' . h($x['estado']) . '</span></td><td>' . h($x['nota']) . '</td></tr>';
    $opts = implode('', array_map(fn($e) => '<option' . ($e === $s['estado'] ? ' selected' : '') . '>' . h($e) . '</option>', $ESTADOS));
    page($s['numero'], $top . '<main class="wrap"><p><a href="/admin/">← Volver</a></p><h1>' . h($s['numero']) . ' <span class="tag">' . h($s['estado']) . '</span></h1>
    <div class="grid two"><section class="card"><h2 style="margin-top:0">Proyecto</h2><dl><dt>Fecha</dt><dd>' . h($s['creado']) . '</dd><dt>Diseño</dt><dd>' . h($s['diseno_nombre']) . '</dd><dt>Paquete</dt><dd>' . h($s['paquete_nombre']) . '</dd><dt>Precio inicial</dt><dd>' . bs((int)$s['precio_inicial']) . ' (calculado en el servidor)</dd><dt>Funciones pedidas</dt><dd>' . ($fn ? implode(', ', $fn) : '—') . '</dd></dl>
    <h2>Cambiar estado</h2><form method="post" class="inline">' . $tok . '<input type="hidden" name="accion" value="estado"><input type="hidden" name="id" value="' . (int)$s['id'] . '"><select name="estado">' . $opts . '</select><input name="nota" maxlength="500" placeholder="Nota (opcional)"><button>Guardar</button></form>
    <h2>Archivos</h2>' . ($files ? '<ul>' . $files . '</ul>' : '<p class="muted">Sin archivos.</p>') . '</section>
    <section class="card"><h2 style="margin-top:0">Cliente y negocio</h2><dl>' . $rows . '</dl></section></div>
    <h2>Historial</h2><div class="card scroll"><table><thead><tr><th>Fecha</th><th>Estado</th><th>Nota</th></tr></thead><tbody>' . $hist . '</tbody></table></div></main>');
}

$fe = (string)($_GET['estado'] ?? '');
$q = clean($_GET['q'] ?? '', 80);
$sql = 'SELECT id, numero, creado, estado, nombre, empresa, diseno_nombre, paquete_nombre, precio_inicial FROM solicitudes WHERE 1';
$args = [];
if (in_array($fe, $ESTADOS, true)) { $sql .= ' AND estado = ?'; $args[] = $fe; }
if ($q !== '') { $sql .= ' AND (numero LIKE ? OR nombre LIKE ? OR empresa LIKE ?)'; array_push($args, "%$q%", "%$q%", "%$q%"); }
$st = db()->prepare($sql . ' ORDER BY id DESC LIMIT 300');
$st->execute($args);
$trs = '';
foreach ($st->fetchAll() as $s) $trs .= '<tr><td><a href="/admin/?ver=' . (int)$s['id'] . '">' . h($s['numero']) . '</a></td><td>' . h($s['creado']) . '</td><td>' . h($s['nombre']) . ($s['empresa'] ? '<br><span class="muted">' . h($s['empresa']) . '</span>' : '') . '</td><td>' . h($s['diseno_nombre']) . '</td><td>' . h($s['paquete_nombre']) . '<br><span class="muted">' . bs((int)$s['precio_inicial']) . '</span></td><td><span class="tag">' . h($s['estado']) . '</span></td></tr>';
$opts = '<option value="">Todos los estados</option>' . implode('', array_map(fn($e) => '<option' . ($e === $fe ? ' selected' : '') . '>' . h($e) . '</option>', $ESTADOS));
page('Solicitudes', $top . '<main class="wrap"><h1>Solicitudes de páginas web</h1>' . $m . '<form method="get" class="inline" style="margin-bottom:14px"><select name="estado">' . $opts . '</select><input name="q" value="' . h($q) . '" placeholder="Buscar número, nombre o empresa"><button>Filtrar</button></form>
<div class="card scroll"><table><thead><tr><th>Número</th><th>Fecha</th><th>Cliente</th><th>Diseño</th><th>Paquete</th><th>Estado</th></tr></thead><tbody>' . ($trs ?: '<tr><td colspan="6" class="muted">Todavía no hay solicitudes.</td></tr>') . '</tbody></table></div></main>');
