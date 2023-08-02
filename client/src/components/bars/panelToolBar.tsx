import { Box } from "@mui/material";

export default function PanelToolBar ({children} : {children : React.ReactNode}) {
    return (
        <Box sx={{
            alignItems: "center",
            borderBottom: 2,
            borderBottomColor: "grey.400",
            backgroundColor: "grey.50",
            height: 80,
            display:"flex",
            flexDirection:"row",
            justifyContent:"start"
        }}>
            {children}
        </Box>
    )
}