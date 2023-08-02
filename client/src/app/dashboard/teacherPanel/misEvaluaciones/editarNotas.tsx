import ModalButtons from "@/components/modal/modalButtons"
import ModalTitle from "@/components/modal/modalTitle"
import { sxCenteredContainer, sxDefaultMargin, sxModalContainer } from "@/sxStyles/sxStyles"
import { sessionHeaders } from "@/utils/axios/headers"
import { getAllRelated, getErrorMsg } from "@/utils/axios/reqUtils"
import { Evaluacion, Estudiante, Nota } from "@/utils/interfaces/entityInterfaces"
import { Save } from "@mui/icons-material"
import { Modal, Card, Grid, Box, Typography, TextField, Button } from "@mui/material"
import axios from "axios"
import { useState, useEffect } from "react"

interface EditarNotasnProps {
    open: boolean
    onClose: (event: {}, reason: "backdropClick" | "escapeKeyDown") => void
    fullSelectedEvaluacion: Evaluacion
}

export function EditarNotas(props: EditarNotasnProps) {
    const [currentData, setCurrentData] = useState<any[]>([])
    const [errorMsg, setErrorMsg] = useState<string | null>()


    async function getAllNotes() {
        const headers = sessionHeaders()
        const idCurso = props.fullSelectedEvaluacion.clase.curso.id

        const resEstudinates = await getAllRelated("estudiante", "curso", headers, idCurso)
        const resNotas = await getAllRelated("nota", "evaluacion", headers, props.fullSelectedEvaluacion.id)

        if (resEstudinates.status, resNotas.status) {
            const estudiantes: Estudiante[] = resEstudinates.result
            const notas: Nota[] = resNotas.result
            console.log("resNotas", resNotas)
            const formatEstudiantes = estudiantes.map(estudiante => {
                console.log("iteration nota :", estudiante)
                let nota: string | number | undefined | null = notas.find((nota: Nota) => nota.estudiante.id === estudiante.id)?.nota
                if (!nota || nota === undefined) {
                    nota = ""
                }
                return {
                    ...estudiante,
                    nota: nota
                }
            })

            console.log("formatEstudiantes", formatEstudiantes)

            setCurrentData(formatEstudiantes)
        }
    }
    console.log("currentData", currentData)

    async function changeNota(value: string, index: number) {
        console.log(value, index)
        setCurrentData(prevData => {
            prevData[index].nota = String(value)
            return [...prevData]
        })
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        const headers = sessionHeaders()
        const url = `${process.env.NEXT_PUBLIC_API_URL}/nota/upsert`
        const evaluacionId = props.fullSelectedEvaluacion.id
        const body = currentData.map(estudiante => {
            let nota = null
            if (estudiante.nota && estudiante.nota !== "") {
                nota = Number(estudiante.nota)
            }
            const newObj = {
                estudiante: estudiante.id,
                nota: nota,
                evaluacion: evaluacionId
            }
            return newObj
        })
        console.log("body =", body)
        try {
            await axios.post(url, { data: body }, headers)
            setErrorMsg(null)
            props.onClose({}, "backdropClick")
        } catch (error) {
            setErrorMsg(getErrorMsg(error))
        }
    }

    useEffect(() => {
        getAllNotes()
    }, [])
    if (currentData) {
        return (
            <Modal open={props.open} onClose={props.onClose} sx={{ ...sxCenteredContainer() }}>
                <Card sx={{ ...sxModalContainer() }}>
                    <form onSubmit={handleSubmit}>
                        <Grid container sx={{maxWidth:800}}>
                            <Grid item xs={12}>
                                <ModalTitle title="Editar notas" />
                            </Grid>
                            {
                                currentData.length > 0 ?
                                    <Grid item xs={12} sx={{ maxHeight: 300, overflow: "auto" }}>
                                        {currentData.map((estudiante, index) => (
                                            <Box key={index} sx={{
                                                display: "flex",
                                                flexDirection: "row",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                ...sxDefaultMargin()
                                            }}>
                                                <Typography>{`${estudiante.nombre} ${estudiante.apellido}`}</Typography>
                                                <TextField
                                                    label="Nota"
                                                    onChange={(e) => { changeNota(e.target.value, index) }}
                                                    value={estudiante.nota}
                                                />
                                            </Box>

                                        ))}
                                    </Grid>
                                    :
                                    <Grid item xs={12}>
                                        <Typography variant="body1">No se han encontrado estudaintes</Typography>
                                    </Grid>
                            }
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
    } else {
        return null
    }

}




