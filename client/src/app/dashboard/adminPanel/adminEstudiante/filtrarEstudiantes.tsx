import { Box, Button, Card, Grid, Modal } from "@mui/material";
import { Filters, Order, StaticEntitiesType } from "@/utils/interfaces/interfaces";
import { Save } from "@mui/icons-material";
import { sxCenteredContainer, sxDefaultMargin, sxModalContainer } from "@/sxStyles/sxStyles";
import { useState } from "react";
import ModalTitle from "@/components/modal/modalTitle";
import ModalButtons from "@/components/modal/modalButtons";
import FilterByCurso, { applyFilterByCurso } from "@/components/filters/filterByCurso";
import FilterByGenero, { applyFilterByGenero } from "@/components/filters/filterByGenero";
import OrderBy, { applyOrderBy, orderAZ, orderBirthDate, orderZA } from "@/components/filters/orderBy";
import { Estudiante } from "@/utils/interfaces/entityInterfaces";

interface EstudianteFilterProps {
    open: boolean
    onClose: (event: {}, reason: "backdropClick" | "escapeKeyDown") => void
    initialData: Estudiante[]
    setFilteredData: React.Dispatch<React.SetStateAction<any[]>>
    staticEntities: StaticEntitiesType
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>
}

export default function FiltrarEstudiantes(props: EstudianteFilterProps) {
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
        },
        {
            name: "fecha de nacimiento",
            action: orderBirthDate
        }
    ]

    function applyFilters() {
        let updatedData = props.initialData
        updatedData = applyFilterByCurso(updatedData,filters.cursos)   
        if (props.staticEntities.generos) {
            updatedData = applyFilterByGenero(updatedData, props.staticEntities.generos, filters.genero)
        }
        applyOrderBy(updatedData,filters.order,orders)
        props.setCurrentPage(1)
        props.setFilteredData(updatedData)
        props.onClose({}, "backdropClick")
    }


    //aplicar los filtros cada que se haga otra peticion para actualizar los estudiantes
    return (
        <Modal open={props.open} onClose={props.onClose} sx={{ ...sxCenteredContainer() }}>
            <Card sx={{ ...sxModalContainer() }}>
                <Grid container sx={{ maxWidth: 900 }}>
                    <Grid item xs={12}>
                        <ModalTitle title="Orden y filtros" />
                    </Grid>
                    <Grid item xs={4}>
                        {
                            props.staticEntities.cursos ?
                                <FilterByCurso
                                    cursos={props.staticEntities.cursos}
                                    setFilters={setFilters}
                                    filters={filters}
                                /> : null
                        }
                    </Grid>
                    <Grid item xs={8}>
                        <Box>
                            {/*orden */}
                            <OrderBy
                                setFilters={setFilters}
                                filters={filters}
                                orders={orders}
                            />
                            {/*genero */}
                            {
                                props.staticEntities.generos ?
                                    <FilterByGenero
                                        generos={props.staticEntities.generos}
                                        setFilters={(setFilters)}
                                        filters={filters}
                                    /> : null
                            }
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <ModalButtons>
                            <Button
                                onClick={applyFilters}
                                variant="contained"
                                startIcon={<Save />}
                                sx={{ ...sxDefaultMargin() }}
                            >Aplicar Filtros</Button>
                            <Button
                                color="error"
                                variant="contained"
                                onClick={() => {
                                    props.onClose({}, "backdropClick")
                                }}
                                sx={{ ...sxDefaultMargin() }}
                            >Cancelar</Button>
                        </ModalButtons>
                    </Grid>
                </Grid>
            </Card>
        </Modal >
    )
}