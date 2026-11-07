<?php
// Funciones comunes del servidor de solicitudes de SIBNOVA. No se abre directamente.
declare(strict_types=1);

if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) { http_response_code(404); exit; }

// Hash de la clave de un solo uso para crear la cuenta de la bandeja (/admin/). Después de crearla ya no sirve.
const SETUP_TOKEN_HASH = '$2y$10$HGDiMDaE4XGjcXY9YVvckOsOYOqC0jYtVO9hCRa.VOw5PO/tjoPdC';
const NOTIFY_EMAIL = 'sibnovaltda@gmail.com';
const MAIL_FROM = 'no-responder@sibnova.com.bo';
const ALLOWED_HOSTS = ['sibnova.com.bo', 'www.sibnova.com.bo', 'localhost', '127.0.0.1'];
const SITE_URL = 'https://sibnova.com.bo';

// Los datos se guardan fuera de la carpeta pública (public_html): nadie los puede abrir por URL
// y no se borran cuando se publica una versión nueva del sitio.
function data_dir(): string {
    static $dir = null;
    if ($dir !== null) return $dir;
    $root = rtrim((string)($_SERVER['DOCUMENT_ROOT'] ?? ''), '/\\');
    $d = getenv('SIBNOVA_DATA') ?: dirname($root !== '' ? $root : dirname(__DIR__)) . '/sibnova-datos';
    if (!is_dir($d)) @mkdir($d, 0700, true);
    if (!is_dir($d) || !is_writable($d)) throw new RuntimeException('almacen no disponible');
    if (!is_dir("$d/archivos")) @mkdir("$d/archivos", 0700, true);
    if (!is_file("$d/.htaccess")) @file_put_contents("$d/.htaccess", "Require all denied\n");
    return $dir = $d;
}

function db(): PDO {
    static $pdo = null;
    if ($pdo) return $pdo;
    $pdo = new PDO('sqlite:' . data_dir() . '/solicitudes.sqlite', null, null, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]);
    $pdo->exec('PRAGMA journal_mode = WAL; PRAGMA busy_timeout = 5000; PRAGMA foreign_keys = ON;');
    $pdo->exec('CREATE TABLE IF NOT EXISTS solicitudes (
        id INTEGER PRIMARY KEY, numero TEXT UNIQUE NOT NULL, creado TEXT NOT NULL, actualizado TEXT NOT NULL, estado TEXT NOT NULL,
        nombre TEXT NOT NULL, empresa TEXT, correo TEXT NOT NULL, telefono TEXT NOT NULL, ciudad TEXT,
        diseno_id TEXT NOT NULL, diseno_nombre TEXT NOT NULL, paquete_id TEXT NOT NULL, paquete_nombre TEXT NOT NULL,
        precio_inicial INTEGER NOT NULL, funciones TEXT NOT NULL, datos TEXT NOT NULL)');
    $pdo->exec('CREATE TABLE IF NOT EXISTS archivos (
        id INTEGER PRIMARY KEY, solicitud_id INTEGER NOT NULL REFERENCES solicitudes(id) ON DELETE CASCADE,
        nombre TEXT NOT NULL, guardado TEXT NOT NULL, tipo TEXT NOT NULL, bytes INTEGER NOT NULL)');
    $pdo->exec('CREATE TABLE IF NOT EXISTS historial (
        id INTEGER PRIMARY KEY, solicitud_id INTEGER NOT NULL REFERENCES solicitudes(id) ON DELETE CASCADE,
        fecha TEXT NOT NULL, estado TEXT NOT NULL, nota TEXT)');
    $pdo->exec('CREATE TABLE IF NOT EXISTS intentos (clave TEXT NOT NULL, momento INTEGER NOT NULL)');
    $pdo->exec('CREATE INDEX IF NOT EXISTS intentos_clave ON intentos (clave, momento)');
    $pdo->exec('CREATE TABLE IF NOT EXISTS ajustes (clave TEXT PRIMARY KEY, valor TEXT NOT NULL)');
    // Formularios de datos que SIBNOVA envía a sus clientes (/datos-proyecto/)
    $pdo->exec('CREATE TABLE IF NOT EXISTS entregas (
        id INTEGER PRIMARY KEY, numero TEXT UNIQUE NOT NULL, creado TEXT NOT NULL, formulario TEXT NOT NULL, titulo TEXT NOT NULL,
        nombre TEXT NOT NULL, empresa TEXT, telefono TEXT, correo TEXT, revisado INTEGER NOT NULL DEFAULT 0, datos TEXT NOT NULL)');
    $pdo->exec('CREATE TABLE IF NOT EXISTS entregas_archivos (
        id INTEGER PRIMARY KEY, entrega_id INTEGER NOT NULL REFERENCES entregas(id) ON DELETE CASCADE,
        campo TEXT NOT NULL, nombre TEXT NOT NULL, guardado TEXT NOT NULL, tipo TEXT NOT NULL, bytes INTEGER NOT NULL)');
    return $pdo;
}

