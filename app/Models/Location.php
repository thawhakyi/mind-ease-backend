<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['country_office_id', 'name'])]
class Location extends Model
{
    /**
     * @return BelongsTo<CountryOffice, $this>
     */
    public function countryOffice(): BelongsTo
    {
        return $this->belongsTo(CountryOffice::class);
    }

    /**
     * @return HasMany<ProgramUpdate, $this>
     */
    public function programUpdates(): HasMany
    {
        return $this->hasMany(ProgramUpdate::class);
    }

    /**
     * @return BelongsToMany<ProgramUpdateActivityDetail, $this>
     */
    public function activityDetails(): BelongsToMany
    {
        return $this->belongsToMany(
            ProgramUpdateActivityDetail::class,
            'activity_detail_location',
        )->withTimestamps();
    }
}
