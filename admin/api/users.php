<?php
require_once __DIR__ . '/common.php'; require_auth();
$method=$_SERVER['REQUEST_METHOD'];
if($method==='GET'){ if(isset($_GET['id'])){$s=$pdo->prepare('SELECT id,name,email,role,active,created_at,updated_at FROM users WHERE id=?');$s->execute([(int)$_GET['id']]);json_response(['ok'=>true,'data'=>$s->fetch()]);}
json_response(['ok'=>true,'data'=>$pdo->query('SELECT id,name,email,role,active,created_at,updated_at FROM users ORDER BY id DESC')->fetchAll()]);}
$d=body_json();
if($method==='POST'){$h=password_hash($d['password']??'Trocar123!', PASSWORD_DEFAULT);$s=$pdo->prepare('INSERT INTO users (name,email,password_hash,role,active,created_at,updated_at) VALUES (?,?,?,?,1,NOW(),NOW())');$s->execute([$d['name'],$d['email'],$h,$d['role']??'editor']);json_response(['ok'=>true,'id'=>(int)$pdo->lastInsertId()],201);} 
if($method==='PATCH' || $method==='PUT'){$id=(int)($_GET['id']??$d['id']??0);if(!$id) json_response(['ok'=>false],422);$fields=[];$vals=[];foreach(['name','email','role','active'] as $f){if(isset($d[$f])){$fields[]="$f=?";$vals[]=$d[$f];}}if(isset($d['password'])){$fields[]='password_hash=?';$vals[]=password_hash($d['password'],PASSWORD_DEFAULT);} $vals[]=$id;$pdo->prepare('UPDATE users SET '.implode(',',$fields).',updated_at=NOW() WHERE id=?')->execute($vals);json_response(['ok'=>true]);}
if($method==='DELETE'){$id=(int)($_GET['id']??0);$pdo->prepare('UPDATE users SET active=0,updated_at=NOW() WHERE id=?')->execute([$id]);json_response(['ok'=>true]);}
json_response(['ok'=>false],405);
