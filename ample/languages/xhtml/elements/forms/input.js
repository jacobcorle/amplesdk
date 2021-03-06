/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXHTMLElement_input	= function(){
	this.validity	= new cXHTMLValidityState;
	// Shadow Tree
	this.contentFragment	= ample.createDocumentFragment();
	var that	= this;
	this._spinButtons	= ample.createElement("spinbuttons");
	this._spinButtons.addEventListener("spin", function(oEvent) {
		oEvent.detail ? that.stepUp() : that.stepDown();
		// Dispatch input event
		cXHTMLElement_input.dispatchInputEvent(that);
	});
	this.contentFragment.appendChild(this._spinButtons);
};
cXHTMLElement_input.prototype	= new cXHTMLInputElement("input");

// Public Properties
cXHTMLElement_input.prototype.value	= "";
cXHTMLElement_input.prototype.checked	= false;

cXHTMLElement_input.prototype.selectionStart	= null;
cXHTMLElement_input.prototype.selectionEnd		= null;

cXHTMLElement_input.prototype.list	= null;
cXHTMLElement_input.prototype.selectedOption	= null;

//
cXHTMLElement_input.prototype.valueAsNumber	= NaN;
cXHTMLElement_input.prototype.valueAsDate	= null;

// Private properties
cXHTMLElement_input.prototype.$captured	= false;

cXHTMLElement_input.prototype.$isAccessible	= function() {
	return cXHTMLElement.prototype.$isAccessible.call(this) && this.getAttribute("type") != "hidden";
};

// Public methods
cXHTMLElement_input.prototype.select	= function() {
	this.$getContainer().select();
};

cXHTMLElement_input.prototype.setSelectionRange	= function() {

};

cXHTMLElement_input.prototype.stepUp	= function() {
	var nValue	= parseFloat(this.getAttribute("value")),
		nStep	= parseFloat(this.getAttribute("step")) || 1,
		nMin	= parseFloat(this.getAttribute("min")),
		nMax	= parseFloat(this.getAttribute("max"));

	if (isNaN(nMin))
		nMin	= 0;
	if (isNaN(nMax))
		nMax	= 100;
	if (nMax < nMin)
		nMax	= nMin;

	if (isNaN(nValue))
		nValue	= nMax;
	else
	if (nValue + nStep > nMax)
		nValue	= nMax;
	else
		nValue	+= nStep;

	this.value	= '' + nValue;
	this.valueAsNumber	= nValue;
	this.setAttribute("value", nValue);
};

cXHTMLElement_input.prototype.stepDown	= function() {
	var nValue	= parseFloat(this.getAttribute("value")),
		nStep	= parseFloat(this.getAttribute("step")) || 1,
		nMin	= parseFloat(this.getAttribute("min")),
		nMax	= parseFloat(this.getAttribute("max"));

	if (isNaN(nMin))
		nMin	= 0;
	if (isNaN(nMax))
		nMax	= 100;
	if (nMax < nMin)
		nMax	= nMin;

	if (isNaN(nValue))
		nValue	= nMin;
	else
	if (nValue - nStep < nMin)
		nValue	= nMin;
	else
		nValue	-= nStep;

	this.value	= '' + nValue;
	this.valueAsNumber	= nValue;
	this.setAttribute("value", nValue);
};

