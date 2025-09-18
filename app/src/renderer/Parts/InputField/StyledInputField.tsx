import styled from '@emotion/styled'

export const StyledInputField = styled.input`
  color: white;
  background-color: #3f3f7e;
  font-size: 13;
  width: 120px;
  height: 19px;
  padding: 2px 2px;
  margin: 0 3px;
  text-align: end;
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
