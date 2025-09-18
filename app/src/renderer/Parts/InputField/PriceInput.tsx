import React, { useEffect, useState } from 'react'

import { priceFormatter } from '../../hooks/priceFormatter'

import type { NumberInputProps } from './InputFieldProps'
import { StyledInputField } from './StyledInputField'

export const PriceInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (props, ref) => {
    const { value = 0, onChange, onBlur, min, max, style } = props
    // caretの位置
    let caretPos = 0
    // デリーで消されたかどうか
    let isDeleteKey = false

    // 最大最小の確認
    // 範囲外であれば強制的に範囲内の値にする
    const getCheckedMinMaxValue = (targetValue: number) => {
      if (min !== undefined && targetValue < min) return min
      if (max !== undefined && targetValue > max) return max
      return targetValue
    }

    const [thisValue, setThisValue] = useState(
      priceFormatter(getCheckedMinMaxValue(value))
    )

    // `value`が変更されたときに`thisValue`を更新
    useEffect(() => {
      console.log('in priceinput')
      setThisValue(priceFormatter(getCheckedMinMaxValue(value)))
    }, [value])

    // カンマを消去
    const deleteComma = (str: string) => {
      return str.replace(/,/g, '')
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement, Element>) => {
      const parsedValue = Number(deleteComma(thisValue))
      // 数値でなければ0を設定
      const checkedValue = getCheckedMinMaxValue(
        isNaN(parsedValue) ? 0 : parsedValue
      )
      setThisValue(priceFormatter(checkedValue))
      e.currentTarget.value = checkedValue.toString()
      onBlur?.(checkedValue)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newStrValue = e.target.value
      const newNomValue = Number(deleteComma(newStrValue))

      if (/^[-.]$/.test(newStrValue)) return setThisValue(newStrValue)
      // 数字でなければ元の値を返す
      else if (isNaN(newNomValue)) return

      const [integer, decimal] = deleteComma(newStrValue).split('.')

      // 整数部はカンマ区切り
      // 空文字またはハイフンのみの場合は、そのまま入れる
      let formattedNewStrValue = /^-?$/g.test(integer)
        ? integer
        : priceFormatter(Number(integer))

      // ドットがあれば小数を加える
      if (typeof decimal === 'string') formattedNewStrValue += `.${decimal}`

      // caret position get
      // フォーマットでカンマが入るとcaretの位置がずれるので
      // ここで調整する
      if (e.target.selectionStart) {
        // caretの現在位置
        caretPos = e.target.selectionStart

        // caretの現在位置より先に
        // 数値に使用される文字数を取得
        const pattern = /[0-9.-]/g
        const matches = newStrValue.slice(0, caretPos).match(pattern)
        let numLength = matches ? matches.length : 0
        // フォーマット(カンマ挿入)後
        // caretよりも先にあるカンマも含めて位置を調整
        let countPos = 0
        for (let i = 0; i < formattedNewStrValue.length; i++) {
          if (numLength <= 0) break

          if (formattedNewStrValue[i].match(pattern)) numLength -= 1

          countPos++
        }

        // deleteへの対応
        // カンマは無敵状態としてcaretを移動させるだけにする
        const preCommaNum = thisValue.match(/,/g)?.length || 0
        const newCommaNum = newStrValue.match(/,/g)?.length || 0
        if (isDeleteKey) countPos += preCommaNum > newCommaNum ? 1 : 0

        caretPos = countPos
      }

      // textfield update
      setThisValue(formattedNewStrValue)

      e.target.value = newNomValue.toString()
      onChange?.(newNomValue)

      // caret position change
      // caretの位置を変える動作が若干ちらつくので
      // 一瞬透明にする
      const orgColor = e.target.style.caretColor
      e.target.style.caretColor = 'transparent'

      // caret position set
      // 値更新の後に変更するためにtimeout使用
      setTimeout(() => {
        e.target.focus()
        e.target.setSelectionRange(caretPos, caretPos)

        e.target.style.caretColor = orgColor
      }, 1)
    }

    return (
      <StyledInputField
        ref={ref}
        value={thisValue}
        style={style}
        onFocus={(e) => e.target.select()}
        onKeyDown={(e) => {
          isDeleteKey = e.key === 'Delete'
        }}
        onChange={handleChange}
        onBlur={handleBlur}
      />
    )
  }
)
