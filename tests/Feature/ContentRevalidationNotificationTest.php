<?php

use App\Models\PageSetting;
use App\Models\ResourceItem;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

uses(RefreshDatabase::class);

test('content changes ask the frontend to revalidate public and member content caches', function () {
    config()->set('app.frontend_url', 'https://mind-ease.example');
    config()->set('services.content_revalidation.secret', 'revalidation-secret');
    Http::fake();

    ResourceItem::create([
        'title' => 'Shared resource',
        'is_published' => true,
    ]);

    Http::assertSent(fn (Request $request): bool => $request->url() === 'https://mind-ease.example/api/revalidate-content'
        && $request->method() === 'POST'
        && $request->header('X-Revalidation-Secret') === ['revalidation-secret']
        && $request->data() === [
            'tags' => [
                'mind-ease-content',
                'mind-ease-content:public',
                'mind-ease-content:members',
            ],
        ]);
});

test('content revalidation is skipped when no shared secret is configured', function () {
    config()->set('app.frontend_url', 'https://mind-ease.example');
    config()->set('services.content_revalidation.secret', null);
    Http::fake();

    ResourceItem::create([
        'title' => 'Shared resource',
        'is_published' => true,
    ]);

    Http::assertNothingSent();
});

test('page setting changes ask the frontend to revalidate content caches', function () {
    config()->set('app.frontend_url', 'https://mind-ease.example');
    config()->set('services.content_revalidation.secret', 'revalidation-secret');
    Http::fake();

    PageSetting::findOrCreateForKey(PageSetting::COUNSELLING_PROVIDERS)->update([
        'internal_members_only' => true,
        'is_published' => true,
    ]);

    Http::assertSent(fn (Request $request): bool => $request->url() === 'https://mind-ease.example/api/revalidate-content'
        && $request->method() === 'POST'
        && $request->header('X-Revalidation-Secret') === ['revalidation-secret']
        && $request->data() === [
            'tags' => [
                'mind-ease-content',
                'mind-ease-content:public',
                'mind-ease-content:members',
            ],
        ]);
});

test('failed content revalidation responses are logged', function () {
    config()->set('app.frontend_url', 'https://mind-ease.example');
    config()->set('services.content_revalidation.secret', 'revalidation-secret');
    Http::fake([
        'https://mind-ease.example/api/revalidate-content' => Http::response(['message' => 'Unauthorized'], 401),
    ]);
    Log::spy();

    PageSetting::findOrCreateForKey(PageSetting::COUNSELLING_PROVIDERS)->update([
        'internal_members_only' => true,
        'is_published' => true,
    ]);

    Log::shouldHaveReceived('warning')
        ->withArgs(fn (string $message, array $context): bool => $message === 'Frontend content cache revalidation failed.'
            && str_contains($context['message'], '401'));
});
