<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\PageSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class PageSettingController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('site-settings/page-setting', [
            'pageSettings' => $this->pageSettingsPayload(),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'settings' => ['required', 'array', 'size:4'],
            'settings.*.key' => ['required', 'string', 'distinct', Rule::in(array_keys(PageSetting::LABELS))],
            'settings.*.internal_members_only' => ['required', 'boolean'],
            'settings.*.is_published' => ['required', 'boolean'],
        ]);

        foreach ($validated['settings'] as $setting) {
            PageSetting::findOrCreateForKey($setting['key'])->update([
                'internal_members_only' => $setting['internal_members_only'],
                'is_published' => $setting['is_published'],
            ]);
        }

        return to_route('page-settings.edit');
    }

    /**
     * @return array<int, array{key: string, label: string, internal_members_only: bool, is_published: bool}>
     */
    private function pageSettingsPayload(): array
    {
        return collect(PageSetting::LABELS)
            ->map(fn (string $label, string $key): array => [
                'key' => $key,
                'label' => $label,
                'internal_members_only' => PageSetting::findOrCreateForKey($key)->internal_members_only,
                'is_published' => PageSetting::findOrCreateForKey($key)->is_published,
            ])
            ->values()
            ->all();
    }
}
