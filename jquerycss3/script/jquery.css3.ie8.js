/*
  jquery.css3.ie7/8/9.js - copyright 2004-2010, GuCong
  http://jquerycss3.googlecode.com/
  http://www.gnu.org/licenses/gpl.html
*/
if(!$){
	var $ = jQuery;
}

//$.getScript( "http://classicalroms.googlecode.com/svn/trunk/Classical-Roms/public/scripts/ie/DD_roundies-min.js" );
//document.writeln('<!--[if lt IE 9]><script type="text/javascript" src="http://classicalroms.googlecode.com/svn/trunk/Classical-Roms/public/scripts/ie/DD_roundies-min.js"></script><![endif]-->');

$( function() {
	with ( document.body ) {
		if( $.browser.msie < 6 && currentStyle.backgroundColor == "#ffffff" ) {
			style.backgroundColor = "transparent";
		}
	}
	for ( var i = 0; i < document.frames.length; i++ ) {
		var frame = document.frames[i].frameElement
		if ( !frame.allowTransparency ) {
			frame.setAttribute("allowTransparency", true, 0);
		}
		if ( !/\sframeBorder=/.test(frame.outerHTML) ) {
			frame.frameBorder = 0;
			frame.parentNode.replaceChild( frame.cloneNode( true ), frame );
		}
	}
} );

$.extend({
	rcolor: /#[0-9a-f]+|rgba?\([\d\,\s\%\.]+\)/ig,
	rrgba: /rgba\((\s*\d+\%?\s*,){3}\s*(0?.)?\d+\s*\)/i,
	radius: [ "borderTopLeftRadius", "borderTopRightRadius", "borderBottomRightRadius", "borderBottomLeftRadius" ],
	
	//操作滤镜的方法，返回给定滤镜对象。
	msFilter: function( elem, name, args ) {
		//如果支持滤镜才运行
		if ( elem.filters ) {
			//如果滤镜名未使用命名空间，自动使用微软的
			name = name.slice( name.lastIndexOf(".") + 1 );
			var filterObj = elem.filters[ name ] ||
				elem.filters[ name = "DXImageTransform.Microsoft." + name ];

			if ( !filterObj ) {
				elem.style.filter = elem.currentStyle.filter + " progid:" + name + "()";
				filterObj = elem.filters[name];
			}

			for ( var i in args ) {
				filterObj[i] = args[i];
			}
			return filterObj;
		}
	},

	getRgba: function( color ) {
		color = color.match( /rgba?\((\s*\d+\%?\s*,){2,3}\s*(0?.)?\d+\%?\s*\)/i );
		if ( color ){
			color = color[0];
			color = color.slice( color.indexOf( "(" ) + 1, color.lastIndexOf( ")" ) ).split( "," );
			for( var i = 0; i < 3; i++ ) {
				if ( color[i].indexOf( "%" ) > 0 ){
					color[i] = parseFloat( color[i] ) * 2.55;
				}
				color[i] = parseInt( color[i] ) & 0xff;
			}
			var a;
			a = parseFloat( color[3] ) * 0xff;
			if( color[3].indexOf( "%" ) > 0 ) {
				a = a / 100;
			}
			return { r: color[0], g: color[1] ,b: color[2], a: a & 0xff, valueOf: function() {
					var argb = this.b;
					argb |= this.g << 8;
					argb |= this.r << 16;
					argb += this.a * 0x1000000;
					return argb;
				} };
		}
	},

	getBrackSubstr: function( str, header ) {
		if( new RegExp( header + "\\s\*\\(", "i" ).test( str ) ) {
			for( var i = RegExp.lastIndex, lNum = 1, rNum = 0; i < str.length; i++ ) {
				var char = str.substr( i, 1 );
				if ( char == "(" ) {
					lNum++;
				} else if ( char == ")" ) {
					rNum ++;
					if( lNum == rNum ){
						break;
					}
				}
			}
			$.getBrackSubstr.str = str.slice( 0, RegExp.lastIndex - RegExp.lastMatch.length  ) + str.slice( i + 1 );
			return str.substring( RegExp.lastIndex, i );
		}
	}
} );

