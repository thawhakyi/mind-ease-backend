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
        if (!Schema::hasColumn('program_updates', 'description')) {
            Schema::table('program_updates', function (Blueprint $table) {
                $table->longText('description')->nullable()->after('summary');
                $table->string('quarter')->nullable()->after('description');
                $table->unsignedSmallInteger('year')->nullable()->after('quarter');
                $table->date('date')->nullable()->after('year');
                $table->string('facilitator')->nullable()->after('date');
                $table->string('event_type')->nullable()->after('facilitator');
            });
        }

        Schema::dropIfExists('country_office_program_update');
        Schema::create('country_office_program_update', function (Blueprint $table) {
            $table->id();
            $table->foreignId('country_office_id')->constrained()->cascadeOnDelete();
            $table->foreignId('program_update_id')->constrained()->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['country_office_id', 'program_update_id'], 'co_pu_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('country_office_program_update');

        Schema::table('program_updates', function (Blueprint $table) {
            $table->dropColumn([
                'description',
                'quarter',
                'year',
                'date',
                'facilitator',
                'event_type',
            ]);
        });
    }
};
