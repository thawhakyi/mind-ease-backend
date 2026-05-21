import { useForm } from '@inertiajs/react';
import { format, parse } from 'date-fns';
import {
    CalendarIcon,
    ChevronsUpDownIcon,
    ImageIcon,
    LockIcon,
    PlusIcon,
    RadioIcon,
    Trash2Icon,
    UploadIcon,
} from 'lucide-react';
import type { ComponentType } from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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

const quarters = ['Quarter 1', 'Quarter 2', 'Quarter 3', 'Quarter 4'] as const;
const eventTypes = ['In Person', 'Online', 'Hybrid'] as const;

type SelectOption = {
    id: number;
    name: string;
};

type CountryOfficeOption = SelectOption;

type LocationOption = SelectOption & {
    country_office?: string | null;
    country_office_id: number;
};

type ActivityDetailFormValues = {
    start_date: string;
    end_date: string;
    country_office_ids: number[];
    event_type: string;
    event_link: string;
    location_ids: number[];
};

type ProgramUpdateFormValues = {
    title: string;
    description: string;
    quarter: string;
    year: string;
    date: string;
    country_office_ids: number[];
    facilitator: string;
    event_type: string;
    feature_image: File | null;
    gallery_images: File[];
    internal_members_only: boolean;
    is_published: boolean;
    sort_order: string;
    activity_details: ActivityDetailFormValues[];
};

type ProgramUpdateFormProps = {
    action: string;
    countryOffices: CountryOfficeOption[];
    locations: LocationOption[];
    method?: 'post' | 'patch';
    programUpdate?: {
        title: string;
        description?: string | null;
        quarter?: string | null;
        year?: number | null;
        date?: string | null;
        country_office_ids?: number[];
        facilitator?: string | null;
        event_type?: string | null;
        feature_image_path?: string | null;
        gallery_image_paths?: string[] | null;
        internal_members_only?: boolean | null;
        is_published?: boolean | null;
        sort_order?: number | null;
        activity_details?: ActivityDetailFormValues[];
    };
    submitLabel: string;
};

const emptyActivityDetail = (): ActivityDetailFormValues => ({
    start_date: '',
    end_date: '',
    country_office_ids: [],
    event_type: '',
    event_link: '',
    location_ids: [],
});

