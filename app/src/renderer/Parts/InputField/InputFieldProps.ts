export type NumberInputProps = {
  value?: number
  onChange?: (value: number) => void
  onBlur?: (value: number) => void
  min?: number
  max?: number
  style?: React.CSSProperties
}
