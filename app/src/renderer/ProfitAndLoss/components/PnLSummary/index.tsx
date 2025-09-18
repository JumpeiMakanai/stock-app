import styled from '@emotion/styled'

export const PnLSummary = ({
  totalPnL,
  totalPnLPlus,
  totalPnLMinus,
  periodPnL,
  periodPnLPlus,
  periodPnLMinus,
}: {
  totalPnL: number
  totalPnLPlus: number
  totalPnLMinus: number
  periodPnL: number
  periodPnLPlus: number
  periodPnLMinus: number
}) => {
  return (
    <>
      {' '}
      <StyledSummary className="no-wrap other-size-height">
        <h3>総合損益</h3>
        <div className="total">{totalPnL}円</div>
        <div className="pieces">{totalPnLPlus}円</div>
        <div className="pieces">{totalPnLMinus}円</div>
        <h3>期間損益</h3>
        <div className="total">{periodPnL}円</div>
        <div className="pieces">{periodPnLPlus}円</div>
        <div className="pieces">{periodPnLMinus}円</div>
      </StyledSummary>
    </>
  )
}

export const StyledSummary = styled.div`
  padding: 0 20px;
  color: #eef;
  background-color: #202040;

  & h3 {
    margin: 5% 0;
    padding: 3px 10px;
    font-size: 10px;
    font-weight: 500;
    color: #ccf;
    border-bottom: 1px solid #ccf;
    margin-right: auto;
  }

  & div {
    width: fit-content;
    margin-left: auto;
    margin-right: 5px;
  }
  & .total {
    padding: 1px 0 5px;
    font-size: 11px;
    font-weight: 600;
  }
  & .pieces {
    font-size: 10px;
    font-weight: 300;
  }
`
