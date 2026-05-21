import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import OpportunityNewsForm from '@/components/opportunities-news/opportunity-news-form';
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

type Item = {
    id: number;
    title: string;
    description?: string | null;
    category_ids?: number[];
    featured_image_path?: string | null;
};

export default function EditOpportunityNews({
    categories,
    item,
}: {
    categories: Category[];
    item: Item;
}) {
    return (
        <>
            <Head title="Edit Opportunities & News" />

            <div className="flex flex-col gap-6 p-6">
                <Heading
                    title="Edit Opportunities & News"
                    description="Update an opportunity or news item."
                />

                <Card>
                    <CardHeader className="border-b pb-6">
                        <CardTitle>Item details</CardTitle>
                        <CardDescription>
                            Update the story content, categories, and featured
                            image.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <OpportunityNewsForm
                            action={`/opportunities-news/${item.id}`}
                            categories={categories}
                            item={item}
                            method="patch"
                            submitLabel="Save Item"
                        />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

EditOpportunityNews.layout = {
    breadcrumbs: [
        {
            title: 'Opportunities & News',
            href: '/opportunities-news',
        },
        {
            title: 'Edit',
            href: '/opportunities-news',
        },
    ],
};
