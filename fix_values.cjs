const fs = require("fs");
const file = "app/Http/Controllers/Api/V1/PublicContentController.php";
let content = fs.readFileSync(file, "utf8");
content = content.replace(/\}\)->values\(\),/g, "}),");
content = content.replace(/\]\)->values\(\),/g, "]),");
fs.writeFileSync(file, content);
console.log("Done");
