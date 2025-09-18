import styled from '@emotion/styled'

export const StyledInputSelect = styled.select`
  color: white;
  background-color: #3f3f7e;
  font-size: 11px;
  width: 90px;
  height: 23px;
  padding: 2px 2px;
  margin: 0 3px;
  text-align: center;
  border-radius: 0;
  border: 0;
  outline: 0;

  &:focus {
    outline: 2px #1976d2 solid;
    heigth: 18px;
  }
  &::selection {
    color: #224;
    background: #ccf;
  }
`