export default function ProgramUpdateForm({
    action,
    countryOffices,
    locations,
    method = 'post',
    programUpdate,
    submitLabel,
}: ProgramUpdateFormProps) {
    const form = useForm<ProgramUpdateFormValues>({
        title: programUpdate?.title ?? '',
        description: programUpdate?.description ?? '',
        quarter: programUpdate?.quarter ?? '',
        year: programUpdate?.year?.toString() ?? '',
        date: programUpdate?.date ?? '',
        country_office_ids: programUpdate?.country_office_ids ?? [],
        facilitator: programUpdate?.facilitator ?? '',
        event_type: programUpdate?.event_type ?? '',
        feature_image: null,
        gallery_images: [],
        internal_members_only: programUpdate?.internal_members_only ?? false,
        is_published: programUpdate?.is_published ?? false,
        sort_order: programUpdate?.sort_order?.toString() ?? '0',
        activity_details: programUpdate?.activity_details?.length
            ? programUpdate.activity_details
            : [emptyActivityDetail()],
    });
    const errors = form.errors as Record<string, string | undefined>;
    const locationOptions = locations.map((location) => ({
        id: location.id,
        name: location.country_office
            ? `${location.name} (${location.country_office})`
            : location.name,
    }));

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

        form.post(action, { forceFormData: true, preserveScroll: true });
    }

    function updateActivityDetail(
        index: number,
        values: Partial<ActivityDetailFormValues>,
    ) {
        form.setData(
            'activity_details',
            form.data.activity_details.map((activityDetail, activityIndex) =>
                activityIndex === index
                    ? { ...activityDetail, ...values }
                    : activityDetail,
            ),
        );
    }

    function addActivityDetail() {
        form.setData('activity_details', [
            ...form.data.activity_details,
            emptyActivityDetail(),
        ]);
    }

    function removeActivityDetail(index: number) {
        form.setData(
            'activity_details',
            form.data.activity_details.filter(
                (_activityDetail, activityIndex) => activityIndex !== index,
            ),
        );
    }

    return (
        <form onSubmit={submit} className="flex flex-col gap-6">
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
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
                            placeholder="Program update title"
                        />
                        <FieldError
                            errors={
                                form.errors.title
                                    ? [{ message: form.errors.title }]
                                    : undefined
                            }
                        />
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
                            placeholder="Write the program update description..."
                        />
                        <FieldError
                            errors={
                                form.errors.description
                                    ? [{ message: form.errors.description }]
                                    : undefined
                            }
                        />
                    </Field>

                    <div className="grid gap-4 md:grid-cols-3">
                        <Field data-invalid={!!form.errors.quarter}>
                            <FieldLabel>Quarter</FieldLabel>
                            <SingleSelectCombobox
                                emptyLabel="No quarter found."
                                options={quarters}
                                placeholder="Select quarter"
                                searchPlaceholder="Search quarter..."
                                value={form.data.quarter}
                                ariaInvalid={!!form.errors.quarter}
                                onChange={(value) =>
                                    form.setData('quarter', value)
                                }
                            />
                            <FieldError
                                errors={
                                    form.errors.quarter
                                        ? [{ message: form.errors.quarter }]
                                        : undefined
                                }
                            />
                        </Field>

                        <Field data-invalid={!!form.errors.year}>
                            <FieldLabel htmlFor="year">Year</FieldLabel>
                            <Input
                                id="year"
                                type="number"
                                inputMode="numeric"
                                min={1900}
                                max={2100}
                                value={form.data.year}
                                onChange={(event) =>
                                    form.setData('year', event.target.value)
                                }
                                aria-invalid={!!form.errors.year}
                                placeholder="2026"
                            />
                            <FieldError
                                errors={
                                    form.errors.year
                                        ? [{ message: form.errors.year }]
                                        : undefined
                                }
                            />
                        </Field>

                        <Field data-invalid={!!form.errors.date}>
                            <FieldLabel>Date</FieldLabel>
                            <DatePickerField
                                value={form.data.date}
                                ariaInvalid={!!form.errors.date}
                                placeholder="dd/mm/yyyy"
                                onChange={(value) =>
                                    form.setData('date', value)
                                }
                            />
                            <FieldError
                                errors={
                                    form.errors.date
                                        ? [{ message: form.errors.date }]
                                        : undefined
                                }
                            />
                        </Field>
                    </div>

                    <Field data-invalid={!!form.errors.country_office_ids}>
                        <FieldLabel>Country Offices</FieldLabel>
                        <MultiSelectCombobox
                            emptyLabel="No country office found."
                            options={countryOffices}
                            placeholder="Select country offices"
                            searchPlaceholder="Search country office..."
                            selectedIds={form.data.country_office_ids}
                            onChange={(selectedIds) =>
                                form.setData('country_office_ids', selectedIds)
                            }
                        />
                        <FieldError
                            errors={
                                form.errors.country_office_ids
                                    ? [
                                          {
                                              message:
                                                  form.errors
                                                      .country_office_ids,
                                          },
                                      ]
                                    : undefined
                            }
                        />
                    </Field>

                    <div className="grid gap-4 md:grid-cols-2">
                        <Field data-invalid={!!form.errors.facilitator}>
                            <FieldLabel htmlFor="facilitator">
                                Facilitator
                            </FieldLabel>
                            <Input
                                id="facilitator"
                                value={form.data.facilitator}
                                onChange={(event) =>
                                    form.setData(
                                        'facilitator',
                                        event.target.value,
                                    )
                                }
                                aria-invalid={!!form.errors.facilitator}
                                placeholder="Facilitator name"
                            />
                            <FieldError
                                errors={
                                    form.errors.facilitator
                                        ? [{ message: form.errors.facilitator }]
                                        : undefined
                                }
                            />
                        </Field>

                        <Field data-invalid={!!form.errors.event_type}>
                            <FieldLabel>Event Type</FieldLabel>
                            <SingleSelectCombobox
                                emptyLabel="No event type found."
                                options={eventTypes}
                                placeholder="Select event type"
                                searchPlaceholder="Search event type..."
                                value={form.data.event_type}
                                ariaInvalid={!!form.errors.event_type}
                                onChange={(value) =>
                                    form.setData('event_type', value)
                                }
                            />
                            <FieldError
                                errors={
                                    form.errors.event_type
                                        ? [{ message: form.errors.event_type }]
                                        : undefined
                                }
                            />
                        </Field>
                    </div>

                    <FieldSet className="rounded-lg border p-4">
                        <FieldLegend>Activity Details</FieldLegend>
                        <FieldGroup>
                            {form.data.activity_details.map(
                                (activityDetail, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-col gap-4 rounded-md border bg-muted/20 p-4"
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="text-sm font-medium">
                                                Activity {index + 1}
                                            </div>
                                            {form.data.activity_details.length >
                                                1 && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        removeActivityDetail(
                                                            index,
                                                        )
                                                    }
                                                >
                                                    <Trash2Icon data-icon="start" />
                                                    Remove
                                                </Button>
                                            )}
                                        </div>

                                        <div className="grid gap-4 md:grid-cols-2">
                                            <Field
                                                data-invalid={
                                                    !!errors[
                                                        `activity_details.${index}.start_date`
                                                    ]
                                                }
                                            >
                                                <FieldLabel
                                                    htmlFor={`activity_details_${index}_start_date`}
                                                >
                                                    Start Date
                                                </FieldLabel>
                                                <DatePickerField
                                                    value={
                                                        activityDetail.start_date
                                                    }
                                                    ariaInvalid={
                                                        !!errors[
                                                            `activity_details.${index}.start_date`
                                                        ]
                                                    }
                                                    placeholder="dd/mm/yyyy"
                                                    onChange={(value) =>
                                                        updateActivityDetail(
                                                            index,
                                                            {
                                                                start_date:
                                                                    value,
                                                            },
                                                        )
                                                    }
                                                />
                                                <FieldError
                                                    errors={fieldErrors(
                                                        errors,
                                                        `activity_details.${index}.start_date`,
                                                    )}
                                                />
                                            </Field>

                                            <Field
                                                data-invalid={
                                                    !!errors[
                                                        `activity_details.${index}.end_date`
                                                    ]
                                                }
                                            >
                                                <FieldLabel
                                                    htmlFor={`activity_details_${index}_end_date`}
                                                >
                                                    End Date
                                                </FieldLabel>
                                                <DatePickerField
                                                    value={
                                                        activityDetail.end_date
                                                    }
                                                    ariaInvalid={
                                                        !!errors[
                                                            `activity_details.${index}.end_date`
                                                        ]
                                                    }
                                                    placeholder="dd/mm/yyyy"
                                                    onChange={(value) =>
                                                        updateActivityDetail(
                                                            index,
                                                            {
                                                                end_date: value,
                                                            },
                                                        )
                                                    }
                                                />
                                                <FieldError
                                                    errors={fieldErrors(
                                                        errors,
                                                        `activity_details.${index}.end_date`,
                                                    )}
                                                />
                                            </Field>
                                        </div>

                                        <Field
                                            data-invalid={
                                                !!errors[
                                                    `activity_details.${index}.country_office_ids`
                                                ]
                                            }
                                        >
                                            <FieldLabel>
                                                Country Office
                                            </FieldLabel>
                                            <MultiSelectCombobox
                                                emptyLabel="No country office found."
                                                options={countryOffices}
                                                placeholder="Select country offices"
                                                searchPlaceholder="Search country office..."
                                                selectedIds={
                                                    activityDetail.country_office_ids
                                                }
                                                onChange={(selectedIds) =>
                                                    updateActivityDetail(
                                                        index,
                                                        {
                                                            country_office_ids:
                                                                selectedIds,
                                                        },
                                                    )
                                                }
                                            />
                                            <FieldError
                                                errors={fieldErrors(
                                                    errors,
                                                    `activity_details.${index}.country_office_ids`,
                                                )}
                                            />
                                        </Field>

                                        <div className="grid gap-4 md:grid-cols-2">
                                            <Field
                                                data-invalid={
                                                    !!errors[
                                                        `activity_details.${index}.event_type`
                                                    ]
                                                }
                                            >
                                                <FieldLabel>
                                                    Event Type
                                                </FieldLabel>
                                                <SingleSelectCombobox
                                                    emptyLabel="No event type found."
                                                    options={eventTypes}
                                                    placeholder="Select event type"
                                                    searchPlaceholder="Search event type..."
                                                    value={
                                                        activityDetail.event_type
                                                    }
                                                    aria-invalid={
                                                        !!errors[
                                                            `activity_details.${index}.event_type`
                                                        ]
                                                    }
                                                    onChange={(eventType) => {
                                                        updateActivityDetail(
                                                            index,
                                                            {
                                                                event_type:
                                                                    eventType,
                                                                event_link:
                                                                    eventType ===
                                                                    'Online'
                                                                        ? activityDetail.event_link
                                                                        : '',
                                                            },
                                                        );
                                                    }}
                                                />
                                                <FieldError
                                                    errors={fieldErrors(
                                                        errors,
                                                        `activity_details.${index}.event_type`,
                                                    )}
                                                />
                                            </Field>

                                            {activityDetail.event_type ===
                                                'Online' && (
                                                <Field
                                                    data-invalid={
                                                        !!errors[
                                                            `activity_details.${index}.event_link`
                                                        ]
                                                    }
                                                >
                                                    <FieldLabel
                                                        htmlFor={`activity_details_${index}_event_link`}
                                                    >
                                                        Event Link
                                                    </FieldLabel>
                                                    <Input
                                                        id={`activity_details_${index}_event_link`}
                                                        type="url"
                                                        value={
                                                            activityDetail.event_link
                                                        }
                                                        onChange={(event) =>
                                                            updateActivityDetail(
                                                                index,
                                                                {
                                                                    event_link:
                                                                        event
                                                                            .target
                                                                            .value,
                                                                },
                                                            )
                                                        }
                                                        aria-invalid={
                                                            !!errors[
                                                                `activity_details.${index}.event_link`
                                                            ]
                                                        }
                                                        placeholder="https://example.com/event"
                                                    />
                                                    <FieldError
                                                        errors={fieldErrors(
                                                            errors,
                                                            `activity_details.${index}.event_link`,
                                                        )}
                                                    />
                                                </Field>
                                            )}
                                        </div>

                                        <Field
                                            data-invalid={
                                                !!errors[
                                                    `activity_details.${index}.location_ids`
                                                ]
                                            }
                                        >
                                            <FieldLabel>Location</FieldLabel>
                                            <MultiSelectCombobox
                                                emptyLabel="No location found."
                                                options={locationOptions}
                                                placeholder="Select locations"
                                                searchPlaceholder="Search location..."
                                                selectedIds={
                                                    activityDetail.location_ids
                                                }
                                                onChange={(selectedIds) =>
                                                    updateActivityDetail(
                                                        index,
                                                        {
                                                            location_ids:
                                                                selectedIds,
                                                        },
                                                    )
                                                }
                                            />
                                            <FieldError
                                                errors={fieldErrors(
                                                    errors,
                                                    `activity_details.${index}.location_ids`,
                                                )}
                                            />
                                        </Field>
                                    </div>
                                ),
                            )}

                            <FieldError
                                errors={fieldErrors(errors, 'activity_details')}
                            />

                            <div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={addActivityDetail}
                                >
                                    <PlusIcon data-icon="start" />
                                    Add Activity
                                </Button>
                            </div>
                        </FieldGroup>
                    </FieldSet>
                </FieldGroup>

                <aside className="flex flex-col gap-4">
                    <FieldSet className="rounded-lg border p-4">
                        <FieldLegend>Publishing</FieldLegend>
                        <FieldGroup>
                            <SwitchField
                                checked={form.data.internal_members_only}
                                description="Restrict this program update to internal members."
                                error={errors.internal_members_only}
                                icon={LockIcon}
                                label="Internal Members Only"
                                onCheckedChange={(checked) =>
                                    form.setData(
                                        'internal_members_only',
                                        checked,
                                    )
                                }
                            />

                            <SwitchField
                                checked={form.data.is_published}
                                description="Show this program update as published."
                                error={errors.is_published}
                                icon={RadioIcon}
                                label="Publish"
                                onCheckedChange={(checked) =>
                                    form.setData('is_published', checked)
                                }
                            />

                            <Field data-invalid={!!form.errors.sort_order}>
                                <FieldLabel htmlFor="sort_order">
                                    Order
                                </FieldLabel>
                                <Input
                                    id="sort_order"
                                    type="number"
                                    min={0}
                                    inputMode="numeric"
                                    value={form.data.sort_order}
                                    onChange={(event) =>
                                        form.setData(
                                            'sort_order',
                                            event.target.value,
                                        )
                                    }
                                    aria-invalid={!!form.errors.sort_order}
                                    placeholder="0"
                                />
                                <FieldError
                                    errors={fieldErrors(errors, 'sort_order')}
                                />
                            </Field>
                        </FieldGroup>
                    </FieldSet>

                    <FieldSet className="rounded-lg border p-4">
                        <FieldLegend>Feature Image</FieldLegend>
                        <FieldGroup>
                            {programUpdate?.feature_image_path && (
                                <img
                                    src={storageUrl(
                                        programUpdate.feature_image_path,
                                    )}
                                    alt=""
                                    className="aspect-video w-full rounded-md border object-cover"
                                />
                            )}
                            <Field data-invalid={!!form.errors.feature_image}>
                                <FieldLabel htmlFor="feature_image">
                                    <span className="inline-flex items-center gap-2">
                                        <ImageIcon className="size-4" />
                                        Image
                                    </span>
                                </FieldLabel>
                                <Input
                                    id="feature_image"
                                    type="file"
                                    accept="image/*"
                                    onChange={(event) =>
                                        form.setData(
                                            'feature_image',
                                            event.target.files?.[0] ?? null,
                                        )
                                    }
                                    aria-invalid={!!form.errors.feature_image}
                                />
                                {form.data.feature_image && (
                                    <div className="text-sm text-muted-foreground">
                                        {form.data.feature_image.name}
                                    </div>
                                )}
                                <FieldError
                                    errors={fieldErrors(
                                        errors,
                                        'feature_image',
                                    )}
                                />
                            </Field>
                        </FieldGroup>
                    </FieldSet>

                    <FieldSet className="rounded-lg border p-4">
                        <FieldLegend>Gallery</FieldLegend>
                        <FieldGroup>
                            {programUpdate?.gallery_image_paths?.length ? (
                                <div className="grid grid-cols-2 gap-2">
                                    {programUpdate.gallery_image_paths.map(
                                        (path) => (
                                            <img
                                                key={path}
                                                src={storageUrl(path)}
                                                alt=""
                                                className="aspect-square w-full rounded-md border object-cover"
                                            />
                                        ),
                                    )}
                                </div>
                            ) : null}
                            <Field data-invalid={!!form.errors.gallery_images}>
                                <FieldLabel htmlFor="gallery_images">
                                    <span className="inline-flex items-center gap-2">
                                        <UploadIcon className="size-4" />
                                        Images
                                    </span>
                                </FieldLabel>
                                <Input
                                    id="gallery_images"
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={(event) =>
                                        form.setData(
                                            'gallery_images',
                                            Array.from(
                                                event.target.files ?? [],
                                            ),
                                        )
                                    }
                                    aria-invalid={!!form.errors.gallery_images}
                                />
                                {form.data.gallery_images.length > 0 && (
                                    <div className="space-y-1 text-sm text-muted-foreground">
                                        {form.data.gallery_images.map(
                                            (image) => (
                                                <div key={image.name}>
                                                    {image.name}
                                                </div>
                                            ),
                                        )}
                                    </div>
                                )}
                                <FieldError
                                    errors={
                                        fieldErrors(errors, 'gallery_images') ??
                                        fieldErrors(errors, 'gallery_images.0')
                                    }
                                />
                            </Field>
                        </FieldGroup>
                    </FieldSet>
                </aside>
            </div>

            <div className="flex items-center gap-3">
                <Button disabled={form.processing}>{submitLabel}</Button>
            </div>
        </form>
    );
}

