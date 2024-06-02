import { addFilter } from '@wordpress/hooks'
import { InspectorControls } from '@wordpress/block-editor'
import { Panel, PanelBody, ToggleControl, PanelRow } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { createHigherOrderComponent } from '@wordpress/compose'
import './block-options.css'

// List of blocks that will be modified to include the new attributes.
const supportedBlocks = [
	'core/paragraph',
	'core/heading',
	'core/list',
	'core/image',
	'core/quote',
	'core/separator',
	'core/spacer',
	'core/cover',
	'core/file',
	'core/video',
	'core/audio',
	'core/columns',
	'core/column',
	'core/button',
	'core/media-text',
	'core/shortcode',
	'core/pullquote',
	'core/table',
	'core/preformatted',
	'core/code',
	'core/html',
	'core/page-list',
	'core/navigation',
]

// Add the new attributes to the supported blocks.
addFilter(
	'blocks.registerBlockType',
	'wp-pattern-friend/modify-block-options-attributes', (settings, name) => {
		if ( !supportedBlocks.includes(name) ) {
			return settings
		}

		return {
			...settings,
			attributes: {
				...settings.attributes,
				'wp_pf_hide_on_mobile': {
					type: 'boolean',
					default: false,
				},
				'wp_pf_hide_on_tablet': {
					type: 'boolean',
					default: false,
				},
				'wp_pf_hide_on_computer': {
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
			'wp_pf_hide_on_mobile': wp_pf_hide_on_mobile,
			'wp_pf_hide_on_tablet': wp_pf_hide_on_tablet,
			'wp_pf_hide_on_computer': wp_pf_hide_on_computer,
		},
		setAttributes,
	} = props

	return (
		<InspectorControls>
			<Panel header="WP Pattern Friend">
				<PanelBody title={__("Device Visibility")}>
					<PanelRow>
						<ToggleControl
							label={__("Hide on mobile")}
							checked={ wp_pf_hide_on_mobile }
							onChange={ () => setAttributes( { 'wp_pf_hide_on_mobile': ! wp_pf_hide_on_mobile } ) }
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label={__("Hide on tablet")}
							checked={ wp_pf_hide_on_tablet }
							onChange={ () => setAttributes( { 'wp_pf_hide_on_tablet': ! wp_pf_hide_on_tablet } ) }
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label={__("Hide on computer")}
							checked={ wp_pf_hide_on_computer }
							onChange={ () => setAttributes( { 'wp_pf_hide_on_computer': ! wp_pf_hide_on_computer } ) }
						/>
					</PanelRow>
					{wp_pf_hide_on_mobile && wp_pf_hide_on_tablet && wp_pf_hide_on_computer && (
						<PanelRow>
							<p style={{ color: 'red' }}>You're hiding the block on all devices.</p>
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
            // Check if the block is supported
            if ( !supportedBlocks.includes(props.name) ) {
                return <BlockEdit { ...props } />
            }

            // Get the current attributes
            const { attributes } = props
            const { wp_pf_hide_on_mobile, wp_pf_hide_on_tablet, wp_pf_hide_on_computer } = attributes

			let wrappedElement = <BlockEdit { ...props } />
			if (wp_pf_hide_on_mobile || wp_pf_hide_on_tablet || wp_pf_hide_on_computer) {
				let wrapperElementClasses = ''
				if (wp_pf_hide_on_mobile) wrapperElementClasses += ' wp-pf-hide-on-mobile'
				if (wp_pf_hide_on_tablet) wrapperElementClasses += ' wp-pf-hide-on-tablet'
				if (wp_pf_hide_on_computer) wrapperElementClasses += ' wp-pf-hide-on-desktop'
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

