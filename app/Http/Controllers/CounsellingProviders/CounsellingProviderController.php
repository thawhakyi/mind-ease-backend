<?php

namespace App\Http\Controllers\CounsellingProviders;

use App\Http\Controllers\Controller;
use App\Models\CounsellingProvider;
use App\Models\ServiceLocation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CounsellingProviderController extends Controller
{
    private const LANGUAGES = ['Myanmar', 'English', 'Thai'];

    private const CONTACT_METHODS = [
        'Call',
        'Email',
        'Messenger',
        'Telegram',
        'Signal',
        'Line',
        'WhatsApp',
    ];

    public function index(): Response
    {
        return Inertia::render('counselling-providers/index', [
            'providers' => CounsellingProvider::query()
                ->with('serviceLocations:id,name')
                ->orderBy('sort_order')
                ->latest()
                ->get()
                ->map(fn (CounsellingProvider $provider) => [
                    'id' => $provider->id,
                    'provider_name' => $provider->provider_name,
                    'provider_background' => str($provider->provider_background)->stripTags()->toString(),
                    'number_of_professionals' => $provider->number_of_professionals,
                    'professional_types' => $provider->professional_types,
                    'languages' => implode(', ', $provider->languages ?? []),
                    'service_locations' => $provider->serviceLocations->pluck('name')->implode(', '),
                    'in_person' => $provider->in_person,
                    'contact_methods' => implode(', ', $provider->contact_methods ?? []),
                    'email' => $provider->email,
                    'sort_order' => $provider->sort_order,
                    'internal_members_only' => $provider->internal_members_only,
                    'is_published' => $provider->is_published,
                    'created_at' => $provider->created_at->toFormattedDateString(),
                ]),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('counselling-providers/create', [
            'languageOptions' => self::LANGUAGES,
            'contactMethodOptions' => self::CONTACT_METHODS,
            'serviceLocations' => $this->serviceLocationsPayload(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validatedAttributes($request);
        $serviceLocationIds = $validated['service_location_ids'] ?? [];
        unset($validated['service_location_ids']);

        $provider = CounsellingProvider::create($validated);
        $provider->serviceLocations()->sync($serviceLocationIds);

        return to_route('counselling-providers.index');
    }

    public function edit(CounsellingProvider $counselling_provider): Response
    {
        return Inertia::render('counselling-providers/edit', [
            'provider' => [
                ...$counselling_provider->only([
                    'id',
                    'provider_name',
                    'provider_background',
                    'number_of_professionals',
                    'professional_types',
                    'languages',
                    'service_modes',
                    'office_hours',
                    'contact_methods',
                    'phone_numbers',
                    'email',
                    'website_url',
                    'facebook_page_name',
                    'facebook_url',
                    'sort_order',
                    'logo_path',
                    'internal_members_only',
                    'is_published',
                ]),
                'service_location_ids' => $counselling_provider->serviceLocations()
                    ->pluck('service_locations.id')
                    ->all(),
            ],
            'languageOptions' => self::LANGUAGES,
            'contactMethodOptions' => self::CONTACT_METHODS,
            'serviceLocations' => $this->serviceLocationsPayload(),
        ]);
    }

    public function update(Request $request, CounsellingProvider $counselling_provider): RedirectResponse
    {
        $validated = $this->validatedAttributes($request);
        $serviceLocationIds = $validated['service_location_ids'] ?? [];
        unset($validated['service_location_ids']);

        $counselling_provider->update($validated);
        $counselling_provider->serviceLocations()->sync($serviceLocationIds);

        return to_route('counselling-providers.index');
    }

    public function destroy(CounsellingProvider $counselling_provider): RedirectResponse
    {
        $counselling_provider->delete();

        return to_route('counselling-providers.index');
    }

    /**
     * @return array{
     *     provider_name: string,
     *     provider_background?: string|null,
     *     number_of_professionals?: int|null,
     *     professional_types?: string|null,
     *     languages?: array<int, string>|null,
     *     service_location_ids?: array<int, int>,
     *     service_modes?: array<int, string>|null,
     *     office_hours?: string|null,
     *     contact_methods?: array<int, string>|null,
     *     phone_numbers?: array<int, string>|null,
     *     email?: string|null,
     *     website_url?: string|null,
     *     facebook_page_name?: string|null,
     *     facebook_url?: string|null,
     *     sort_order: int,
     *     logo_path?: string,
     *     internal_members_only: bool,
     *     is_published: bool
     * }
     */
    private function validatedAttributes(Request $request): array
    {
        $validated = $request->validate([
            'provider_name' => ['required', 'string', 'max:255'],
            'provider_background' => ['nullable', 'string'],
            'number_of_professionals' => ['nullable', 'integer', 'min:0'],
            'professional_types' => ['nullable', 'string', 'max:255'],
            'languages' => ['nullable', 'array'],
            'languages.*' => ['string', Rule::in(self::LANGUAGES)],
            'service_location_ids' => ['nullable', 'array'],
            'service_location_ids.*' => ['integer', Rule::exists('service_locations', 'id')],
            'service_modes' => ['nullable', 'array'],
            'service_modes.*' => ['string', Rule::in(['In Person', 'Online'])],
            'office_hours' => ['nullable', 'string', 'max:255'],
            'contact_methods' => ['nullable', 'array'],
            'contact_methods.*' => ['string', Rule::in(self::CONTACT_METHODS)],
            'phone_numbers' => ['nullable', 'array'],
            'phone_numbers.*' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],
            'website_url' => ['nullable', 'url', 'max:2048'],
            'facebook_page_name' => ['nullable', 'string', 'max:255'],
            'facebook_url' => ['nullable', 'url', 'max:2048'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'logo' => ['nullable', 'image', 'max:5120'],
            'internal_members_only' => ['nullable', 'boolean'],
            'is_published' => ['nullable', 'boolean'],
        ]);

        unset($validated['logo']);

        $validated['in_person'] = $request->boolean('in_person');
        $validated['sort_order'] = (int) ($validated['sort_order'] ?? 0);
        $validated['phone_numbers'] = array_values(array_filter($validated['phone_numbers'] ?? []));
        $validated['internal_members_only'] = $request->boolean('internal_members_only');
        $validated['is_published'] = $request->boolean('is_published');

        if ($request->hasFile('logo')) {
            $validated['logo_path'] = $request
                ->file('logo')
                ->store('counselling-providers/logos', 'public');
        }

        return $validated;
    }

    private function serviceLocationsPayload()
    {
        return ServiceLocation::query()
            ->orderBy('name')
            ->get(['id', 'name']);
    }
}

