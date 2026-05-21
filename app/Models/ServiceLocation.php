<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

#[Fillable(['name'])]
class ServiceLocation extends Model
{
    /**
     * @return BelongsToMany<CounsellingProvider, $this>
     */
    public function counsellingProviders(): BelongsToMany
    {
        return $this->belongsToMany(CounsellingProvider::class)
            ->withTimestamps();
    }
}
