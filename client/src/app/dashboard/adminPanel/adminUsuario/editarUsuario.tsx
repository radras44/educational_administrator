import ActionModal from "@/components/actionModal";
import { TextFieldGenerator, SelectGenerator } from "@/components/form/DynamicInputs";

import ModalTitle from "@/components/modal/modalTitle";
import { sxCenteredContainer, sxDefaultMargin, sxModalContainer } from "@/sxStyles/sxStyles";
import { sessionHeaders } from "@/utils/axios/headers";
import { getErrorMsg, updateEntity, updateManyToMany } from "@/utils/axios/reqUtils";
import { Clase, SelectedUsuario } from "@/utils/interfaces/entityInterfaces";
import { AttributesType, StaticEntitiesType } from "@/utils/interfaces/interfaces";
import { Save } from "@mui/icons-material";
import { Modal, Grid, Paper, ListItem, ListItemIcon, Checkbox, ListItemText, Box, Button, Typography } from "@mui/material";
import { useState } from "react";

interface editModalProps {
    open: boolean
    onClose: (event: {}, reason: "backdropClick" | "escapeKeyDown") => void
    selectedUsuario: SelectedUsuario | null
    staticEntities: StaticEntitiesType
    clases: Clase[]
    getAllUsuario: Function
}

export function EditarUsuario(props: editModalProps) {
    const [currentData, setCurrentData] = useState<SelectedUsuario | null>(props.selectedUsuario);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const textFieldAttributes: AttributesType[] = [
        { label: "nombre_de_usuario", inputType: "textField", options: [], required: true },
        { label: "rut", inputType: "textField", options: [] },
        { label: "nombre", inputType: "textField", options: [] },
        { label: "apellido", inputType: "textField", options: [] }
    ];

    const selectAttributes: AttributesType[] = [
        { label: "genero", inputType: "select", options: props.staticEntities.generos! },
        { label: "rol", inputType: "select", options: props.staticEntities.roles! },
        { label: "curso", inputType: "select", options: props.staticEntities.cursos! }
    ]


    function changeClase(e: React.ChangeEvent<HTMLInputElement>) {
        const claseId = Number(e.target.value)
        if (currentData) {
            if (currentData.clases.includes(claseId)) {
                const updatedClases = currentData.clases.filter(clase => clase !== claseId)
                console.log("se encontro, quitando...")
                setCurrentData({
                    ...currentData,
                    clases: updatedClases
                })
            }
            if (!currentData.clases.includes(claseId)) {
                console.log("no se encuentra, agregando...")
                setCurrentData({
                    ...currentData,
                    clases: [...currentData.clases, claseId]
                })
            }
        }
    }
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const res = await update()
        console.log("res", res)
        if (!res.status) {
            setErrorMsg(getErrorMsg(res.error))
        }
        if (res.status) {
            setErrorMsg(null)
            console.log("reacargando")
            await props.getAllUsuario()
            console.log("cerrando")
            props.onClose({}, "backdropClick")
        }
    }

    async function update() {
        if (currentData) {
            const headers = sessionHeaders()
            const { id, clases, ...data } = currentData
            const res = await updateEntity("usuario", headers, data, id)
            if (!res.status) {
                return { status: false, error: res.error }
            }

            const add = clases
            const remove = props.clases.filter(clase => !clases.includes(clase.id))
                .map(clase => clase.id)
            const mtmRes = await updateManyToMany("usuario", "clases", headers, add, remove, id)
            if (!mtmRes.status) {
                return { status: false, error: res.error }
            }
            return {
                status: true
            }
        } else {
            return {
                response: { data: { error: "ha ocurrido algo extraño, no se ha encontrado la data, recarge la pagina" } }
            }
        }
    }

    return (
        <Modal open={props.open} onClose={props.onClose}>
            <ActionModal.Content>
                <form onSubmit={handleSubmit}>
                    <ActionModal.Title text="Editar Usuario" />
                    <ActionModal.FormContent>
                        <Paper sx={{ maxHeight: "50vh", overflow: "auto" }}>
                            {
                                props.clases.length > 0 ?
                                    props.clases.map((clase, index) => (
                                        <ListItem key={index}>
                                            <ListItemIcon>
                                                <Checkbox
                                                    value={clase.id}
                                                    checked={currentData?.clases.includes(clase.id)}
                                                    onChange={changeClase}
                                                />
                                            </ListItemIcon>
                                            <ListItemText primary=
                                                {`${clase.asignatura.asignatura} - ${String(clase.curso.curso).replace("_", " ")}`} />
                                        </ListItem>
                                    ))
                                    : null
                            }
                        </Paper>
                        <TextFieldGenerator
                            currentData={currentData}
                            setCurrentData={setCurrentData}
                            attributes={textFieldAttributes}
                        />
                        <SelectGenerator
                            currentData={currentData}
                            setCurrentData={setCurrentData}
                            attributes={selectAttributes}
                        />
                        <ActionModal.FormButtons>
                            <Button
                                startIcon={<Save />}
                                color="success"
                                variant="contained"
                                type="submit"
                            >Aplicar</Button>
                            <Button
                                variant="contained"
                                onClick={() => { props.onClose({}, "backdropClick") }}
                            >Voler</Button>
                            {errorMsg ? <Typography color="error" variant="h6" sx={{ whiteSpace: "pre-wrap" }}>{errorMsg}</Typography>
                                : null}
                        </ActionModal.FormButtons>
                    </ActionModal.FormContent>

                </form>
            </ActionModal.Content>
        </Modal>
    );
}