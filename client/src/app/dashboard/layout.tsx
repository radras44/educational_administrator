import Navbar from '@/components/bars/navbar'
import { ThemeContainer } from '@/utils/themes'
import { Container } from '@mui/material'
import ThemeProvider from '@mui/material'
export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ThemeContainer>
            <Navbar />
            {children}
        </ThemeContainer>
    )
}
