'use client';

import { EntityActionsMenu } from '@/components';
import { deleteService } from './actions';

interface ServiceActionsMenuProps {
    serviceId: string;
    serviceName: string;
}

export function ServiceActionsMenu({ serviceId, serviceName }: ServiceActionsMenuProps) {
    return (
        <EntityActionsMenu
            entityId={serviceId}
            entityLabel={serviceName}
            editPath={`/dashboard/services/${serviceId}/edit`}
            redirectPath="/dashboard/services"
            onDelete={deleteService}
        />
    );
}
