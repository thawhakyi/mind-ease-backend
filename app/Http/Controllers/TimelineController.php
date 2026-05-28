<?php

namespace App\Http\Controllers;

use App\Models\Timeline;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TimelineController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('timelines/index', [
            'timelines' => Timeline::query()
                ->orderBy('sort_order')
                ->oldest()
                ->get()
                ->map(fn (Timeline $timeline) => [
                    'id' => $timeline->id,
                    'title' => $timeline->title,
                    'year' => $timeline->year,
                    'description' => str($timeline->description)->stripTags()->toString(),
                    'sort_order' => $timeline->sort_order,
                    'featured_image_path' => $timeline->featured_image_path,
                    'created_at' => $timeline->created_at->toFormattedDateString(),
                ]),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('timelines/create');
    }

    public function store(Request $request): RedirectResponse
    {
        Timeline::create($this->validatedAttributes($request));

        return to_route('timelines.index');
    }

    public function edit(Timeline $timeline): Response
    {
        return Inertia::render('timelines/edit', [
            'timeline' => $timeline->only([
                'id',
                'title',
                'year',
                'description',
                'sort_order',
                'featured_image_path',
            ]),
        ]);
    }

    public function update(Request $request, Timeline $timeline): RedirectResponse
    {
        $timeline->update($this->validatedAttributes($request));

        return to_route('timelines.index');
    }

    public function destroy(Timeline $timeline): RedirectResponse
    {
        $timeline->delete();

        return to_route('timelines.index');
    }

    /**
     * @return array{title: string, year?: string|null, description?: string|null, sort_order: int, featured_image_path?: string|null}
     */
    private function validatedAttributes(Request $request): array
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'year' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'featured_image' => ['nullable', 'image', 'max:5120'],
            'remove_featured_image' => ['nullable', 'boolean'],
        ]);

        unset($validated['featured_image']);
        unset($validated['remove_featured_image']);

        $validated['sort_order'] = (int) ($validated['sort_order'] ?? 0);

        if ($request->boolean('remove_featured_image')) {
            $validated['featured_image_path'] = null;
        }

        if ($request->hasFile('featured_image')) {
            $validated['featured_image_path'] = $request
                ->file('featured_image')
                ->store('timelines/features', 'public');
        }

        return $validated;
    }
}
