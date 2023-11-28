import FilterByCurso, { applyFilterByCurso } from "@/components/filters/filterByCurso"
import FilterByGenero, { applyFilterByGenero } from "@/components/filters/filterByGenero"
import OrderBy, { applyOrderBy, orderAZ, orderZA } from "@/components/filters/orderBy"
import ActionModal from "@/components/actionModal"
import { Filters, Order, StaticEntitiesType } from "@/utils/interfaces/interfaces"
import { Save } from "@mui/icons-material"
import { Button, Modal } from "@mui/material"
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
        <Modal open={props.open} onClose={props.onClose} >
            <ActionModal.Content>
                <ActionModal.Title text="Editar usuario" />
                <ActionModal.FormContent>
                    {
                        props.staticEntities.cursos ?
                            <FilterByCurso
                                cursos={props.staticEntities.cursos}
                                setFilters={setFilters}
                                filters={filters}
                            />
                            : null
                    }
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
                    <ActionModal.FormButtons>
                        <Button
                            startIcon={<Save />}
                            color="success"
                            variant="contained"
                            onClick={applyFilters}
                        >Aplicar</Button>
                        <Button
                            variant="contained"
                            onClick={() => { props.onClose({}, "backdropClick") }}
                        >Voler</Button>
                    </ActionModal.FormButtons>
                </ActionModal.FormContent>
            </ActionModal.Content>
        </Modal>
    )
}

