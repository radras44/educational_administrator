import { Box, BoxProps, Typography } from "@mui/material"

function Title(props: { children: React.ReactNode }) {
    return (
        <Typography
            sx={{
                borderBottom: 1,
                borderBottomColor: "primary.main",
                color: "primary.main"
            }}
            variant="h5">{props.children}</Typography>
    )
}

function KeyValueItem({ itemKey, value, colors }: { itemKey: string, value: string | undefined, colors?: [string, string] }) {
    return (
        <Box>
            <Typography
                component="span"
                variant="subtitle1"
                sx={
                    colors && colors.length === 2 ?
                        { color: colors[0] }
                        :
                        { color: "text.primary" }
                }
            >{itemKey}</Typography>
            <Typography
                component="span"
                variant="subtitle1"
                sx={
                    colors && colors.length === 2 ?
                        { color: colors[1] }
                        :
                        { color: "text.secondary" }
                }
            >{
                    value ?
                        value : "No Asignado"
                }</Typography>
        </Box>
    )
}

function List({ children }: { children: React.ReactNode }) {
    return (
        <Box sx={{
            ml: 5,
            mt: 2,
            mb:2
        }}>
            {children}
        </Box>
    )
}

export default {Title,List,KeyValueItem}
