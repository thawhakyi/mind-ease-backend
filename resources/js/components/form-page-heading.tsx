import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';

type FormPageHeadingProps = {
    description: string;
    processing: boolean;
    submitLabel: string;
    title: string;
};

export function FormPageHeading({
    description,
    processing,
    submitLabel,
    title,
}: FormPageHeadingProps) {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <Heading title={title} description={description} />
            <Button className="shrink-0" disabled={processing}>
                {submitLabel}
            </Button>
        </div>
    );
}