function storageUrl(path: string) {
    return `/storage/${path}`;
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

function DatePickerField({
    ariaInvalid,
    onChange,
    placeholder,
    value,
}: {
    ariaInvalid?: boolean;
    onChange: (value: string) => void;
    placeholder: string;
    value: string;
}) {
    const [open, setOpen] = useState(false);
    const selectedDate = parseDateValue(value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    aria-invalid={ariaInvalid}
                    className="w-full justify-between font-normal"
                >
                    <span className="truncate">{value || placeholder}</span>
                    <CalendarIcon data-icon="inline-end" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    captionLayout="dropdown"
                    selected={selectedDate}
                    defaultMonth={selectedDate ?? new Date()}
                    startMonth={new Date(1900, 0)}
                    endMonth={new Date(2100, 11)}
                    onSelect={(date) => {
                        if (!date) {
                            return;
                        }

                        onChange(format(date, 'dd/MM/yyyy'));
                        setOpen(false);
                    }}
                />
            </PopoverContent>
        </Popover>
    );
}

function parseDateValue(value: string): Date | undefined {
    if (!value) {
        return undefined;
    }

    const parsedDate = parse(value, 'dd/MM/yyyy', new Date());

    return Number.isNaN(parsedDate.getTime()) ? undefined : parsedDate;
}

function SingleSelectCombobox({
    ariaInvalid,
    emptyLabel,
    onChange,
    options,
    placeholder,
    searchPlaceholder,
    value,
}: {
    ariaInvalid?: boolean;
    emptyLabel: string;
    onChange: (value: string) => void;
    options: readonly string[];
    placeholder: string;
    searchPlaceholder: string;
    value: string;
}) {
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    aria-invalid={ariaInvalid}
                    className="w-full justify-between"
                >
                    <span className="truncate">{value || placeholder}</span>
                    <ChevronsUpDownIcon data-icon="inline-end" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-(--radix-popover-trigger-width) min-w-56 p-0">
                <Command>
                    <CommandInput placeholder={searchPlaceholder} />
                    <CommandList>
                        <CommandEmpty>{emptyLabel}</CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => {
                                const isSelected = value === option;

                                return (
                                    <CommandItem
                                        key={option}
                                        value={option}
                                        data-checked={isSelected}
                                        onSelect={() => {
                                            onChange(option);
                                            setOpen(false);
                                        }}
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

function MultiSelectCombobox({
    emptyLabel,
    onChange,
    options,
    placeholder,
    searchPlaceholder,
    selectedIds,
}: {
    emptyLabel: string;
    onChange: (selectedIds: number[]) => void;
    options: SelectOption[];
    placeholder: string;
    searchPlaceholder: string;
    selectedIds: number[];
}) {
    const selectedOptions = options.filter((option) =>
        selectedIds.includes(option.id),
    );

    function toggleOption(optionId: number) {
        if (selectedIds.includes(optionId)) {
            onChange(selectedIds.filter((id) => id !== optionId));

            return;
        }

        onChange([...selectedIds, optionId]);
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
                        {selectedOptions.length > 0
                            ? selectedOptions
                                  .map((option) => option.name)
                                  .join(', ')
                            : placeholder}
                    </span>
                    <ChevronsUpDownIcon data-icon="inline-end" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-(--radix-popover-trigger-width) min-w-56 p-0">
                <Command>
                    <CommandInput placeholder={searchPlaceholder} />
                    <CommandList>
                        <CommandEmpty>{emptyLabel}</CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => {
                                const isSelected = selectedIds.includes(
                                    option.id,
                                );

                                return (
                                    <CommandItem
                                        key={option.id}
                                        value={option.name}
                                        data-checked={isSelected}
                                        onSelect={() => toggleOption(option.id)}
                                    >
                                        {option.name}
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
