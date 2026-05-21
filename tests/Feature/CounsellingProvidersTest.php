<?php

use App\Models\CounsellingProvider;
use App\Models\ServiceLocation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('guests are redirected away from counselling provider management', function () {
    $this->get(route('counselling-providers.index'))->assertRedirect(route('login'));
    $this->get(route('counselling-providers.create'))->assertRedirect(route('login'));
    $this->get(route('counselling-providers.service-locations.index'))->assertRedirect(route('login'));
});

test('authenticated users can view counselling provider management pages', function () {
    $this->actingAs(User::factory()->create());

    $this->get(route('counselling-providers.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('counselling-providers/index')
            ->has('providers')
        );

    $this->get(route('counselling-providers.create'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('counselling-providers/create')
            ->has('serviceLocations')
        );

    $this->get(route('counselling-providers.service-locations.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('counselling-providers/service-locations')
            ->has('serviceLocations')
        );
});

test('authenticated users can create update and delete a counselling provider', function () {
    $this->actingAs(User::factory()->create());
    Storage::fake('public');

    $yangon = ServiceLocation::create(['name' => 'Yangon']);
    $maeSot = ServiceLocation::create(['name' => 'Mae Sot']);

    $this->post(route('counselling-providers.store'), [
        'provider_name' => 'Mind Care',
        'provider_background' => '<p>Trauma-informed counselling.</p>',
        'number_of_professionals' => 8,
        'professional_types' => 'Counsellors, psychologists',
        'languages' => ['Myanmar', 'English'],
        'service_location_ids' => [$yangon->id, $maeSot->id],
        'in_person' => '1',
        'office_hours' => 'Mon-Fri 9am-5pm',
        'contact_methods' => ['Call', 'Email', 'Signal'],
        'phone_numbers' => ['+959123456789', '+66612345678'],
        'email' => 'care@example.com',
        'website_url' => 'https://example.com',
        'facebook_page_name' => 'Mind Care Myanmar',
        'facebook_url' => 'https://facebook.com/mindcare',
        'sort_order' => 3,
        'logo' => UploadedFile::fake()->image('logo.jpg'),
        'internal_members_only' => '1',
        'is_published' => '1',
    ])->assertRedirect(route('counselling-providers.index'));

    $provider = CounsellingProvider::query()->firstOrFail();

    expect($provider->provider_name)->toBe('Mind Care')
        ->and($provider->provider_background)->toBe('<p>Trauma-informed counselling.</p>')
        ->and($provider->number_of_professionals)->toBe(8)
        ->and($provider->professional_types)->toBe('Counsellors, psychologists')
        ->and($provider->languages)->toEqualCanonicalizing(['Myanmar', 'English'])
        ->and($provider->serviceLocations()->pluck('service_locations.id')->all())
        ->toEqualCanonicalizing([$yangon->id, $maeSot->id])
        ->and($provider->in_person)->toBeTrue()
        ->and($provider->office_hours)->toBe('Mon-Fri 9am-5pm')
        ->and($provider->contact_methods)->toEqualCanonicalizing(['Call', 'Email', 'Signal'])
        ->and($provider->phone_numbers)->toEqualCanonicalizing(['+959123456789', '+66612345678'])
        ->and($provider->email)->toBe('care@example.com')
        ->and($provider->website_url)->toBe('https://example.com')
        ->and($provider->facebook_page_name)->toBe('Mind Care Myanmar')
        ->and($provider->facebook_url)->toBe('https://facebook.com/mindcare')
        ->and($provider->sort_order)->toBe(3)
        ->and($provider->internal_members_only)->toBeTrue()
        ->and($provider->is_published)->toBeTrue()
        ->and($provider->logo_path)->not->toBeNull();

    Storage::disk('public')->assertExists($provider->logo_path);

    $this->patch(route('counselling-providers.update', $provider), [
        'provider_name' => 'Mind Care Updated',
        'provider_background' => '<p>Updated background.</p>',
        'number_of_professionals' => 10,
        'professional_types' => 'Clinical counsellors',
        'languages' => ['Thai'],
        'service_location_ids' => [$maeSot->id],
        'in_person' => '0',
        'office_hours' => 'Weekends',
        'contact_methods' => ['Line', 'WhatsApp'],
        'phone_numbers' => ['+66000000000'],
        'email' => 'updated@example.com',
        'website_url' => 'https://updated.example.com',
        'facebook_page_name' => 'Mind Care Updated',
        'facebook_url' => 'https://facebook.com/mindcareupdated',
        'sort_order' => 7,
        'logo' => UploadedFile::fake()->image('logo-updated.jpg'),
        'internal_members_only' => '0',
        'is_published' => '0',
    ])->assertRedirect(route('counselling-providers.index'));

    expect($provider->refresh()->provider_name)->toBe('Mind Care Updated')
        ->and($provider->number_of_professionals)->toBe(10)
        ->and($provider->languages)->toEqualCanonicalizing(['Thai'])
        ->and($provider->serviceLocations()->pluck('service_locations.id')->all())
        ->toEqualCanonicalizing([$maeSot->id])
        ->and($provider->in_person)->toBeFalse()
        ->and($provider->contact_methods)->toEqualCanonicalizing(['Line', 'WhatsApp'])
        ->and($provider->phone_numbers)->toEqualCanonicalizing(['+66000000000'])
        ->and($provider->sort_order)->toBe(7)
        ->and($provider->internal_members_only)->toBeFalse()
        ->and($provider->is_published)->toBeFalse();

    $this->delete(route('counselling-providers.destroy', $provider))
        ->assertRedirect(route('counselling-providers.index'));

    expect(CounsellingProvider::query()->count())->toBe(0);
});

test('authenticated users can create a counselling provider with only a name', function () {
    $this->actingAs(User::factory()->create());

    $this->post(route('counselling-providers.store'), [
        'provider_name' => 'Mind Care',
    ])->assertRedirect(route('counselling-providers.index'));

    $provider = CounsellingProvider::query()->firstOrFail();

    expect($provider->provider_name)->toBe('Mind Care')
        ->and($provider->provider_background)->toBeNull()
        ->and($provider->number_of_professionals)->toBeNull()
        ->and($provider->professional_types)->toBeNull()
        ->and($provider->languages)->toBeNull()
        ->and($provider->serviceLocations()->count())->toBe(0)
        ->and($provider->office_hours)->toBeNull()
        ->and($provider->contact_methods)->toBeNull()
        ->and($provider->phone_numbers)->toBe([])
        ->and($provider->email)->toBeNull();
});

test('authenticated users can manage service locations', function () {
    $this->actingAs(User::factory()->create());

    $this->post(route('counselling-providers.service-locations.store'), [
        'name' => 'Yangon',
    ])->assertRedirect(route('counselling-providers.service-locations.index'));

    $location = ServiceLocation::query()->firstOrFail();

    $this->patch(route('counselling-providers.service-locations.update', $location), [
        'name' => 'Mae Sot',
    ])->assertRedirect(route('counselling-providers.service-locations.index'));

    expect($location->refresh()->name)->toBe('Mae Sot');

    $this->delete(route('counselling-providers.service-locations.destroy', $location))
        ->assertRedirect(route('counselling-providers.service-locations.index'));

    expect(ServiceLocation::query()->count())->toBe(0);
});
