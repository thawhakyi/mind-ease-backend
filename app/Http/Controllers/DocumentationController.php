<?php

namespace App\Http\Controllers;

use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class DocumentationController extends Controller
{
    public function __invoke(): Response
    {
        $path = base_path('docs/admin-user-guide.md');

        abort_unless(is_file($path), 404);

        $markdown = file_get_contents($path) ?: '';
        $markdown = str_replace('(admin-user-guide/', '(/documentation/assets/', $markdown);
        $contentHtml = Str::markdown($markdown, [
            'html_input' => 'strip',
            'allow_unsafe_links' => false,
        ]);
        [$contentHtml, $tableOfContents] = $this->addHeadingAnchors($contentHtml);

        return Inertia::render('documentation/admin-user-guide', [
            'contentHtml' => $contentHtml,
            'tableOfContents' => $tableOfContents,
        ]);
    }

    public function asset(string $file): BinaryFileResponse
    {
        abort_unless(preg_match('/^[a-z0-9][a-z0-9.-]*\.png$/i', $file) === 1, 404);

        $path = base_path('docs/admin-user-guide/'.$file);

        abort_unless(is_file($path), 404);

        return response()->file($path, [
            'Cache-Control' => 'private, max-age=3600',
        ]);
    }

    /**
     * @return array{0: string, 1: array<int, array{id: string, title: string, level: int}>}
     */
    private function addHeadingAnchors(string $contentHtml): array
    {
        $usedIds = [];
        $tableOfContents = [];

        $contentHtml = preg_replace_callback(
            '/<h([23])>(.*?)<\/h\1>/s',
            function (array $matches) use (&$usedIds, &$tableOfContents): string {
                $level = (int) $matches[1];
                $title = trim(html_entity_decode(strip_tags($matches[2])));
                $id = Str::slug($title);

                if ($id === '') {
                    $id = 'section';
                }

                $baseId = $id;
                $counter = 2;

                while (in_array($id, $usedIds, true)) {
                    $id = $baseId.'-'.$counter;
                    $counter++;
                }

                $usedIds[] = $id;
                $tableOfContents[] = [
                    'id' => $id,
                    'title' => $title,
                    'level' => $level,
                ];

                return sprintf('<h%d id="%s">%s</h%d>', $level, e($id), $matches[2], $level);
            },
            $contentHtml,
        ) ?? $contentHtml;

        return [$contentHtml, $tableOfContents];
    }
}
