<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name'])]
class ResourceCategory extends Model
{
    /**
     * @return HasMany<ResourceItem, $this>
     */
    public function resources(): HasMany
    {
        return $this->hasMany(ResourceItem::class);
    }
}
