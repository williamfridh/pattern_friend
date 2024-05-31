import { useEffect } from 'react'
import { useState } from '@wordpress/element';

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
		<>

			<h2>Options</h2>

			<div>
				<label>Mobile Max Threshold</label>
				<input
					value={mobileMaxThreshold}
					onChange={(event) => {
						setMobileMaxThreshold(event.target.value);
					}}
				/>
			</div>

			<div>
				<label>Tablet Max Threshold</label>
				<input
					value={tabletMaxThreshold}
					onChange={(event) => {
						setTabletMaxThreshold(event.target.value);
					}}
				/>
			</div>

			<button onClick={handleSubmit}>Save</button>

		</>
	)

}
export default OptionsForm

