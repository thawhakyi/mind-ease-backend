<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

#[Fillable(['name'])]
class OpportunityNewsCategory extends Model
{
    /**
     * @return BelongsToMany<OpportunityNews, $this>
     */
    public function items(): BelongsToMany
    {
        return $this->belongsToMany(
            OpportunityNews::class,
            'opportunity_news_category_opportunity_news',
        )
            ->withTimestamps();
    }
}
