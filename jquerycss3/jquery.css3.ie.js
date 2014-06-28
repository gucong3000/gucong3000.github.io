/*
  jquery.css3.ie.js - copyright 2004-2010, GuCong
  http://jquerycss3.googlecode.com/
  http://www.gnu.org/licenses/gpl.html
*/
( function($, undefined) {

function cssSet(elem){
	function runcode(){
		window.PIE.attach(elem);
	}
    if (window.PIE) {
        runcode();
    } else {
		$.getScript( document.location.protocol + "//jquerycss3.googlecode.com/svn/PIE.js", runcode );
	}
}

function getFilter(elem, filter, name) {
	filter = elem.filters[filter] ? filter : "DXImageTransform.Microsoft." + filter;
	if( name ){
		try{
			return elem.filters[filter][name[0].toUpperCase() + name.slice(1)];
		}catch(ex){}
	} else {
		return filter;
	}
}

function setFilter( elem, name, args ) {
	name = getFilter( elem, name );
	filterStr = $.map(elem.currentStyle.filter.replace(/^\s*none\s*$/i, "").split(/progid\s*:\s*/i), function(filter){
		if( filter && filter.indexOf(name) != 0 ){
			return "progid:" + filter;
		}
	}).join(" ");
	if( args ){
		var argStr = new Array();
		for(var i in args){
			argStr.push(i + "=" + args[i]);
		}
		filterStr += (" progid:" + name + "(" + argStr + ")");
	}
	return elem.style.filter = filterStr || "none";
}

function msFilter( elem, name, args ){
	//如果滤镜名未使用命名空间，自动使用微软的
	var filter = elem.filters[ getFilter( elem, name ) ];
	for(var i in args){
		filter[i] = args[i];
	}
	return filter;
}

function setZoom(elem){
	if($.browser.msie < 8){
		if(elem.currentStyle.zoom == "normal"){
			elem.style.zoom = 1;
		}
	}
	return elem;
}

$.cssHooks.borderImage = {
	set: function( elem, value ) {
		cssSet(elem);
		return value;
	}
};

if($.browser.msie < 10){

	var v = $.browser.msie,
	backReg = v < 7 ? /(gradient\()|(rgba\()|\,|(.png)/i : v < 9 ? /(gradient\()|(rgba\()|\,/i : /gradient\(/i;
	$.cssHooks.backgroundImage = {
		get: function( elem ) {
			return elem.style.PieBackground;
		},
		set: function( elem, value ) {
			if( elem.style.PieBackground || backReg.test(value)){
				elem.style.PieBackground = value;
				cssSet(elem);
			} else {
				return value;
			}
		}
	};

	$.cssHooks.background = {
		set: function( elem, value ) {
			return $.cssHooks.backgroundImage.set( elem, value );
		},
		get: $.noop
	};
}

if($.browser.msie < 9){

	$.cssHooks.borderRadius = $.cssHooks.boxShadow = $.cssHooks.borderImage;
	
	$.cssHooks.textShadow = {
		set: function( elem, value ) {
			var args, x, y, len, color, shadow, rcolor = /\s*rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d+|\d*\.\d+)\s*\)\s*/i;
			args = value.replace( rcolor, function( c ) {
				color = c.match( rcolor );
				color = $.map( color.slice(1) , function( n, i ){
					if( i > 2 ){
						return parseInt(parseFloat(n) * 0xff);
					} else {
						return parseInt(n);
					}
				});
				return "";
			} );
			if(color){
				shadow = (color[0] + ( color[1] * 0x100 ) + ( color[2] * 0x1000 ) ).toString(16);
				while ( shadow.length < 6 ){
					shadow = "0" + shadow;
				}
				if(color.length > 3){
					shadow = color[3].toString(16) + shadow;
					if(shadow.length < 8){
						shadow = "0" + shadow;
					}
				}
				shadow = "#" + shadow;
			} else {
				args = value.replace( /#\d+/, function( c ) {
					if(c.length < 6){
						c = "#" + c[1] + c[1] + c[2] + c[2] + c[3] + c[3];
					}
					shadow = c;
					return "";
				});
			}
			args = args.split(/\s/);
			setFilter( elem, "DropShadow", {color:shadow,offX:parseInt(args[0]),offY:parseInt(args[1])} );
			return value;
		}
	}

	$.cssHooks.transform = {
		set: function( elem, value ) {
			if( /^\s*none\s*$/i.test( value ) ){
				setFilter( elem, "Matrix" );
				return value;
			}
			setZoom(elem);
			function angle( ang ) {
				var val = parseFloat( ang );
				return /deg/i.test( ang ) ? val / 180 * Math.PI : val;
			}
	
			function getVal( val, dou ){
				var ox, oy;
				if ( val.indexOf(",") > 0 ) {
					val = val.split( "," );
					ox = val[ 0 ];
					oy = val[ 1 ];
				}else{
					ox = val;
					oy = dou ? ox : 0;
				}
				return { x: angle( ox ), y: angle( oy )};
			}
	
			function skew( m, ang ){
				return Math.sin( Math.asin( m ) + angle( ang ) );
			}
	
			var m11 = 1,
				m12 = 0,
				m21 = 0,
				m22 = 1,
				dx = 0,
				dy = 0,
				trans = value.match( /\w+\([^\)]*\)/g );
			for ( var i = 0; i < trans.length; i++ ) {
				var val = trans[ i ].match( /\(\s*(.+)\s*\)/ )[ 1 ];
				if ( /matrix/i.test( trans[ i ] ) ) {
					val = val.split( "," );
					for( var i = 0; i < val.length; i++ ) {
						val[ i ] = parseFloat( val[ i ] );
					}
					m11 = val[ 0 ];
					m21 = val[ 1 ];
					m12 = val[ 2 ];
					m22 = val[ 3 ];
					dx = val[ 4 ] || dx;
					dy = val[ 5 ] || dy;
				} else if ( /translateX/i.test( trans[ i ] ) ) {
					dx += parseFloat( val );
				} else if ( /translateY/i.test( trans[ i ] ) ) {
					dy += parseFloat( val );
				} else if ( /translate/i.test( trans[ i ] ) ) {
					val = getVal( val );
					dx += val.x;
					dy += val.y;
				} else if ( /scaleX/i.test( trans[ i ] ) ) {
					m11 *= parseFloat( val );
					//m22 = -m22;
				} else if ( /scaleY/i.test( trans[ i ] ) ) {
					m22 *= parseFloat( val );
					//m11 = -m11;
				} else if ( /scale/i.test( trans[ i ] ) ) {
					val = getVal( val, true );
					m11 *= val.x;
					m22 *= val.y;
				} else if ( /rotate/i.test( trans[ i ] ) ) {
					val = angle( val );
					m12 = -Math.sin( Math.asin( -m12 ) + val );
					m21 = skew( m21, val );
					val = Math.cos( val );;
					m11 *= val;
					m22 *= val;
				} else if ( /skewX/i.test( trans[ i ] ) ) {
					m12 = skew( m12, val );
				} else if ( /skewY/i.test( trans[ i ] ) ) {
					m21 = skew( m21, val );
				} else if ( /skew/i.test( trans[ i ] ) ) {
					val = getVal( val );
					m12 = skew( m12, val.x );
					m21 = skew( m21, val.y );
				}
			}
			setFilter( elem, "Matrix", {
				Dx: dx,
				Dy: dy,
				M11: m11,
				M12: m12,
				M21: m21,
				M22: m22,
				Enabled: true,
				SizingMethod: "'auto expand'"
			} );
			return value;
		},
		get: function( elem ) {
			m = msFilter( elem, "Matrix" );
			return m ? "matrix(" + [m.M11, m.M21, m.M12, m.M22, m.Dx + "px", m.Dy + "px"].join(", ") + ")" : "none";
		}
	};
	$.cssHooks.opacity = {
		get: function( elem ) {
			var opt = getFilter( elem, "Alpha", "Opacity" );
			return opt < 100 ? opt / 100 : 1;
		},
		set: function( elem, value ) {
			setFilter( elem, "Alpha", {opacity: value * 100 } );
			setZoom(elem);
			return value;
		}
	};
}

if($.browser.msie < 8){
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
}

if($.browser.msie < 7){
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
	}
};

} ) ( jQuery );