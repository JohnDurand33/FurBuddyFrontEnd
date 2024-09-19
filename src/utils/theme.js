import { createTheme } from "@mui/material/styles";

// Define common typography settings if needed
const typography = {
    fontFamily: "Helvetica Neue, Arial, sans-serif",
    
};

const lightTheme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#FFFAE7", 
        },
        secondary: {
            main: "#F7CA57", 
        },
        background: {
            default: "#FFFFFF", 
        },
        text: {
            primary: "#000000",
        },
    },
    typography,
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    backgroundColor: "secondary.main",
                    borderRadius: "3px",
                    textTransform: "none",
                    borderColor: "#000000", 
                    boxShadow: "none", 
                    cursor: "default",
                    "&:hover": {
                        backgroundColor: "secondary.main", 
                        boxShadow: "none !important",
                        cursor: "default", 
                    },
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderColor: "#000000",
                },
            },
        },
    },
});

const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#ffa500",
        },
        secondary: {
            main: "#F7CA57",
        },
        background: {
            default: "#333333",
        },
        text: {
            primary: "#FFFFFF",
        },
    },
    typography,
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: "#333333",
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    backgroundColor: "secondary.main",
                    borderRadius: "3px",
                    textTransform: "none",
                    borderColor: "#FFFFFF",
                    boxShadow: "none",
                    cursor: "default",
                    "&:hover": {
                        backgroundColor: "secondary.main",
                        boxShadow: "none",
                        cursor: "default",
                    },
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderColor: "#FFFFFF", // White outlines for inputs
                },
            },
        },
    },
});

export { lightTheme, darkTheme };