// Class Events Handlers
cXHTMLElement_input.handlers	= {
	"focus":	function(oEvent) {
		var that	= this;
		setTimeout(function(){try {that.$getContainer("value").focus();that.$getContainer("field").scrollLeft=0;}catch(e){}},0);
		this.$getContainer("placeholder").style.display	= "none";
	},
	"blur":		function(oEvent) {
//		try {this.$getContainer("value").blur();}catch(e){}
		// Hide placeholder
		this.$getContainer("placeholder").style.display	= this.getAttribute("value") ? "none" : "";

		var sType	= this.getAttribute("type");
		switch (sType) {
			// Hide popup
			case "date":
			case "color":
			case "datetime":
			case "datetime-local":
			case "month":
			case "week":
				cXHTMLElement_input.toggle(this, false);
				break;

			default:
				this.setAttribute("value", this.$getContainer("value").value);
		}

		// Dispatch change event
		var oChangeEvent	= this.ownerDocument.createEvent("UIEvent");
		oChangeEvent.initUIEvent("change", true, false, window, null);
		this.dispatchEvent(oChangeEvent);
	},
	"click":	function(oEvent) {
		if (oEvent.target == this) {
			if (oEvent.$pseudoTarget == this.$getContainer("button")) {
				switch (this.getAttribute("type")) {
					case "file":
					case "date":
					case "color":
					case "datetime":
					case "datetime-local":
					case "month":
					case "week":
						this.$activate();
						break;
				}
			}
			else {
				switch (this.getAttribute("type")) {
					case "radio":
					case "checkbox":
					//
					case "submit":
					case "reset":
						this.$activate();
						break;
				}
			}
		}
	},
	"mousedown":	function(oEvent) {
		if (oEvent.target == this) {
			switch (this.getAttribute("type")) {
				case "range":
					if (oEvent.$pseudoTarget != this.$getContainer("button"))
						break;
				case "reset":
				case "submit":
				case "button":
					this.$captured	= true;
					this.setCapture(true);
					this.$setPseudoClass("active", true);
					break;
			}
		}
	},
	"mouseup":	function(oEvent) {
		if (oEvent.target == this) {
			switch (this.getAttribute("type")) {
				case "reset":
				case "submit":
				case "button":
				case "range":
					if (this.$captured) {
						this.$captured	= false;
						this.releaseCapture();
						this.$setPseudoClass("active", false);
						//
						if (this.getAttribute("type") == "range")
							this.setAttribute("value", this.valueAsNumber);
					}
					break;
			}
		}
	},
	"mousemove":	function(oEvent) {
		if (oEvent.target == this) {
			switch (this.getAttribute("type")) {
				case "range":
					if (this.$captured) {
						var oRect	= this.getBoundingClientRect("field"),
							nLeft	= Math.max(oRect.left, Math.min(oEvent.clientX, oRect.right)),
							nRatio	= (nLeft - oRect.left) / (oRect.right - oRect.left);

						var nStep	= parseFloat(this.getAttribute("step")) || 1,
							nMin	= parseFloat(this.getAttribute("min")),
							nMax	= parseFloat(this.getAttribute("max"));

						if (isNaN(nMin))
							nMin	= 0;
						if (isNaN(nMax))
							nMax	= 100;
						if (nMax < nMin)
							nMax	= nMin;
						// Save current value
						this.valueAsNumber	= Math.round(nStep * (nMin + (nMax - nMin) * nRatio)) / nStep;
						// Update thumb position
						this.$getContainer("button").style.left	= cXHTMLElement_input.getRangeOffset(this, this.valueAsNumber);
					}
					break;
			}
		}
	},
	"keydown":	function(oEvent) {
		// Handle spin buttons
		if (oEvent.target == this) {
			var sKey	= oEvent.keyIdentifier;
			switch (this.getAttribute("type")) {
				case "range":
					if (sKey == "Right") {
						this.stepUp();
						cXHTMLElement_input.dispatchInputEvent(this);
					}
					else
					if (sKey == "Left") {
						this.stepDown();
						cXHTMLElement_input.dispatchInputEvent(this);
					}
					break;

				case "number":
					if (sKey == "Up") {
						this.stepUp();
						cXHTMLElement_input.dispatchInputEvent(this);
					}
					else
					if (sKey == "Down") {
						this.stepDown();
						cXHTMLElement_input.dispatchInputEvent(this);
					}
					break;

				case "radio":
					break;

				case "checkbox":
					if (sKey == "U+0020")	// Space
						// TODO: Use keydown instead of click
//						this.$activate();
						break;
			}
		}
	},
	"keyup":	function(oEvent) {
		// Handle spin buttons
	},
	"DOMActivate":	function(oEvent) {
		if (oEvent.target == this) {
			switch (this.getAttribute("type")) {
				case "submit":
					if (this.form)
						this.form.submit();
					break;

				case "reset":
					if (this.form)
						this.form.reset();
					break;

				case "file":
					this.$getContainer("value").click();
					break;

				case "color":
				case "date":
				case "datetime":
				case "datetime-local":
				case "month":
				case "week":
					cXHTMLElement_input.toggle(this);
					break;

				case "checkbox":
					this.setAttribute("checked", this.getAttribute("checked") == "true" ? "false" : "true");
					break;

				case "radio":
					var sName	= this.getAttribute("name");
					if (sName && this.form)
						for (var nIndex = 0, oElement; nIndex < this.form.elements.length; nIndex++)
							if ((oElement = this.form.elements[nIndex]) && oElement.getAttribute("type") == "radio" && oElement.getAttribute("name") == sName)
								if (oElement.getAttribute("checked") == "true")
									this.form.elements[nIndex].removeAttribute("checked");
					this.setAttribute("checked", "true");
					break;
			}
		}
	},
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		//
		cXHTMLInputElement.register(this);
		//
		this.$selectable	= this.getAttribute("type") != "range";
	},
	"DOMNodeRemovedFromDocument":	function(oEvent) {
		//
		cXHTMLInputElement.unregister(this);
	}
};

