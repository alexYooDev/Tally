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
                <>
                    {/* Desktop Table View - Hidden on Mobile */}
                    <div className='hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
                        <table className='w-full'>
                            <thead className='bg-gray-50 border-b border-gray-200'>
                                <tr>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                        Service Name
                                    </th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                        Category
                                    </th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                        Price
                                    </th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                        Description
                                    </th>
                                    <th className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-gray-200'>
                                {services?.map((service) => (
                                    <tr key={service.id} className='hover:bg-gray-50 transition'>
                                        <td className='px-6 py-4'>
                                            <div className='text-sm font-semibold text-gray-900'>
                                                {service.name}
                                            </div>
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <span className='px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-700'>
                                                {service.category?.name || 'Uncategorized'}
                                            </span>
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <div className='text-sm font-bold text-indigo-600'>
                                                {formatCurrency(service.default_price)}
                                            </div>
                                        </td>
                                        <td className='px-6 py-4'>
                                            {service.description ? (
                                                <div className='text-sm text-gray-600 line-clamp-2 max-w-xs'>
                                                    {service.description}
                                                </div>
                                            ) : (
                                                <div className='text-sm text-gray-400 italic'>
                                                    No description
                                                </div>
                                            )}
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-center'>
                                            <div className='flex gap-2 justify-center'>
                                                <Link
                                                    href={`/dashboard/services/${service.id}/edit`}
                                                    className='px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition'
                                                >
                                                    Edit
                                                </Link>
                                                <DeleteServiceButton
                                                    serviceId={service.id}
                                                    serviceName={service.name}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View - Visible on Mobile Only */}
                    <div className='md:hidden space-y-3'>
                        {services?.map((service) => (
                            <div
                                key={service.id}
                                className='bg-white rounded-lg shadow-sm border border-gray-200 p-4'
                            >
                                {/* Header: Service Name and Price */}
                                <div className='flex items-start justify-between mb-3'>
                                    <div className='flex-1'>
                                        <div className='text-base font-semibold text-gray-900'>
                                            {service.name}
                                        </div>
                                        <div className='text-xs text-gray-500 mt-1'>
                                            <span className='px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full font-medium'>
                                                {service.category?.name || 'Uncategorized'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className='text-right ml-4'>
                                        <div className='text-lg font-bold text-indigo-600'>
                                            {formatCurrency(service.default_price)}
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                {service.description && (
                                    <div className='text-sm text-gray-600 mb-3 pb-3 border-b border-gray-100'>
                                        {service.description}
                                    </div>
                                )}

                                {/* Actions */}
                                <div className='flex gap-2'>
                                    <Link
                                        href={`/dashboard/services/${service.id}/edit`}
                                        className='flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition text-center'
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
                </>
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