<?php
$cfg = file_exists(__DIR__ . '/config.local.php') ? require __DIR__ . '/config.local.php' : require __DIR__ . '/config.example.php';
$cfg['db_host'] = getenv('DB_HOST') ?: $cfg['db_host'];
$cfg['db_port'] = getenv('DB_PORT') ?: $cfg['db_port'];
$cfg['db_name'] = getenv('DB_NAME') ?: $cfg['db_name'];
$cfg['db_user'] = getenv('DB_USER') ?: $cfg['db_user'];
$cfg['db_pass'] = getenv('DB_PASS') ?: $cfg['db_pass'];
return $cfg;
