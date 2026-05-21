<?php
require_once __DIR__ . '/common.php';

function handle_resource(string $table, array $allowedFields, string $entityType): void {
  global $pdo;
  require_auth();
  $method = $_SERVER['REQUEST_METHOD'];
  if ($method === 'GET') {
    if (isset($_GET['id'])) {
      $s=$pdo->prepare("SELECT * FROM {$table} WHERE id=?");$s->execute([(int)$_GET['id']]);
      json_response(['ok'=>true,'data'=>$s->fetch()]);
    }
    $items = $pdo->query("SELECT * FROM {$table} ORDER BY id DESC")->fetchAll();
    json_response(['ok'=>true,'data'=>$items]);
  }
  $data = body_json();
  if ($method === 'POST') {
    $fields=[];$vals=[];
    foreach($allowedFields as $f){if(array_key_exists($f,$data)){$fields[]=$f;$vals[]=$data[$f];}}
    $q = 'INSERT INTO '.$table.' ('.implode(',',$fields).',created_at,updated_at) VALUES ('.implode(',',array_fill(0,count($fields),'?')).',NOW(),NOW())';
    $pdo->prepare($q)->execute($vals);
    $id=(int)$pdo->lastInsertId(); audit_log($pdo,'create',$id,$entityType,$data);
    json_response(['ok'=>true,'id'=>$id],201);
  }
  if ($method === 'PUT' || $method === 'PATCH') {
    $id=(int)($_GET['id'] ?? $data['id'] ?? 0); if(!$id) json_response(['ok'=>false,'error'=>'id obrigatório'],422);
    $sets=[];$vals=[];
    foreach($allowedFields as $f){if(array_key_exists($f,$data)){$sets[]="$f=?";$vals[]=$data[$f];}}
    $vals[]=$id;
    $pdo->prepare('UPDATE '.$table.' SET '.implode(',',$sets).',updated_at=NOW() WHERE id=?')->execute($vals);
    audit_log($pdo,'update',$id,$entityType,$data); json_response(['ok'=>true]);
  }
  if ($method === 'DELETE') {
    $id=(int)($_GET['id'] ?? 0); if(!$id) json_response(['ok'=>false,'error'=>'id obrigatório'],422);
    $pdo->prepare("DELETE FROM {$table} WHERE id=?")->execute([$id]);
    audit_log($pdo,'delete',$id,$entityType,[]); json_response(['ok'=>true]);
  }
  json_response(['ok'=>false,'error'=>'Método não suportado'],405);
}
