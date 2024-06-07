import { addFilter } from '@wordpress/hooks'
import { InspectorControls } from '@wordpress/block-editor'
import { Panel, PanelBody, ToggleControl, PanelRow, SelectControl } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { createHigherOrderComponent } from '@wordpress/compose'
import { Notice } from '@wordpress/components'

// Add the new attributes to the supported blocks.
addFilter(
	'blocks.registerBlockType',
	'wp-pattern-friend/modify-block-visibility-attributes', (settings, name) => {
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
				
				'pf_hidable': {
					type: 'boolean',
					default: false,
				},
				'pf_hidable_button': {
					type: 'string',
					default: 'default',
				},
			},
		}
	}
)

/**
 * Generate block device visibility form.
 */
function VisibilityForm(props) {
	const {
		attributes: {
			'pf_hide_on_mobile': pf_hide_on_mobile,
			'pf_hide_on_tablet': pf_hide_on_tablet,
			'pf_hide_on_computer': pf_hide_on_computer,
		},
		setAttributes,
	} = props

	return (
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
	)
}

/**
 * Generate form for setting hidable settings.
 */
function HidableSettingsForm(props) {
	const {
		attributes: {
			'pf_hidable': pf_hidable,
		},
		setAttributes,
	} = props

	return (
				<PanelBody title={__("Hidable Settings")}>
					<PanelRow>
						<ToggleControl
							label={__("Hidable")}
							help={__("Allow the user to hide this block.")}
							checked={ pf_hidable }
							onChange={ () => setAttributes( { 'pf_hidable': ! pf_hidable } ) }
						/>
					</PanelRow>
					{pf_hidable && (
						<PanelRow>
							<SelectControl
								label={__("Hide Button Design")}
								help={__("Select the design of the hide button.")}
								value={props.attributes.pf_hidable_button}
								options={[
									{ label: 'Default', value: 'default' },
									{ label: 'Red Corner Box', value: 'red-corner-box' },
								]}
								onChange={ (value) => setAttributes( { 'pf_hidable_button': value } ) }
							/>
						</PanelRow>	
					)}
				</PanelBody>
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
					<InspectorControls>
						<Panel header="Pattern Friend">
							<VisibilityForm { ...props } />
							<HidableSettingsForm { ...props } />
						</Panel>
					</InspectorControls>
					{wrappedElement}
				</>
			)
        }
    }),
)

