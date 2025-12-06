// ================================================
// Services List - Client Component with Pagination
// ================================================
'use client';

import { ServiceActionsMenu } from './actions-menu';
import { formatCurrency } from '@/lib/utils';
import { Badge, Pagination, usePagination } from '@/components';

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

interface ServicesListProps {
    services: Service[];
}

export function ServicesList({ services }: ServicesListProps) {
    // Pagination
    const { currentPage, totalPages, setCurrentPage, paginateItems, itemsPerPage } = usePagination(
        services.length,
        15 // Show 15 services per page
    );
    const paginatedServices = paginateItems(services);

    return (
        <>
            {/* Desktop Table View - Hidden on Mobile */}
            <div className='hidden md:block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden'>
                <table className='w-full'>
                    <thead className='bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700'>
                        <tr>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                                Service Name
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                                Category
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                                Price
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                                Description
                            </th>
                            <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
                        {paginatedServices.map((service) => (
                            <tr key={service.id} className='hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150'>
                                <td className='px-6 py-4'>
                                    <div className='text-sm font-semibold text-gray-900 dark:text-gray-100'>
                                        {service.name}
                                    </div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <Badge variant="info">
                                        {service.category?.name || 'Uncategorized'}
                                    </Badge>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='text-sm font-bold text-indigo-600 dark:text-indigo-400'>
                                        {formatCurrency(service.default_price)}
                                    </div>
                                </td>
                                <td className='px-6 py-4'>
                                    {service.description ? (
                                        <div className='text-sm text-gray-600 dark:text-gray-400 line-clamp-2 max-w-xs'>
                                            {service.description}
                                        </div>
                                    ) : (
                                        <div className='text-sm text-gray-400 dark:text-gray-500 italic'>
                                            No description
                                        </div>
                                    )}
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='flex justify-end items-start'>
                                        <ServiceActionsMenu
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
                {paginatedServices.map((service) => (
                    <div
                        key={service.id}
                        className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 relative hover:shadow-md transition-shadow duration-200'
                    >
                        {/* Actions - Top Right */}
                        <div className='absolute top-2 right-2'>
                            <ServiceActionsMenu
                                serviceId={service.id}
                                serviceName={service.name}
                            />
                        </div>

                        {/* Header: Service Name and Price */}
                        <div className='flex items-start justify-between mb-3 pr-8'>
                            <div className='flex-1'>
                                <div className='text-base font-semibold text-gray-900 dark:text-gray-100'>
                                    {service.name}
                                </div>
                                <div className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                                    <Badge variant="info">
                                        {service.category?.name || 'Uncategorized'}
                                    </Badge>
                                </div>
                            </div>
                            <div className='text-right ml-4'>
                                <div className='text-lg font-bold text-indigo-600 dark:text-indigo-400'>
                                    {formatCurrency(service.default_price)}
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        {service.description && (
                            <div className='text-sm text-gray-600 dark:text-gray-400'>
                                {service.description}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                itemsPerPage={itemsPerPage}
                totalItems={services.length}
            />
        </>
    );
}
