<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SiteSettingController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('site-settings', [
            'siteSettings' => SiteSetting::current()->only([
                'site_name',
                'tagline',
                'description',
                'email',
                'phone',
                'viber_channel_number',
                'goal',
                'objectives',
            ]),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        SiteSetting::current()->update($request->validate([
            'site_name' => ['nullable', 'string', 'max:255'],
            'tagline' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:255'],
            'viber_channel_number' => ['nullable', 'string', 'max:255'],
            'goal' => ['nullable', 'string'],
            'objectives' => ['nullable', 'string'],
        ]));

        return to_route('site-settings');
    }
}
