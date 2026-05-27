import { Head, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldTitle,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { RichTextEditor } from '@/components/ui/rich-text-editor';

type SiteSettingsForm = {
    site_name: string;
    tagline: string;
    description: string;
    email: string;
    phone: string;
    viber_channel_link: string;
    goal: string;
    objectives: string;
};

type SiteSettingsPayload = {
    [Key in keyof SiteSettingsForm]: string | null;
};

export default function SiteSettings({
    siteSettings,
}: {
    siteSettings: SiteSettingsPayload;
}) {
    const form = useForm<SiteSettingsForm>({
        site_name: siteSettings.site_name ?? '',
        tagline: siteSettings.tagline ?? '',
        description: siteSettings.description ?? '',
        email: siteSettings.email ?? '',
        phone: siteSettings.phone ?? '',
        viber_channel_link: siteSettings.viber_channel_link ?? '',
        goal: siteSettings.goal ?? '',
        objectives: siteSettings.objectives ?? '',
    });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        form.put('/site-settings', {
            preserveScroll: true,
        });
    }

    return (
        <>
            <Head title="Site settings" />

            <div className="flex flex-col gap-6 p-6">
                <Heading
                    title="Site settings"
                    description="Manage public site identity and contact details"
                />

                <form
                    onSubmit={submit}
                    className="flex max-w-3xl flex-col gap-6"
                >
                    <FieldGroup className="space-y-4 rounded-lg border border-border bg-card p-4">
                        <TextField
                            error={form.errors.site_name}
                            label="Site Name"
                            name="site_name"
                            onChange={(value) =>
                                form.setData('site_name', value)
                            }
                            value={form.data.site_name}
                        />
                        <TextField
                            error={form.errors.tagline}
                            label="Tagline"
                            name="tagline"
                            onChange={(value) => form.setData('tagline', value)}
                            value={form.data.tagline}
                        />
                        <RichTextField
                            error={form.errors.description}
                            label="Description"
                            name="description"
                            onChange={(value) =>
                                form.setData('description', value)
                            }
                            value={form.data.description}
                        />
                        <TextField
                            error={form.errors.email}
                            label="Email"
                            name="email"
                            onChange={(value) => form.setData('email', value)}
                            type="email"
                            value={form.data.email}
                        />
                        <TextField
                            error={form.errors.phone}
                            label="Phone"
                            name="phone"
                            onChange={(value) => form.setData('phone', value)}
                            value={form.data.phone}
                        />
                        <TextField
                            error={form.errors.viber_channel_link}
                            label="Viber Channel Link"
                            name="viber_channel_link"
                            onChange={(value) =>
                                form.setData('viber_channel_link', value)
                            }
                            type="url"
                            value={form.data.viber_channel_link}
                        />
                        <RichTextField
                            error={form.errors.goal}
                            label="Goal"
                            name="goal"
                            onChange={(value) => form.setData('goal', value)}
                            value={form.data.goal}
                        />
                        <RichTextField
                            error={form.errors.objectives}
                            label="Objectives"
                            name="objectives"
                            onChange={(value) =>
                                form.setData('objectives', value)
                            }
                            value={form.data.objectives}
                        />
                    </FieldGroup>

                    <Button disabled={form.processing}>Save</Button>
                </form>
            </div>
        </>
    );
}

SiteSettings.layout = {
    breadcrumbs: [
        {
            title: 'Site settings',
            href: '/site-settings',
        },
    ],
};

function TextField({
    error,
    label,
    name,
    onChange,
    type = 'text',
    value,
}: {
    error?: string;
    label: string;
    name: keyof SiteSettingsForm;
    onChange: (value: string) => void;
    type?: string;
    value: string;
}) {
    return (
        <Field data-invalid={!!error}>
            <FieldLabel htmlFor={name}>{label}</FieldLabel>
            <Input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                aria-invalid={!!error}
            />
            <FieldError errors={error ? [{ message: error }] : undefined} />
        </Field>
    );
}

function RichTextField({
    error,
    label,
    name,
    onChange,
    value,
}: {
    error?: string;
    label: string;
    name: keyof SiteSettingsForm;
    onChange: (value: string) => void;
    value: string;
}) {
    const labelId = `${name}-label`;

    return (
        <Field data-invalid={!!error}>
            <FieldTitle id={labelId}>{label}</FieldTitle>
            <RichTextEditor
                aria-labelledby={labelId}
                value={value}
                onChange={onChange}
                aria-invalid={!!error}
                placeholder={`Write the ${label.toLowerCase()}...`}
            />
            <FieldError errors={error ? [{ message: error }] : undefined} />
        </Field>
    );
}
