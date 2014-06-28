/*
  jquery.css3.ie7/8/9.js - copyright 2004-2010, GuCong
  http://jquerycss3.googlecode.com/
  http://www.gnu.org/licenses/gpl.html
*/
( function($, undefined) {
var piePath = $(document.scripts).last().attr("src").replace(/[\w.]+$/, function(str){
	return "PIE.js";
});
alert(piePath)
function cssSet(elem){
	function runcode(){
		window.PIE.attach(elem);
	}
    if (window.PIE) {
        runcode();
    } else {
		$.getScript(piePath, runcode);
	}
}

function msFilter( elem, name, args ){

	//如果滤镜名未使用命名空间，自动使用微软的
	var filter = elem.filters[ name ] || elem.filters[ name = "DXImageTransform.Microsoft." + name ];

	if( args ){

		if(!filter){
			elem.style.filter = elem.currentStyle.filter + " progid:" + name + "()";
			filter = elem.filters[ name ];
			$.each(["opacity", "transform"], function(){
				$(this).css(this, $(this).css(this));
			});
		}

		for(var i in args){
			filter[i] = args[i];
		}

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

	var v=$.browser.msie,
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
		}
	};
}

if($.browser.msie < 9){

	$.cssHooks.borderRadius = $.cssHooks.boxShadow = $.cssHooks.textShadow = $.cssHooks.borderImage;

	$.cssHooks.transform = {
		set: function( elem, value ) {
			if( /^none$/i.test( value ) && msFilter(elem, "Matrix") ){
				msFilter( elem, "Matrix", {Enabled: false})
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
			msFilter( elem, "Matrix", {
				Dx: dx,
				Dy: dy,
				M11: m11,
				M12: m12,
				M21: m21,
				M22: m22,
				Enabled: true,
				SizingMethod: "auto expand"
			} );
			return value;
		}
	};
	$.cssHooks.opacity = {
		get: function( elem ) {
			var filter = msFilter( elem, "Alpha" );
			return elem.style.opacity || filter ? filter.Opacity / 100 : 1;
		},
		set: function( elem, value ) {
			//$.msFilter( elem, "BasicImage", { Enabled: value < 1, Opacity: value } );
			msFilter( elem, "Alpha", { Enabled: value < 1, Opacity: value * 100 } );
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