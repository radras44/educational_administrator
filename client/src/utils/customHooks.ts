import { useState, useEffect } from "react"
import { sessionHeaders } from "./axios/headers"
import { getAll } from "./axios/reqUtils"
import { StaticEntitiesType } from "./interfaces/interfaces"

export const useStaticEntities = () : StaticEntitiesType | null => {
    const [roles,setRoles] = useState<any[] | null>(null)
    const [cursos,setCursos] = useState<any[] | null>(null)
    const [generos,setGeneros] = useState<any[] | null>(null)
    const [asignaturas,setAsignaturas] = useState<any[] | null>(null)
    useEffect(() => {
        const headers = sessionHeaders()
        getAll("rol",headers,setRoles)
        getAll("curso",headers,setCursos)
        getAll("genero",headers,setGeneros)
        getAll("asignatura",headers,setAsignaturas)
    }, [])

    if(roles && cursos && generos && asignaturas){
        return {roles,cursos,generos,asignaturas}
    }else{
        return null
    }
}

export interface TablePaginationData {
    currentPage: number;
    pageItemNumber: number;
    pageIndex: {
      start: number;
      end: number;
    };
    setPageItemsNumber: React.Dispatch<React.SetStateAction<number>>;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    previousPage: () => void;
    nextPage: () => void;
    getItemIndex: (index: number) => number;
    getCurrentPageData: () => any[]; // O reemplaza 'any' con el tipo de los elementos del array 'data'
  }

export const useTablePagination = (data : any[]) : TablePaginationData => {
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [pageItemNumber, setPageItemsNumber] = useState<number>(20)
    const [pageIndex, setPageIndex] = useState({
        start: 0,
        end: 19
    })
    function nextPage() {
        if (pageIndex.end < data.length) {
            setCurrentPage(currentPage + 1)
        }
    }
    function previousPage() {
        if (!(currentPage <= 1)) {
            setCurrentPage(currentPage - 1)
        }
    }
    function getItemIndex (index : number){
        const itemIndex = (index + 1) + ((currentPage - 1) * pageItemNumber)
        return itemIndex
    }
    function getCurrentPageData () {
        const currentPageData = data.slice(pageIndex.start, pageIndex.end)
        return currentPageData
    }
    useEffect(() => {
        setPageIndex({
            start: (currentPage - 1) * pageItemNumber,
            end: (currentPage * pageItemNumber)
        })
    }, [currentPage])

    return {currentPage,pageItemNumber,pageIndex,setPageItemsNumber,setCurrentPage,previousPage,nextPage,getItemIndex,getCurrentPageData}
}