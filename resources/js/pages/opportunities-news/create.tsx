import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import OpportunityNewsForm from '@/components/opportunities-news/opportunity-news-form';
import { Card, CardContent } from '@/components/ui/card';

type Category = {
    id: number;
    name: string;
};

export default function CreateOpportunityNews({
    categories,
}: {
    categories: Category[];
}) {
    return (
        <>
            <Head title="Add Opportunities & News" />

            <div className="flex flex-col gap-6 p-6">
                <Heading
                    title="Add New"
                    description="Create a new opportunity or news item."
                />

                <Card>
                    <CardContent>
                        <OpportunityNewsForm
                            action="/opportunities-news"
                            categories={categories}
                            submitLabel="Create Item"
                        />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

CreateOpportunityNews.layout = {
    breadcrumbs: [
        {
            title: 'Opportunities & News',
            href: '/opportunities-news',
        },
        {
            title: 'Add New',
            href: '/opportunities-news/create',
        },
    ],
};
