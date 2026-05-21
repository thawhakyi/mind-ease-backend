<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
    public function redirect(): RedirectResponse
    {
        return Socialite::driver('google')->redirect();
    }

    public function callback(): RedirectResponse
    {
        $googleUser = Socialite::driver('google')->user();
        $email = strtolower((string) $googleUser->getEmail());

        abort_unless($this->isAllowedMemberEmail($email), 403);

        $user = User::query()->updateOrCreate(
            ['email' => $email],
            [
                'name' => $googleUser->getName() ?: $email,
                'google_id' => $googleUser->getId(),
                'avatar_url' => $googleUser->getAvatar(),
                'email_verified_at' => now(),
                'password' => Str::random(48),
            ],
        );

        Auth::login($user, remember: true);
        request()->session()->regenerate();

        return redirect()->away(config('app.frontend_url'));
    }

    public function logout(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->away(config('app.frontend_url'));
    }

    private function isAllowedMemberEmail(string $email): bool
    {
        $domain = Str::of($email)->after('@')->lower()->toString();

        return $domain !== '' && in_array($domain, config('services.member_email_domains', []), true);
    }
}
