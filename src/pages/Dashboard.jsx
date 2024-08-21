import Navbar from '../components/NavBar'

const HomePage = ({ leftContent, middleContent, rightContent }) => {
    const hasLeftContent = !!leftContent;
    const hasRightContent = !!rightContent;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <Navbar />
            {/* To account for the Navbar height */}
            <Box sx={{ mt: 8, flexGrow: 1 }}>
                <Grid container>
                    {hasLeftContent && (
                        <Grid item xs={12} md={3}>
                            <Box sx={{ p: 2 }}>
                                {leftContent}
                            </Box>
                        </Grid>
                    )}
                    <Grid item xs={12} md={hasLeftContent && hasRightContent ? 6 : hasLeftContent || hasRightContent ? 9 : 12}>
                        <Box sx={{ p: 2 }}>
                            {middleContent}
                        </Box>
                    </Grid>
                    {hasRightContent && (
                        <Grid item xs={12} md={3}>
                            <Box sx={{ p: 2 }}>
                                {rightContent}
                            </Box>
                        </Grid>
                    )}
                </Grid>
            </Box>
        </Box>
    );
};

export default HomePage