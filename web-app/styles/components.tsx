/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import styled from "@emotion/styled"


function Button({
    bkgColor="accent",
    horPad="2em",
    verPad="1em",
    children
 }) {
   const ButtonSt = styled.div`
      padding: ${verPad} ${horPad};
      &:hover {
         filter: brightness(90%);
      }
      cursor: pointer;
      + * {
         margin-left: 1rem;
      }
   `
   return (
      <ButtonSt sx={{
         backgroundColor: bkgColor
      }}>{children}</ButtonSt>
   )
}

export { Button }
