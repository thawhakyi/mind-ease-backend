import { Head } from '@inertiajs/react';
import CounsellingProviderForm from '@/components/counselling-providers/counselling-provider-form';
import Heading from '@/components/heading';

type ServiceLocation = {
    id: number;
    name: string;
};

export default function CreateCounsellingProvider({
    contactMethodOptions,
    languageOptions,
    serviceLocations,
}: {
    contactMethodOptions: string[];
    languageOptions: string[];
    serviceLocations: ServiceLocation[];
}) {
    return (
        <>
            <Head title="Add Counselling Provider" />

            <div className="flex flex-col gap-6 p-6">
                <Heading
                    title="Add New"
                    description="Create a counselling provider profile."
                />

                <CounsellingProviderForm
                    action="/counselling-providers"
                    contactMethodOptions={contactMethodOptions}
                    languageOptions={languageOptions}
                    serviceLocations={serviceLocations}
                    submitLabel="Create"
                />
            </div>
        </>
    );
}

CreateCounsellingProvider.layout = {
    breadcrumbs: [
        {
            title: 'Counselling Providers',
            href: '/counselling-providers',
        },
        {
            title: 'Add New',
            href: '/counselling-providers/create',
        },
    ],
};
