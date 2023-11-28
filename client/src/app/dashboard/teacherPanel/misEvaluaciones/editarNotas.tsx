
import ModalTitle from "@/components/modal/modalTitle"
import { sxCenteredContainer, sxDefaultMargin, sxModalContainer } from "@/sxStyles/sxStyles"
import { sessionHeaders } from "@/utils/axios/headers"
import { getAllRelated, getErrorMsg } from "@/utils/axios/reqUtils"
import { Evaluacion, Estudiante, Nota } from "@/utils/interfaces/entityInterfaces"
import { Save } from "@mui/icons-material"
import { Modal, Card, Grid, Box, Typography, TextField, Button } from "@mui/material"
import axios from "axios"
import { useState, useEffect } from "react"
import ActionModal from "@/components/actionModal"

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
            <Modal open={props.open} onClose={props.onClose}>
                <ActionModal.Content>
                    <ActionModal.Title text="Editar notas" />
                    <form onSubmit={handleSubmit}>
                        <ActionModal.FormContent>
                            {
                                currentData.length > 0 ?
                                    currentData.map((estudiante, index) => (
                                        <Box key={index} sx={{
                                            display: "flex",
                                            flexDirection: "row",
                                            gap : 2,
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                        }}>
                                            <Typography>{`${estudiante.nombre} ${estudiante.apellido}`}</Typography>
                                            <TextField
                                                label="Nota"
                                                onChange={(e) => { changeNota(e.target.value, index) }}
                                                value={estudiante.nota}
                                            />
                                        </Box>
                                    ))
                                    : null
                            }
                            <ActionModal.FormButtons>
                                <Button
                                    startIcon={<Save />}
                                    variant="contained"
                                    color="success"
                                    type="submit"
                                >Guardar</Button>
                                <Button
                                    variant="contained"
                                    onClick={() => { props.onClose({}, "backdropClick") }}
                                >Cancel</Button>
                            </ActionModal.FormButtons>
                            {errorMsg ? <Typography color="error" variant="h6" sx={{ whiteSpace: "pre-wrap" }}>{errorMsg}</Typography>
                                : null}
                        </ActionModal.FormContent>
                    </form>
                </ActionModal.Content>
            </Modal>
        )
    } else {
        return null
    }

}




