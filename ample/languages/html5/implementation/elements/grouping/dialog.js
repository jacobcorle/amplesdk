/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cHTML5Element_dialog	= function(){};
cHTML5Element_dialog.prototype	= new cHTML5Element;

// Register Element with language
oHTML5Namespace.setElement("dialog", cHTML5Element_dialog);
