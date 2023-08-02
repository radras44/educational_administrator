"use client"
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material"

interface listFunctionProps {
    text: string
    icon: JSX.Element | null
    action: Function
}

export default function ListFunction(props: listFunctionProps) {
    return (
        <ListItem disablePadding>
            <ListItemButton onClick={()=>{props.action()}}>
                <ListItemIcon>
                    {props.icon}
                </ListItemIcon>
                <ListItemText primary={props.text} sx={{ color: "text.primary" }} />
            </ListItemButton>
        </ListItem>
    )
}