<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'country_office_id',
    'location_id',
    'title',
    'summary',
    'description',
    'quarter',
    'year',
    'date',
    'facilitator',
    'event_type',
    'feature_image_path',
    'gallery_image_paths',
    'internal_members_only',
    'is_published',
    'sort_order',
])]
class ProgramUpdate extends Model
{
    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'date' => 'date',
            'gallery_image_paths' => 'array',
            'internal_members_only' => 'boolean',
            'is_published' => 'boolean',
            'sort_order' => 'integer',
            'year' => 'integer',
        ];
    }

    /**
     * @return BelongsTo<CountryOffice, $this>
     */
    public function countryOffice(): BelongsTo
    {
        return $this->belongsTo(CountryOffice::class);
    }

    /**
     * @return BelongsTo<Location, $this>
     */
    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }

    /**
     * @return BelongsToMany<CountryOffice, $this>
     */
    public function countryOffices(): BelongsToMany
    {
        return $this->belongsToMany(CountryOffice::class)->withTimestamps();
    }

    /**
     * @return HasMany<ProgramUpdateActivityDetail, $this>
     */
    public function activityDetails(): HasMany
    {
        return $this->hasMany(ProgramUpdateActivityDetail::class);
    }
}
