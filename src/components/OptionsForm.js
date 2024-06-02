import { useEffect } from 'react'
import { useState } from '@wordpress/element'
import { Panel, PanelBody, PanelRow, NumberControl, Button } from '@wordpress/components'

const OptionsForm = () => {

	const [mobileMaxThreshold, setMobileMaxThreshold] = useState('')
	const [tabletMaxThreshold, setTabletMaxThreshold] = useState('')

	useEffect(() => {

		/**
		 * Initialize the options fields with the data received from the REST API
		 * endpoint provided by the plugin.
		 */
		wp.apiFetch({path: '/wp-pattern-friend/v1/options'}).
			then(data => {
					//Set the new values of the options in the state
					setMobileMaxThreshold(data['mobile_max_threshold'])
					setTabletMaxThreshold(data['tablet_max_threshold'])
				},
			);
		}, [])

	/**
	 * Handle submit.
	 */
	const handleSubmit = () => {
		wp.apiFetch({
			path: '/wp-pattern-friend/v1/options',
			method: 'POST',
			data: {
				'mobile_max_threshold': mobileMaxThreshold,
				'tablet_max_threshold': tabletMaxThreshold,
			},
		}).then(data => {
			alert('Options saved successfully!')
		})
	}

	return (
		<Panel header="WP Pattern Friend">

			<PanelBody title="Device Visibility">

				<PanelRow>
					<NumberControl
						label="Mobile Max Threshold"
						value={mobileMaxThreshold}
						onChange={(event) => {
							setMobileMaxThreshold(event.target.value);
						}}
						min={0}
					/>
				</PanelRow>

				<PanelRow>
					<NumberControl
						label="Tablet Max Threshold"
						value={tabletMaxThreshold}
						onChange={(event) => {
							setTabletMaxThreshold(event.target.value);
						}}
						min={0}
					/>
				</PanelRow>

				<Button onClick={handleSubmit}>Save</Button>
			
			</PanelBody>

		</Panel>
	)

}
export default OptionsForm

