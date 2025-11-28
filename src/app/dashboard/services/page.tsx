import Link from 'next/link';
import { getServices } from './actions';
import { DeleteServiceButton } from './delete-button';
import { formatCurrency } from '@/lib/utils';

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
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
                    <p className='text-red-600'>Error loading services: {error}</p>
                </div>
            </div>
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
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            {/* Header */}
            <div className='flex items-center justify-between mb-8'>
                <div>
                    <h1 className='text-3xl font-bold text-gray-900'>Services</h1>
                    <p className='text-gray-600 mt-1'>
                        Manage your services and pricing
                    </p>
                </div>
                <Link 
                    href='/dashboard/services/new' 
                    className='px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition'
                >
                   + Add Service
                </Link>
            </div>
            {/* Services List */}
            {!hasServices ? (
                /* Empty State */
                <div 
                    className='bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center'
                >
                    <div className='text-6xl mb-4'>📋</div>
                    <h2 className='text-xl font-semibold text-gray-900 mb-2'>
                        No services yet
                    </h2>
                    <p className='text-gray-600 mb-6'>
                        Add your first service to get started.
                    </p>
                    <Link
                        href="/dashboard/services/new"
                        className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
                    >
                        + Add Your First Service
                    </Link>
                    {/* Quick Examples */}
                    <div className='mt-8 pt-8 border-t border-gray-200'>
                        <p className='text-sm text-gray-600 mb04'>Examples:</p>
                        <div className="flex flex-wrap gap-2 justify-center">
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                Classic Full Set - $150
                            </span>
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                Volume Fill - $80
                            </span>
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                Lash Removal - $30
                            </span>
                        </div>
                    </div>
                </div>
            ) : (
                /* Services by Category */
                <div className='space-y-8'>
                    {Object.entries(groupedServices).map(([categoryName, categoryServices]) => (
                        <div key={categoryName}>
                            {/* Category Header */}
                            <h2 className='text-lg font-semibold text-gray-900 mb-4'>
                                {categoryName}
                            </h2>
                            {/* Services in Category */}
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                                {categoryServices?.map((service) => (
                                    <div
                                        key={service.id}
                                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
                                    >
                                        {/* Service Header */}
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900 mb-1">
                                                {service.name}
                                                </h3>
                                                {service.description && (
                                                <p className="text-sm text-gray-600 line-clamp-2">
                                                    {service.description}
                                                </p>
                                                )}
                                            </div>
                                        </div>  
                                        {/* Price */}
                                        <div className="mb-4">
                                            <span className="text-2xl font-bold text-indigo-600">
                                                {formatCurrency(service.default_price)}
                                            </span>
                                        </div>
                                        {/* Actions */}
                                        <div className="flex gap-2">
                                            <Link
                                                href={`/dashboard/services/${service.id}/edit`}
                                                className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition text-center"
                                            >
                                                Edit
                                            </Link>
                                            <DeleteServiceButton
                                                serviceId={service.id}
                                                serviceName={service.name}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Summary */}
            {hasServices && (
                <div className="mt-8 bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">📊</span>
                            <div>
                                <p className="text-sm font-medium text-indigo-900">
                                    {services.length} service{services.length !== 1 ? 's' : ''} total
                                </p>
                                <p className="text-xs text-indigo-700">
                                    {Object.keys(groupedServices).length} categor{Object.keys(groupedServices).length !== 1 ? 'ies' : 'y'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}