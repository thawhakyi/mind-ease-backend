<?php

use App\Models\CounsellingProvider;
use App\Models\CountryOffice;
use App\Models\Location;
use App\Models\OpportunityNews;
use App\Models\ProgramUpdate;
use App\Models\ProgramUpdateActivityDetail;
use App\Models\ResourceItem;
use App\Models\ResourceCategory;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));
    $response->assertOk();
});

test('dashboard returns stats with correct counts for published records', function () {
    $this->actingAs(User::factory()->create());

    $category = ResourceCategory::create(['name' => 'Guide']);

    // Published records
    ProgramUpdate::create(['title' => 'Published Update', 'is_published' => true]);
    OpportunityNews::create(['title' => 'Published News', 'description' => 'Desc', 'is_published' => true]);
    ResourceItem::create(['title' => 'Published Resource', 'description' => 'Desc', 'year' => 2026, 'url' => 'https://example.com', 'resource_category_id' => $category->id, 'is_published' => true]);
    CounsellingProvider::create(['provider_name' => 'Published Provider', 'provider_background' => 'Bg', 'number_of_professionals' => 3, 'professional_types' => 'Psychologist', 'office_hours' => '9-5', 'email' => 'a@b.com', 'is_published' => true]);

    // Unpublished records — should NOT be counted
    ProgramUpdate::create(['title' => 'Draft Update', 'is_published' => false]);
    OpportunityNews::create(['title' => 'Draft News', 'description' => 'Desc', 'is_published' => false]);
    ResourceItem::create(['title' => 'Draft Resource', 'description' => 'Desc', 'year' => 2026, 'url' => 'https://example.com', 'resource_category_id' => $category->id, 'is_published' => false]);
    CounsellingProvider::create(['provider_name' => 'Draft Provider', 'provider_background' => 'Bg', 'number_of_professionals' => 1, 'professional_types' => 'Counselor', 'office_hours' => '9-5', 'email' => 'c@d.com', 'is_published' => false]);

    $this->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->has('stats')
            ->where('stats.total_program_updates', 1)
            ->where('stats.total_opportunities_news', 1)
            ->where('stats.total_resources', 1)
            ->where('stats.total_counselling_providers', 1)
            ->where('stats.total_program_updates_members_only', 0)
            ->where('stats.total_opportunities_news_members_only', 0)
            ->where('stats.total_resources_members_only', 0)
            ->where('stats.total_counselling_providers_members_only', 0)
        );
});

test('dashboard stats include internal members only counts', function () {
    $this->actingAs(User::factory()->create());

    $category = ResourceCategory::create(['name' => 'Manual']);

    ProgramUpdate::create(['title' => 'Members Update', 'is_published' => true, 'internal_members_only' => true]);
    ProgramUpdate::create(['title' => 'Public Update', 'is_published' => true, 'internal_members_only' => false]);
    OpportunityNews::create(['title' => 'Members News', 'description' => 'D', 'is_published' => true, 'internal_members_only' => true]);
    ResourceItem::create(['title' => 'Members Resource', 'description' => 'D', 'year' => 2026, 'url' => 'https://example.com', 'resource_category_id' => $category->id, 'is_published' => true, 'internal_members_only' => true]);
    CounsellingProvider::create(['provider_name' => 'Members Provider', 'provider_background' => 'B', 'number_of_professionals' => 2, 'professional_types' => 'P', 'office_hours' => '9-5', 'email' => 'e@f.com', 'is_published' => true, 'internal_members_only' => true]);

    $this->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('stats.total_program_updates', 2)
            ->where('stats.total_program_updates_members_only', 1)
            ->where('stats.total_opportunities_news', 1)
            ->where('stats.total_opportunities_news_members_only', 1)
            ->where('stats.total_resources', 1)
            ->where('stats.total_resources_members_only', 1)
            ->where('stats.total_counselling_providers', 1)
            ->where('stats.total_counselling_providers_members_only', 1)
        );
});

test('dashboard returns program updates with activity details for calendar', function () {
    $this->actingAs(User::factory()->create());

    $office = CountryOffice::create(['name' => 'Myanmar Office']);
    $location = Location::create(['country_office_id' => $office->id, 'name' => 'Yangon']);

    $update = ProgramUpdate::create([
        'title' => 'Workshop Event',
        'description' => '<p>Workshop details</p>',
        'quarter' => 'Quarter 1',
        'year' => 2026,
        'date' => '2026-05-20',
        'facilitator' => 'Daw Aye',
        'event_type' => 'Hybrid',
        'is_published' => true,
    ]);
    $update->countryOffices()->attach($office->id);

    $activity = $update->activityDetails()->create([
        'start_date' => '2026-05-20',
        'end_date' => '2026-05-21',
        'event_type' => 'Online',
        'event_link' => 'https://example.com/meet',
    ]);
    $activity->countryOffices()->attach($office->id);
    $activity->locations()->attach($location->id);

    $this->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('programUpdates', 1)
            ->has('programUpdates.0', fn (Assert $update) => $update
                ->where('title', 'Workshop Event')
                ->has('activity_details', 1)
                ->has('activity_details.0', fn (Assert $detail) => $detail
                    ->where('start_date', '20/05/2026')
                    ->where('end_date', '21/05/2026')
                    ->where('event_type', 'Online')
                    ->where('event_link', 'https://example.com/meet')
                    ->has('country_offices', 1)
                    ->has('locations', 1)
                )
                ->etc()
            )
        );
});

test('dashboard only returns published program updates for calendar', function () {
    $this->actingAs(User::factory()->create());

    ProgramUpdate::create(['title' => 'Published', 'is_published' => true, 'date' => '2026-05-20']);
    ProgramUpdate::create(['title' => 'Draft', 'is_published' => false, 'date' => '2026-05-21']);

    $this->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('programUpdates', 1)
            ->where('programUpdates.0.title', 'Published')
        );
});

test('authenticated users can visit site settings', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('site-settings'));
    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('site-settings')
        );
});
