<?php

use App\Models\ResourceCategory;
use App\Models\ResourceItem;
use App\Models\ResourceLanguage;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('guests are redirected away from resources management', function () {
    $this->get(route('resources.index'))->assertRedirect(route('login'));
    $this->get(route('resources.create'))->assertRedirect(route('login'));
    $this->get(route('resources.categories.index'))->assertRedirect(route('login'));
    $this->get(route('resources.languages.index'))->assertRedirect(route('login'));
});

test('authenticated users can view resources management pages', function () {
    $this->actingAs(User::factory()->create());

    $this->get(route('resources.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('resources/index')
            ->has('resources')
        );

    $this->get(route('resources.create'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('resources/create')
            ->has('categories')
        );

    $this->get(route('resources.categories.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('resources/categories')
            ->has('categories')
        );

    $this->get(route('resources.languages.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('resources/languages')
            ->has('languages')
        );
});

test('authenticated users can create update and delete a resource', function () {
    $this->actingAs(User::factory()->create());
    Storage::fake('public');

    $toolkits = ResourceCategory::create(['name' => 'Toolkits']);
    $reports = ResourceCategory::create(['name' => 'Reports']);
    $english = ResourceLanguage::create(['name' => 'English']);
    $myanmar = ResourceLanguage::create(['name' => 'Myanmar']);

    $this->post(route('resources.store'), [
        'title' => 'Safeguarding toolkit',
        'description' => '<p>Guidance materials.</p>',
        'year' => 2026,
        'resource_category_id' => $toolkits->id,
        'resource_language_id' => $english->id,
        'url' => 'https://example.com/toolkit',
        'internal_members_only' => '1',
        'is_published' => '1',
        'sort_order' => 5,
        'feature_image' => UploadedFile::fake()->image('resource.jpg'),
    ])->assertRedirect(route('resources.index'));

    $resource = ResourceItem::query()->firstOrFail();

    expect($resource->title)->toBe('Safeguarding toolkit')
        ->and($resource->description)->toBe('<p>Guidance materials.</p>')
        ->and($resource->year)->toBe(2026)
        ->and($resource->resource_category_id)->toBe($toolkits->id)
        ->and($resource->resource_language_id)->toBe($english->id)
        ->and($resource->url)->toBe('https://example.com/toolkit')
        ->and($resource->internal_members_only)->toBeTrue()
        ->and($resource->is_published)->toBeTrue()
        ->and($resource->sort_order)->toBe(5)
        ->and($resource->feature_image_path)->not->toBeNull();

    Storage::disk('public')->assertExists($resource->feature_image_path);

    $this->patch(route('resources.update', $resource), [
        'title' => 'Safeguarding report',
        'description' => '<p>Updated guidance.</p>',
        'year' => 2027,
        'resource_category_id' => $reports->id,
        'resource_language_id' => $myanmar->id,
        'url' => 'https://example.com/report',
        'internal_members_only' => '0',
        'is_published' => '0',
        'sort_order' => 10,
        'feature_image' => UploadedFile::fake()->image('resource-updated.jpg'),
    ])->assertRedirect(route('resources.index'));

    expect($resource->refresh()->title)->toBe('Safeguarding report')
        ->and($resource->description)->toBe('<p>Updated guidance.</p>')
        ->and($resource->year)->toBe(2027)
        ->and($resource->resource_category_id)->toBe($reports->id)
        ->and($resource->resource_language_id)->toBe($myanmar->id)
        ->and($resource->url)->toBe('https://example.com/report')
        ->and($resource->internal_members_only)->toBeFalse()
        ->and($resource->is_published)->toBeFalse()
        ->and($resource->sort_order)->toBe(10);

    $this->delete(route('resources.destroy', $resource))
        ->assertRedirect(route('resources.index'));

    expect(ResourceItem::query()->count())->toBe(0);
});

test('authenticated users can create a resource with only a title', function () {
    $this->actingAs(User::factory()->create());

    $this->post(route('resources.store'), [
        'title' => 'Safeguarding toolkit',
    ])->assertRedirect(route('resources.index'));

    $resource = ResourceItem::query()->firstOrFail();

    expect($resource->title)->toBe('Safeguarding toolkit')
        ->and($resource->description)->toBeNull()
        ->and($resource->year)->toBeNull()
        ->and($resource->resource_category_id)->toBeNull()
        ->and($resource->resource_language_id)->toBeNull()
        ->and($resource->url)->toBeNull();
});

test('authenticated users can manage resource categories', function () {
    $this->actingAs(User::factory()->create());

    $this->post(route('resources.categories.store'), [
        'name' => 'Toolkits',
    ])->assertRedirect(route('resources.categories.index'));

    $category = ResourceCategory::query()->firstOrFail();

    $this->patch(route('resources.categories.update', $category), [
        'name' => 'Resource Toolkits',
    ])->assertRedirect(route('resources.categories.index'));

    expect($category->refresh()->name)->toBe('Resource Toolkits');

    $this->delete(route('resources.categories.destroy', $category))
        ->assertRedirect(route('resources.categories.index'));

    expect(ResourceCategory::query()->count())->toBe(0);
});

test('authenticated users can manage resource languages', function () {
    $this->actingAs(User::factory()->create());

    $this->post(route('resources.languages.store'), [
        'name' => 'English',
    ])->assertRedirect(route('resources.languages.index'));

    $language = ResourceLanguage::query()->firstOrFail();

    $this->patch(route('resources.languages.update', $language), [
        'name' => 'Myanmar',
    ])->assertRedirect(route('resources.languages.index'));

    expect($language->refresh()->name)->toBe('Myanmar');

    $this->delete(route('resources.languages.destroy', $language))
        ->assertRedirect(route('resources.languages.index'));

    expect(ResourceLanguage::query()->count())->toBe(0);
});
