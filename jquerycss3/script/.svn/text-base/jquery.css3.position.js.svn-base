

//让IE6支持CSS的position可以为fixed
$.cssHooks.position = {
	get: function( elem ) {
		var pos = elem.currentStyle.position;
		return elem.style.getExpression("top") ||
			elem.runtimeStyle.getExpression("top") &&
			pos == "absolute" ? "fixed" : pos;
	},
	set: function( elem, value ) {
		$.cssHooks.display.set( elem );
		$.each( [ "top", "left", "right", "bottom" ], function( i, name ) {
			if( !elem.style[name] ) {
				elem.style[name] = elem.currentStyle[name];
			}
		} );
		if ( value == "fixed" ) {
			with ( elem.runtimeStyle ) {
				position = "absolute";
				setExpression("top","(style.bottom=='auto'?(style.top=='auto'?offsetTop:style.pixelTop):offsetParent.clientHeight-offsetHeight-style.pixelBottom)+offsetParent.scrollTop");
				setExpression("left","(style.right=='auto'?(style.left=='auto'?offsetLeft:style.pixelLeft):offsetParent.clientWidth-offsetWidth-style.pixelRight)+offsetParent.scrollLeft");
			}
			with ( elem.offsetParent ) {
				var bgImg = currentStyle.backgroundImage;
				if ( bgImg == "none" || bgImg == "url(about:blank)" ) {
					style.backgroundImage = "url(about:blank)";
					style.backgroundRepeat = "no-repeat";
					style.backgroundAttachment = "fixed";
				}
			}
		} else {
			with ( elem.runtimeStyle ) {
				removeExpression( "top" );
				removeExpression( "left" );
				top = left = position = "";
			}
		}
		return value;
	}
};

//IE6的width和min-width完全就是一回事。height同理 
$.cssHooks.minWidth = "width";
$.cssHooks.minHight = "height";
