/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

module.exports = window["React"];

/***/ }),

/***/ "@wordpress/block-editor":
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
/***/ ((module) => {

module.exports = window["wp"]["blockEditor"];

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/***/ ((module) => {

module.exports = window["wp"]["components"];

/***/ }),

/***/ "@wordpress/compose":
/*!*********************************!*\
  !*** external ["wp","compose"] ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["wp"]["compose"];

/***/ }),

/***/ "@wordpress/hooks":
/*!*******************************!*\
  !*** external ["wp","hooks"] ***!
  \*******************************/
/***/ ((module) => {

module.exports = window["wp"]["hooks"];

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["i18n"];

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!****************************************!*\
  !*** ./src/block-editor-extensions.js ***!
  \****************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/hooks */ "@wordpress/hooks");
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_hooks__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/compose */ "@wordpress/compose");
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_compose__WEBPACK_IMPORTED_MODULE_5__);











// Add the new attributes to the supported blocks.
(0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_1__.addFilter)('blocks.registerBlockType', 'wp-pattern-friend/modify-block-visibility-attributes', (settings, name) => {
  // Add additional attributes to the core/group block.
  if (name == 'core/group') settings.attributes = {
    ...settings.attributes,
    'pf_hidable_group': {
      type: 'boolean',
      default: false
    },
    'pf_id': {
      type: 'string',
      default: ''
    }
  };

  // Add additional attributes to the core/button block.
  if (name == 'core/button') settings.attributes = {
    ...settings.attributes,
    'pf_hidable_group_button': {
      type: 'boolean',
      default: false
    },
    'pf_hidable_group_button_hide_duration': {
      type: 'number',
      default: 0 // Set in hours
    }
  };

  // Add additional attributes to all blocks.
  settings.attributes = {
    ...settings.attributes,
    'pf_hide_on_mobile': {
      type: 'boolean',
      default: false
    },
    'pf_hide_on_tablet': {
      type: 'boolean',
      default: false
    },
    'pf_hide_on_computer': {
      type: 'boolean',
      default: false
    }
  };

  // Return the modified settings.
  return settings;
});

/**
 * Generate block device visibility form.
 */
function VisibilityForm(props) {
  const {
    attributes: {
      'pf_hide_on_mobile': pf_hide_on_mobile,
      'pf_hide_on_tablet': pf_hide_on_tablet,
      'pf_hide_on_computer': pf_hide_on_computer
    },
    setAttributes
  } = props;
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)("Device Visibility")
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelRow, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)("Hide on mobile"),
    checked: pf_hide_on_mobile,
    onChange: () => setAttributes({
      'pf_hide_on_mobile': !pf_hide_on_mobile
    })
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelRow, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)("Hide on tablet"),
    checked: pf_hide_on_tablet,
    onChange: () => setAttributes({
      'pf_hide_on_tablet': !pf_hide_on_tablet
    })
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelRow, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)("Hide on computer"),
    checked: pf_hide_on_computer,
    onChange: () => setAttributes({
      'pf_hide_on_computer': !pf_hide_on_computer
    })
  })), pf_hide_on_mobile && pf_hide_on_tablet && pf_hide_on_computer && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelRow, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Notice, {
    status: "warning",
    isDismissible: false
  }, "You're hiding the block on all devices.")));
}

/**
 * Generate form for group hidability.
 */
function HidableGroupForm(props) {
  const {
    attributes: {
      'pf_hidable_group': pf_hidable_group,
      'pf_id': pf_id
    },
    setAttributes
  } = props;
  const setRandomId = () => {
    setAttributes({
      'pf_id': Math.random().toString(36)
    });
  };
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)("Hidable Settings")
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelRow, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)("Make Hidable"),
    help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)("Make this element hidable (requires an child button marked as a closing button)."),
    checked: pf_hidable_group,
    onChange: () => setAttributes({
      'pf_hidable_group': !pf_hidable_group
    })
  })), pf_hidable_group && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelRow, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.__experimentalInputControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)("Closing ID"),
    help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)("Set a ID for the element. Note that multiple elements can share an same ID."),
    value: pf_id,
    onChange: value => setAttributes({
      'pf_id': value
    })
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelRow, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
    variant: "secondary",
    onClick: () => {
      setRandomId();
    }
  }, "Generate Random ID")), !pf_id && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelRow, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Notice, {
    status: "warning",
    isDismissible: false
  }, "A closing ID is required to make the element hidable."))));
}

/**
 * Generate a form for group closing button.
 */
function HidableGroupButtonForm(props) {
  const {
    attributes: {
      'pf_hidable_group_button': pf_hidable_group_button,
      'pf_hidable_group_button_hide_duration': pf_hidable_group_button_hide_duration
    },
    setAttributes
  } = props;
  const handleHideDurationChange = value => {
    value = parseInt(value);
    if (value < 0) value = '0';
    setAttributes({
      'pf_hidable_group_button_hide_duration': value
    });
  };
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)("Hidable Settings")
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelRow, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)("Assign As Hiding Button"),
    help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)("Mark this button as an element hiding button. Note that is has to be a child of an element marked as hidable."),
    checked: pf_hidable_group_button,
    onChange: () => setAttributes({
      'pf_hidable_group_button': !pf_hidable_group_button
    })
  })), pf_hidable_group_button && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelRow, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.__experimentalNumberControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)("Hide Duration (hours)"),
    help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)("Set the duration for the element to be hidden in hours."),
    value: pf_hidable_group_button_hide_duration,
    onChange: handleHideDurationChange
  })), pf_hidable_group_button_hide_duration == '0' && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelRow, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Notice, {
    status: "warning",
    isDismissible: false
  }, "A hide duration is required to make the element hidable."))));
}

// Add the new attributes to the block edit component.
(0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_1__.addFilter)('editor.BlockEdit', 'wp-pattern-friend/add-device-visibility-controls', (0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_5__.createHigherOrderComponent)(BlockEdit => {
  return props => {
    // Get the current attributes
    const {
      attributes
    } = props;
    const {
      pf_hide_on_mobile,
      pf_hide_on_tablet,
      pf_hide_on_computer
    } = attributes;
    let wrappedElement = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(BlockEdit, {
      ...props
    });
    if (pf_hide_on_mobile || pf_hide_on_tablet || pf_hide_on_computer) {
      let wrapperElementClasses = `
					${pf_hide_on_mobile ? ' pf-hide-on-mobile' : ''}
					${pf_hide_on_tablet ? ' pf-hide-on-tablet' : ''}
					${pf_hide_on_computer ? ' pf-hide-on-desktop' : ''}
					`;
      wrappedElement = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: wrapperElementClasses
      }, wrappedElement);
    }

    // Render the block edit component
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Panel, {
      header: "Pattern Friend"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(VisibilityForm, {
      ...props
    }), props.name == 'core/group' && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(HidableGroupForm, {
      ...props
    }), props.name == 'core/button' && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(HidableGroupButtonForm, {
      ...props
    }))), wrappedElement);
  };
}));
})();

/******/ })()
;
//# sourceMappingURL=block-editor-extensions.js.map