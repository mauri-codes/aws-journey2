import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
   * {
      box-sizing: border-box;
      margin: 0;
   }
   * + * {
      margin-top: 1rem;
   }
   html,
   body {
      margin: 0;
      font-size: 16px;
      color: #555;
   }
   h1,
   h2,
   h3,
   h4,
   h5,
   h6 {
      color: #222;
      line-height: 1.1;
      + * {
         margin-top: 0.5rem;
      }
   }

   li {
      margin-top: 0.25rem;
   }
`

export default GlobalStyle