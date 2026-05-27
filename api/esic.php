<?php
require __DIR__.'/db.php';
require __DIR__.'/common.php';

$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? (int)$_GET['id'] : null;

function make_protocol(string $prefix): string {
    return $prefix . date('YmdHis') . random_int(100, 999);
}

if ($method === 'GET') {
    require_login();
    if ($id) {
        $stmt = $pdo->prepare('SELECT * FROM esic_requests WHERE id = ? LIMIT 1');
        $stmt->execute([$id]);
        json_response(['ok' => true, 'data' => $stmt->fetch()]);
    }
    $stmt = $pdo->query('SELECT * FROM esic_requests ORDER BY created_at DESC, id DESC');
    json_response(['ok' => true, 'data' => $stmt->fetchAll()]);
}

if ($method === 'POST') {
    $d = get_json_input();
    $protocol = make_protocol('ESIC-');
    $stmt = $pdo->prepare('INSERT INTO esic_requests (protocol, requester_name, requester_email, requester_phone, subject, message, status) VALUES (?, ?, ?, ?, ?, ?, ?)');
    $stmt->execute([
        $protocol,
        $d['requester_name'] ?? '',
        $d['requester_email'] ?? null,
        $d['requester_phone'] ?? null,
        $d['subject'] ?? 'Pedido de Acesso a Informacao',
        $d['message'] ?? '',
        'novo'
    ]);
    json_response(['ok' => true, 'id' => (int)$pdo->lastInsertId(), 'protocol' => $protocol], 201);
}

if ($method === 'PUT') {
    require_login();
    if (!$id) json_response(['ok' => false, 'error' => 'ID obrigatorio'], 400);
    $d = get_json_input();
    $stmt = $pdo->prepare('UPDATE esic_requests SET status=?, response=? WHERE id=?');
    $stmt->execute([
        $d['status'] ?? 'respondido',
        $d['response'] ?? null,
        $id
    ]);
    json_response(['ok' => true]);
}

if ($method === 'DELETE') {
    require_login();
    if (!$id) json_response(['ok' => false, 'error' => 'ID obrigatorio'], 400);
    $stmt = $pdo->prepare('DELETE FROM esic_requests WHERE id=?');
    $stmt->execute([$id]);
    json_response(['ok' => true]);
}

json_response(['ok' => false, 'error' => 'Metodo invalido'], 405);

