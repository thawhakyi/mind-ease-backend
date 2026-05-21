<?php

namespace App\Http\Controllers\Resources;

use App\Http\Controllers\Controller;
use App\Models\ResourceLanguage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class LanguageController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('resources/languages', [
            'languages' => ResourceLanguage::query()
                ->orderBy('name')
                ->get(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        ResourceLanguage::create($this->validatedAttributes($request));

        return to_route('resources.languages.index');
    }

    public function update(Request $request, ResourceLanguage $language): RedirectResponse
    {
        $language->update($this->validatedAttributes($request, $language));

        return to_route('resources.languages.index');
    }

    public function destroy(ResourceLanguage $language): RedirectResponse
    {
        $language->delete();

        return to_route('resources.languages.index');
    }

    /**
     * @return array{name: string}
     */
    private function validatedAttributes(Request $request, ?ResourceLanguage $language = null): array
    {
        return $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('resource_languages', 'name')->ignore($language),
            ],
        ]);
    }
}
