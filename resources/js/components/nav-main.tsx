import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';

export type NavGroup = {
    title: string;
    items: NavItem[];
};

function NavCollapsibleItem({ item }: { item: NavItem }) {
    const { isCurrentUrl } = useCurrentUrl();
    const isSubItemActive =
        item.items?.some((subItem) => isCurrentUrl(subItem.href)) ?? false;
    const isActive = isCurrentUrl(item.href) || isSubItemActive;

    const [isOpen, setIsOpen] = useState(false);

    return (
        <Collapsible
            asChild
            open={isActive || isOpen}
            onOpenChange={setIsOpen}
            className="group/collapsible"
        >
            <SidebarMenuItem>
                <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={{ children: item.title }}
                    onClick={() => {
                        setIsOpen(true);
                    }}
                >
                    <Link href={item.href}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                    </Link>
                </SidebarMenuButton>
                <CollapsibleTrigger asChild>
                    <SidebarMenuAction
                        aria-label={`Toggle ${item.title}`}
                        className="data-[state=open]:rotate-90"
                        showOnHover
                    >
                        <ChevronRight />
                    </SidebarMenuAction>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton
                                    asChild
                                    isActive={isCurrentUrl(subItem.href)}
                                >
                                    <Link href={subItem.href}>
                                        <span>{subItem.title}</span>
                                    </Link>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </SidebarMenuItem>
        </Collapsible>
    );
}

export function NavMain({ groups = [] }: { groups: NavGroup[] }) {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <>
            {groups.map((group) => (
                <SidebarGroup
                    key={group.title}
                    className="mt-4 px-2 py-0 first:mt-0"
                >
                    <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
                    <SidebarMenu>
                        {group.items.map((item) => {
                            const hasSubItems = !!item.items?.length;
                            const isSubItemActive =
                                item.items?.some((subItem) =>
                                    isCurrentUrl(subItem.href),
                                ) ?? false;
                            const isActive =
                                isCurrentUrl(item.href) || isSubItemActive;

                            if (!hasSubItems) {
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                            tooltip={{ children: item.title }}
                                        >
                                            <Link href={item.href}>
                                                {item.icon && <item.icon />}
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            }

                            return (
                                <NavCollapsibleItem
                                    key={item.title}
                                    item={item}
                                />
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            ))}
        </>
    );
}
