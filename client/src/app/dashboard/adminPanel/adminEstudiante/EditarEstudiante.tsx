import { TextFieldGenerator, SelectGenerator } from "@/components/form/DynamicInputs"
import ModalButtons from "@/components/modal/modalButtons"
import ModalTitle from "@/components/modal/modalTitle"
import { sxCenteredContainer, sxDefaultMargin, sxModalContainer } from "@/sxStyles/sxStyles"
import { sessionHeaders } from "@/utils/axios/headers"
import { updateEntity, getErrorMsg } from "@/utils/axios/reqUtils"
import { StaticEntitiesType, AttributesType, SelectedEstudiante } from "@/utils/interfaces/interfaces"
import { Save } from "@mui/icons-material"
import { Modal, Grid, Box, Button, Typography, Card } from "@mui/material"
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
        { label: "curso", inputType: "select", options: props.staticEntities.cursos! },
        { label: "genero", inputType: "select", options: props.staticEntities.generos! }
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
        <Modal open={props.open} onClose={props.onClose} sx={{ ...sxCenteredContainer() }}>
            <Card sx={{ ...sxModalContainer() }}>
                <form onSubmit={handleSubmit}>
                    <Grid container sx={{maxWidth:800}}>
                        <Grid item xs={12}>
                            <ModalTitle title="Editar estudiante" />
                        </Grid>
                        <Grid item xs={6}>
                            <TextFieldGenerator
                                currentData={currentData}
                                setCurrentData={setCurrentData}
                                attributes={textFieldAttributes}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <SelectGenerator
                                currentData={currentData}
                                setCurrentData={setCurrentData}
                                attributes={selectAttributes}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            {/*botones */}
                            <ModalButtons>
                                <Button
                                    sx={{ ...sxDefaultMargin() }}
                                    startIcon={<Save />}
                                    variant="contained"
                                    type="submit"
                                >Guardar</Button>
                                <Button
                                    sx={{ ...sxDefaultMargin() }}
                                    variant="outlined"
                                    color="error"
                                    onClick={() => { props.onClose({}, "backdropClick") }}
                                >Cancel</Button>
                            </ModalButtons>
                            {
                                errorMsg ? <Typography color="error" variant="h6">{errorMsg}</Typography>
                                    : null
                            }
                        </Grid>
                    </Grid>
                </form>
            </Card>
        </Modal>
    )
}