<?php

namespace App\Http\Controllers\Resources;

use App\Http\Controllers\Controller;
use App\Models\ResourceCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('resources/categories', [
            'categories' => ResourceCategory::query()
                ->orderBy('name')
                ->get(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        ResourceCategory::create($this->validatedAttributes($request));

        return to_route('resources.categories.index');
    }

    public function update(Request $request, ResourceCategory $category): RedirectResponse
    {
        $category->update($this->validatedAttributes($request, $category));

        return to_route('resources.categories.index');
    }

    public function destroy(ResourceCategory $category): RedirectResponse
    {
        $category->delete();

        return to_route('resources.categories.index');
    }

    /**
     * @return array{name: string}
     */
    private function validatedAttributes(Request $request, ?ResourceCategory $category = null): array
    {
        return $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('resource_categories', 'name')->ignore($category),
            ],
        ]);
    }
}
