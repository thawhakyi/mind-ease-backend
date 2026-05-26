<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('counselling_providers', 'service_modes')) {
            Schema::table('counselling_providers', function (Blueprint $table) {
                $table->json('service_modes')->nullable();
            });
        }

        if (Schema::hasColumn('counselling_providers', 'in_person')) {
            DB::table('counselling_providers')->where('in_person', true)->update(['service_modes' => json_encode(['In Person', 'Online'])]);
            DB::table('counselling_providers')->where('in_person', false)->update(['service_modes' => json_encode(['Online'])]);

            Schema::table('counselling_providers', function (Blueprint $table) {
                $table->dropColumn('in_person');
            });
        }
    }

    public function down(): void
    {
        if (! Schema::hasColumn('counselling_providers', 'in_person')) {
            Schema::table('counselling_providers', function (Blueprint $table) {
                $table->boolean('in_person')->default(false);
            });
        }

        if (Schema::hasColumn('counselling_providers', 'service_modes')) {
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
    }
};
