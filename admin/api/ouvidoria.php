<?php
require_once __DIR__ . '/resource.php';
handle_resource('ombudsman_requests,protocol,type,requester_name,message,status,response_text,due_date', explode(',', ''), 'ombudsman_requests,protocol,type,requester_name,message,status,response_text,due_date');
