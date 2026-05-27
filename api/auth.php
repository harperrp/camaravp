<?php
require __DIR__.'/db.php';
require __DIR__.'/common.php';

$method=$_SERVER['REQUEST_METHOD'];

if($method==='GET'){
  json_response([
    'authenticated'=>!empty($_SESSION['user']),
    'user'=>$_SESSION['user']??null
  ]);
}

if($method==='POST'){
  $d=get_json_input();

  $s=$pdo->prepare('SELECT * FROM users WHERE email=? AND active=1 LIMIT 1');
  $s->execute([$d['email']??'']);
  $u=$s->fetch();

  if(!$u || !password_verify($d['password']??'', $u['password_hash'])){
      json_response(['ok'=>false,'error'=>'Credenciais inválidas'],401);
  }

  $_SESSION['user']=[
    'id'=>$u['id'],
    'name'=>$u['name'],
    'email'=>$u['email'],
    'role'=>$u['role']
  ];

  json_response(['ok'=>true,'user'=>$_SESSION['user']]);
}

if($method==='DELETE'){
 session_destroy();
 json_response(['ok'=>true]);
}

json_response(['ok'=>false,'error'=>'Método inválido'],405);
