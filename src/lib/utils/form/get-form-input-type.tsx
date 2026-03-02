import { FieldType } from '@/lib/enums';

export const getFormInputType = (fieldType: FieldType) => {
  switch (fieldType) {
    case FieldType.Text:
      return 'text';

    default:
      throw 'Invalid field type';
  }
};
