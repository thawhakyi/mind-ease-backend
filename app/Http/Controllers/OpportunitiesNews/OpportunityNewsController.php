<?php

namespace App\Http\Controllers\OpportunitiesNews;

use App\Http\Controllers\Controller;
use App\Models\OpportunityNews;
use App\Models\OpportunityNewsCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class OpportunityNewsController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('opportunities-news/index', [
            'items' => OpportunityNews::query()
                ->with('categories:id,name')
                ->latest()
                ->get(['id', 'title', 'description', 'featured_image_path', 'internal_members_only', 'is_published', 'created_at'])
                ->map(fn (OpportunityNews $item) => [
                    'id' => $item->id,
                    'title' => $item->title,
                    'description' => str($item->description)->stripTags()->toString(),
                    'categories' => $item->categories->pluck('name')->implode(', '),
                    'featured_image_path' => $item->featured_image_path,
                    'internal_members_only' => $item->internal_members_only,
                    'is_published' => $item->is_published,
                    'created_at' => $item->created_at->toFormattedDateString(),
                ]),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('opportunities-news/create', [
            'categories' => $this->categoriesPayload(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validatedAttributes($request);
        $categoryIds = $validated['category_ids'] ?? [];
        unset($validated['category_ids']);

        $item = OpportunityNews::create($validated);
        $item->categories()->sync($categoryIds);

        return to_route('opportunities-news.index');
    }

    public function edit(OpportunityNews $opportunities_news): Response
    {
        return Inertia::render('opportunities-news/edit', [
            'item' => [
                ...$opportunities_news->only([
                    'id',
                    'title',
                    'description',
                    'featured_image_path',
                    'internal_members_only',
                    'is_published',
                ]),
                'category_ids' => $opportunities_news->categories()
                    ->pluck('opportunity_news_categories.id')
                    ->all(),
            ],
            'categories' => $this->categoriesPayload(),
        ]);
    }

    public function update(Request $request, OpportunityNews $opportunities_news): RedirectResponse
    {
        $validated = $this->validatedAttributes($request);
        $categoryIds = $validated['category_ids'] ?? [];
        unset($validated['category_ids']);

        $opportunities_news->update($validated);
        $opportunities_news->categories()->sync($categoryIds);

        return to_route('opportunities-news.index');
    }

    public function destroy(OpportunityNews $opportunities_news): RedirectResponse
    {
        $opportunities_news->delete();

        return to_route('opportunities-news.index');
    }

    /**
     * @return array{title: string, description?: string|null, category_ids?: array<int, int>, featured_image_path?: string, internal_members_only: bool, is_published: bool}
     */
    private function validatedAttributes(Request $request): array
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'category_ids' => ['nullable', 'array'],
            'category_ids.*' => ['integer', Rule::exists('opportunity_news_categories', 'id')],
            'featured_image' => ['nullable', 'image', 'max:5120'],
            'internal_members_only' => ['nullable', 'boolean'],
            'is_published' => ['nullable', 'boolean'],
        ]);

        unset($validated['featured_image']);

        $validated['internal_members_only'] = $request->boolean('internal_members_only');
        $validated['is_published'] = $request->boolean('is_published');

        if ($request->hasFile('featured_image')) {
            $validated['featured_image_path'] = $request
                ->file('featured_image')
                ->store('opportunities-news/features', 'public');
        }

        return $validated;
    }

    private function categoriesPayload()
    {
        return OpportunityNewsCategory::query()
            ->orderBy('name')
            ->get(['id', 'name']);
    }
}
