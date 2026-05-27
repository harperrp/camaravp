<?php
require __DIR__.'/db.php';
require __DIR__.'/common.php';

$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? (int)$_GET['id'] : null;

if ($method === 'GET') {
    if ($id) {
        $stmt = $pdo->prepare('SELECT * FROM news WHERE id = ? LIMIT 1');
        $stmt->execute([$id]);
        $item = $stmt->fetch();
        json_response(['ok' => true, 'data' => $item]);
    }

    $publicOnly = isset($_GET['public']) && $_GET['public'] == '1';
    if ($publicOnly) {
        $stmt = $pdo->query("SELECT * FROM news WHERE status = 'published' ORDER BY COALESCE(published_at, created_at) DESC, id DESC");
    } else {
        $stmt = $pdo->query('SELECT * FROM news ORDER BY COALESCE(published_at, created_at) DESC, id DESC');
    }
    json_response(['ok' => true, 'data' => $stmt->fetchAll()]);
}

if ($method === 'POST') {
    require_login();
    $d = get_json_input();
    $stmt = $pdo->prepare('INSERT INTO news (title, slug, summary, content, image_url, category, status, published_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    $stmt->execute([
        $d['title'] ?? '',
        $d['slug'] ?? null,
        $d['summary'] ?? null,
        $d['content'] ?? null,
        $d['image_url'] ?? null,
        $d['category'] ?? null,
        $d['status'] ?? 'published',
        $d['published_at'] ?? date('Y-m-d H:i:s')
    ]);
    json_response(['ok' => true, 'id' => (int)$pdo->lastInsertId()], 201);
}

if ($method === 'PUT') {
    require_login();
    if (!$id) json_response(['ok' => false, 'error' => 'ID obrigatório'], 400);
    $d = get_json_input();
    $stmt = $pdo->prepare('UPDATE news SET title=?, slug=?, summary=?, content=?, image_url=?, category=?, status=?, published_at=? WHERE id=?');
    $stmt->execute([
        $d['title'] ?? '',
        $d['slug'] ?? null,
        $d['summary'] ?? null,
        $d['content'] ?? null,
        $d['image_url'] ?? null,
        $d['category'] ?? null,
        $d['status'] ?? 'published',
        $d['published_at'] ?? date('Y-m-d H:i:s'),
        $id
    ]);
    json_response(['ok' => true]);
}

if ($method === 'DELETE') {
    require_login();
    if (!$id) json_response(['ok' => false, 'error' => 'ID obrigatório'], 400);
    $stmt = $pdo->prepare('DELETE FROM news WHERE id=?');
    $stmt->execute([$id]);
    json_response(['ok' => true]);
}

json_response(['ok' => false, 'error' => 'Método inválido'], 405);
