<?php
require __DIR__.'/db.php';
require __DIR__.'/common.php';

$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? (int)$_GET['id'] : null;

if ($method === 'GET') {
    if ($id) {
        $stmt = $pdo->prepare('SELECT * FROM councilors WHERE id = ? LIMIT 1');
        $stmt->execute([$id]);
        json_response(['ok' => true, 'data' => $stmt->fetch()]);
    }

    $admin = isset($_GET['admin']) && $_GET['admin'] == '1';
    if ($admin) {
        $stmt = $pdo->query('SELECT * FROM councilors ORDER BY display_order, name');
    } else {
        $stmt = $pdo->query('SELECT * FROM councilors WHERE active = 1 ORDER BY display_order, name');
    }
    json_response(['ok' => true, 'data' => $stmt->fetchAll()]);
}

if ($method === 'POST') {
    require_login();
    $d = get_json_input();
    $stmt = $pdo->prepare('INSERT INTO councilors (name, party, role, legislature, phone, email, photo_url, biography, display_order, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    $stmt->execute([
        $d['name'] ?? '',
        $d['party'] ?? null,
        $d['role'] ?? null,
        $d['legislature'] ?? null,
        $d['phone'] ?? null,
        $d['email'] ?? null,
        $d['photo_url'] ?? null,
        $d['biography'] ?? null,
        (int)($d['display_order'] ?? 0),
        isset($d['active']) ? (int)$d['active'] : 1
    ]);
    json_response(['ok' => true, 'id' => (int)$pdo->lastInsertId()], 201);
}

if ($method === 'PUT') {
    require_login();
    if (!$id) json_response(['ok' => false, 'error' => 'ID obrigatório'], 400);
    $d = get_json_input();
    $stmt = $pdo->prepare('UPDATE councilors SET name=?, party=?, role=?, legislature=?, phone=?, email=?, photo_url=?, biography=?, display_order=?, active=? WHERE id=?');
    $stmt->execute([
        $d['name'] ?? '',
        $d['party'] ?? null,
        $d['role'] ?? null,
        $d['legislature'] ?? null,
        $d['phone'] ?? null,
        $d['email'] ?? null,
        $d['photo_url'] ?? null,
        $d['biography'] ?? null,
        (int)($d['display_order'] ?? 0),
        isset($d['active']) ? (int)$d['active'] : 1,
        $id
    ]);
    json_response(['ok' => true]);
}

if ($method === 'DELETE') {
    require_login();
    if (!$id) json_response(['ok' => false, 'error' => 'ID obrigatório'], 400);
    $stmt = $pdo->prepare('DELETE FROM councilors WHERE id=?');
    $stmt->execute([$id]);
    json_response(['ok' => true]);
}

json_response(['ok' => false, 'error' => 'Método inválido'], 405);