$.cssHooks.opacity = {
	get: function( elem ) {
		return $.msFilter( elem, "Alpha" ).Opacity / 100;
	},
	set: function( elem, value ) {
		//$.msFilter( elem, "BasicImage", { Enabled: value < 1, Opacity: value } );
		$.msFilter( elem, "Alpha", { Enabled: value < 1, Opacity: value * 100 } );
	}
};

/*@cc_on
@if ( @_jscript_version < 9 )
$.cssHooks.transform = {
	set: function( elem, value ) {
		function angle( ang ) {
			if ( /deg/i.test( ang ) ) {
				ang = parseFloat( ang ) / 180 * Math.PI;
			}
			return parseFloat( ang );
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
        	trans = value.match( /[a-zA-Z]+\([^\)]*\)/g );
		//alert(trans)
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
		$.msFilter( elem, "Matrix",
			{
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

$.cssHooks.backgroundColor = {
	set:  function( elem, value ) {
		$.cssHooks.background.rest( elem );
		return value.replace( $.rrgba,
			function ( color ){
				elem.style.bgColor = color;
				elem.style.bgGradient = null;
				color = $.getRgba( color ).valueOf();
				$.msFilter( elem, "Gradient", { StartColor: color, EndColor: color } );
				return "transparent";
			});
	}
};
@end @*/

$.cssHooks.backgroundImage = {
	set: function( elem, value ) {
		$.cssHooks.background.rest( elem );
		var gradient = $.getBrackSubstr( value, "linear-gradient" );
		if( gradient ) {
			elem.style.bgGradient = "linear-gradient(" + gradient + ")";
			value = $.getBrackSubstr.str;
			function color( str ){
				if ( /#([0-9a-f]*)/i.test(str) ){
					if( RegExp.$1.length == 3 ) {
						str = "";
						for ( var i = 0; i < 3; i++ ){
							var s =  RegExp.$1.substr( i, 1 );
							str += s + s;
						}
					} else {
						str = RegExp.$1;
					}
					str = "#" + str;
				}else{
					str = $.getRgba( str ).valueOf();
				}
				return str;
			}

			var colors = gradient.match($.rcolor);
				sColor = color(colors[0]),
				eColor = color(colors[1]),
				filter = $.msFilter( elem, "Gradient" ),
				l = gradient.indexOf("left") >= 0,
				r = gradient.indexOf("right") >= 0,
				b = gradient.indexOf("bottom") >= 0;
			typeof sColor == "number" ? filter.StartColor = sColor : filter.StartColorStr = sColor;
			typeof eColor == "number" ? filter.EndColor = eColor : filter.EndColorStr = eColor;
			filter.GradientType = l || r ? 1 : 0;
			if( r || b ) {
				eColor = filter.EndColor;
				filter.EndColor = filter.StartColor;
				filter.StartColor = eColor;
			}
			elem.style.backgroundColor = "transparent";
			return "url(about:blank)";
		} else if ( $.browser.version < 7 && /(url\(.*\.png\))/i.test( value ) ) {
			elem.style.backgroundImage = RegExp.$1;
			$.cssHooks.borderRadius.rest( elem );
		}
		return value;
	}
};

$.cssHooks.background = {
	set: function( elem, value ) {
		$.cssHooks.background.rest( elem );
		if( /linear-gradient/i.test( value ) || /url\(.*\.png\)/i.test( value ) ) {
			value = $.cssHooks.backgroundImage.set( elem, value );
		} else {
			value = $.cssHooks.backgroundColor.set( elem, value );
		}
		return value;
	},

	rest: function( elem ) {
		var n = "Gradient";
		if ( elem.filters[ n ] || elem.filters[ "DXImageTransform.Microsoft." + n ] ) {
			$.msFilter( elem, n, { StartColor: 0, EndColor: 0 } );
		}
	}
};

