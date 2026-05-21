<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'resource_category_id',
    'resource_language_id',
    'title',
    'description',
    'year',
    'url',
    'internal_members_only',
    'is_published',
    'sort_order',
    'feature_image_path',
])]
class ResourceItem extends Model
{
    protected $table = 'resources';

    protected function casts(): array
    {
        return [
            'year' => 'integer',
            'internal_members_only' => 'boolean',
            'is_published' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    /**
     * @return BelongsTo<ResourceCategory, $this>
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(ResourceCategory::class, 'resource_category_id');
    }

    /**
     * @return BelongsTo<ResourceLanguage, $this>
     */
    public function language(): BelongsTo
    {
        return $this->belongsTo(ResourceLanguage::class, 'resource_language_id');
    }
}
