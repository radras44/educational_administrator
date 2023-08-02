import { SelectGenerator, TextFieldGenerator } from "@/components/form/DynamicInputs"
import { sxCenteredContainer, sxDefaultMargin, sxModalContainer } from "@/sxStyles/sxStyles"
import { sessionHeaders } from "@/utils/axios/headers"
import { createEntity, getErrorMsg } from "@/utils/axios/reqUtils"
import { AttributesType } from "@/utils/interfaces/interfaces"
import { Cancel, Save } from "@mui/icons-material"
import { Button, ButtonGroup, Card, Grid, Modal, Typography } from "@mui/material"
import { useState} from "react"

interface CrearRolProps {
    open: boolean
    onClose: (event: {}, reason: "backdropClick" | "escapeKeyDown") => void
    getAllRoles: Function
    nivelOptions : {id : number,nivel : number}[]
}


export default function CrearRol(props: CrearRolProps) {
    const [errorMsg,setErrorMsg] = useState<string | null>(null)
    const [currentData,setCurrentData] = useState<any>({})
    async function handleSubmit(e:React.FormEvent){
        e.preventDefault()
        const res = await createEntity("rol",sessionHeaders(),currentData)
        if(!res.status){
            setErrorMsg(getErrorMsg(res.error))
        }
        if(res.status){
            setErrorMsg(null)
            await props.getAllRoles()
            props.onClose({},"backdropClick")
        }
    }

    const textFieldAttributes : AttributesType[] = [
        {label : "rol",inputType:"textField",options:[],required:true}
    ]
    const selectAttributes : AttributesType[] = [
        {label : "nivel",inputType:"select",options:props.nivelOptions,required:true}
    ]
    return (
        <Modal open={props.open} onClose={props.onClose} sx={{ ...sxCenteredContainer() }}>
            <Card sx={{ ...sxModalContainer() }}>
                <form onSubmit={handleSubmit}>
                    <Grid container>
                        <Grid item xs={12}>
                        </Grid>
                        <Grid item xs={6}>
                            <TextFieldGenerator
                            currentData={currentData}
                            setCurrentData={setCurrentData}
                            attributes={textFieldAttributes}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <SelectGenerator
                            currentData={currentData}
                            setCurrentData={setCurrentData}
                            attributes={selectAttributes}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <ButtonGroup>
                                <Button
                                    variant="contained"
                                    startIcon={<Save />}
                                    type="submit"
                                    sx={{ ...sxDefaultMargin() }}
                                >
                                    Guardar
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    startIcon={<Cancel />}
                                    sx={{ ...sxDefaultMargin() }}
                                    onClick={() => {
                                        props.onClose({}, 'backdropClick');
                                    }}
                                >
                                    Cancelar
                                </Button>
                            </ButtonGroup>
                        </Grid>
                        {
                            errorMsg ? 
                            <Typography variant="body1" color="error">{errorMsg}</Typography>
                            : null
                        }
                    </Grid>
                </form>
            </Card>
        </Modal>
    )
}