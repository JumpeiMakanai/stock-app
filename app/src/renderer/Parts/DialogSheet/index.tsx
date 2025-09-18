import styled from '@emotion/styled'

type DialogProps = {
  children: any
  toggleShow: () => void
  dialogStyle?: React.CSSProperties
  backgroundStyle?: React.CSSProperties
}

export const DialogSheet = ({
  children,
  toggleShow,
  dialogStyle,
  backgroundStyle,
}: DialogProps) => {
  return (
    <>
      <BackSheet onClick={toggleShow} style={backgroundStyle} />
      <DialogSheetContent style={dialogStyle}>{children}</DialogSheetContent>
    </>
  )
}

const BackSheet = styled.div`
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  top: 0;
  left: 0;
  z-index: 999;
`

const DialogSheetContent = styled.div`
  position: fixed;
  height: 90%;
  width: 100%;
  background-color: #2d2b55;
  z-index: 9999;
  top: 5%;
  left: 0;
  pointer-events: auto;

  @media (min-width: 420px) {
    width: 90%;
    left: 5%;
  }
  @media (min-height: 420px) {
    height: 70%;
    top: 15%;
  }
`
