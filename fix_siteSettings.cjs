const fs = require("fs");
const file = "app/Http/Controllers/Api/V1/PublicContentController.php";
let content = fs.readFileSync(file, "utf8");

content = content.replace(/\]\),\);/g, "]);");

const siteSettingsReplacement = `return response()->json([
            'data' => \\App\\Models\\SiteSetting::current()->only([
                'site_name',
                'tagline',
                'description',
                'email',
                'phone',
                'viber_channel_number',
                'goal',
                'objectives',
            ]),
        ]);`;

content = content.replace(/return response\(\)->json\(\\App\\Models\\SiteSetting::current\(\)->only\(\[[\s\S]*?\]\),\);/, siteSettingsReplacement);
// Wait, the previous replace changed ]),); to ]); so we must match ]);
content = content.replace(/return response\(\)->json\(\\App\\Models\\SiteSetting::current\(\)->only\(\[[\s\S]*?\]\);\);/, siteSettingsReplacement);
content = content.replace(/return response\(\)->json\(\\App\\Models\\SiteSetting::current\(\)->only\(\[[\s\S]*?\]\);\)/, siteSettingsReplacement);

fs.writeFileSync(file, content);
console.log("Done");
