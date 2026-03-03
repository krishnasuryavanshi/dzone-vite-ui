import { ResourceProps } from "../types/resource.types";
import { Roles } from "../enums";

export function roleBasedResources(resources: ResourceProps[], roles: Roles[]) {
    return resources.filter(({meta}) => {
        return (!meta || !meta.roles) || meta?.roles.some(((role: string) => roles.includes(role as Roles)));
    });
}