$.cssHooks.boxShadow = {
	set: function( elem, value ) {
		if( elem.boxShadow ) {
			try {
				var shadow = elem.boxShadow;
				clearInterval( shadow.interval );
				shadow.parentNode.removeChild( shadow );
			} catch ( ex ) {}
		}
		if( !value ) {
			return "";
		}
		var args, x, y, len, color, shadow;
		args = value.replace( $.rcolor, function( c ) {
			color = c;
			return "";
		} );
		color = color || "#000";
		args = args.split(/\s/);
		y = parseFloat(args[0]) || 0;
		x = parseFloat(args[1]) || 0;
		len = parseFloat(args[2]) || 0;

		elem.style.zIndex = (parseInt( elem.currentStyle.zIndex ) || 0);

		shadow = document.createElement( "div" );
		elem.parentNode.appendChild( shadow );
		shadow.ele = elem;

		elem.boxShadow = shadow;
		$.msFilter(shadow,"Blur",{Enabled:true,MakeShadow:false,PixelRadius:len});

		len /= 2;
		x -= len;
		y -= len;
		try {
			shadow.style.backgroundColor = color;
		} catch ( ex ) {
			color = $.getRgba( color );
			if ( color.r + color.g + color.b < 0xf ) {
				shadow.style.backgroundColor = "#fff";
				$.msFilter(shadow,"Blur",{MakeShadow:true,ShadowOpacity: color.a / 0xff,PixelRadius:len});
			} else {
				shadow.style.backgroundColor = "rgb(" + [ color.r, color.g, color.b ] + ")";
				$.cssHooks.opacity.set( shadow, color.a / 0xff );
				x += len - 2;
				y += len - 2;
			}
		}
		shadow.style.position = "absolute";
		if ( elem.offsetParent != null && elem.offsetParent != shadow.offsetParent ) {
			with( elem.parentNode.style ){
				position = "relative";
				top = left =  right = bottom = "auto";
			}
		} else {
			elem.style.zIndex++;
		}
		with( shadow.style ){
			try {
				setExpression("top", "ele.offsetTop+" + x);
				setExpression("left", "ele.offsetLeft+" + y);
				setExpression("width", "ele.offsetWidth");
				setExpression("height", "ele.offsetHeight");
				setExpression("zIndex", "ele.style.zIndex-1");
				if( $.browser.msie > 6 ) {
					setExpression("position", "ele.currentStyle.position=='fixed'?'fixed':'absolute'");
				}
			} catch( ex ) {
				shadow.interval = setInterval( function() {
					top = elem.offsetTop + x;
					left = elem.offsetLeft + y;
					width = elem.offsetWidth;
					height = elem.offsetHeight;
					zIndex = elem.style.zIndex - 1;
					position = elem.currentStyle.position == "fixed" ? "fixed" : "absolute";
				}, 200 );
			}
		}
		return value;
	}
};

