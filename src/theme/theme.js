import { createTheme } from '@mui/material/styles'

const commonTypography = {
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: '"Nunito", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
    fontSize: 15,
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
}

const getComponents = (mode) => ({
  MuiCssBaseline: {
    styleOverrides: {
      '*::-webkit-scrollbar': {
        width: '4px',
        height: '4px',
      },
      '*::-webkit-scrollbar-track': {
        background: 'transparent',
      },
      '*::-webkit-scrollbar-thumb': {
        backgroundColor: mode === 'dark' ? '#555555' : '#cccccc',
        borderRadius: '4px',
      },
      '*::-webkit-scrollbar-thumb:hover': {
        backgroundColor: mode === 'dark' ? '#777777' : '#aaaaaa',
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        backgroundColor: '#FF7A45', // Button Orange
        color: '#FFFFFF',
        '&:hover': {
          backgroundColor: '#F56B2F', // Hover Orange
        }
      },
      outlined: {
        backgroundColor: 'transparent',
        borderColor: '#FF8A55', // Orange Border
        color: '#FF5A14',
        '&:hover': {
          backgroundColor: mode === 'light' ? 'rgb(255, 237, 242)' : '#2A2A2A',
          borderColor: '#FF5A14',
        }
      },
      text: {
        backgroundColor: 'transparent',
        color: '#FF5A14',
        '&:hover': {
          backgroundColor: mode === 'light' ? 'rgb(255, 237, 242)' : '#2A2A2A',
        }
      }
    }
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiInputBase-root': {
          backgroundColor: mode === 'light' ? 'rgb(255, 237, 242)' : '#1E1E1E',
          color: mode === 'light' ? '#000000' : '#FFFFFF',
        },
        '& .MuiSelect-icon': {
          color: mode === 'light' ? '#000000' : '#FFFFFF',
        },
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: mode === 'light' ? '#D8D8D8' : '#333333',
          },
          '&:hover fieldset': {
            borderColor: '#FF8A55', // Orange Border
          },
          '&.Mui-focused fieldset': {
            borderColor: '#FF5A14', // Primary Orange
          },
        },
      },
    },
  },
  MuiInputBase: {
     styleOverrides: {
        root: {
           color: mode === 'light' ? '#000000' : '#FFFFFF',
        },
        input: {
           '&::placeholder': {
             color: '#B0B0B0', // Placeholder
             opacity: 1
           }
        }
     }
  }
})

export const lightTheme = createTheme({
  ...commonTypography,
  palette: {
    mode: 'light',
    primary: { main: '#FF5A14', light: '#FF7A45', dark: '#F56B2F' },
    secondary: { main: '#000000' },
    background: { default: '#FFFFFF', paper: '#FFFFFF' },
    text: { primary: '#000000', secondary: '#888888' },
    divider: '#D8D8D8',
    success: { main: '#16a34a' },
    warning: { main: '#d97706' },
    error: { main: '#dc2626' },
    info: { main: '#0284c7' },
  },
  components: getComponents('light')
})

export const darkTheme = createTheme({
  ...commonTypography,
  palette: {
    mode: 'dark',
    primary: { main: '#FF5A14', light: '#FF7A45', dark: '#F56B2F' },
    secondary: { main: '#FFFFFF' },
    background: { default: '#000000', paper: '#111111' }, 
    text: { primary: '#FFFFFF', secondary: '#888888' },
    divider: '#D8D8D8',
    success: { main: '#22c55e' },
    warning: { main: '#f59e0b' },
    error: { main: '#ef4444' },
    info: { main: '#38bdf8' },
  },
  components: getComponents('dark')
})

export const getTheme = (mode) => (mode === 'dark' ? darkTheme : lightTheme)
