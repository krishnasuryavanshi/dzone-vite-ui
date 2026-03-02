import { BackendResources, HttpMethod } from "@/lib/enums";
import { nextBackendRequest } from "@/services/backend-request";

export const createLineItem = async (data: any) => {
  try {
    return nextBackendRequest({
      resource: BackendResources.LineItems,
      method: HttpMethod.POST,
      data,
    });
  } catch (error) {}
};
