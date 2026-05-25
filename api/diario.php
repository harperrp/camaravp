<?php
require __DIR__.'/db.php';
require __DIR__.'/common.php';

$method=$_SERVER['REQUEST_METHOD'];
$id=isset($_GET['id'])?(int)$_GET['id']:null;

if($method==='GET'){
 if($id){
   $s=$pdo->prepare('SELECT * FROM official_diary WHERE id=? LIMIT 1');
   $s->execute([$id]);
   json_response(['ok'=>true,'data'=>$s->fetch()]);
 }

 $admin = isset($_GET['admin']) && $_GET['admin']=='1';
 if($admin){
   $s=$pdo->query('SELECT * FROM official_diary ORDER BY publication_date DESC,id DESC');
 } else {
   $s=$pdo->query("SELECT * FROM official_diary WHERE status='published' ORDER BY publication_date DESC,id DESC");
 }
 json_response(['ok'=>true,'data'=>$s->fetchAll()]);
}

if($method==='POST'){
 require_login();
 $d=get_json_input();
 $s=$pdo->prepare('INSERT INTO official_diary (title,edition_number,description,file_url,publication_date,status) VALUES(?,?,?,?,?,?)');
 $s->execute([
  $d['title']??'',
  $d['edition_number']??null,
  $d['description']??null,
  $d['file_url']??null,
  $d['publication_date']??date('Y-m-d'),
  $d['status']??'published'
 ]);
 json_response(['ok'=>true,'id'=>(int)$pdo->lastInsertId()],201);
}

json_response(['ok'=>false,'error'=>'Método inválido'],405);
