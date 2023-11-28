"use client"
import { useSessionContext } from "@/app/providers/sessionProvider"
import { useMemo } from "react"
import { Task } from "@mui/icons-material"
import { useRouter } from "next/navigation"
import { ToggleSection } from "@/utils/interfaces/interfaces"

import MisEvaluaciones from "./misEvaluaciones/page"
import panelPage from "@/components/panelPage"
import { useTopPanelSection } from "@/hooks/hooks"

export default function AdminPanel() {
    const router = useRouter()
    const sessionContext = useSessionContext()
    const sections = useMemo(() => {
        const sectionArr: ToggleSection[] = [
            { label: "Mis evaluaciones", component: <MisEvaluaciones />, requiredPerm: ["ver-panel-profesor"], icon: <Task /> }
        ]
        return sectionArr
    }, [])
    const section = useTopPanelSection("teacherPanel")

    if (sessionContext && sessionContext.session) {
        return (
            <panelPage.Container>
                <panelPage.TopPanel
                sectionGroupName="teacherPanel"
                sections={sections}
                currentSection={section.current}
                setCurrentSection={section.setCurrent}
                />
                <panelPage.Component>
                    {sections[section.current].component}
                </panelPage.Component>
            </panelPage.Container>
        )
    } else {
        router.push("/")
    }
}

