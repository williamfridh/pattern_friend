import { addFilter } from '@wordpress/hooks'
import { InspectorControls } from '@wordpress/block-editor'
import { Panel, PanelBody, ToggleControl, PanelRow, SelectControl, ColorPicker } from '@wordpress/components'
import { __experimentalNumberControl as NumberControl } from '@wordpress/components';
import { __experimentalInputControl as InputControl } from '@wordpress/components';
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
				'pf_hidable_button_text': {
					type: 'string',
					default: 'x',
				},			
				'pf_hidable_button_text_color': {
					type: 'string',
					default: '#fff',
				},			
				'pf_hidable_button_background_color': {
					type: 'string',
					default: '#ff0000',
				},
				'pf_hidable_button_height': {
					type: 'number',
					default: 30,
				},
				'pf_hidable_button_width': {
					type: 'number',
					default: 30,
				},
				'pf_hidable_button_position': {
					type: 'string',
					default: 'inline',
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
			'pf_hidable_button_text': pf_hidable_button_text,
			'pf_hidable_button_text_color': pf_hidable_button_text_color,
			'pf_hidable_button_background_color': pf_hidable_button_background_color,
			'pf_hidable_button_height': pf_hidable_button_height,
			'pf_hidable_button_width': pf_hidable_button_width,
			'pf_hidable_button_position': pf_hidable_button_position,
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
						<>
							<PanelRow>
								<InputControl
									label="Button Text"
									value={pf_hidable_button_text}
									onChange={(value) => setAttributes({ 'pf_hidable_button_text': value })}
								/>
							</PanelRow>
							<PanelRow>
								<ColorPicker
									label="Button Text Color"
									enableAlpha
									defaultValue={pf_hidable_button_text_color}
									onChange={(value) => setAttributes({ 'pf_hidable_button_text_color': value })}
								/>
							</PanelRow>
							<PanelRow>
								<ColorPicker
									label="Button Background Color"
									enableAlpha
									defaultValue={pf_hidable_button_background_color}
									onChange={(value) => setAttributes({ 'pf_hidable_button_background_color': value })}
								/>
							</PanelRow>
							<PanelRow>
								<NumberControl
									label="Button Height"
									value={pf_hidable_button_height}
									onChange={(value) => setAttributes({ 'pf_hidable_button_height': value })}
								/>
							</PanelRow>
							<PanelRow>
								<NumberControl
									label="Button Width"
									value={pf_hidable_button_width}
									onChange={(value) => setAttributes({ 'pf_hidable_button_width': value })}
								/>
							</PanelRow>
							<PanelRow>
								<SelectControl
									label="Button Position"
									value={pf_hidable_button_position}
									options={[
										{ label: 'Inline', value: 'inline' },
										{ label: 'Top Right', value: 'top-right' },
										{ label: 'Top Left', value: 'top-left' },
										{ label: 'Bottom Right', value: 'bottom-right' },
										{ label: 'Bottom Left', value: 'bottom-left' },
									]}
									onChange={(value) => setAttributes({ 'pf_hidable_button_position': value })}
								/>
							</PanelRow>
						</>
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

