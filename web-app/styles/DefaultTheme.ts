import { createMuiTheme } from '@material-ui/core/styles';

const PrimaryColor = "hsl(31, 79%, 49%)"
const PrimaryColorLight = "hsl(31, 87%, 80%)"
const PrimaryColorDark = "hsl(31, 87%, 43%)"
const SecondaryColor = "hsl(217, 34%, 40%)"
const SecondaryColorLight = "hsl(217, 34%, 85%)"
const SecondaryColorDark = "hsl(217, 34%, 34%)"
const ComplementaryColor = "hsl(24, 37%, 75%)"
const ErrorColor = "hsl(0, 61%, 50%)"
const SuccessColor = "hsl(121, 70%, 31%)"

const almostWhite = "hsl(0, 0%, 95%)"
const paradisePink = "hsl(354, 73%, 59%)"

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
      background: almostWhite,
      backgroundBrighter: "hsl(37, 40%, 95%)",
      primary: PrimaryColor,
      primaryBright: PrimaryColorLight,
      accent: SecondaryColor,
      accentBright: SecondaryColorLight,
      accentDark: SecondaryColorDark,
      error: ErrorColor ,
      text: '#000'
   },
   header: {
      hover: {
         "&:hover": {
            color: PrimaryColor
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

const materialTheme = createMuiTheme({
   palette: {
      primary: {
         light: PrimaryColorLight,
         main: PrimaryColor,
         dark: PrimaryColorDark,
         contrastText: '#fff',
      },
      secondary: {
         light: SecondaryColorLight,
         main: SecondaryColor,
         dark: SecondaryColorDark,
         contrastText: '#fff',
      },
      error: {
         main: ErrorColor
      },
      success: {
         main: SuccessColor
      },
      background: {
         paper: almostWhite
      }
   },
   
   typography: {
      button: {

      }
   }
 });

export { DefaultTheme, materialTheme, ErrorColor, SecondaryColor }
