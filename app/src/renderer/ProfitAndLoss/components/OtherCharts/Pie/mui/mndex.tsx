import { LegendRendererProps } from '@mui/x-charts'
import { PieChart } from '@mui/x-charts/PieChart'
import * as React from 'react'

import { ItemTooltipFixedY } from './ToolTip'

export const StyledPie = ({
  data,
  suffix,
}: {
  data: {
    label: string
    value: number
    color: string
  }[]
  suffix?: string
}) => {
  suffix = suffix ? suffix : ''
  return (
    <div style={{ height: 200, width: 'fit-content' }}>
      <PieChart
        series={[
          {
            arcLabelMinAngle: 35,
            arcLabelRadius: '70%',
            color: 'white',
            data,
            valueFormatter: (item: { value: number }) =>
              `${item.value}${suffix}`,
          },
        ]}
        slotProps={{
          legend,
          popper: {
            hidden: true,
          },
        }}
        sx={{ '& .MuiPieArc-root': { stroke: 'transparent' } }}
        {...size}
      >
        <ItemTooltipFixedY />
      </PieChart>
    </div>
  )
}

const size = {
  width: 260,
  height: 200,
  stroke: 0,
}

const legend: Partial<LegendRendererProps> = {
  itemGap: 7,
  itemMarkHeight: 7,
  itemMarkWidth: 7,
  labelStyle: { fontSize: '12px', fill: 'white' },
}
