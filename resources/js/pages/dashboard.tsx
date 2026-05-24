import { Head } from '@inertiajs/react';
import { DashboardEventCalendar } from '@/components/dashboard/dashboard-event-calendar';
import { DashboardStats } from '@/components/dashboard/dashboard-stats';
import { dashboard } from '@/routes';

export default function Dashboard({
    stats,
    filters = {},
    options,
    programUpdates,
}: any) {
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex flex-col gap-3">
                    <h2 className="text-xl font-semibold tracking-tight">
                        Dashboard Overview
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Analytics and activity summary for Mind Ease programs.
                    </p>
                </div>

                <DashboardStats
                    stats={stats}
                    filters={filters}
                    options={options}
                />

                <DashboardEventCalendar programUpdates={programUpdates} />
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
