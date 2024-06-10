import { addFilter } from '@wordpress/hooks'
import { InspectorControls } from '@wordpress/block-editor'
import { Panel, PanelBody, ToggleControl, PanelRow } from '@wordpress/components'
import { __experimentalNumberControl as NumberControl } from '@wordpress/components';
import { __experimentalInputControl as InputControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n'
import { createHigherOrderComponent } from '@wordpress/compose'
import { Notice } from '@wordpress/components'
import { Button } from '@wordpress/components';

// Add the new attributes to the supported blocks.
addFilter(
	'blocks.registerBlockType',
	'wp-pattern-friend/modify-block-visibility-attributes', (settings, name) => {

		// Add additional attributes to the core/group block.
		if (name == 'core/group')
			settings.attributes = {
				...settings.attributes,
			
				'pf_hidable_group': {
					type: 'boolean',
					default: false,
				},
			
				'pf_id': {
					type: 'string',
					default: '',
				},
			}

		// Add additional attributes to the core/button block.
		if (name == 'core/button')
			settings.attributes = {
				...settings.attributes,
				
				'pf_hidable_group_button': {
					type: 'boolean',
					default: false,
				},
				'pf_hidable_group_button_hide_duration': {
					type: 'number',
					default: 0, // Set in hours
				},
			}

		// Add additional attributes to all blocks.
		settings.attributes = {
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
		}

		// Return the modified settings.
		return settings
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
 * Generate form for group hidability.
 */
function HidableGroupForm(props) {
	const {
		attributes: {
			'pf_hidable_group': pf_hidable_group,
			'pf_id': pf_id,
		},
		setAttributes,
	} = props

	const setRandomId = () => {
		setAttributes( { 'pf_id': Math.random().toString(36) } )
	}

	return (
				<PanelBody title={__("Hidable Settings")}>
					<PanelRow>
						<ToggleControl
							label={__("Make Group Hidable")}
							help={__("Make this group hidable (requires an child button marked as a group closing button).")}
							checked={ pf_hidable_group }
							onChange={ () => setAttributes( { 'pf_hidable_group': ! pf_hidable_group } ) }
						/>
					</PanelRow>
					{pf_hidable_group && (
						<>
							<PanelRow>
								<InputControl
									label={__("Group ID")}
									help={__("Set a ID for the group. Note that multiple groups can share an same ID.")}
									value={pf_id}
									onChange={ (value) => setAttributes( { 'pf_id': value } ) }
								/>
							</PanelRow>
							<PanelRow>
								<Button variant="secondary" onClick={ () => {setRandomId()} }>Generate Random ID</Button>
							</PanelRow>
							{!pf_id && (
								<PanelRow>
									<Notice status="warning" isDismissible={false}>A unique ID is required to make the group hidable.</Notice>
								</PanelRow>
							)}
						</>
					)}
				</PanelBody>
	)
}

/**
 * Generate a form for group closing button.
 */
function HidableGroupButtonForm(props) {
	const {
		attributes: {
			'pf_hidable_group_button': pf_hidable_group_button,
			'pf_hidable_group_button_hide_duration': pf_hidable_group_button_hide_duration,
		},
		setAttributes,
	} = props

	return (
				<PanelBody title={__("Hidable Groups")}>
					<PanelRow>
						<ToggleControl
							label={__("Assign As Hiding Button")}
							help={__("Mark this button as a group hiding button. Note that is has to be a child of a group marked as hidable.")}
							checked={ pf_hidable_group_button }
							onChange={ () => setAttributes( { 'pf_hidable_group_button': ! pf_hidable_group_button } ) }
						/>
					</PanelRow>
					{pf_hidable_group_button && (
						<PanelRow>
							<NumberControl
								label={__("Hide Duration (hours)")}
								help={__("Set the duration for the group to be hidden in hours.")}
								value={pf_hidable_group_button_hide_duration}
								onChange={ (value) => setAttributes( { 'pf_hidable_group_button_hide_duration': value } ) }
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
							{props.name == 'core/group' && <HidableGroupForm { ...props } />}
							{props.name == 'core/button' && <HidableGroupButtonForm { ...props } />}
						</Panel>
					</InspectorControls>
					{wrappedElement}
				</>
			)
        }
    }),
)