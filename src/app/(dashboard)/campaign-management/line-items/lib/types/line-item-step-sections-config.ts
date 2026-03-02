import { IStepSectionConfig } from '@/lib/types';
import { LineItemFields, LineItemSections } from '../enums';
import { ILineItem } from './line-item';

export type LineItemStepSectionsType = IStepSectionConfig<
  LineItemSections,
  LineItemFields,
  ILineItem
>[];