cXHTMLElement_input.prototype.$mapAttribute	= function(sName, sValue) {
	if (sName == "type") {
		// Re-render content
		var oElementDOM	= this.$getContainer(),
			oFactory	= document.createElement("div");
		oFactory.innerHTML	= this.$getTag();
		oElementDOM.parentNode.replaceChild(oFactory.firstChild, oElementDOM);
	}
	else
	if (sName == "placeholder") {
		this.$getContainer("placeholder").innerHTML	= ample.$encodeXMLCharacters(sValue || '');
	}
	else
	if (sName == "checked") {
		this.$setPseudoClass("checked", sValue != null && sValue != "false");
	}
	else
	if (sName == "disabled") {
		this.$setPseudoClass("disabled", sValue != null, "value");	// Why on value pseudo-element?
		this.$getContainer("value").disabled	= sValue != null;
	}
	else
	if (sName == "value") {
		if (this.getAttribute("type") == "range") {
			this.$getContainer("button").style.left	= cXHTMLElement_input.getRangeOffset(this, sValue || '');
		}
		else {
			this.$getContainer("value").value	= sValue || '';
		}
	}
	else
		cXHTMLElement.prototype.$mapAttribute.call(this, sName, sValue);
};

// Static Members
cXHTMLElement_input.toggle	= function(oInstance, bForce) {
	// Toggle popup
	var oPopup	= oInstance.$getContainer("popup");
	if ((arguments.length > 1 && bForce == true) || !(arguments.length > 1 || oPopup.style.display != "none")) {
		oInstance.$setPseudoClass("active", true);
		oPopup.style.display	= "";
	}
	else {
		oInstance.$setPseudoClass("active", false);
		oPopup.style.display	= "none";
	}

	switch (oInstance.getAttribute("type")) {
		case "date":
		case "datetime":
		case "datetime-local":
		case "month":
		case "week":
			if (!oInstance.datepicker) {
				var oElement	= ample.createElement("datepicker");
				oPopup.innerHTML	= oElement.$getTag();
				oInstance.contentFragment.appendChild(oElement);
				oInstance.datepicker	= oElement;
			}
			oInstance.datepicker.setAttribute("value", "2010-11-23"/*oInstance.getAttribute("value")*/);
			break;

		case "color":
			if (!oInstance.colorpicker) {
				var oElement	= ample.createElement("colorpicker");
				oPopup.innerHTML	= oElement.$getTag();
				oInstance.contentFragment.appendChild(oElement);
				oInstance.colorpicker	= oElement;
			}
			oInstance.colorpicker.setAttribute("value", "#ffffff"/*oInstance.getAttribute("value")*/);
			break;
	}
};

