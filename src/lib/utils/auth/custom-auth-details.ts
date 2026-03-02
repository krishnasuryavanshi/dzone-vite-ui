import { ApiHost } from '../../constants';
import { AuthTypes } from '../../enums';
import {
  getAccessToken,
  getUserProfile,
  getUserRoleIds,
} from './session-token-accessor';

const REPORTING_SERVICE_AUTH_TYPE = `${process.env.REPORTING_SERVICE_AUTH_TYPE}`;
const FILE_SERVICE_AUTH_TYPE = `${process.env.FILE_SERVICE_AUTH_TYPE}`;
const LEAD_ORCHESTRATION_SERVICE_AUTH_TYPE = `${process.env.LEAD_ORCHESTRATION_SERVICE_AUTH_TYPE}`;
const CAMPAIGN_DELIVERY_SERVICE_AUTH_TYPE = `${process.env.CAMPAIGN_DELIVERY_SERVICE_AUTH_TYPE}`;
const FILE_TRANSFORMATION_SERVICE_AUTH_TYPE = `${process.env.FILE_TRANSFORMATION_SERVICE_AUTH_TYPE}`;
const RECOMMENDATION_SERVICE_AUTH_TYPE = `${process.env.RECOMMENDATION_SERVICE_AUTH_TYPE}`;
const AUDIT_SERVICE_AUTH_TYPE = `${process.env.AUDIT_SERVICE_AUTH_TYPE}`;
const RBAC_SERVICE_AUTH_TYPE = `${process.env.RBAC_SERVICE_AUTH_TYPE}`;

export interface ICustomAuthDetails {
  auth: {
    Authorization?: string;
    'X-Api-Key'?: string;
    'X-API-Token'?: string;
    'X-CAMPAIGN-BEARER-TOKEN'?: string;
    'X-ORCHESTRATION-SERVICE-TOKEN'?: string;
    'X-User-Id'?: string;
    roleIds?: string;
  };
  isAuthenticated: boolean;
}

export const customAuthDetails = async (
  service: string | undefined,
): Promise<ICustomAuthDetails | false> => {
  if (service === ApiHost.ReportingService) {
    if (REPORTING_SERVICE_AUTH_TYPE === AuthTypes.BearerToken) {
      return false;
    } else if (REPORTING_SERVICE_AUTH_TYPE === AuthTypes.Custom) {
      return {
        auth: {
          Authorization: `${process.env.REPORTING_SECRET_TOKEN}`,
        },
        isAuthenticated: false,
      };
    }
  }

  if (service === ApiHost.FileService) {
    if (FILE_SERVICE_AUTH_TYPE === AuthTypes.BearerToken) {
      return false;
    } else if (FILE_SERVICE_AUTH_TYPE === AuthTypes.Custom) {
      const userProfile = await getUserProfile();
      if (!userProfile?.userId) {
        throw new Error('User profile not found');
      }
      return {
        auth: {
          Authorization: `${process.env.FILE_SERVICE_SECRET_TOKEN}`,
          'X-Api-Key': userProfile.userId,
        },
        isAuthenticated: false,
      };
    }
  }
  if (service === ApiHost.TransformationService) {
    if (FILE_TRANSFORMATION_SERVICE_AUTH_TYPE === AuthTypes.BearerToken) {
      return false;
    } else if (FILE_TRANSFORMATION_SERVICE_AUTH_TYPE === AuthTypes.Custom) {
      const userProfile = await getUserProfile();
      if (!userProfile?.userId) {
        throw new Error('User profile not found');
      }
      return {
        auth: {
          Authorization: `${process.env.FILE_TRANSFORMATION_SERVICE_SECRET_TOKEN}`,
          'X-Api-Key': userProfile.userId,
        },
        isAuthenticated: false,
      };
    }
  }
  if (service === ApiHost.LeadOrchestrationService) {
    const token = await getAccessToken();
    if (LEAD_ORCHESTRATION_SERVICE_AUTH_TYPE === AuthTypes.BearerToken) {
      return false;
    } else if (LEAD_ORCHESTRATION_SERVICE_AUTH_TYPE === AuthTypes.Custom) {
      return {
        auth: {
          'X-CAMPAIGN-BEARER-TOKEN': `${token}`,
          'X-ORCHESTRATION-SERVICE-TOKEN': `${process.env.LEAD_ORCHESTRATION_SERVICE_SECRET_TOKEN}`,
        },
        isAuthenticated: false,
      };
    }
  }
  if (service === ApiHost.CampaignDeliveryService) {
    const token = await getAccessToken();
    if (CAMPAIGN_DELIVERY_SERVICE_AUTH_TYPE === AuthTypes.BearerToken) {
      return false;
    } else if (CAMPAIGN_DELIVERY_SERVICE_AUTH_TYPE === AuthTypes.Custom) {
      return {
        auth: {
          'X-CAMPAIGN-BEARER-TOKEN': `${token}`,
        },
        isAuthenticated: false,
      };
    }
  }

  if (service === ApiHost.RecommendationService) {
    if (RECOMMENDATION_SERVICE_AUTH_TYPE === AuthTypes.BearerToken) {
      return false;
    } else if (RECOMMENDATION_SERVICE_AUTH_TYPE === AuthTypes.Custom) {
      return {
        auth: {
          Authorization: `${process.env.RECOMMENDATION_SERVICE_SECRET_TOKEN}`,
        },
        isAuthenticated: false,
      };
    }
  }

  if (service === ApiHost.AuditService) {
    if (AUDIT_SERVICE_AUTH_TYPE === AuthTypes.BearerToken) {
      return false;
    } else if (AUDIT_SERVICE_AUTH_TYPE === AuthTypes.Custom) {
      return {
        auth: {
          Authorization: `${process.env.AUDIT_SERVICE_SECRET_TOKEN}`,
        },
        isAuthenticated: false,
      };
    }
  }

  if (service === ApiHost.CampaignService) {
    const token = await getAccessToken();
    const roleIds = await getUserRoleIds();
    const userProfile = await getUserProfile();
    if (!userProfile?.userId) {
      throw new Error('User profile not found');
    }
    return {
      auth: {
        'X-API-Token': `${token}`,
        roleIds: roleIds,
        Authorization: `Bearer ${token}`,
        'X-User-Id': userProfile.userId, // temporary fix for campaign service | IT will be handled from the gateway will remove this after that BE change
      },
      isAuthenticated: false,
    };
  }
  return false;
};
