import { IFormConfig } from '@/lib/types';
import {
  LineItemFields,
  LineItemSections,
  LineItemSteps,
} from '../../lib/enums';
import { BasicDetails } from './basic-details';
import { CollaboratorsConfig } from './collaborators';
import { CustomQuestionsConfig } from './custom-questions';
import { DeliveryConfig } from './delivery';
import { GoalsConfig } from './goals';
import { TargetingConfig } from './targeting';
import { ILineItem } from '../../lib/types';

export type ICreateLineItemConfig = IFormConfig<
  LineItemSteps,
  LineItemSections,
  LineItemFields,
  ILineItem
>;

export const LineItemFormConfig: ICreateLineItemConfig = {
  meta: {
    name: 'createLineItem',
    className: 'create-line-item',
    formLayout: 'vertical',
  },
  translation: 'form.createLineItem',
  steps: {
    [LineItemSteps.BasicDetails]: BasicDetails,
    [LineItemSteps.Goals]: GoalsConfig,
    [LineItemSteps.DeliveryAndPacing]: DeliveryConfig,
    [LineItemSteps.CustomQuestions]: CustomQuestionsConfig,
    [LineItemSteps.Targeting]: TargetingConfig,
    // [LineItemSteps.Collaborators]: CollaboratorsConfig,
  } as Record<LineItemSteps, any[]>,
};

export type CreateLineItemFormConfigType = typeof LineItemFormConfig;
