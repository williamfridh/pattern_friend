import { useEffect } from 'react'
import { useState } from '@wordpress/element'
import { PanelBody, PanelRow, Button, CheckboxControl } from '@wordpress/components'
import SaveIcon from '../icons/save.svg';
import ResetIcon from '../icons/reset.svg';

const HeaderFooterForm = () => {

	const [stickyHeader, setStickyHeader] = useState('0')
	const [error, setError] = useState('')
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		/**
		 * Initialize the options fields with the data received from the REST API
		 * endpoint provided by the plugin.
		 */
		wp.apiFetch({path: '/wp-pattern-friend/v2/options/header_footer'}).
			then(data => {
					//Set the new values of the options in the state
					setStickyHeader(data['pf_header_sticky'])
				},
			);
	}, [])

	/**
	 * Handle input changes.
	 */
	const handleStickyHeader = (value) => {
		if (value)
			setStickyHeader('1')
		else
			setStickyHeader('0')
	}

	/**
	 * Handle submit.
	 */
	const handleSubmit = () => {
		wp.apiFetch({
			path: '/wp-pattern-friend/v2/options/header_footer',
			method: 'POST',
			data: {
				'pf_header_sticky': stickyHeader,
			},
		}).then(data => {
			alert('Options saved successfully!')
		})
	}

	return (
			<PanelBody title="Header">

				<PanelRow>
					<CheckboxControl
						label="Sticky Header"
						help="Want the header (logo & navigation) to stick to the top of the page when scrolling?"
						checked={ stickyHeader == '1' ? true : false}
						onChange={handleStickyHeader}
					/>
				</PanelRow>

				<PanelRow className="pf-align-left">
					<Button variant='secondary' icon={<img src={ResetIcon} alt="Icon representing save action" />}>Load Default</Button>
					<Button onClick={handleSubmit} variant='primary' icon={<img src={SaveIcon} alt="Icon representing save action" />}>Save</Button>
				</PanelRow>
			
			</PanelBody>
	)

}
export default HeaderFooterForm

