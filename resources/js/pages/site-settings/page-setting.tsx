import { Head, useForm } from '@inertiajs/react';
import { LockIcon, RadioIcon } from 'lucide-react';
import type { ComponentType, FormEvent } from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
import { Switch } from '@/components/ui/switch';

type PageSetting = {
    key: string;
    label: string;
    internal_members_only: boolean;
    is_published: boolean;
};

type FormValues = {
    settings: PageSetting[];
};

export default function PageSetting({
    pageSettings,
}: {
    pageSettings: PageSetting[];
}) {
    const form = useForm<FormValues>({
        settings: pageSettings,
    });
    const errors = form.errors as Record<string, string | undefined>;

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        form.put('/site-settings/page-settings', {
            preserveScroll: true,
        });
    }

    function updateSetting(
        key: string,
        values: Partial<
            Pick<PageSetting, 'internal_members_only' | 'is_published'>
        >,
    ) {
        form.setData(
            'settings',
            form.data.settings.map((setting) =>
                setting.key === key ? { ...setting, ...values } : setting,
            ),
        );
    }

    return (
        <>
            <Head title="Page settings" />

            <h1 className="sr-only">Page settings</h1>

            <div className="space-y-6 p-4">
                <Heading
                    variant="small"
                    title="Page settings"
                    description="Control public access to frontend pages"
                />

                <form onSubmit={submit} className="max-w-xl space-y-6">
                    <FieldGroup>
                        {form.data.settings.map((setting, index) => (
                            <section
                                key={setting.key}
                                className="space-y-4 rounded-lg border p-4"
                            >
                                <div>
                                    <h2 className="text-base font-medium">
                                        {setting.label}
                                    </h2>
                                </div>

                                <input
                                    type="hidden"
                                    name={`settings.${index}.key`}
                                    value={setting.key}
                                />

                                <SwitchField
                                    checked={setting.internal_members_only}
                                    description="Require an allowed member account to access this page."
                                    error={
                                        errors[
                                            `settings.${index}.internal_members_only`
                                        ]
                                    }
                                    icon={LockIcon}
                                    label="Internal Members Only"
                                    onCheckedChange={(checked) =>
                                        updateSetting(setting.key, {
                                            internal_members_only: checked,
                                        })
                                    }
                                />

                                <SwitchField
                                    checked={setting.is_published}
                                    description="Make this page available on the public frontend."
                                    error={
                                        errors[`settings.${index}.is_published`]
                                    }
                                    icon={RadioIcon}
                                    label="Publish"
                                    onCheckedChange={(checked) =>
                                        updateSetting(setting.key, {
                                            is_published: checked,
                                        })
                                    }
                                />

                                <FieldError
                                    errors={
                                        errors[`settings.${index}.key`]
                                            ? [
                                                  {
                                                      message:
                                                          errors[
                                                              `settings.${index}.key`
                                                          ],
                                                  },
                                              ]
                                            : undefined
                                    }
                                />
                            </section>
                        ))}
                    </FieldGroup>

                    <Button disabled={form.processing}>Save</Button>
                </form>
            </div>
        </>
    );
}

PageSetting.layout = {
    breadcrumbs: [
        {
            title: 'Page settings',
            href: '/site-settings/page-settings',
        },
    ],
};

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
