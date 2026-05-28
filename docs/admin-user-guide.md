# Mind Ease Admin User Guide

This guide explains how admin users operate the Laravel backend at `http://localhost:8000`. The backend is an authenticated Inertia React admin panel for managing Mind Ease content, provider directory entries, site settings, page visibility, and account security.

## Sign In

![Login screen](admin-user-guide/01-login.png)

Open `http://localhost:8000/login`.

Use the admin email and password provided by the project owner. In the local development database used for this guide, `codex@example.com` with password `password` signs in successfully.

The login page supports:

- Email and password sign in.
- Passkey sign in, when passkeys have been configured for the account.
- Remember me sessions.
- Forgot password recovery.

After signing in, the app redirects to the dashboard. Most admin screens require both authentication and a verified email address.

## Dashboard

![Dashboard overview](admin-user-guide/02-dashboard.png)

The dashboard is the admin landing page. Use it to review current published content counts and program activity.

The overview cards summarize:

- Resources, grouped by resource category.
- Opportunities and news, grouped by category.
- Counselling providers, grouped by service location.
- Program updates, with calendar-based filtering.

The Program Event Calendar shows scheduled program activity details. Use the Country and Location filters to narrow visible events. Member-only counts highlight records restricted to internal members.

## Navigation And Shared Actions

![Program updates list and sidebar navigation](admin-user-guide/03-program-updates-list.png)

The left sidebar groups admin areas by workflow:

- Overview: Dashboard.
- Content Management: Program Updates, Opportunities & News, Resources, Timeline.
- Directory: Counselling Providers.
- System: Site Settings, Go to Website, Documentation.

Most list screens use the same admin patterns:

- `Add New` opens a create form.
- Pencil or edit actions open the edit form for an existing record.
- Delete actions ask for confirmation before removing a record.
- Published and member-only badges show frontend visibility.

The key visibility switches are consistent across content forms:

- `Publish`: the item can appear through public frontend/API content if enabled.
- `Internal Members Only`: the item is hidden from guest users and limited to signed-in member access where the frontend honors member-only filtering.

## Program Updates

![Program update form](admin-user-guide/04-program-updates-form.png)

Program Updates manage program activity content and scheduled event details.

Use `Program Updates > Add New` to create an update. Complete the main content fields first:

- Title.
- Description using the rich text editor.
- Quarter, year, and date.
- Country offices.
- Facilitator.
- Event type: `In Person`, `Online`, or `Hybrid`.

Use Activity Details for the calendar-specific schedule. Each activity can include:

- Start date and end date.
- Country office.
- Event type.
- Event link, shown when the activity is online.
- Location.

Use `Add Activity` when one program update has multiple scheduled activity entries.

The right-side controls set:

- Internal member restriction.
- Published status.
- Order.
- Feature image.
- Gallery images.

Choose `Create` or `Save Program Update` to store changes.

### Program Update Lookup Data

![Program update locations](admin-user-guide/05-program-update-locations.png)

Locations are used by program activity details and dashboard calendar filters. Add each location with a name and country office where applicable. Existing locations can be edited inline and deleted after confirmation.

![Program update country offices](admin-user-guide/06-program-update-country-offices.png)

Country Offices classify program updates and activity details. Add country office names before assigning them to program updates.

## Opportunities And News

![Opportunities and news list](admin-user-guide/07-opportunities-news-list.png)

Opportunities & News records are short public content items such as events, opportunities, or news posts.

Use the list to review title, category, publication state, member-only state, and created date. Edit existing records from the row action, or use `Add New`.

![Opportunities and news form](admin-user-guide/08-opportunities-news-form.png)

The create and edit form includes:

- Title.
- Description using the rich text editor.
- One or more categories.
- Internal member restriction.
- Published status.
- Featured image.

Only published records are intended for public frontend/API consumption.

![Opportunities and news categories](admin-user-guide/09-opportunities-news-categories.png)

Categories organize opportunity and news records. Add categories before assigning them on the content form. Categories used by existing records may not be safe to delete without first moving or removing those records.

## Resources

![Resources list](admin-user-guide/10-resources-list.png)

Resources manage linked documents, slide decks, videos, mental health messages, and similar materials.

The list shows the title, classification, publication state, member-only state, and created date. Use row actions to edit or delete a resource.

![Resource form](admin-user-guide/11-resources-form.png)

The resource form includes:

- Title.
- Description using the rich text editor.
- Year.
- URL, usually an external resource or drive link.
- Category.
- Language.
- Internal member restriction.
- Published status.
- Order.
- Feature image.

Set category and language before publishing so the frontend can filter and display the resource correctly.

![Resource categories](admin-user-guide/12-resource-categories.png)

Resource Categories classify resources by type, such as documents, videos, or slides. Add and edit category names from this page.

