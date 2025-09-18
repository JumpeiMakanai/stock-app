import { dialog } from 'electron'
import { readFileSync } from 'fs'

// https://github.com/adaltas/node-csv/issues/323
// eslint-disable-next-line import/no-unresolved
import { parse } from 'csv-parse/sync'
import * as Encoding from 'encoding-japanese'
import iconv from 'iconv-lite'

/**
 * csvファイルを読み込んで配列へパース
 *
 * @returns csvファイルデータの配列
 */
export const csvFileRead = async (): Promise<string[][]> => {
  const { canceled, filePaths } = await dialog.showOpenDialog({})
  if (!canceled) {
    const csvBuffer = readFileSync(filePaths[0])
    const codeType: string | boolean = Encoding.detect(csvBuffer)
    if (typeof codeType == 'string') {
      const utf8CsvData = iconv.decode(csvBuffer, codeType, {
        addBOM: false,
      })
      const csvArray = parse(iconv.encode(utf8CsvData, 'UTF8'), {
        relax_column_count: true,
      })

      if (typeof csvArray[0][0] == 'string') return csvArray

      throw new Error('Failed to convert to csv file!!')
    }
    throw new Error('Failed to convert to csv file!!')
  } else {
    throw new Error('File selection canceled!!')
  }
}
