"use client"
import { useSessionContext } from "@/app/providers/sessionProvider"
import { Paper,Grid, ListItem, ListItemIcon, ListItemText, ToggleButton, ToggleButtonGroup } from "@mui/material"
import Adminrol from "./adminRol/page"
import AdminUsuario from "./adminUsuario/page"
import { useMemo, useState } from "react"
import { AssignmentInd, Book, PeopleAlt, Person } from "@mui/icons-material"
import { useRouter } from "next/navigation"
import AdminEstudiante from "./adminEstudiante/page"
import AdminClases from "./adminClases/page"
import { respHidden, respOrientation } from "@/sxStyles/responsive"

interface ToggleSection {
    label: string
    component: JSX.Element
    requiredPerm: string[],
    icon: JSX.Element
}

export default function AdminPanel() {
    const router = useRouter()
    const sessionContext = useSessionContext()
    const sections = useMemo(() => {
        const sectionArr: ToggleSection[] = [
            { label: "Usuarios", component: <AdminUsuario />, requiredPerm: ["ver-usuario"], icon: <Person /> },
            { label: "Roles", component: <Adminrol />, requiredPerm: ["ver-rol"], icon: <AssignmentInd /> },
            { label: "Estuaidntes", component: <AdminEstudiante />, requiredPerm: ["ver-estudiante", "ver-estudiante-curso"], icon: <PeopleAlt /> },
            { label: "Clases", component: <AdminClases />, requiredPerm: ["ver-clase"], icon: <Book /> }
        ]
        return sectionArr
    }, [])
    const storageSection = Number(window.localStorage.getItem("adminPanelSection"))
    const [currentSection, setCurrentSection] = useState<number>(isNaN(storageSection) ? 0 : storageSection)

    function handleChange(event: React.MouseEvent<HTMLElement>, value: number) {
        if (value !== null) {
            setCurrentSection(value)
            window.localStorage.setItem("adminPanelSection", String(value))
        }
    }
    if (sessionContext && sessionContext.session) {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} lg={2}>
                    <Paper elevation={2}>
                        <ToggleButtonGroup
                            value={currentSection}
                            onChange={handleChange}
                            orientation="vertical"
                            exclusive
                            sx={{ ...respOrientation(1200, "column") }}
                        >
                            {sections.map((section, index) => (
                                sessionContext.permisos.some((permiso) => section.requiredPerm.includes(permiso)) ?
                                    <ToggleButton key={index} value={index}>
                                        <ListItem>
                                            <ListItemIcon>{section.icon}</ListItemIcon>
                                            <ListItemText primary={section.label} sx={{ ...respHidden(1200) }} />
                                        </ListItem>
                                    </ToggleButton>
                                    :
                                    null
                            ))}
                        </ToggleButtonGroup>
                    </Paper>
                </Grid>
                <Grid item xs={12} lg={10}>
                    {sections[currentSection].component}
                </Grid>
            </Grid>
        )
    } else {
        router.push("/")
    }
}