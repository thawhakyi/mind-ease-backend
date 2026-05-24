const fs = require("fs");
const file = "app/Http/Controllers/Api/V1/PublicContentController.php";
let content = fs.readFileSync(file, "utf8");
content = content.replace(/return response\(\)->json\(\[\s*'data' => ([\s\S]*?)\n\s*\]\);/g, "return response()->json(`$1);");
fs.writeFileSync(file, content);
console.log("Done");
