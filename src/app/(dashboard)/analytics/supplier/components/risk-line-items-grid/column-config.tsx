const supplierColumnConfig = [
  {
    title: 'Line Item Id',
    dataIndex: 'line_item_id',
    key: 'line_item_id',
    sorter: (a: any, b: any) => {
      const aValue = a.line_item_id || '';
      const bValue = b.line_item_id || '';
      return aValue.localeCompare(bValue);
    },
    width: 200,
  },
  {
    title: 'Line Item',
    dataIndex: 'line_item_name',
    key: 'line_item_name',
    sorter: (a: any, b: any) => {
      const aValue = a.line_item_name || '';
      const bValue = b.line_item_name || '';
      return aValue.localeCompare(bValue);
    },
    width: 200,
  },
  // Duplicate of Line Item column, so commenting out for now
  // {
  //   title: 'Line - Item',
  //   dataIndex: 'parent_line_item_name',
  //   key: 'parent_line_item_name',
  //   sorter: (a: any, b: any) => {
  //     const aValue = a.parent_line_item_name || '';
  //     const bValue = b.parent_line_item_name || '';
  //     return aValue.localeCompare(bValue);
  //   },
  //   width: 250,
  //   // fixed: "left" as const,
  // },

  {
    title: 'Marketer',
    dataIndex: 'marketer_name',
    key: 'marketer_name',
    sorter: (a: any, b: any) => {
      const aValue = a.marketer_name || '';
      const bValue = b.marketer_name || '';
      return aValue.localeCompare(bValue);
    },
    width: 180,
  },
  {
    title: 'Target Goal',
    dataIndex: 'target_goal',
    key: 'target_goal',
    sorter: (a: any, b: any) => a.target_goal - b.target_goal, // sortable
    width: 180,
  },
  {
    title: 'Leads Published',
    dataIndex: 'leads_published',
    key: 'leads_published',
    sorter: (a: any, b: any) => a.leads_published - b.leads_published, // sortable
    width: 180,
  },
  {
    title: 'Leads Remaining',
    dataIndex: 'leads_remaining',
    key: 'leads_remaining',
    sorter: (a: any, b: any) => a.leads_remaining - b.leads_remaining, // sortable
    width: 180,
  },
  {
    title: 'Target End Date',
    dataIndex: 'target_end_date',
    key: 'target_end_date',
    sorter: (a: any, b: any) =>
      new Date(a.target_end_date).getTime() -
      new Date(b.target_end_date).getTime(),
    width: 180,
    // Optionally, render formatted date string here if needed
    render: (date: string) =>
      new Date(date)
        .toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
        .replace(/\s/g, ' '),
  },
  {
    title: 'Days Left',
    dataIndex: 'days_left',
    key: 'days_left',
    sorter: (a: any, b: any) => {
      const getNumericValue = (val: any) => {
        if (!val || val === '-' || val === 'N/A') return 0;

        // If it's an object with text property
        if (typeof val === 'object' && val.text !== undefined) {
          const text = val.text.toString();
          // Extract numeric value from strings like "5 days left" or "10 days overdue"
          const match = text.match(/(-?\d+)/);
          const numValue = match ? parseInt(match[1], 10) : 0;
          // Make overdue values negative for proper sorting
          if (text.toLowerCase().includes('overdue')) {
            return -Math.abs(numValue);
          }
          return numValue;
        }

        // If it's a string, try to extract numeric value
        if (typeof val === 'string') {
          const match = val.match(/(-?\d+)/);
          const numValue = match ? parseInt(match[1], 10) : 0;
          if (val.toLowerCase().includes('overdue')) {
            return -Math.abs(numValue);
          }
          return numValue;
        }

        // If it's already a number
        return typeof val === 'number' ? val : 0;
      };

      return getNumericValue(a.days_left) - getNumericValue(b.days_left);
    },
    width: 180,
  },

  {
    title: 'At Risk Reason',
    dataIndex: 'at_risk_reason',
    key: 'at_risk_reason',
    sorter: (a: any, b: any) => {
      const aValue = a.at_risk_reason || '';
      const bValue = b.at_risk_reason || '';
      return aValue.localeCompare(bValue);
    },
    width: 180,
  },
  // We dont need action column for now
  // {
  //   title: 'Action',
  //   key: 'action',
  //   fixed: 'right' as const,
  //   width: 120,
  //   // No sorter here, so not sortable
  //   // render: (_: any, record: any) => <a href={`/edit/${record.key}`}>Edit</a>,
  // },
];

export { supplierColumnConfig };
