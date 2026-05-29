<?php

use Illuminate\Support\Facades\Schema;

test('cache table repair migration recreates missing database cache tables', function () {
    Schema::dropIfExists('cache_locks');
    Schema::dropIfExists('cache');

    $migration = require database_path('migrations/2026_05_29_231508_ensure_cache_tables_exist.php');

    $migration->up();
    $migration->up();

    expect(Schema::hasTable('cache'))->toBeTrue()
        ->and(Schema::hasColumns('cache', ['key', 'value', 'expiration']))->toBeTrue()
        ->and(Schema::hasTable('cache_locks'))->toBeTrue()
        ->and(Schema::hasColumns('cache_locks', ['key', 'owner', 'expiration']))->toBeTrue();
});
