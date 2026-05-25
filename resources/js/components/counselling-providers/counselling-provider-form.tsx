import { useForm } from '@inertiajs/react';
import {
    ChevronsUpDownIcon,
    ImageIcon,
    LockIcon,
    PlusIcon,
    RadioIcon,
    Trash2Icon,
} from 'lucide-react';
import type { ComponentType, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
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

type ServiceLocation = {
    id: number;
    name: string;
};

type FormValues = {
    provider_name: string;
    provider_background: string;
    number_of_professionals: string;
    professional_types: string;
    languages: string[];
    service_location_ids: number[];
    service_modes: string[];
    office_hours: string;
    contact_methods: string[];
    phone_numbers: string[];
    email: string;
    website_url: string;
    facebook_page_name: string;
    facebook_url: string;
    sort_order: string;
    internal_members_only: boolean;
    is_published: boolean;
    logo: File | null;
};

type Props = {
    action: string;
    contactMethodOptions: string[];
    languageOptions: string[];
    method?: 'post' | 'patch';
    provider?: {
        provider_name: string;
        provider_background?: string | null;
        number_of_professionals?: number | null;
        professional_types?: string | null;
        languages?: string[] | null;
        service_location_ids?: number[];
        service_modes?: string[] | null;
        office_hours?: string | null;
        contact_methods?: string[] | null;
        phone_numbers?: string[] | null;
        email?: string | null;
        website_url?: string | null;
        facebook_page_name?: string | null;
        facebook_url?: string | null;
        sort_order?: number | null;
        internal_members_only?: boolean | null;
        is_published?: boolean | null;
        logo_path?: string | null;
    };
    serviceLocations: ServiceLocation[];
    submitLabel: string;
};

export default function CounsellingProviderForm({
    action,
    contactMethodOptions,
    languageOptions,
    method = 'post',
    provider,
    serviceLocations,
    submitLabel,
}: Props) {
    const form = useForm<FormValues>({
        provider_name: provider?.provider_name ?? '',
        provider_background: provider?.provider_background ?? '',
        number_of_professionals:
            provider?.number_of_professionals?.toString() ?? '0',
        professional_types: provider?.professional_types ?? '',
        languages: provider?.languages ?? [],
        service_location_ids: provider?.service_location_ids ?? [],
        service_modes: provider?.service_modes ?? [],
        office_hours: provider?.office_hours ?? '',
        contact_methods: provider?.contact_methods ?? [],
        phone_numbers:
            provider?.phone_numbers && provider.phone_numbers.length > 0
                ? provider.phone_numbers
                : [''],
        email: provider?.email ?? '',
        website_url: provider?.website_url ?? '',
        facebook_page_name: provider?.facebook_page_name ?? '',
        facebook_url: provider?.facebook_url ?? '',
        sort_order: provider?.sort_order?.toString() ?? '0',
        internal_members_only: provider?.internal_members_only ?? false,
        is_published: provider?.is_published ?? false,
        logo: null,
    });
    const errors = form.errors as Record<string, string | undefined>;

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (method === 'patch') {
            form.transform((data) => ({
                ...data,
                phone_numbers: data.phone_numbers.filter(Boolean),
                _method: 'patch',
            }));
            form.post(action, {
                forceFormData: true,
                preserveScroll: true,
                onFinish: () => form.transform((data) => data),
            });

            return;
        }

        form.transform((data) => ({
            ...data,
            phone_numbers: data.phone_numbers.filter(Boolean),
        }));
        form.post(action, {
            forceFormData: true,
            preserveScroll: true,
            onFinish: () => form.transform((data) => data),
        });
    }

    function setPhoneNumber(index: number, value: string) {
        form.setData(
            'phone_numbers',
            form.data.phone_numbers.map((phoneNumber, currentIndex) =>
                currentIndex === index ? value : phoneNumber,
            ),
        );
    }

    return (
        <form
            onSubmit={submit}
            className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]"
        >
            <FieldGroup className="rounded-lg border border-border bg-card p-4">
                <Field data-invalid={!!form.errors.provider_name}>
                    <FieldLabel htmlFor="provider_name">
                        Provider name
                    </FieldLabel>
                    <Input
                        id="provider_name"
                        value={form.data.provider_name}
                        onChange={(event) =>
                            form.setData('provider_name', event.target.value)
                        }
                        required
                        aria-invalid={!!form.errors.provider_name}
                        placeholder="Provider name"
                    />
                    <FieldError errors={fieldErrors(errors, 'provider_name')} />
                </Field>

                <Field data-invalid={!!form.errors.provider_background}>
                    <FieldLabel htmlFor="provider_background">
                        Provider Background
                    </FieldLabel>
                    <RichTextEditor
                        id="provider_background"
                        value={form.data.provider_background}
                        onChange={(value) =>
                            form.setData('provider_background', value)
                        }
                        aria-invalid={!!form.errors.provider_background}
                        placeholder="Write the provider background..."
                    />
                    <FieldError
                        errors={fieldErrors(errors, 'provider_background')}
                    />
                </Field>

                <div className="grid gap-4 md:grid-cols-2">
                    <Field data-invalid={!!form.errors.number_of_professionals}>
                        <FieldLabel htmlFor="number_of_professionals">
                            Number of professionals
                        </FieldLabel>
                        <Input
                            id="number_of_professionals"
                            type="number"
                            min={0}
                            value={form.data.number_of_professionals}
                            onChange={(event) =>
                                form.setData(
                                    'number_of_professionals',
                                    event.target.value,
                                )
                            }
                            aria-invalid={!!form.errors.number_of_professionals}
                        />
                        <FieldError
                            errors={fieldErrors(
                                errors,
                                'number_of_professionals',
                            )}
                        />
                    </Field>

                    <Field data-invalid={!!form.errors.professional_types}>
                        <FieldLabel htmlFor="professional_types">
                            Professional types
                        </FieldLabel>
                        <Input
                            id="professional_types"
                            value={form.data.professional_types}
                            onChange={(event) =>
                                form.setData(
                                    'professional_types',
                                    event.target.value,
                                )
                            }
                            aria-invalid={!!form.errors.professional_types}
                            placeholder="Counsellors, psychologists"
                        />
                        <FieldError
                            errors={fieldErrors(errors, 'professional_types')}
                        />
                    </Field>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Field data-invalid={!!form.errors.languages}>
                        <FieldLabel>Languages</FieldLabel>
                        <StringMultiSelect
                            options={languageOptions}
                            placeholder="Select languages"
                            searchPlaceholder="Search language..."
                            selectedValues={form.data.languages}
                            onChange={(values) =>
                                form.setData('languages', values)
                            }
                        />
                        <FieldError errors={fieldErrors(errors, 'languages')} />
                    </Field>

                    <Field data-invalid={!!form.errors.service_location_ids}>
                        <FieldLabel>Service locations</FieldLabel>
                        <LocationMultiSelect
                            locations={serviceLocations}
                            selectedIds={form.data.service_location_ids}
                            onChange={(selectedIds) =>
                                form.setData(
                                    'service_location_ids',
                                    selectedIds,
                                )
                            }
                        />
                        <FieldError
                            errors={fieldErrors(errors, 'service_location_ids')}
                        />
                    </Field>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Field data-invalid={!!form.errors.office_hours}>
                        <FieldLabel htmlFor="office_hours">
                            Office hours
                        </FieldLabel>
                        <Input
                            id="office_hours"
                            value={form.data.office_hours}
                            onChange={(event) =>
                                form.setData('office_hours', event.target.value)
                            }
                            aria-invalid={!!form.errors.office_hours}
                            placeholder="Mon-Fri 9am-5pm"
                        />
                        <FieldError
                            errors={fieldErrors(errors, 'office_hours')}
                        />
                    </Field>

                    <Field data-invalid={!!form.errors.contact_methods}>
                        <FieldLabel>Contact methods</FieldLabel>
                        <StringMultiSelect
                            options={contactMethodOptions}
                            placeholder="Select contact methods"
                            searchPlaceholder="Search contact method..."
                            selectedValues={form.data.contact_methods}
                            onChange={(values) =>
                                form.setData('contact_methods', values)
                            }
                        />
                        <FieldError
                            errors={fieldErrors(errors, 'contact_methods')}
                        />
                    </Field>
                </div>

                <PhoneRepeater
                    errors={errors}
                    phoneNumbers={form.data.phone_numbers}
                    onAdd={() =>
                        form.setData('phone_numbers', [
                            ...form.data.phone_numbers,
                            '',
                        ])
                    }
                    onChange={setPhoneNumber}
                    onRemove={(index) =>
                        form.setData(
                            'phone_numbers',
                            form.data.phone_numbers.filter(
                                (_, currentIndex) => currentIndex !== index,
                            ),
                        )
                    }
                />

                <div className="grid gap-4 md:grid-cols-2">
                    <Field data-invalid={!!form.errors.email}>
                        <FieldLabel htmlFor="email">Email</FieldLabel>
                        <Input
                            id="email"
                            type="email"
                            value={form.data.email}
                            onChange={(event) =>
                                form.setData('email', event.target.value)
                            }
                            aria-invalid={!!form.errors.email}
                            placeholder="provider@example.com"
                        />
                        <FieldError errors={fieldErrors(errors, 'email')} />
                    </Field>

                    <Field data-invalid={!!form.errors.website_url}>
                        <FieldLabel htmlFor="website_url">
                            Website URL
                        </FieldLabel>
                        <Input
                            id="website_url"
                            type="url"
                            value={form.data.website_url}
                            onChange={(event) =>
                                form.setData('website_url', event.target.value)
                            }
                            aria-invalid={!!form.errors.website_url}
                            placeholder="https://example.com"
                        />
                        <FieldError
                            errors={fieldErrors(errors, 'website_url')}
                        />
                    </Field>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Field data-invalid={!!form.errors.facebook_page_name}>
                        <FieldLabel htmlFor="facebook_page_name">
                            Facebook Page name
                        </FieldLabel>
                        <Input
                            id="facebook_page_name"
                            value={form.data.facebook_page_name}
                            onChange={(event) =>
                                form.setData(
                                    'facebook_page_name',
                                    event.target.value,
                                )
                            }
                            aria-invalid={!!form.errors.facebook_page_name}
                        />
                        <FieldError
                            errors={fieldErrors(errors, 'facebook_page_name')}
                        />
                    </Field>

                    <Field data-invalid={!!form.errors.facebook_url}>
                        <FieldLabel htmlFor="facebook_url">
                            Facebook URL
                        </FieldLabel>
                        <Input
                            id="facebook_url"
                            type="url"
                            value={form.data.facebook_url}
                            onChange={(event) =>
                                form.setData('facebook_url', event.target.value)
                            }
                            aria-invalid={!!form.errors.facebook_url}
                            placeholder="https://facebook.com/page"
                        />
                        <FieldError
                            errors={fieldErrors(errors, 'facebook_url')}
                        />
                    </Field>
                </div>

                <div>
                    <Button disabled={form.processing}>{submitLabel}</Button>
                </div>
            </FieldGroup>

            <aside className="flex flex-col gap-4">
                <FieldSet className="rounded-lg border p-4">
                    <FieldLegend>Service</FieldLegend>
                    <FieldGroup>
                        <Field data-invalid={!!form.errors.service_modes}>
                            <FieldLabel>Service Modes</FieldLabel>
                            <StringMultiSelect
                                options={['In Person', 'Online']}
                                placeholder="Select service modes"
                                searchPlaceholder="Search modes..."
                                selectedValues={form.data.service_modes}
                                onChange={(values) =>
                                    form.setData('service_modes', values)
                                }
                            />
                            <FieldError
                                errors={fieldErrors(errors, 'service_modes')}
                            />
                        </Field>
                    </FieldGroup>
                </FieldSet>

                <FieldSet className="rounded-lg border p-4">
                    <FieldLegend>Publishing</FieldLegend>
                    <FieldGroup>
                        <SwitchField
                            checked={form.data.internal_members_only}
                            description="Restrict this provider to internal members."
                            error={errors.internal_members_only}
                            icon={LockIcon}
                            label="Internal Members Only"
                            onCheckedChange={(checked) =>
                                form.setData('internal_members_only', checked)
                            }
                        />

                        <SwitchField
                            checked={form.data.is_published}
                            description="Show this provider as published."
                            error={errors.is_published}
                            icon={RadioIcon}
                            label="Publish"
                            onCheckedChange={(checked) =>
                                form.setData('is_published', checked)
                            }
                        />

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
                    <FieldLegend>Logo</FieldLegend>
                    <FieldGroup>
                        {provider?.logo_path && (
                            <img
                                src={`/storage/${provider.logo_path}`}
                                alt=""
                                className="aspect-video w-full rounded-md border object-contain"
                            />
                        )}
                        <Field data-invalid={!!form.errors.logo}>
                            <FieldLabel htmlFor="logo">
                                <span className="inline-flex items-center gap-2">
                                    <ImageIcon className="size-4" />
                                    Image
                                </span>
                            </FieldLabel>
                            <Input
                                id="logo"
                                type="file"
                                accept="image/*"
                                onChange={(event) =>
                                    form.setData(
                                        'logo',
                                        event.target.files?.[0] ?? null,
                                    )
                                }
                                aria-invalid={!!form.errors.logo}
                            />
                            {form.data.logo && (
                                <FieldDescription>
                                    {form.data.logo.name}
                                </FieldDescription>
                            )}
                            <FieldError errors={fieldErrors(errors, 'logo')} />
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

function LocationMultiSelect({
    locations,
    onChange,
    selectedIds,
}: {
    locations: ServiceLocation[];
    onChange: (selectedIds: number[]) => void;
    selectedIds: number[];
}) {
    const selectedLocations = locations.filter((location) =>
        selectedIds.includes(location.id),
    );

    function toggleLocation(locationId: number) {
        if (selectedIds.includes(locationId)) {
            onChange(selectedIds.filter((id) => id !== locationId));

            return;
        }

        onChange([...selectedIds, locationId]);
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
                        {selectedLocations.length > 0
                            ? selectedLocations
                                  .map((location) => location.name)
                                  .join(', ')
                            : 'Select service locations'}
                    </span>
                    <ChevronsUpDownIcon data-icon="inline-end" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-(--radix-popover-trigger-width) min-w-56 p-0">
                <Command>
                    <CommandInput placeholder="Search service location..." />
                    <CommandList>
                        <CommandEmpty>No service location found.</CommandEmpty>
                        <CommandGroup>
                            {locations.map((location) => {
                                const isSelected = selectedIds.includes(
                                    location.id,
                                );

                                return (
                                    <CommandItem
                                        key={location.id}
                                        value={location.name}
                                        data-checked={isSelected}
                                        onSelect={() =>
                                            toggleLocation(location.id)
                                        }
                                    >
                                        {location.name}
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

function StringMultiSelect({
    onChange,
    options,
    placeholder,
    searchPlaceholder,
    selectedValues,
}: {
    onChange: (selectedValues: string[]) => void;
    options: string[];
    placeholder: string;
    searchPlaceholder: string;
    selectedValues: string[];
}) {
    function toggleValue(value: string) {
        if (selectedValues.includes(value)) {
            onChange(
                selectedValues.filter(
                    (selectedValue) => selectedValue !== value,
                ),
            );

            return;
        }

        onChange([...selectedValues, value]);
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
                        {selectedValues.length > 0
                            ? selectedValues.join(', ')
                            : placeholder}
                    </span>
                    <ChevronsUpDownIcon data-icon="inline-end" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-(--radix-popover-trigger-width) min-w-56 p-0">
                <Command>
                    <CommandInput placeholder={searchPlaceholder} />
                    <CommandList>
                        <CommandEmpty>No option found.</CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => {
                                const isSelected =
                                    selectedValues.includes(option);

                                return (
                                    <CommandItem
                                        key={option}
                                        value={option}
                                        data-checked={isSelected}
                                        onSelect={() => toggleValue(option)}
                                    >
                                        {option}
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

function PhoneRepeater({
    errors,
    onAdd,
    onChange,
    onRemove,
    phoneNumbers,
}: {
    errors: Record<string, string | undefined>;
    onAdd: () => void;
    onChange: (index: number, value: string) => void;
    onRemove: (index: number) => void;
    phoneNumbers: string[];
}) {
    return (
        <Field data-invalid={!!errors.phone_numbers}>
            <div className="flex items-center justify-between gap-3">
                <FieldLabel>Phone numbers</FieldLabel>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onAdd}
                >
                    <PlusIcon data-icon="inline-start" />
                    Add phone
                </Button>
            </div>
            <div className="grid gap-3">
                {phoneNumbers.map((phoneNumber, index) => (
                    <div
                        key={index}
                        className="grid gap-2 md:grid-cols-[minmax(0,1fr)_auto]"
                    >
                        <Input
                            type="tel"
                            value={phoneNumber}
                            onChange={(event) =>
                                onChange(index, event.target.value)
                            }
                            aria-label={`Phone number ${index + 1}`}
                            aria-invalid={
                                !!errors[`phone_numbers.${index}`] ||
                                !!errors.phone_numbers
                            }
                            placeholder="+95..."
                        />
                        <ButtonGroup>
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => onRemove(index)}
                                disabled={phoneNumbers.length === 1}
                                aria-label="Remove phone number"
                            >
                                <Trash2Icon />
                            </Button>
                        </ButtonGroup>
                        <FieldError
                            className="md:col-span-2"
                            errors={fieldErrors(
                                errors,
                                `phone_numbers.${index}`,
                            )}
                        />
                    </div>
                ))}
            </div>
            <FieldError errors={fieldErrors(errors, 'phone_numbers')} />
        </Field>
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
