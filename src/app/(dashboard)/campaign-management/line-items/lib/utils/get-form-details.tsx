export const getFormDetails = (
  data: Record<string, any>,
  patchFormValues = (values: any) => {},
) => {
  if (data.campaign) {
    patchFormValues({
      campaignId: data.campaign.id,
      campaignIdNumber: data.campaign.campaignId,
      campaignName: data.campaign.label,
    });
  }
};
