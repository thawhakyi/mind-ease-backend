const fs = require("fs");
const file = "app/Http/Controllers/Api/V1/PublicContentController.php";
let content = fs.readFileSync(file, "utf8");
content = content.replace(/->get\(\)[\r\n\s]+->map\(/g, "->paginate(15)\n                ->through(");
content = content.replace(/\}\)->values\(\),/g, "}),");
content = content.replace(/return response\(\)->json\(\[\s*'data' => ([^]*?)\}\),\s*\]\);/g, "return response()->json($1});");
fs.writeFileSync(file, content);
console.log("Done");
