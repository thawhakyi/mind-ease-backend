<?php

use App\Http\Controllers\Api\V1\PublicContentController;
use App\Http\Controllers\CounsellingProviders\CounsellingProviderController;
use App\Http\Controllers\CounsellingProviders\ServiceLocationController;
use App\Http\Controllers\OpportunitiesNews\CategoryController as OpportunityNewsCategoryController;
use App\Http\Controllers\OpportunitiesNews\OpportunityNewsController;
use App\Http\Controllers\ProgramUpdates\CountryOfficeController;
use App\Http\Controllers\ProgramUpdates\LocationController;
use App\Http\Controllers\ProgramUpdates\ProgramUpdateController;
use App\Http\Controllers\Resources\CategoryController as ResourceCategoryController;
use App\Http\Controllers\Resources\LanguageController as ResourceLanguageController;
use App\Http\Controllers\Resources\ResourceController;
use App\Http\Controllers\Settings\SiteSettingController;
use App\Http\Controllers\TimelineController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');



Route::prefix('api/v1')->name('api.v1.')->middleware('throttle:api')->group(function (): void {
    Route::get('session', [PublicContentController::class, 'session'])->name('session');
    Route::get('program-updates', [PublicContentController::class, 'programUpdates'])->name('program-updates');
    Route::get('opportunities-news', [PublicContentController::class, 'opportunitiesNews'])->name('opportunities-news');
    Route::get('resources', [PublicContentController::class, 'resources'])->name('resources');
    Route::get('counselling-providers', [PublicContentController::class, 'counsellingProviders'])->name('counselling-providers');
    Route::get('timelines', [PublicContentController::class, 'timelines'])->name('timelines');
    Route::get('site-settings', [PublicContentController::class, 'siteSettings'])->name('site-settings');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', \App\Http\Controllers\DashboardController::class)->name('dashboard');
    Route::get('site-settings', [SiteSettingController::class, 'edit'])->name('site-settings');
    Route::put('site-settings', [SiteSettingController::class, 'update'])->name('site-settings.update');

    Route::prefix('program-updates')
        ->name('program-updates.')
        ->group(function () {
            Route::resource('country-offices', CountryOfficeController::class)
                ->only(['index', 'store', 'update', 'destroy']);
            Route::resource('locations', LocationController::class)
                ->only(['index', 'store', 'update', 'destroy']);
        });

    Route::resource('program-updates', ProgramUpdateController::class)
        ->except(['show']);

    Route::prefix('opportunities-news')
        ->name('opportunities-news.')
        ->group(function () {
            Route::resource('categories', OpportunityNewsCategoryController::class)
                ->only(['index', 'store', 'update', 'destroy']);
        });

    Route::resource('opportunities-news', OpportunityNewsController::class)
        ->except(['show'])
        ->parameters(['opportunities-news' => 'opportunities_news']);

    Route::prefix('resources')
        ->name('resources.')
        ->group(function () {
            Route::resource('categories', ResourceCategoryController::class)
                ->only(['index', 'store', 'update', 'destroy']);
            Route::resource('languages', ResourceLanguageController::class)
                ->only(['index', 'store', 'update', 'destroy']);
        });

    Route::resource('resources', ResourceController::class)
        ->except(['show']);

    Route::prefix('counselling-providers')
        ->name('counselling-providers.')
        ->group(function () {
            Route::resource('service-locations', ServiceLocationController::class)
                ->only(['index', 'store', 'update', 'destroy']);
        });

    Route::resource('counselling-providers', CounsellingProviderController::class)
        ->except(['show'])
        ->parameters(['counselling-providers' => 'counselling_provider']);

    Route::resource('timelines', TimelineController::class)
        ->except(['show']);
});

require __DIR__.'/settings.php';

