<?php
require_once __DIR__ . '/resource.php';
handle_resource('documents,title,doc_type,file_path,status', explode(',', ''), 'documents,title,doc_type,file_path,status');
