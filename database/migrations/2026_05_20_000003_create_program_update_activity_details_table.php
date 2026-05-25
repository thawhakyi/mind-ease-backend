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
        Schema::dropIfExists('activity_detail_location');
        Schema::dropIfExists('activity_detail_country_office');
        Schema::dropIfExists('program_update_activity_details');

        Schema::create('program_update_activity_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('program_update_id')->constrained()->cascadeOnDelete();
            $table->date('start_date');
            $table->date('end_date');
            $table->string('event_type');
            $table->text('event_link')->nullable();
            $table->timestamps();
        });

        Schema::create('activity_detail_country_office', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('program_update_activity_detail_id');
            $table->foreign('program_update_activity_detail_id', 'fk_adco_puad_id')
                  ->references('id')->on('program_update_activity_details')
                  ->cascadeOnDelete();
            
            $table->foreignId('country_office_id')->constrained()->cascadeOnDelete();
            $table->timestamps();

            $table->unique([
                'program_update_activity_detail_id',
                'country_office_id',
            ], 'unq_adco_puad_co');
        });

        Schema::create('activity_detail_location', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('program_update_activity_detail_id');
            $table->foreign('program_update_activity_detail_id', 'fk_adl_puad_id')
                  ->references('id')->on('program_update_activity_details')
                  ->cascadeOnDelete();
                  
            $table->foreignId('location_id')->constrained()->cascadeOnDelete();
            $table->timestamps();

            $table->unique([
                'program_update_activity_detail_id',
                'location_id',
            ], 'unq_adl_puad_loc');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_detail_location');
        Schema::dropIfExists('activity_detail_country_office');
        Schema::dropIfExists('program_update_activity_details');
    }
};
