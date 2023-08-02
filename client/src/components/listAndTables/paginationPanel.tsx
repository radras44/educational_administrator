import { TablePaginationData } from "@/utils/customHooks";
import { NavigateBefore, NavigateNext } from "@mui/icons-material";
import { Box, Typography, Button } from "@mui/material";

interface PaginationPanelProps {
    pagination : TablePaginationData,
    data : any[]
}

export default function PaginationPanel(props : PaginationPanelProps) {
    return (
        <Box
        sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
            mr: 10
        }}
        >
            <Typography variant="subtitle1">cantidad - {props.data.length} - pagina - {props.pagination.currentPage}</Typography>
            <Button onClick={props.pagination.previousPage}>{<NavigateBefore fontSize="large" />}</Button>
            <Button onClick={props.pagination.nextPage}>{<NavigateNext fontSize="large" />}</Button>
        </Box>
    )
}