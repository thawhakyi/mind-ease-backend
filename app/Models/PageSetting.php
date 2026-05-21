<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'key',
    'label',
    'internal_members_only',
    'is_published',
])]
class PageSetting extends Model
{
    public const PROGRAM_UPDATES = 'program_updates';

    public const OPPORTUNITIES_NEWS = 'opportunities_news';

    public const RESOURCES = 'resources';

    public const COUNSELLING_PROVIDERS = 'counselling_providers';

    /**
     * @var array<string, string>
     */
    public const LABELS = [
        self::PROGRAM_UPDATES => 'Program Updates',
        self::OPPORTUNITIES_NEWS => 'Opportunities & News',
        self::RESOURCES => 'Resources',
        self::COUNSELLING_PROVIDERS => 'Counselling Providers',
    ];

    protected function casts(): array
    {
        return [
            'internal_members_only' => 'boolean',
            'is_published' => 'boolean',
        ];
    }

    public static function findOrCreateForKey(string $key): self
    {
        return self::query()->firstOrCreate(
            ['key' => $key],
            [
                'label' => self::LABELS[$key],
                'internal_members_only' => false,
                'is_published' => true,
            ],
        );
    }
}
