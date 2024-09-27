import { createTheme } from "@mui/material/styles";

// Define common typography settings if needed
const typography = {
    fontFamily: "Arial, Roboto, sans-serif",
    
};

const lightTheme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#FFFAE7",
        },
        secondary: {
            main: "#FFC636",
        },
        button: {
            main: "#FFCA00",
            paper: "#ddd"
        },
        background: {
            default: "#FFFFFF",
        },
        text: {
            primary: "#000000",
        },
    },
});

const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#ffA500",
        },
        secondary: {
            main: "#FFC636",
        },
        button: {
            main: "#FFCA00",
            paper: "#ddd",
        },
        background: {
            default: "#333333",
        },
        text: {
            primary: "#FFFFFF",
        },
    },
});

export { lightTheme, darkTheme };
