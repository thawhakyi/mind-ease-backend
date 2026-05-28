<?php

namespace App\Providers;

use App\Models\CounsellingProvider;
use App\Models\CountryOffice;
use App\Models\Location;
use App\Models\OpportunityNews;
use App\Models\OpportunityNewsCategory;
use App\Models\PageSetting;
use App\Models\ProgramUpdate;
use App\Models\ProgramUpdateActivityDetail;
use App\Models\ResourceCategory;
use App\Models\ResourceItem;
use App\Models\ResourceLanguage;
use App\Models\ServiceLocation;
use App\Models\SiteSetting;
use App\Models\Timeline;
use App\Observers\ContentCacheRevalidationObserver;
use Carbon\CarbonImmutable;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->observeContentModels();

        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });

        RateLimiter::for('auth', function (Request $request) {
            return Limit::perMinute(10)->by($request->ip());
        });

        $this->configureDefaults();
    }

    private function observeContentModels(): void
    {
        foreach ([
            CounsellingProvider::class,
            CountryOffice::class,
            Location::class,
            OpportunityNews::class,
            OpportunityNewsCategory::class,
            PageSetting::class,
            ProgramUpdate::class,
            ProgramUpdateActivityDetail::class,
            ResourceCategory::class,
            ResourceItem::class,
            ResourceLanguage::class,
            ServiceLocation::class,
            SiteSetting::class,
            Timeline::class,
        ] as $model) {
            $model::observe(ContentCacheRevalidationObserver::class);
        }
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
