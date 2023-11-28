import Sheet from "@/components/Sheet"
import ActionModal from "@/components/actionModal"
import { sxCenteredContainer, sxDefaultMargin, sxHContainer, sxModalContainer } from "@/sxStyles/sxStyles"
import { getErrorMsg } from "@/utils/axios/reqUtils"
import { StaticEntitiesType } from "@/utils/interfaces/interfaces"
import { SynchronizedDataType, Synchronizer } from "@/utils/synchronizer"
import { ImportContacts, Sync } from "@mui/icons-material"
import { Modal, Checkbox, Card, Grid, Button, Typography, Input, Box, Alert } from "@mui/material"
import { useMemo, useState } from "react"

interface ImportModalProps {
    open: boolean
    onClose: (event: {}, reason: "backdropClick" | "escapeKeyDown") => void
    staticEntities: StaticEntitiesType
    estudiantes: any[]
    getAllEstudiante: Function
}

interface SyncActionStates {
    create: boolean
    update: boolean
    delete: boolean
}

export function Sincronizar(props: ImportModalProps) {
    const synchronizer = useMemo(() => new Synchronizer(props.estudiantes, props.staticEntities), [])
    const [errorMsg, setErrorMsg] = useState<string | null>(null)
    const [currentData, setCurrentData] = useState<any[]>([])
    const [syncInfo, setSyncInfo] = useState<SynchronizedDataType | null>(null)
    const [syncActions, setSyncActions] = useState<string[]>([])
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    console.log("importedData", currentData)

    async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            const jsonData = await synchronizer.read(file, 2)
            if (jsonData.status) {
                const preprocessedData = synchronizer.format(jsonData.result)
                console.log("preprocessed data: ", preprocessedData)
                if (preprocessedData.status && preprocessedData.result) {
                    setSelectedFile(file)
                    setCurrentData(preprocessedData.result)
                    setErrorMsg(null)
                }
                if (!preprocessedData.status) {
                    setErrorMsg(String(preprocessedData.error))
                    setSyncInfo(null)
                    setSelectedFile(null)
                }
            }
            if (!jsonData.status) {
                setErrorMsg(jsonData.error)
            }
        }
    }

    async function synchronizeCurrentData() {
        const syncData = synchronizer.synchronize(currentData)
        if (syncData.status) {
            setSyncInfo(synchronizer.synchronizedData)
            setErrorMsg(null)
        }
        if (!syncData.status) {
            setErrorMsg(syncData.error || "error al sincronizar")
            setSyncInfo(null)
            setSelectedFile(null)
        }
    }

    function changeSyncActions(e: React.ChangeEvent<HTMLInputElement>) {
        const value = String(e.target.value)
        if (syncActions.includes(value)) {
            setSyncActions(prevState => prevState.filter(element => element != value))
        } else {
            setSyncActions([...syncActions, value])
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        const res = await synchronizer.send(syncActions)
        if (res.status) {
            await props.getAllEstudiante()
            props.onClose({}, "backdropClick")
        }
        if (!res.status) {
            setErrorMsg(getErrorMsg(res.error))
        }
    }

    const checkOptionStyles = {
        display: "flex", flexDirection: "row", gap: 2, alignItems: "center"
    }

    return (
        <Modal open={props.open} onClose={props.onClose}>
            <ActionModal.Content>
                <ActionModal.Title text="Sincronizacion manual" />
                <form onSubmit={handleSubmit}>
                    <ActionModal.FormContent>
                        <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 2 }}>
                            <label htmlFor="file-upload">
                                <Input
                                    type="file"
                                    id="file-upload"
                                    style={{ display: 'none' }}
                                    onChange={handleChange}
                                    inputProps={{ 'aria-label': 'Upload File' }}
                                />
                                <Button
                                    variant="contained"
                                    component="span"
                                >Cargar archivo
                                </Button>
                            </label>
                            {selectedFile && (
                                <Typography variant="body1">
                                    Archivo: {selectedFile.name}
                                </Typography>
                            )}
                        </Box>
                        {selectedFile ?
                            <ActionModal.FormButtons>
                                <Button
                                    startIcon={<Sync />}
                                    variant="contained"
                                    color="warning"
                                    onClick={synchronizeCurrentData}>
                                    Sincronizar
                                </Button>
                            </ActionModal.FormButtons>
                            : null
                        }
                        {/*mensaje de cambios */}
                        {
                            syncInfo ?
                                <Box sx={{display:"flex",flexDirection:"column",gap:2}}>
                                    <Sheet.Title>Seleccione las acciones a realizar:</Sheet.Title>
                                    <Box sx={checkOptionStyles} >
                                        <Checkbox
                                            checked={syncActions.includes("toCreate")}
                                            value={"toCreate"}
                                            onChange={changeSyncActions}
                                        />
                                        <Sheet.KeyValueItem
                                            itemKey="crear estudiante: "
                                            value={String(syncInfo.toCreate.length)}
                                        />
                                    </Box>
                                    <Box sx={checkOptionStyles} >
                                        <Checkbox
                                            checked={syncActions.includes("toUpdate")}
                                            value={"toUpdate"}
                                            onChange={changeSyncActions}
                                        />
                                        <Sheet.KeyValueItem
                                            itemKey="actualizar estudiante: "
                                            value={String(syncInfo.toUpdate.length)}
                                        />
                                    </Box>
                                    <Box sx={checkOptionStyles} >
                                        <Checkbox
                                            checked={syncActions.includes("toDelete")}
                                            value={"toDelete"}
                                            onChange={changeSyncActions}
                                        />
                                        <Sheet.KeyValueItem
                                            itemKey="eliminar estudiante: "
                                            value={String(syncInfo.toDelete.length)}
                                        />
                                    </Box>
                                </Box>
                                : null
                        }
                        <ActionModal.FormButtons>
                            {
                                syncInfo ?
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="success"
                                        startIcon={<ImportContacts />}
                                    >Importar</Button>
                                    : null
                            }
                            <Button
                                variant="contained"
                                onClick={() => {
                                    props.onClose({}, "backdropClick")
                                }}
                            >Cancelar</Button>
                        </ActionModal.FormButtons>
                        {
                            errorMsg ?
                                <Alert severity="error">{errorMsg}</Alert>
                                : null
                        }
                    </ActionModal.FormContent>
                </form>
            </ActionModal.Content>
        </Modal>
    )
}
