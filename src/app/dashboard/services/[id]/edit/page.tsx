// ================================================
// Edit Service Page - COMPLETE FIXED VERSION
// ================================================
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getService, getServiceCategories, updateService } from '../../actions';
import { ServiceForm } from '../../service-form';

interface EditServicePageProps {
    params: Promise<{
        id: string;
    }> | {
        id: string;
    };
}

export default async function EditServicePage({ params }: EditServicePageProps) {
    // Handle both Next.js 14 (direct params) and Next.js 15+ (Promise params)
    const resolvedParams = await Promise.resolve(params);
    const serviceId = resolvedParams.id;

    // Validate ID exists
    if (!serviceId || serviceId === 'undefined') {
    console.error('No service ID provided');
    notFound();
    }

    const { data: service, error: serviceError } = await getService(serviceId);
    const { data: categories } = await getServiceCategories();

    if (serviceError || !service) {
    console.error('Service error:', serviceError);
    notFound();
    }

    // Bind the service ID to the update action
    const updateServiceWithId = updateService.bind(null, serviceId);

    return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/services"
          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium mb-4 inline-block dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          ← Back to Services
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Service</h1>
        <p className="text-gray-600 mt-1 dark:text-gray-400">
          Update service details
        </p>
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        <ServiceForm
          action={updateServiceWithId}
          existingCategories={categories || []}
          submitLabel="Update Service"
          initialData={{
            name: service.name,
            category: service.category?.name,
            default_price: service.default_price,
            description: service.description || undefined,
          }}
        />
      </div>
    </div>
  );
}