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
            $table->longText('description')->nullable()->change();
            $table->string('quarter')->nullable()->change();
            $table->unsignedSmallInteger('year')->nullable()->change();
            $table->date('date')->nullable()->change();
            $table->string('facilitator')->nullable()->change();
            $table->string('event_type')->nullable()->change();
        });

        Schema::table('program_update_activity_details', function (Blueprint $table) {
            $table->date('start_date')->nullable()->change();
            $table->date('end_date')->nullable()->change();
            $table->string('event_type')->nullable()->change();
        });

        Schema::table('opportunity_news', function (Blueprint $table) {
            $table->longText('description')->nullable()->change();
        });

        Schema::table('resources', function (Blueprint $table) {
            $table->foreignId('resource_category_id')->nullable()->change();
            $table->longText('description')->nullable()->change();
            $table->unsignedSmallInteger('year')->nullable()->change();
            $table->string('url', 2048)->nullable()->change();
        });

        Schema::table('counselling_providers', function (Blueprint $table) {
            $table->longText('provider_background')->nullable()->change();
            $table->unsignedInteger('number_of_professionals')->nullable()->change();
            $table->string('professional_types')->nullable()->change();
            $table->json('languages')->nullable()->change();
            $table->string('office_hours')->nullable()->change();
            $table->json('contact_methods')->nullable()->change();
            $table->json('phone_numbers')->nullable()->change();
            $table->string('email')->nullable()->change();
        });

        Schema::table('timelines', function (Blueprint $table) {
            $table->string('year')->nullable()->change();
            $table->longText('description')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('program_updates', function (Blueprint $table) {
            $table->longText('description')->nullable()->change();
            $table->string('quarter')->nullable()->change();
            $table->unsignedSmallInteger('year')->nullable()->change();
            $table->date('date')->nullable()->change();
            $table->string('facilitator')->nullable()->change();
            $table->string('event_type')->nullable()->change();
        });

        Schema::table('program_update_activity_details', function (Blueprint $table) {
            $table->date('start_date')->nullable(false)->change();
            $table->date('end_date')->nullable(false)->change();
            $table->string('event_type')->nullable(false)->change();
        });

        Schema::table('opportunity_news', function (Blueprint $table) {
            $table->longText('description')->nullable(false)->change();
        });

        Schema::table('resources', function (Blueprint $table) {
            $table->foreignId('resource_category_id')->nullable(false)->change();
            $table->longText('description')->nullable(false)->change();
            $table->unsignedSmallInteger('year')->nullable(false)->change();
            $table->string('url', 2048)->nullable(false)->change();
        });

        Schema::table('counselling_providers', function (Blueprint $table) {
            $table->longText('provider_background')->nullable(false)->change();
            $table->unsignedInteger('number_of_professionals')->nullable(false)->change();
            $table->string('professional_types')->nullable(false)->change();
            $table->json('languages')->nullable(false)->change();
            $table->string('office_hours')->nullable(false)->change();
            $table->json('contact_methods')->nullable(false)->change();
            $table->json('phone_numbers')->nullable(false)->change();
            $table->string('email')->nullable(false)->change();
        });

        Schema::table('timelines', function (Blueprint $table) {
            $table->string('year')->nullable(false)->change();
            $table->longText('description')->nullable(false)->change();
        });
    }
};
