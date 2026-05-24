const fs = require("fs");
const file = "app/Http/Controllers/Api/V1/PublicContentController.php";
let content = fs.readFileSync(file, "utf8");

// 1. Convert get()->map to paginate(15)->through
content = content.replace(/->get\(\)[\r\n\s]+->map\(/g, "->paginate(15)\n                ->through(");

// 2. Remove ->values() from the end of the through closure
// The closure returns an array like `fn (...): array => [ ... ])->values(),`
// We want to remove `->values()` so it becomes `])`
content = content.replace(/\]\)->values\(\)/g, "]");

// 3. Flatten the JSON response for the paginated queries
// Original: return response()->json([\n            'data' => Model::query()...]\n        ]);
// New: return response()->json(Model::query()...]);
content = content.replace(/return response\(\)->json\(\[\s*'data'\s*=>\s*(.*?::query\(\)[\s\S]*?\]\))\s*,?\s*\]\);/g, "return response()->json($1);");

fs.writeFileSync(file, content);
console.log("Done");
