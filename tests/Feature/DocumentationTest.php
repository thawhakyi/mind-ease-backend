<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected away from documentation', function () {
    $this->get(route('documentation'))->assertRedirect(route('login'));
    $this->get(route('documentation.asset', '01-login.png'))->assertRedirect(route('login'));
});

test('authenticated users can view admin documentation', function () {
    $this->actingAs(User::factory()->create());

    $this->get(route('documentation'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('documentation/admin-user-guide')
            ->where('contentHtml', fn (string $contentHtml) => str_contains($contentHtml, 'Mind Ease Admin User Guide')
                && str_contains($contentHtml, 'id="sign-in"')
                && str_contains($contentHtml, '/documentation/assets/01-login.png'))
            ->has('tableOfContents')
            ->where('tableOfContents.0.id', 'sign-in')
            ->where('tableOfContents.0.title', 'Sign In')
            ->where('tableOfContents.0.level', 2)
        );
});

test('authenticated users can view documentation screenshots', function () {
    $this->actingAs(User::factory()->create());

    $this->get(route('documentation.asset', '01-login.png'))
        ->assertOk()
        ->assertHeader('content-type', 'image/png');
});

test('documentation assets reject invalid paths', function () {
    $this->actingAs(User::factory()->create());

    $this->get(route('documentation.asset', '../.env'))->assertNotFound();
});
