import { Head } from '@inertiajs/react';
import TimelineForm from '@/components/timelines/timeline-form';

type Timeline = {
    id: number;
    title: string;
    year?: string | null;
    description?: string | null;
    sort_order?: number | null;
    featured_image_path?: string | null;
};

export default function EditTimeline({ timeline }: { timeline: Timeline }) {
    return (
        <>
            <Head title="Edit Timeline" />

            <div className="flex flex-col gap-6 p-6">
                <TimelineForm
                    action={`/timelines/${timeline.id}`}
                    heading={{
                        title: 'Edit Timeline',
                        description: 'Update a timeline item.',
                    }}
                    method="patch"
                    submitLabel="Save Timeline"
                    timeline={timeline}
                />
            </div>
        </>
    );
}

EditTimeline.layout = {
    breadcrumbs: [
        {
            title: 'Timeline',
            href: '/timelines',
        },
        {
            title: 'Edit',
            href: '/timelines',
        },
    ],
};
