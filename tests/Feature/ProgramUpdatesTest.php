<?php

use App\Models\CountryOffice;
use App\Models\Location;
use App\Models\ProgramUpdate;
use App\Models\ProgramUpdateActivityDetail;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('guests are redirected away from program update management', function () {
    $this->get(route('program-updates.index'))->assertRedirect(route('login'));
    $this->get(route('program-updates.create'))->assertRedirect(route('login'));
    $this->get(route('program-updates.country-offices.index'))->assertRedirect(route('login'));
    $this->get(route('program-updates.locations.index'))->assertRedirect(route('login'));
});

test('authenticated users can view program update management pages', function () {
    $this->actingAs(User::factory()->create());

    $this->get(route('program-updates.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('program-updates/index')
            ->has('programUpdates')
        );

    $this->get(route('program-updates.create'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('program-updates/create')
            ->has('countryOffices')
            ->has('locations')
        );

    $this->get(route('program-updates.country-offices.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('program-updates/country-offices')
            ->has('countryOffices')
        );

    $this->get(route('program-updates.locations.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('program-updates/locations')
            ->has('locations')
            ->has('countryOffices')
        );
});

test('program updates index shows last added items last by default', function () {
    $this->actingAs(User::factory()->create());

    $firstUpdate = ProgramUpdate::create(['title' => 'First update']);
    $secondUpdate = ProgramUpdate::create(['title' => 'Second update']);

    $firstUpdate->forceFill(['created_at' => now()->subDays(2)])->save();
    $secondUpdate->forceFill(['created_at' => now()->subDay()])->save();

    $this->get(route('program-updates.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('program-updates/index')
            ->where('programUpdates.0.title', 'First update')
            ->where('programUpdates.1.title', 'Second update')
        );
});

test('authenticated users can create update and delete a program update', function () {
    $this->actingAs(User::factory()->create());
    Storage::fake('public');

    $myanmarOffice = CountryOffice::create(['name' => 'Myanmar Country Office']);
    $thailandOffice = CountryOffice::create(['name' => 'Thailand Country Office']);
    $yangon = Location::create([
        'country_office_id' => $myanmarOffice->id,
        'name' => 'Yangon',
    ]);
    $bangkok = Location::create([
        'country_office_id' => $thailandOffice->id,
        'name' => 'Bangkok',
    ]);

    $this->post(route('program-updates.store'), [
        'title' => 'Nutrition program launch',
        'description' => '<p>Initial rollout completed.</p>',
        'quarter' => 'Quarter 1',
        'year' => 2026,
        'date' => '20/05/2026',
        'country_office_ids' => [$myanmarOffice->id, $thailandOffice->id],
        'facilitator' => 'Daw Aye Aye',
        'event_type' => 'Hybrid',
        'feature_image' => UploadedFile::fake()->image('feature.jpg'),
        'gallery_images' => [
            UploadedFile::fake()->image('gallery-1.jpg'),
            UploadedFile::fake()->image('gallery-2.jpg'),
        ],
        'internal_members_only' => '1',
        'is_published' => '1',
        'sort_order' => 5,
        'activity_details' => [
            [
                'start_date' => '20/05/2026',
                'end_date' => '21/05/2026',
                'country_office_ids' => [$myanmarOffice->id],
                'event_type' => 'Online',
                'event_link' => 'https://example.com/activity',
                'location_ids' => [$yangon->id],
            ],
            [
                'start_date' => '22/05/2026',
                'end_date' => '22/05/2026',
                'country_office_ids' => [$thailandOffice->id],
                'event_type' => 'In Person',
                'event_link' => null,
                'location_ids' => [$bangkok->id],
            ],
        ],
    ])->assertRedirect(route('program-updates.index'));

    $programUpdate = ProgramUpdate::query()->firstOrFail();
    $onlineActivity = ProgramUpdateActivityDetail::query()
        ->where('event_type', 'Online')
        ->firstOrFail();

    expect($programUpdate->title)->toBe('Nutrition program launch')
        ->and($programUpdate->description)->toBe('<p>Initial rollout completed.</p>')
        ->and($programUpdate->quarter)->toBe('Quarter 1')
        ->and($programUpdate->year)->toBe(2026)
        ->and($programUpdate->date->format('d/m/Y'))->toBe('20/05/2026')
        ->and($programUpdate->facilitator)->toBe('Daw Aye Aye')
        ->and($programUpdate->event_type)->toBe('Hybrid')
        ->and($programUpdate->feature_image_path)->not->toBeNull()
        ->and($programUpdate->gallery_image_paths)->toHaveCount(2)
        ->and($programUpdate->internal_members_only)->toBeTrue()
        ->and($programUpdate->is_published)->toBeTrue()
        ->and($programUpdate->sort_order)->toBe(5)
        ->and($programUpdate->countryOffices()->pluck('country_offices.id')->all())
        ->toEqualCanonicalizing([$myanmarOffice->id, $thailandOffice->id])
        ->and($programUpdate->activityDetails()->count())->toBe(2)
        ->and($onlineActivity->start_date->format('d/m/Y'))->toBe('20/05/2026')
        ->and($onlineActivity->end_date->format('d/m/Y'))->toBe('21/05/2026')
        ->and($onlineActivity->event_link)->toBe('https://example.com/activity')
        ->and($onlineActivity->countryOffices()->pluck('country_offices.id')->all())
        ->toEqualCanonicalizing([$myanmarOffice->id])
        ->and($onlineActivity->locations()->pluck('locations.id')->all())
        ->toEqualCanonicalizing([$yangon->id]);

    Storage::disk('public')->assertExists($programUpdate->feature_image_path);
    Storage::disk('public')->assertExists($programUpdate->gallery_image_paths[0]);
    Storage::disk('public')->assertExists($programUpdate->gallery_image_paths[1]);

    $this->patch(route('program-updates.update', $programUpdate), [
        'title' => 'Nutrition program launch updated',
        'description' => '<p>Second rollout completed.</p>',
        'quarter' => 'Quarter 2',
        'year' => 2027,
        'date' => '21/06/2027',
        'country_office_ids' => [$thailandOffice->id],
        'facilitator' => 'U Mg Mg',
        'event_type' => 'Online',
        'feature_image' => UploadedFile::fake()->image('feature-updated.jpg'),
        'gallery_images' => [
            UploadedFile::fake()->image('gallery-updated.jpg'),
        ],
        'internal_members_only' => '0',
        'is_published' => '0',
        'sort_order' => 9,
        'activity_details' => [
            [
                'start_date' => '23/06/2027',
                'end_date' => '24/06/2027',
                'country_office_ids' => [$thailandOffice->id],
                'event_type' => 'Hybrid',
                'event_link' => null,
                'location_ids' => [$bangkok->id],
            ],
        ],
    ])->assertRedirect(route('program-updates.index'));

    $updatedActivity = $programUpdate->refresh()->activityDetails()->firstOrFail();

    expect($programUpdate->refresh()->title)->toBe('Nutrition program launch updated')
        ->and($programUpdate->description)->toBe('<p>Second rollout completed.</p>')
        ->and($programUpdate->quarter)->toBe('Quarter 2')
        ->and($programUpdate->date->format('d/m/Y'))->toBe('21/06/2027')
        ->and($programUpdate->feature_image_path)->not->toBeNull()
        ->and($programUpdate->gallery_image_paths)->toHaveCount(1)
        ->and($programUpdate->internal_members_only)->toBeFalse()
        ->and($programUpdate->is_published)->toBeFalse()
        ->and($programUpdate->sort_order)->toBe(9)
        ->and($programUpdate->countryOffices()->pluck('country_offices.id')->all())
        ->toEqualCanonicalizing([$thailandOffice->id])
        ->and($programUpdate->activityDetails()->count())->toBe(1)
        ->and($updatedActivity->start_date->format('d/m/Y'))->toBe('23/06/2027')
        ->and($updatedActivity->end_date->format('d/m/Y'))->toBe('24/06/2027')
        ->and($updatedActivity->event_type)->toBe('Hybrid')
        ->and($updatedActivity->countryOffices()->pluck('country_offices.id')->all())
        ->toEqualCanonicalizing([$thailandOffice->id])
        ->and($updatedActivity->locations()->pluck('locations.id')->all())
        ->toEqualCanonicalizing([$bangkok->id]);

    $this->delete(route('program-updates.destroy', $programUpdate))
        ->assertRedirect(route('program-updates.index'));

    expect(ProgramUpdate::query()->count())->toBe(0);
});

test('authenticated users can create a program update with only a title', function () {
    $this->actingAs(User::factory()->create());

    $this->post(route('program-updates.store'), [
        'title' => 'Nutrition program launch',
    ])->assertRedirect(route('program-updates.index'));

    $programUpdate = ProgramUpdate::query()->firstOrFail();

    expect($programUpdate->title)->toBe('Nutrition program launch')
        ->and($programUpdate->description)->toBeNull()
        ->and($programUpdate->quarter)->toBeNull()
        ->and($programUpdate->year)->toBeNull()
        ->and($programUpdate->date)->toBeNull()
        ->and($programUpdate->countryOffices()->count())->toBe(0)
        ->and($programUpdate->facilitator)->toBeNull()
        ->and($programUpdate->event_type)->toBeNull()
        ->and($programUpdate->activityDetails()->count())->toBe(0);
});

test('authenticated users can manage country offices and locations', function () {
    $this->actingAs(User::factory()->create());

    $this->post(route('program-updates.country-offices.store'), [
        'name' => 'Thailand Country Office',
    ])->assertRedirect(route('program-updates.country-offices.index'));

    $countryOffice = CountryOffice::query()->firstOrFail();

    $this->patch(route('program-updates.country-offices.update', $countryOffice), [
        'name' => 'Thailand Office',
    ])->assertRedirect(route('program-updates.country-offices.index'));

    expect($countryOffice->refresh()->name)->toBe('Thailand Office');

    $this->post(route('program-updates.locations.store'), [
        'country_office_id' => $countryOffice->id,
        'name' => 'Bangkok',
    ])->assertRedirect(route('program-updates.locations.index'));

    $location = Location::query()->firstOrFail();

    $this->patch(route('program-updates.locations.update', $location), [
        'country_office_id' => $countryOffice->id,
        'name' => 'Bangkok Field Office',
    ])->assertRedirect(route('program-updates.locations.index'));

    expect($location->refresh()->name)->toBe('Bangkok Field Office');

    $this->delete(route('program-updates.locations.destroy', $location))
        ->assertRedirect(route('program-updates.locations.index'));

    $this->delete(route('program-updates.country-offices.destroy', $countryOffice))
        ->assertRedirect(route('program-updates.country-offices.index'));

    expect(Location::query()->count())->toBe(0)
        ->and(CountryOffice::query()->count())->toBe(0);
});
