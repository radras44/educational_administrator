import ActionModal from "@/components/actionModal"
import { TextFieldGenerator } from "@/components/form/DynamicInputs"

import ModalTitle from "@/components/modal/modalTitle"
import { sxCenteredContainer, sxDefaultMargin, sxModalContainer } from "@/sxStyles/sxStyles"
import { sessionHeaders } from "@/utils/axios/headers"
import { getErrorMsg, updateEntity, updateManyToMany } from "@/utils/axios/reqUtils"
import { AttributesType } from "@/utils/interfaces/interfaces"
import { SelectedRol } from "@/utils/interfaces/entityInterfaces"
import { Save, Cancel } from "@mui/icons-material"
import { Modal, Grid, Card, Paper, ListItem, ListItemIcon, Checkbox, ListItemText, Button, Typography } from "@mui/material"
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
            <Modal open={props.open} onClose={props.onClose} >
                <ActionModal.Content>
                    <ActionModal.Title text="Editar Rol" />
                    <ActionModal.FormContent>
                        <form onSubmit={handleSubmit}>
                            {/* interfaz de permisos -->*/}
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
                            <TextFieldGenerator
                                currentData={currentData}
                                setCurrentData={setCurrentData}
                                attributes={textFieldAttributes}
                            />

                            <ActionModal.FormButtons>
                                <Button
                                    variant="contained"
                                    startIcon={<Save />}
                                    type="submit"
                                    color="success"
                                >Aplicar
                                </Button>
                                <Button
                                    variant="contained"
                                    startIcon={<Cancel />}
                                    onClick={() => {
                                        props.onClose({}, 'backdropClick');
                                    }}
                                >Volver
                                </Button>
                            </ActionModal.FormButtons>
                            {errorMsg ? (
                                <Typography color="error" variant="h6">
                                    {errorMsg}
                                </Typography>
                            ) : null}

                        </form>
                    </ActionModal.FormContent>
                </ActionModal.Content>
            </Modal>
        );
    } else {
        return null;
    }
}