![Resource languages](admin-user-guide/13-resource-languages.png)

Resource Languages classify resources by language. Add and edit language names from this page.

## Counselling Providers

![Counselling providers list](admin-user-guide/14-counselling-providers-list.png)

Counselling Providers manage the public provider directory.

The list shows provider name, service modes, publication state, member-only state, and created date. Service modes display from the saved provider data.

![Counselling provider form](admin-user-guide/15-counselling-providers-form.png)

The create and edit form includes:

- Provider name.
- Provider background using the rich text editor.
- Number of professionals.
- Professional types.
- Languages.
- Service locations.
- Office hours.
- Contact methods.
- Phone numbers.
- Email.
- Website URL.
- Facebook page name and Facebook URL.
- Service modes: `In Person` and/or `Online`.
- Internal member restriction.
- Published status.
- Sort order.
- Logo upload.

Use the phone number repeater to add multiple numbers. Empty phone number rows are removed when the form is submitted.

![Service locations](admin-user-guide/16-service-locations.png)

Service Locations are lookup values for provider locations and dashboard provider filters. Add service locations before assigning them to providers.

## Timeline

![Timeline list](admin-user-guide/17-timelines-list.png)

Timeline records power chronological milestone content. Use the list to review existing items and their created date.

![Timeline form](admin-user-guide/18-timelines-form.png)

The timeline form includes:

- Title.
- Year.
- Description using the rich text editor.
- Order.
- Featured image.

Use Order to control display sequence when multiple timeline entries share nearby years or when manual sorting is needed.

## Site Settings

![Site settings](admin-user-guide/19-site-settings.png)

Site Settings control global public-facing copy and contact details.

Editable fields include:

- Site Name.
- Tagline.
- Description.
- Email.
- Phone.
- Viber Channel Link. This must be a valid URL when provided.
- Goal.
- Objectives.

Choose `Save` after updates. These settings are exposed to the public API and frontend site where used.

## Page Settings

![Page settings](admin-user-guide/20-page-settings.png)

Page Settings control frontend page availability and member-only restrictions.

Each managed page has two switches:

- `Internal Members Only`: restricts the page to members.
- `Publish`: enables or disables the page.

Choose `Save` after changing page access. Unpublished pages should not be treated as publicly available.

## Profile Settings

![Profile settings](admin-user-guide/21-profile-settings.png)

Profile Settings manage the signed-in admin account.

You can update:

- Name.
- Email address.
- Avatar URL.

Changing the email address may affect verification state. The Delete Account action is destructive and should only be used when the account is intentionally being removed.

## Security Settings

![Security settings](admin-user-guide/22-security-settings.png)

Security Settings manage account password and second-factor protections.

Password updates require:

- Current password.
- New password.
- New password confirmation.

The page also supports two-factor authentication and passkey management when those Fortify features are enabled for the account. Some security screens require password confirmation before access.

## Media Uploads

![Feature and gallery upload controls](admin-user-guide/04-program-updates-form.png)

Content forms use image upload controls for feature images, gallery images, provider logos, and timeline featured images.

General rules:

- Use image files only.
- Maximum image upload size is 5 MB where validated by the backend.
- Use remove controls on edit screens when an existing image should be cleared.
- Program Updates support both a single feature image and multiple gallery images.
- Opportunities & News, Resources, Timelines, and Counselling Providers use one primary image/logo field.

If uploaded images do not appear, check that Laravel public storage is linked correctly and that the file is available under `/storage`.

## Public Visibility Rules

![Page and publication controls](admin-user-guide/20-page-settings.png)

Admin content can exist in the backend without being visible on the public frontend.

Use these rules when publishing:

- Draft content should keep `Publish` disabled.
- Public content should enable `Publish`.
- Restricted content should enable both `Publish` and `Internal Members Only`.
- Page-level restrictions in Page Settings can hide or restrict an entire frontend page even if individual content records are published.
- Records without required classification data may be harder for frontend users to find, even when published.

The public API filters published and member-only content before returning records to the frontend.

## Troubleshooting

![Profile menu and admin shell](admin-user-guide/02-dashboard.png)

Common admin issues:

- If a page redirects to login, sign in again.
- If a security page asks for confirmation, enter the current password.
- If a content item does not appear on the frontend, check `Publish`, `Internal Members Only`, page settings, category/language/location assignments, and frontend caching/build state.
- If an uploaded image does not display, check the public storage link and file path.
- If a Viber link or website URL fails validation, enter a full URL such as `https://example.com`.
- If frontend changes are not reflected locally, run the frontend dev server or rebuild assets with the project commands.

Useful local commands for developers supporting admin users:

```bash
php artisan route:list --except-vendor
php artisan test --compact
npm run build
```
