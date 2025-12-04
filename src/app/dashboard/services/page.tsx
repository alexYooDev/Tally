import { getServices } from './actions';
import { ServicesList } from './services-list';
import {
    PageContainer,
    PageHeader,
    ErrorAlert,
    EmptyState,
    InfoAlert,
} from '@/components';

type Category = {
    id: string;
    name: string;
};

type Service = {
    id: string;
    user_id: string;
    name: string;
    description: string | null;
    default_price: number;
    category_id: string | null;
    category: Category | null;
};


export default async function ServicesPage() {
    const { data: services, error } = await getServices();

    if (error) {
        return (
            <PageContainer>
                <ErrorAlert>Error loading services: {error}</ErrorAlert>
            </PageContainer>
        );
    }

    /* Group services by category */
    const groupedServices = ((services as Service[]) || []).reduce((acc, service) => {
        const categoryName = service.category?.name || 'Uncategorized';
        
        if (!acc[categoryName]) {
            acc[categoryName] = [];
        }
        acc[categoryName].push(service);
        return acc;
    }, {} as Record<string, Service[]>);


    const hasServices = services && services.length > 0;

    return (
        <PageContainer>
            <PageHeader
                title="Services"
                description="Manage your services and pricing"
                actionLabel="+ Add Service"
                actionHref="/dashboard/services/new"
            />
            {/* Services List */}
            {!hasServices ? (
                <EmptyState
                    icon="📋"
                    title="No services yet"
                    description="Add your first service to get started."
                    actionLabel="+ Add Your First Service"
                    actionHref="/dashboard/services/new"
                    examples={[
                        'Classic Full Set - $150',
                        'Volume Fill - $80',
                        'Lash Removal - $30',
                    ]}
                />
            ) : (
                <ServicesList services={services as Service[]} />
            )}

            {/* Summary */}
            {hasServices && (
                <InfoAlert className="mt-8">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">📊</span>
                        <div>
                            <p className="font-medium">
                                {services.length} service{services.length !== 1 ? 's' : ''} total
                            </p>
                            <p className="text-xs">
                                {Object.keys(groupedServices).length} categor{Object.keys(groupedServices).length !== 1 ? 'ies' : 'y'}
                            </p>
                        </div>
                    </div>
                </InfoAlert>
            )}
        </PageContainer>
    );
}