$.cssHooks.textShadow = {
	set: function( elem, value ) {
		if( elem.textShadow ) {
			try {
				var shadow = elem.textShadow;
				clearInterval( shadow.interval );
				shadow.parentNode.removeChild( shadow );
			} catch ( ex ) {}
		}
		for( var i = 0; i < elem.children.length; i++ ) {
			if( !elem.children[ i ].ele ) {
				$.cssHooks.textShadow.set( elem.children[ i ], value );
			}
		}
		if( !value ) {
			return value;
		}
		var args, x, y, len, color, shadow;
		args = value.replace( $.rcolor, function( c ) {
			color = c;
			return "";
		} );
		color = color || "#000";
		args = args.split(/\s/);
		y = parseFloat(args[0]) || 0;
		x = parseFloat(args[1]) || 0;
		len = parseFloat(args[2]) || 0;

		len /= 2;
		x -= len;
		y -= len;

		elem.style.zIndex = (parseInt( elem.currentStyle.zIndex ) || 0);
		shadow = document.createElement( "div" );
		elem.parentNode.appendChild( shadow );
		shadow.ele = elem;
		elem.textShadow = shadow;
		$.msFilter(shadow,"Blur",{Enabled:true,MakeShadow:false,PixelRadius:len + 1});
		try {
			shadow.style.color = color;
		} catch ( ex ) {
			color = $.getRgba( color );
			shadow.style.color = "rgb(" + [ color.r, color.g, color.b ] + ")";
		}
		shadow.style.position = "absolute";
		if ( elem.offsetParent != null && elem.offsetParent != shadow.offsetParent ) {
			with( elem.parentNode.style ){
				position = "relative";
				top = left =  right = bottom = "auto";
			}
		}
		with( shadow.style ){
			padding = elem.currentStyle.padding;
			textAlign = elem.currentStyle.textAlign;
			lineHeight = elem.currentStyle.lineHeight;
			try {
				setExpression("top", "ele.offsetTop+" + x);
				setExpression("left", "ele.offsetLeft+" + y);
				setExpression("innerText", "innerText=ele.innerText");
				setExpression("width", "ele.clientWidth");
				setExpression("height", "ele.clientHeight");
				setExpression("zIndex", "ele.style.zIndex+1");
				if( $.browser.msie > 6 ) {
					setExpression("position", "this.ele.currentStyle.position=='fixed'?'fixed':'absolute'");
				}
				function setExp( name ) {
					setExpression( name, "ele.currentStyle." + name);
				}
				setExp("padding");
				setExp("textAlign");
				setExp("lineHeight");

				for( var i in elem.currentStyle ){
					if( i.indexOf("text")==0 || i.indexOf("font")==0 || i.indexOf("align") > 0 ){
						setExp(i);
					}
				}
				//shadow.interval = setInterval( setText );
			} catch( ex ) {
				shadow.interval = setInterval( function() {
					shadow.innerText = elem.innerText;
					top = elem.offsetTop + x;
					left = elem.offsetLeft + y;
					width = elem.clientWidth;
					height = elem.clientHeight;
					var style = shadow.style, currCSS = elem.currentStyle;
					padding = currCSS.padding;
					zIndex = currCSS.zIndex + 1;
					lineHeight = currCSS.lineHeight;
					position = currCSS.position == "fixed" ? "fixed" : "absolute";
					for(var i in currCSS){
						if( i.indexOf("text")==0 || i.indexOf("font")==0 || i.indexOf("align")>0){
							style[ i ] = currCSS[ i ];
						}
					}
				}, 200 );
			}
		}
		return value;
	}
};

$.cssHooks.borderRadius = {
	set: function( elem, value ) {
		var rad = value.split(/\s/);
		for ( var i = 0; i < 4; i++ ) {
			rad[i] = parseFloat( rad[i] );
			rad[i] = !rad[i] && rad[i] != 0 ? rad[Math.max((i-2), 0)] : rad[i];
			elem.style[ $.radius[ i ] ] = rad[ i ];
		}
		$.cssHooks.borderRadius.rest( elem, rad );
	},

	rest: function( elem, rad ) {
		if( !rad ) {
			rad = new Array();
			for ( var i = 0; i < 4; i++ ) {
				rad[ i ] = elem.style[ $.radius[ i ] ];
				rad[ i ] = rad[ i ] ? parseFloat( rad[ i ] ) : 0;
			}
		}
		function set(){
			try{
				DD_roundies.roundify.call( elem, rad );
			}catch(ex){}
		}
		if(window.DD_roundies){
			set();
		}else{
			$.getScript( "http://www.dillerdesign.com/experiment/DD_roundies/DD_roundies_0.0.2a-min.js", set );
		}
	}
}

$.each( $.radius, function( j, name ) {
	$.cssHooks[ name ] = {
		set: function( elem, value ) {
			elem.style[ name ] = value;
			$.cssHooks.borderRadius.rest( elem );
		}
	}
} );