import { Box } from "@mui/material"


interface ModalButtonsProps {
    children : React.ReactNode
}

export default function ModalButtons (props : ModalButtonsProps) {
    return (
        <Box sx={{
            backgroundColor:"grey.100",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "start",
            borderTop:1,
            BorderBottom:1,
            borderTopColor:"grey.400",
            borderBottomColor:"grey.400"
        }}>
            {props.children}
        </Box>
    )
}