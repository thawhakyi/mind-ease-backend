<?php

namespace App\Http\Controllers\CounsellingProviders;

use App\Http\Controllers\Controller;
use App\Models\ServiceLocation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ServiceLocationController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('counselling-providers/service-locations', [
            'serviceLocations' => ServiceLocation::query()
                ->orderBy('name')
                ->get(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        ServiceLocation::create($this->validatedAttributes($request));

        return to_route('counselling-providers.service-locations.index');
    }

    public function update(Request $request, ServiceLocation $service_location): RedirectResponse
    {
        $service_location->update($this->validatedAttributes($request, $service_location));

        return to_route('counselling-providers.service-locations.index');
    }

    public function destroy(ServiceLocation $service_location): RedirectResponse
    {
        $service_location->delete();

        return to_route('counselling-providers.service-locations.index');
    }

    /**
     * @return array{name: string}
     */
    private function validatedAttributes(Request $request, ?ServiceLocation $serviceLocation = null): array
    {
        return $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('service_locations', 'name')->ignore($serviceLocation),
            ],
        ]);
    }
}
