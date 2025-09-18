import React, { useEffect, useState } from 'react'

import type { NumberInputProps } from './InputFieldProps'
import { StyledInputField } from './StyledInputField'

export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (props, ref) => {
    const { value = 0, onChange, onBlur, min, max, style } = props
    let caretPos = 0

    const getChackedMinMaxValue = (targetValue: number | '-') => {
      if (targetValue == '-') return 0
      if (min !== undefined && targetValue < min) return min
      if (max !== undefined && targetValue > max) return max
      return targetValue
    }

    const [thisValue, setThisValue] = useState<string>(
      getChackedMinMaxValue(value).toString()
    )

    useEffect(() => {
      console.log('in numberinput')
      setThisValue(getChackedMinMaxValue(value).toString())
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newStrValue = e.target.value
      const newNomValue = Number(newStrValue)

      if (/^[-.]$/.test(newStrValue)) return setThisValue(newStrValue)
      // 数字以外の場合は元の値を返す
      else if (isNaN(newNomValue)) return

      // // caret position get
      if (e.target.selectionStart) {
        caretPos = e.target.selectionStart
      }

      // textfield update
      setThisValue(newStrValue)

      onChange?.(newNomValue)

      // caret position change
      const orgColor = e.target.style.caretColor
      e.target.style.caretColor = 'transparent'

      // caret position set
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
        onBlur={() => {
          const numberValue = Number(thisValue)
          const checkedValue = getChackedMinMaxValue(
            isNaN(numberValue) ? 0 : numberValue
          )
          setThisValue(checkedValue.toString())
          onBlur?.(checkedValue)
        }}
        onChange={handleChange}
      />
    )
  }
)
