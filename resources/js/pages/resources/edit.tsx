import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import ResourceForm from '@/components/resources/resource-form';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

type Category = {
    id: number;
    name: string;
};

type Language = {
    id: number;
    name: string;
};

type Resource = {
    id: number;
    title: string;
    description?: string | null;
    year?: number | null;
    resource_category_id?: number | null;
    resource_language_id?: number | null;
    url?: string | null;
    internal_members_only?: boolean;
    is_published?: boolean;
    sort_order?: number | null;
    feature_image_path?: string | null;
};

export default function EditResource({
    categories,
    languages,
    resource,
}: {
    categories: Category[];
    languages: Language[];
    resource: Resource;
}) {
    return (
        <>
            <Head title="Edit Resource" />

            <div className="flex flex-col gap-6 p-6">
                <Heading
                    title="Edit Resource"
                    description="Update resource details."
                />

                <Card>
                    <CardHeader className="border-b pb-6">
                        <CardTitle>Resource details</CardTitle>
                        <CardDescription>
                            Update the resource metadata, link, access, and
                            publishing settings.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResourceForm
                            action={`/resources/${resource.id}`}
                            categories={categories}
                            languages={languages}
                            method="patch"
                            resource={resource}
                            submitLabel="Save Resource"
                        />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

EditResource.layout = {
    breadcrumbs: [
        {
            title: 'Resources',
            href: '/resources',
        },
        {
            title: 'Edit',
            href: '/resources',
        },
    ],
};
