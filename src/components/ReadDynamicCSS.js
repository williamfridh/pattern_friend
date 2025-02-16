import { PanelBody, PanelRow, Button } from '@wordpress/components'
import { ReactComponent as LinkIcon } from '../icons/link.svg';

const ReadDynamicCSS = () => {

	return (
		<PanelBody title="Dynamic CSS">

			<PanelRow>
				<p>If you have issues understanding the effects by Pattern Friend on the front-end, reading the generated (dynamic) CSS file might use useful. Note that this file is based on a template.</p>
			</PanelRow>

			<PanelRow>
				<a href='/wp-content/plugins/pattern-friend/src/styles/dynamic.css' target='_blank'><Button variant='primary' icon={<LinkIcon />}>Open Dynamic CSS File</Button></a>
			</PanelRow>
			
		</PanelBody>
	)

}
export default ReadDynamicCSS

