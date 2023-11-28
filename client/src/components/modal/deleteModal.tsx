
import ModalTitle from "@/components/modal/modalTitle"
import { sxCenteredContainer, sxDefaultMargin, sxModalContainer } from "@/sxStyles/sxStyles"
import { sessionHeaders } from "@/utils/axios/headers"
import { deleteRegister, getErrorMsg } from "@/utils/axios/reqUtils"
import { Alert, Box, Button, Card, Grid, Modal, Typography } from "@mui/material"
import { useState } from "react"
import ActionModal from "../actionModal"

interface DeleteModalProps {
    open: boolean
    onClose: (event: {}, reason: "backdropClick" | "escapeKeyDown") => void
    id: number
    getAllRegisters: Function
    entityLabel: string
    title: string
    warningMsg: string
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
            <ActionModal.Content>
                <ActionModal.Title text={props.title} />
                <Alert severity="warning">{props.warningMsg}</Alert>
                <form onSubmit={handleSubmit}>
                    <ActionModal.FormContent>
                        <ActionModal.FormButtons>
                            <Button type="submit" variant="contained" color="error">Eliminar</Button>
                            <Button onClick={() => { props.onClose({}, "backdropClick") }}
                                variant="contained"
                            >Cancelar</Button>
                        </ActionModal.FormButtons>
                    </ActionModal.FormContent>
                </form>
            </ActionModal.Content>


        </Modal >
    )
}