<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'site_name',
    'tagline',
    'description',
    'email',
    'phone',
    'viber_channel_link',
    'goal',
    'objectives',
])]
class SiteSetting extends Model
{
    public static function current(): self
    {
        return self::query()->firstOrCreate([]);
    }
}
