import { Button } from '@mui/material'

import { csvReader } from './csvReader'
import './index.css'

export const CSVInmport = ({
  setResultMessage,
}: {
  setResultMessage: {
    (props: { result: 'fail'; trade?: TradeRecord | undefined }): void
    (props: { result: 'succeed'; recordNum: number }): void
  }
}) => {
  const readCSV = () => {
    window.electronAPI
      .fileRead()
      .then((result) => {
        console.log(result)
        const trades = csvReader(result)
        console.log(trades)
        window.crudAPI
          .insert(trades)
          .then(() =>
            setResultMessage({ result: 'succeed', recordNum: trades.length })
          )
          .catch((e) => {
            if (e.failId) {
              trades.forEach((trade) => {
                if (trade.id === e.failId)
                  setResultMessage({ result: 'fail', trade })
              })
            }
          })
      })
      .catch(() => setResultMessage({ result: 'fail' }))
  }

  return (
    <div>
      <Button
        sx={{
          height: '24px',
          margin: '5px',
          color: '#ccf',
          backgroundColor: 'rgba(150,150,220,0.3)',
          fontSize: '11px',
          fontWeight: 600,
          '&.MuiButtonBase-root:hover': {
            color: '#1E1E3F',
            backgroundColor: 'rgba(200,200,255,0.7)',
          },
        }}
        onClick={readCSV}
      >
        CSV
      </Button>
    </div>
  )
}
