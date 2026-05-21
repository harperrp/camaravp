<?php
require_once __DIR__ . '/db.php';
header('Content-Type: application/json; charset=utf-8');

function json_response($data = null, int $status = 200): void {
  http_response_code($status);
  echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
  exit;
}

function body_json(): array {
  $raw = file_get_contents('php://input');
  if (!$raw) return [];
  $data = json_decode($raw, true);
  return is_array($data) ? $data : [];
}

function start_secure_session(): void {
  global $config;
  session_name($config['session_name'] ?? 'camaravp_admin');
  session_set_cookie_params(['httponly'=>true,'secure'=>isset($_SERVER['HTTPS']),'samesite'=>'Lax']);
  if (session_status() !== PHP_SESSION_ACTIVE) session_start();
}

function require_auth(): void {
  start_secure_session();
  if (empty($_SESSION['user_id'])) json_response(['ok'=>false,'error'=>'Não autenticado'], 401);
}

function audit_log(PDO $pdo, string $action, ?int $entityId, string $entityType, array $payload = []): void {
  $uid = $_SESSION['user_id'] ?? null;
  $stmt = $pdo->prepare('INSERT INTO audit_logs (user_id,action,entity_type,entity_id,payload,created_at) VALUES (?,?,?,?,?,NOW())');
  $stmt->execute([$uid,$action,$entityType,$entityId,json_encode($payload, JSON_UNESCAPED_UNICODE)]);
}
