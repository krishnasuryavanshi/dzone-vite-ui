
import { DzBox } from '@/components/layout/v1';
import { Flex } from '@/uicomponents/layout';
import React, {FC} from 'react';

interface ILineItemsFilesContainerProps {
    show: boolean;
}

export const LineItemsFilesContainer : FC<ILineItemsFilesContainerProps> = ({show}) => {
    if(!show){
        return null;
    }
    return(
        <Flex vertical gap="0.75rem">
            <DzBox dzOneBox>
            <div style={{height: '40vh', width: '100%'}}></div>
            </DzBox>
        </Flex>
    )
}