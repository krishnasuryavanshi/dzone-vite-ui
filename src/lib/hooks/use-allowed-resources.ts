import { useEffect, useState, useRef } from 'react';
import { useSession } from '@/lib/hooks/use-session';
import { usePermissionsStore } from '@/stores/permissions-store';
import { fetchPermissions } from '@/services/fetch-permissions';
import { roleBasedResources, checkPermission } from '../utils';
import { resources } from '@/config/resources';
import { IResourceItem } from '../types/resource.types';
import { AdminRoleEnum, Resource } from '../enums';

export function useAllowedResources() {
  const { data } = useSession();
  const [resourcesList, setResourcesList] = useState<IResourceItem[]>([]);
  const [hideUsers, setHideUsers] = useState<boolean>(false);
  const permissionsFetched = useRef(false);

  const { accesses, setAccesses, setAttributes, setModules } =
    usePermissionsStore();

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

  const fetchAllPermissionsForAttributes = async (roleIds: string[]) => {
    const permissionsData = await fetchPermissions({ roleIds: roleIds });
    const fieldData = permissionsData?.data ? [...permissionsData.data] : [];
    const setFieldPermissions = usePermissionsStore.getState().setAttributes;
    setFieldPermissions(fieldData);
  };

  useEffect(() => {
    if (data?.roles && !permissionsFetched.current) {
      const roleIds = data.roles.map((role: { id: string }) => role.id);
      fetchAllPermissionsForAttributes(roleIds);
      permissionsFetched.current = true;
    }
  }, [data?.roles]);

  return {
    resources: resourcesList,
  };
}
