import { IconButton, iconButtonClasses, styled } from '@mui/material'

export const IconButtonNormal = styled(IconButton)(() => ({
  [`&.${iconButtonClasses.root}:hover`]: {
    color: '#ccf',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
}))
export const IconButtonCancel = styled(IconButton)(() => ({
  [`&.${iconButtonClasses.root}:hover`]: {
    backgroundColor: 'rgba(255, 100, 100, 0.2)',
  },
}))
export const IconButtonComplete = styled(IconButton)(() => ({
  [`&.${iconButtonClasses.root}:hover`]: {
    backgroundColor: 'rgba(100, 100, 255, 0.2)',
  },
}))
