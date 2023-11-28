"use client"
import { useSessionContext } from "@/app/providers/sessionProvider"
import Adminrol from "./adminRol/page"
import AdminUsuario from "./adminUsuario/page"
import { useMemo } from "react"
import { AssignmentInd, Book, PeopleAlt, Person } from "@mui/icons-material"
import { useRouter } from "next/navigation"
import AdminEstudiante from "./adminEstudiante/page"
import AdminClases from "./adminClases/page"
import panelPage from "../../../components/panelPage"
import { useTopPanelSection } from "@/hooks/hooks"
import { ToggleSection } from "@/utils/interfaces/interfaces"

export default function AdminPanel() {
    const router = useRouter()
    const sessionContext = useSessionContext()
    const sections = useMemo(() => {
        const sectionArr: ToggleSection[] = [
            { label: "Usuarios",color : "red", component: <AdminUsuario />, requiredPerm: ["ver-usuario"], icon: <Person /> },
            { label: "Roles",color : "green", component: <Adminrol />, requiredPerm: ["ver-rol"], icon: <AssignmentInd /> },
            { label: "Estudiantes",color : "purple", component: <AdminEstudiante />, requiredPerm: ["ver-estudiante", "ver-estudiante-curso"], icon: <PeopleAlt /> },
            { label: "Clases", color : "orange",component: <AdminClases />, requiredPerm: ["ver-clase"], icon: <Book /> }
        ]
        return sectionArr
    }, [])
    const section = useTopPanelSection("adminPanel")

    if (sessionContext && sessionContext.session) {
        return (
            <panelPage.Container>
                <panelPage.TopPanel
                sections={sections}
                currentSection={section.current}
                setCurrentSection={section.setCurrent}
                sectionGroupName="adminPanel"
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