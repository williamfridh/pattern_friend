import { PanelBody, PanelRow, Button } from '@wordpress/components'
import { ReactComponent as LinkIcon } from '../icons/link.svg';

const ReadDynamicCSS = () => {

	return (
			<PanelBody title="Dynamic CSS">

				<div className={isLoading && `pf-form-loading`}>

					<PanelRow>
						<p>If you have issues understanding the effects by Pattern Friend on the front-end, reading the generated (dynamic) CSS file might use useful. Note that this file is based on a template.</p>
					</PanelRow>

					<PanelRow>
						<Button variant='primary' icon={<LinkIcon />} link='/wp-content/plugins/pattern_friend/src/styles/dynamic.css' target='_blank'>Open Dynamic CSS File</Button>
					</PanelRow>

				</div>
			
			</PanelBody>
	)

}
export default ReadDynamicCSS

