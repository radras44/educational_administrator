"use client"
import { Box, Grid, Typography } from '@mui/material'
import { useSessionContext } from '../providers/sessionProvider'
import { useRouter } from 'next/navigation'
import { sxCenteredContainer} from '@/sxStyles/sxStyles'
export default function Dashboard() {
  const router = useRouter()
  const sessionContext = useSessionContext()
  if (sessionContext && sessionContext.session) {
    return (
      <Grid container>
        <Grid item xs={12}>
          <Box sx={{ ...sxCenteredContainer(),height : 350, flexDirection: "column", m: 2 }}>
            <Typography align='center' variant='h2'>Bienvenido</Typography>
          </Box>
        </Grid>
      </Grid>
    )
  } else {
    router.push("/")
  }
}
