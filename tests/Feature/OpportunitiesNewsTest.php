<?php

use App\Models\OpportunityNews;
use App\Models\OpportunityNewsCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('guests are redirected away from opportunities and news management', function () {
    $this->get(route('opportunities-news.index'))->assertRedirect(route('login'));
    $this->get(route('opportunities-news.create'))->assertRedirect(route('login'));
    $this->get(route('opportunities-news.categories.index'))->assertRedirect(route('login'));
});

test('authenticated users can view opportunities and news management pages', function () {
    $this->actingAs(User::factory()->create());

    $this->get(route('opportunities-news.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('opportunities-news/index')
            ->has('items.data')
        );

    $this->get(route('opportunities-news.create'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('opportunities-news/create')
            ->has('categories')
        );

    $this->get(route('opportunities-news.categories.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('opportunities-news/categories')
            ->has('categories')
        );
});

test('index page returns paginated items and supports searching and sorting', function () {
    $this->actingAs(User::factory()->create());

    $alphaUpdate = OpportunityNews::create(['title' => 'Alpha Update']);
    $betaNews = OpportunityNews::create(['title' => 'Beta News']);

    $alphaUpdate->forceFill(['created_at' => now()->subDays(2)])->save();
    $betaNews->forceFill(['created_at' => now()->subDay()])->save();

    // Search
    $this->get(route('opportunities-news.index', ['search' => 'Alpha']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('opportunities-news/index')
            ->has('items.data', 1)
            ->where('items.data.0.title', 'Alpha Update')
        );

    // Default sorting by created date asc
    $this->get(route('opportunities-news.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('opportunities-news/index')
            ->has('items.data', 2)
            ->where('items.data.0.title', 'Alpha Update')
            ->where('items.data.1.title', 'Beta News')
        );

    // Sorting by title asc
    $this->get(route('opportunities-news.index', ['sort' => 'title', 'direction' => 'asc']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('opportunities-news/index')
            ->has('items.data', 2)
            ->where('items.data.0.title', 'Alpha Update')
            ->where('items.data.1.title', 'Beta News')
        );

    // Sorting by title desc
    $this->get(route('opportunities-news.index', ['sort' => 'title', 'direction' => 'desc']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('opportunities-news/index')
            ->has('items.data', 2)
            ->where('items.data.0.title', 'Beta News')
            ->where('items.data.1.title', 'Alpha Update')
        );
});

test('authenticated users can create update and delete an opportunities and news item', function () {
    $this->actingAs(User::factory()->create());
    Storage::fake('public');

    $funding = OpportunityNewsCategory::create(['name' => 'Funding']);
    $training = OpportunityNewsCategory::create(['name' => 'Training']);

    $this->post(route('opportunities-news.store'), [
        'title' => 'Community grant opportunity',
        'description' => '<p>Applications are open.</p>',
        'category_ids' => [$funding->id, $training->id],
        'featured_image' => UploadedFile::fake()->image('grant.jpg'),
        'internal_members_only' => '1',
        'is_published' => '1',
    ])->assertRedirect(route('opportunities-news.index'));

    $item = OpportunityNews::query()->firstOrFail();

    expect($item->title)->toBe('Community grant opportunity')
        ->and($item->description)->toBe('<p>Applications are open.</p>')
        ->and($item->featured_image_path)->not->toBeNull()
        ->and($item->internal_members_only)->toBeTrue()
        ->and($item->is_published)->toBeTrue()
        ->and($item->categories()->pluck('opportunity_news_categories.id')->all())
        ->toEqualCanonicalizing([$funding->id, $training->id]);

    Storage::disk('public')->assertExists($item->featured_image_path);

    $this->patch(route('opportunities-news.update', $item), [
        'title' => 'Community grant opportunity updated',
        'description' => '<p>Applications are closing soon.</p>',
        'category_ids' => [$training->id],
        'featured_image' => UploadedFile::fake()->image('grant-updated.jpg'),
        'internal_members_only' => '0',
        'is_published' => '0',
    ])->assertRedirect(route('opportunities-news.index'));

    expect($item->refresh()->title)->toBe('Community grant opportunity updated')
        ->and($item->description)->toBe('<p>Applications are closing soon.</p>')
        ->and($item->internal_members_only)->toBeFalse()
        ->and($item->is_published)->toBeFalse()
        ->and($item->categories()->pluck('opportunity_news_categories.id')->all())
        ->toEqualCanonicalizing([$training->id]);

    $this->delete(route('opportunities-news.destroy', $item))
        ->assertRedirect(route('opportunities-news.index'));

    expect(OpportunityNews::query()->count())->toBe(0);
});

test('authenticated users can create an opportunities and news item with only a title', function () {
    $this->actingAs(User::factory()->create());

    $this->post(route('opportunities-news.store'), [
        'title' => 'Community grant opportunity',
    ])->assertRedirect(route('opportunities-news.index'));

    $item = OpportunityNews::query()->firstOrFail();

    expect($item->title)->toBe('Community grant opportunity')
        ->and($item->description)->toBeNull()
        ->and($item->categories()->count())->toBe(0);
});

test('authenticated users can manage opportunities and news categories', function () {
    $this->actingAs(User::factory()->create());

    $this->post(route('opportunities-news.categories.store'), [
        'name' => 'Funding',
    ])->assertRedirect(route('opportunities-news.categories.index'));

    $category = OpportunityNewsCategory::query()->firstOrFail();

    $this->patch(route('opportunities-news.categories.update', $category), [
        'name' => 'Funding Updates',
    ])->assertRedirect(route('opportunities-news.categories.index'));

    expect($category->refresh()->name)->toBe('Funding Updates');

    $this->delete(route('opportunities-news.categories.destroy', $category))
        ->assertRedirect(route('opportunities-news.categories.index'));

    expect(OpportunityNewsCategory::query()->count())->toBe(0);
});
