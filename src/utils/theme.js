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
                        color: "#000000", // Typed text color for light mode
                    },
                    "& .MuiInputLabel-root": {
                        color: "rgba(0, 0, 0, 0.6)", // Placeholder text color (darker for light mode)
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                        color: "rgba(0, 0, 0, 0.8)", // Placeholder text color when focused
                    },
                    "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                            borderColor: "#5f6368",
                        },
                        "&:hover fieldset": {
                            borderColor: "#FFCA00",
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: "#FFCA00",
                        },
                    },
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                select: {
                    color: "#000000", // Input text color for dropdown
                    "&:focus": {
                        backgroundColor: "transparent", // Prevent background color change on focus
                    },
                },
                icon: {
                    color: "#000000", // Icon color for dropdown arrow
                },
                root: {
                    "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#5f6368", // Border color
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#FFCA00",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#FFCA00",
                    },
                },
            },
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    color: "#000000", // Menu item text color
                    "&.Mui-selected": {
                        backgroundColor: "rgba(255, 202, 0, 0.15)", // Selected item background color
                    },
                    "&.Mui-selected:hover": {
                        backgroundColor: "rgba(255, 202, 0, 0.25)", // Hover effect on selected item
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
                            borderColor: "#FFCA00",
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: "#FFCA00",
                        },
                    },
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                select: {
                    color: "#ffffff", // Input text color for dropdown
                    "&:focus": {
                        backgroundColor: "transparent", // Prevent background color change on focus
                    },
                },
                icon: {
                    color: "#ffffff", // Icon color for dropdown arrow
                },
                root: {
                    "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#b0bec5", // Border color
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#FFCA00",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#FFCA00",
                    },
                },
            },
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    color: "#ffffff", // Menu item text color for dark mode
                    "&.Mui-selected": {
                        backgroundColor: "rgba(255, 202, 0, 0.15)", // Selected item background color
                    },
                    "&.Mui-selected:hover": {
                        backgroundColor: "rgba(255, 202, 0, 0.25)", // Hover effect on selected item
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
    root.style.setProperty(
        "--background-default",
        theme.palette.background.default
    );
    root.style.setProperty(
        "--background-paper",
        theme.palette.background.paper
    );
    root.style.setProperty("--text-primary", theme.palette.text.primary);
    root.style.setProperty("--text-secondary", theme.palette.text.secondary);
}
