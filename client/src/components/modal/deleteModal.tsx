import ModalButtons from "@/components/modal/modalButtons"
import ModalTitle from "@/components/modal/modalTitle"
import { sxCenteredContainer, sxDefaultMargin, sxModalContainer } from "@/sxStyles/sxStyles"
import { sessionHeaders } from "@/utils/axios/headers"
import { deleteRegister, getErrorMsg } from "@/utils/axios/reqUtils"
import { Box, Button, Card, Grid, Modal, Typography } from "@mui/material"
import { useState } from "react"

interface DeleteModalProps {
    open: boolean
    onClose: (event: {}, reason: "backdropClick" | "escapeKeyDown") => void
    id: number
    getAllRegisters : Function
    entityLabel : string
    title : string
    warningMsg : string
}

export function DeleteModal(props: DeleteModalProps) {
    const [errorMsg, setErrorMsg] = useState<string | null>(null)
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        const headers = sessionHeaders()
        const res = await deleteRegister(props.entityLabel, headers, props.id)
        if (res.status) {
            setErrorMsg(null)
            await props.getAllRegisters()
            props.onClose({}, "backdropClick")
        }
        if (!res.status) {
            setErrorMsg(getErrorMsg(res.error))
        }
    }
    return (
        <Modal open={props.open} onClose={props.onClose} sx={{ ...sxCenteredContainer() }}>
            <Card sx={{ ...sxModalContainer() }}>
                <form onSubmit={handleSubmit}>
                    <Grid container sx={{ maxWidth: 800 }}>
                        <Grid item xs={12}>
                            <ModalTitle title={props.title}/>
                        </Grid>
                        <Grid item xs={12} sx={{p:2}}>
                            <Typography align="center" sx={{ whiteSpace: "pre-wrap" }}>
                                {props.warningMsg}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <ModalButtons>
                                <Button
                                    sx={{ ...sxDefaultMargin() }}
                                    variant="contained"
                                    type="submit">
                                    Aceptar
                                </Button>
                                <Button
                                    sx={{ ...sxDefaultMargin() }}
                                    variant="contained"
                                    color="error"
                                    onClick={() => {
                                        props.onClose({}, "backdropClick")
                                    }}>
                                    Cancelar
                                </Button>
                            </ModalButtons>
                        </Grid>
                    </Grid>
                </form>
            </Card>
        </Modal>
    )
}