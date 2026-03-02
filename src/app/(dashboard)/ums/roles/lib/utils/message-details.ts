import { ModuleNames, PermissionsGroupName, ActionType } from '../enums';

export const MessageDetails: Record<
  ModuleNames,
  Partial<
    Record<
      ActionType,
      {
        actionText?: string;
        groupTooltip?: Partial<Record<PermissionsGroupName, string>>;
      }
    >
  >
> = {
  [ModuleNames.DASHBOARD]: {
    [ActionType.VIEW_DASHBOARD]: {
      actionText: 'User has permission to view the dashboards',
      groupTooltip: {
        [PermissionsGroupName.VIEW_DASHBOARD]:
          'Only selected dashboards will be visible to users.',
      },
    },
    [ActionType.DOWNLOAD_DATA_FROM_DASHBOARD]: {
      actionText: 'User has permission to download data from dashboards',
    },
  },
  [ModuleNames.DZENT]: {
    [ActionType.VIEW_DZENT]: {
      actionText: 'User has permission to view DZent',
    },
    [ActionType.VIEW_AI_COWORKER]: {
      actionText: 'User has permission to view AI Coworker',
    },
  },
  [ModuleNames.ICP]: {
    [ActionType.VIEW_ICP]: {
      actionText: 'User has permission to view ICP',
    },
  },
  [ModuleNames.INTEGRATIONS]: {
    [ActionType.VIEW_INTEGRATIONS]: {
      actionText: 'User has permission to view Integrations',
    },
    [ActionType.CREATE_INTEGRATIONS]: {
      actionText: 'User has permission to create Integrations',
    },
    [ActionType.EDIT_INTEGRATIONS]: {
      actionText: 'User has permission to edit Integrations',
    },
  },
  [ModuleNames.CLIENT]: {
    [ActionType.VIEW_CLIENT]: {
      actionText: 'User has permission to view clients',
      groupTooltip: {
        [PermissionsGroupName.FIELDS]:
          'Only selected fields will be visible to users.',
        [PermissionsGroupName.STATUS]:
          'Only clients that match the selected status will be visible to users.',
      },
    },
    [ActionType.EDIT_CLIENT]: {
      actionText: 'User has permission to edit clients',
      groupTooltip: {
        [PermissionsGroupName.FIELDS]:
          'Only selected fields will be editable by users.',
      },
    },
    [ActionType.CREATE_CLIENT]: {
      actionText: 'User has permission to create clients',
      groupTooltip: {
        [PermissionsGroupName.FIELDS]:
          'Only selected fields will be creatable by users.',
      },
    },
  },
  [ModuleNames.ORGANIZATIONS]: {
    [ActionType.VIEW_ORGANIZATION]: {
      actionText: 'User has permission to view organizations',
      groupTooltip: {
        [PermissionsGroupName.FIELDS]:
          'Only selected fields will be visible to users.',
        [PermissionsGroupName.STATUS]:
          'Only clients that match the selected status will be visible to users.',
      },
    },
    [ActionType.EDIT_ORGANIZATION]: {
      actionText: 'User has permission to edit organizations',
      groupTooltip: {
        [PermissionsGroupName.FIELDS]:
          'Only selected fields will be editable by users.',
      },
    },
    [ActionType.CREATE_ORGANIZATION]: {
      actionText: 'User has permission to create organizations',
      groupTooltip: {
        [PermissionsGroupName.FIELDS]:
          'Only selected fields will be creatable by users.',
      },
    },
  },
  [ModuleNames.CAMPAIGN]: {
    [ActionType.VIEW_CAMPAIGN]: {
      actionText: 'User has permission to view campaigns',
      groupTooltip: {
        [PermissionsGroupName.FIELDS]:
          'Only selected fields will be visible to users.',
        [PermissionsGroupName.STATUS]:
          'Only campaigns that match the selected staus will be visible to users',
        [PermissionsGroupName.LIST_VIEW_PRESETS]:
          'Only selected list view presets will be visible to users',
      },
    },
    [ActionType.EDIT_CAMPAIGN]: {
      actionText: 'User has permission to edit campaigns',
      groupTooltip: {
        [PermissionsGroupName.FIELDS]:
          'Only selected fields will be editable to users.',
      },
    },
    [ActionType.CREATE_CAMPAIGN]: {
      actionText: 'User has permission to create campaigns',
      groupTooltip: {
        [PermissionsGroupName.FIELDS]:
          'Only selected fields will be creatable to users.',
      },
    },
  },
  [ModuleNames.LINE_ITEM]: {
    [ActionType.VIEW_LINE_ITEM]: {
      actionText: 'User has permission to view line items',
      groupTooltip: {
        [PermissionsGroupName.FIELDS]:
          'Only selected fields will be visible to users.',
        [PermissionsGroupName.STATUS]:
          'Only line items that match the selected staus will be visible to users.',
        [PermissionsGroupName.LIST_VIEW_PRESETS]:
          'Only selected list view presets will be visible to users.',
      },
    },
    [ActionType.EDIT_LINE_ITEM]: {
      actionText: 'User has permission to edit line items',
      groupTooltip: {
        [PermissionsGroupName.FIELDS]:
          'Only selected fields will be editable by users.',
      },
    },
    [ActionType.UPDATE_LINE_ITEM_STATUS]: {
      actionText: 'User has permission to update line item status',
      groupTooltip: {
        [PermissionsGroupName.STATUS]:
          'Only line items that match the selected status will be available for status update to users.',
      },
    },
    [ActionType.CREATE_LINE_ITEM]: {
      actionText: 'User has permission to create line items',
      groupTooltip: {
        [PermissionsGroupName.FIELDS]:
          'Only selected fields will be creatable to users.',
      },
    },
    [ActionType.VALIDATION_SETTINGS]: {
      actionText: 'User has permission to view validation settings',
    },
    [ActionType.EDIT_LINE_ITEM_VALIDATION_SETTINGS]: {
      actionText: 'User has permission to edit validation settings',
    },
    [ActionType.VIEW_CUSTOM_FIELDS]: {
      actionText: 'User has permission to view custom fields',
    },
    [ActionType.EDIT_CUSTOM_FIELDS]: {
      actionText: 'User has permission to edit custom fields',
    },
  },
  [ModuleNames.LEADS]: {
    [ActionType.VIEW_LEADS]: {
      actionText: 'User has permission to view leads',
      groupTooltip: {
        [PermissionsGroupName.FIELDS]:
          'Only selected fields will be visible to users.',
        [PermissionsGroupName.STATUS]:
          'Only leads that match the selected staus will be visible to users.',
        [PermissionsGroupName.LINE_ITEM_STATUS]:
          'Leads only from line items that match the selected staus will be visible to users.',
      },
    },
    [ActionType.UPDATE_LEADS]: {
      actionText: 'User has permission to update exisitng leads data & status',
      groupTooltip: {
        [PermissionsGroupName.FIELDS]:
          'Only selected fields will be editable by users.',
        [PermissionsGroupName.STATUS]:
          'Only leads that match the selected status will be editable to users.',
      },
    },
    [ActionType.UPLOAD_NEW_LEADS]: {
      actionText: 'User has permission to upload new leads',
      groupTooltip: {
        [PermissionsGroupName.FIELDS]:
          'Only selected fields will be creatable to users.',
      },
    },
    [ActionType.DOWNLOAD_LEADS]: {
      actionText: 'User has permission to download leads',
    },
    [ActionType.TRANSFORM_AND_EXPORT_LEADS]: {
      actionText:
        'User has permission to transform & export leads using delivery templates',
    },
    [ActionType.SCHEDULE_DELIVERY]: {
      actionText: 'User has permission to schedule delivery of leads',
    },
    [ActionType.FILTER_LEADS_BY_VALIDATION_STATUS]: {
      actionText: 'User has permission to filter leads by validation status',
    },
    [ActionType.VALIDATE_LEADS]: {
      actionText: 'User has permission to validate Leads',
    },
    [ActionType.RETURN_LEADS]: {
      actionText: 'User has permission to return Leads',
    },
    [ActionType.PUBLISH_LEADS]: {
      actionText: 'User has permission to publish Leads',
    },
    [ActionType.ACCESS_LEAD_REVIEW_PANEL]: {
      actionText: 'User has permission to access leads review panel',
    },
    [ActionType.ARCHIVE_LEADS]: {
      actionText: 'User has permission to archive leads',
    },
    [ActionType.BULK_STATUS_UPDATE_LEADS]: {
      actionText: 'User has permission to bulk update leads status',
    },
    [ActionType.VALIDATION_STATUS_FILTER]: {
      actionText: 'User has permission to filter leads by validation status',
    },
  },
  [ModuleNames.DELIVERY_TEMPLATES]: {
    [ActionType.VIEW_DELIVERY_TEMPLATES]: {
      actionText: 'User has permission to view delivery templates',
    },
    [ActionType.EDIT_DELIVERY_TEMPALTES]: {
      actionText: 'User has permission to edit delivery templates',
    },
    [ActionType.CREATE_DELIVERY_TEMPLATES]: {
      actionText: 'User has permission to create delivery templates',
    },
  },
  [ModuleNames.ROLES_AND_PERMISSIONS]: {
    [ActionType.VIEW_ROLES_AND_PERMISSIONS]: {
      actionText: 'User has permission to view roles (and permissions)',
    },
    [ActionType.MARK_ROLES_ACTIVE_INACTIVE]: {
      actionText: 'User has permission to mark roles as active or inactive',
    },
    [ActionType.EDIT_ROLES_AND_PERMISSIONS]: {
      actionText:
        'User has permission to edit existing roles (and permissions)',
    },
    [ActionType.ADD_USERS_TO_ROLE]: {
      actionText:
        'User has permission to add users to exisitng roles (and permissions)',
    },
    [ActionType.CREATE_ROLES_AND_PERMISSIONS]: {
      actionText: 'User has permission to create roles (and permissions)',
    },
  },
  [ModuleNames.USER]: {
    [ActionType.VIEW_USER]: {
      actionText: 'User has permission to view users',
    },
    [ActionType.EDIT_USER]: {
      actionText: 'User has permission to edit users',
    },
    [ActionType.CHANGE_STATUS]: {
      actionText: 'User has permission to mark users as active or inactive',
    },
    [ActionType.CREATE_USER]: {
      actionText: 'User has permission to create users',
    },
  },
  [ModuleNames.VALIDATION_SETTINGS]: {
    [ActionType.VIEW_VALIDATION_SETTINGS]: {
      actionText: 'User has permission to view validation settings',
    },
    [ActionType.EDIT_VALIDATION_SETTINGS]: {
      actionText: 'User has permission to edit validation settings',
    },
    [ActionType.CREATE_VALIDATION_SETTINGS]: {
      actionText: 'User has permission to create validation settings',
    },
  },
  [ModuleNames.JOBS]: {
    [ActionType.VIEW_JOBS]: {
      actionText: 'User has permission to view jobs',
    },
  },
};
