import { useSessionContext } from "@/app/providers/sessionProvider";
import { useTablePagination } from "@/utils/customHooks";
import { ToggleSection } from "@/utils/interfaces/interfaces";
import { NavigateBefore, NavigateNext } from "@mui/icons-material";
import MuiTable from "@mui/material/Table"
import { Box, Button, TableBody, TableCell, TableContainer, TableHead, TableRow, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { red, blueGrey, purple, green, orange, blue, grey } from "@mui/material/colors";
import { useTheme } from "@mui/material/styles"
import { SxProps } from "@mui/material"

function Container(props: { children: React.ReactNode }) {
    return (
        <Box sx={{
            width: "100%"
        }}>{props.children}</Box>
    )
}

const sectionColors: { [key: string]: { color: string, backgroundColor: string } } = {
    red: { color: red[900], backgroundColor: red[50] },
    purple: { color: purple[900], backgroundColor: purple[50] },
    blue: { color: blue[900], backgroundColor: blue[50] },
    green: { color: green[900], backgroundColor: green[50] },
    orange: { color: orange[900], backgroundColor: orange[50] },
}


interface TopPanelProps {
    sections: ToggleSection[],
    setCurrentSection: React.Dispatch<React.SetStateAction<number>>
    currentSection: number
    sectionGroupName : string
}
function TopPanel(props: TopPanelProps) {
    const theme = useTheme()
    function handleChange(event: React.MouseEvent<HTMLElement>, value: number) {
        if (value !== null) {
            props.setCurrentSection(value)
            window.localStorage.setItem(props.sectionGroupName+"currentPage", String(value))
        }
    }
    const sessionContext = useSessionContext()
    console.log("theming", theme.breakpoints.up("lg"))
    return (
        <Box sx={{
            width: "100%"
        }}>
            <ToggleButtonGroup
                value={props.currentSection}
                onChange={handleChange}
                orientation="vertical"
                exclusive
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4,1fr)",
                    [theme.breakpoints.down("lg")]: { gridTemplateColumns: "repeat(3,1fr)" },
                    [theme.breakpoints.down("md")]: { gridTemplateColumns: "repeat(2,1fr)" }
                }}
            >
                {props.sections.map((section, index) => (
                    sessionContext.permisos.some((permiso) => section.requiredPerm.includes(permiso)) ?
                        <ToggleButton key={index} value={index} sx={{
                            ...sectionColors[section.color || "blue"],
                            display: "flex", flexDirection: "row", gap: 2, pr: 2, pl: 2,
                            alignItems: "center", justifyContent: "start"
                        }}>
                            {section.icon}
                            <Typography sx={{ textTransform: "none" }} variant="subtitle1">{section.label}</Typography>
                        </ToggleButton>
                        :
                        null
                ))}
            </ToggleButtonGroup>
        </Box>
    )
}
function Component(props: { children: React.ReactNode }) {
    return (
        <Box sx={{
            width: "100%"
        }}>{props.children}</Box>
    )
}

function ToolBar({ children }: { children: React.ReactNode }) {
    return (
        <Box sx={{
            p: 2,
            display: "flex", flexDirection: "row", justifyContent: "end", gap: 2
        }}>
            {children}
        </Box>
    )
}

interface TableOption {
    action: Function,
    icon: JSX.Element
}

interface TableProps {
    data: any[]
    options?: TableOption[]
    keysToShow: string[]
    keyLabels : string[]
}

export function Table(props: TableProps) {
    console.log("keyLabels",props.keyLabels)
    console.log("keyToShow",props.keysToShow)
    if(props.keyLabels && props.keysToShow && props.keyLabels.length != props.keysToShow.length){
        throw new Error("keyLabels.length has to be equal to keysToShow.length")
    }
    const theme = useTheme()
    const headCellStyle: SxProps = {
        fontWeight: 600,
        color: "grey.100",
        backgroundColor: "primary.main",
        [theme.breakpoints.down("lg")]: { fontSize: 18 },
        [theme.breakpoints.down("md")]: { fontSize: 16 },
    }
    const cellStyle: SxProps = {
        [theme.breakpoints.down("lg")]: { fontSize: 15 },
        [theme.breakpoints.down("md")]: { fontSize: 13 },
        whiteSpace: "nowrap"
    }
    const paginatorTextStyles: SxProps = {
        [theme.breakpoints.down("lg")]: { fontSize: 14 },
        [theme.breakpoints.down("md")]: { fontSize: 13 },
    }
    const pagination = useTablePagination(props.data)
    return (
        <Box sx={{
            display: "flex", flexDirection: "column", gap: 1
        }}>
            <TableContainer sx={{ height: '60vh' }}>
                <MuiTable stickyHeader>
                    <TableHead>
                        <TableRow >
                            <TableCell sx={headCellStyle}></TableCell>
                            {props.keyLabels.map((label, index) => (
                                <TableCell sx={headCellStyle} key={index}>{label}</TableCell>
                            ))}
                            {
                                props.options && props.options.length > 0 ? 
                                <TableCell sx={headCellStyle} align="center">Acciones</TableCell>
                                : null
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            pagination.getCurrentPageData().map((entityObj, index) => (
                                <TableRow key={index}>
                                    <TableCell
                                        sx={{ ...cellStyle, backgroundColor: "primary.light" }}
                                        align="center"
                                    >{pagination.getItemIndex(index)}</TableCell>
                                    {props.keysToShow.map((key, index) => (
                                        <TableCell
                                            sx={{ ...cellStyle }}
                                            key={index}
                                        >{entityObj[key]}</TableCell>
                                    ))}
                                    {
                                        props.options && props.options.length > 0 ?
                                            <TableCell sx={{
                                                display: "flex",
                                                flexDirection: "row",
                                                justifyContent: "center",
                                                alignItems: "center"
                                            }} align="center">
                                                {props.options.map((option, index) => (
                                                    <Button sx={{
                                                        p: 0
                                                    }} key={index} onClick={() => {
                                                        option.action(entityObj)
                                                    }}>
                                                        {option.icon}
                                                    </Button>
                                                ))}
                                            </TableCell>
                                            : null
                                    }

                                </TableRow>
                            ))}
                    </TableBody>
                </MuiTable>
            </TableContainer>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "flex-end",
                    [theme.breakpoints.down("lg")]: { justifyContent: "center" },
                    alignItems: "center",
                    gap: 2
                }}>
                <Box>
                    <Typography
                        sx={paginatorTextStyles}
                        variant="subtitle1">cantidad - {props.data.length} - pagina - {pagination.currentPage}</Typography>
                </Box>
                <Box>
                    <Button onClick={pagination.previousPage}>{<NavigateBefore fontSize="large" />}</Button>
                    <Button onClick={pagination.nextPage}>{<NavigateNext fontSize="large" />}</Button>
                </Box>
            </Box>
        </Box>
    )
}

function CContainer(props: { children: React.ReactNode }) {
    return (
        <Box sx={{
            display: "flex", flexDirection: "column", width: "100%"
        }}>
            {props.children}
        </Box>
    )
}





export default { Container, TopPanel, Component, ToolBar, Table, CContainer }