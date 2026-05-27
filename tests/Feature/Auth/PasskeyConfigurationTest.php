<?php

use Illuminate\Support\Env;

test('passkey relying party and origins can be overridden for deployment', function () {
    $repository = Env::getRepository();

    $repository->set('PASSKEYS_RELYING_PARTY_ID', 'admin.example.com');
    $repository->set('PASSKEYS_ALLOWED_ORIGINS', 'https://admin.example.com, https://www.admin.example.com');

    config(['app.url' => 'http://localhost']);

    try {
        $fortify = require config_path('fortify.php');

        expect($fortify['passkeys']['relying_party_id'])->toBe('admin.example.com')
            ->and($fortify['passkeys']['allowed_origins'])->toBe([
                'https://admin.example.com',
                'https://www.admin.example.com',
            ]);
    } finally {
        $repository->clear('PASSKEYS_RELYING_PARTY_ID');
        $repository->clear('PASSKEYS_ALLOWED_ORIGINS');
    }
});
