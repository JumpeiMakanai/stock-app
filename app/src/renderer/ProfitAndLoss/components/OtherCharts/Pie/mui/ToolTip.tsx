import { Paper, Stack, Typography } from '@mui/material'
import NoSsr from '@mui/material/NoSsr'
import Popper from '@mui/material/Popper'
import { useItemTooltip, useMouseTracker } from '@mui/x-charts/ChartsTooltip'
import { generateVirtualElement } from '@mui/x-charts/ChartsTooltip/utils'
import { useDrawingArea, useSvgRef } from '@mui/x-charts/hooks'
import * as React from 'react'

export function ItemTooltipFixedY() {
  const tooltipData = useItemTooltip()
  const mousePosition = useMouseTracker()
  const svgRef = useSvgRef() // Get the ref of the <svg/> component.
  const drawingArea = useDrawingArea() // Get the dimensions of the chart inside the <svg/>.

  if (!tooltipData || !mousePosition) {
    // No data to display
    return null
  }
  console.log(svgRef.current.getBoundingClientRect().top, drawingArea.top)
  const tooltipPosition = {
    ...mousePosition,
    // Add the y-coordinate of the <svg/> to the to margin between the <svg/> and the drawing area
    y: svgRef.current.getBoundingClientRect().top + drawingArea.top + 30,
  }

  return (
    <NoSsr>
      <Popper
        sx={{
          pointerEvents: 'none',
          zIndex: (theme) => theme.zIndex.modal,
        }}
        open
        placement="top"
        anchorEl={generateVirtualElement(tooltipPosition)}
      >
        <Paper
          elevation={0}
          sx={{
            m: 1,
            p: '1px 10px',
            borderWidth: 0,
            borderColor: 'divider',
          }}
        >
          <Stack direction="row" alignItems="center">
            <div
              style={{
                width: 11,
                height: 11,
                borderRadius: '50%',
                backgroundColor: tooltipData.color,
              }}
            />
            <Typography sx={{ ml: 2 }} fontWeight="light">
              {tooltipData.label}
            </Typography>
            <Typography sx={{ ml: 2 }}>{tooltipData.formattedValue}</Typography>
          </Stack>
        </Paper>
      </Popper>
    </NoSsr>
  )
}
