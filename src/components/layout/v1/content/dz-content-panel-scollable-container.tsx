import React from 'react'
import { DzBox } from '../dz-box'

export const DzContentPanelScollableContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <DzBox className="dz-content-panel-scollable-container">{children}</DzBox>
  )
}