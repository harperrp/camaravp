<?php
require __DIR__.'/db.php';
require __DIR__.'/common.php';

require_login();

$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? (int)$_GET['id'] : null;

if ($method === 'GET') {
    $stmt = $pdo->query('SELECT id, name, email, role, active, created_at, updated_at FROM users ORDER BY name');
    json_response(['ok' => true, 'data' => $stmt->fetchAll()]);
}

if ($method === 'POST') {
    $d = get_json_input();
    if (empty($d['password'])) json_response(['ok' => false, 'error' => 'Senha obrigatoria'], 400);
    $stmt = $pdo->prepare('INSERT INTO users (name, email, password_hash, role, active) VALUES (?, ?, ?, ?, ?)');
    $stmt->execute([
        $d['name'] ?? '',
        $d['email'] ?? '',
        password_hash($d['password'], PASSWORD_DEFAULT),
        $d['role'] ?? 'editor',
        isset($d['active']) ? (int)$d['active'] : 1
    ]);
    json_response(['ok' => true, 'id' => (int)$pdo->lastInsertId()], 201);
}

if ($method === 'PUT') {
    if (!$id) json_response(['ok' => false, 'error' => 'ID obrigatorio'], 400);
    $d = get_json_input();
    if (!empty($d['password'])) {
        $stmt = $pdo->prepare('UPDATE users SET name=?, email=?, password_hash=?, role=?, active=? WHERE id=?');
        $stmt->execute([
            $d['name'] ?? '',
            $d['email'] ?? '',
            password_hash($d['password'], PASSWORD_DEFAULT),
            $d['role'] ?? 'editor',
            isset($d['active']) ? (int)$d['active'] : 1,
            $id
        ]);
    } else {
        $stmt = $pdo->prepare('UPDATE users SET name=?, email=?, role=?, active=? WHERE id=?');
        $stmt->execute([
            $d['name'] ?? '',
            $d['email'] ?? '',
            $d['role'] ?? 'editor',
            isset($d['active']) ? (int)$d['active'] : 1,
            $id
        ]);
    }
    json_response(['ok' => true]);
}

if ($method === 'DELETE') {
    if (!$id) json_response(['ok' => false, 'error' => 'ID obrigatorio'], 400);
    $stmt = $pdo->prepare('DELETE FROM users WHERE id=?');
    $stmt->execute([$id]);
    json_response(['ok' => true]);
}

json_response(['ok' => false, 'error' => 'Metodo invalido'], 405);

