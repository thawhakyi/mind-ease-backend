<?php

namespace App\Observers;

use App\Services\ContentCacheRevalidator;
use Illuminate\Database\Eloquent\Model;

class ContentCacheRevalidationObserver
{
    public function saved(Model $model): void
    {
        app(ContentCacheRevalidator::class)->revalidate();
    }

    public function deleted(Model $model): void
    {
        app(ContentCacheRevalidator::class)->revalidate();
    }
}
