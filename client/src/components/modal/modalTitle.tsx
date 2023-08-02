import { Box, Typography } from "@mui/material";


interface ModalTitleProps {
    title: string
}

export default function ModalTitle (props : ModalTitleProps) {
    return (
        <Box sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 2,
            backgroundColor: "grey.100",
            borderBottom: 1,
            borderBottomColor: "grey.400"
        }}>
            <Typography align="center" variant="h5">{props.title}</Typography>
        </Box>
    )
}