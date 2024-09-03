import { createTheme } from "@mui/material/styles";

// Define common typography settings if needed
const typography = {
    fontFamily: "Helvetica Neue, Arial, sans-serif",
    // Optional: Customize the typography
};

const lightTheme = createTheme({
    palette: {
        mode: "light", // This is the default for MUI, but it's good to be explicit
        primary: {
            main: "#F7CA57", // Yellow-gold color
        },
        secondary: {
            main: "#F7A35C", // Lighter orange from the Rail
        },
        background: {
            default: "#FFFFFF", // Light paper-like color
        },
        text: {
            primary: "#000000", // Black text
        },
    },
    typography,
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: "#F8FFF3",
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: "8px",
                    textTransform: "none",
                    borderColor: "#000000", // Black border for buttons
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderColor: "#000000", // Black outlines for inputs
                },
            },
        },
    },
});

const darkTheme = createTheme({
    palette: {
        mode: "dark", // Switch to dark mode
        primary: {
            main: "#F7A35C", // Lighter orange from the Rail (Swapped)
            hover: "#F7CA57", // Yellow-gold color
        },
        secondary: {
            main: "#F7A35C", // Yellow-gold color (Swapped)
        },
        background: {
            default: "#333333", // Charcoal-like color for dark mode
        },
        text: {
            primary: "#FFFFFF", // White text
        },
    },
    typography,
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: "#333333", // Charcoal-like background for papers
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: "8px",
                    textTransform: "none",
                    borderColor: "#FFFFFF", // White border for buttons
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
