<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ContentCacheRevalidator
{
    /**
     * @var array<int, string>
     */
    private const TAGS = [
        'mind-ease-content',
        'mind-ease-content:public',
        'mind-ease-content:members',
    ];

    public function revalidate(): void
    {
        $secret = config('services.content_revalidation.secret');

        if (! is_string($secret) || $secret === '') {
            return;
        }

        try {
            Http::timeout(2)
                ->withHeaders(['X-Revalidation-Secret' => $secret])
                ->post(
                    rtrim((string) config('app.frontend_url'), '/').'/api/revalidate-content',
                    ['tags' => self::TAGS],
                )
                ->throw();
        } catch (\Throwable $exception) {
            Log::warning('Frontend content cache revalidation failed.', [
                'message' => $exception->getMessage(),
            ]);
        }
    }
}