function setting(string $k): ?string {
    $st = db()->prepare('SELECT valor FROM ajustes WHERE clave = ?');
    $st->execute([$k]);
    $v = $st->fetchColumn();
    return $v === false ? null : (string)$v;
}

function set_setting(string $k, string $v): void {
    db()->prepare('INSERT INTO ajustes (clave, valor) VALUES (?, ?) ON CONFLICT(clave) DO UPDATE SET valor = excluded.valor')->execute([$k, $v]);
}

// Precios y opciones válidas: el archivo lo genera el build del sitio y vive en el servidor.
function formularios(): array {
    static $c = null;
    if ($c === null) {
        $c = json_decode((string)@file_get_contents(__DIR__ . '/formularios.json'), true);
        if (!is_array($c)) throw new RuntimeException('formularios no disponibles');
    }
    return $c;
}

function catalogo(): array {
    static $c = null;
    if ($c === null) {
        $c = json_decode((string)@file_get_contents(__DIR__ . '/catalogo.json'), true);
        if (!is_array($c)) throw new RuntimeException('catalogo no disponible');
    }
    return $c;
}

function find_by_id(array $list, string $id): ?array {
    foreach ($list as $x) if (($x['id'] ?? null) === $id) return $x;
    return null;
}

// Quita caracteres de control y recorta. El HTML se escapa al mostrarlo, no al guardarlo.
function clean($v, int $max): string {
    if (!is_string($v)) return '';
    if (!mb_check_encoding($v, 'UTF-8')) return '';
    $v = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $v) ?? '';
    return mb_substr(trim($v), 0, $max);
}

function h(?string $s): string {
    return htmlspecialchars((string)$s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

// Identificador anónimo del visitante para los límites de intentos (no se guarda la IP).
function client_key(): string {
    $salt = setting('sal');
    if ($salt === null) { $salt = bin2hex(random_bytes(16)); set_setting('sal', $salt); }
    return hash('sha256', $salt . '|' . ($_SERVER['REMOTE_ADDR'] ?? ''));
}

function too_many(string $tipo, int $max, int $segundos, bool $registrar = true): bool {
    $pdo = db();
    $now = time();
    $pdo->prepare('DELETE FROM intentos WHERE momento < ?')->execute([$now - 86400]);
    $k = $tipo . ':' . client_key();
    $st = $pdo->prepare('SELECT COUNT(*) FROM intentos WHERE clave = ? AND momento > ?');
    $st->execute([$k, $now - $segundos]);
    if ((int)$st->fetchColumn() >= $max) return true;
    if ($registrar) $pdo->prepare('INSERT INTO intentos (clave, momento) VALUES (?, ?)')->execute([$k, $now]);
    return false;
}

function origin_ok(): bool {
    $o = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($o === '') return true;
    $host = parse_url($o, PHP_URL_HOST);
    return is_string($host) && in_array(strtolower($host), ALLOWED_HOSTS, true);
}

function json_out(array $data, int $code = 200): never {
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function now_iso(): string {
    return (new DateTimeImmutable('now', new DateTimeZone('America/La_Paz')))->format('Y-m-d H:i:s');
}
