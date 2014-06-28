(function(win){

	var nav = win.navigator,
		doc = win.document,
		$ = win.jQuery,
		bro = {},
		js /*@cc_on = @_jscript_version @*/;
	//IE特有的条件编译，勿当做注释删除

	if(js){
		//IE

		bro.msie = js > 8 ? js : ( js > 5.7 ? 8 : (doc.compatMode == "CSS1Compat" ? "XMLHttpRequest" in win ? 7 : 6 : 5) );
		bro.version = doc.documentMode || bro.msie;
		nav.language = nav.userLanguage;

	} else if ( win.opera && opera.version ) {
		//Opera

		bro.opera = opera.version();

	} else if ( win.netscape ) {
		//Firefox

		try {
			bro.gecko = /\brv:\s?([\w.]+)\b/.exec(nav.userAgent)[1];
		} catch (ex) {
			bro.gecko = true;
		}

	} else {
		//WebKit

		//navigator.appVersion中取版本号
		function getver(name) {
			var sName = name.toLowerCase();
			try {
				bro[sName] = new RegExp(name + "\\/([\\w.]+)\\b").exec(nav.appVersion)[1];
			} catch (ex) {
				bro[sName] = true;
			}
		};

		//判定为webkit
		getver("WebKit");

		if(win.chrome){
			//判定为Chrome
			getver("Chrome");
		} else if (/^Apple/.test(navigator.vendor)){
			//判定为Safari
			getver("Safari");
		} else if (win.external && external.max_version){
			bro.maxthon = external.max_version;
		}

	};
	function cmpVersion(szV1, szV2) {
		var arrV1 = szV1.split(".");
		var arrV2 = szV2.split(".");

		for (var i = 0; i < arrV1.length && i < arrV2.length; i++) {
			if (parseInt(arrV1[i]) > parseInt(arrV2[i]))
				return (1);
			else if (parseInt(arrV1[i]) < parseInt(arrV2[i]))
				return (-1);
		}
		if (arrV1.length == arrV2.length) {
			return (0);
		} else if (arrV1.length > arrV2.length) {
			return (1);
		} else {
			if (arrV1.length == 2 && arrV1[1] == 0) {
				return (1);
			} else {
				return (-1);
			}
		}
	}
	bro.cmpVersion = function(key, ver) {
		var brover = bro[key];
		if(brover){
			return cmpVersion(brover.toString(), ver.toString());
		}
	}

	if($){
		$.browser = bro;
	}
	for (var i in bro){
		nav[i] = bro[i];
	}

})(this);