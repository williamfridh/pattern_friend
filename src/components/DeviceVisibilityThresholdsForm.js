import { useEffect } from 'react'
import { useState } from '@wordpress/element'
import { __experimentalNumberControl as NumberControl } from '@wordpress/components';
import { PanelBody, PanelRow, Button, Notice } from '@wordpress/components'
import SaveIcon from '../icons/save.svg';

const DeviceVisibilityThresholdsForm = () => {

	const [mobileMaxThreshold, setMobileMaxThreshold] = useState('')
	const [tabletMaxThreshold, setTabletMaxThreshold] = useState('')
	const [error, setError] = useState('')
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		/**
		 * Initialize the options fields with the data received from the REST API
		 * endpoint provided by the plugin.
		 */
		wp.apiFetch({path: '/wp-pattern-friend/v2/options/block_visibility'}).
			then(data => {
					//Set the new values of the options in the state
					setMobileMaxThreshold(data['pf_mobile_max_threshold'])
					setTabletMaxThreshold(data['pf_tablet_max_threshold'])
				},
			);
	}, [])

	/**
	 * Handle errors.
	 */
	useEffect(() => {
		if (parseInt(mobileMaxThreshold) > parseInt(tabletMaxThreshold)) setError('The mobile threshold must be less than the tablet threshold.')
		else if (mobileMaxThreshold === tabletMaxThreshold) setError('The thresholds should not be the same. Equal thresholds will lead to no tablet support.')
		else setError('')
	}, [mobileMaxThreshold, tabletMaxThreshold])

	/**
	 * Handle input changes.
	 */
	const handleMobileMaxThresholdChange = (value) => {
		if (parseInt(value) < 0) value = 0
		setMobileMaxThreshold(value)
	}
	const handleTabletMaxThresholdChange = (value) => {
		if (parseInt(value) < 0) value = 0
		setTabletMaxThreshold(value)
	}

	/**
	 * Handle submit.
	 */
	const handleSubmit = () => {
		wp.apiFetch({
			path: '/wp-pattern-friend/v2/options/block_visibility',
			method: 'POST',
			data: {
				'pf_mobile_max_threshold': mobileMaxThreshold,
				'pf_tablet_max_threshold': tabletMaxThreshold,
			},
		}).then(data => {
			alert('Options saved successfully!')
		})
	}

	return (
			<PanelBody title="Device Visibility Thresholds">

				<PanelRow>
					<NumberControl
						label="Mobile Max Threshold"
						help="The maximum width in pixels for mobile devices."
						value={mobileMaxThreshold}
						onChange={handleMobileMaxThresholdChange}
						type="number"
					/>
				</PanelRow>

				<PanelRow>
					<NumberControl
						label="Tablet Max Threshold"
						help="The maximum width in pixels for tablet devices."
						value={tabletMaxThreshold}
						onChange={handleTabletMaxThresholdChange}
						type="number"
					/>
				</PanelRow>

				<PanelRow>
					<Button onClick={handleSubmit} variant='primary' icon={<img src={SaveIcon} alt="Icon representing save action" />}>Save</Button>
				</PanelRow>

				{mobileMaxThreshold === tabletMaxThreshold && <PanelRow><Notice status="warning">The thresholds should not be the same. Equal thresholds will lead to no tablet support.</Notice></PanelRow>}
				{error !== '' && <PanelRow><Notice status="error">{error}</Notice></PanelRow>}
			
			</PanelBody>
	)

}
export default DeviceVisibilityThresholdsForm

