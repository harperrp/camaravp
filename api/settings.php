<?php
require __DIR__.'/db.php';
require __DIR__.'/common.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->query('SELECT setting_key, setting_value FROM site_settings ORDER BY setting_key');
    $rows = $stmt->fetchAll();
    $settings = [];
    foreach ($rows as $row) {
        $settings[$row['setting_key']] = $row['setting_value'];
    }
    json_response(['ok' => true, 'data' => $settings]);
}

if ($method === 'PUT' || $method === 'POST') {
    require_login();
    $d = get_json_input();
    $settings = isset($d['settings']) && is_array($d['settings']) ? $d['settings'] : $d;
    $stmt = $pdo->prepare('INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)');
    foreach ($settings as $key => $value) {
        $stmt->execute([$key, is_scalar($value) ? (string)$value : json_encode($value, JSON_UNESCAPED_UNICODE)]);
    }
    json_response(['ok' => true]);
}

json_response(['ok' => false, 'error' => 'Metodo invalido'], 405);

