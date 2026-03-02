import { MenuCollapsedIcon, MenuExpandedIcon } from '@/uicomponents/icons/svgs';
import React, { FC } from 'react'

interface ITriggerProps {
    onClick: () => void,
    collapsed: boolean
}

export const Trigger: FC<ITriggerProps> = ({onClick, collapsed}) => {
  const Icon = collapsed ? MenuCollapsedIcon : MenuExpandedIcon;
  return (
    <span onClick={onClick} style={{cursor: 'pointer', paddingTop: '0.5rem'}}>
      <Icon />
    </span>
  )
}