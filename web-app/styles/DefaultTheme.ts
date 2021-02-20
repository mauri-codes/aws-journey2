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

// const burntSienna = "hsl(14, 69%, 58%)"
const almostWhite = "hsl(0, 0%, 95%)"
const paradisePink = "hsl(354, 73%, 59%)"
const paradisePinkBright = "hsl(354, 73%, 90%)"
const Isabelline = "hsl(40, 86%, 96%)"
const Linen = "hsl(37, 40%, 90%)"
const IsabellineBrighter = "hsl(40, 86%, 98%)"
const DeepSpaceSparkle = "hsl(187, 22, 32)"
const DarkPurple = "hsl(284, 100, 6)"

const DefaultTheme = {
   fonts: {
      body: 'palatino, sans-serif !important',
      bodyBold: 'palatinoBold, sans-serif !important',
      subTitle: 'Poppins, sans-serif',
      logo: 'ocr, monospace',
      title: 'Poppins, sans-serif',
      monospace: 'Menlo, monospace',
   },
   colors: {
      color2: "hsl(37, 40%, 93%)",
      background: almostWhite,
      backgroundBrighter: "hsl(37, 40%, 95%)",
      primary: paradisePink,
      primaryBright: paradisePinkBright,
      accent: DeepSpaceSparkle,
      error: burgundy,
      text: '#000'
   },
   header: {
      hover: {
         "&:hover": {
            "color": paradisePink
         }
      }
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
