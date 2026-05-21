<?php
require_once __DIR__ . '/common.php'; require_auth();
$allowed=['pdf'=>'application/pdf','jpg'=>'image/jpeg','jpeg'=>'image/jpeg','png'=>'image/png','webp'=>'image/webp'];
$module=$_POST['module'] ?? 'documents';
if(!isset($_FILES['file'])) json_response(['ok'=>false,'error'=>'arquivo obrigatório'],422);
$f=$_FILES['file']; $ext=strtolower(pathinfo($f['name'], PATHINFO_EXTENSION));
if(!isset($allowed[$ext])) json_response(['ok'=>false,'error'=>'tipo não permitido'],422);
if($f['size'] > ($config['upload_max_bytes'] ?? 10485760)) json_response(['ok'=>false,'error'=>'arquivo muito grande'],422);
$base=realpath(__DIR__.'/../../uploads'); $targetDir=$base.'/'.$module; if(!is_dir($targetDir)) mkdir($targetDir,0775,true);
$name=bin2hex(random_bytes(16)).'.'.$ext; $target=$targetDir.'/'.$name;
if(!move_uploaded_file($f['tmp_name'],$target)) json_response(['ok'=>false,'error'=>'falha upload'],500);
$rel='uploads/'.$module.'/'.$name;
audit_log($pdo,'upload',null,'uploads',['path'=>$rel]);
json_response(['ok'=>true,'path'=>$rel]);
