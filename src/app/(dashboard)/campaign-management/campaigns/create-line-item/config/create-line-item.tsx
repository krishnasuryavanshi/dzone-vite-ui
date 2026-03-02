import { LineItemStatus } from "../../../line-items/lib/enums";
import { Pacing, Product, Status } from "../../lib/constants";

export const createLineItemConfig = {
  info: {
    headingsTransKeys: 'form.createLineItem',
    fieldsTransKeys: 'form.createLineItem.fields',
  },
  meta: {
    name: 'createLineItems',
    className: 'create-line-item',
    layout: 'vertical',
  },
  fields: {
    name: {
      item: {
        rules: [{ required: true }, { pattern: /^[\w\-\s]+$/ }],
      },
      input: {
        type: 'text',
      },
    },
    billableLeads: {
      item: {
        rules: [
          {
            required: true,
          },
        ],
      },
      input: {
        type: 'number',
        onChange: () => {},
      },
    },
    valueAddLeads: {
      item: {
        rules: [{ required: true }],
      },
      input: {
        type: 'number',
        onChange: () => {},
      },
    },
    totalLeads: {
      item: {
        rules: [],
      },
      input: {
        type: 'number',
        disabled: true,
      },
    },
    pacing: {
      item: {
        rules: [{ required: true }],
      },
      input: {
        options: Pacing,
        type: 'select',
      },
    },
    product: {
      item: {
        rules: [{ required: true }],
      },
      input: {
        type: 'select',
        options: Product,
      },
    },
    startDate: {
      item: {
        rules: [{ required: true }],
      },
      input: {
        type: 'date',
      },
    },
    endDate: {
      item: {
        rules: [{ required: true }],
      },
      input: {
        type: 'date',
      },
    },
    cpl: {
      item: {
        rules: [{ required: true }],
      },
      input: {
        type: 'number',
      },
    },
    status: {
      item: {
        rules: [{ required: true }],
      },
      input: {
        type: 'select',
        options: Status.filter((status) => status.label !== LineItemStatus.BOOKED),
      },
    },
  },
};
