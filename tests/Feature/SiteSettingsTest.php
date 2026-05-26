<?php

use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('guests are redirected away from site settings', function () {
    $this->get(route('site-settings'))->assertRedirect(route('login'));
    $this->put(route('site-settings.update'))->assertRedirect(route('login'));
});

test('authenticated users can view site settings', function () {
    $this->actingAs(User::factory()->create());

    SiteSetting::current()->update([
        'site_name' => 'Mind Ease',
        'tagline' => 'Support when it matters',
        'description' => '<p>Mental health and wellbeing resources.</p>',
        'email' => 'hello@example.com',
        'phone' => '+959123456789',
        'viber_channel_link' => 'https://invite.viber.com/example',
        'goal' => '<p>Improve access to care.</p>',
        'objectives' => '<ul><li>Connect people with timely support.</li></ul>',
    ]);

    $this->get(route('site-settings'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('site-settings')
            ->where('siteSettings.site_name', 'Mind Ease')
            ->where('siteSettings.tagline', 'Support when it matters')
            ->where('siteSettings.description', '<p>Mental health and wellbeing resources.</p>')
            ->where('siteSettings.email', 'hello@example.com')
            ->where('siteSettings.phone', '+959123456789')
            ->where('siteSettings.viber_channel_link', 'https://invite.viber.com/example')
            ->where('siteSettings.goal', '<p>Improve access to care.</p>')
            ->where('siteSettings.objectives', '<ul><li>Connect people with timely support.</li></ul>')
        );
});

test('authenticated users can update site settings', function () {
    $this->actingAs(User::factory()->create());

    $this->put(route('site-settings.update'), [
        'site_name' => 'Mind Ease Myanmar',
        'tagline' => 'Care, guidance, and connection',
        'description' => '<p>A public mental health support platform.</p>',
        'email' => 'contact@mindease.test',
        'phone' => '+959111222333',
        'viber_channel_link' => 'https://invite.viber.com/updated',
        'goal' => '<p>Make support easier to find.</p>',
        'objectives' => '<ol><li>Publish trusted programs, resources, and contacts.</li></ol>',
    ])->assertRedirect(route('site-settings'));

    $settings = SiteSetting::current()->refresh();

    expect($settings->site_name)->toBe('Mind Ease Myanmar')
        ->and($settings->tagline)->toBe('Care, guidance, and connection')
        ->and($settings->description)->toBe('<p>A public mental health support platform.</p>')
        ->and($settings->email)->toBe('contact@mindease.test')
        ->and($settings->phone)->toBe('+959111222333')
        ->and($settings->viber_channel_link)->toBe('https://invite.viber.com/updated')
        ->and($settings->goal)->toBe('<p>Make support easier to find.</p>')
        ->and($settings->objectives)->toBe('<ol><li>Publish trusted programs, resources, and contacts.</li></ol>');
});

test('site settings require a valid email when email is present', function () {
    $this->actingAs(User::factory()->create());

    $this->put(route('site-settings.update'), [
        'site_name' => 'Mind Ease',
        'email' => 'not-an-email',
    ])->assertSessionHasErrors('email');
});

test('site settings require a valid viber channel link when present', function () {
    $this->actingAs(User::factory()->create());

    $this->put(route('site-settings.update'), [
        'site_name' => 'Mind Ease',
        'viber_channel_link' => 'not-a-url',
    ])->assertSessionHasErrors('viber_channel_link');
});
