import { Head } from '@inertiajs/react';
import TimelineForm from '@/components/timelines/timeline-form';

export default function CreateTimeline() {
    return (
        <>
            <Head title="Add Timeline" />

            <div className="flex flex-col gap-6 p-6">
                <TimelineForm
                    action="/timelines"
                    heading={{
                        title: 'Add New',
                        description: 'Create a timeline item.',
                    }}
                    submitLabel="Create"
                />
            </div>
        </>
    );
}

CreateTimeline.layout = {
    breadcrumbs: [
        {
            title: 'Timeline',
            href: '/timelines',
        },
        {
            title: 'Add New',
            href: '/timelines/create',
        },
    ],
};
