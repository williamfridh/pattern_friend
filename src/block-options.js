import { addFilter } from '@wordpress/hooks'
import { InspectorControls } from '@wordpress/block-editor'
import { Panel, PanelBody, ToggleControl, PanelRow } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { createHigherOrderComponent } from '@wordpress/compose'
import { Notice } from '@wordpress/components'

// Add the new attributes to the supported blocks.
addFilter(
	'blocks.registerBlockType',
	'wp-pattern-friend/modify-block-options-attributes', (settings, name) => {
		return {
			...settings,
			attributes: {
				...settings.attributes,
				'pf_hide_on_mobile': {
					type: 'boolean',
					default: false,
				},
				'pf_hide_on_tablet': {
					type: 'boolean',
					default: false,
				},
				'pf_hide_on_computer': {
					type: 'boolean',
					default: false,
				},
			},
		}
	}
)

// Generate the block edit function.
function Edit(props) {
	const {
		attributes: {
			'pf_hide_on_mobile': pf_hide_on_mobile,
			'pf_hide_on_tablet': pf_hide_on_tablet,
			'pf_hide_on_computer': pf_hide_on_computer,
		},
		setAttributes,
	} = props

	return (
		<InspectorControls>
			<Panel header="Pattern Friend">
				<PanelBody title={__("Device Visibility")}>
					<PanelRow>
						<ToggleControl
							label={__("Hide on mobile")}
							checked={ pf_hide_on_mobile }
							onChange={ () => setAttributes( { 'pf_hide_on_mobile': ! pf_hide_on_mobile } ) }
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label={__("Hide on tablet")}
							checked={ pf_hide_on_tablet }
							onChange={ () => setAttributes( { 'pf_hide_on_tablet': ! pf_hide_on_tablet } ) }
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label={__("Hide on computer")}
							checked={ pf_hide_on_computer }
							onChange={ () => setAttributes( { 'pf_hide_on_computer': ! pf_hide_on_computer } ) }
						/>
					</PanelRow>
					{pf_hide_on_mobile && pf_hide_on_tablet && pf_hide_on_computer && (
						<PanelRow>
							<Notice status="warning" isDismissible={false}>You're hiding the block on all devices.</Notice>
						</PanelRow>
					)}
				</PanelBody>
			</Panel>
		</InspectorControls>
	)
}

// Add the new attributes to the block edit component.
addFilter(
    'editor.BlockEdit',
    'wp-pattern-friend/add-device-visibility-controls',
    createHigherOrderComponent( BlockEdit => {
        return props => {

            // Get the current attributes
            const { attributes } = props
            const { pf_hide_on_mobile, pf_hide_on_tablet, pf_hide_on_computer } = attributes

			let wrappedElement = <BlockEdit { ...props } />
			if (pf_hide_on_mobile || pf_hide_on_tablet || pf_hide_on_computer) {
				let wrapperElementClasses = `
					${pf_hide_on_mobile ? ' pf-hide-on-mobile' : ''}
					${pf_hide_on_tablet ? ' pf-hide-on-tablet' : ''}
					${pf_hide_on_computer ? ' pf-hide-on-desktop' : ''}
					`
				wrappedElement = <div className={wrapperElementClasses}>{wrappedElement}</div>
			}

            // Render the block edit component
            return(
				<>
					<Edit { ...props } />
					{wrappedElement}
				</>
			)
        }
    }),
)

