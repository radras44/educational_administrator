import { Curso, Estudiante, Usuario } from "@/utils/interfaces/entityInterfaces"
import { Filters } from "@/utils/interfaces/interfaces"
import { Paper, ListItem, ListItemIcon, Checkbox, ListItemText } from "@mui/material"

interface FilterByCursoProps {
    cursos : Curso[]
    setFilters : React.Dispatch<React.SetStateAction<any>>
    filters : Filters
}

export default function FilterByCurso (props : FilterByCursoProps) {
    
    function handleChangeCursos(e: React.ChangeEvent<HTMLInputElement>) {
        const clickedCurso: number = Number(e.target.value)
        console.log(clickedCurso)
        //aplicar cursos
        if (props.filters.cursos.includes(clickedCurso)) {
            const updatedCursos: number[] = props.filters.cursos.filter(curso => curso != clickedCurso)
            props.setFilters({
                ...props.filters,
                cursos: updatedCursos
            })
        } else {
            props.setFilters({
                ...props.filters,
                cursos: [...props.filters.cursos, clickedCurso]
            })
        }
    }
    return (
        <Paper sx={{ maxHeight: 300, minWidth: "90%", overflow: "auto" }}>
            {props.cursos?.map((curso, index) => (
                <ListItem key={index} sx={{ p: 0 }}>
                    <ListItemIcon>
                        <Checkbox
                            value={curso.id}
                            checked={props.filters.cursos.includes(curso.id)}
                            onChange={handleChangeCursos}
                        />
                    </ListItemIcon>
                    <ListItemText primary={curso.curso} />
                </ListItem>
            ))}
        </Paper>
    )
}

export function applyFilterByCurso (data : any[],cursos : Number[]) {
    if (cursos.length > 0 && data.length > 0) {
        const updatedData = data.filter((element: any) => element.curso && cursos.includes(element.curso.id))
        return updatedData
    }else{
        return data
    }
}