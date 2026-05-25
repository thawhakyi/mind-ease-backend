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
        Schema::create('service_locations', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->timestamps();
        });

        Schema::create('counselling_providers', function (Blueprint $table) {
            $table->id();
            $table->string('provider_name');
            $table->longText('provider_background');
            $table->unsignedInteger('number_of_professionals');
            $table->string('professional_types');
            $table->json('languages');
            $table->boolean('in_person')->default(false);
            $table->string('office_hours');
            $table->json('contact_methods');
            $table->json('phone_numbers');
            $table->string('email');
            $table->string('website_url', 2048)->nullable();
            $table->string('facebook_page_name')->nullable();
            $table->string('facebook_url', 2048)->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->string('logo_path')->nullable();
            $table->timestamps();
        });

        Schema::create('counselling_provider_service_location', function (Blueprint $table) {
            $table->id();
            
            $table->unsignedBigInteger('counselling_provider_id');
            $table->foreign('counselling_provider_id', 'fk_cpsl_cp_id')
                  ->references('id')->on('counselling_providers')
                  ->cascadeOnDelete();

            $table->unsignedBigInteger('service_location_id');
            $table->foreign('service_location_id', 'fk_cpsl_sl_id')
                  ->references('id')->on('service_locations')
                  ->restrictOnDelete();

            $table->timestamps();

            $table->unique([
                'counselling_provider_id',
                'service_location_id',
            ], 'unq_cpsl_ids');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('counselling_provider_service_location');
        Schema::dropIfExists('counselling_providers');
        Schema::dropIfExists('service_locations');
    }
};
