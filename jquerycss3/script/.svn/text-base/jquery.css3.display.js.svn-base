

//让IE支持CSS的display可以为inline-block
$.cssHooks.display = {
	set: function( elem, value ) {
		$.each( [ "width", "height" ], function( i, name ) {
			if( !elem.style[name] ) {
				elem.style[name] = elem.currentStyle[name];
			}
		} );
		with ( elem.runtimeStyle ) {
			setExpression( "display", "style.display=='inline-block'?'inline':style.display" );
			setExpression( "width", "currentStyle.position=='static'&&style.display=='inline'?'auto':style.width.indexOf('%')<0?style.width:parseFloat(style.width)/100*(offsetParent.clientWidth || offsetParent.offsetWidth)" );
			setExpression( "height", "currentStyle.position=='static'&&style.display=='inline'?'auto':style.height.indexOf('%')<0?style.height:parseFloat(style.height)/100*(offsetParent.clientHeight || offsetParent.offsetHeight)" );
		}
		return value;
	}
};