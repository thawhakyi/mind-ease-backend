import { Link } from '@inertiajs/react';
import {
    BookOpen,
    FileText,
    FolderGit2,
    HeartHandshake,
    LayoutGrid,
    Newspaper,
    Settings,
    SlidersHorizontal,
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

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
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
        icon: Newspaper,
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
    {
        title: 'Settings',
        href: '/settings/profile',
        icon: Settings,
    },
    {
        title: 'Site Settings',
        href: '/site-settings',
        icon: SlidersHorizontal,
        items: [
            {
                title: 'Page Settings',
                href: '/site-settings/page-settings',
            },
        ],
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
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
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
