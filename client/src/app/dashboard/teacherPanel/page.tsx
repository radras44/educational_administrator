"use client"
import { useSessionContext } from "@/app/providers/sessionProvider"
import { Box, Grid, ListItem, ListItemIcon, ListItemText, Paper, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material"
import { useMemo, useState } from "react"
import { ArrowRight, ClassRounded, FlightTakeoffSharp, Task } from "@mui/icons-material"
import { useRouter } from "next/navigation"
import { ToggleSection } from "@/utils/interfaces/interfaces"

import MisEvaluaciones from "./misEvaluaciones/page"
import { respHidden, respOrientation } from "@/sxStyles/responsive"


export default function AdminPanel() {
    const router = useRouter()
    const sessionContext = useSessionContext()
    const sections = useMemo(() => {
        const sectionArr: ToggleSection[] = [
            { label: "Mis evaluaciones", component: <MisEvaluaciones />, requiredPerm: ["ver-panel-profesor"], icon: <Task /> }
        ]
        return sectionArr
    }, [])
    const storageSection = Number(window.localStorage.getItem("teacherPanelSection"))
    const [currentSection, setCurrentSection] = useState<number>(isNaN(storageSection) ? 0 : storageSection)

    function handleChange(event: React.MouseEvent<HTMLElement>, value: number) {
        if (value !== null) {
            setCurrentSection(value)
            window.localStorage.setItem("teacherPanelSection", String(value))
        }
    }

    if (sessionContext && sessionContext.session) {
        return (
            <Grid container>
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