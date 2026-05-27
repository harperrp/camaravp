<?php
require __DIR__.'/db.php';
require __DIR__.'/common.php';

$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? (int)$_GET['id'] : null;

function law_has_related_laws(PDO $pdo): bool {
    static $hasColumn = null;
    if ($hasColumn !== null) return $hasColumn;
    try {
        $stmt = $pdo->query("SHOW COLUMNS FROM laws LIKE 'related_laws'");
        $hasColumn = (bool)$stmt->fetch();
    } catch (Throwable $e) {
        $hasColumn = false;
    }
    return $hasColumn;
}

function law_status(string $value = null): string {
    $value = $value ?: 'published';
    $allowed = ['published', 'draft', 'archived'];
    return in_array($value, $allowed, true) ? $value : 'published';
}

if ($method === 'GET') {
    if ($id) {
        $stmt = $pdo->prepare('SELECT * FROM laws WHERE id = ? LIMIT 1');
        $stmt->execute([$id]);
        json_response(['ok' => true, 'data' => $stmt->fetch()]);
    }

    $admin = isset($_GET['admin']) && $_GET['admin'] == '1';
    if ($admin) {
        $stmt = $pdo->query('SELECT * FROM laws ORDER BY publication_date DESC, id DESC');
    } else {
        $stmt = $pdo->query("SELECT * FROM laws WHERE status = 'published' ORDER BY publication_date DESC, id DESC");
    }
    json_response(['ok' => true, 'data' => $stmt->fetchAll()]);
}

if ($method === 'POST') {
    require_login();
    $d = get_json_input();
    $hasRelated = law_has_related_laws($pdo);
    $title = trim($d['title'] ?? '');
    if ($title === '') {
        $title = trim(($d['law_type'] ?? 'Ato Normativo') . ' Nº ' . ($d['law_number'] ?? ''));
    }

    if ($hasRelated) {
        $stmt = $pdo->prepare('INSERT INTO laws (title, law_number, law_type, summary, content, related_laws, file_url, publication_date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
        $stmt->execute([
            $title,
            $d['law_number'] ?? null,
            $d['law_type'] ?? null,
            $d['summary'] ?? null,
            $d['content'] ?? null,
            $d['related_laws'] ?? null,
            $d['file_url'] ?? null,
            $d['publication_date'] ?? date('Y-m-d'),
            law_status($d['status'] ?? 'published')
        ]);
    } else {
        $stmt = $pdo->prepare('INSERT INTO laws (title, law_number, law_type, summary, content, file_url, publication_date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
        $stmt->execute([
            $title,
            $d['law_number'] ?? null,
            $d['law_type'] ?? null,
            $d['summary'] ?? null,
            $d['content'] ?? null,
            $d['file_url'] ?? null,
            $d['publication_date'] ?? date('Y-m-d'),
            law_status($d['status'] ?? 'published')
        ]);
    }
    json_response(['ok' => true, 'id' => (int)$pdo->lastInsertId()], 201);
}

if ($method === 'PUT') {
    require_login();
    if (!$id) json_response(['ok' => false, 'error' => 'ID obrigatorio'], 400);
    $d = get_json_input();
    $hasRelated = law_has_related_laws($pdo);
    $title = trim($d['title'] ?? '');
    if ($title === '') {
        $title = trim(($d['law_type'] ?? 'Ato Normativo') . ' Nº ' . ($d['law_number'] ?? ''));
    }

    if ($hasRelated) {
        $stmt = $pdo->prepare('UPDATE laws SET title=?, law_number=?, law_type=?, summary=?, content=?, related_laws=?, file_url=?, publication_date=?, status=? WHERE id=?');
        $stmt->execute([
            $title,
            $d['law_number'] ?? null,
            $d['law_type'] ?? null,
            $d['summary'] ?? null,
            $d['content'] ?? null,
            $d['related_laws'] ?? null,
            $d['file_url'] ?? null,
            $d['publication_date'] ?? date('Y-m-d'),
            law_status($d['status'] ?? 'published'),
            $id
        ]);
    } else {
        $stmt = $pdo->prepare('UPDATE laws SET title=?, law_number=?, law_type=?, summary=?, content=?, file_url=?, publication_date=?, status=? WHERE id=?');
        $stmt->execute([
            $title,
            $d['law_number'] ?? null,
            $d['law_type'] ?? null,
            $d['summary'] ?? null,
            $d['content'] ?? null,
            $d['file_url'] ?? null,
            $d['publication_date'] ?? date('Y-m-d'),
            law_status($d['status'] ?? 'published'),
            $id
        ]);
    }
    json_response(['ok' => true]);
}

if ($method === 'DELETE') {
    require_login();
    if (!$id) json_response(['ok' => false, 'error' => 'ID obrigatorio'], 400);
    $stmt = $pdo->prepare('DELETE FROM laws WHERE id=?');
    $stmt->execute([$id]);
    json_response(['ok' => true]);
}

json_response(['ok' => false, 'error' => 'Metodo invalido'], 405);
