<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\CounsellingProvider;
use App\Models\OpportunityNews;
use App\Models\PageSetting;
use App\Models\ProgramUpdate;
use App\Models\ResourceItem;
use App\Models\SiteSetting;
use App\Models\Timeline;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PublicContentController extends Controller
{
    public function session(): JsonResponse
    {
        $user = Auth::user();

        return response()->json([
            'authenticated' => $user !== null,
            'is_member' => $user instanceof User && $this->isMember($user),
            'user' => $user instanceof User ? [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'avatar_url' => $user->avatar_url,
            ] : null,
        ]);
    }

    public function programUpdates(): JsonResponse
    {
        $this->authorizePage(PageSetting::PROGRAM_UPDATES);

        return response()->json(ProgramUpdate::query()
            ->with([
                'countryOffices:id,name',
                'activityDetails.countryOffices:id,name',
                'activityDetails.locations:id,name',
            ])
            ->where('is_published', true)
            ->when(! $this->currentUserIsMember(), fn ($query) => $query->where('internal_members_only', false))
            ->orderBy('sort_order')
            ->latest()
            ->paginate(15)
            ->through(fn (ProgramUpdate $programUpdate): array => [
                'id' => $programUpdate->id,
                'title' => $programUpdate->title,
                'description' => $programUpdate->description,
                'summary' => Str::of($programUpdate->description ?? '')->stripTags()->limit(220)->toString(),
                'quarter' => $programUpdate->quarter,
                'year' => $programUpdate->year,
                'date' => $programUpdate->date?->toDateString(),
                'facilitator' => $programUpdate->facilitator,
                'event_type' => $programUpdate->event_type,
                'country_offices' => $programUpdate->countryOffices->map(fn ($countryOffice): array => [
                    'id' => $countryOffice->id,
                    'name' => $countryOffice->name,
                ])->values(),
                'activity_details' => $programUpdate->activityDetails->map(fn ($activityDetail): array => [
                    'start_date' => $activityDetail->start_date?->toDateString(),
                    'end_date' => $activityDetail->end_date?->toDateString(),
                    'event_type' => $activityDetail->event_type,
                    'event_link' => $activityDetail->event_link,
                    'country_offices' => $activityDetail->countryOffices->pluck('name')->values(),
                    'locations' => $activityDetail->locations->pluck('name')->values(),
                ])->values(),
                'feature_image_url' => $this->publicUrl($programUpdate->feature_image_path),
                'gallery_image_urls' => collect($programUpdate->gallery_image_paths ?? [])
                    ->map(fn (string $path): ?string => $this->publicUrl($path))
                    ->filter()
                    ->values(),
            ]));
    }

    public function opportunitiesNews(): JsonResponse
    {
        $this->authorizePage(PageSetting::OPPORTUNITIES_NEWS);

        return response()->json(OpportunityNews::query()
            ->with('categories:id,name')
            ->where('is_published', true)
            ->when(! $this->currentUserIsMember(), fn ($query) => $query->where('internal_members_only', false))
            ->latest()
            ->paginate(15)
            ->through(fn (OpportunityNews $item): array => [
                'id' => $item->id,
                'title' => $item->title,
                'description' => $item->description,
                'summary' => Str::of($item->description)->stripTags()->limit(220)->toString(),
                'categories' => $item->categories->map(fn ($category): array => [
                    'id' => $category->id,
                    'name' => $category->name,
                ])->values(),
                'featured_image_url' => $this->publicUrl($item->featured_image_path),
                'created_at' => $item->created_at?->toDateString(),
            ]));
    }

    public function resources(): JsonResponse
    {
        $this->authorizePage(PageSetting::RESOURCES);

        return response()->json(ResourceItem::query()
            ->with(['category:id,name', 'language:id,name'])
            ->where('is_published', true)
            ->when(! $this->currentUserIsMember(), fn ($query) => $query->where('internal_members_only', false))
            ->orderBy('sort_order')
            ->latest()
            ->paginate(15)
            ->through(fn (ResourceItem $resource): array => [
                'id' => $resource->id,
                'title' => $resource->title,
                'description' => $resource->description,
                'summary' => Str::of($resource->description)->stripTags()->limit(220)->toString(),
                'year' => $resource->year,
                'url' => $resource->url,
                'internal_members_only' => $resource->internal_members_only,
                'category' => [
                    'id' => $resource->category->id,
                    'name' => $resource->category->name,
                ],
                'language' => $resource->language ? [
                    'id' => $resource->language->id,
                    'name' => $resource->language->name,
                ] : null,
                'feature_image_url' => $this->publicUrl($resource->feature_image_path),
            ]));
    }

    public function counsellingProviders(): JsonResponse
    {
        $this->authorizePage(PageSetting::COUNSELLING_PROVIDERS);

        return response()->json(CounsellingProvider::query()
            ->with('serviceLocations:id,name')
            ->where('is_published', true)
            ->when(! $this->currentUserIsMember(), fn ($query) => $query->where('internal_members_only', false))
            ->orderBy('sort_order')
            ->latest()
            ->paginate(15)
            ->through(fn (CounsellingProvider $provider): array => [
                'id' => $provider->id,
                'provider_name' => $provider->provider_name,
                'provider_background' => $provider->provider_background,
                'number_of_professionals' => $provider->number_of_professionals,
                'professional_types' => $provider->professional_types,
                'languages' => $provider->languages ?? [],
                'service_locations' => $provider->serviceLocations->map(fn ($location): array => [
                    'id' => $location->id,
                    'name' => $location->name,
                ])->values(),
                'service_modes' => $provider->service_modes ?? [],
                'in_person' => $provider->in_person,
                'office_hours' => $provider->office_hours,
                'contact_methods' => $provider->contact_methods ?? [],
                'phone_numbers' => $provider->phone_numbers ?? [],
                'email' => $provider->email,
                'website_url' => $provider->website_url,
                'facebook_page_name' => $provider->facebook_page_name,
                'facebook_url' => $provider->facebook_url,
                'logo_url' => $this->publicUrl($provider->logo_path),
            ]));
    }

    public function timelines(): JsonResponse
    {
        return response()->json(Timeline::query()
            ->orderBy('sort_order')
            ->latest()
            ->paginate(15)
            ->through(fn (Timeline $timeline): array => [
                'id' => $timeline->id,
                'title' => $timeline->title,
                'year' => $timeline->year,
                'description' => $timeline->description,
                'summary' => Str::of($timeline->description)->stripTags()->limit(220)->toString(),
                'featured_image_url' => $this->publicUrl($timeline->featured_image_path),
            ]));
    }

    private function currentUserIsMember(): bool
    {
        $secret = config('services.frontend_secret');
        $hasValidSecret = empty($secret) || request()->header('X-Frontend-Secret') === $secret;

        if ($hasValidSecret && request()->header('X-Is-Internal-Member') === 'true') {
            return true;
        }

        $user = Auth::user();

        return $user instanceof User && $this->isMember($user);
    }

    private function authorizePage(string $key): void
    {
        $setting = PageSetting::findOrCreateForKey($key);

        abort_if(! $setting->is_published, 404);
        abort_if($setting->internal_members_only && ! $this->currentUserIsMember(), 403);
    }

    private function isMember(User $user): bool
    {
        $domain = Str::of($user->email)->after('@')->lower()->toString();

        return $domain !== '' && in_array($domain, config('services.member_email_domains', []), true);
    }

    private function publicUrl(?string $path): ?string
    {
        if ($path === null || $path === '') {
            return null;
        }

        return url(Storage::disk('public')->url($path));
    }

    public function siteSettings(): JsonResponse
    {
        return response()->json([
            'data' => SiteSetting::current()->only([
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
}
