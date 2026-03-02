import { CardMetaProps } from 'antd/lib/card';
import { Card } from 'antd';
import React, { FC } from 'react'

const AntdCardMeta = Card.Meta;
export const CardMeta: FC<CardMetaProps> = (props) => {
  return (
    <AntdCardMeta {...props} />
  )
}