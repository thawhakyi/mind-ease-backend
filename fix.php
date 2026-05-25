<?php
$dbPath = __DIR__ . '/database/database.sqlite';
if (!file_exists($dbPath)) {
    die("Database not found\n");
}
$db = new PDO('sqlite:' . $dbPath);
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$stmt = $db->prepare("DELETE FROM migrations WHERE migration = '2026_05_20_000002_add_details_to_program_updates_table'");
$stmt->execute();
echo "Migration record deleted.\n";
