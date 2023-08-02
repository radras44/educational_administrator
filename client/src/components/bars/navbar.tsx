"use client"
import { AppBar, Avatar, Box, IconButton, List, Toolbar, Drawer, Typography } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { useMemo, useState } from "react";
import { SupervisorAccount, Person, Logout, MenuBook } from "@mui/icons-material"
import {useSessionContext,contextProps } from "@/app/providers/sessionProvider";
import ListLink from "../listAndTables/listLink";
import ListFunction from "../listAndTables/listFunction";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
export default function Navbar() {
    const router = useRouter()
    const sessionContext = useSessionContext()
    console.log(sessionContext)
    const [drawerState, setDrawerState] = useState<boolean>(false)
    function handleCloseDrawer() {
        setDrawerState(false)
    }
    if (sessionContext && sessionContext.session) {
        return (
            <Box>
                <AppBar position="static">
                    <Toolbar sx={{
                        display: "flex", flexDirection: "row", justifyContent: "end"
                    }}>
                        <Box>
                            <IconButton onClick={() => setDrawerState(true)}>
                                <Avatar sx={{minWidth:50, minHeight:50}}></Avatar>
                            </IconButton>
                        </Box>
                    </Toolbar>
                </AppBar>
                <Drawer anchor="left" open={drawerState} onClose={handleCloseDrawer}>
                    <DrawerContent router={router} sessionContext={sessionContext} permisos={sessionContext.permisos || []} />
                </Drawer>
            </Box>
        )
    }else{
        router.push("/")
        return null
    }    
}


interface drawerContentProps {
    permisos: string[]
    sessionContext : contextProps
    router : AppRouterInstance
}
export function DrawerContent(props: drawerContentProps) {
    function handleLogOut () {        
        window.localStorage.removeItem("sessionToken")
        props.sessionContext.verifySession()
    }
    return (
        <Box sx={{ minWidth: 300, bgcolor: 'background.paper', pt: 10, pb: 10 }}>
            <List>
                <Box pl={1} pr={3}>
                    <ListLink text="Perfil" href={`/dashboard/perfil/self`} icon={<Person />} />
                    {
                        props.permisos.includes("ver-panel-administracion") ?
                            <ListLink text="Panel de administracion" href="/dashboard/adminPanel" icon={<SupervisorAccount />} /> : null
                    }
                    {
                        props.permisos.includes("ver-panel-profesor") ?
                        <ListLink text="Panel de profesor" href="/dashboard/teacherPanel" icon={<MenuBook/>}/>: null
                    }
                    <ListFunction action={handleLogOut} text="Cerrar sesíon"  icon={<Logout/>}/>
                </Box>
            </List>
        </Box>
    )
}