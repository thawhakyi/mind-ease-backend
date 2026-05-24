import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import ProgramUpdateForm from '@/components/program-updates/program-update-form';

type CountryOfficeOption = {
    id: number;
    name: string;
};

type LocationOption = {
    id: number;
    country_office_id: number;
    name: string;
    country_office?: string | null;
};

export default function CreateProgramUpdate({
    countryOffices,
    locations,
}: {
    countryOffices: CountryOfficeOption[];
    locations: LocationOption[];
}) {
    return (
        <>
            <Head title="Add New Program Update" />

            <div className="flex flex-col gap-6 p-6">
                <Heading
                    title="Add New"
                    description="Create a new program update."
                />

                <ProgramUpdateForm
                    action="/program-updates"
                    countryOffices={countryOffices}
                    locations={locations}
                    submitLabel="Create"
                />
            </div>
        </>
    );
}

CreateProgramUpdate.layout = {
    breadcrumbs: [
        {
            title: 'Program Updates',
            href: '/program-updates',
        },
        {
            title: 'Add New',
            href: '/program-updates/create',
        },
    ],
};
