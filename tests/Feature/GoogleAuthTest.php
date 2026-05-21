<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\RedirectResponse;
use Laravel\Socialite\Contracts\Factory as SocialiteFactory;
use Laravel\Socialite\Contracts\Provider;
use Laravel\Socialite\Contracts\User as SocialiteUser;

uses(RefreshDatabase::class);

test('google redirect sends users to the provider', function () {
    $provider = Mockery::mock(Provider::class);
    $provider->shouldReceive('redirect')
        ->once()
        ->andReturn(new RedirectResponse('https://accounts.google.com/o/oauth2/auth'));

    $socialite = Mockery::mock(SocialiteFactory::class);
    $socialite->shouldReceive('driver')
        ->once()
        ->with('google')
        ->andReturn($provider);

    $this->app->instance(SocialiteFactory::class, $socialite);

    $this->get(route('auth.google.redirect'))
        ->assertRedirect('https://accounts.google.com/o/oauth2/auth');
});

test('google callback creates and logs in allowed domain members', function () {
    config()->set('app.frontend_url', 'http://localhost:3000');
    config()->set('services.member_email_domains', ['example.org']);

    mockGoogleUser(
        id: 'google-user-1',
        name: 'Member User',
        email: 'member@example.org',
        avatar: 'https://example.com/avatar.jpg',
    );

    $this->get(route('auth.google.callback'))
        ->assertRedirect('http://localhost:3000');

    $this->assertAuthenticated();

    $this->assertDatabaseHas('users', [
        'email' => 'member@example.org',
        'name' => 'Member User',
        'google_id' => 'google-user-1',
        'avatar_url' => 'https://example.com/avatar.jpg',
    ]);
});

test('google callback rejects disallowed domains', function () {
    config()->set('services.member_email_domains', ['example.org']);

    mockGoogleUser(
        id: 'google-user-2',
        name: 'External User',
        email: 'external@other.test',
        avatar: null,
    );

    $this->get(route('auth.google.callback'))->assertForbidden();

    $this->assertGuest();
    expect(User::query()->count())->toBe(0);
});

test('logout clears the Laravel session and returns to the frontend', function () {
    config()->set('app.frontend_url', 'http://localhost:3000');

    $this->actingAs(User::factory()->create())
        ->post(route('auth.logout'))
        ->assertRedirect('http://localhost:3000');

    $this->assertGuest();
});

function mockGoogleUser(string $id, string $name, string $email, ?string $avatar): void
{
    $googleUser = Mockery::mock(SocialiteUser::class);
    $googleUser->shouldReceive('getId')->andReturn($id);
    $googleUser->shouldReceive('getName')->andReturn($name);
    $googleUser->shouldReceive('getEmail')->andReturn($email);
    $googleUser->shouldReceive('getAvatar')->andReturn($avatar);

    $provider = Mockery::mock(Provider::class);
    $provider->shouldReceive('user')->once()->andReturn($googleUser);

    $socialite = Mockery::mock(SocialiteFactory::class);
    $socialite->shouldReceive('driver')
        ->once()
        ->with('google')
        ->andReturn($provider);

    app()->instance(SocialiteFactory::class, $socialite);
}
