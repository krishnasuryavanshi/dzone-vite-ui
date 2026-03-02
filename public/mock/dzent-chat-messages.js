export const DzentChatMessages = {
  text: [
    {
      message: 'Welcome to Dzent! How can I assist you today?',
      field: {
        type: 'text',
        label: 'Campaign Name',
        name: 'campaignName',
        options: null,
      },
    },
  ],
  message: [
    {
      message: "You have missed few fields in the earlier let's fill it now.",
    },
    {
      message:
        '<p style="margin:0 0 8px; font-size:14px; line-height:1.55; color:#1F2328;"><strong style="font-weight:600;">Fantastic news!</strong> 😊 Your campaign, <strong>Hero Motors Complete Campaign Data 556677</strong>, has been successfully created. I’ve set up a few quick inputs on your screen to help you move forward. What would you like to do next?</p>\n<p style="margin:0; font-size:14px; line-height:1.55; color:#1F2328;">If you\'re ready, we can dive into targeting or any other details you want to refine.</p><table role="presentation" style="width:100%; border-collapse:collapse; margin:8px 0 0;font-family:Inter,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:14px; line-height:1.55; color:#1F2328;border:1px solid #E6E8EA; border-radius:8px; overflow:hidden;"><tr>  <th scope="row" style="text-align:left; padding:8px 12px;background:#F6F8FA; font-weight:600; width:180px; vertical-align:top;">Campaign Link</th>  <td style="padding:8px 12px; vertical-align:top;"><a href="https://dzone-dev.digitalzoneus.com/campaign-management/campaigns/3ab2bc99-4966-44c2-9e5e-e997a983374e" style="text-decoration:underline;" target="_blank">Click here to view</a></td></tr></table>',
    },
  ],
  'message-and-text': [
    {
      message: "You have missed few fields in the earlier let's fill it now.",
    },
    {
      message:
        'Could you please provide the value for the Campaign Description field?',
      field: {
        name: 'campaign_description',
        label: 'Campaign Description',
        options: null,
        type: 'text',
      },
    },
    {
      message: "You have missed few fields in the earlier let's fill it now.",
    },
    {
      message: "You have missed few fields in the earlier let's fill it now.",
    },
  ],
  number: [
    {
      message: 'Welcome to Dzent! How can I assist you today?',
      field: {
        type: 'number',
        label: 'Campaign Number',
        name: 'campaignNumber',
      },
    },
  ],
  'text-and-number': [
    {
      message: 'Welcome to Dzent! How can I assist you today text?',
      field: {
        type: 'text',
        label: 'Campaign Name',
        name: 'campaignName',
      },
    },
    {
      message: 'Welcome to Dzent! How can I assist you today number?',
      field: {
        type: 'number',
        label: 'Campaign Number',
        name: 'campaignNumber',
      },
    },
  ],
  actions: [
    {
      message: 'Welcome to Dzent! How can I assist you today?',
      field: {
        type: 'actions',
        label: 'Select an action',
        name: 'campaignActions',
        options: [
          {
            label: 'Option 1',
            value: 'option1',
            tooltip: `
              <p>Welcome to the <b>Campaign Setup</b>! 🚀</p>
              <ul>
                <li>✅ <b>Step 1:</b> Enter your <b>campaign name</b> in the field below.</li>
                <li>📅 <b>Step 2:</b> Select the <b>start</b> and <b>end dates</b> for your campaign.</li>
                <li>📎 <b>Step 3:</b> Attach any relevant files or documents.</li>
                <li>💡 <b>Tip:</b> Fields marked with <b>*</b> are required.</li>
              </ul>
              <p>Need help? <b>Contact support</b> anytime! 😊</p>
            `,
          },
          { label: 'Option 2', value: 'option2' },
          { label: 'Option 3', value: 'option3' },
          {
            label: 'Download Report',
            isDownloadAction: true,
            value: '35d46f06-4cb2-4cee-a1c9-bd06dc7c7d44',
          },
        ],
      },
    },
  ],
  'all-picklists': [
    {
      message: 'Welcome to Dzent! How can I assist you today?',
      field: {
        type: 'single-picklist',
        label: 'Select an option',
        name: 'campaignNameSinglePicklist',
        options: [
          {
            label: 'Option 1 some longerrr labels extra long labels',
            value: 'option1',
          },
          {
            label: 'Option 1 some longerrr labels extra long labels 2',
            value: 'option2',
          },
          {
            label: 'Option 1 some longerrr labels extra long labels 3',
            value: 'option3',
          },
        ],
        config: {
          searchable: false,
          multiple: false,
          customRangeOptions: false,
        },
      },
    },
    {
      message: 'Welcome to Dzent! How can I assist you today?',
      field: {
        type: 'multi-picklist',
        label: 'Select options',
        name: 'campaignNameMultiPicklist',
        options: [
          {
            label:
              'all-picklists all-picklists all-picklists all-picklists all-picklists 1',
            value: 'option1',
          },
          { label: 'Option 2', value: 'option2' },
          { label: 'Option 3', value: 'option3' },
        ],
        config: {
          searchable: true,
          multiple: true,
          customRangeOptions: false,
        },
      },
    },
    {
      message: 'Welcome to Dzent! How can I assist you today?',
      field: {
        type: 'custom-range-options-picklist',
        label: 'Select options',
        name: 'customPicklist',
        options: [
          {
            label: 'Welcome to Dzent! How can I assist you today?  1',
            value: 'option1',
          },
          {
            label: 'Welcome to Dzent! How can I assist you today? ksdjhfksd 2',
            value: 'option2',
          },
          { label: 'Option 3', value: 'option3' },
        ],
        config: {
          searchable: true,
          multiple: true,
          customRangeOptions: true,
        },
      },
    },
  ],
  'single-picklist': [
    {
      message: 'Welcome to Dzent! How can I assist you today?',
      field: {
        type: 'single-picklist',
        label: 'Select an option',
        name: 'campaignNameSinglePicklist',
        options: [
          {
            label: 'Option 1 some longerrr labels extra long labels',
            value: 'option1',
          },
          {
            label: 'Option 1 some longerrr labels extra long labels 2',
            value: 'option2',
          },
          {
            label: 'Option 1 some longerrr labels extra long labels 3',
            value: 'option3',
          },
        ],
        config: {
          searchable: false,
          multiple: false,
          customRangeOptions: false,
        },
      },
    },
  ],
  'multi-picklist': [
    {
      message: 'Welcome to Dzent! How can I assist you today?',
      field: {
        type: 'multi-picklist',
        label: 'Select options',
        name: 'campaignNameMultiPicklist',
        options: [
          { label: 'Option 1', value: 'option1' },
          { label: 'Option 2', value: 'option2' },
          { label: 'Option 3', value: 'option3' },
        ],
        config: {
          searchable: true,
          multiple: true,
          customRangeOptions: false,
        },
      },
    },
  ],
  'custom-range-options-picklist': [
    {
      message: 'Welcome to Dzent! How can I assist you today?',
      field: {
        type: 'custom-range-options-picklist',
        label: 'Select options',
        name: 'customPicklist',
        options: [
          {
            label: 'Welcome to Dzent! How can I assist you today?  1',
            value: 'option1',
          },
          {
            label: 'Welcome to Dzent! How can I assist you today? ksdjhfksd 2',
            value: 'option2',
          },
          { label: 'Option 3', value: 'option3' },
        ],
        config: {
          searchable: true,
          multiple: true,
          customRangeOptions: true,
        },
      },
    },
  ],
  radio: [
    {
      message: 'Welcome to Dzent! How can I assist you today?',
      field: {
        type: 'radio',
        label: 'Select an option',
        name: 'radio',
        options: [
          { label: 'Option 1', value: 'option1' },
          { label: 'Option 2', value: 'option2' },
          { label: 'Option 3', value: 'option3' },
        ],
      },
    },
  ],
  checkbox: [
    {
      message: 'Welcome to Dzent! How can I assist you today?',
      field: {
        type: 'checkbox',
        label: 'Select options',
        name: 'checkbox',
        options: [
          { label: 'Option 1', value: 'option1' },
          { label: 'Option 2', value: 'option2' },
          { label: 'Option 3', value: 'option3' },
        ],
      },
    },
  ],
  date: [
    {
      message: 'Welcome to Dzent! How can I assist you today?',
      field: {
        type: 'date',
        label: 'Select date',
        name: 'date',
        validations: {
          minDate: '2023-01-01',
          maxDate: '2025-12-31',
        },
      },
    },
  ],
  'date-range': [
    {
      message: 'Welcome to Dzent! How can I assist you today?',
      field: {
        type: 'date-range',
        name: 'dateRange',
        label: 'Select date range',
        validations: {
          minDate: '2023-01-01',
          maxDate: '2025-12-31',
        },
      },
    },
  ],
  'file-upload': [
    {
      message: 'Welcome to Dzent! How can I assist you today?',
      field: {
        type: 'single-file-upload',
        label: 'Upload a fie',
        name: 'fileUpload',
        config: {
          accept: '.csv, .jpg, .png, .pdf',
          maxFileSize: '2MB',
        },
      },
    },
  ],
  'multi-file-upload': [
    {
      message: 'Welcome to Dzent! How can I assist you today?',
      field: {
        type: 'multi-file-upload',
        label: 'Assets',
        name: 'filesUpload',
        config: {
          accept: '.jpg, .png, .pdf, .csv',
          maxFileSize: '2MB',
        },
      },
    },
  ],
  'custom-questions': [
    {
      message: 'Welcome to Dzent! How can I assist you today?',
      field: {
        type: 'custom-questions',
        label: 'Custom Question',
        name: 'customQuestions',
        validation: {
          maxCount: 10,
        },
      },
    },
  ],
  'custom-fields': [
    {
      message: 'Welcome to Dzent! Please fill in the custom fields below.',
      field: {
        type: 'custom-fields',
        label: 'Custom Fields',
        name: 'customFields',
        validation: {
          maxCount: 10,
        },
      },
    },
  ],
  'new-chat': [
    {
      message:
        'Welcome to Dzent! How can I assist you today? Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    {
      message:
        'Second Welcome to Dzent! How can I assist you today? Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
  ],
};
