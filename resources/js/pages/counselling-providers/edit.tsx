import { Head } from '@inertiajs/react';
import CounsellingProviderForm from '@/components/counselling-providers/counselling-provider-form';
import Heading from '@/components/heading';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

type ServiceLocation = {
    id: number;
    name: string;
};

type Provider = {
    id: number;
    provider_name: string;
    provider_background?: string | null;
    number_of_professionals?: number | null;
    professional_types?: string | null;
    languages?: string[] | null;
    service_location_ids?: number[];
    in_person?: boolean;
    office_hours?: string | null;
    contact_methods?: string[] | null;
    phone_numbers?: string[] | null;
    email?: string | null;
    website_url?: string | null;
    facebook_page_name?: string | null;
    facebook_url?: string | null;
    sort_order?: number | null;
    logo_path?: string | null;
};

export default function EditCounsellingProvider({
    contactMethodOptions,
    languageOptions,
    provider,
    serviceLocations,
}: {
    contactMethodOptions: string[];
    languageOptions: string[];
    provider: Provider;
    serviceLocations: ServiceLocation[];
}) {
    return (
        <>
            <Head title="Edit Counselling Provider" />

            <div className="flex flex-col gap-6 p-6">
                <Heading
                    title="Edit Counselling Provider"
                    description="Update counselling provider details."
                />

                <Card>
                    <CardHeader className="border-b pb-6">
                        <CardTitle>Provider details</CardTitle>
                        <CardDescription>
                            Keep service, contact, publishing, and display
                            settings current.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CounsellingProviderForm
                            action={`/counselling-providers/${provider.id}`}
                            contactMethodOptions={contactMethodOptions}
                            languageOptions={languageOptions}
                            method="patch"
                            provider={provider}
                            serviceLocations={serviceLocations}
                            submitLabel="Save Provider"
                        />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

EditCounsellingProvider.layout = {
    breadcrumbs: [
        {
            title: 'Counselling Providers',
            href: '/counselling-providers',
        },
        {
            title: 'Edit',
            href: '/counselling-providers',
        },
    ],
};
