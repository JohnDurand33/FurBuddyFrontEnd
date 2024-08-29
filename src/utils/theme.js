import { createTheme } from "@mui/material/styles";

// Define your themes
export const lightTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#FFCA00",
        },
        secondary: {
            main: "#FFFFFF",
        },
        background: {
            default: "#121212",
            paper: "#1e1e1e",
        },
        text: {
            primary: "#000000 ",
            secondary: "#b0bec5",
            opposite: "#FFFFFF",
        },
    },
    typography: {
        fontFamily: "Helvetica Neue",
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
                    color: "#33333, 0.6", // Soft white color for placeholder text by default
                },
                shrink: {
                    color: "#33333, 0.6", // Darker white when focused/shrunk
                },
            },
        },
        MuiFormLabel: {
            styleOverrides: {
                root: {
                    color: "gray", // Default text color
                    "&.Mui-focused": {
                        color: "gray", // Text color when focused
                    },
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    backgroundColor: "#ffffff", // Set input background to white
                    color: "#000000", // Set input text color to black
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "gray", // Darker shade when hovered
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "gray", // Darker shade when focused
                    },
                },
                input: {
                    color: "#000000", // Text color inside the input
                    backgroundColor: "#ffffff", // Ensure the background is white
                },
                notchedOutline: {
                    borderColor: "gray", // Outline color
                },
            },
        },
        MuiList: {
            styleOverrides: {
                root: {
                    padding: "0",
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                select: {
                    backgroundColor: "background.default", // Ensure the background is consistent with the text field
                    color: "(#333333, 0.6)", // White text inside the select field
                },
                icon: {
                    color: "(#333333, 0.6)", // Soft white color for the dropdown arrow icon
                    "&:hover": {
                        color: "333333", // Darker white when hovered
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
            primary: "#ffffff ",
            secondary: "#b0bec5",
            opposite: "#000000",
        },
    },
    typography: {
        fontFamily: "Helvetica Neue",
        h1: {
            fontSize: "2.5rem",
            fontWeight: 700,
            color: "text.primary",
        },
        body1: {
            fontSize: "1rem",
            color: "text.primary",
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
                root: {
                    backgroundColor: "#ffffff", // Set input background to white
                    color: "#000000", // Set input text color to black
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(255, 255, 255, 0.8)", // Darker shade when hovered
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(255, 255, 255, 0.8)", // Darker shade when focused
                    },
                },
                input: {
                    color: "#ffffff", // Text color inside the input
                    backgroundColor: "#1e1e1e", // Set a consistent background for dark theme
                },
                notchedOutline: {
                    borderColor: "rgba(255, 255, 255, 0.6)", // Outline color
                },
            },
        },
        MuiInputBase: {
            styleOverrides: {
                root: {
                    backgroundColor: "#1e1e1e", // Consistent background for all input types
                    color: "#ffffff", // White text color
                },
            },
        },
        MuiFormLabel: {
            styleOverrides: {
                root: {
                    color: "gray", // Default text color
                    "&.Mui-focused": {
                        color: "gray", // Text color when focused
                    },
                },
            },
        },
        MuiList: {
            styleOverrides: {
                root: {
                    padding: "0",
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                select: {
                    backgroundColor: "background.default", // Ensure the background is consistent with the text field
                    color: "text.primary", // White text inside the select field
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