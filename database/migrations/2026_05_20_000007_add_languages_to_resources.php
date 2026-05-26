<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (! Schema::hasTable('resource_languages')) {
            Schema::create('resource_languages', function (Blueprint $table) {
                $table->id();
                $table->string('name')->unique();
                $table->timestamps();
            });
        }

        if (! Schema::hasColumn('resources', 'resource_language_id')) {
            Schema::table('resources', function (Blueprint $table) {
                $table->foreignId('resource_language_id')
                    ->nullable()
                    ->after('resource_category_id')
                    ->constrained()
                    ->restrictOnDelete();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('resources', 'resource_language_id')) {
            Schema::table('resources', function (Blueprint $table) {
                $table->dropConstrainedForeignId('resource_language_id');
            });
        }

        Schema::dropIfExists('resource_languages');
    }
};
