import { useEffect } from 'react'
import { useState } from '@wordpress/element'
import {
	PanelBody,
	PanelRow,
	Button,
	CheckboxControl,
	Notice,
} from '@wordpress/components'
import { ReactComponent as SaveIcon } from '../icons/save.svg';
import FormLoadingOverlay from './FormLoadingOverlay';

const HeaderFooterForm = () => {

	const [stickyHeader, setStickyHeader] = useState()
	const [error, setError] = useState('')
	const [isLoading, setIsLoading] = useState(true)
	const [isComplete, setIsComplete] = useState(false)

	useEffect(() => {
		/**
		 * Initialize the options fields with the data received from the REST API
		 * endpoint provided by the plugin.
		 */
		wp.apiFetch({path: '/wp-pattern-friend/v2.2/options/header_footer'}).
			then(data => {
					//Set the new values of the options in the state
					setStickyHeader(data['pattern_friend_header_sticky'])
					setIsLoading(false)
				},
			);
	}, [])

	/**
	 * Handle input changes.
	 */
	const handleStickyHeader = (value) => {
		if (value)
			setStickyHeader('true')
		else
			setStickyHeader('false')
	}

	/**
	 * Handle submit.
	 */
	const handleSubmit = () => {
		setIsLoading(true)
		wp.apiFetch({
			path: '/wp-pattern-friend/v2.2/options/header_footer',
			method: 'POST',
			data: {
				'pattern_friend_header_sticky': stickyHeader,
			},
		}).then(data => {
			setIsLoading(false)
			setIsComplete(true)
		})
	}

	return (
			<PanelBody title="Header">

				<div className={isLoading && `pf-form-loading`}>

					<PanelRow>
						<CheckboxControl
							label="Sticky Header"
							help="Want the header (logo & navigation) to stick to the top of the page when scrolling? Note that this functionality is limited to the theme."
							checked={ stickyHeader == 'true' ? true : false}
							onChange={handleStickyHeader}
						/>
					</PanelRow>

					<PanelRow>
						<Button onClick={handleSubmit} variant='primary' icon={<SaveIcon />}>Save</Button>
					</PanelRow>

					{isComplete && <PanelRow><Notice status="success">Options saved successfully!</Notice></PanelRow>}

				</div>

				{isLoading && <FormLoadingOverlay />}
			
			</PanelBody>
	)

}
export default HeaderFooterForm

