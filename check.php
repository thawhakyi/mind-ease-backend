<?php
$files = glob("database/migrations/*.php");
foreach($files as $file) {
    $content = file_get_contents($file);
    preg_match_all("/Schema::create\('([^']+)'/", $content, $tables);
    $tableNames = $tables[1];
    
    // Also look for Schema::table
    preg_match_all("/Schema::table\('([^']+)'/", $content, $alterTables);
    $tableNames = array_merge($tableNames, $alterTables[1]);
    
    foreach($tableNames as $tableName) {
        if(strlen($tableName) > 30) {
            echo "Long table name in $file: $tableName\n";
        }
    }
}
