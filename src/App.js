// Importing required components
import Hero from './components/Hero'
import DeviceVisibilityThresholdsForm from './components/DeviceVisibilityThresholdsForm'
import HeaderFooterForm from './components/HeaderFooterForm'
import {
    Card,
    CardHeader,
    __experimentalDivider as Divider,
    __experimentalVStack as VStack,
} from '@wordpress/components'
import ReadDynamicCSS from './components/ReadDynamicCSS'
import ThemeBlockSupport from './components/ThemeBlockSupport'

// App component
const App = () => {
    return (
        <VStack>
            <ThemeBlockSupport />
            <Hero />
            <Card>
                <CardHeader>Options</CardHeader>
                <DeviceVisibilityThresholdsForm />
                <HeaderFooterForm />
            </Card>
            <Card>
                <CardHeader>Tools</CardHeader>
                <ReadDynamicCSS />
            </Card>
        </VStack>
    )
}

export default App

