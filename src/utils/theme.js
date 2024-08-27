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
            primary: "#ffffff",
            secondary: "#5f6368",
            opposite: "#000000",
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
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: "rgba(255, 255, 255, 0.6)", // Soft white color for placeholder text by default
                },
                shrink: {
                    color: "rgba(255, 255, 255, 0.8)", // Darker white when focused/shrunk
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                notchedOutline: {
                    borderColor: "rgba(255, 255, 255, 0.6)", // Soft white for outline by default
                },
                root: {
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(255, 255, 255, 0.8)", // Darker shade when hovered
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(255, 255, 255, 0.8)", // Darker shade when focused
                    },
                },
                input: {
                    color: "#FFFFFF", // Pure white text inside the input
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                select: {
                    backgroundColor: "transparent", // Ensure the background is consistent with the text field
                    color: "#FFFFFF", // White text inside the select field
                },
                icon: {
                    color: "rgba(255, 255, 255, 0.6)", // Soft white color for the dropdown arrow icon
                    "&:hover": {
                        color: "rgba(255, 255, 255, 0.8)", // Darker white when hovered
                    },
                },
                outlined: {
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(255, 255, 255, 0.8)", // Darker shade when hovered
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(255, 255, 255, 0.8)", // Darker shade when focused
                    },
                },
            },
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    backgroundColor: "transparent",
                    color: "#FFFFFF", // White text for menu items
                    "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.1)", // Light white shade when hovered
                        color: "rgba(255, 255, 255, 0.8)", // Darker white text when hovered
                    },
                    "&.Mui-selected": {
                        backgroundColor: "rgba(255, 255, 255, 0.2)", // Slightly darker white when selected
                    },
                    "&.Mui-selected:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.3)", // Darker white when selected and hovered
                        color: "rgba(255, 255, 255, 0.8)", // Darker white text when selected and hovered
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
            primary: "#000000",
            secondary: "#b0bec5",
            opposite: "#ffffff",
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
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: "rgba(255, 255, 255, 0.6)", // Soft white color for placeholder text by default
                },
                shrink: {
                    color: "rgba(255, 255, 255, 0.8)", // Darker white when focused/shrunk
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                notchedOutline: {
                    borderColor: "rgba(255, 255, 255, 0.6)", // Soft white for outline by default
                },
                root: {
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(255, 255, 255, 0.8)", // Darker shade when hovered
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(255, 255, 255, 0.8)", // Darker shade when focused
                    },
                },
                input: {
                    color: "#FFFFFF", // Pure white text inside the input
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                select: {
                    backgroundColor: "transparent", // Ensure the background is consistent with the text field
                    color: "#FFFFFF", // White text inside the select field
                },
                icon: {
                    color: "rgba(255, 255, 255, 0.6)", // Soft white color for the dropdown arrow icon
                    "&:hover": {
                        color: "rgba(255, 255, 255, 0.8)", // Darker white when hovered
                    },
                },
                outlined: {
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(255, 255, 255, 0.8)", // Darker shade when hovered
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(255, 255, 255, 0.8)", // Darker shade when focused
                    },
                },
            },
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    backgroundColor: "transparent",
                    color: "#FFFFFF", // White text for menu items
                    "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.1)", // Light white shade when hovered
                        color: "rgba(255, 255, 255, 0.8)", // Darker white text when hovered
                    },
                    "&.Mui-selected": {
                        backgroundColor: "rgba(255, 255, 255, 0.2)", // Slightly darker white when selected
                    },
                    "&.Mui-selected:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.3)", // Darker white when selected and hovered
                        color: "rgba(255, 255, 255, 0.8)", // Darker white text when selected and hovered
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