cXHTMLElement_input.getRangeOffset	= function(oInstance, nValue) {
	var nMax	= parseFloat(oInstance.getAttribute("max")),
		nMin	= parseFloat(oInstance.getAttribute("min"));

	if (isNaN(nMin))
		nMin	= 0;
	if (isNaN(nMax))
		nMax	= 100;
	if (nMax < nMin)
		nMax	= nMin;

	return 100 * (Math.max(nMin, Math.min(nMax, nValue)) - nMin) / (nMax - nMin) + '%';
};

cXHTMLElement_input.dispatchInputEvent	= function(oInstance) {
	var oEvent	= oInstance.ownerDocument.createEvent("Event");
	oEvent.initEvent("input", false, false);
	oInstance.dispatchEvent(oEvent);
};

cXHTMLElement_input.html524	= {
	"hidden":	"hidden",
	"password":	"password",
	"checkbox":	"checkbox",
	"radio":	"radio",
	"file":		"file",
	"submit":	"submit",
	"image":	"image",
	"reset":	"reset",
	"button":	"button"
};

// Element Render: open
cXHTMLElement_input.prototype.$getTagOpen		= function() {
	var sType	= this.getAttribute("type") || "text",
		sValue	= this.getAttribute("value") || "",
		sClassName	=(this.prefix ? this.prefix + '-' : '') + this.localName,
		sClassNameType	= sClassName + '-type-' + sType,
		bChecked	= this.hasAttribute("checked") && this.getAttribute("checked") != "false",
		bRequired	= this.hasAttribute("required") && this.getAttribute("required") != "false",
		bDisabled	= this.hasAttribute("disabled") && this.getAttribute("disabled") != "false",
		bReadonly	= this.hasAttribute("readonly") && this.getAttribute("readonly") != "false",
		bValid		= cXHTMLInputElement.isValid(this),
		aHtml	= [];
	aHtml.push('<span class="' + sClassName + ' ' + sClassNameType +
						(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '') +
						' ' + sClassName + '_' + (bChecked ? 'checked' : '') + ' '+
						' ' + sClassName + '_' + (bRequired ? 'required' : 'optional') + ' '+
						' ' + sClassName + '_' + (bDisabled ? 'disabled' : 'enabled') + ' '+
						' ' + sClassName + '_' + (bReadonly ? 'read-only' : 'read-write') + ' '+
						' ' + sClassName + '_' + (bValid ? 'valid' : 'invalid') + ' '+
				'" ' +(this.hasAttribute("style") ? ' style="' + this.getAttribute("style") + '"' : '')+ '>');
	aHtml.push(	'<div style="position:absolute;white-space:nowrap;' + (sValue == '' ? '' : 'display:none')+ '" class="' + sClassName + '--placeholder">' +
					(this.getAttribute("placeholder") || '')+
				'</div>');
	aHtml.push(	'<span class="' + sClassName + '--before ' + sClassNameType + '--before" style="float:left"></span>');
	aHtml.push(	'<span class="' + sClassName + '--after ' + sClassNameType + '--after" style="float:right"></span>');
	aHtml.push(	'<div class="' + sClassName + '--field ' + sClassNameType + '--field" style="position:relative">');
	aHtml.push(		'<div class="' + sClassName + '--button ' + sClassNameType + '--button" style="' +
						(sType == "range"
							? "left:" + cXHTMLElement_input.getRangeOffset(this, sValue)
							: "right:0")+
					'">');
	if (sType == "number" || sType == "time")
		aHtml.push(this._spinButtons.$getTag());
	aHtml.push(		'</div>');
	aHtml.push(		'<input class="' + sClassName + '--value ' + sClassNameType + '--value" \
						type="' +(cXHTMLElement_input.html524[sType] || "text")+ '" \
						onchange="var o = ample.$instance(this).$getContainer(\'label\'); o.innerText = o.textContent = this.value"' +
						(this.hasAttribute("readonly") ? ' readonly="true"' : '') +
						(this.hasAttribute("disabled") ? ' disabled="true"' : '') +
						(this.hasAttribute("maxlength") ? ' maxlength="' + this.getAttribute("maxlength") + '"' : '') +
						(sValue ? ' value="' + ample.$encodeXMLCharacters(sValue) + '"' : '') +
						(this.hasAttribute("name") ? ' name="' + ample.$encodeXMLCharacters(this.getAttribute("name")) + '"' : '')+
					'/>');
	aHtml.push(		'<div class="' + sClassName + '--label ' + sClassNameType + '--label">' +
						(sType == "reset" || sType == "submit" || sType == "button"
							? sValue
							: sType == "date"
								? ample.locale.format(ample.locale.parseDate(sValue, "yyyy-mm-dd"), "D")
								: sType == "time" || sType == "color"
									? sValue : '') +
					'</div>');
	aHtml.push(	'</div>');
	aHtml.push(	'<div class="' + sClassName + '--popup" style="position:absolute;display:none">');
	return aHtml.join('');
};

