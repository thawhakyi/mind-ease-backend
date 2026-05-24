<?php

namespace App\Http\Controllers;

use App\Models\CounsellingProvider;
use App\Models\OpportunityNews;
use App\Models\ProgramUpdate;
use App\Models\ResourceItem;
use Inertia\Inertia;
use Inertia\Response;

use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $resourceQuery = ResourceItem::where('is_published', true);
        if ($request->filled('resource_category_id')) $resourceQuery->where('resource_category_id', $request->input('resource_category_id'));
        if ($request->filled('resource_member_only')) $resourceQuery->where('internal_members_only', $request->boolean('resource_member_only'));

        $newsQuery = OpportunityNews::where('is_published', true);
        if ($request->filled('news_category_id')) $newsQuery->where('opportunity_news_category_id', $request->input('news_category_id'));
        if ($request->filled('news_member_only')) $newsQuery->where('internal_members_only', $request->boolean('news_member_only'));

        $counsellingQuery = CounsellingProvider::where('is_published', true);
        if ($request->filled('counselling_location_id')) {
            $counsellingQuery->whereHas('serviceLocations', fn($q) => $q->where('service_locations.id', $request->input('counselling_location_id')));
        }
        if ($request->filled('counselling_member_only')) $counsellingQuery->where('internal_members_only', $request->boolean('counselling_member_only'));

        $programUpdateQuery = ProgramUpdate::where('is_published', true);
        if ($request->filled('update_member_only')) $programUpdateQuery->where('internal_members_only', $request->boolean('update_member_only'));

        $stats = [
            'total_resources' => $resourceQuery->count(),
            'total_opportunities_news' => $newsQuery->count(),
            'total_counselling_providers' => $counsellingQuery->count(),
            'total_program_updates' => $programUpdateQuery->count(),
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
                'country_offices' => $programUpdate->countryOffices->map(fn ($co) => [
                    'id' => $co->id,
                    'name' => $co->name,
                ]),
                'activity_details' => $programUpdate->activityDetails->map(fn ($detail) => [
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
                'resourceCategories' => \App\Models\ResourceCategory::orderBy('name')->get(['id', 'name']),
                'opportunityNewsCategories' => \App\Models\OpportunityNewsCategory::orderBy('name')->get(['id', 'name']),
                'serviceLocations' => \App\Models\ServiceLocation::orderBy('name')->get(['id', 'name']),
                'countryOffices' => \App\Models\CountryOffice::orderBy('name')->get(['id', 'name']),
                'locations' => \App\Models\Location::orderBy('name')->get(['id', 'country_office_id', 'name']),
            ],
        ]);
    }
}
