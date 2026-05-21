<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name'])]
class CountryOffice extends Model
{
    /**
     * @return HasMany<Location, $this>
     */
    public function locations(): HasMany
    {
        return $this->hasMany(Location::class);
    }

    /**
     * @return BelongsToMany<ProgramUpdate, $this>
     */
    public function programUpdates(): BelongsToMany
    {
        return $this->belongsToMany(ProgramUpdate::class)->withTimestamps();
    }

    /**
     * @return BelongsToMany<ProgramUpdateActivityDetail, $this>
     */
    public function activityDetails(): BelongsToMany
    {
        return $this->belongsToMany(
            ProgramUpdateActivityDetail::class,
            'activity_detail_country_office',
        )->withTimestamps();
    }
}
