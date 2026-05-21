<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

#[Fillable([
    'title',
    'description',
    'featured_image_path',
    'internal_members_only',
    'is_published',
])]
class OpportunityNews extends Model
{
    protected function casts(): array
    {
        return [
            'internal_members_only' => 'boolean',
            'is_published' => 'boolean',
        ];
    }

    /**
     * @return BelongsToMany<OpportunityNewsCategory, $this>
     */
    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(
            OpportunityNewsCategory::class,
            'opportunity_news_category_opportunity_news',
        )
            ->withTimestamps();
    }
}
