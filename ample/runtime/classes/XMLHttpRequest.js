/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

if (!cXMLHttpRequest)
{
    cXMLHttpRequest = function()
    {
        return new fActiveXObject("Microsoft.XMLHTTP");
    };
};
