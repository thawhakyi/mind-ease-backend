<?php

use App\Models\CounsellingProvider;
use App\Models\CountryOffice;
use App\Models\Location;
use App\Models\OpportunityNews;
use App\Models\OpportunityNewsCategory;
use App\Models\PageSetting;
use App\Models\ProgramUpdate;
use App\Models\ResourceCategory;
use App\Models\ResourceItem;
use App\Models\ResourceLanguage;
use App\Models\ServiceLocation;
use App\Models\Timeline;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

test('public content APIs expose stable JSON payloads', function () {
    Storage::fake('public');
    Storage::disk('public')->put('program-updates/features/update.jpg', 'image');

    $countryOffice = CountryOffice::create(['name' => 'Myanmar']);
    $location = Location::create([
        'country_office_id' => $countryOffice->id,
        'name' => 'Yangon',
    ]);

    $programUpdate = ProgramUpdate::create([
        'title' => 'Mental health workshop',
        'description' => '<p>Workshop details</p>',
        'quarter' => 'Quarter 1',
        'year' => 2026,
        'date' => '2026-05-21',
        'facilitator' => 'Mind Ease',
        'event_type' => 'Hybrid',
        'feature_image_path' => 'program-updates/features/update.jpg',
        'gallery_image_paths' => ['program-updates/gallery/a.jpg'],
        'is_published' => true,
        'sort_order' => 1,
    ]);
    $programUpdate->countryOffices()->attach($countryOffice);
    $activityDetail = $programUpdate->activityDetails()->create([
        'start_date' => '2026-05-21',
        'end_date' => '2026-05-22',
        'event_type' => 'Hybrid',
        'event_link' => 'https://example.com/event',
    ]);
    $activityDetail->countryOffices()->attach($countryOffice);
    $activityDetail->locations()->attach($location);

    ProgramUpdate::create([
        'title' => 'Draft workshop',
        'description' => '<p>Hidden</p>',
        'quarter' => 'Quarter 2',
        'year' => 2026,
        'date' => '2026-06-01',
        'facilitator' => 'Mind Ease',
        'event_type' => 'Online',
        'is_published' => false,
    ]);

    $newsCategory = OpportunityNewsCategory::create(['name' => 'Opportunity']);
    $news = OpportunityNews::create([
        'title' => 'Funding call',
        'description' => '<p>Apply now</p>',
        'featured_image_path' => 'opportunities-news/features/funding.jpg',
        'internal_members_only' => false,
        'is_published' => true,
    ]);
    $news->categories()->attach($newsCategory);

    $serviceLocation = ServiceLocation::create(['name' => 'Remote']);
    $provider = CounsellingProvider::create([
        'provider_name' => 'Care Team',
        'provider_background' => '<p>Clinical background</p>',
        'number_of_professionals' => 3,
        'professional_types' => 'Counsellors',
        'languages' => ['Myanmar', 'English'],
        'in_person' => false,
        'office_hours' => '9 AM - 5 PM',
        'contact_methods' => ['Email'],
        'phone_numbers' => ['+959000000000'],
        'email' => 'care@example.com',
        'website_url' => 'https://example.com',
        'sort_order' => 1,
        'logo_path' => 'counselling-providers/logos/care.jpg',
        'internal_members_only' => false,
        'is_published' => true,
    ]);
    $provider->serviceLocations()->attach($serviceLocation);

    Timeline::create([
        'title' => 'Launch',
        'year' => '2026',
        'description' => '<p>Mind Ease launches</p>',
        'sort_order' => 1,
        'featured_image_path' => 'timelines/features/launch.jpg',
    ]);

    $this->getJson('/api/v1/program-updates')
        ->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.title', 'Mental health workshop')
        ->assertJsonPath('data.0.country_offices.0.name', 'Myanmar')
        ->assertJsonPath('data.0.activity_details.0.locations.0', 'Yangon')
        ->assertJsonPath('data.0.feature_image_url', url('/storage/program-updates/features/update.jpg'));

    $this->getJson('/api/v1/opportunities-news')
        ->assertOk()
        ->assertJsonPath('data.0.title', 'Funding call')
        ->assertJsonPath('data.0.categories.0.name', 'Opportunity');

    $this->getJson('/api/v1/counselling-providers')
        ->assertOk()
        ->assertJsonPath('data.0.provider_name', 'Care Team')
        ->assertJsonPath('data.0.service_locations.0.name', 'Remote');

    $this->getJson('/api/v1/timelines')
        ->assertOk()
        ->assertJsonPath('data.0.title', 'Launch')
        ->assertJsonPath('data.0.featured_image_url', url('/storage/timelines/features/launch.jpg'));
});

test('unpublished pages return not found from public APIs', function () {
    PageSetting::findOrCreateForKey(PageSetting::OPPORTUNITIES_NEWS)
        ->update(['is_published' => false]);

    $this->getJson('/api/v1/opportunities-news')
        ->assertNotFound();
});

test('internal only pages require an allowed member', function () {
    config()->set('services.member_email_domains', ['example.org']);

    PageSetting::findOrCreateForKey(PageSetting::COUNSELLING_PROVIDERS)
        ->update([
            'internal_members_only' => true,
            'is_published' => true,
        ]);

    $this->getJson('/api/v1/counselling-providers')
        ->assertForbidden();

    $this->actingAs(User::factory()->create(['email' => 'guest@example.com']))
        ->getJson('/api/v1/counselling-providers')
        ->assertForbidden();

    $this->actingAs(User::factory()->create(['email' => 'member@example.org']))
        ->getJson('/api/v1/counselling-providers')
        ->assertOk();
});

