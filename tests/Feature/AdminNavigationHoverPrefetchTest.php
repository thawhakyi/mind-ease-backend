<?php

test('admin navigation links do not prefetch on hover', function (string $path) {
    $source = file_get_contents(base_path($path));

    expect($source)->not->toMatch('/<Link\b[^>]*\bprefetch\b/s');
})->with([
    'app header' => 'resources/js/components/app-header.tsx',
    'app sidebar' => 'resources/js/components/app-sidebar.tsx',
    'navigation footer' => 'resources/js/components/nav-footer.tsx',
    'navigation main' => 'resources/js/components/nav-main.tsx',
    'user menu' => 'resources/js/components/user-menu-content.tsx',
]);
