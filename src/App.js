// Importing required components
import Hero from './components/Hero'
import DeviceVisibilityThresholdsForm from './components/DeviceVisibilityThresholdsForm'
import HeaderFooterForm from './components/HeaderFooterForm'
import { Panel } from '@wordpress/components'

// App component
const App = () => {
    return (
        <>
            <Hero />
            <Panel header="Options">
                <DeviceVisibilityThresholdsForm />
                <HeaderFooterForm />
            </Panel>
        </>
    )
}

export default App

