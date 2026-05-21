<?php

use App\Models\PageSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('page settings route uses plural page settings URL', function () {
    expect(route('page-settings.edit', absolute: false))->toBe('/site-settings/page-settings');
});

test('guests are redirected away from page settings', function () {
    $this->get(route('page-settings.edit'))->assertRedirect(route('login'));
    $this->put(route('page-settings.update'))->assertRedirect(route('login'));
});

test('authenticated users can view page settings', function () {
    $this->actingAs(User::factory()->create());

    $this->get(route('page-settings.edit'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('site-settings/page-setting')
            ->has('pageSettings', 4)
        );
});

test('authenticated users can update page settings', function () {
    $this->actingAs(User::factory()->create());

    $this->put(route('page-settings.update'), [
        'settings' => [
            [
                'key' => PageSetting::PROGRAM_UPDATES,
                'internal_members_only' => '1',
                'is_published' => '1',
            ],
            [
                'key' => PageSetting::OPPORTUNITIES_NEWS,
                'internal_members_only' => '0',
                'is_published' => '0',
            ],
            [
                'key' => PageSetting::RESOURCES,
                'internal_members_only' => '1',
                'is_published' => '0',
            ],
            [
                'key' => PageSetting::COUNSELLING_PROVIDERS,
                'internal_members_only' => '0',
                'is_published' => '1',
            ],
        ],
    ])->assertRedirect(route('page-settings.edit'));

    expect(PageSetting::findOrCreateForKey(PageSetting::PROGRAM_UPDATES)->internal_members_only)->toBeTrue()
        ->and(PageSetting::findOrCreateForKey(PageSetting::OPPORTUNITIES_NEWS)->is_published)->toBeFalse()
        ->and(PageSetting::findOrCreateForKey(PageSetting::RESOURCES)->internal_members_only)->toBeTrue()
        ->and(PageSetting::findOrCreateForKey(PageSetting::RESOURCES)->is_published)->toBeFalse();
});

test('page settings reject unknown keys', function () {
    $this->actingAs(User::factory()->create());

    $this->put(route('page-settings.update'), [
        'settings' => [
            [
                'key' => 'unknown_page',
                'internal_members_only' => false,
                'is_published' => true,
            ],
        ],
    ])->assertSessionHasErrors('settings.0.key');
});

test('page settings require boolean values', function () {
    $this->actingAs(User::factory()->create());

    $this->put(route('page-settings.update'), [
        'settings' => [
            [
                'key' => PageSetting::PROGRAM_UPDATES,
                'internal_members_only' => 'not-boolean',
                'is_published' => true,
            ],
        ],
    ])->assertSessionHasErrors('settings.0.internal_members_only');
});
