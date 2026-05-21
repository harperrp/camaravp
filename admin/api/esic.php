<?php
require_once __DIR__ . '/resource.php';
handle_resource('esic_requests,protocol,requester_name,request_text,status,response_text,response_date', explode(',', ''), 'esic_requests,protocol,requester_name,request_text,status,response_text,response_date');
