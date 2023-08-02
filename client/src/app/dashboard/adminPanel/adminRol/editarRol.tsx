import { TextFieldGenerator } from "@/components/form/DynamicInputs"
import ModalButtons from "@/components/modal/modalButtons"
import ModalTitle from "@/components/modal/modalTitle"
import { sxCenteredContainer, sxDefaultMargin, sxModalContainer } from "@/sxStyles/sxStyles"
import { sessionHeaders } from "@/utils/axios/headers"
import { getErrorMsg, updateEntity, updateManyToMany } from "@/utils/axios/reqUtils"
import { AttributesType, SelectedRol } from "@/utils/interfaces/interfaces"
import { Save, Cancel } from "@mui/icons-material"
import { Modal, Grid,Card,Paper, ListItem, ListItemIcon, Checkbox, ListItemText, Button, Typography } from "@mui/material"
import { useMemo, useState } from "react"

interface rolEditModalProps {
    open: boolean
    onClose: (event: {}, reason: "backdropClick" | "escapeKeyDown") => void
    permisos: any[] | null
    selectedRol: SelectedRol
    getAllRol: Function
}

export function EditarRol(props: rolEditModalProps) {
    const allPermisosIdx = useMemo(() => {
        return props.permisos?.map((permiso) => permiso.id) || [];
    }, []);
    const [currentData, setCurrentData] = useState<SelectedRol>(props.selectedRol);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const textFieldAttributes: AttributesType[] = [
        { label: "rol", inputType: "textField", options: [] },
        { label: "nivel", inputType: "textField", options: [] }
    ];


    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const PermisoId: number = Number(e.target.value);
        if (currentData.permisosIdx.includes(PermisoId)) {
            const updatedPermisos: number[] = currentData.permisosIdx.filter(permiso => permiso !== PermisoId);
            setCurrentData({
                ...currentData,
                permisosIdx: updatedPermisos
            });
        } else {
            setCurrentData({
                ...currentData,
                permisosIdx: [...currentData.permisosIdx, PermisoId]
            });
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const res = await update()
        if (!res.status) {
            setErrorMsg(getErrorMsg(res.error))
        } else {
            setErrorMsg(null)
            await props.getAllRol()
            props.onClose({}, "backdropClick")
        }
    }

    async function update() {
        const { id, permisosIdx, ...data } = currentData
        const headers = sessionHeaders()

        const res = await updateEntity("rol", headers, data, id)
        if (!res.status) {
            return { status: false, error: res.error }
        }

        const add: number[] = currentData.permisosIdx;
        const remove: number[] = allPermisosIdx.filter(permiso => !currentData.permisosIdx.includes(permiso));
        const mtmRes = await updateManyToMany("rol", "permisos", headers, add, remove, id)
        if (!mtmRes.status) {
            return { status: false, error: res.error }
        }
        return { status: true }
    }


    if (props.permisos) {
        return (
            <Modal open={props.open} onClose={props.onClose} sx={{ ...sxCenteredContainer() }}>
                <Card sx={{ ...sxModalContainer() }}>
                    <form onSubmit={handleSubmit}>
                        <Grid container sx={{maxWidth:800}}>
                            {/* interfaz de permisos -->*/}
                            <Grid item xs={12}>
                                <ModalTitle title="Editar Rol" />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Paper sx={{ maxHeight: 300, overflow: 'auto' }}>
                                    {props.permisos.map((permiso, index) => (
                                        <ListItem key={index} sx={{ p: 0 }}>
                                            <ListItemIcon>
                                                <Checkbox
                                                    value={permiso.id}
                                                    checked={currentData.permisosIdx.includes(permiso.id)}
                                                    onChange={handleChange}
                                                />
                                            </ListItemIcon>
                                            <ListItemText primary={permiso.permiso} />
                                        </ListItem>
                                    ))}
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={8}>
                                <TextFieldGenerator
                                    currentData={currentData}
                                    setCurrentData={setCurrentData}
                                    attributes={textFieldAttributes}
                                />
                            </Grid>
                            {/* botones de acción --> */}
                            <Grid item xs={12}>
                                <ModalButtons>
                                    <Button 
                                    variant="contained" 
                                    startIcon={<Save />} 
                                    type="submit"
                                    sx={{...sxDefaultMargin()}}
                                    >
                                        Guardar
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        startIcon={<Cancel />}
                                        sx={{...sxDefaultMargin()}}
                                        onClick={() => {
                                            props.onClose({}, 'backdropClick');
                                        }}
                                    >
                                        Cancelar
                                    </Button>
                                </ModalButtons>
                                {errorMsg ? (
                                    <Typography color="error" variant="h6">
                                        {errorMsg}
                                    </Typography>
                                ) : null}
                            </Grid>
                        </Grid>
                    </form>
                </Card>
            </Modal>
        );
    } else {
        return null;
    }
}