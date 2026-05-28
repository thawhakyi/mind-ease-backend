<?php

namespace App\Http\Controllers\Resources;

use App\Http\Controllers\Controller;
use App\Models\ResourceCategory;
use App\Models\ResourceItem;
use App\Models\ResourceLanguage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ResourceController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('resources/index', [
            'resources' => ResourceItem::query()
                ->with(['category:id,name', 'language:id,name'])
                ->orderBy('sort_order')
                ->oldest()
                ->get()
                ->map(fn (ResourceItem $resource) => [
                    'id' => $resource->id,
                    'title' => $resource->title,
                    'description' => str($resource->description)->stripTags()->toString(),
                    'year' => $resource->year,
                    'category' => $resource->category?->name ?? '',
                    'language' => $resource->language?->name,
                    'url' => $resource->url,
                    'internal_members_only' => $resource->internal_members_only,
                    'is_published' => $resource->is_published,
                    'sort_order' => $resource->sort_order,
                    'created_at' => $resource->created_at->toFormattedDateString(),
                ]),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('resources/create', [
            'categories' => $this->categoriesPayload(),
            'languages' => $this->languagesPayload(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        ResourceItem::create($this->validatedAttributes($request));

        return to_route('resources.index');
    }

    public function edit(ResourceItem $resource): Response
    {
        return Inertia::render('resources/edit', [
            'resource' => $resource->only([
                'id',
                'title',
                'description',
                'year',
                'resource_category_id',
                'resource_language_id',
                'url',
                'internal_members_only',
                'is_published',
                'sort_order',
                'feature_image_path',
            ]),
            'categories' => $this->categoriesPayload(),
            'languages' => $this->languagesPayload(),
        ]);
    }

    public function update(Request $request, ResourceItem $resource): RedirectResponse
    {
        $resource->update($this->validatedAttributes($request));

        return to_route('resources.index');
    }

    public function destroy(ResourceItem $resource): RedirectResponse
    {
        $resource->delete();

        return to_route('resources.index');
    }

    /**
     * @return array{
     *     resource_category_id?: int|null,
     *     resource_language_id?: int|null,
     *     title: string,
     *     description?: string|null,
     *     year?: int|null,
     *     url?: string|null,
     *     internal_members_only: bool,
     *     is_published: bool,
     *     sort_order: int,
     *     feature_image_path?: string|null
     * }
     */
    private function validatedAttributes(Request $request): array
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'year' => ['nullable', 'integer', 'digits:4', 'min:1900', 'max:2100'],
            'resource_category_id' => ['nullable', 'integer', Rule::exists('resource_categories', 'id')],
            'resource_language_id' => ['nullable', 'integer', Rule::exists('resource_languages', 'id')],
            'url' => ['nullable', 'url', 'max:2048'],
            'internal_members_only' => ['nullable', 'boolean'],
            'is_published' => ['nullable', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'feature_image' => ['nullable', 'image', 'max:5120'],
            'remove_feature_image' => ['nullable', 'boolean'],
        ]);

        unset($validated['feature_image']);
        unset($validated['remove_feature_image']);

        $validated['internal_members_only'] = $request->boolean('internal_members_only');
        $validated['is_published'] = $request->boolean('is_published');
        $validated['sort_order'] = (int) ($validated['sort_order'] ?? 0);

        if ($request->boolean('remove_feature_image')) {
            $validated['feature_image_path'] = null;
        }

        if ($request->hasFile('feature_image')) {
            $validated['feature_image_path'] = $request
                ->file('feature_image')
                ->store('resources/features', 'public');
        }

        return $validated;
    }

    private function categoriesPayload()
    {
        return ResourceCategory::query()
            ->orderBy('name')
            ->get(['id', 'name']);
    }

    private function languagesPayload()
    {
        return ResourceLanguage::query()
            ->orderBy('name')
            ->get(['id', 'name']);
    }
}
