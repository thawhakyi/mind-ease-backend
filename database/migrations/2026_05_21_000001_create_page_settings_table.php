<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('page_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->string('label');
            $table->boolean('internal_members_only')->default(false);
            $table->boolean('is_published')->default(true);
            $table->timestamps();
        });

        $now = now();

        DB::table('page_settings')->insert([
            [
                'key' => 'program_updates',
                'label' => 'Program Updates',
                'internal_members_only' => false,
                'is_published' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'key' => 'opportunities_news',
                'label' => 'Opportunities & News',
                'internal_members_only' => false,
                'is_published' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'key' => 'resources',
                'label' => 'Resources',
                'internal_members_only' => false,
                'is_published' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'key' => 'counselling_providers',
                'label' => 'Counselling Providers',
                'internal_members_only' => false,
                'is_published' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('page_settings');
    }
};
