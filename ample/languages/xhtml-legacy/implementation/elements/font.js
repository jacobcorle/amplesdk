/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cXHTMLElement_font	= function(){};
cXHTMLElement_font.prototype	= new cXHTMLElement;

// Register Element with language
oXHTMLNamespace.setElement("font", cXHTMLElement_font);
