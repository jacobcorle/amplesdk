/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cHTML5Element_pre	= function(){};
cHTML5Element_pre.prototype	= new cHTML5Element;

// Register Element with language
oHTML5Namespace.setElement("pre", cHTML5Element_pre);
