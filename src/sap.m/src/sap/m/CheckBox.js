/*!
 * ${copyright}
 */

// Provides control sap.m.CheckBox.
sap.ui.define(['jquery.sap.global', './Label', './library', 'sap/ui/core/Control', 'sap/ui/core/EnabledPropagator'],
	function(jQuery, Label, library, Control, EnabledPropagator) {
	"use strict";

	/**
	 * Constructor for a new CheckBox.
	 *
	 * @param {string} [sId] The ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] The Initial settings for the new control
	 *
	 * @class
	 * The CheckBox control allows the user to select one or multiple items from a list. To select each item the user has to select the square box in front of it.
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version ${version}
	 *
	 * @constructor
	 * @public
	 * @alias sap.m.CheckBox
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var CheckBox = Control.extend("sap.m.CheckBox", /** @lends sap.m.CheckBox.prototype */ { metadata : {

		library : "sap.m",
		properties : {

			/**
			 * Stores the state of the checkbox whether it is selected or not.
			 */
			selected : {type : "boolean", group : "Data", defaultValue : false},

			/**
			 * Disables the Checkbox. Disabled controls are not interactive and are rendered differently according to the theme.
			 */
			enabled : {type : "boolean", group : "Behavior", defaultValue : true},

			/**
			 * The 'name' property to be used in the HTML code, for example for HTML forms that send data to the server via submit.
			 */
			name : {type : "string", group : "Misc", defaultValue : null},

			/**
			 * Defines the text displayed next to the checkbox
			 */
			text : {type : "string", group : "Appearance", defaultValue : null},

			/**
			 * Options for the text direction are RTL and LTR. Alternatively, the control can inherit the text direction from its parent container.
			 */
			textDirection : {type : "sap.ui.core.TextDirection", group : "Appearance", defaultValue : sap.ui.core.TextDirection.Inherit},

			/**
			 * Aligns the text of the checkbox. Available alignment settings are "Begin", "Center", "End", "Left", and "Right".
			 */
			textAlign : {type : "sap.ui.core.TextAlign", group : "Appearance", defaultValue : sap.ui.core.TextAlign.Begin},

			/**
			 * Width of the checkbox`s label
			 */
			width : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : ''},

			/**
			 * Flag to switch on activeHandling, when it is switched off, there will be no visual changes on active state. Default value is 'true'
			 */
			activeHandling : {type : "boolean", group : "Misc", defaultValue : true},

			/**
			 * Specifies whether the user shall be allowed to edit the state of the checkbox
			 * @since 1.25
			 */
			editable : {type : "boolean", group : "Behavior", defaultValue : true},

			/**
			 * Accepts the core enumeration ValueState.type that supports 'None', 'Error', 'Warning' and 'Success'.
			 * @since 1.38
			 */
			valueState : {type : "sap.ui.core.ValueState", group : "Data", defaultValue : sap.ui.core.ValueState.None}
		},
		aggregations: {
			/**
			 * The label that represents the text of the checkbox control
			 */
			_label: {type: "sap.m.Label", group: "Behavior", multiple: false, visibility: "hidden"}
		},
		associations : {

			/**
			 * Association to controls / IDs which describe this control (see WAI-ARIA attribute aria-describedby).
			 */
			ariaDescribedBy: {type: "sap.ui.core.Control", multiple: true, singularName: "ariaDescribedBy"},

			/**
			 * Association to controls / IDs which label this control (see WAI-ARIA attribute aria-labelledby).
			 */
			ariaLabelledBy: {type: "sap.ui.core.Control", multiple: true, singularName: "ariaLabelledBy"}
		},
		events : {

			/**
			 * Event is triggered when the control status is changed by the user by selecting or deselecting the checkbox.
			 */
			select : {
				parameters : {

					/**
					 * Checks whether the CheckBox is marked or not .
					 */
					selected : {type : "boolean"}
				}
			}
		}
	}});

	EnabledPropagator.call(CheckBox.prototype);

	CheckBox.prototype.init = function() {
		this.addActiveState(this);
		jQuery.sap.require("sap.ui.core.IconPool");
		sap.ui.core.IconPool.insertFontFaceStyle();

		var oLabel = new Label(this.getId() + "-label", {
			labelFor: this.getId()
		}).addStyleClass("sapMCbLabel");

		this.setAggregation("_label", oLabel, true);
	};

	CheckBox.prototype.onAfterRendering = function() {
		if (!this.getText() && !this.$().attr("aria-labelledby")) {
			this.$().attr("aria-label", " ");
		}
	};

	/**
	 * Called when the control is touched.
	 *
	 * @private
	 */
	CheckBox.prototype.ontouchstart = function(oEvent) {
		//for control who need to know if they should handle events from the CheckBox control
		oEvent.originalEvent._sapui_handledByControl = true;
	};

	CheckBox.prototype.setSelected = function(bSelected) {
		bSelected = !!bSelected;
		if (bSelected == this.getSelected()) {
			return this;
		}
		this.$("CbBg").toggleClass("sapMCbMarkChecked", bSelected);
		this.$().attr("aria-checked", bSelected);
		var oCheckBox = this.getDomRef("CB");
		if (oCheckBox) {
			bSelected ? oCheckBox.setAttribute('checked', 'checked') : oCheckBox.removeAttribute('checked');
		}
		this.setProperty("selected", bSelected, true);
		return this;
	};

	/**
	 * Function is called when CheckBox is tapped.
	 *
	 * @private
	 */
	CheckBox.prototype.ontap = function(oEvent) {
		if (this.getEnabled() && this.getEditable()) {
			this.$().focus(); // In IE taping on the input doesn`t focus the wrapper div.
			var bSelected = !this.getSelected();
			this.setSelected(bSelected);
			this.fireSelect({selected:bSelected});

			// mark the event that it is handled by the control
			oEvent && oEvent.setMarked();
		}
	};

	/**
	 * Add ActiveState to non-supported mobile platform
	 * @private
	 */
	CheckBox.prototype.addActiveState = function(oControl) {
		if (sap.ui.Device.os.blackberry) {
			oControl.addDelegate({
				ontouchstart: function(oEvent){
					jQuery(oControl.getDomRef()).addClass("sapMActive");
				},
				ontouchend: function(oEvent){
					jQuery(oControl.getDomRef()).removeClass("sapMActive");
				}
			});
		}
	};

	/**
	 * Setter for the text property
	 * @param sText
	 * @returns {sap.m.CheckBox}
	 */
	CheckBox.prototype.setText = function(sText) {
		var oLabel = this.getAggregation("_label"),
			bHasText = !!sText;

		this.setProperty("text", sText, true);
		oLabel.setText(sText);
		this.$().toggleClass("sapMCbHasLabel", bHasText);

		return this;
	};

	/**
	 * Setter for the width property
	 * @param sWidth
	 * @returns {sap.m.CheckBox}
	 */
	CheckBox.prototype.setWidth = function (sWidth){
		var oLabel = this.getAggregation("_label");

		this.setProperty("width", sWidth, true);
		oLabel.setWidth(sWidth);

		return this;
	};

	/**
	 * Setter for the textDirection property
	 * @param sDirection
	 * @returns {sap.m.CheckBox}
	 */
	CheckBox.prototype.setTextDirection = function(sDirection) {
		var oLabel = this.getAggregation("_label");

		this.setProperty("textDirection", sDirection, true);
		oLabel.setTextDirection(sDirection);

		return this;
	};

	/**
	 * Setter for the textAlign property
	 * @param sAlign
	 * @returns {sap.m.CheckBox}
	 */
	CheckBox.prototype.setTextAlign = function(sAlign) {
		var oLabel = this.getAggregation("_label");

		this.setProperty("textAlign", sAlign, true);
		oLabel.setTextAlign(sAlign);

		return this;
	};

	CheckBox.prototype.exit = function() {
		delete this._iTabIndex;
	};

	/**
	 * Event handler called when the space key is pressed.
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	CheckBox.prototype.onsapspace = function(oEvent) {
		this.ontap(oEvent);
		// stop browsers default behavior
		if (oEvent) {
			oEvent.preventDefault();
			oEvent.stopPropagation();
		}
	};

	/**
	 * Event handler called when the enter key is pressed.
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	CheckBox.prototype.onsapenter = function(oEvent) {
		this.ontap(oEvent);
	};

	/**
	 * Sets the tab index of the control
	 *
	 * @param {int} iTabIndex The tab index should be greater than or equal -1
	 * @return {sap.m.CheckBox}
	 * @since 1.16
	 * @protected
	 */
	CheckBox.prototype.setTabIndex = function(iTabIndex) {
		this._iTabIndex = iTabIndex;
		this.$("CbBg").attr("tabindex", iTabIndex);
		return this;
	};

	/**
	 * Gets the tab index of the control
	 *
	 * @return {integer} iTabIndex for Checkbox
	 * @since 1.22
	 * @protected
	 */
	CheckBox.prototype.getTabIndex = function() {
		if ( this.hasOwnProperty("_iTabIndex") ) {
			return this._iTabIndex;
		}
		return this.getEnabled() ? 0 : -1 ;
	};

	return CheckBox;

}, /* bExport= */ true);
