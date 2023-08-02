import { TextFieldGenerator, SelectGenerator } from "@/components/form/DynamicInputs"
import ModalButtons from "@/components/modal/modalButtons"
import ModalTitle from "@/components/modal/modalTitle"
import { sxCenteredContainer, sxDefaultMargin, sxModalContainer } from "@/sxStyles/sxStyles"
import { sessionHeaders } from "@/utils/axios/headers"
import { updateEntity, getErrorMsg } from "@/utils/axios/reqUtils"
import { AttributesType, SelectedEvaluacion } from "@/utils/interfaces/interfaces"
import { Save } from "@mui/icons-material"
import { Modal, Card, Grid, Button, Typography } from "@mui/material"
import { useState } from "react"

interface EditarEvaluacionProps {
    open: boolean
    selectedEvaluacion: SelectedEvaluacion
    onClose: (event: {}, reason: "backdropClick" | "escapeKeyDown") => void
    getAllEvaluaciones: Function
    numero_de_evaluacionOptions: { id: number, numero_de_evaluacion: number }[]
}

export function EditarEvaluacion(props: EditarEvaluacionProps) {
    const [currentData, setCurrentData] = useState<SelectedEvaluacion>(props.selectedEvaluacion)
    const [errorMsg, SetErrorMsg] = useState<string | null>()
    const textFieldAttributes: AttributesType[] = [
        { label: "evaluacion", inputType: "textField", options: [], required: true },
    ]
    const selectAttributes: AttributesType[] = [
        { label: "numero_de_evaluacion", inputType: "select", options: props.numero_de_evaluacionOptions, required: true }
    ]
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        const headers = sessionHeaders()
        const { id, ...data } = currentData
        const res = await updateEntity("evaluacion", headers, data, id)
        if (!res.status) { SetErrorMsg(getErrorMsg(res.error)) }
        if (res.status) {
            SetErrorMsg(null)
            await props.getAllEvaluaciones()
            props.onClose({}, "backdropClick")
        }
    }
    console.log(currentData)
    return (
        <Modal open={props.open} onClose={props.onClose} sx={{ ...sxCenteredContainer() }}>
            <Card sx={{ ...sxModalContainer() }}>
                <form onSubmit={handleSubmit}>
                    <Grid container sx={{maxWidth:800}}>
                        <Grid item xs={12}>
                            <ModalTitle title="Editar evluacion"/>
                        </Grid>
                        <Grid item xs={6}>
                            <TextFieldGenerator
                                attributes={textFieldAttributes}
                                currentData={currentData}
                                setCurrentData={setCurrentData}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <SelectGenerator
                                attributes={selectAttributes}
                                currentData={currentData}
                                setCurrentData={setCurrentData}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <ModalButtons>
                                <Button
                                    startIcon={<Save />}
                                    variant="contained"
                                    type="submit"
                                    sx={{...sxDefaultMargin()}}
                                >Guardar</Button>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={() => { props.onClose({}, "backdropClick") }}
                                    sx={{...sxDefaultMargin()}}
                                >Cancel</Button>
                            </ModalButtons>
                            {errorMsg ? <Typography color="error" variant="h6" sx={{ whiteSpace: "pre-wrap" }}>{errorMsg}</Typography>
                                : null}
                        </Grid>
                    </Grid>
                </form>
            </Card>
        </Modal>
    )
}




