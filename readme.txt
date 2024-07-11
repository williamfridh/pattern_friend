=== Pattern Friend ===
Contributors: qoncer
Tags: editor, pattern, responsive, design, layout
Requires at least: 6.5.3
Tested up to: 6.5.3
Stable tag: 1.2.1
Requires PHP: 7.3.5
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Extends the Gutenberg block editor with addtional functionality with lightweight code.

== Description ==

This plugin extend the default Gutenberg block editor with functionality often required for a better user experience. It's build to be lightweight, simple to use, and most importantly, stable troughout updates.

**Key Features:**
1. Makes each block hidable on mobile, tablet, and desktop.
2. Adjustable thresholds for different devices.
3. Hidable groups, rows, and stacks that stay hidden for a set amount of time.

*Note that this plugin can adds additional attributes to blocks which will not be removed upon uninstall as this can risk damaging post data.*

== Frequently Asked Questions ==

= Can you use this to hide a menu on mobile devices? =

Yes. With this plugin, you can adjust what blocks to be displayed on certain devices in the appearance editor.

= Is it GDPR friendly? =

Yes. The plugin only makes use of the devices local storage to keep track of what groups have been hidden.

== Screenshots ==

1. The options page where the user can modify the thresholds.
2. What the additional input fields looks like.

== Changelog ==

= v1.2.1 =
* Added button to load default threshold resolutions.
* Refactoring code and changing folder structure.
* Added form loading and success indicator
* Added uninstall script to clear up options.
* Added a update function thats called upon plugin update to generate new options and CSS files.
* Refined descriptions for attributes.
* Improved input filters.

= v1.2.0 =
* Added hidable group, row, and stack functionality.

= v1.1.0 =
* Added sticky header support.

= v1.0.0 =
* Initial release

== Upgrade Notice ==

= v1.2.1 =
* Added functionality and improved overall plugin quality.

= v1.2.0 =
* Additional functionality.

= v1.1.0 =
* Additional functionality.