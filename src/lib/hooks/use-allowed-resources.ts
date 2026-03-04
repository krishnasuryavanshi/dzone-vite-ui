import { useEffect, useMemo, useState } from 'react';
import { useSession } from '@/lib/hooks/use-session';
import { usePermissionsStore } from '@/stores/permissions-store';
import { roleBasedResources, checkPermission } from '../utils';
import { resources } from '@/config/resources';
import { IResourceItem } from '../types/resource.types';
import { usePermissionsQuery } from './use-permissions-query';

export function useAllowedResources() {
  const { data } = useSession();
  const [resourcesList, setResourcesList] = useState<IResourceItem[]>([]);
  const [hideUsers, setHideUsers] = useState<boolean>(false);

  const { accesses, setAccesses, setAttributes, setModules } = usePermissionsStore();

  const roleIds = useMemo(
    () => (data?.roles ?? []).map((role: { id: string }) => role.id),
    [data?.roles],
  );

  // TanStack Query: fetch permissions
  const { data: permissionsData } = usePermissionsQuery(roleIds);

  // Set attributes from permissions query result
  useEffect(() => {
    if (permissionsData?.data) {
      const fieldData = [...permissionsData.data];
      const setFieldPermissions = usePermissionsStore.getState().setAttributes;
      setFieldPermissions(fieldData);
    }
  }, [permissionsData]);

  useEffect(() => {
    if (data?.roles) {
      const permitted = roleBasedResources(resources, data.roles);

      const filteredResources = hideUsers
        ? permitted.filter((resource) => resource.name !== 'users')
        : permitted;

      setResourcesList(filteredResources);
    }
  }, [data?.roles, hideUsers]);

  useEffect(() => {
    if (data?.modules) {
      setAccesses(data.modules);
      setModules(data.moduleAccessList || []);
    } else {
      setAccesses({});
      setModules([]);
    }
  }, [data?.modules]);

  useEffect(() => {
    if (Object.keys(accesses).length > 0) {
      const permittedResources = resources.filter((resource) => {
        const resourcePermissions = resource.meta?.permissions;
        if (!resourcePermissions) {
          return true;
        }
        return checkPermission(resourcePermissions, accesses);
      });
      const finalResources = hideUsers
        ? permittedResources.filter((resource) => resource.name !== 'users')
        : permittedResources;
      setResourcesList(finalResources);
    } else {
      setResourcesList([]);
    }
  }, [accesses, hideUsers]);

  return {
    resources: resourcesList,
  };
}
