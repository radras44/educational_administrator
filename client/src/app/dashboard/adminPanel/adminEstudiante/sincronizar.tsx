import { ArticleTitle, KeyValueItem } from "@/components/Sheet/SheetContainer"
import ModalButtons from "@/components/modal/modalButtons"
import ModalTitle from "@/components/modal/modalTitle"
import { sxCenteredContainer, sxDefaultMargin, sxHContainer, sxModalContainer } from "@/sxStyles/sxStyles"
import { getErrorMsg } from "@/utils/axios/reqUtils"
import { StaticEntitiesType } from "@/utils/interfaces/interfaces"
import { SynchronizedDataType, Synchronizer } from "@/utils/synchronizer"
import { ImportContacts, Sync } from "@mui/icons-material"
import { Modal, Checkbox, Card, Grid, Button, Typography, Input, Box } from "@mui/material"
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
        if(syncActions.includes(value)){
            setSyncActions(prevState => prevState.filter(element => element != value))
        }else{
            setSyncActions([...syncActions,value])
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
    return (
        <Modal open={props.open} onClose={props.onClose} sx={{ ...sxCenteredContainer() }}>
            <Card sx={{ ...sxModalContainer() }}>
                <form onSubmit={handleSubmit}>
                    <Grid container sx={{ maxWidth: 800 }}>
                        <Grid item xs={12}>
                            <ModalTitle title="Sincronizar Estudiantes" />
                        </Grid>
                        <Grid item xs={12} sx={{ ...sxHContainer() }}>
                            <label htmlFor="file-upload">
                                <Input
                                    type="file"
                                    id="file-upload"
                                    style={{ display: 'none' }}
                                    onChange={handleChange}
                                    inputProps={{ 'aria-label': 'Upload File' }}
                                />
                                <Button
                                    sx={{ ...sxDefaultMargin() }}
                                    variant="outlined"
                                    component="span"
                                >
                                    Cargar archivo
                                </Button>
                            </label>
                            {selectedFile && (
                                <Typography
                                    variant="body1"
                                    sx={{ ...sxDefaultMargin() }}
                                >
                                    Archivo: {selectedFile.name}
                                </Typography>
                            )}
                        </Grid>
                        {selectedFile ?
                            <Grid item xs={12}>
                                <ModalButtons>
                                    <Button
                                        startIcon={<Sync />}
                                        variant="contained"
                                        onClick={synchronizeCurrentData}
                                        sx={{ ...sxDefaultMargin() }}
                                    >
                                        Sincronizar
                                    </Button>
                                </ModalButtons>
                            </Grid>
                            : null
                        }
                        {/*mensaje de cambios */}
                        {
                            syncInfo ?
                                <Grid item xs={12} sx={{ ...sxDefaultMargin() }}>
                                    {syncInfo.toCreate.length > 0}
                                    <ArticleTitle>Se realizaran los siguientes cambios:</ArticleTitle>
                                    <Box sx={{ ...sxHContainer() }}>
                                        <Checkbox
                                            checked={syncActions.includes("toCreate")}
                                            value={"toCreate"}
                                            onChange={changeSyncActions}
                                        />
                                        <KeyValueItem
                                            itemKey="crear estudiante: "
                                            value={String(syncInfo.toCreate.length)}
                                        />
                                    </Box>
                                    <Box sx={{ ...sxHContainer() }}>
                                        <Checkbox
                                            checked={syncActions.includes("toUpdate")}
                                            value={"toUpdate"}
                                            onChange={changeSyncActions}
                                        />
                                        <KeyValueItem
                                            itemKey="actualizar estudiante: "
                                            value={String(syncInfo.toUpdate.length)}
                                        />
                                    </Box>
                                    <Box sx={{ ...sxHContainer() }}>
                                        <Checkbox
                                            checked={syncActions.includes("toDelete")}
                                            value={"toDelete"}
                                            onChange={changeSyncActions}
                                        />
                                        <KeyValueItem
                                            itemKey="eliminar estudiante: "
                                            value={String(syncInfo.toDelete.length)}
                                        />
                                    </Box>
                                </Grid>
                                : null
                        }
                        <Grid item xs={12}>
                            <ModalButtons>
                                {
                                    syncInfo ?
                                        <Button
                                            sx={{ ...sxDefaultMargin() }}
                                            type="submit"
                                            variant="contained"
                                            startIcon={<ImportContacts />}
                                        >Comenzar importacion</Button>
                                        : null
                                }
                                <Button
                                    sx={{ ...sxDefaultMargin() }}
                                    variant="contained"
                                    color="error"
                                    onClick={() => {
                                        props.onClose({}, "backdropClick")
                                    }}
                                >Cancelar</Button>
                            </ModalButtons>
                            {
                                errorMsg ?
                                    <Typography noWrap={false} variant="h6" color="error">{errorMsg}</Typography>
                                    : null
                            }
                        </Grid>
                    </Grid>
                </form>
            </Card>
        </Modal>
    )
}
