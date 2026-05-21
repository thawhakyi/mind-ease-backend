import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import ProgramUpdateForm from '@/components/program-updates/program-update-form';
import { Card, CardContent } from '@/components/ui/card';

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

type ActivityDetail = {
    start_date?: string | null;
    end_date?: string | null;
    country_office_ids: number[];
    event_type?: string | null;
    event_link?: string | null;
    location_ids: number[];
};

type ProgramUpdate = {
    id: number;
    title: string;
    description?: string | null;
    quarter?: string | null;
    year?: number | null;
    facilitator?: string | null;
    event_type?: string | null;
    feature_image_path?: string | null;
    gallery_image_paths?: string[] | null;
    is_published?: boolean | null;
    sort_order?: number | null;
};

export default function EditProgramUpdate({
    countryOffices,
    locations,
    programUpdate,
    programUpdateActivityDetails,
    programUpdateCountryOfficeIds,
    programUpdateDate,
}: {
    countryOffices: CountryOfficeOption[];
    locations: LocationOption[];
    programUpdate: ProgramUpdate;
    programUpdateActivityDetails: ActivityDetail[];
    programUpdateCountryOfficeIds: number[];
    programUpdateDate?: string | null;
}) {
    return (
        <>
            <Head title="Edit Program Update" />

            <div className="flex flex-col gap-6 p-6">
                <Heading
                    title="Edit Program Update"
                    description="Update program report details."
                />

                <Card>
                    {/* <CardHeader className="border-b pb-6">
                        <CardTitle>Report details</CardTitle>
                        <CardDescription>
                            Update the update content, activity details, media,
                            and publishing settings.
                        </CardDescription>
                    </CardHeader> */}
                    <CardContent>
                        <ProgramUpdateForm
                            action={`/program-updates/${programUpdate.id}`}
                            countryOffices={countryOffices}
                            locations={locations}
                            method="patch"
                            programUpdate={{
                                ...programUpdate,
                                activity_details:
                                    programUpdateActivityDetails.map(
                                        (activityDetail) => ({
                                            start_date:
                                                activityDetail.start_date ?? '',
                                            end_date:
                                                activityDetail.end_date ?? '',
                                            country_office_ids:
                                                activityDetail.country_office_ids,
                                            event_type:
                                                activityDetail.event_type ?? '',
                                            event_link:
                                                activityDetail.event_link ?? '',
                                            location_ids:
                                                activityDetail.location_ids,
                                        }),
                                    ),
                                country_office_ids:
                                    programUpdateCountryOfficeIds,
                                date: programUpdateDate,
                            }}
                            submitLabel="Save"
                        />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

EditProgramUpdate.layout = {
    breadcrumbs: [
        {
            title: 'Program Updates',
            href: '/program-updates',
        },
        {
            title: 'Edit',
            href: '/program-updates',
        },
    ],
};
