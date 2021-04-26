/**
 * Manage states and views for the flyout blocks.
 * 
 * File flyout-block.js.
 */
(function (root, factory) {
	if ( typeof define === 'function' && define.amd ) {
		define([], factory(root));
	} else if ( typeof exports === 'object' ) {
		module.exports = factory(root);
	} else {
		root.FlyoutBlock = factory(root);
	}
})(typeof global !== 'undefined' ? global : this.window || this.global, function (root) {

	'use strict';

	var _hasInitialized = false;
	var _publicMethods = {
		managers: [],
	};
	var _settings = { };
	var _defaults = {
		flyoutWrapperSelector: '[data-flyout]',
		flyoutContentSelector: '[data-flyout-content]',
		toggleButtonSelector: '[data-flyout-toggle]',
		openButtonSelector: '[data-flyout-open]',
		closeButtonSelector: '[data-flyout-close]',
		overlaySelector: '[data-flyout-overlay]',
		flyoutTogglePassActionSelector: '[data-flyout-pass-action], .js-flyout-pass-action',

		flyoutToggleClassSelector: '.js-flyout-toggle',
		flyoutClassTogglePrefix: 'js-flyout-target-',
		
		idPrefix: 'flyout-block',
		
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
		autoFocusAttribute: 'data-autofocus',
		
		flyoutRoleAttribute: 'data-flyout-role',

		overlayTemplate: '<div class="flyout-overlay" data-flyout-overlay></div>',
	};
	var _states = {
		OPEN: 'open',
		CLOSED: 'closed',
	}



	/*!
	* Merge two or more objects together.
	* (c) 2017 Chris Ferdinandi, MIT License, https://gomakethings.com
	* @param   {Boolean}  deep     If true, do a deep (or recursive) merge [optional]
	* @param   {Object}   objects  The objects to merge together
	* @returns {Object}            Merged values of defaults and options
	*/
	var extend = function () {
		// Variables
		var extended = {};
		var deep = false;
		var i = 0;

		// Check if a deep merge
		if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
			deep = arguments[0];
			i++;
		}

		// Merge the object into the extended object
		var merge = function (obj) {
			for (var prop in obj) {
				if (obj.hasOwnProperty(prop)) {
					// If property is an object, merge properties
					if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
						extended[prop] = extend(extended[prop], obj[prop]);
					} else {
						extended[prop] = obj[prop];
					}
				}
			}
		};

		// Loop through each object and conduct a merge
		for (; i < arguments.length; i++) {
			var obj = arguments[i];
			merge(obj);
		}

		return extended;
	};


	/**
	 * Gets keyboard-focusable elements within a specified element
	 *
	 * @param   HTMLElement  element  The element to search within. Defaults to the `document` root element.
	 *
	 * @return  array                 All focusable elements withing the element passed.
	 */
	var getFocusableElements = function( element ) {
		// Set element to `document` root if not passed in
		if ( ! element ) { element = document; }
		
		// Get elements that are keyboard-focusable, but might be `disabled`
		var maybeFocusableElements = element.querySelectorAll( 'a, button, input:not([type="hidden"]), textarea, select, details,[tabindex]:not([tabindex="-1"])' );
		
		// Filter disabled elements and return
		return Array.from( maybeFocusableElements ).filter( function( maybeFocusable ) {
			return ! maybeFocusable.hasAttribute( 'disabled' );
		} );
	}



	/**
	 * Get target element
	 */
	var getTargetElement = function( element ) {
		// Bail if element not valid
		if ( ! element ) return false;

		// Try get target element from attributes
		var targetSelector = element.getAttribute( _settings.targetElementAttribute );
		if ( targetSelector && targetSelector != '' ) {
			return document.querySelector( targetSelector );
		}

		// Return target element from parent nodes
		return element.closest( _settings.flyoutWrapperSelector );
	}



	/**
	 * Get target element
	 */
	var getTargetElementFromClass = function( element ) {
		if ( ! element ) { return false; }

		// Iterate classes
		for ( var i = 0; i < element.classList.length; i++ ) {
			var cssClass = element.classList[i];
			if ( cssClass.indexOf( _settings.flyoutClassTogglePrefix ) == 0 ) {
				// Get target id from class name
				var targetSelector = '#' + cssClass.replace( _settings.flyoutClassTogglePrefix, '' );
				return document.querySelector( targetSelector );
			}
		}
		
		return false;
	}


	/**
	 * Handle document clicks and route to the appropriate function.
	 */
	var handleClick = function ( e ) {
		// TOGGLE
		if ( e.target.closest( _settings.toggleButtonSelector ) ) {
			e.preventDefault();
			var button = e.target.closest( _settings.toggleButtonSelector );
			var element = getTargetElement( button );
			_publicMethods.toggle( element );
		}
		// TOGGLE (CSS CLASS)
		else if ( e.target.closest( _settings.flyoutToggleClassSelector ) ) {
			// Maybe prevent element's action
			if ( ! e.target.closest( _settings.flyoutTogglePassActionSelector ) ) {
				e.preventDefault();
			}

			var toggleElement = e.target.closest( _settings.flyoutToggleClassSelector );
			var element = getTargetElementFromClass( toggleElement );
			
			if ( element ) {
				_publicMethods.toggle( element );
			}
		}
		// OPEN
		else if ( e.target.closest( _settings.openButtonSelector ) ) {
			e.preventDefault();
			var button = e.target.closest( _settings.openButtonSelector );
			var element = getTargetElement( button );
			_publicMethods.open( element );
		}
		// CLOSE
		else if ( e.target.closest( _settings.closeButtonSelector ) ) {
			e.preventDefault();
			
			var button = e.target.closest( _settings.closeButtonSelector );
			var element = getTargetElement( button );
			_publicMethods.close( element );
		}
		// OVERLAY - Specific to a flyout block
		else if ( e.target.matches( _settings.flyoutWrapperSelector ) ) {
			var element = getTargetElement( e.target );
			_publicMethods.close( element );
		}
		// OVERLAY - General
		else if ( e.target.closest( _settings.overlaySelector ) ) {
			_publicMethods.closeAll();
		}
	}



	/**
	 * Handle keypress event.
	 */
	var handleKeyDown = function(e) {
		if ( e.keyCode == 27 || e.which == 27 || e.key == 'Escape' || e.key == 'Esc' ) {
			_publicMethods.closeAll();
		}
	};



	/**
	 * Get current state of element
	 */
	_publicMethods.getState = function ( element ) {
		var manager = _publicMethods.getInstance( element );
		// Bail if manager invalid
		if ( ! manager ) return false;

		return manager.state;
	}



	/**
	 * Open element
	 */
	_publicMethods.open = function ( element ) {
		var manager = _publicMethods.getInstance( element );
		// Bail if manager invalid
		if ( ! manager ) return false;

		// Save element with focus
		manager.previousActiveElement = document.activeElement;

		// Set element open then play openning animation
		AnimateHelper.doThenAnimate( element, manager.settings.openAnimationClass, function() {
			// Set manager state
			manager.state = _states.OPEN;

			// Maybe save `hidden` attribute on the flyout element
			manager.wasHidden = manager.element.hasAttribute( 'hidden' );
			manager.element.removeAttribute( 'hidden' );

			// Set classes
			manager.element.classList.add( manager.settings.isOpenClass );
			document.body.classList.add( manager.settings.bodyHasFlyoutOpenClass,manager.settings.bodyHasFlyoutOpenClass + '-' + manager.element.id );

			// Maybe set focus to the first focusable element in the flyout content, filter out the close button
			if ( ! manager.element.hasAttribute( manager.settings.manualFocusAttribute ) ) {
				var autofocusField = manager.element.querySelector( '[' + manager.settings.autoFocusAttribute + ']' );

				console.log( autofocusField );

				// Maybe get first focusable field
				if ( ! autofocusField ) {
					var focusableElements = getFocusableElements( manager.element ).filter( function( maybeFocusable ) { return ! maybeFocusable.matches( manager.settings.closeButtonSelector ); } );
					if ( focusableElements.length > 0 ) {
						autofocusField = focusableElements[0];
					}
				}

				// Maybe set focus to the field
				if ( autofocusField ) {
					autofocusField.focus();
				}
				// Otherwise set focus to the flyout content
				else {
					manager.contentElement.focus();
				}
			}
		} );
	}


	
	/**
	 * Close element
	 */
	_publicMethods.close = function ( element ) {   
		var manager = _publicMethods.getInstance( element );
		// Bail if manager invalid
		if ( ! manager ) return false;

		// Play closing animation then set element closed
		AnimateHelper.animateThenDo( element, manager.settings.closeAnimationClass, function() {
			// Set manager state
			manager.state = _states.CLOSED;

			// Remove classes
			manager.element.classList.remove( manager.settings.isOpenClass );
			document.body.classList.remove( manager.settings.bodyHasFlyoutOpenClass + '-' + manager.element.id );

			// Maybe set `hidden` attribute again
			if ( manager.wasHidden ) {
				manager.element.setAttribute( 'hidden', '' );
			}
			manager.element.wasHidden = undefined;

			// Maybe remove body class for open elements
			if ( ! _publicMethods.hasAnyElementOpen() ) {
				document.body.classList.remove( manager.settings.bodyHasFlyoutOpenClass );
			}

			// Set focus back to the element previously with focus
			if ( manager.previousActiveElement ) {
				manager.previousActiveElement.focus();
			}
		} );
	}



	/**
	 * Close all instances
	 */
	_publicMethods.closeAll = function () {
		for ( var i = 0; i < _publicMethods.managers.length; i++ ) {
			var manager = _publicMethods.managers[i];
			var currentState = _publicMethods.getState( manager.element );
			if ( currentState != _states.CLOSED ) {
				_publicMethods.close( manager.element );
			}
		}
	}



	/**
	 * Toggle element state
	 */
	_publicMethods.toggle = function ( element ) {
		var currentState = _publicMethods.getState( element );
		if ( currentState == _states.CLOSED ) {
			_publicMethods.open( element );
		}
		else {
			_publicMethods.close( element );
		}
	}



	/**
	 * Get manager instance for element
	 */
	_publicMethods.getInstance = function ( element ) {
		var instance;
		for ( var i = 0; i < _publicMethods.managers.length; i++ ) {
			var manager = _publicMethods.managers[i];
			if ( manager.element == element ) { instance = manager; break; }
		}
		return instance;
	}
	


	/**
	 * Get manager instance for element
	 */
	_publicMethods.hasAnyElementOpen = function () {
		for ( var i = 0; i < _publicMethods.managers.length; i++ ) {
			var manager = _publicMethods.managers[i];
			if ( manager.state == _states.OPEN ) { return true; }
		}
		
		return false;
	}



	/**
	 * Initialize a trigger elements.
	 */
	 _publicMethods.initializeTrigger = function( trigger ) {
		// Enable the trigger element
		trigger.removeAttribute( 'disabled' );
		trigger.removeAttribute( 'aria-hidden' );
		
		// Add the element to the natural tab order
		trigger.setAttribute( 'tabindex', '0' );

		// Set trigger role to `button`
		trigger.setAttribute( 'role', 'button' );

		// Maybe remove the `href` attribute to avoid right-click to open link on new tab
		var triggerHref = trigger.getAttribute( 'href' );
		if ( triggerHref != undefined && triggerHref != '' ) {
			
			// Move selector to the target attribute
			var targetElement = document.querySelector( triggerHref )
			if ( targetElement ) {
				trigger.setAttribute( _settings.targetElementAttribute, triggerHref );
			}

			// Only remove the `href` attribute if the element has a target
			if ( trigger.getAttribute( _settings.targetElementAttribute ) ) {
				trigger.removeAttribute( 'href' );
			}

		}
	}
	


	/**
	 * Initialize an element
	 */
	_publicMethods.initializeElement = function( element ) {
		var manager = {};
		manager.element = element;
		manager.settings = extend( _settings );
		manager.state = _states.CLOSED;

		// Maybe create element ID
		if ( ! manager.element.id || manager.element.id == '' ) {
			manager.element.id = manager.settings.idPrefix + '-' + _publicMethods.managers.length;
		}

		// Get the content element
		manager.contentElement = manager.element.querySelector( manager.settings.flyoutContentSelector );
		
		// Try get open/close animation classes from attributes
		var openAnimationAttrValue = manager.element.getAttribute( manager.settings.openAnimationClassAttribute );
		var closeAnimationAttrValue = manager.element.getAttribute( manager.settings.closeAnimationClassAttribute );
		manager.settings.openAnimationClass = openAnimationAttrValue && openAnimationAttrValue != '' ? openAnimationAttrValue : _settings.openAnimationClass;
		manager.settings.closeAnimationClass = closeAnimationAttrValue && closeAnimationAttrValue != '' ? closeAnimationAttrValue : _settings.closeAnimationClass;

		// Set flyout content `role` attribute from data attributes
		var roleAttrValue = manager.element.getAttribute( manager.settings.flyoutRoleAttribute ) == 'alert' || manager.element.getAttribute( manager.settings.flyoutRoleAttribute ) == 'alertdialog' ? 'alertdialog' : 'dialog';
		manager.contentElement.setAttribute( 'role', roleAttrValue );
		
		// Set element as activated
		manager.isActivated = true;
		manager.element.classList.add( manager.settings.isActivatedClass );
		
		// Add manager to public methods
		_publicMethods.managers.push( manager );
	}



	/**
	 * Finish Initialize
	 */
	 var finishInit = function( options ) {
		// Merge with general settings with options
		_settings = extend( _defaults, options );

		// Iterate elements
		var elements = document.querySelectorAll( _settings.flyoutWrapperSelector );
		for ( var i = 0; i < elements.length; i++ ) {
			_publicMethods.initializeElement( elements[ i ] );
		}

		// Iterate trigger elements
		var triggerSelectors = _settings.toggleButtonSelector + ', ' + _settings.openButtonSelector + ', ' + _settings.closeButtonSelector;
		var triggers = document.querySelectorAll( triggerSelectors );
		for ( var i = 0; i < triggers.length; i++ ) {
			_publicMethods.initializeTrigger( triggers[ i ] );
		}

		// Add flyout overlay
		var overlayElement = document.createElement('div');
		overlayElement.innerHTML = _settings.overlayTemplate.trim();
		document.body.appendChild( overlayElement.childNodes[0] );

		// Add event listeners
		document.addEventListener( 'click', handleClick );
		document.addEventListener( 'keydown', handleKeyDown, true );
		
		// Add body class
		document.body.classList.add( _settings.bodyHasFlyoutClass );

		_hasInitialized = true;
	}

	

	/**
	 * Initialize Script.
	 */
	_publicMethods.init = function( options ) {
		if ( _hasInitialized ) return;

		// Finish initialization, maybe load dependencies first
		if ( window.AnimateHelper ) {
			finishInit( options );
		}
		else if( window.RequireBundle ) {
			RequireBundle.require( [ 'animate-helper' ], function() { finishInit( options ); } );
		}
	};



	//
	// Public APIs
	//
	return _publicMethods;

});
