# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2023-05-31

### Fixed

- Fixed: Also check for `inert` functions on `HTMLElement` when initializing.

### Removed

- Removed: Dependency on `RequireBundle` library.

## [1.1.5] - 2023-01-24

### Changed

- Changed: Expose function `initTriggers` to allow reinitializing triggers after adding or replacing sections on the page which contains flyout block trigger elements.

## [1.1.4] - 2021-08-12

### Fixed

- Fixed: Error on set `inert` functions preventing animations to work while openning a flyout-block.

## [1.1.3] - 2021-08-11

### Fixed

- Fixed: Only set flyout-block content element `role` attribute when opening it, instead of setting at initialization.
- Fixed: Set all sibling elements up the flyout-block element tree as `inert`, instead of just the elements siblings.

## [1.1.2] - 2021-05-10

### Fixed

- Fixed: Critical error when initializing a flyout-block trigger which contained a `href` attribute that didn't point to an element in the page.

## [1.1.1] - 2021-05-07

### Changed

- Changed: Default focus to the flyout content instead of the first focusable element. Use the attribute `data-autofocus` on the flyout element to focus on the first focusable element.
- Changed: Default open/close animations to use `fade-in-up` and `fade-out-down`.

### Fixed

- Fixed: `fade-out-down` animation as moving up instead of down.

## [1.1.0] - 2021-04-28

### Added

- Added: Support for flyout block accessible description generated from an element marked with `data-flyout-description`.
- Added: Support for flyout block accessible name generated from the first found heading element.
- Added: Support for keyboard events on non-button trigger elements.
- Added: Make all siblings of the flyout blocks as `inert` during the time it is open. Letting users focus only on elements inside the currently displayed flyout block.
- Added: Add `inert` polyfill, see more information at the [Inert polyfill repository](https://github.com/WICG/inert).
- Added: Set focus to the first focusable element in the flyout content by default, or to the element marked as `data-autofocus` if focusabled, and allow developers to define a manual focus mode with `data-flyout-manual-focus`, otherwise focus on the flyout content.
- Added: Add attribute `role` to the flyout block element to `dialog` or `alertdialog` with support to set the value via `data-flyout-role`.
- Added: Add support to the attribute `hidden` on flyout block elements to hide content for when JavaScript and CSS is unavailable.
- Added: Support to target flyout blocks using the `href` of a link attribute.
- Added: Set trigger elements `role` to `button`.
- Added: Support to release `disabled` and `aria-hidden` on trigger elements at initialization.
- Added: Set focus back to the element that had the focus previously to opening the flyout block.

### Fixed

- Fixed: Only set flyout styles after initializing the script and setting the a class to the `body` element.

### Removed

- Removed: unnecessary dependency `hammerjs`.

## [1.0.0] - 2021-04-02

### Added

- Initial commit.
