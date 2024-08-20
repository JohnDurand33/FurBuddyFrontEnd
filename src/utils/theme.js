import { createTheme } from "@mui/material/styles";
export const lightTheme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#6200ea",
        },
        secondary: {
            main: "#03dac6",
        },
        tertiary: {
            main: "#ff5722",
        },
        background: {
            default: "#f5f5f5",
            paper: "#ffffff",
        },
        text: {
            primary: "#000000",
            secondary: "#5f6368",
        },
    },
    typography: {
        fontFamily: "Roboto, Arial, sans-serif",
        h1: {
            fontSize: "2.5rem",
            fontWeight: 700,
            color: "#6200ea",
        },
        body1: {
            fontSize: "1rem",
            color: "#5f6368",
        },
    },
    components:{
    },
});

export const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#bb86fc",
        },
        secondary: {
            main: "#03dac6",
        },
        tertiary: {
            main: "#ff8a50",
        },
        background: {
            default: "#121212",
            paper: "#1e1e1e",
        },
        text: {
            primary: "#ffffff",
            secondary: "#b0bec5",
        },
    },
    typography: {
        fontFamily: "Roboto, Arial, sans-serif",
        h1: {
            fontSize: "2.5rem",
            fontWeight: 700,
            color: "#bb86fc",
        },
        body1: {
            fontSize: "1rem",
            color: "#b0bec5",
        },
    },
    components: {
    },
});