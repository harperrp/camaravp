<?php
require __DIR__.'/db.php';
require __DIR__.'/common.php';

$method=$_SERVER['REQUEST_METHOD'];
$id=isset($_GET['id'])?(int)$_GET['id']:null;

if($method==='GET'){
 if($id){
   $s=$pdo->prepare('SELECT * FROM councilors WHERE id=? LIMIT 1');
   $s->execute([$id]);
   json_response(['ok'=>true,'data'=>$s->fetch()]);
 }
 $s=$pdo->query('SELECT * FROM councilors WHERE active=1 ORDER BY display_order,name');
 json_response(['ok'=>true,'data'=>$s->fetchAll()]);
}

json_response(['ok'=>true,'data'=>[]]);
