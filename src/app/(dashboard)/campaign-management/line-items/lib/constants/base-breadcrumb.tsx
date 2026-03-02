import { Translate } from "@/components/i18n";

export const BaseBreadcrumb = [
    {
      title: <Translate i18nKey="pages.campaignManagement.title" />,
    },
    {
      title: <Translate i18nKey="pages.campaigns.title" />,
      href: "/campaign-management/campaigns",
    },
    {
      title: <Translate i18nKey="pages.lineItems.title" />,
      href: "/campaign-management/line-items",
    },
  ];
  