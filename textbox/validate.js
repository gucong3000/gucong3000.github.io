(function($){

var types = {
	url: new RegExp("^((https|http|ftp|rtsp|mms)://)"   
		+ "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" // ftp的user@   
		+ "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184   
		+ "|" // 允许IP和DOMAIN（域名）   
		+ "([0-9a-z_!~*'()-]+\.)*" // 域名- www.   
		+ "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名   
		+ "[a-z]{2,6})" // first level domain- .com or .museum   
		+ "(:[0-9]{1,4})?" // 端口- :80   
		+ "((/?)|" // a slash isn't required if there is no file name   
		+ "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$"),
	number: /^\d+(.\d+)?$/,
	email: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
};

var fixForms = {};

function validate(ele){
	function setInvalid(msg){
		$(ele).trigger("invalid", msg);
	}
	if((ele.required || ele.getAttribute("required") != null) ){
		if( ele.type == "radio" || ele.type == "checkbox" ){
			if(!ele.checked){
				setInvalid("checked");
			}
			return ele.checked;
		} else if (!ele.value) {
			setInvalid("required");
			return false;
		}
	}
	if(ele.value){
		if(ele.pattern && !new RegExp( ele.pattern ).test( ele.value )){
			setInvalid("pattern");
			return false;
		}
	
		var type = $(ele).attr("type");
		if(type in types && !types[type].test( ele.value )){
			setInvalid("type");
			return false;
		}
	}

	return true;
}

$("input, select, textarea").live("blur", function(e) {
	validate(this);
});

$("form").live("submit", function(e) {
	var retVal = true;
	var eles = this.elements;
	for (i=0; i<eles.length; i++){
		retVal = retVal && validate(eles.item(i));
	}
	return retVal;
}).live("focusin", function(e) {
	if(!fixForms[this]){
		this.novalidate = fixForms[this] = true;
	}
});


jQuery.fn.extend({
	invalid: function( fnInvalid, fnNormal ) {
		if(fnInvalid){
			this.bind( "invalid", fnInvalid );
			if(fnNormal){
				this.focusin( fnNormal );
			}
		} else {
			this.trigger( "invalid" );
		}
		return this;
	}
});

})(jQuery);


// iepp v2.1pre @jon_neal & @aFarkas github.com/aFarkas/iepp
// html5shiv @rem remysharp.com/html5-enabling-script
// Dual licensed under the MIT or GPL Version 2 licenses
/*@cc_on(function(a,b){function r(a){var b=-1;while(++b<f)a.createElement(e[b])}if(!window.attachEvent||!b.createStyleSheet||!function(){var a=document.createElement("div");return a.innerHTML="<elem></elem>",a.childNodes.length!==1}())return;a.iepp=a.iepp||{};var c=a.iepp,d=c.html5elements||"abbr|article|aside|audio|canvas|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|subline|summary|time|video",e=d.split("|"),f=e.length,g=new RegExp("(^|\\s)("+d+")","gi"),h=new RegExp("<(/*)("+d+")","gi"),i=/^\s*[\{\}]\s*$/,j=new RegExp("(^|[^\\n]*?\\s)("+d+")([^\\n]*)({[\\n\\w\\W]*?})","gi"),k=b.createDocumentFragment(),l=b.documentElement,m=b.getElementsByTagName("script")[0].parentNode,n=b.createElement("body"),o=b.createElement("style"),p=/print|all/,q;c.getCSS=function(a,b){try{if(a+""===undefined)return""}catch(d){return""}var e=-1,f=a.length,g,h=[];while(++e<f){g=a[e];if(g.disabled)continue;b=g.media||b,p.test(b)&&h.push(c.getCSS(g.imports,b),g.cssText),b="all"}return h.join("")},c.parseCSS=function(a){var b=[],c;while((c=j.exec(a))!=null)b.push(((i.exec(c[1])?"\n":c[1])+c[2]+c[3]).replace(g,"$1.iepp-$2")+c[4]);return b.join("\n")},c.writeHTML=function(){var a=-1;q=q||b.body;while(++a<f){var c=b.getElementsByTagName(e[a]),d=c.length,g=-1;while(++g<d)c[g].className.indexOf("iepp-")<0&&(c[g].className+=" iepp-"+e[a])}k.appendChild(q),l.appendChild(n),n.className=q.className,n.id=q.id,n.innerHTML=q.innerHTML.replace(h,"<$1font")},c._beforePrint=function(){if(c.disablePP)return;o.styleSheet.cssText=c.parseCSS(c.getCSS(b.styleSheets,"all")),c.writeHTML()},c.restoreHTML=function(){if(c.disablePP)return;n.swapNode(q)},c._afterPrint=function(){c.restoreHTML(),o.styleSheet.cssText=""},r(b),r(k);if(c.disablePP)return;m.insertBefore(o,m.firstChild),o.media="print",o.className="iepp-printshim",a.attachEvent("onbeforeprint",c._beforePrint),a.attachEvent("onafterprint",c._afterPrint)})(this,document)@*/
