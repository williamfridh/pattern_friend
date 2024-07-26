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
			
				'pattern_friend_hidable_group': {
					type: 'boolean',
					default: false,
				},
			
				'pattern_friend_id': {
					type: 'string',
					default: '',
				},
			}

		// Add additional attributes to the core/button block.
		if (name == 'core/button')
			settings.attributes = {
				...settings.attributes,
				
				'pattern_friend_hidable_group_button': {
					type: 'boolean',
					default: false,
				},
				'pattern_friend_hidable_group_button_hide_duration': {
					type: 'number',
					default: 0, // Set in hours
				},
			}

		// Add additional attributes to all blocks.
		settings.attributes = {
			...settings.attributes,

			'pattern_friend_hide_on_mobile': {
				type: 'boolean',
				default: false,
			},
			'pattern_friend_hide_on_tablet': {
				type: 'boolean',
				default: false,
			},
			'pattern_friend_hide_on_computer': {
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
			'pattern_friend_hide_on_mobile': pattern_friend_hide_on_mobile,
			'pattern_friend_hide_on_tablet': pattern_friend_hide_on_tablet,
			'pattern_friend_hide_on_computer': pattern_friend_hide_on_computer,
		},
		setAttributes,
	} = props

	return (
				<PanelBody title={__("Device Visibility")}>
					<PanelRow>
						<ToggleControl
							label={__("Hide on mobile")}
							checked={ pattern_friend_hide_on_mobile }
							onChange={ () => setAttributes( { 'pattern_friend_hide_on_mobile': ! pattern_friend_hide_on_mobile } ) }
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label={__("Hide on tablet")}
							checked={ pattern_friend_hide_on_tablet }
							onChange={ () => setAttributes( { 'pattern_friend_hide_on_tablet': ! pattern_friend_hide_on_tablet } ) }
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label={__("Hide on computer")}
							checked={ pattern_friend_hide_on_computer }
							onChange={ () => setAttributes( { 'pattern_friend_hide_on_computer': ! pattern_friend_hide_on_computer } ) }
						/>
					</PanelRow>
					{pattern_friend_hide_on_mobile && pattern_friend_hide_on_tablet && pattern_friend_hide_on_computer && (
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
			'pattern_friend_hidable_group': pattern_friend_hidable_group,
			'pattern_friend_id': pattern_friend_id,
		},
		setAttributes,
	} = props

	const setRandomId = () => {
		setAttributes( { 'pattern_friend_id': Math.random().toString(36) } )
	}

	return (
				<PanelBody title={__("Hidable Settings")}>
					<PanelRow>
						<ToggleControl
							label={__("Make Hidable")}
							help={__("Make this element hidable (requires an child button marked as a closing button).")}
							checked={ pattern_friend_hidable_group }
							onChange={ () => setAttributes( { 'pattern_friend_hidable_group': ! pattern_friend_hidable_group } ) }
						/>
					</PanelRow>
					{pattern_friend_hidable_group && (
						<>
							<PanelRow>
								<InputControl
									label={__("Closing ID")}
									help={__("Set a ID for the element. Note that multiple elements can share an same ID.")}
									value={pattern_friend_id}
									onChange={ (value) => setAttributes( { 'pattern_friend_id': value } ) }
								/>
							</PanelRow>
							<PanelRow>
								<Button variant="secondary" onClick={ () => {setRandomId()} }>Generate Random ID</Button>
							</PanelRow>
							{!pattern_friend_id && (
								<PanelRow>
									<Notice status="warning" isDismissible={false}>A closing ID is required to make the element hidable.</Notice>
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
			'pattern_friend_hidable_group_button': pattern_friend_hidable_group_button,
			'pattern_friend_hidable_group_button_hide_duration': pattern_friend_hidable_group_button_hide_duration,
		},
		setAttributes,
	} = props

	const handleHideDurationChange = (value) => {
		value = parseInt(value)
		if (value < 0)
			value = '0'
		setAttributes( { 'pattern_friend_hidable_group_button_hide_duration': value } )
	}

	return (
				<PanelBody title={__("Hidable Settings")}>
					<PanelRow>
						<ToggleControl
							label={__("Assign As Hiding Button")}
							help={__("Mark this button as an element hiding button. Note that is has to be a child of an element marked as hidable.")}
							checked={ pattern_friend_hidable_group_button }
							onChange={ () => setAttributes( { 'pattern_friend_hidable_group_button': ! pattern_friend_hidable_group_button } ) }
						/>
					</PanelRow>
					{pattern_friend_hidable_group_button && (
						<>
							<PanelRow>
								<NumberControl
									label={__("Hide Duration (hours)")}
									help={__("Set the duration for the element to be hidden in hours.")}
									value={pattern_friend_hidable_group_button_hide_duration}
									onChange={ handleHideDurationChange }
								/>
							</PanelRow>
							{pattern_friend_hidable_group_button_hide_duration == '0' && (
								<PanelRow>
									<Notice status="warning" isDismissible={false}>A hide duration is required to make the element hidable.</Notice>
								</PanelRow>
							)}
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
            const { pattern_friend_hide_on_mobile, pattern_friend_hide_on_tablet, pattern_friend_hide_on_computer } = attributes

			let wrappedElement = <BlockEdit { ...props } />
			if (pattern_friend_hide_on_mobile || pattern_friend_hide_on_tablet || pattern_friend_hide_on_computer) {
				let wrapperElementClasses = `
					${pattern_friend_hide_on_mobile ? ' pf-hide-on-mobile' : ''}
					${pattern_friend_hide_on_tablet ? ' pf-hide-on-tablet' : ''}
					${pattern_friend_hide_on_computer ? ' pf-hide-on-desktop' : ''}
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