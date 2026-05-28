<?php

namespace App\Http\Controllers;

use App\Models\CounsellingProvider;
use App\Models\CountryOffice;
use App\Models\Location;
use App\Models\OpportunityNews;
use App\Models\OpportunityNewsCategory;
use App\Models\ProgramUpdate;
use App\Models\ProgramUpdateActivityDetail;
use App\Models\ResourceCategory;
use App\Models\ResourceItem;
use App\Models\ServiceLocation;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $resourceQuery = ResourceItem::where('is_published', true);
        if ($request->filled('resource_category_id')) {
            $resourceQuery->where('resource_category_id', $request->input('resource_category_id'));
        }
        $this->applyMemberOnlyFilter($resourceQuery, $request, 'resource_member_only');

        $newsQuery = OpportunityNews::where('is_published', true);
        if ($request->filled('news_category_id')) {
            $newsQuery->where('opportunity_news_category_id', $request->input('news_category_id'));
        }
        $this->applyMemberOnlyFilter($newsQuery, $request, 'news_member_only');

        $counsellingQuery = CounsellingProvider::where('is_published', true);
        if ($request->filled('counselling_location_id')) {
            $locationId = $request->input('counselling_location_id');

            $counsellingQuery->whereHas(
                'serviceLocations',
                fn (Builder $query) => $query->where('service_locations.id', $locationId),
            );
        }
        $this->applyMemberOnlyFilter($counsellingQuery, $request, 'counselling_member_only');

        $programUpdateQuery = ProgramUpdate::where('is_published', true);
        $this->applyMemberOnlyFilter($programUpdateQuery, $request, 'update_member_only');

        $stats = [
            'total_resources' => $resourceQuery->count(),
            'total_opportunities_news' => $newsQuery->count(),
            'total_counselling_providers' => $counsellingQuery->count(),
            'total_program_updates' => $programUpdateQuery->count(),
            'total_resources_members_only' => (clone $resourceQuery)->where('internal_members_only', true)->count(),
            'total_opportunities_news_members_only' => (clone $newsQuery)->where('internal_members_only', true)->count(),
            'total_counselling_providers_members_only' => (clone $counsellingQuery)->where('internal_members_only', true)->count(),
            'total_program_updates_members_only' => (clone $programUpdateQuery)->where('internal_members_only', true)->count(),
        ];

        $programUpdates = ProgramUpdate::query()
            ->where('is_published', true)
            ->with(['countryOffices', 'activityDetails.countryOffices', 'activityDetails.locations'])
            ->latest()
            ->get()
            ->map(fn (ProgramUpdate $programUpdate) => [
                'id' => $programUpdate->id,
                'title' => $programUpdate->title,
                'summary' => str($programUpdate->description ?? '')->stripTags()->words(20)->toString(),
                'quarter' => $programUpdate->quarter,
                'year' => $programUpdate->year,
                'date' => $programUpdate->date?->format('d/m/Y'),
                'facilitator' => $programUpdate->facilitator,
                'event_type' => $programUpdate->event_type,
                'country_offices' => $programUpdate->countryOffices->map(fn (CountryOffice $countryOffice) => [
                    'id' => $countryOffice->id,
                    'name' => $countryOffice->name,
                ]),
                'activity_details' => $programUpdate->activityDetails->map(fn (ProgramUpdateActivityDetail $detail) => [
                    'start_date' => $detail->start_date?->format('d/m/Y'),
                    'end_date' => $detail->end_date?->format('d/m/Y'),
                    'event_type' => $detail->event_type,
                    'event_link' => $detail->event_link,
                    'country_offices' => $detail->countryOffices->pluck('name')->all(),
                    'locations' => $detail->locations->pluck('name')->all(),
                ]),
            ]);

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'programUpdates' => $programUpdates,
            'filters' => $request->all(),
            'options' => [
                'resourceCategories' => ResourceCategory::orderBy('name')->get(['id', 'name']),
                'opportunityNewsCategories' => OpportunityNewsCategory::orderBy('name')->get(['id', 'name']),
                'serviceLocations' => ServiceLocation::orderBy('name')->get(['id', 'name']),
                'countryOffices' => CountryOffice::orderBy('name')->get(['id', 'name']),
                'locations' => Location::orderBy('name')->get(['id', 'country_office_id', 'name']),
            ],
        ]);
    }

    /**
     * @param  Builder<Model>  $query
     */
    private function applyMemberOnlyFilter(Builder $query, Request $request, string $filterKey): void
    {
        if ($request->filled($filterKey)) {
            $query->where('internal_members_only', $request->boolean($filterKey));
        }
    }
}
