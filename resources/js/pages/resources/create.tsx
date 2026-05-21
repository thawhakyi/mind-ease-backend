import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import ResourceForm from '@/components/resources/resource-form';
import { Card, CardContent } from '@/components/ui/card';

type Category = {
    id: number;
    name: string;
};

type Language = {
    id: number;
    name: string;
};

export default function CreateResource({
    categories,
    languages,
}: {
    categories: Category[];
    languages: Language[];
}) {
    return (
        <>
            <Head title="Add Resource" />

            <div className="flex flex-col gap-6 p-6">
                <Heading title="Add New" description="Create a new resource." />

                <Card>
                    <CardContent>
                        <ResourceForm
                            action="/resources"
                            categories={categories}
                            languages={languages}
                            submitLabel="Create Resource"
                        />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

CreateResource.layout = {
    breadcrumbs: [
        {
            title: 'Resources',
            href: '/resources',
        },
        {
            title: 'Add New',
            href: '/resources/create',
        },
    ],
};
