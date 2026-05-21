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
        Schema::create('opportunity_news_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->timestamps();
        });

        Schema::create('opportunity_news', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->longText('description');
            $table->string('featured_image_path')->nullable();
            $table->timestamps();
        });

        Schema::create('opportunity_news_category_opportunity_news', function (Blueprint $table) {
            $table->id();
            $table->foreignId('opportunity_news_id')->constrained('opportunity_news')->cascadeOnDelete();
            $table->foreignId('opportunity_news_category_id')->constrained()->cascadeOnDelete();
            $table->timestamps();

            $table->unique([
                'opportunity_news_id',
                'opportunity_news_category_id',
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('opportunity_news_category_opportunity_news');
        Schema::dropIfExists('opportunity_news');
        Schema::dropIfExists('opportunity_news_categories');
    }
};
