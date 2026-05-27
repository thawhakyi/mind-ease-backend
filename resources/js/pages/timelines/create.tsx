import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import TimelineForm from '@/components/timelines/timeline-form';
import { Card, CardContent } from '@/components/ui/card';

export default function CreateTimeline() {
    return (
        <>
            <Head title="Add Timeline" />

            <div className="flex flex-col gap-6 p-6">
                <Heading
                    title="Add New"
                    description="Create a timeline item."
                />

                <Card>
                    <CardContent>
                        <TimelineForm
                            action="/timelines"
                            submitLabel="Create"
                        />
                    </CardContent>
                </Card>
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