// Element Render: close (cancel double tag)
cXHTMLElement_input.prototype.$getTagClose	= function() {
	var aHtml	= [];
	aHtml.push(	'</div>');
	aHtml.push('</span>');
	return aHtml.join('');
};

// Register Element
ample.extend(cXHTMLElement_input);

/*
switch (this.getAttribute("type")) {
// Hidden
// .value
case "hidden":	// n/a
	break;

// E-mail
// @autocomplete, @list, @maxlength, @multiple, @pattern, @placeholder, @readonly, @required, @size
// .value, .list, .selectedOption, .selectionStart, .selectionEnd
// select(), setSelectionRange()
// oninput, onchange
case "email":	// A text field
	break;

// Password
// @autocomplete, @maxlength, @pattern, @placeholder, @readonly, @required, @size
// .value, .selectionStart, .selectionEnd
// select(), setSelectionRange()
// oninput, onchange
case "password":// Text field that obscures data entry
	break;

// Date and Time,  Date,  Month,  Week,  Time | Local Date and Time,  Number
// @autocomplete, @list, @max, @min, @readonly, @required, @step
// .value, .valueAsDate (not Local Date and Time, Number) .valueAsNumber, .list, .selectedOption
// .stepDown(), .stepUp()
// oninput, onchange
case "datetime":// A date and time control
	break;

case "date":	// A date control
	break;

case "month":	// A month control
	break;

case "week":	// A week control
	break;

case "time":	// A time control
	break;

case "datetime-local":	// A date and time control
	break;

case "number":	// A text field or spinner control
	break;

// Range
// @autocomplete, @list, @max, @min, @step
// .value, .valueAsNumber, .list, .selectedOption
// .stepDown(), .stepUp()
// onchange, oninput
case "range":	// A slider control or similar
	break;

// Color
// @autocomplete, @list
// .value, .list, .selectedOption
// oninput, onchange
case "color":	// A color well
	break;

// Checkbox,  Radio Button
// @checked, @required
// .checked, @value (default/on)
// onchange
case "checkbox":// A checkbox
case "radio":	// A radio button
	break;

// File Upload
// @accept, @multiple, @required
// .files, .value
// onchange
case "file":	// A label and a button
	break;

// Submit Button, Image Button
// @formaction, @formenctype, @formmethod, @formnovalidate, @formtarget
// .value (default)
// image: @alt, @src, @height, @width
case "submit":	// A button
	break;

case "image":	// Either a clickable image, or a button
	break;

// Reset Button,  Button
// @value (default)
case "reset":	// A button
	break;

case "button":	// A button
	break;

// Text,  Search,  URL,  Telephone
// @autocomplete, @list, @maxlength, @pattern, @placeholder, @readonly, @required, @size
// .value, .list, .selectedOption, .selectionStart, .selectionEnd
// select(), setSelectionRange()
// oninput, onchange
case "search":	// Search field
	break;

case "tel":		// A text field
	break;

case "url":		// A text field
	break;

//case "text":	// Text field
default:
	break;
}
*/