import {useState} from "react"
export function useTopPanelSection (sectionGroupName : string) {
    const storageSection = Number(window.localStorage.getItem(sectionGroupName+"currentPage"))
    console.log("storageSection:",storageSection)
    const [current, setCurrent] = useState<number>(isNaN(storageSection) ? 0 : storageSection)
    return {current,setCurrent}
}

export function useModal () {
    const [show,setShow] = useState<boolean>(false)
    function open() { setShow(true) }
    function close() { setShow(false) }
    return {show,open,close}
}