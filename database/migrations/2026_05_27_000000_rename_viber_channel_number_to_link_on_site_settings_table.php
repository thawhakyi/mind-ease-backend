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
        if (Schema::hasColumn('site_settings', 'viber_channel_number') && ! Schema::hasColumn('site_settings', 'viber_channel_link')) {
            Schema::table('site_settings', function (Blueprint $table) {
                $table->renameColumn('viber_channel_number', 'viber_channel_link');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('site_settings', 'viber_channel_link') && ! Schema::hasColumn('site_settings', 'viber_channel_number')) {
            Schema::table('site_settings', function (Blueprint $table) {
                $table->renameColumn('viber_channel_link', 'viber_channel_number');
            });
        }
    }
};
