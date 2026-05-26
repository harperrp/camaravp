<?php
require __DIR__ . '/db.php';
require __DIR__ . '/common.php';

require_login();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['ok' => false, 'error' => 'Metodo invalido'], 405);
}

if (empty($_FILES['file']) || !is_array($_FILES['file'])) {
    json_response(['ok' => false, 'error' => 'Nenhum arquivo enviado'], 400);
}

$file = $_FILES['file'];

if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
    json_response(['ok' => false, 'error' => 'Falha no envio do arquivo'], 400);
}

$maxBytes = 12 * 1024 * 1024;
if (($file['size'] ?? 0) > $maxBytes) {
    json_response(['ok' => false, 'error' => 'Arquivo maior que 12 MB'], 400);
}

$originalName = (string)($file['name'] ?? 'arquivo');
$extension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
$tmp = (string)$file['tmp_name'];

$allowed = [
    'jpg' => ['image/jpeg'],
    'jpeg' => ['image/jpeg'],
    'png' => ['image/png'],
    'webp' => ['image/webp'],
    'gif' => ['image/gif'],
    'pdf' => ['application/pdf', 'application/x-pdf'],
    'doc' => ['application/msword', 'application/octet-stream'],
    'docx' => ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/octet-stream'],
];

if (!isset($allowed[$extension])) {
    json_response(['ok' => false, 'error' => 'Tipo de arquivo nao permitido'], 400);
}

$mime = '';
if (function_exists('finfo_open')) {
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    if ($finfo) {
        $mime = (string)finfo_file($finfo, $tmp);
        finfo_close($finfo);
    }
}
if (!$mime && function_exists('mime_content_type')) {
    $mime = (string)mime_content_type($tmp);
}

if ($mime && !in_array($mime, $allowed[$extension], true)) {
    json_response(['ok' => false, 'error' => 'Arquivo nao confere com a extensao enviada'], 400);
}

$root = dirname(__DIR__) . '/uploads';
$subdir = date('Y/m');
$targetDir = $root . '/' . $subdir;

if (!is_dir($targetDir) && !mkdir($targetDir, 0755, true)) {
    json_response(['ok' => false, 'error' => 'Nao foi possivel criar a pasta de uploads'], 500);
}

try {
    $token = bin2hex(random_bytes(6));
} catch (Throwable $e) {
    $token = uniqid('', true);
}

$safeName = date('YmdHis') . '-' . $token . '.' . $extension;
$target = $targetDir . '/' . $safeName;

if (!move_uploaded_file($tmp, $target)) {
    json_response(['ok' => false, 'error' => 'Nao foi possivel salvar o arquivo'], 500);
}

$url = 'uploads/' . $subdir . '/' . $safeName;

json_response([
    'ok' => true,
    'url' => $url,
    'name' => $originalName,
    'mime' => $mime,
    'size' => (int)$file['size'],
]);
