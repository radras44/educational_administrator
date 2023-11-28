import ActionModal from "@/components/actionModal"
import { TextFieldGenerator, SelectGenerator } from "@/components/form/DynamicInputs"
import { sessionHeaders } from "@/utils/axios/headers"
import { updateEntity, getErrorMsg } from "@/utils/axios/reqUtils"
import { Estudiante, SelectedEstudiante } from "@/utils/interfaces/entityInterfaces"
import { StaticEntitiesType, AttributesType} from "@/utils/interfaces/interfaces"
import { Modal, Button, Typography } from "@mui/material"
import { useState } from "react"

interface EditEstudianteProps {
    open: boolean
    onClose: (event: {}, reason: "backdropClick" | "escapeKeyDown") => void
    selectedEstudiante: SelectedEstudiante
    staticEntities: StaticEntitiesType
    getAllEstudiante: Function
}

export function EditarEstudiante(props: EditEstudianteProps) {
    const [currentData, setCurrentData] = useState<SelectedEstudiante>(props.selectedEstudiante)
    const [errorMsg, setErrorMsg] = useState<string | null>(null)

    const textFieldAttributes: AttributesType[] = [
        { label: "nombre_de_usuario", inputType: "textField", options: [], required: true },
        { label: "nombre", inputType: "textField", options: [] },
        { label: "apellido", inputType: "textField", options: [] },
        { label: "rut", inputType: "textField", options: [] },
    ]

    const selectAttributes: AttributesType[] = [
        { label: "curso_id_curso", inputType: "select", options: props.staticEntities.cursos! },
        { label: "genero_id_genero", inputType: "select", options: props.staticEntities.generos! }
    ]

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        const headers = sessionHeaders()
        const { id, rol, ...data } = currentData
        const res = await updateEntity("estudiante", headers, data, id)
        if (!res.status) {

            setErrorMsg(getErrorMsg(res.error))
        }
        else {
            await props.getAllEstudiante()
            props.onClose({}, "backdropClick")
        }
    }
    return (
        <Modal open={props.open} onClose={props.onClose}>
            <ActionModal.Content>
                <ActionModal.Title text="Editar" />
                <form onSubmit={handleSubmit}>
                    <ActionModal.FormContent>
                        <TextFieldGenerator
                            currentData={currentData}
                            setCurrentData={setCurrentData}
                            attributes={textFieldAttributes}
                        />

                        <SelectGenerator
                            currentData={currentData}
                            setCurrentData={setCurrentData}
                            attributes={selectAttributes}
                        />

                        {/*botones */}
                        <ActionModal.FormButtons>
                            <Button type="submit" variant="contained" color="success">Aplicar</Button>
                            <Button onClick={() => { props.onClose({}, "backdropClick") }}
                                variant="contained"
                            >Volver</Button>
                        </ActionModal.FormButtons>
                        {
                            errorMsg ? <Typography color="error" variant="h6">{errorMsg}</Typography>
                                : null
                        }
                    </ActionModal.FormContent>
                </form>
            </ActionModal.Content>
        </Modal>
    )
}