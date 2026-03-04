const marketerColumnConfig = [
  {
    title: 'Campaign Name',
    dataIndex: 'campaign_name',
    key: 'campaignName',
    sorter: (a: any, b: any) => a.campaign_name?.localeCompare(b.campaign_name), // sortable
    width: 250,
    // fixed: "left" as const,
  },
  {
    title: 'Line Item',
    dataIndex: 'line_item_name',
    key: 'lineItemName',
    sorter: (a: any, b: any) => a.line_item_name?.localeCompare(b.line_item_name), // sortable
    width: 200,
  },
  {
    title: 'Supplier',
    dataIndex: 'supplier_names',
    key: 'supplierNames',
    sorter: (a: any, b: any) => {
      // Handle supplier_names which might be an array, string, React element, or null/undefined
      const getStringValue = (val: any): string => {
        if (!val) return '';
        if (Array.isArray(val)) return val.join(', ');
        // Handle React element objects
        if (typeof val === 'object' && val.props && val.props.children) {
          return String(val.props.children);
        }
        return String(val);
      };

      const aValue = getStringValue(a.supplier_names);
      const bValue = getStringValue(b.supplier_names);

      return aValue.localeCompare(bValue);
    },
    width: 180,
    render: (value: any) => {
      // If it's already a React element, return it as is
      if (typeof value === 'object' && value.type) {
        return value;
      }
      // Display array values as comma-separated string
      if (Array.isArray(value)) {
        return value.join(', ');
      }
      return value || '';
    },
  },
  {
    title: 'Target Start Date',
    dataIndex: 'target_start_date',
    key: 'targetStartDate',
    sorter: (a: any, b: any) =>
      new Date(a.target_start_date).getTime() - new Date(b.target_start_date).getTime(),
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
    title: 'Actual Start Date',
    dataIndex: 'actual_start_date',
    key: 'actualStartDate',
    sorter: (a: any, b: any) =>
      new Date(a.actual_start_date).getTime() - new Date(b.actual_start_date).getTime(),
    width: 180,
    // Optionally, render formatted date string here if needed
    render: (date: string) => {
      if (!date || date === null || date === undefined) return '';
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) return '';
      return parsedDate
        .toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
        .replace(/\s/g, ' ');
    },
  },
  {
    title: 'Target Lead Goal',
    dataIndex: 'target_lead_goal',
    key: 'targetLeadGoal',
    sorter: (a: any, b: any) => a.target_lead_goal - b.target_lead_goal, // sortable
    width: 180,
  },
  {
    title: 'Leads Delivered',
    dataIndex: 'leads_delivered',
    key: 'leadsDelivered',
    sorter: (a: any, b: any) => a.leads_delivered - b.leads_delivered, // sortable
    width: 180,
  },
  {
    title: 'Pacing Gap',
    dataIndex: 'pacing_gap',
    key: 'pacingGap',
    sorter: (a: any, b: any) => a.pacing_gap - b.pacing_gap, // sortable
    width: 180,
  },
  {
    title: 'At-Risk to Launch',
    dataIndex: 'at_risk_reason_to_launch',
    key: 'atRiskReasonToLaunch',
    sorter: (a: any, b: any) =>
      a.at_risk_reason_to_launch?.localeCompare(b.at_risk_reason_to_launch), // sortable
    width: 180,
  },
  {
    title: 'At-Risk to Deliver',
    dataIndex: 'at_risk_to_deliver',
    key: 'atRiskToDeliver',
    sorter: (a: any, b: any) => a.at_risk_to_deliver?.localeCompare(b.at_risk_to_deliver), // sortable
    width: 180,
    render: (value: string) => {
      // if the value is exactly "%", return null (renders nothing)
      if (value === '%') return null;
      return value;
    },
  },
  {
    title: 'Days Overdue/Left',
    dataIndex: 'days_left_overdue',
    key: 'daysLeftOverdue',
    width: 150,
    sorter: (a: any, b: any) => {
      const getNumericValue = (val: any) => {
        if (!val || val === '-') return 0;
        // If it's an object with text property
        if (typeof val === 'object' && val.text !== undefined) {
          const text = val.text.toString();
          // Extract numeric value from strings like "5 days overdue" or "10 days left"
          const match = text.match(/^(\d+)/);
          const numValue = match ? parseInt(match[1], 10) : 0;
          // Make overdue values negative for proper sorting
          if (text.includes('overdue')) {
            return -numValue;
          }
          return numValue;
        }
        // If it's a string, try to extract numeric value
        if (typeof val === 'string') {
          const match = val.match(/^(\d+)/);
          const numValue = match ? parseInt(match[1], 10) : 0;
          if (val.includes('overdue')) {
            return -numValue;
          }
          return numValue;
        }
        // If it's already a number
        return typeof val === 'number' ? val : 0;
      };

      // Reverse the comparison to fix the sorting order
      return getNumericValue(b?.days_left_overdue) - getNumericValue(a?.days_left_overdue);
    },
    render: (val: any) => {
      if (!val || val === '-') return '-';
      if (typeof val === 'object' && val.text !== undefined) {
        return <span style={val.style || {}}>{val.text}</span>;
      }
      return val.toString();
    },
  },
  {
    title: 'At-Risk Reason',
    dataIndex: 'at_risk_reason',
    key: 'atRiskReason',
    sorter: (a: any, b: any) => a.at_risk_reason?.localeCompare(b.at_risk_reason), // sortable
    width: 250,
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

export { marketerColumnConfig };
