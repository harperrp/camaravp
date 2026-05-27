<?php
require __DIR__.'/db.php';
require __DIR__.'/common.php';

$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? (int)$_GET['id'] : null;

if ($method === 'GET') {
    if ($id) {
        $stmt = $pdo->prepare('SELECT * FROM public_tenders WHERE id = ? LIMIT 1');
        $stmt->execute([$id]);
        json_response(['ok' => true, 'data' => $stmt->fetch()]);
    }

    $admin = isset($_GET['admin']) && $_GET['admin'] == '1';
    if ($admin) {
        $stmt = $pdo->query('SELECT * FROM public_tenders ORDER BY opening_date DESC, id DESC');
    } else {
        $stmt = $pdo->query("SELECT * FROM public_tenders WHERE status <> 'archived' ORDER BY opening_date DESC, id DESC");
    }
    json_response(['ok' => true, 'data' => $stmt->fetchAll()]);
}

if ($method === 'POST') {
    require_login();
    $d = get_json_input();
    $stmt = $pdo->prepare('INSERT INTO public_tenders (title, tender_number, modality, description, file_url, opening_date, status) VALUES (?, ?, ?, ?, ?, ?, ?)');
    $stmt->execute([
        $d['title'] ?? '',
        $d['tender_number'] ?? null,
        $d['modality'] ?? null,
        $d['description'] ?? null,
        $d['file_url'] ?? null,
        $d['opening_date'] ?? null,
        $d['status'] ?? 'publicado'
    ]);
    json_response(['ok' => true, 'id' => (int)$pdo->lastInsertId()], 201);
}

if ($method === 'PUT') {
    require_login();
    if (!$id) json_response(['ok' => false, 'error' => 'ID obrigatorio'], 400);
    $d = get_json_input();
    $stmt = $pdo->prepare('UPDATE public_tenders SET title=?, tender_number=?, modality=?, description=?, file_url=?, opening_date=?, status=? WHERE id=?');
    $stmt->execute([
        $d['title'] ?? '',
        $d['tender_number'] ?? null,
        $d['modality'] ?? null,
        $d['description'] ?? null,
        $d['file_url'] ?? null,
        $d['opening_date'] ?? null,
        $d['status'] ?? 'publicado',
        $id
    ]);
    json_response(['ok' => true]);
}

if ($method === 'DELETE') {
    require_login();
    if (!$id) json_response(['ok' => false, 'error' => 'ID obrigatorio'], 400);
    $stmt = $pdo->prepare('DELETE FROM public_tenders WHERE id=?');
    $stmt->execute([$id]);
    json_response(['ok' => true]);
}

json_response(['ok' => false, 'error' => 'Metodo invalido'], 405);

