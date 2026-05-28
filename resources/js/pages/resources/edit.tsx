import { Head } from '@inertiajs/react';
import ResourceForm from '@/components/resources/resource-form';

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
                <ResourceForm
                    action={`/resources/${resource.id}`}
                    categories={categories}
                    heading={{
                        title: 'Edit Resource',
                        description: 'Update resource details.',
                    }}
                    languages={languages}
                    method="patch"
                    resource={resource}
                    submitLabel="Save"
                />
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
