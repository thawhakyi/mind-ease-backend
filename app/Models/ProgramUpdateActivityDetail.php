<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

#[Fillable([
    'program_update_id',
    'start_date',
    'end_date',
    'event_type',
    'event_link',
])]
class ProgramUpdateActivityDetail extends Model
{
    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
        ];
    }

    /**
     * @return BelongsTo<ProgramUpdate, $this>
     */
    public function programUpdate(): BelongsTo
    {
        return $this->belongsTo(ProgramUpdate::class);
    }

    /**
     * @return BelongsToMany<CountryOffice, $this>
     */
    public function countryOffices(): BelongsToMany
    {
        return $this->belongsToMany(
            CountryOffice::class,
            'activity_detail_country_office',
        )->withTimestamps();
    }

    /**
     * @return BelongsToMany<Location, $this>
     */
    public function locations(): BelongsToMany
    {
        return $this->belongsToMany(
            Location::class,
            'activity_detail_location',
        )->withTimestamps();
    }
}
