import ActionModal from "@/components/actionModal"
import { SelectGenerator } from "@/components/form/DynamicInputs"
import ModalTitle from "@/components/modal/modalTitle"
import { sxCenteredContainer, sxDefaultMargin, sxModalContainer } from "@/sxStyles/sxStyles"
import { sessionHeaders } from "@/utils/axios/headers"
import { createEntity, getErrorMsg } from "@/utils/axios/reqUtils"
import { StaticEntitiesType, AttributesType } from "@/utils/interfaces/interfaces"
import { Save } from "@mui/icons-material"
import { Modal, Grid, ListItem, ListItemIcon, Checkbox, ListItemText, Button, Typography, Card } from "@mui/material"
import { useState, Fragment } from "react"

interface CrearClaseProps {
    open: boolean
    onClose: (event: {}, reason: "backdropClick" | "escapeKeyDown") => void
    getAllClases: Function
    staticEntities: StaticEntitiesType
}

export function CrearClase(props: CrearClaseProps) {
    const [currentData, setCurrentData] = useState<any>({
        electivo: false
    })
    const [errorMsg, setErrorMsg] = useState<string | null>(null)


    const selectAttributes: AttributesType[] = [
        { label: "curso", inputType: "select", options: props.staticEntities.cursos!, required: true },
        { label: "asignatura", inputType: "select", options: props.staticEntities.asignaturas, required: true }
    ]

    function changeElectivo(e: React.ChangeEvent<HTMLInputElement>) {
        if (currentData.electivo) {
            setCurrentData({ ...currentData, electivo: false })
        } else {
            setCurrentData({ ...currentData, electivo: true })
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        const headers = sessionHeaders()
        const nombreCurso = props.staticEntities.cursos!.find(curso => curso.id === currentData.curso).curso
        const nombreAsignatura = props.staticEntities.asignaturas!.find(asignatura => asignatura.id === currentData.asignatura).asignatura
        const nombreClase = `${nombreAsignatura} ${nombreCurso}`
        const data = {
            ...currentData,
            clase: nombreClase
        }
        const res = await createEntity("clase", headers, data)
        if (res.status) {
            setErrorMsg(null)
            await props.getAllClases()
            props.onClose({}, "backdropClick")
        }
        if (!res.status) {
            setErrorMsg(getErrorMsg(res.error))
        }
    }

    return (
        <Modal open={props.open} onClose={props.onClose}>
            <ActionModal.Content>
                <ActionModal.Title text="Crear clase" />
                <form onSubmit={handleSubmit}>
                    <ActionModal.FormContent>
                        <SelectGenerator
                            attributes={selectAttributes}
                            currentData={currentData}
                            setCurrentData={setCurrentData}
                        />
                        <ListItem>
                            <ListItemIcon>
                                <Checkbox
                                    value={currentData.electivo}
                                    checked={currentData.electivo}
                                    onChange={changeElectivo}
                                />
                            </ListItemIcon>
                            <ListItemText primary="Electivo" />
                        </ListItem>
                        <ActionModal.FormButtons>
                            <Button
                                startIcon={<Save />}
                                color="success"
                                variant="contained"
                                type="submit"
                            >Crear</Button>
                            <Button
                                variant="contained"
                                onClick={() => { props.onClose({}, "backdropClick") }}
                            >Cancelar</Button>
                        </ActionModal.FormButtons>
                        {
                            errorMsg ?
                                <Typography variant="h6" color="error">{errorMsg}</Typography>
                                : null
                        }
                    </ActionModal.FormContent>
                </form>
            </ActionModal.Content>
        </Modal>
    )
}