import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string/transform-path';
import { nextBackendRequest } from '@/services';
import { JobTitleTokenType } from '../lib/enums';

export const fetchLineItem = async (lineItemId?: string) => {
  try {
    const resource = transformPath(ApiResources.LineItemById, { lineItemId });
    const data = await nextBackendRequest({
      resource,
      apiHost: ApiHost.CampaignService,
    });
    if (data?.data) {
      data.data = {
        ...data.data,
        jobTitles: data.data?.jobTitles?.length
          ? data.data?.jobTitles.split(', ').map((jt: string) => ({
              text: jt,
              type: JobTitleTokenType.UserEntered,
            }))
          : null,
        campaignId: data.data.campaign.campaignId,
        // customFields: [
        //   {
        //     id: 'field1',
        //     fieldOrder: 1,
        //     name: 'phone',
        //     label: 'Phone',
        //     type: 'Phone',
        //     required: true,
        //     inclusion: '12312312312312',
        //     exclusion: '123123122133',
        //   },
        //   {
        //     id: 'field2',
        //     fieldOrder: 2,
        //     name: 'text',
        //     label: 'Text',
        //     type: 'Text',
        //     required: false,
        //     inclusion:
        //       'teshjdgsfd, wertwieur, asdnasdnasd, qweqweqwe, zxcxzccxz, lkjlkjlkj, poiupoiupoiu, mnbmnbmnb, asdasdasdasd,dgdfgdfg,zxczxczxc, qweqweqwe , lkjlkjlkj, poiupoiupoiu, mnbmnbmnb, asdasdasdasd,dgdfgdfg,zxczxczxc, qweqweqwe , lkjlkjlkj, poiupoiupoiu, mnbmnbmnb, asdasdasdasd,dgdfgdfg,zxczxczxc, qweqweqwe , lkjlkjlkj, poiupoiupoiu, mnbmnbmnb, asdasdasdasd,dgdfgdfg,zxczxczxc, qweqweqwe , lkjlkjlkj, poiupoiupoiu, mnbmnbmnb, asdasdasdasd,dgdfgdfg,zxczxczxc, qweqweqwe , lkjlkjlkj, poiupoiupoiu, mnbmnbmnb, asdasdasdasd,dgdfgdfg,zxczxczxc, qweqweqwe , lkjlkjlkj, poiupoiupoiu, mnbmnbmnb, asdasdasdasd,dgdfgdfg,zxczxczxc, qweqweqwe , lkjlkjlkj, poiupoiupoiu, mnbmnbmnb, asdasdasdasd,dgdfgdfg,zxczxczxc, qweqweqwe , lkjlkjlkj, poiupoiupoiu, mnbmnbmnb, asdasdasdasd, dgdfgdfg, zxczxczxc, qweqweqwe , lkjlkjlkj, poiupoiupoiu, mnbmnbmnb, asdasdasdasd,dgdfgdfg, zxczxczxc',
        //     exclusion: 'teshjdgsfd',
        //   },
        //   {
        //     id: 'field3',
        //     fieldOrder: 3,
        //     name: 'email',
        //     label: 'Email',
        //     type: 'Email',
        //     required: true,
        //     inclusion: 'asda@jhd.ch',
        //     exclusion: null,
        //   },
        //   {
        //     id: 'field4',
        //     fieldOrder: 4,
        //     name: 'url',
        //     label: 'URL',
        //     type: 'URL',
        //     required: false,
        //     inclusion: null,
        //     exclusion: 'http://sjkdh.dsjfk',
        //   },
        //   {
        //     id: 'field5',
        //     fieldOrder: 5,
        //     name: 'number',
        //     label: 'Number',
        //     type: 'Number',
        //     required: false,
        //     inclusion: '12635',
        //     exclusion: '123123',
        //   },
        //   {
        //     id: 'field6',
        //     fieldOrder: 6,
        //     name: 'date',
        //     label: 'Date',
        //     type: 'Date',
        //     format: 'DD/MM/YYYY',
        //     required: false,
        //     inclusion: '14/10/2025,27/10/2025',
        //     exclusion: '16/10/2025,27/10/2025,15/10/2025',
        //   },
        // ],
      };

      return data;
    }
  } catch (error) {}
};
