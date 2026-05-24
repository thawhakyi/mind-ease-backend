import { useForm } from '@inertiajs/react';
import { ChevronsUpDownIcon, LockIcon, RadioIcon } from 'lucide-react';
import type { ComponentType } from 'react';
import { FeatureImageUpload } from '@/components/feature-image-upload';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { Switch } from '@/components/ui/switch';

type CategoryOption = {
    id: number;
    name: string;
};

type FormValues = {
    title: string;
    description: string;
    category_ids: number[];
    internal_members_only: boolean;
    is_published: boolean;
    featured_image: File | null;
    remove_featured_image: boolean;
};

type Props = {
    action: string;
    categories: CategoryOption[];
    item?: {
        title: string;
        description?: string | null;
        category_ids?: number[];
        featured_image_path?: string | null;
        internal_members_only?: boolean | null;
        is_published?: boolean | null;
    };
    method?: 'post' | 'patch';
    submitLabel: string;
};

export default function OpportunityNewsForm({
    action,
    categories,
    item,
    method = 'post',
    submitLabel,
}: Props) {
    const form = useForm<FormValues>({
        title: item?.title ?? '',
        description: item?.description ?? '',
        category_ids: item?.category_ids ?? [],
        internal_members_only: item?.internal_members_only ?? false,
        is_published: item?.is_published ?? false,
        featured_image: null,
        remove_featured_image: false,
    });
    const errors = form.errors as Record<string, string | undefined>;

    function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (method === 'patch') {
            form.transform((data) => ({
                ...data,
                _method: 'patch',
            }));
            form.post(action, {
                forceFormData: true,
                preserveScroll: true,
                onFinish: () => form.transform((data) => data),
            });

            return;
        }

        form.post(action, {
            forceFormData: true,
            preserveScroll: true,
        });
    }

    return (
        <form
            onSubmit={submit}
            className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]"
        >
            <div>
                <FieldGroup className="rounded-lg border border-border bg-card p-4">
                    <Field data-invalid={!!form.errors.title}>
                        <FieldLabel htmlFor="title">Title</FieldLabel>
                        <Input
                            id="title"
                            value={form.data.title}
                            onChange={(event) =>
                                form.setData('title', event.target.value)
                            }
                            required
                            aria-invalid={!!form.errors.title}
                            placeholder="Opportunity or news title"
                        />
                        <FieldError errors={fieldErrors(errors, 'title')} />
                    </Field>

                    <Field data-invalid={!!form.errors.description}>
                        <FieldLabel htmlFor="description">
                            Description
                        </FieldLabel>
                        <RichTextEditor
                            id="description"
                            value={form.data.description}
                            onChange={(value) =>
                                form.setData('description', value)
                            }
                            aria-invalid={!!form.errors.description}
                            placeholder="Write the opportunity or news details..."
                        />
                        <FieldError
                            errors={fieldErrors(errors, 'description')}
                        />
                    </Field>

                    <div>
                        <Button disabled={form.processing}>
                            {submitLabel}
                        </Button>
                    </div>
                </FieldGroup>
            </div>

            <aside className="flex flex-col gap-4">
                <FieldSet className="rounded-lg border p-4">
                    <FieldLegend>Category</FieldLegend>
                    <FieldGroup>
                        <Field data-invalid={!!form.errors.category_ids}>
                            <CategoryMultiSelect
                                categories={categories}
                                selectedIds={form.data.category_ids}
                                onChange={(selectedIds) =>
                                    form.setData('category_ids', selectedIds)
                                }
                            />
                            <FieldError
                                errors={fieldErrors(errors, 'category_ids')}
                            />
                        </Field>
                    </FieldGroup>
                </FieldSet>

                <FieldSet className="rounded-lg border p-4">
                    <FieldLegend>Publishing</FieldLegend>
                    <FieldGroup>
                        <SwitchField
                            checked={form.data.internal_members_only}
                            description="Restrict this item to internal members."
                            error={errors.internal_members_only}
                            icon={LockIcon}
                            label="Internal Members Only"
                            onCheckedChange={(checked) =>
                                form.setData('internal_members_only', checked)
                            }
                        />

                        <SwitchField
                            checked={form.data.is_published}
                            description="Show this item as published."
                            error={errors.is_published}
                            icon={RadioIcon}
                            label="Publish"
                            onCheckedChange={(checked) =>
                                form.setData('is_published', checked)
                            }
                        />
                    </FieldGroup>
                </FieldSet>

                <FeatureImageUpload
                    error={errors.featured_image}
                    file={form.data.featured_image}
                    imagePath={
                        form.data.remove_featured_image
                            ? null
                            : (item?.featured_image_path ?? null)
                    }
                    inputId="featured_image"
                    legend="Featured Image"
                    onChange={(file) =>
                        form.setData((data) => ({
                            ...data,
                            featured_image: file,
                            remove_featured_image: false,
                        }))
                    }
                    onRemove={() =>
                        form.setData((data) => ({
                            ...data,
                            featured_image: null,
                            remove_featured_image: true,
                        }))
                    }
                />
            </aside>
        </form>
    );
}

function fieldErrors(errors: Record<string, string | undefined>, key: string) {
    return errors[key] ? [{ message: errors[key] }] : undefined;
}

function SwitchField({
    checked,
    description,
    error,
    icon: Icon,
    label,
    onCheckedChange,
}: {
    checked: boolean;
    description: string;
    error?: string;
    icon: ComponentType<{ className?: string }>;
    label: string;
    onCheckedChange: (checked: boolean) => void;
}) {
    return (
        <Field
            orientation="horizontal"
            data-invalid={!!error}
            className="rounded-md border p-3"
        >
            <div className="flex min-w-0 flex-1 gap-3">
                <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0">
                    <FieldLabel>{label}</FieldLabel>
                    <FieldDescription>{description}</FieldDescription>
                    <FieldError
                        errors={error ? [{ message: error }] : undefined}
                    />
                </div>
            </div>
            <Switch checked={checked} onCheckedChange={onCheckedChange} />
        </Field>
    );
}

function CategoryMultiSelect({
    categories,
    onChange,
    selectedIds,
}: {
    categories: CategoryOption[];
    onChange: (selectedIds: number[]) => void;
    selectedIds: number[];
}) {
    const selectedCategories = categories.filter((category) =>
        selectedIds.includes(category.id),
    );

    function toggleCategory(categoryId: number) {
        if (selectedIds.includes(categoryId)) {
            onChange(selectedIds.filter((id) => id !== categoryId));

            return;
        }

        onChange([...selectedIds, categoryId]);
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                >
                    <span className="truncate">
                        {selectedCategories.length > 0
                            ? selectedCategories
                                  .map((category) => category.name)
                                  .join(', ')
                            : 'Select categories'}
                    </span>
                    <ChevronsUpDownIcon data-icon="inline-end" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-(--radix-popover-trigger-width) min-w-56 p-0">
                <Command>
                    <CommandInput placeholder="Search category..." />
                    <CommandList>
                        <CommandEmpty>No category found.</CommandEmpty>
                        <CommandGroup>
                            {categories.map((category) => {
                                const isSelected = selectedIds.includes(
                                    category.id,
                                );

                                return (
                                    <CommandItem
                                        key={category.id}
                                        value={category.name}
                                        data-checked={isSelected}
                                        onSelect={() =>
                                            toggleCategory(category.id)
                                        }
                                    >
                                        {category.name}
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
