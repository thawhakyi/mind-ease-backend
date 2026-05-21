<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('program_updates', function (Blueprint $table) {
            $table->boolean('internal_members_only')->default(false)->after('gallery_image_paths');
        });

        Schema::table('opportunity_news', function (Blueprint $table) {
            $table->boolean('internal_members_only')->default(false)->after('featured_image_path');
            $table->boolean('is_published')->default(false)->after('internal_members_only');
        });

        DB::table('opportunity_news')->update(['is_published' => true]);

        Schema::table('counselling_providers', function (Blueprint $table) {
            $table->boolean('internal_members_only')->default(false)->after('logo_path');
            $table->boolean('is_published')->default(false)->after('internal_members_only');
        });

        DB::table('counselling_providers')->update(['is_published' => true]);
    }

    public function down(): void
    {
        Schema::table('counselling_providers', function (Blueprint $table) {
            $table->dropColumn(['internal_members_only', 'is_published']);
        });

        Schema::table('opportunity_news', function (Blueprint $table) {
            $table->dropColumn(['internal_members_only', 'is_published']);
        });

        Schema::table('program_updates', function (Blueprint $table) {
            $table->dropColumn('internal_members_only');
        });
    }
};
