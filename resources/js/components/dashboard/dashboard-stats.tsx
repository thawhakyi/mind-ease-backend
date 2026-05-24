import { router } from '@inertiajs/react';
import {
    FileText,
    HeartHandshake,
    Megaphone,
    Newspaper,
} from 'lucide-react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { NativeSelect } from '@/components/ui/native-select';
import { Switch } from '@/components/ui/switch';

type DashboardStatsProps = {
    stats: {
        total_resources: number;
        total_opportunities_news: number;
        total_counselling_providers: number;
        total_program_updates: number;
    };
    filters: Record<string, string | boolean>;
    options: {
        resourceCategories: { id: number; name: string }[];
        opportunityNewsCategories: { id: number; name: string }[];
        serviceLocations: { id: number; name: string }[];
    };
};

export function DashboardStats({ stats, filters, options }: DashboardStatsProps) {
    const handleFilterChange = (key: string, value: string | boolean | null) => {
        const newFilters = { ...filters };
        if (value === null || value === '' || value === false) {
            delete newFilters[key];
        } else {
            newFilters[key] = value;
        }

        router.get('/dashboard', newFilters as any, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Resources</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.total_resources}</div>
                    <div className="mt-4 flex flex-col gap-3">
                        <div className="space-y-1.5">
                            <Label className="text-xs">Category</Label>
                            <NativeSelect
                                value={(filters.resource_category_id as string) || ''}
                                onChange={(e) => handleFilterChange('resource_category_id', e.target.value)}
                            >
                                <option value="">All Categories</option>
                                {options.resourceCategories.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </NativeSelect>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="resource_member_only"
                                checked={filters.resource_member_only === '1' || filters.resource_member_only === true}
                                onCheckedChange={(checked) => handleFilterChange('resource_member_only', checked ? '1' : null)}
                            />
                            <Label htmlFor="resource_member_only" className="text-xs font-normal">Members Only</Label>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">News & Opportunities</CardTitle>
                    <Megaphone className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.total_opportunities_news}</div>
                    <div className="mt-4 flex flex-col gap-3">
                        <div className="space-y-1.5">
                            <Label className="text-xs">Category</Label>
                            <NativeSelect
                                value={(filters.news_category_id as string) || ''}
                                onChange={(e) => handleFilterChange('news_category_id', e.target.value)}
                            >
                                <option value="">All Categories</option>
                                {options.opportunityNewsCategories.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </NativeSelect>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="news_member_only"
                                checked={filters.news_member_only === '1' || filters.news_member_only === true}
                                onCheckedChange={(checked) => handleFilterChange('news_member_only', checked ? '1' : null)}
                            />
                            <Label htmlFor="news_member_only" className="text-xs font-normal">Members Only</Label>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Counselling Providers</CardTitle>
                    <HeartHandshake className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.total_counselling_providers}</div>
                    <div className="mt-4 flex flex-col gap-3">
                        <div className="space-y-1.5">
                            <Label className="text-xs">Location</Label>
                            <NativeSelect
                                value={(filters.counselling_location_id as string) || ''}
                                onChange={(e) => handleFilterChange('counselling_location_id', e.target.value)}
                            >
                                <option value="">All Locations</option>
                                {options.serviceLocations.map((l) => (
                                    <option key={l.id} value={l.id}>{l.name}</option>
                                ))}
                            </NativeSelect>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="counselling_member_only"
                                checked={filters.counselling_member_only === '1' || filters.counselling_member_only === true}
                                onCheckedChange={(checked) => handleFilterChange('counselling_member_only', checked ? '1' : null)}
                            />
                            <Label htmlFor="counselling_member_only" className="text-xs font-normal">Members Only</Label>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Program Updates</CardTitle>
                    <Newspaper className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.total_program_updates}</div>
                    <div className="mt-4 flex flex-col gap-3">
                        <div className="space-y-1.5">
                            <div className="h-[52px] flex items-center text-xs text-muted-foreground">
                                Detailed filters available in calendar below.
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="update_member_only"
                                checked={filters.update_member_only === '1' || filters.update_member_only === true}
                                onCheckedChange={(checked) => handleFilterChange('update_member_only', checked ? '1' : null)}
                            />
                            <Label htmlFor="update_member_only" className="text-xs font-normal">Members Only</Label>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
