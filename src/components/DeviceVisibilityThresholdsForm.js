import { useEffect } from 'react'
import { useState } from '@wordpress/element'
import { __experimentalNumberControl as NumberControl } from '@wordpress/components';
import { PanelBody, PanelRow, Button, Notice } from '@wordpress/components'
import { ReactComponent as SaveIcon } from '../icons/save.svg';
import { ReactComponent as ResetIcon } from '../icons/reset.svg';
import defaultSettings from '../../default-settings.json';
import FormLoadingOverlay from './FormLoadingOverlay';

const DeviceVisibilityThresholdsForm = () => {

	const [mobileMaxThreshold, setMobileMaxThreshold] = useState('')
	const [tabletMaxThreshold, setTabletMaxThreshold] = useState('')
	const [error, setError] = useState('')
	const [isLoading, setIsLoading] = useState(true)
	const [isComplete, setIsComplete] = useState(false)

	useEffect(() => {
		/**
		 * Initialize the options fields with the data received from the REST API
		 * endpoint provided by the plugin.
		 */
		wp.apiFetch({path: '/wp-pattern-friend/v2.2/options/block_visibility'}).
			then(data => {
					//Set the new values of the options in the state
					setMobileMaxThreshold(data['pattern_friend_mobile_max_threshold'])
					setTabletMaxThreshold(data['pattern_friend_tablet_max_threshold'])
					setIsLoading(false)
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
		setIsLoading(true)
		wp.apiFetch({
			path: '/wp-pattern-friend/v2.2/options/block_visibility',
			method: 'POST',
			data: {
				'pattern_friend_mobile_max_threshold': mobileMaxThreshold,
				'pattern_friend_tablet_max_threshold': tabletMaxThreshold,
			},
		}).then(data => {
			setIsLoading(false)
			setIsComplete(true)
		})
	}

	/**
	 * Load default settings.
	 */
	const handleLoadDefault = () => {
		const deviceThresholds = defaultSettings.deviceThresholds
		setMobileMaxThreshold(deviceThresholds.mobileMaxThreshold)
		setTabletMaxThreshold(deviceThresholds.tabletMaxThreshold)
	}

	return (
			<PanelBody title="Device Visibility Thresholds">

				<div className={isLoading && `pf-form-loading`}>

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

					<PanelRow className="pf-align-left">
						<Button onClick={handleLoadDefault} variant='secondary' icon={<ResetIcon />}>Load Default</Button>
						<Button onClick={handleSubmit} variant='primary' icon={<SaveIcon />}>Save</Button>
					</PanelRow>

					{mobileMaxThreshold === tabletMaxThreshold && <PanelRow><Notice status="warning">The thresholds should not be the same. Equal thresholds will lead to no tablet support.</Notice></PanelRow>}
					{error !== '' && <PanelRow><Notice status="error">{error}</Notice></PanelRow>}

					{isComplete && <PanelRow><Notice status="success">Options saved successfully!</Notice></PanelRow>}

				</div>

				{isLoading && <FormLoadingOverlay />}
			
			</PanelBody>
	)

}
export default DeviceVisibilityThresholdsForm

