import { useForm } from '@inertiajs/react';
import { ChevronsUpDownIcon, LockIcon, RadioIcon } from 'lucide-react';
import type { ComponentType, FormEvent } from 'react';
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

type LanguageOption = {
    id: number;
    name: string;
};

type FormValues = {
    title: string;
    description: string;
    year: string;
    resource_category_id: number | '';
    resource_language_id: number | '';
    url: string;
    internal_members_only: boolean;
    is_published: boolean;
    sort_order: string;
    feature_image: File | null;
    remove_feature_image: boolean;
};

type Props = {
    action: string;
    categories: CategoryOption[];
    languages: LanguageOption[];
    method?: 'post' | 'patch';
    resource?: {
        title: string;
        description?: string | null;
        year?: number | null;
        resource_category_id?: number | null;
        resource_language_id?: number | null;
        url?: string | null;
        internal_members_only?: boolean;
        is_published?: boolean;
        sort_order?: number | null;
        feature_image_path?: string | null;
    };
    submitLabel: string;
};

export default function ResourceForm({
    action,
    categories,
    languages,
    method = 'post',
    resource,
    submitLabel,
}: Props) {
    const form = useForm<FormValues>({
        title: resource?.title ?? '',
        description: resource?.description ?? '',
        year: resource?.year?.toString() ?? new Date().getFullYear().toString(),
        resource_category_id: resource?.resource_category_id ?? '',
        resource_language_id: resource?.resource_language_id ?? '',
        url: resource?.url ?? '',
        internal_members_only: resource?.internal_members_only ?? false,
        is_published: resource?.is_published ?? false,
        sort_order: resource?.sort_order?.toString() ?? '0',
        feature_image: null,
        remove_feature_image: false,
    });
    const errors = form.errors as Record<string, string | undefined>;

    function submit(event: FormEvent<HTMLFormElement>) {
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
            <FieldGroup>
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
                        placeholder="Resource title"
                    />
                    <FieldError errors={fieldErrors(errors, 'title')} />
                </Field>

                <Field data-invalid={!!form.errors.description}>
                    <FieldLabel htmlFor="description">Description</FieldLabel>
                    <RichTextEditor
                        id="description"
                        value={form.data.description}
                        onChange={(value) => form.setData('description', value)}
                        aria-invalid={!!form.errors.description}
                        placeholder="Write the resource details..."
                    />
                    <FieldError errors={fieldErrors(errors, 'description')} />
                </Field>

                <div className="grid gap-4 md:grid-cols-2">
                    <Field data-invalid={!!form.errors.year}>
                        <FieldLabel htmlFor="year">Year</FieldLabel>
                        <Input
                            id="year"
                            type="number"
                            min={1900}
                            max={2100}
                            value={form.data.year}
                            onChange={(event) =>
                                form.setData('year', event.target.value)
                            }
                            aria-invalid={!!form.errors.year}
                            placeholder="2026"
                        />
                        <FieldError errors={fieldErrors(errors, 'year')} />
                    </Field>

                    <Field data-invalid={!!form.errors.url}>
                        <FieldLabel htmlFor="url">URL</FieldLabel>
                        <Input
                            id="url"
                            type="url"
                            value={form.data.url}
                            onChange={(event) =>
                                form.setData('url', event.target.value)
                            }
                            aria-invalid={!!form.errors.url}
                            placeholder="https://example.com/resource"
                        />
                        <FieldError errors={fieldErrors(errors, 'url')} />
                    </Field>
                </div>

                <div>
                    <Button disabled={form.processing}>{submitLabel}</Button>
                </div>
            </FieldGroup>

            <aside className="flex flex-col gap-4">
                <FieldSet className="rounded-lg border p-4">
                    <FieldLegend>Classification</FieldLegend>
                    <FieldGroup>
                        <Field
                            data-invalid={!!form.errors.resource_category_id}
                        >
                            <FieldLabel>Category</FieldLabel>
                            <CategoryCombobox
                                categories={categories}
                                selectedId={form.data.resource_category_id}
                                onChange={(selectedId) =>
                                    form.setData(
                                        'resource_category_id',
                                        selectedId,
                                    )
                                }
                            />
                            <FieldError
                                errors={fieldErrors(
                                    errors,
                                    'resource_category_id',
                                )}
                            />
                        </Field>

                        <Field
                            data-invalid={!!form.errors.resource_language_id}
                        >
                            <FieldLabel>Language</FieldLabel>
                            <LanguageCombobox
                                languages={languages}
                                selectedId={form.data.resource_language_id}
                                onChange={(selectedId) =>
                                    form.setData(
                                        'resource_language_id',
                                        selectedId,
                                    )
                                }
                            />
                            <FieldError
                                errors={fieldErrors(
                                    errors,
                                    'resource_language_id',
                                )}
                            />
                        </Field>
                    </FieldGroup>
                </FieldSet>

                <FieldSet className="rounded-lg border p-4">
                    <FieldLegend>Publishing</FieldLegend>
                    <FieldGroup>
                        <SwitchField
                            checked={form.data.internal_members_only}
                            description="Restrict this resource to internal members."
                            error={errors.internal_members_only}
                            icon={LockIcon}
                            label="Internal Members Only"
                            onCheckedChange={(checked) =>
                                form.setData('internal_members_only', checked)
                            }
                        />
                        <SwitchField
                            checked={form.data.is_published}
                            description="Show this resource as published."
                            error={errors.is_published}
                            icon={RadioIcon}
                            label="Publish"
                            onCheckedChange={(checked) =>
                                form.setData('is_published', checked)
                            }
                        />

                        <Field data-invalid={!!form.errors.sort_order}>
                            <FieldLabel htmlFor="sort_order">Order</FieldLabel>
                            <Input
                                id="sort_order"
                                type="number"
                                min={0}
                                value={form.data.sort_order}
                                onChange={(event) =>
                                    form.setData(
                                        'sort_order',
                                        event.target.value,
                                    )
                                }
                                aria-invalid={!!form.errors.sort_order}
                            />
                            <FieldError
                                errors={fieldErrors(errors, 'sort_order')}
                            />
                        </Field>
                    </FieldGroup>
                </FieldSet>

                <FeatureImageUpload
                    error={errors.feature_image}
                    file={form.data.feature_image}
                    imagePath={
                        form.data.remove_feature_image
                            ? null
                            : (resource?.feature_image_path ?? null)
                    }
                    inputId="feature_image"
                    legend="Feature Image"
                    onChange={(file) =>
                        form.setData((data) => ({
                            ...data,
                            feature_image: file,
                            remove_feature_image: false,
                        }))
                    }
                    onRemove={() =>
                        form.setData((data) => ({
                            ...data,
                            feature_image: null,
                            remove_feature_image: true,
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

function CategoryCombobox({
    categories,
    onChange,
    selectedId,
}: {
    categories: CategoryOption[];
    onChange: (selectedId: number | '') => void;
    selectedId: number | '';
}) {
    const selectedCategory = categories.find(
        (category) => category.id === selectedId,
    );

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
                        {selectedCategory?.name ?? 'Select category'}
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
                                const isSelected = category.id === selectedId;

                                return (
                                    <CommandItem
                                        key={category.id}
                                        value={category.name}
                                        data-checked={isSelected}
                                        onSelect={() =>
                                            onChange(
                                                isSelected ? '' : category.id,
                                            )
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

function LanguageCombobox({
    languages,
    onChange,
    selectedId,
}: {
    languages: LanguageOption[];
    onChange: (selectedId: number | '') => void;
    selectedId: number | '';
}) {
    const selectedLanguage = languages.find(
        (language) => language.id === selectedId,
    );

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
                        {selectedLanguage?.name ?? 'Select language'}
                    </span>
                    <ChevronsUpDownIcon data-icon="inline-end" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-(--radix-popover-trigger-width) min-w-56 p-0">
                <Command>
                    <CommandInput placeholder="Search language..." />
                    <CommandList>
                        <CommandEmpty>No language found.</CommandEmpty>
                        <CommandGroup>
                            {languages.map((language) => {
                                const isSelected = language.id === selectedId;

                                return (
                                    <CommandItem
                                        key={language.id}
                                        value={language.name}
                                        data-checked={isSelected}
                                        onSelect={() =>
                                            onChange(
                                                isSelected ? '' : language.id,
                                            )
                                        }
                                    >
                                        {language.name}
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
