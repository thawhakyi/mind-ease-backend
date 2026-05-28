<?php

use App\Models\Timeline;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('guests are redirected away from timeline management', function () {
    $this->get(route('timelines.index'))->assertRedirect(route('login'));
    $this->get(route('timelines.create'))->assertRedirect(route('login'));
});

test('authenticated users can view timeline management pages', function () {
    $this->actingAs(User::factory()->create());

    $this->get(route('timelines.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('timelines/index')
            ->has('timelines')
        );

    $this->get(route('timelines.create'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('timelines/create')
        );
});

test('timeline index shows last added items last by default', function () {
    $this->actingAs(User::factory()->create());

    $firstMilestone = Timeline::create(['title' => 'First milestone']);
    $secondMilestone = Timeline::create(['title' => 'Second milestone']);

    $firstMilestone->forceFill(['created_at' => now()->subDays(2)])->save();
    $secondMilestone->forceFill(['created_at' => now()->subDay()])->save();

    $this->get(route('timelines.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('timelines/index')
            ->where('timelines.0.title', 'First milestone')
            ->where('timelines.1.title', 'Second milestone')
        );
});

test('authenticated users can create update and delete a timeline item', function () {
    $this->actingAs(User::factory()->create());
    Storage::fake('public');

    $this->post(route('timelines.store'), [
        'title' => 'MindEase launch',
        'year' => '2026',
        'description' => '<p>Launch milestone.</p>',
        'sort_order' => 4,
        'featured_image' => UploadedFile::fake()->image('timeline.jpg'),
    ])->assertRedirect(route('timelines.index'));

    $timeline = Timeline::query()->firstOrFail();

    expect($timeline->title)->toBe('MindEase launch')
        ->and($timeline->year)->toBe('2026')
        ->and($timeline->description)->toBe('<p>Launch milestone.</p>')
        ->and($timeline->sort_order)->toBe(4)
        ->and($timeline->featured_image_path)->not->toBeNull();

    Storage::disk('public')->assertExists($timeline->featured_image_path);

    $this->patch(route('timelines.update', $timeline), [
        'title' => 'MindEase expansion',
        'year' => '2026-2027',
        'description' => '<p>Expansion milestone.</p>',
        'sort_order' => 8,
        'featured_image' => UploadedFile::fake()->image('timeline-updated.jpg'),
    ])->assertRedirect(route('timelines.index'));

    expect($timeline->refresh()->title)->toBe('MindEase expansion')
        ->and($timeline->year)->toBe('2026-2027')
        ->and($timeline->description)->toBe('<p>Expansion milestone.</p>')
        ->and($timeline->sort_order)->toBe(8);

    $this->delete(route('timelines.destroy', $timeline))
        ->assertRedirect(route('timelines.index'));

    expect(Timeline::query()->count())->toBe(0);
});

test('authenticated users can create a timeline item with only a title', function () {
    $this->actingAs(User::factory()->create());

    $this->post(route('timelines.store'), [
        'title' => 'MindEase launch',
    ])->assertRedirect(route('timelines.index'));

    $timeline = Timeline::query()->firstOrFail();

    expect($timeline->title)->toBe('MindEase launch')
        ->and($timeline->year)->toBeNull()
        ->and($timeline->description)->toBeNull();
});
