import { BackendResources } from "@/lib/enums";
import { nextBackendRequest } from "@/services";

export const fetchFileUploadMeta = async () => {
  try {
    const data = await nextBackendRequest({
      resource: BackendResources.FileUpload,
    });

    return data;
  } catch (error) {}
};
