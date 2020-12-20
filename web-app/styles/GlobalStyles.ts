import { css } from "@emotion/core";
const GlobalStyles = css`
   * {
      box-sizing: border-box;
      margin: 0;
   }
   html,
   body {
      margin: 0;
      color: #555;
      font-size: 18px;
      /* line-height: 1.4; */
   }
   h1,
   h2,
   h3,
   h4,
   h5,
   h6 {
      color: #222;
      /* line-height: 1.1; */
   }
   li {
      margin-top: 0.3rem;
      margin-bottom: 0.3rem;
   }
   hr {
      border:  0.5px solid lightgray;
   }
`

export { GlobalStyles }
