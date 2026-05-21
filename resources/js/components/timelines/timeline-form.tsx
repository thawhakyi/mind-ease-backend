import { useForm } from '@inertiajs/react';
import { ImageIcon } from 'lucide-react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
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
import { RichTextEditor } from '@/components/ui/rich-text-editor';

type FormValues = {
    title: string;
    year: string;
    description: string;
    sort_order: string;
    featured_image: File | null;
};

type Props = {
    action: string;
    method?: 'post' | 'patch';
    submitLabel: string;
    timeline?: {
        title: string;
        year?: string | null;
        description?: string | null;
        sort_order?: number | null;
        featured_image_path?: string | null;
    };
};

export default function TimelineForm({
    action,
    method = 'post',
    submitLabel,
    timeline,
}: Props) {
    const form = useForm<FormValues>({
        title: timeline?.title ?? '',
        year: timeline?.year ?? '',
        description: timeline?.description ?? '',
        sort_order: timeline?.sort_order?.toString() ?? '0',
        featured_image: null,
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
                        placeholder="Timeline title"
                    />
                    <FieldError errors={fieldErrors(errors, 'title')} />
                </Field>

                <Field data-invalid={!!form.errors.year}>
                    <FieldLabel htmlFor="year">Year</FieldLabel>
                    <Input
                        id="year"
                        value={form.data.year}
                        onChange={(event) =>
                            form.setData('year', event.target.value)
                        }
                        aria-invalid={!!form.errors.year}
                        placeholder="2026"
                    />
                    <FieldError errors={fieldErrors(errors, 'year')} />
                </Field>

                <Field data-invalid={!!form.errors.description}>
                    <FieldLabel htmlFor="description">Description</FieldLabel>
                    <RichTextEditor
                        id="description"
                        value={form.data.description}
                        onChange={(value) => form.setData('description', value)}
                        aria-invalid={!!form.errors.description}
                        placeholder="Write timeline details..."
                    />
                    <FieldError errors={fieldErrors(errors, 'description')} />
                </Field>

                <div>
                    <Button disabled={form.processing}>{submitLabel}</Button>
                </div>
            </FieldGroup>

            <aside className="flex flex-col gap-4">
                <FieldSet className="rounded-lg border p-4">
                    <FieldLegend>Publishing</FieldLegend>
                    <FieldGroup>
                        <Field data-invalid={!!form.errors.sort_order}>
                            <FieldLabel htmlFor="sort_order">
                                Sort order
                            </FieldLabel>
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

                <FieldSet className="rounded-lg border p-4">
                    <FieldLegend>Featured Image</FieldLegend>
                    <FieldGroup>
                        {timeline?.featured_image_path && (
                            <img
                                src={`/storage/${timeline.featured_image_path}`}
                                alt=""
                                className="aspect-video w-full rounded-md border object-cover"
                            />
                        )}
                        <Field data-invalid={!!form.errors.featured_image}>
                            <FieldLabel htmlFor="featured_image">
                                <span className="inline-flex items-center gap-2">
                                    <ImageIcon className="size-4" />
                                    Image
                                </span>
                            </FieldLabel>
                            <Input
                                id="featured_image"
                                type="file"
                                accept="image/*"
                                onChange={(event) =>
                                    form.setData(
                                        'featured_image',
                                        event.target.files?.[0] ?? null,
                                    )
                                }
                                aria-invalid={!!form.errors.featured_image}
                            />
                            {form.data.featured_image && (
                                <FieldDescription>
                                    {form.data.featured_image.name}
                                </FieldDescription>
                            )}
                            <FieldError
                                errors={fieldErrors(errors, 'featured_image')}
                            />
                        </Field>
                    </FieldGroup>
                </FieldSet>
            </aside>
        </form>
    );
}

function fieldErrors(errors: Record<string, string | undefined>, key: string) {
    return errors[key] ? [{ message: errors[key] }] : undefined;
}
