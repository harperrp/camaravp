<?php
require_once __DIR__ . '/common.php';
$method=$_SERVER['REQUEST_METHOD'];
if($method==='POST'){
  $d=body_json();
  start_secure_session();
  $s=$pdo->prepare('SELECT * FROM users WHERE email=? AND active=1 LIMIT 1');$s->execute([$d['email']??'']);$u=$s->fetch();
  if(!$u || !password_verify($d['password']??'', $u['password_hash'])) json_response(['ok'=>false,'error'=>'Credenciais inválidas'],401);
  $_SESSION['user_id']=$u['id']; $_SESSION['name']=$u['name'];
  audit_log($pdo,'login',$u['id'],'users',[]);
  json_response(['ok'=>true,'user'=>['id'=>$u['id'],'name'=>$u['name'],'email'=>$u['email']]]);
}
if($method==='DELETE'){
  start_secure_session();session_destroy();json_response(['ok'=>true]);
}
if($method==='GET'){
  start_secure_session();json_response(['ok'=>true,'authenticated'=>!empty($_SESSION['user_id']),'user'=>['id'=>$_SESSION['user_id']??null,'name'=>$_SESSION['name']??null]]);
}
json_response(['ok'=>false],405);
