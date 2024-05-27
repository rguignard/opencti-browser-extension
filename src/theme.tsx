import {PaletteMode} from '@mui/material'

const getDesignTokens = (mode: PaletteMode) => ({
    palette: {
        mode,
        ...(mode === 'light'
            ? {
                // palette values for light mode
                secondary: { main: '#001bda' },
                info : {main: '#0c7e69'}
            }
            : {
                // palette values for dark mode
                secondary: { main: '#0fbcff' },
                info : {main: '#00f1bd'},
                background: {
                    default: '#09101e',
                    paper: '#070d19',
                }
            }),
    }
});


const getThemedComponents = (mode: PaletteMode) => ({
    components: {
        mode,
        ...(mode === 'light'
            ? {
                MuiAccordion: {
                    styleOverrides: {
                        root: {
                            boxShadow: "none",
                            border: "1px solid rgba(0, 0, 0, 0.12)"
                        }
                    }
                }
            }
            : {
                MuiAccordion: {
                    styleOverrides: {
                        root: {
                            boxShadow: "none",
                            border: "1px solid rgba(255, 255, 255, 0.12)"
                        }
                    }
                }
            }),
    },
});


export { getDesignTokens, getThemedComponents}
