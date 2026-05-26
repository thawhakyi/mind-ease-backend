<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // First add the new column
        Schema::table('counselling_providers', function (Blueprint $table) {
            $table->json('service_modes')->nullable();
        });

        // Migrate existing data (true -> '["In Person", "Online"]', false -> '["Online"]')
        DB::table('counselling_providers')->where('in_person', true)->update(['service_modes' => json_encode(['In Person', 'Online'])]);
        DB::table('counselling_providers')->where('in_person', false)->update(['service_modes' => json_encode(['Online'])]);

        // Drop old column
        Schema::table('counselling_providers', function (Blueprint $table) {
            $table->dropColumn('in_person');
        });
    }

    public function down(): void
    {
        Schema::table('counselling_providers', function (Blueprint $table) {
            $table->boolean('in_person')->default(false);
        });

        $providers = DB::table('counselling_providers')->get();
        foreach ($providers as $provider) {
            $modes = json_decode($provider->service_modes ?? '[]');
            $inPerson = in_array('In Person', $modes);
            DB::table('counselling_providers')->where('id', $provider->id)->update(['in_person' => $inPerson]);
        }

        Schema::table('counselling_providers', function (Blueprint $table) {
            $table->dropColumn('service_modes');
        });
    }
};
