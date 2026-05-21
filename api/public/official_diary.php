<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../../admin/api/db.php';
 = ->query("SELECT * FROM official_diary WHERE status=published ORDER BY id DESC")->fetchAll();
echo json_encode(['ok'=>true,'data'=>], JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES);
