# Spec: Rich Text Editor Component

## Objective

Add a reusable shadcn-style rich text editor component for React/Inertia screens. The component should provide basic WYSIWYG formatting controls and emit HTML for form submission or storage.

## Tech Stack

Laravel, Inertia React, TypeScript, Tailwind CSS v4, shadcn/ui radix-nova, lucide-react icons.

## Commands

Build: `npm run build`
Type check: `npm run types:check`
Lint: `npm run lint:check`
Dev: `npm run dev`

## Project Structure

`resources/js/components/ui` contains shadcn UI components.
`docs/specs` contains lightweight implementation specs.

## Code Style

```tsx
<RichTextEditor
    value={body}
    onChange={setBody}
    placeholder="Write your note..."
/>
```

Use existing shadcn primitives, semantic Tailwind tokens, lucide icons, and alias imports from `@/`.

## Testing Strategy

No JavaScript unit test runner is configured. Verify with TypeScript, ESLint, and Vite build.

## Boundaries

- Always: Keep the component reusable, typed, and dependency-light.
- Ask first: Add a heavy editor framework or a third-party registry component.
- Never: Wire the component into a page without a separate product requirement.

## Success Criteria

- A `RichTextEditor` component exists under `resources/js/components/ui`.
- It supports controlled and uncontrolled HTML values.
- It exposes toolbar controls for common text formatting.
- Type checking, lint checking, and build complete successfully.
