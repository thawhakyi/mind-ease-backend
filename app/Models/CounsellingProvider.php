<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

#[Fillable([
    'provider_name',
    'provider_background',
    'number_of_professionals',
    'professional_types',
    'languages',
    'in_person',
    'office_hours',
    'contact_methods',
    'phone_numbers',
    'email',
    'website_url',
    'facebook_page_name',
    'facebook_url',
    'sort_order',
    'logo_path',
    'internal_members_only',
    'is_published',
])]
class CounsellingProvider extends Model
{
    protected function casts(): array
    {
        return [
            'number_of_professionals' => 'integer',
            'languages' => 'array',
            'in_person' => 'boolean',
            'contact_methods' => 'array',
            'phone_numbers' => 'array',
            'sort_order' => 'integer',
            'internal_members_only' => 'boolean',
            'is_published' => 'boolean',
        ];
    }

    /**
     * @return BelongsToMany<ServiceLocation, $this>
     */
    public function serviceLocations(): BelongsToMany
    {
        return $this->belongsToMany(ServiceLocation::class)
            ->withTimestamps();
    }
}
