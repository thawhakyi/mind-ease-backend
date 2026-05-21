<?php

namespace App\Http\Controllers\ProgramUpdates;

use App\Http\Controllers\Controller;
use App\Models\CountryOffice;
use App\Models\Location;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class LocationController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('program-updates/locations', [
            'locations' => Location::query()
                ->with('countryOffice:id,name')
                ->withCount('programUpdates')
                ->orderBy('name')
                ->get(['id', 'country_office_id', 'name'])
                ->map(fn (Location $location) => [
                    'id' => $location->id,
                    'country_office_id' => $location->country_office_id,
                    'name' => $location->name,
                    'country_office' => $location->countryOffice?->name,
                    'program_updates_count' => $location->program_updates_count,
                ]),
            'countryOffices' => CountryOffice::query()
                ->orderBy('name')
                ->get(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        Location::create($this->validatedAttributes($request));

        return to_route('program-updates.locations.index');
    }

    public function update(Request $request, Location $location): RedirectResponse
    {
        $location->update($this->validatedAttributes($request, $location));

        return to_route('program-updates.locations.index');
    }

    public function destroy(Location $location): RedirectResponse
    {
        $location->delete();

        return to_route('program-updates.locations.index');
    }

    /**
     * @return array{country_office_id: int, name: string}
     */
    private function validatedAttributes(Request $request, ?Location $location = null): array
    {
        $countryOfficeId = $request->integer('country_office_id');

        return $request->validate([
            'country_office_id' => ['required', 'integer', Rule::exists('country_offices', 'id')],
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('locations', 'name')
                    ->where('country_office_id', $countryOfficeId)
                    ->ignore($location),
            ],
        ]);
    }
}
