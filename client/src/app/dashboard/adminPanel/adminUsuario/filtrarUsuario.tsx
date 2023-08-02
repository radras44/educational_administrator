import FilterByCurso, { applyFilterByCurso } from "@/components/filters/filterByCurso"
import FilterByGenero, { applyFilterByGenero } from "@/components/filters/filterByGenero"
import OrderBy, { applyOrderBy, orderAZ, orderZA } from "@/components/filters/orderBy"
import ModalButtons from "@/components/modal/modalButtons"
import ModalTitle from "@/components/modal/modalTitle"
import { sxCenteredContainer, sxDefaultMargin, sxModalContainer } from "@/sxStyles/sxStyles"
import { Filters, Order, StaticEntitiesType } from "@/utils/interfaces/interfaces"
import { Save } from "@mui/icons-material"
import { Button, Card, Checkbox, Grid, ListItem, ListItemText, Modal, Paper } from "@mui/material"
import { useState } from "react"
interface FiltrarUsuarioProps {
    open: boolean
    onClose: (event: {}, reason: "backdropClick" | "escapeKeyDown") => void
    initialData: any[]
    setCurrentData: React.Dispatch<React.SetStateAction<any[]>>
    staticEntities: StaticEntitiesType
}

export default function FiltrarUsuario(props: FiltrarUsuarioProps) {
    const [filters, setFilters] = useState<Filters>({
        cursos: [],
        order: "",
        genero: ""
    })

    const orders: Order[] = [
        {
            name: "A-Z Nombre",
            action: orderAZ
        },
        {
            name: "Z-A Nombre",
            action: orderZA
        }
    ]

    function applyFilters() {
        let updatedData: any[] = props.initialData
        updatedData = applyFilterByCurso(updatedData, filters.cursos)
        if (props.staticEntities.generos) {
            updatedData = applyFilterByGenero(updatedData, props.staticEntities.generos, filters.genero)
        }
        updatedData = applyOrderBy(updatedData, filters.order, orders)
        props.setCurrentData(updatedData)
        props.onClose({}, "backdropClick")
    }

    return (
        <Modal open={props.open} onClose={props.onClose} sx={{ ...sxCenteredContainer() }}>
            <Card sx={{ ...sxModalContainer() }}>
                <Grid container>
                    <Grid item xs={12}>
                        <ModalTitle title="Editar usuario" />
                    </Grid>
                    <Grid item xs={4}>
                        {
                            props.staticEntities.cursos ?
                                <FilterByCurso
                                    cursos={props.staticEntities.cursos}
                                    setFilters={setFilters}
                                    filters={filters}
                                />
                                : null
                        }
                    </Grid>
                    <Grid item xs={8}>
                        {
                            props.staticEntities.generos ?
                                <FilterByGenero
                                    generos={props.staticEntities.generos}
                                    setFilters={setFilters}
                                    filters={filters}
                                />
                                : null
                        }
                        <OrderBy
                            orders={orders}
                            setFilters={setFilters}
                            filters={filters}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <ModalButtons>
                            <Button
                                startIcon={<Save />}
                                variant="contained"
                                onClick={applyFilters}
                                sx={{...sxDefaultMargin()}}
                            >Aplicar
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => { props.onClose({}, "backdropClick") }}
                                sx={{...sxDefaultMargin()}}
                            >Cancelar
                            </Button>
                        </ModalButtons>
                    </Grid>
                </Grid>
            </Card>
        </Modal>
    )
}

