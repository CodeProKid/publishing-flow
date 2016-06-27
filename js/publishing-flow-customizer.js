/**
 * Publishing Flow Customizer JS.
 */

var PublishingFlowCustomizer = ( function( $, _, wp, data ) {

	'use strict';

	/**
	 * DOM references.
	 */
	var $controls;
	var $header;
	var $info;
	var $footer;

	/**
	 * Initialize.
	 */
	var init = function() {

		// Store some key DOM references.
		$controls = $( '#customize-theme-controls' );
		$header   = $( '#customize-header-actions' );
		$info     = $( '#customize-info' );
		$footer   = $( '#customize-footer-actions' );

		// Add initial classes for styling purposes.
		addInitialClasses();

		// Set default initial preview device.
		setDefaultDevice();

		// Inject our info section.
		injectInfo();

		// Inject our notifications section.
		injectNotifications();

		// Inject our custom controls.
		injectControls();

		// Inject our publish button.
		injectButton();

		// Initialize device preview events.
		initDevicePreview();
	};

	/**
	 * Add initial classes for styling purposes.
	 */
	var addInitialClasses = function() {

		// Add a class to the controls wrapper to indicate Publishing Flow is active.
		$controls.addClass( 'pf-customizer' );

		// If all requirements have been met, add a class to the controls wrapper.
		if ( "1" === data.requirementsMet ) {
			$controls.addClass( 'pf-requirements-met' );
		}
	}

	/**
	 * Set the default Customizer preview device.
	 */
	var setDefaultDevice = function() {
		wp.customize.previewedDevice.set( data.defaultDevice );

		// Mark the device as having been clicked.
		$footer.find( '.devices button[data-device="' + data.defaultDevice + '"]' ).addClass( 'pf-clicked' );
	}

	/**
	 * Inject our info section.
	 */
	var injectInfo = function() {

		$info.empty();

		var $infoWrap    = $( '<div />' ).addClass( 'pf-info' );
		var $infoLabel   = $( '<h2 />' ).text( data.infoSectionLabel );
		var $infoContent = $( '<p />' ).text( data.infoSectionContent );

		$infoWrap.append( $infoLabel, $infoContent );

		$info.append( $infoWrap );
	}

	/**
	 * Inject our notification sections.
	 */
	var injectNotifications = function() {

		var $reqNotifications = $( '<div />' )
			.addClass( 'pf-notifications' )
			.append(
				$( '<p />' )
					.text( "Woah there, looks like this post is still missing a required field!" ),
				$( '<span />' )
					.addClass( 'dashicons dashicons-warning' ),
				$( '<a />' )
					.attr( 'href', data.editLink )
					.text( 'Visit the edit screen to fix this.' )
			);

		$controls.prepend( $reqNotifications );

		var $deviceNotifications = $( '<div />' )
			.addClass( 'pf-device-notifications' )
			.append(
				$( '<p />' )
					.text( "Woah there, looks like you haven't yet previewed this post on all screen sizes." ),
				$( '<p />' )
					.text( "Click through each device" )
					.append(
						$( '<span />' ).addClass( 'dashicons dashicons-arrow-down-alt' )
					)
			);

		$footer.before( $deviceNotifications );
	}

	/**
	 * Inject our custom controls.
	 */
	var injectControls = function() {

		// Define our sections.
		var $sectionInfo = $( '<div />' )
			.addClass( 'pf-section pf-info-section' );
		var $sectionRequired = $( '<div />' )
			.addClass( 'pf-section pf-required-section' );
		var $sectionOptional = $( '<div />' )
			.addClass( 'pf-section pf-optional-section' );

		// Define section labels.
		var $sectionRequiredLabel = $( '<h2 />' )
			.addClass( 'pf-section-label' )
			.text( data.requiredLabel );
		var $sectionOptionalLabel = $( '<h2 />' )
			.addClass( 'pf-section-label' )
			.text( data.optionalLabel );

		// Inject labels.
		$sectionRequired.append( $sectionRequiredLabel );
		$sectionOptional.append( $sectionOptionalLabel );

		// Inject post info into our Post Info section.
		if ( "1" === data.scheduled ) {
			$sectionInfo.append(
				$( '<h3 />' )
					.text( data.publishDateLabel ),
				$( '<span />' )
					.addClass( 'dashicons dashicons-calendar-alt pf-calendar-icon' ),
				$( '<p />' )
					.addClass( 'pf-info-section pf-publish-date' )
					.text( data.scheduledOnLabel )
					.append(
						$( '<strong />' )
							.text( data.postDate )
					)
			);
		} else {
			$sectionInfo.append(
				$( '<h3 />' )
					.text( data.publishDateLabel ),
				$( '<span />' )
					.addClass( 'dashicons dashicons-calendar-alt pf-calendar-icon' ),
				$( '<p />' )
					.addClass( 'pf-info-section pf-publish-date' )
					.text( data.publishedOnLabel )
					.append(
						$( '<strong />' )
							.text( data.publishNowLabel )
					)
			);
		}

		// Render each required and optional item into each section.
		var reqPrimary = wp.template( 'pf-required-primary' );

		_.each( data.requiredPrimary, function( value, key, list ) {
			$sectionRequired.append(
				reqPrimary({
					key:       key,
					label:     value.label,
					value:     value.value,
					hasValue:  value.hasValue,
					noValue:   value.noValue,
					showValue: value.showValue,
				})
			);
		});

		var reqMeta = wp.template( 'pf-required-meta' );

		_.each( data.requiredMeta, function( value, key, list ) {
			$sectionRequired.append(
				reqMeta({
					key:       key,
					label:     value.label,
					value:     value.value,
					hasValue:  value.hasValue,
					noValue:   value.noValue,
					showValue: value.showValue,
				})
			);
		});

		var reqGroup = wp.template( 'pf-required-group' );

		_.each( data.requiredGroup, function( value, key, list ) {
			$sectionRequired.append(
				reqGroup({
					key:       key,
					keys:      value.keys,
					label:     value.label,
					value:     value.value,
					hasValue:  value.hasValue,
					noValue:   value.noValue,
					showValue: value.showValue,
				})
			);
		});

		var reqTax = wp.template( 'pf-required-tax' );

		_.each( data.requiredTax, function( value, key, list ) {
			$sectionRequired.append(
				reqTax({
					key:       key,
					label:     value.label,
					value:     value.value,
					hasValue:  value.hasValue,
					noValue:   value.noValue,
					showValue: value.showValue,
				})
			);
		});

		var optPrimary = wp.template( 'pf-optional-primary' );

		_.each( data.optionalPrimary, function( value, key, list ) {
			$sectionOptional.append(
				optPrimary({
					key:       key,
					label:     value.label,
					value:     value.value,
					hasValue:  value.hasValue,
					noValue:   value.noValue,
					showValue: value.showValue,
				})
			);
		});

		var optMeta = wp.template( 'pf-optional-meta' );

		_.each( data.optionalMeta, function( value, key, list ) {
			$sectionOptional.append(
				optMeta({
					key:       key,
					label:     value.label,
					value:     value.value,
					hasValue:  value.hasValue,
					noValue:   value.noValue,
					showValue: value.showValue,
				})
			);
		});

		var optGroup = wp.template( 'pf-optional-group' );

		_.each( data.optionalGroup, function( value, key, list ) {
			$sectionOptional.append(
				optPrimary({
					key:       key,
					keys:      value.keys,
					label:     value.label,
					value:     value.value,
					hasValue:  value.hasValue,
					noValue:   value.noValue,
					showValue: value.showValue,
				})
			);
		});

		var optTax = wp.template( 'pf-optional-tax' );

		_.each( data.optionalTax, function( value, key, list ) {
			$sectionOptional.append(
				optTax({
					key:       key,
					label:     value.label,
					value:     value.value,
					hasValue:  value.hasValue,
					noValue:   value.noValue,
					showValue: value.showValue,
				})
			);
		});

		// If any of our sections have output, output them.
		if ( $sectionInfo.children().length > 1 ) {
			$controls.append( $sectionInfo );
		}
		if ( $sectionRequired.children().length > 1 ) {
			$controls.append( $sectionRequired );
		}
		if ( $sectionOptional.children().length > 1 ) {
			$controls.append( $sectionOptional );
		}
	}

	/**
	 * Inject our publish button and spinner.
	 */
	var injectButton = function() {

		// Remove the default save button.
		$header.find( 'input#save' ).remove();

		var buttonText = ( "1" === data.scheduled ) ? data.doScheduleLabel : data.doPublishLabel;

		var $spinner = $( '<span />' )
			.addClass( 'pf-spinner spinner' );

		var $publishWrap = $( '<div />' )
			.addClass( 'pf-customizer-publish-wrap' );

		var $button = $( '<button />' )
			.addClass( 'button-primary pf-customizer-publish pf-disabled' )
			.attr( 'type', 'button' )
			.text( buttonText );

		// Inject our button and spinner.
		$publishWrap.append( $button, $spinner );
		$header.append( $publishWrap );

		// Set up click action on the publish/schedule button.
		$button.on( 'click', function() {

			// Trigger a message about required things when a user
			// clicks on the button while it is disabled.
			if ( $( this ).hasClass( 'pf-disabled' ) ) {
				if ( $controls.hasClass( 'pf-requirements-met' ) ) {
					showDeviceNotification();
				} else {
					showReqNotification();
				}

				return;
			}

			// Everything must be good, so publish the post.
			ajaxPublishPost();
		});
	}

	/**
	 * Show the required field notification.
	 */
	var showReqNotification = function() {
		$( '.pf-notifications' ).addClass( 'visible' );
		$controls.addClass( 'pf-notifications-open' );
	}

	/**
	 * Show the device notification.
	 */
	var showDeviceNotification = function() {
		$( '.pf-device-notifications' ).addClass( 'visible' );
	}

	/**
	 * Initialize our device preview events.
	 */
	var initDevicePreview = function() {
		var $deviceButtons = $footer.find( '.devices button' );

		$deviceButtons.on( 'click', function() {

			$( this ).addClass( 'pf-clicked' );

			// If all buttons have been clicked and other requirements
			// have been met, enable the Publish button.
			if ( $deviceButtons.filter( '.pf-clicked' ).length === $deviceButtons.length && $controls.hasClass( 'pf-requirements-met' ) ) {
				$( '.pf-device-notifications' ).removeClass( 'visible' );
				$header.find( '.pf-customizer-publish' ).removeClass( 'pf-disabled' );
			}
		});
	}

	/**
	 * Make an Ajax call to publish the previewed post.
	 */
	var ajaxPublishPost = function() {

		// Show the spinner.
		var $spinner = $header.find( '.pf-spinner' );
		$spinner.css( 'visibility', 'visible' );

		var pubData = {
			'action'           : 'pf_publish_post',
			'post_id'          : data.post.ID,
			'pf_publish_nonce' : data.publishNonce,
		};
		var options = {};

		var publishPost = $.post( ajaxurl, pubData );

		publishPost.done( function( response ) {
			$spinner.css( 'visibility', 'hidden' );

			if ( 'published' === response.outcome ) {
				$.featherlight( $( '.pf-publish-success' ) );
			} else if ( 'scheduled' === response.outcome ) {
				$.featherlight( $( '.pf-schedule-success' ) );
			} else {
				$.featherlight( $( '.pf-publish-fail' ) );
			}

			$( '.pf-view-post' ).attr( 'href', response.postLink );
			$( '.pf-edit-post' ).attr( 'href', data.editLink );
		});

		publishPost.fail( function() {
			$.featherlight( $( '.pf-publish-success' ), options );
		})
	}

	return {
		init: init,
	};

})( jQuery, _, wp, publishingFlowData );

/**
 * Start the party.
 */
jQuery( document ).ready( function( $ ) {
	PublishingFlowCustomizer.init();
});