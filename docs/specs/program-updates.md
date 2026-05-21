# Spec: Program Updates CRUD

## Objective

Add an authenticated Program Updates section with submenus for Add New, Country Office, and Location. Users can manage program updates and the lookup data needed to classify them.

## Tech Stack

Laravel, Inertia React, TypeScript, Tailwind CSS v4, shadcn/ui.

## Commands

Build: `npm run build`
Frontend type check: `npm run types:check`
Frontend lint: `npm run lint:check`
PHP tests: `php artisan test tests/Feature/ProgramUpdatesTest.php`
All tests: `composer test`

## Project Structure

`app/Models` contains Eloquent models.
`app/Http/Controllers/ProgramUpdates` contains Program Updates controllers.
`database/migrations` contains the Program Updates schema.
`resources/js/pages/program-updates` contains Inertia pages.
`resources/js/components` contains shared navigation changes.

## Code Style

```tsx
<Link href="/program-updates/create">Add New</Link>
```

Follow existing Laravel/Inertia patterns and keep forms simple.

## Testing Strategy

Use Pest feature tests for authenticated route access and CRUD behavior. Use TypeScript, ESLint, Prettier, and Vite build for React verification.

## Boundaries

- Always: Protect routes with `auth` and `verified`.
- Ask first: Add authorization roles, publishing workflows, or rich editor storage.
- Never: Expose program update management to guests.

## Success Criteria

- Program Updates appears in navigation with Add New, Country Office, and Location submenus.
- Authenticated users can create, update, list, and delete program updates.
- Authenticated users can manage country offices and locations.
- Feature tests, type checks, lint checks, formatting checks, and build pass.
