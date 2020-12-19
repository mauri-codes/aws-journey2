const cultured = "hsl(100, 10%, 94%)"
const xiketic = "hsl(242, 94%, 7%)"
const vermillon = "hsl(13, 60%, 47%)"

const deepChampagne = "hsl(32, 92%, 81%)"
const blackCoffee = "hsl(320, 17%, 17%)"
const laurenGreen = "hsl(90, 18%, 64%)"
const crayola = "hsl(229, 100%, 92%)"

const rouseTaupe = "hsl(10, 23%, 45%)"
const cadet = "hsl(198, 21%, 39%)"

const copper = "hsl(28, 41%, 51%)"

const mainColor = "hsl(203, 12%, 27%)"


const burgundy = "hsl(348, 92%, 28%)"

const DefaultTheme = {
   fonts: {
      body: 'system-ui, sans-serif',
      heading: '"Avenir Next", sans-serif',
      monospace: 'Menlo, monospace',
   },
   colors: {
      background: cultured,
      primary: mainColor,
      accent: copper,
      error: burgundy,
      text: '#000'
   },
   forms: {
    input: {
      borderColor: 'gray',
         '&:focus': {
         borderColor: 'primary',
         boxShadow: t => `0 0 0 2px ${t.colors.primary}`,
         outline: 'none',
         },
      },
   }
}

export { DefaultTheme }