test('program updates filter unpublished and internal only items', function () {
    config()->set('services.member_email_domains', ['example.org']);

    ProgramUpdate::create([
        'title' => 'Public update',
        'description' => '<p>Open</p>',
        'is_published' => true,
        'internal_members_only' => false,
        'sort_order' => 1,
    ]);

    ProgramUpdate::create([
        'title' => 'Member update',
        'description' => '<p>Member</p>',
        'is_published' => true,
        'internal_members_only' => true,
        'sort_order' => 2,
    ]);

    ProgramUpdate::create([
        'title' => 'Draft update',
        'description' => '<p>Draft</p>',
        'is_published' => false,
        'internal_members_only' => false,
    ]);

    $this->getJson('/api/v1/program-updates')
        ->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.title', 'Public update');

    $this->actingAs(User::factory()->create(['email' => 'member@example.org']))
        ->getJson('/api/v1/program-updates')
        ->assertOk()
        ->assertJsonCount(2, 'data')
        ->assertJsonFragment(['title' => 'Member update']);
});

test('opportunities news filter unpublished and internal only items', function () {
    config()->set('services.member_email_domains', ['example.org']);

    OpportunityNews::create([
        'title' => 'Public news',
        'description' => '<p>Open</p>',
        'is_published' => true,
        'internal_members_only' => false,
    ]);

    OpportunityNews::create([
        'title' => 'Member news',
        'description' => '<p>Member</p>',
        'is_published' => true,
        'internal_members_only' => true,
    ]);

    OpportunityNews::create([
        'title' => 'Draft news',
        'description' => '<p>Draft</p>',
        'is_published' => false,
        'internal_members_only' => false,
    ]);

    $this->getJson('/api/v1/opportunities-news')
        ->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.title', 'Public news');

    $this->actingAs(User::factory()->create(['email' => 'member@example.org']))
        ->getJson('/api/v1/opportunities-news')
        ->assertOk()
        ->assertJsonCount(2, 'data')
        ->assertJsonFragment(['title' => 'Member news']);
});

test('counselling providers filter unpublished and internal only items', function () {
    config()->set('services.member_email_domains', ['example.org']);

    CounsellingProvider::create([
        'provider_name' => 'Public provider',
        'is_published' => true,
        'internal_members_only' => false,
        'sort_order' => 1,
    ]);

    CounsellingProvider::create([
        'provider_name' => 'Member provider',
        'is_published' => true,
        'internal_members_only' => true,
        'sort_order' => 2,
    ]);

    CounsellingProvider::create([
        'provider_name' => 'Draft provider',
        'is_published' => false,
        'internal_members_only' => false,
    ]);

    $this->getJson('/api/v1/counselling-providers')
        ->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.provider_name', 'Public provider');

    $this->actingAs(User::factory()->create(['email' => 'member@example.org']))
        ->getJson('/api/v1/counselling-providers')
        ->assertOk()
        ->assertJsonCount(2, 'data')
        ->assertJsonFragment(['provider_name' => 'Member provider']);
});

test('member only resources are hidden from guests and visible to allowed members', function () {
    config()->set('services.member_email_domains', ['example.org']);

    $category = ResourceCategory::create(['name' => 'Toolkits']);
    $language = ResourceLanguage::create(['name' => 'English']);

    ResourceItem::create([
        'resource_category_id' => $category->id,
        'resource_language_id' => $language->id,
        'title' => 'Public toolkit',
        'description' => '<p>Open guidance</p>',
        'year' => 2026,
        'url' => 'https://example.com/public',
        'internal_members_only' => false,
        'is_published' => true,
        'sort_order' => 1,
        'feature_image_path' => 'resources/features/public.jpg',
    ]);

    ResourceItem::create([
        'resource_category_id' => $category->id,
        'resource_language_id' => $language->id,
        'title' => 'Member toolkit',
        'description' => '<p>Member guidance</p>',
        'year' => 2026,
        'url' => 'https://example.com/member',
        'internal_members_only' => true,
        'is_published' => true,
        'sort_order' => 2,
    ]);

    ResourceItem::create([
        'resource_category_id' => $category->id,
        'resource_language_id' => $language->id,
        'title' => 'Draft toolkit',
        'description' => '<p>Draft guidance</p>',
        'year' => 2026,
        'url' => 'https://example.com/draft',
        'internal_members_only' => false,
        'is_published' => false,
        'sort_order' => 3,
    ]);

    $this->getJson('/api/v1/resources')
        ->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.title', 'Public toolkit')
        ->assertJsonPath('data.0.category.name', 'Toolkits')
        ->assertJsonPath('data.0.language.name', 'English')
        ->assertJsonPath('data.0.feature_image_url', url('/storage/resources/features/public.jpg'));

    $this->actingAs(User::factory()->create(['email' => 'member@example.org']))
        ->getJson('/api/v1/resources')
        ->assertOk()
        ->assertJsonCount(2, 'data')
        ->assertJsonPath('data.1.title', 'Member toolkit');
});

test('session endpoint reports member state from the configured domain allowlist', function () {
    config()->set('services.member_email_domains', ['example.org']);

    $this->getJson('/api/v1/session')
        ->assertOk()
        ->assertJsonPath('authenticated', false)
        ->assertJsonPath('is_member', false);

    $this->actingAs(User::factory()->create([
        'name' => 'Member User',
        'email' => 'member@example.org',
        'avatar_url' => 'https://example.com/avatar.jpg',
    ]))
        ->getJson('/api/v1/session')
        ->assertOk()
        ->assertJsonPath('authenticated', true)
        ->assertJsonPath('is_member', true)
        ->assertJsonPath('user.email', 'member@example.org');
});
