<?php

namespace App\Http\Controllers\OpportunitiesNews;

use App\Http\Controllers\Controller;
use App\Models\OpportunityNewsCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('opportunities-news/categories', [
            'categories' => OpportunityNewsCategory::query()
                ->orderBy('name')
                ->get(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        OpportunityNewsCategory::create($this->validatedAttributes($request));

        return to_route('opportunities-news.categories.index');
    }

    public function update(Request $request, OpportunityNewsCategory $category): RedirectResponse
    {
        $category->update($this->validatedAttributes($request, $category));

        return to_route('opportunities-news.categories.index');
    }

    public function destroy(OpportunityNewsCategory $category): RedirectResponse
    {
        $category->delete();

        return to_route('opportunities-news.categories.index');
    }

    /**
     * @return array{name: string}
     */
    private function validatedAttributes(Request $request, ?OpportunityNewsCategory $category = null): array
    {
        return $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('opportunity_news_categories', 'name')->ignore($category),
            ],
        ]);
    }
}
