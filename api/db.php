<?php
$config = require __DIR__ . '/config.php';

if (session_status() === PHP_SESSION_NONE) {
    session_name($config['session_name']);
    session_start();
}

$dsn = sprintf(
    'mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4',
    $config['db_host'],
    $config['db_port'],
    $config['db_name']
);

try {
    $pdo = new PDO(
        $dsn,
        $config['db_user'],
        $config['db_pass'],
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );
} catch (Throwable $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode([
      'ok' => false,
      'error' => 'Falha na conexão com banco',
      'details' => $e->getMessage()
    ]);
    exit;
}
