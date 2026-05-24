const fs = require("fs");
const file = "app/Http/Controllers/Api/V1/PublicContentController.php";
let content = fs.readFileSync(file, "utf8");

// 1. Convert ->get()->map( to ->paginate(15)->through(
content = content.replace(/->get\(\)[\r\n\s]+->map\(/g, "->paginate(15)\n                ->through(");

// 2. The through block ends with `        ])->values(),\n        ]);`
// So we just replace `])->values(),\n        ]);` with `]),\n        ]);`
content = content.replace(/\]\)->values\(\),(\s*\]\);)/g, "]),$1");

fs.writeFileSync(file, content);
console.log("Done");
