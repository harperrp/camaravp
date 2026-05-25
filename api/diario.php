<?php
require __DIR__.'/db.php';
require __DIR__.'/common.php';

$s=$pdo->query("SELECT * FROM official_diary WHERE status='published' ORDER BY publication_date DESC,id DESC");
json_response(['ok'=>true,'data'=>$s->fetchAll()]);
