import { addFilter } from '@wordpress/hooks'
import { InspectorControls } from '@wordpress/block-editor'
import { PanelBody, ToggleControl, PanelRow } from '@wordpress/components'
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
				'hideOnMobile': {
					type: 'boolean',
					default: false,
				},
				'hideOnTablet': {
					type: 'boolean',
					default: false,
				},
				'hideOnComputer': {
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
			'hideOnMobile': hideOnMobile,
			'hideOnTablet': hideOnTablet,
			'hideOnComputer': hideOnComputer,
		},
		setAttributes,
	} = props

	return (
		<InspectorControls>
			<PanelBody title={__("Device Visibility")}>
				<PanelRow>
					<ToggleControl
						label={__("Hide on mobile")}
						checked={ hideOnMobile }
						onChange={ () => setAttributes( { 'hideOnMobile': ! hideOnMobile } ) }
					/>
				</PanelRow>
				<PanelRow>
					<ToggleControl
						label={__("Hide on tablet")}
						checked={ hideOnTablet }
						onChange={ () => setAttributes( { 'hideOnTablet': ! hideOnTablet } ) }
					/>
				</PanelRow>
				<PanelRow>
					<ToggleControl
						label={__("Hide on computer")}
						checked={ hideOnComputer }
						onChange={ () => setAttributes( { 'hideOnComputer': ! hideOnComputer } ) }
					/>
				</PanelRow>
				{hideOnMobile && hideOnTablet && hideOnComputer && (
					<PanelRow>
						<p style={{ color: 'red' }}>You're hiding the block on all devices.</p>
					</PanelRow>
				)}
			</PanelBody>
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
            const { attributes, setAttributes } = props
            const { hideOnMobile, hideOnTablet, hideOnDesktop } = attributes

			// Remove all old classes.
			let newClassName = props.className ? props.className.replaceAll(/wp-pf-hide-on-mobile|wp-pf-hide-on-tablet|wp-pf-hide-on-desktop/g, '') : ''

            // Add the new classes.
			newClassName += hideOnMobile && ' wp-pf-hide-on-mobile'
			newClassName += hideOnTablet && ' wp-pf-hide-on-tablet'
			newClassName += hideOnDesktop && ' wp-pf-hide-on-desktop'

            // Update the className attribute
            if (newClassName !== props.className) {
                setAttributes({ className: newClassName })
            }

            // Render the block edit component
            return(
				<>
					<Edit { ...props } />
					<BlockEdit { ...props } className={newClassName} />
				</>
			)
        }
    }),
)

