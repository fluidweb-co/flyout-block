# Flyout Block

[![npm version](https://badge.fury.io/js/flyout-block.svg)](https://badge.fury.io/js/flyout-block)
[![DragsterJS gzip size](http://img.badgesize.io/https://raw.githubusercontent.com/fluidweb-co/flyout-block/master/dist/flyout-block.min.js?compression=gzip
)](https://raw.githubusercontent.com/fluidweb-co/flyout-block/master/dist/flyout-block.min.js)

Lightweight modal and flyout block component library.



## Installation

Setting up is pretty straight-forward. Download the js and css files from __dist__ folder and include them in your HTML, you'll also need the library [AnimateHelper](https://github.com/fluidweb-co/animate-helper), and the [Inert Polyfill](https://github.com/WICG/inert), both provided in the `dist` folder for your convenience.


```html
    <link rel='stylesheet' id='flyout-block'  href='path/to/dist/flyout-block.min.css' type='text/css' media='all' />
    <link rel='stylesheet' id='flyout-animations' href='path/to/dist/flyout-animations.min.css' type='text/css' media='all' />

    <script type="text/javascript" src="path/to/dist/animate-helper.min.js"></script>
    <script type="text/javascript" src="path/to/dist/inert.min.js"></script>
    <script type="text/javascript" src="path/to/dist/flyout-block.min.js"></script>
```

Remember to change the `path/to/dist/` to the actual path in your project.
If you plan to use your own css animations you can skip loading the styles `flyout-animations.min.css`, if no animation is provided the flyout scripts will still work as intended without animations ;)


### NPM

Flyout Block is also available on NPM:

```sh
$ npm install flyout-block
```

When using NPM, AnimateHelper will be added as a dependency.



## Initialization

Once the Flyout Block script is loaded all functions will be available through the global variable `window.FlyoutBlock`, however to enable the components you need to call the function `init`:

Call the function `FlyoutBlock.init( options );` passing the `options` parameter as an object.



## Options Available

The `options` parameter accept any of the available options from the default settings by passing the new values as an object. You can simply ommit the options you don't want to change the default values of.

These are the currently accepted options with their default values, if in doubt check the source code:

```js
    var _defaults = {
        flyoutWrapperSelector: '[data-flyout]',
		flyoutContentSelector: '[data-flyout-content]',
		toggleButtonSelector: '[data-flyout-toggle]',
		openButtonSelector: '[data-flyout-open]',
		closeButtonSelector: '[data-flyout-close]',
		overlaySelector: '[data-flyout-overlay]',
		flyoutTogglePassActionSelector: '[data-flyout-pass-action], .js-flyout-pass-action',
		autoFocusSelector: '[data-autofocus]',

		flyoutToggleClassSelector: '.js-flyout-toggle',
		flyoutClassTogglePrefix: 'js-flyout-target-',
		
		idPrefix: 'flyout-block',
		headingsSelector: 'h1, h2, h3, h4, h5, h6, [role="heading"]',
		
		bodyHasFlyoutClass: 'has-flyout',
		bodyHasFlyoutOpenClass: 'has-flyout--open',
		isActivatedClass: 'is-activated',
		isOpenClass: 'is-open',
		openAnimationClass: 'slide-in-up',
		closeAnimationClass: 'slide-out-down',
		
		targetElementAttribute: 'data-flyout-target',
		openAnimationClassAttribute: 'data-flyout-open-animation-class',
		closeAnimationClassAttribute: 'data-flyout-close-animation-class',
		manualFocusAttribute: 'data-flyout-manual-focus',
		descriptionAttribute: 'data-flyout-description',
		autoFocusAttribute: 'data-autofocus',
		focusableElementsSelector: 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled]), details, summary, iframe, object, embed, [contenteditable] [tabindex]:not([tabindex="-1"])',
		
		flyoutRoleAttribute: 'data-flyout-role',

		overlayTemplate: '<div class="flyout-overlay" data-flyout-overlay></div>',
    };
```

For example, you can change the default animation classes used to open/close the flyout blocks on your application:

```js
var options = {
    openAnimationClass: 'fade-in-up',
    closeAnimationClass: 'fade-out-down',
}
FlyoutBlock.init( options );
```

Everything else will use the default values.



## Basic Usage

### 1. Recommended HTML elements structure

The flyout block component requires a _trigger_ element, a _flyout block_ element, and a _content_ element.

The trigger element can be any element with the data attributes `data-flyout-toggle` or `data-flyout-open`, but the attribute `data-flyout-toggle` is preferred as it will work to open or close the flyout block. The target flyout content block is defined with the data attribute `data-flyout-target` and it accepts any valid css selector, if there is more than one element that matches the target selector only the first element will be used.

```html
<button data-flyout-toggle data-flyout-target="[data-flyout-mobile-menu]">Show</button>
```

The flyout block element is defined with the markup below. You need to set the attributes `data-flyout` to the element containing the content element, and the attribute `data-flyout-content` to the element which contains the actual content, the later is the element that will be visible and you can style it however you want it to look like.

In the example below, we use the attribute `data-flyout-mobile-menu` to identify the flyout block but you can use ID or a classes, just remember to set the attribute `data-flyout-target` on the trigger element to a valid css selector that matches the flyout block element.

```html
<div data-flyout data-flyout-mobile-menu>
    <div data-flyout-content>

        <button data-flyout-close>Close</button>

        <nav>
            <ul>
                <li>Menu item 1</li>
                <li>Menu item 2</li>
                <li>Menu item 3</li>
                <li>Menu item 4</li>
                <li>Menu item 5</li>
            </ul>
        </nav>

    </div>
</div>
```

IMPORTANT: It is recommended that all flyout-blocks are placed directly in the `<body>` element to ensure that only the elements inside the flyout-block are focusabled during the time it is being displayed, this will prevent users using keyboard-only or assistive technologies from leaving the flyout-block without closing it, this is the expected behavior as leaving focusing and navigating other elements that are not currently being displayed will degrade the user experience. For that reason, the flyout script will set all sibling elements as `inert`.

[Read the `inert` specs](https://whatpr.org/html/4288/interaction.html#the-inert-attribute)

### 2. Using flyout blocks as modals

To use flyout blocks as a modal window, set the attribute `data-flyout-modal` to the flyout block element, the same element that contains the attribute `data-flyout`.

```html
<div data-flyout data-flyout-modal data-flyout-language-selector>
    <div data-flyout-content>

        <button data-flyout-close>Close</button>

        <div>
            Language Selector
            <select>
                <option>English</option>
                <option>Portuguese</option>
                <option>Italian</option>
            </select>
            <button>Apply</button>
        </div>

    </div>
</div>
```

The trigger element for a modal flyout does not need anything special, just the same attributes as explained on the basic usage above.

```html
<button data-flyout-toggle data-flyout-target="[data-flyout-language-selector]">Choose language</button>
```

### 3. Setting the animation classes for individual flyout blocks

It is possible to define which animations will play to open/close an individual flyout block that is different than the default animations defined when initializing the `FlyoutBlock` components.

For example, if you want the mobile menu to slide in from the left (instead of from the bottom as the default), you can set the attributes `data-flyout-open-animation-class` and `data-flyout-close-animation-class` as below:

```html
<div data-flyout data-flyout-mobile-menu data-flyout-open-animation-class="slide-in-left" data-flyout-close-animation-class="slide-out-left">
    <div data-flyout-content>

        <button data-flyout-close>Close</button>

        <nav>
            <ul>
                <li>Menu item 1</li>
                <li>Menu item 2</li>
                <li>Menu item 3</li>
                <li>Menu item 4</li>
                <li>Menu item 5</li>
            </ul>
        </nav>

    </div>
</div>
```


## Contributing to Development

This isn't a large project by any means, but you are definitely welcome to contribute.

### Development environment

Clone the repo and run [npm](http://npmjs.org/) install:

```
$ cd path/to/flyout-block
$ npm install
```

Run the build command:

```
$ gulp build
```

Build on file save:

```
$ gulp
$ gulp watch
```


## License

Licensed under MIT.
