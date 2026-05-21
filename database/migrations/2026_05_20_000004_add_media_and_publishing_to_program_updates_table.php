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
        Schema::table('program_updates', function (Blueprint $table) {
            $table->string('feature_image_path')->nullable()->after('event_type');
            $table->json('gallery_image_paths')->nullable()->after('feature_image_path');
            $table->boolean('is_published')->default(false)->after('gallery_image_paths');
            $table->unsignedInteger('sort_order')->default(0)->after('is_published');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('program_updates', function (Blueprint $table) {
            $table->dropColumn([
                'feature_image_path',
                'gallery_image_paths',
                'is_published',
                'sort_order',
            ]);
        });
    }
};
