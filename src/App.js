// Importing required components
import Hero from './components/Hero'
import DeviceVisibilityThresholdsForm from './components/DeviceVisibilityThresholdsForm'
import HeaderFooterForm from './components/HeaderFooterForm'
import { Panel } from '@wordpress/components'
import ReadDynamicCSS from './components/ReadDynamicCss'

// App component
const App = () => {
    return (
        <>
            <Hero />
            <Panel header="Options">
                <DeviceVisibilityThresholdsForm />
                <HeaderFooterForm />
            </Panel>
            <Panel header="Tools">
                <ReadDynamicCSS />
            </Panel>
        </>
    )
}

export default App

