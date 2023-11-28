"use client"
import { useSessionContext } from "@/app/providers/sessionProvider"
import { sessionHeaders } from "@/utils/axios/headers"
import { getAll } from "@/utils/axios/reqUtils"
import { useStaticEntities, useTablePagination } from "@/utils/customHooks"
import { Add, Delete, Edit, FilterList, ImportExport, Person, Sync } from "@mui/icons-material"
import { Button } from "@mui/material"
import { useMemo, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { EditarEstudiante } from "./EditarEstudiante"
import { CrearEstudiante } from "./CrearEstudiante"
import { Sincronizar } from "./sincronizar"
import FiltrarEstudiantes from "./filtrarEstudiantes"
import { Estudiante, SelectedEstudiante } from "@/utils/interfaces/entityInterfaces"
import { Certificado } from "@/utils/certificado"
import { DeleteModal } from "@/components/modal/deleteModal"
import PanelPage from "@/components/panelPage"
import { useModal } from "@/hooks/hooks"

export default function AdminEstudiante() {
    const sessionContext = useSessionContext()
    const staticEntities = useStaticEntities()
    const initialEstudiantes = useRef<Estudiante[]>([])
    const [estudiantes, setEstudiantes] = useState<Estudiante[]>([])
    const pagination = useTablePagination(estudiantes)
    const certificado = useMemo(() => {
        if (staticEntities) {
            console.log("certificado instanciado")
            const certificado = new Certificado(staticEntities.asignaturas)
            return certificado
        }
    }, [staticEntities])

    //paginacion

    const [selectedEstudiante, setSelectedEstudiante] = useState<SelectedEstudiante| null>(null)
    const [estudianteToDelete, setEstudianteToDelete] = useState<Estudiante | null>(null)
    //modals
    const editModal = useModal()
    const createModal = useModal()
    const syncModal = useModal()
    const filtersModal = useModal()
    const deleteModal = useModal()

    //fetching functions
    async function getAllEstudiante() {
        const headers = sessionHeaders()
        if (sessionContext.permisos.includes("ver-estudiante")) {
            const res = await getAll("estudiante", headers, setEstudiantes)
            if (res && res.status) {
                initialEstudiantes.current = res.result
            }
        }
    }

    function importarCertificado(estudiante: Estudiante) {
        if (certificado) {
            certificado.certificadoDeNotas(estudiante)
        }
    }

    function eliminarEstudiante(estudiante: Estudiante) {
        setEstudianteToDelete(estudiante)
        deleteModal.open()
    }

    function editarEstudiante(estudiante: Estudiante) {
        setSelectedEstudiante({
            ...estudiante,
            curso : estudiante.curso ? estudiante.curso.id : null,
            rol : estudiante.rol ? estudiante.rol.id : null,
            genero : estudiante.genero ? estudiante.genero.id : null
        });
        editModal.open()
    }

    const router = useRouter()
    function verPerfil(estudiante: Estudiante) {
        const url: string = `/dashboard/perfil/estudiante/${estudiante.id}`
        router.push(url)
    }

    useEffect(() => {
        getAllEstudiante()
    }, [])
    return (
        <PanelPage.CContainer>
            <PanelPage.ToolBar>
                <Button onClick={createModal.open}>
                    <Add/>
                </Button>
                <Button onClick={syncModal.open}>
                   <Sync/>
                </Button>
                <Button onClick={filtersModal.open}>
                    <FilterList/>
                </Button>
            </PanelPage.ToolBar>
            {estudiantes.length > 0 ? (
                <PanelPage.Table
                    data={estudiantes}
                    options={[
                        { icon: <Edit color="warning" />, action: editarEstudiante },
                        { icon: <Delete color="error"/>, action: eliminarEstudiante },
                        { icon: <Person color="primary"/>, action: verPerfil },
                        { icon: <ImportExport color="success"/>, action: importarCertificado }
                    ]}
                    keysToShow={["id", "nombre_de_usuario","rut"]}
                    keyLabels={["id","nombre_de_usuario","rut"]}
                />
            ) : null}
                 {
                deleteModal.show && estudianteToDelete ?
                    <DeleteModal
                        open={deleteModal.show}
                        id={estudianteToDelete.id}
                        onClose={deleteModal.close}
                        title={"Eliminar estudiante"}
                        warningMsg={"¿esta seguro de eliminar este estudiante?"}
                        getAllRegisters={getAllEstudiante}
                        entityLabel="estudiante"
                    />
                    : null
            }
            {staticEntities ? (
                <FiltrarEstudiantes
                    initialData={initialEstudiantes.current}
                    setFilteredData={setEstudiantes}
                    open={filtersModal.show}
                    onClose={filtersModal.close}
                    staticEntities={staticEntities}
                    setCurrentPage={pagination.setCurrentPage}
                />
            ) : null}
            {syncModal.show && staticEntities ? (
                <Sincronizar
                    open={syncModal.show}
                    onClose={syncModal.close}
                    staticEntities={staticEntities}
                    estudiantes={initialEstudiantes.current}
                    getAllEstudiante={getAllEstudiante}
                />
            ) : null}
            {selectedEstudiante && editModal.show && staticEntities ? (
                <EditarEstudiante
                    open={editModal.show}
                    onClose={editModal.close}
                    staticEntities={staticEntities}
                    selectedEstudiante={selectedEstudiante}
                    getAllEstudiante={getAllEstudiante}
                />
            ) : null}
            {createModal.show&& staticEntities ? (
                <CrearEstudiante
                    open={createModal.show}
                    onClose={createModal.close}
                    staticEntities={staticEntities}
                    getAllEstudiante={getAllEstudiante}
                />
            ) : null}
        </PanelPage.CContainer>
    );
}

