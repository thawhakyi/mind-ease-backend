import { Link } from '@inertiajs/react';
import {
    addMonths,
    eachDayOfInterval,
    endOfMonth,
    endOfWeek,
    format,
    isAfter,
    isBefore,
    isSameDay,
    isSameMonth,
    isWithinInterval,
    parseISO,
    startOfDay,
    startOfMonth,
    startOfWeek,
    subMonths,
} from 'date-fns';
import {
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    ExternalLink,
    MapPin,
    Monitor,
    UserRound,
} from 'lucide-react';
import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyTitle,
} from '@/components/ui/empty';
import { NativeSelect } from '@/components/ui/native-select';
import { cn } from '@/lib/utils';

type ProgramCalendarEvent = {
    id: string;
    href: string;
    title: string;
    summary: string;
    eventType: string | null;
    facilitator: string | null;
    eventLink: string | null;
    countryOffices: string[];
    locations: string[];
    startDate: Date;
    endDate: Date;
};

type DashboardEventCalendarProps = {
    programUpdates: any[];
};

const allFilterValue = 'all';
const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function DashboardEventCalendar({
    programUpdates,
}: DashboardEventCalendarProps) {
    const events = React.useMemo(
        () => normalizeProgramUpdateEvents(programUpdates),
        [programUpdates],
    );
    const defaultDate = React.useMemo(
        () => getDefaultVisibleDate(events),
        [events],
    );
    const [month, setMonth] = React.useState(startOfMonth(defaultDate));
    const [countryFilter, setCountryFilter] = React.useState(allFilterValue);
    const [locationFilter, setLocationFilter] = React.useState(allFilterValue);
    const [previewDate, setPreviewDate] = React.useState<Date | null>(null);

    const countryOptions = React.useMemo(
        () => getUniqueOptions(events.flatMap((event) => event.countryOffices)),
        [events],
    );
    const locationOptions = React.useMemo(
        () => getUniqueOptions(events.flatMap((event) => event.locations)),
        [events],
    );
    const filteredEvents = React.useMemo(
        () =>
            events.filter((event) => {
                const matchesCountry =
                    countryFilter === allFilterValue ||
                    event.countryOffices.includes(countryFilter);
                const matchesLocation =
                    locationFilter === allFilterValue ||
                    event.locations.includes(locationFilter);

                return matchesCountry && matchesLocation;
            }),
        [countryFilter, events, locationFilter],
    );
    const monthEvents = React.useMemo(
        () => filteredEvents.filter((event) => isEventInMonth(event, month)),
        [filteredEvents, month],
    );
    const calendarDays = React.useMemo(() => getCalendarDays(month), [month]);
    const previewEvents = React.useMemo(
        () =>
            previewDate
                ? filteredEvents.filter((event) =>
                      isEventOnDate(event, previewDate),
                  )
                : [],
        [filteredEvents, previewDate],
    );

    if (events.length === 0) {
        return (
            <div className="mt-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">
                            Program Event Calendar
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Empty>
                            <EmptyHeader>
                                <EmptyTitle>No program updates</EmptyTitle>
                                <EmptyDescription>
                                    Create a published program update with dates
                                    to see the calendar.
                                </EmptyDescription>
                            </EmptyHeader>
                        </Empty>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="mt-4">
            <Card>
                <CardHeader className="gap-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex min-w-0 flex-col gap-2">
                            <CardTitle className="inline-flex items-center gap-2 text-lg">
                                <CalendarDays
                                    className="size-5"
                                    aria-hidden="true"
                                />
                                Program Event Calendar
                            </CardTitle>
                            <CardDescription>
                                {formatMonthEventCount(
                                    monthEvents.length,
                                    month,
                                )}
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                aria-label="Previous month"
                                onClick={() =>
                                    setMonth((currentMonth) =>
                                        subMonths(currentMonth, 1),
                                    )
                                }
                            >
                                <ChevronLeft
                                    className="size-4"
                                    aria-hidden="true"
                                />
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                aria-label="Next month"
                                onClick={() =>
                                    setMonth((currentMonth) =>
                                        addMonths(currentMonth, 1),
                                    )
                                }
                            >
                                <ChevronRight
                                    className="size-4"
                                    aria-hidden="true"
                                />
                            </Button>
                        </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 lg:max-w-xl">
                        <div className="flex min-w-0 flex-col gap-1 text-sm font-medium">
                            <span id="program-calendar-country-filter">
                                Country
                            </span>
                            <NativeSelect
                                value={countryFilter}
                                onChange={(e) =>
                                    setCountryFilter(e.target.value)
                                }
                            >
                                <option value={allFilterValue}>select..</option>
                                {countryOptions.map((country) => (
                                    <option key={country} value={country}>
                                        {country}
                                    </option>
                                ))}
                            </NativeSelect>
                        </div>
                        <div className="flex min-w-0 flex-col gap-1 text-sm font-medium">
                            <span id="program-calendar-location-filter">
                                Location
                            </span>
                            <NativeSelect
                                value={locationFilter}
                                onChange={(e) =>
                                    setLocationFilter(e.target.value)
                                }
                            >
                                <option value={allFilterValue}>select..</option>
                                {locationOptions.map((location) => (
                                    <option key={location} value={location}>
                                        {location}
                                    </option>
                                ))}
                            </NativeSelect>
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="overflow-x-auto">
                        <div className="min-w-[56rem]">
                            <div className="grid grid-cols-7 gap-1.5 pb-3 text-center text-xs font-medium text-muted-foreground">
                                {weekDays.map((day) => (
                                    <div key={day}>{day}</div>
                                ))}
                            </div>
                            <div className="grid grid-cols-7 gap-1.5">
                                {calendarDays.map((day) => (
                                    <MonthDay
                                        key={day.toISOString()}
                                        day={day}
                                        events={filteredEvents.filter((event) =>
                                            isEventOnDate(event, day),
                                        )}
                                        month={month}
                                        onPreviewDate={setPreviewDate}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <EventPreviewDialog
                date={previewDate}
                events={previewEvents}
                open={previewDate !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setPreviewDate(null);
                    }
                }}
            />
        </div>
    );
}

function MonthDay({
    day,
    events,
    month,
    onPreviewDate,
}: {
    day: Date;
    events: ProgramCalendarEvent[];
    month: Date;
    onPreviewDate: (date: Date) => void;
}) {
    const isCurrentMonth = isSameMonth(day, month);
    const isToday = isSameDay(day, new Date());
    const visibleEvents = events.slice(0, 3);
    const hiddenEventCount = events.length - visibleEvents.length;

    return (
        <div
            className={cn(
                'min-h-24 rounded-md border bg-muted/20 p-2 text-sm sm:min-h-28 sm:text-base',
                !isCurrentMonth && 'bg-muted text-muted-foreground/70',
                isToday && 'ring-1 ring-primary',
            )}
        >
            <div className="flex items-start justify-between gap-2">
                <button
                    type="button"
                    disabled={events.length === 0}
                    onClick={() => onPreviewDate(day)}
                    aria-label={
                        events.length
                            ? `Preview ${events.length} ${events.length === 1 ? 'activity' : 'activities'} on ${format(day, 'MMMM d, yyyy')}`
                            : undefined
                    }
                    className={cn(
                        'inline-flex size-6 items-center justify-center rounded-full font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none md:size-8',
                        isToday && 'bg-primary text-primary-foreground',
                        !isToday && !isCurrentMonth && 'text-muted-foreground',
                        events.length > 0 &&
                            !isToday &&
                            'hover:bg-accent hover:text-accent-foreground',
                    )}
                >
                    {format(day, 'd')}
                </button>
            </div>
            {visibleEvents.length ? (
                <div className="mt-3 flex flex-col gap-1.5">
                    {visibleEvents.map((event) => (
                        <EventChip
                            key={event.id}
                            event={event}
                            onClick={() => onPreviewDate(day)}
                        />
                    ))}
                    {hiddenEventCount > 0 ? (
                        <span className="text-xs font-medium text-muted-foreground">
                            +{hiddenEventCount} more
                        </span>
                    ) : null}
                </div>
            ) : null}
        </div>
    );
}

function EventChip({
    event,
    onClick,
}: {
    event: ProgramCalendarEvent;
    onClick: () => void;
}) {
    const places = [...event.locations, ...event.countryOffices];

    return (
        <button
            type="button"
            onClick={onClick}
            title={[event.title, places.join(', ')].filter(Boolean).join(' - ')}
            className="flex min-w-0 flex-col gap-1 rounded-sm bg-primary px-2 py-1 text-left text-xs font-medium text-white outline-none hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring"
        >
            <span className="truncate">{event.title}</span>
            {places.length ? (
                <span className="inline-flex min-w-0 items-center gap-1 text-[11px] font-normal text-white/70">
                    <MapPin className="size-3 shrink-0" aria-hidden="true" />
                    <span className="truncate">{places.join(', ')}</span>
                </span>
            ) : null}
        </button>
    );
}

function EventPreviewDialog({
    date,
    events,
    open,
    onOpenChange,
}: {
    date: Date | null;
    events: ProgramCalendarEvent[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[min(42rem,calc(100svh-2rem))] overflow-hidden p-0 sm:max-w-2xl">
                <DialogHeader className="gap-2 px-5 pt-5">
                    <DialogTitle className="inline-flex items-center gap-2 text-xl">
                        <CalendarDays className="size-5" aria-hidden="true" />
                        {date
                            ? format(date, 'MMMM d, yyyy')
                            : 'Activity preview'}
                    </DialogTitle>
                    <DialogDescription>
                        {events.length}{' '}
                        {events.length === 1 ? 'activity' : 'activities'} on
                        this date
                    </DialogDescription>
                </DialogHeader>

                <div className="flex max-h-[calc(100svh-14rem)] flex-col gap-4 overflow-y-auto px-5 pb-5">
                    {events.map((event) => (
                        <EventPreviewCard key={event.id} event={event} />
                    ))}
                </div>

                <DialogFooter className="border-t bg-muted/30 px-5 py-4">
                    <DialogClose asChild>
                        <Button type="button" variant="outline">
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function EventPreviewCard({ event }: { event: ProgramCalendarEvent }) {
    const places = [...event.locations, ...event.countryOffices];

    return (
        <article className="flex flex-col gap-4 rounded-md border bg-card p-4 text-card-foreground">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <h3 className="text-base leading-6 font-semibold">
                    {event.title}
                </h3>
                <Badge variant="destructive">
                    {format(event.startDate, 'QQQ yyyy')}
                </Badge>
            </div>

            <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="h-auto gap-1 py-1">
                    <CalendarDays className="size-3.5" aria-hidden="true" />
                    {formatEventRange(event)}
                </Badge>
                {places.length ? (
                    <Badge variant="secondary" className="h-auto gap-1 py-1">
                        <MapPin className="size-3.5" aria-hidden="true" />
                        {places.join(', ')}
                    </Badge>
                ) : null}
                {event.eventType ? (
                    <Badge variant="outline" className="h-auto gap-1 py-1">
                        <Monitor className="size-3.5" aria-hidden="true" />
                        {event.eventType}
                    </Badge>
                ) : null}
                {event.facilitator ? (
                    <Badge variant="outline" className="h-auto gap-1 py-1">
                        <UserRound className="size-3.5" aria-hidden="true" />
                        {event.facilitator}
                    </Badge>
                ) : null}
            </div>

            {event.eventLink ? (
                <a
                    href={event.eventLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                >
                    Online event
                    <ExternalLink className="size-4" aria-hidden="true" />
                </a>
            ) : null}

            <div className="flex flex-col gap-2">
                {event.summary ? (
                    <p className="text-sm leading-6 text-muted-foreground">
                        {event.summary}
                    </p>
                ) : null}
            </div>

            <Link
                href={event.href}
                className="inline-flex w-fit items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
                Edit full update &rarr;
            </Link>
        </article>
    );
}

function normalizeProgramUpdateEvents(
    programUpdates: any[],
): ProgramCalendarEvent[] {
    return programUpdates
        .flatMap((programUpdate) => {
            const activityEvents = programUpdate.activity_details
                .map(
                    (
                        activityDetail: any,
                        index: number,
                    ): ProgramCalendarEvent | null => {
                        const startDateStr =
                            activityDetail.start_date ??
                            activityDetail.end_date;
                        const endDateStr =
                            activityDetail.end_date ??
                            activityDetail.start_date;

                        const startDate = parseOptionalFormatDate(startDateStr);
                        const endDate = parseOptionalFormatDate(endDateStr);

                        if (!startDate || !endDate) {
                            return null;
                        }

                        const range = normalizeDateRange(startDate, endDate);

                        return {
                            id: `${programUpdate.id}-activity-${index}`,
                            href: `/program-updates/${programUpdate.id}/edit`,
                            title: programUpdate.title,
                            summary: programUpdate.summary,
                            eventType:
                                activityDetail.event_type ??
                                programUpdate.event_type,
                            facilitator: programUpdate.facilitator,
                            eventLink: activityDetail.event_link,
                            countryOffices:
                                activityDetail.country_offices.length > 0
                                    ? activityDetail.country_offices
                                    : programUpdate.country_offices.map(
                                          (office: any) => office.name,
                                      ),
                            locations: activityDetail.locations,
                            ...range,
                        };
                    },
                )
                .filter(
                    (
                        event: ProgramCalendarEvent | null,
                    ): event is ProgramCalendarEvent => event !== null,
                );

            if (activityEvents.length > 0) {
                return activityEvents;
            }

            const programDate = parseOptionalFormatDate(programUpdate.date);

            if (!programDate) {
                return [];
            }

            return [
                {
                    id: `${programUpdate.id}-program-date`,
                    href: `/program-updates/${programUpdate.id}/edit`,
                    title: programUpdate.title,
                    summary: programUpdate.summary,
                    eventType: programUpdate.event_type,
                    facilitator: programUpdate.facilitator,
                    eventLink: null,
                    countryOffices: programUpdate.country_offices.map(
                        (office: any) => office.name,
                    ),
                    locations: [],
                    startDate: programDate,
                    endDate: programDate,
                },
            ];
        })
        .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
}

function getDefaultVisibleDate(events: ProgramCalendarEvent[]) {
    const today = startOfDay(new Date());
    const eventDates = events
        .flatMap((event) =>
            eachDayOfInterval({ start: event.startDate, end: event.endDate }),
        )
        .sort((a, b) => a.getTime() - b.getTime());
    const upcomingDate = eventDates.find((date) => !isBefore(date, today));

    return upcomingDate ?? eventDates.at(-1) ?? today;
}

function getCalendarDays(month: Date) {
    return eachDayOfInterval({
        start: startOfWeek(startOfMonth(month)),
        end: endOfWeek(endOfMonth(month)),
    });
}

function getUniqueOptions(values: string[]) {
    return Array.from(new Set(values.filter(Boolean))).sort((a, b) =>
        a.localeCompare(b),
    );
}

function isEventOnDate(event: ProgramCalendarEvent, date: Date) {
    const selected = startOfDay(date);

    return isWithinInterval(selected, {
        start: event.startDate,

        end: event.endDate,
    });
}

function isEventInMonth(event: ProgramCalendarEvent, month: Date) {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);

    return event.startDate <= monthEnd && event.endDate >= monthStart;
}

function formatMonthEventCount(eventCount: number, month: Date) {
    const activityLabel =
        eventCount === 1 ? 'scheduled activity' : 'scheduled activities';

    return `${eventCount} ${activityLabel} in ${format(month, 'MMMM yyyy')}`;
}

function formatEventRange(event: ProgramCalendarEvent) {
    if (isSameDay(event.startDate, event.endDate)) {
        return format(event.startDate, 'MMM d, yyyy');
    }

    if (event.startDate.getFullYear() === event.endDate.getFullYear()) {
        return `${format(event.startDate, 'MMM d')} - ${format(event.endDate, 'MMM d, yyyy')}`;
    }

    return `${format(event.startDate, 'MMM d, yyyy')} - ${format(event.endDate, 'MMM d, yyyy')}`;
}

function normalizeDateRange(startDate: Date, endDate: Date) {
    if (isAfter(startDate, endDate)) {
        return {
            startDate: endDate,
            endDate: startDate,
        };
    }

    return { startDate, endDate };
}

function parseOptionalFormatDate(value: string | null | undefined) {
    if (!value) {
        return null;
    }

    // backend controller returns dates as d/m/Y (e.g. 20/05/2026)
    // We need to parse this properly, date-fns parseISO expects ISO 8601.
    // However parseISO might be used if it is 'Y-m-d'.
    // Let's manually parse d/m/Y format since our controller maps it as `format('d/m/Y')`
    const parts = value.split('/');

    if (parts.length === 3) {
        const [day, month, year] = parts;
        const parsedDate = new Date(
            Number(year),
            Number(month) - 1,
            Number(day),
        );

        if (!Number.isNaN(parsedDate.getTime())) {
            return startOfDay(parsedDate);
        }
    }

    // Fallback to ISO if it's already in a standard format
    const parsedDate = parseISO(value);

    if (Number.isNaN(parsedDate.getTime())) {
        return null;
    }

    return startOfDay(parsedDate);
}
