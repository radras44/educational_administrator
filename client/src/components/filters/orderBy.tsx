import { sxTextField, sxDefaultMargin } from "@/sxStyles/sxStyles"
import { Filters, Order } from "@/utils/interfaces/interfaces"
import { TextField, MenuItem } from "@mui/material"

interface OrderByProps {
    setFilters : React.Dispatch<React.SetStateAction<any>>
    filters : Filters
    orders : Order[]
}

export default function OrderBy({setFilters,filters,orders} : OrderByProps) {
    function handleChangeOrder(e: React.ChangeEvent<HTMLInputElement>) {
        setFilters({
            ...filters,
            order: e.target.value
        })
    }
    return (
        <TextField
            select
            label="orednar por"
            value={filters.order}
            onChange={handleChangeOrder}
            sx={{ ...sxTextField(), ...sxDefaultMargin() }}
        >
            {orders.map((option, index) => (
                <MenuItem
                    key={index}
                    value={option.name}
                >
                    {option.name}
                </MenuItem>
            ))}
        </TextField>
    )
}

export function applyOrderBy (data : any[],selectedOrder : string,orders : Order[]) {
    if (selectedOrder !== "") {
        const selectedOrderObj = orders.find(order => order.name === selectedOrder)
        if (selectedOrderObj) {
            return selectedOrderObj.action(data)
        }
    }
    return data
}

export function orderAZ (data: any[]) {
    const sortedData = data.sort((a: any, b: any) => (!a || !b) ? -1 : a.nombre.localeCompare(b.nombre))
    return sortedData
}

export function orderZA (data: any[]) {
    const sortedData = data.sort((a: any, b: any) => (!a || !b) ? -1 : b.nombre.localeCompare(a.nombre))
    return sortedData
}

export function orderBirthDate (data: any[]) {
    const sortedData = data.sort((a, b) => {
        if(!a || !b){
            return -1
        }
        const dateA = new Date(a.fecha);
        const dateB = new Date(b.fecha);
        return dateA.getTime() - dateB.getTime();
    });
    return sortedData;
}