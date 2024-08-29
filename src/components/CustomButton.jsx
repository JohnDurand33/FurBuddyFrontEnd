import { Button } from "@mui/material";

import React from 'react'

const CustomButton = ({ isDark, children, ...props }) => {
    return (
        <Button
            {...props}
            sx={{
                color: isDark ? "text.primary" : "text.opposite",
}}>
            {children}
        </Button>
    );
}

export default CustomButton

