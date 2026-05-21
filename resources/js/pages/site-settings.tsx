import { Head } from '@inertiajs/react';

export default function SiteSettings() {
    return <Head title="Site settings" />;
}

SiteSettings.layout = {
    breadcrumbs: [
        {
            title: 'Site settings',
            href: '/site-settings',
        },
    ],
};
