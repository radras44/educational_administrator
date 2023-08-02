"use client"
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material"
import Link from "next/link"


interface listLinkProps {
    text: string
    icon: JSX.Element | null
    href: string

}

export default function ListLink(props: listLinkProps) {
    return (
        <Link href={props.href}>
            <ListItem disablePadding>
                <ListItemButton>
                    <ListItemIcon>
                        {props.icon}
                    </ListItemIcon>
                    <ListItemText primary={props.text} sx={{color:"text.primary"}}/>
                </ListItemButton>
            </ListItem>
        </Link>
    )
}