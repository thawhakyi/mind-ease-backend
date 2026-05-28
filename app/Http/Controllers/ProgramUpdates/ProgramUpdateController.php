<?php

namespace App\Http\Controllers\ProgramUpdates;

use App\Http\Controllers\Controller;
use App\Models\CountryOffice;
use App\Models\Location;
use App\Models\ProgramUpdate;
use App\Models\ProgramUpdateActivityDetail;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ProgramUpdateController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('program-updates/index', [
            'programUpdates' => ProgramUpdate::query()
                ->with('countryOffices:id,name')
                ->oldest()
                ->get(['id', 'title', 'description', 'quarter', 'year', 'date', 'facilitator', 'event_type', 'internal_members_only', 'is_published', 'created_at'])
                ->map(fn (ProgramUpdate $programUpdate) => [
                    'id' => $programUpdate->id,
                    'title' => $programUpdate->title,
                    'description' => str($programUpdate->description ?? '')->stripTags()->toString(),
                    'quarter' => $programUpdate->quarter,
                    'year' => $programUpdate->year,
                    'date' => $programUpdate->date?->format('d/m/Y'),
                    'country_offices' => $programUpdate->countryOffices
                        ->pluck('name')
                        ->implode(', '),
                    'facilitator' => $programUpdate->facilitator,
                    'event_type' => $programUpdate->event_type,
                    'internal_members_only' => $programUpdate->internal_members_only,
                    'is_published' => $programUpdate->is_published,
                    'created_at' => $programUpdate->created_at->toFormattedDateString(),
                ]),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('program-updates/create', [
            'countryOffices' => CountryOffice::query()
                ->orderBy('name')
                ->get(['id', 'name']),
            'locations' => Location::query()
                ->with('countryOffice:id,name')
                ->orderBy('name')
                ->get(['id', 'country_office_id', 'name'])
                ->map(fn (Location $location) => [
                    'id' => $location->id,
                    'country_office_id' => $location->country_office_id,
                    'name' => $location->name,
                    'country_office' => $location->countryOffice?->name,
                ]),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validatedAttributes($request);
        $countryOfficeIds = $validated['country_office_ids'] ?? [];
        $activityDetails = $validated['activity_details'] ?? [];
        unset($validated['country_office_ids']);
        unset($validated['activity_details']);

        DB::transaction(function () use ($activityDetails, $countryOfficeIds, $validated): void {
            $programUpdate = ProgramUpdate::create($validated);
            $programUpdate->countryOffices()->sync($countryOfficeIds);
            $this->syncActivityDetails($programUpdate, $activityDetails);
        });

        return to_route('program-updates.index');
    }

    public function edit(ProgramUpdate $programUpdate): Response
    {
        $programUpdate->load([
            'activityDetails.countryOffices:id,name',
            'activityDetails.locations:id,name',
        ]);

        return Inertia::render('program-updates/edit', [
            'programUpdate' => $programUpdate->only([
                'id',
                'title',
                'description',
                'quarter',
                'year',
                'facilitator',
                'event_type',
                'feature_image_path',
                'gallery_image_paths',
                'internal_members_only',
                'is_published',
                'sort_order',
            ]),
            'programUpdateDate' => $programUpdate->date?->format('d/m/Y'),
            'programUpdateCountryOfficeIds' => $programUpdate->countryOffices()
                ->pluck('country_offices.id')
                ->all(),
            'programUpdateActivityDetails' => $this->activityDetailsPayload(
                $programUpdate->activityDetails,
            ),
            'countryOffices' => CountryOffice::query()
                ->orderBy('name')
                ->get(['id', 'name']),
            'locations' => Location::query()
                ->with('countryOffice:id,name')
                ->orderBy('name')
                ->get(['id', 'country_office_id', 'name'])
                ->map(fn (Location $location) => [
                    'id' => $location->id,
                    'country_office_id' => $location->country_office_id,
                    'name' => $location->name,
                    'country_office' => $location->countryOffice?->name,
                ]),
        ]);
    }

    public function update(Request $request, ProgramUpdate $programUpdate): RedirectResponse
    {
        $validated = $this->validatedAttributes($request, $programUpdate);
        $countryOfficeIds = $validated['country_office_ids'] ?? [];
        $activityDetails = $validated['activity_details'] ?? [];
        unset($validated['country_office_ids']);
        unset($validated['activity_details']);

        DB::transaction(function () use ($activityDetails, $countryOfficeIds, $programUpdate, $validated): void {
            $programUpdate->update($validated);
            $programUpdate->countryOffices()->sync($countryOfficeIds);
            $this->syncActivityDetails($programUpdate, $activityDetails);
        });

        return to_route('program-updates.index');
    }

    public function destroy(ProgramUpdate $programUpdate): RedirectResponse
    {
        $programUpdate->delete();

        return to_route('program-updates.index');
    }

    /**
     * @return array{title: string, description?: string|null, quarter?: string|null, year?: int|null, date?: string|null, country_office_ids?: array<int, int>, facilitator?: string|null, event_type?: string|null, feature_image_path?: string|null, gallery_image_paths?: array<int, string>, internal_members_only: bool, is_published: bool, sort_order: int, activity_details?: array<int, array{start_date: string|null, end_date: string|null, country_office_ids: array<int, int>, event_type: string|null, event_link: string|null, location_ids: array<int, int>}>}
     */
    private function validatedAttributes(Request $request, ?ProgramUpdate $programUpdate = null): array
    {
        $validator = Validator::make($request->all(), [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'quarter' => ['nullable', 'string', Rule::in(['Quarter 1', 'Quarter 2', 'Quarter 3', 'Quarter 4'])],
            'year' => ['nullable', 'integer', 'digits:4', 'min:1900', 'max:2100'],
            'date' => ['nullable', 'date_format:d/m/Y'],
            'country_office_ids' => ['nullable', 'array'],
            'country_office_ids.*' => ['integer', Rule::exists('country_offices', 'id')],
            'facilitator' => ['nullable', 'string', 'max:255'],
            'event_type' => ['nullable', 'string', Rule::in(['In Person', 'Online', 'Hybrid'])],
            'feature_image' => ['nullable', 'image', 'max:5120'],
            'gallery_images' => ['nullable', 'array'],
            'gallery_images.*' => ['image', 'max:5120'],
            'remove_feature_image' => ['nullable', 'boolean'],
            'existing_gallery_image_paths' => ['nullable', 'array'],
            'existing_gallery_image_paths.*' => ['string'],
            'sync_gallery_images' => ['nullable', 'boolean'],
            'internal_members_only' => ['nullable', 'boolean'],
            'is_published' => ['nullable', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'activity_details' => ['nullable', 'array'],
            'activity_details.*.start_date' => ['nullable', 'date_format:d/m/Y'],
            'activity_details.*.end_date' => ['nullable', 'date_format:d/m/Y'],
            'activity_details.*.country_office_ids' => ['nullable', 'array'],
            'activity_details.*.country_office_ids.*' => ['integer', Rule::exists('country_offices', 'id')],
            'activity_details.*.event_type' => ['nullable', 'string', Rule::in(['In Person', 'Online', 'Hybrid'])],
            'activity_details.*.event_link' => ['nullable', 'url', 'max:2048'],
            'activity_details.*.location_ids' => ['nullable', 'array'],
            'activity_details.*.location_ids.*' => ['integer', Rule::exists('locations', 'id')],
        ]);

        $validator->after(function ($validator) use ($request): void {
            foreach ($request->input('activity_details', []) as $index => $activityDetail) {
                $startDate = $this->parseDate($activityDetail['start_date'] ?? null);
                $endDate = $this->parseDate($activityDetail['end_date'] ?? null);

                if ($startDate && $endDate && $endDate->lessThan($startDate)) {
                    $validator->errors()->add(
                        "activity_details.$index.end_date",
                        'The end date must be on or after the start date.',
                    );
                }
            }
        });

        $validated = $validator->validate();
        $validated['date'] = filled($validated['date'] ?? null)
            ? CarbonImmutable::createFromFormat('d/m/Y', $validated['date'])->toDateString()
            : null;
        $validated['internal_members_only'] = $request->boolean('internal_members_only');
        $validated['is_published'] = $request->boolean('is_published');
        $validated['sort_order'] = (int) ($validated['sort_order'] ?? 0);

        $removeFeatureImage = $request->boolean('remove_feature_image');
        $shouldSyncGalleryImages = $request->boolean('sync_gallery_images');
        $retainedGalleryImagePaths = collect($validated['existing_gallery_image_paths'] ?? [])
            ->filter(fn ($path): bool => is_string($path))
            ->values();

        if ($programUpdate) {
            $currentGalleryImagePaths = collect($programUpdate->gallery_image_paths ?? []);
            $retainedGalleryImagePaths = $retainedGalleryImagePaths
                ->filter(fn (string $path): bool => $currentGalleryImagePaths->contains($path))
                ->values();
        }

        unset($validated['feature_image']);
        unset($validated['gallery_images']);
        unset($validated['remove_feature_image']);
        unset($validated['existing_gallery_image_paths']);
        unset($validated['sync_gallery_images']);

        if ($removeFeatureImage) {
            $validated['feature_image_path'] = null;
        }

        if ($request->hasFile('feature_image')) {
            $validated['feature_image_path'] = $request
                ->file('feature_image')
                ->store('program-updates/features', 'public');
        }

        $uploadedGalleryImagePaths = collect();

        if ($request->hasFile('gallery_images')) {
            $uploadedGalleryImagePaths = collect($request->file('gallery_images'))
                ->map(fn ($image): string => $image->store('program-updates/gallery', 'public'))
                ->values();
        }

        if ($shouldSyncGalleryImages || $uploadedGalleryImagePaths->isNotEmpty()) {
            $validated['gallery_image_paths'] = $retainedGalleryImagePaths
                ->merge($uploadedGalleryImagePaths)
                ->all();
        }

        $activityDetails = array_values(array_filter(
            $validated['activity_details'] ?? [],
            fn (array $activityDetail): bool => filled($activityDetail['start_date'] ?? null)
                || filled($activityDetail['end_date'] ?? null)
                || filled($activityDetail['event_type'] ?? null)
                || filled($activityDetail['event_link'] ?? null)
                || ! empty($activityDetail['country_office_ids'] ?? [])
                || ! empty($activityDetail['location_ids'] ?? []),
        ));

        $validated['activity_details'] = array_map(
            fn (array $activityDetail): array => [
                ...$activityDetail,
                'country_office_ids' => $activityDetail['country_office_ids'] ?? [],
                'event_link' => $activityDetail['event_link'] ?? null,
                'location_ids' => $activityDetail['location_ids'] ?? [],
                'start_date' => filled($activityDetail['start_date'] ?? null)
                    ? CarbonImmutable::createFromFormat('d/m/Y', $activityDetail['start_date'])->toDateString()
                    : null,
                'end_date' => filled($activityDetail['end_date'] ?? null)
                    ? CarbonImmutable::createFromFormat('d/m/Y', $activityDetail['end_date'])->toDateString()
                    : null,
            ],
            $activityDetails,
        );

        return $validated;
    }

    /**
     * @param  array<int, array{start_date: string, end_date: string, country_office_ids: array<int, int>, event_type: string, event_link: string|null, location_ids: array<int, int>}>  $activityDetails
     */
    private function syncActivityDetails(ProgramUpdate $programUpdate, array $activityDetails): void
    {
        $programUpdate->activityDetails()->delete();

        foreach ($activityDetails as $activityDetail) {
            $countryOfficeIds = $activityDetail['country_office_ids'];
            $locationIds = $activityDetail['location_ids'];

            $createdActivityDetail = $programUpdate->activityDetails()->create([
                'start_date' => $activityDetail['start_date'],
                'end_date' => $activityDetail['end_date'],
                'event_type' => $activityDetail['event_type'],
                'event_link' => $activityDetail['event_link'],
            ]);

            $createdActivityDetail->countryOffices()->sync($countryOfficeIds);
            $createdActivityDetail->locations()->sync($locationIds);
        }
    }

    /**
     * @param  EloquentCollection<int, ProgramUpdateActivityDetail>  $activityDetails
     * @return array<int, array{start_date: string|null, end_date: string|null, country_office_ids: array<int, int>, event_type: string|null, event_link: string|null, location_ids: array<int, int>}>
     */
    private function activityDetailsPayload(EloquentCollection $activityDetails): array
    {
        return $activityDetails
            ->map(fn ($activityDetail) => [
                'start_date' => $activityDetail->start_date?->format('d/m/Y'),
                'end_date' => $activityDetail->end_date?->format('d/m/Y'),
                'country_office_ids' => $activityDetail->countryOffices
                    ->pluck('id')
                    ->all(),
                'event_type' => $activityDetail->event_type,
                'event_link' => $activityDetail->event_link,
                'location_ids' => $activityDetail->locations
                    ->pluck('id')
                    ->all(),
            ])
            ->all();
    }

    private function parseDate(mixed $date): ?CarbonImmutable
    {
        if (! is_string($date)) {
            return null;
        }

        try {
            return CarbonImmutable::createFromFormat('d/m/Y', $date);
        } catch (\Throwable) {
            return null;
        }
    }
}
