import { Link } from '@inertiajs/react';
import {
    BookOpen,
    ExternalLinkIcon,
    FileText,
    HeartHandshake,
    LayoutGrid,
    Megaphone,
    Newspaper,
    Settings,
    Timer,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const navGroups = [
    {
        title: 'Overview',
        items: [
            {
                title: 'Dashboard',
                href: dashboard(),
                icon: LayoutGrid,
            },
        ],
    },
    {
        title: 'Content Management',
        items: [
            {
                title: 'Program Updates',
                href: '/program-updates',
                icon: Newspaper,
                items: [
                    {
                        title: 'Add New',
                        href: '/program-updates/create',
                    },
                    {
                        title: 'Country Office',
                        href: '/program-updates/country-offices',
                    },
                    {
                        title: 'Location',
                        href: '/program-updates/locations',
                    },
                ],
            },
            {
                title: 'Opportunities & News',
                href: '/opportunities-news',
                icon: Megaphone,
                items: [
                    {
                        title: 'Add New',
                        href: '/opportunities-news/create',
                    },
                    {
                        title: 'Category',
                        href: '/opportunities-news/categories',
                    },
                ],
            },
            {
                title: 'Resources',
                href: '/resources',
                icon: FileText,
                items: [
                    {
                        title: 'Add New',
                        href: '/resources/create',
                    },
                    {
                        title: 'Category',
                        href: '/resources/categories',
                    },
                    {
                        title: 'Language',
                        href: '/resources/languages',
                    },
                ],
            },
            {
                title: 'Timeline',
                href: '/timelines',
                icon: Timer,
                items: [
                    {
                        title: 'Add New',
                        href: '/timelines/create',
                    },
                ],
            },
        ],
    },
    {
        title: 'Directory',
        items: [
            {
                title: 'Counselling Providers',
                href: '/counselling-providers',
                icon: HeartHandshake,
                items: [
                    {
                        title: 'Add New',
                        href: '/counselling-providers/create',
                    },
                    {
                        title: 'Service Location',
                        href: '/counselling-providers/service-locations',
                    },
                ],
            },
        ],
    },
    {
        title: 'System',
        items: [
            {
                title: 'Site Settings',
                href: '/site-settings',
                icon: Settings,
                items: [
                    {
                        title: 'Page Settings',
                        href: '/site-settings/page-settings',
                    },
                ],
            },
        ],
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Go to Website',
        href: 'https://mindeaseprogram.vercel.app',
        icon: ExternalLinkIcon,
    },
    {
        title: 'Documentation',
        href: '/documentation',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo iconClassName="size-8!" />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain groups={navGroups} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
