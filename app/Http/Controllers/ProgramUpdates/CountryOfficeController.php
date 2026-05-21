<?php

namespace App\Http\Controllers\ProgramUpdates;

use App\Http\Controllers\Controller;
use App\Models\CountryOffice;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CountryOfficeController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('program-updates/country-offices', [
            'countryOffices' => CountryOffice::query()
                ->withCount(['locations', 'programUpdates'])
                ->orderBy('name')
                ->get(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        CountryOffice::create($this->validatedAttributes($request));

        return to_route('program-updates.country-offices.index');
    }

    public function update(Request $request, CountryOffice $countryOffice): RedirectResponse
    {
        $countryOffice->update($this->validatedAttributes($request, $countryOffice));

        return to_route('program-updates.country-offices.index');
    }

    public function destroy(CountryOffice $countryOffice): RedirectResponse
    {
        $countryOffice->delete();

        return to_route('program-updates.country-offices.index');
    }

    /**
     * @return array{name: string}
     */
    private function validatedAttributes(Request $request, ?CountryOffice $countryOffice = null): array
    {
        return $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('country_offices', 'name')->ignore($countryOffice),
            ],
        ]);
    }
}
