import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import TimelineForm from '@/components/timelines/timeline-form';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

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
                <Heading
                    title="Edit Timeline"
                    description="Update a timeline item."
                />

                <Card>
                    <CardHeader className="border-b pb-6">
                        <CardTitle>Timeline details</CardTitle>
                        <CardDescription>
                            Update the milestone content, year, ordering, and
                            image.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <TimelineForm
                            action={`/timelines/${timeline.id}`}
                            method="patch"
                            submitLabel="Save Timeline"
                            timeline={timeline}
                        />
                    </CardContent>
                </Card>
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
