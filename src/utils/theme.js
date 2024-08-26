import { createTheme } from "@mui/material/styles";

// Define your themes
export const lightTheme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#FFCA00",
        },
        secondary: {
            main: "#373848",
        },
        background: {
            default: "#f5f5f5",
            paper: "#ffffff",
        },
        text: {
            primary: "#000000",
            secondary: "#5f6368",
            opposite: "#ffffff",
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
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    "& .MuiInputBase-input": {
                        color: "#ffffff", // Typed text color for dark mode
                    },
                    "& .MuiInputLabel-root": {
                        color: "rgba(255, 255, 255, 0.6)", // Placeholder text color (lighter for dark mode)
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                        color: "rgba(255, 255, 255, 0.8)", // Placeholder text color when focused
                    },
                    "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                            borderColor: "#b0bec5",
                        },
                        "&:hover fieldset": {
                            borderColor: "#b0bec5",
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: "#b0bec5",
                        },
                    },
                },
            },
        },
    },
});

export const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#FFCA00",
        },
        secondary: {
            main: "#373848",
        },
        background: {
            default: "#121212",
            paper: "#1e1e1e",
        },
        text: {
            primary: "#ffffff",
            secondary: "#b0bec5",
            opposite: "#000000",
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
        MuiTextField: {
            styleOverrides: {
                root: {
                    "& .MuiInputBase-input": {
                        color: "#ffffff", // Typed text color for dark mode
                    },
                    "& .MuiInputLabel-root": {
                        color: "rgba(255, 255, 255, 0.6)", // Placeholder text color (lighter for dark mode)
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                        color: "rgba(255, 255, 255, 0.8)", // Placeholder text color when focused
                    },
                    "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                            borderColor: "#b0bec5",
                        },
                        "&:hover fieldset": {
                            borderColor: "#b0bec5",
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: "#b0bec5",
                        },
                    },
                },
            },
        },
    },
});

// Define the applyTheme function
export function applyTheme(theme) {
    // Set CSS variables dynamically based on the current theme
    const root = document.documentElement;
    root.style.setProperty('--background-default', theme.palette.background.default);
    root.style.setProperty('--background-paper', theme.palette.background.paper);
    root.style.setProperty('--text-primary', theme.palette.text.primary);
    root.style.setProperty('--text-secondary', theme.palette.text.secondary);
}