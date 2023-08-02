import { sxTextField, sxDefaultMargin } from "@/sxStyles/sxStyles";
import { Genero } from "@/utils/interfaces/entityInterfaces";
import { Filters } from "@/utils/interfaces/interfaces";
import { TextField, MenuItem } from "@mui/material";

interface FilterByGenero {
    setFilters: React.Dispatch<React.SetStateAction<any>>
    filters: Filters
    generos: Genero[]
}

export default function FilterByGenero({ setFilters, filters, generos }: FilterByGenero) {
    function handleChangeGenero(e: React.ChangeEvent<HTMLInputElement>) {
        setFilters({
            ...filters,
            genero: e.target.value
        })
    }
    return (
        <TextField
            select
            label="genero"
            value={filters.genero}
            onChange={handleChangeGenero}
            sx={{ ...sxTextField(), ...sxDefaultMargin() }}
        >
            <MenuItem value={"todos"}>Todos</MenuItem>
            {generos?.map((option, index) => (
                <MenuItem
                    key={index}
                    value={option.genero}
                >
                    {option.genero}
                </MenuItem>
            ))}
        </TextField>
    )
}

export function applyFilterByGenero(data: any[], generos: Genero[], selectedGenero: string | null) {
    if (selectedGenero && selectedGenero !== "todos" ) {
      const findedGenero = generos.find((genero) => genero.genero === selectedGenero);
      if (findedGenero) {
        const updatedData = data.filter((estudiante) => estudiante.genero && estudiante.genero.id === findedGenero.id);
        if(updatedData){
            return updatedData;
        }
      }
    }
    return data
  }