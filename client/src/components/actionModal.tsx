import { sxCenteredContainer } from "@/sxStyles/sxStyles";
import { Box, Modal, ModalProps, SxProps, Typography } from "@mui/material";
import {forwardRef} from "react"

const Content = forwardRef(({children} : {children : React.ReactNode} , ref)=>{
    const boxStyles: SxProps = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        maxHeight: "90vh",
        boxShadow: 24,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        overflowY : "scroll",
        display: "flex",
        flexDirection: "column",
        justifyContent : "flex-start",
        alignItems: "center"
    };
    return (
            <Box sx={boxStyles}>
                {children}
            </Box>
    )
})



function Title(props: { text: string }) {
    return (
        <Box sx={{
            backgroundColor : "primary.dark",
            color : "primary.light",
            width : "100%",
            p:2
        }}>
            <Typography align="center" sx={{fontWeight : 900}} variant="h6">{props.text}</Typography>
        </Box>
    )
}

function FormContent(props: { children: React.ReactNode }) {
    return (
        <Box sx={{
            p:3,
            display:"flex",flexDirection:"column",alignItems:"center",
            gap : 2
        }}>
            {props.children}
        </Box>
    )
}

function FormButtons(props: { children: React.ReactNode }) {
    return (
        <Box sx={{
            display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 2
        }}>
            {props.children}
        </Box>
    )
}

export default { Content, FormButtons, FormContent, Title }