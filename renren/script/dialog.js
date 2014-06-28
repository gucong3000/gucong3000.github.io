function msgbox(msg, fun, text){
	var dialogbg = document.querySelector("#dialogbg");
	if(!dialogbg){
		dialogbg = document.createElement("div");
		dialogbg.id = "dialogbg";
		document.body.appendChild(dialogbg);
	}
	dialogbg.innerHTML = '<div class="bgcolor"></div><div class="dialog"><div class="title" unselectable="on"><div>消息</div></div><div class="content"></div><div class="text"><input type="text"></div><div class="btns"><button class="ok">确定</button><button class="cancel">取消</button></div></div>';
	
	dialogbg.querySelector(".content").innerHTML = msg || "&nbsp;";
	function hide( sel ){
		dialogbg.querySelector(sel).style.display = "none";
	}
	var btnOk = dialogbg.querySelector(".ok"),
		btnCancel = dialogbg.querySelector(".cancel");
	if(fun){
		if(text == undefined){
			hide(".text");
			btnOk.onclick = function(){
				fun(true);
			}
			btnCancel.onclick = function(){
				fun(false);
			}
		}else{
			var textbox = dialogbg.querySelector("input");
			textbox.value = text;
			btnOk.onclick = function(){
				fun.call(textbox, textbox.value);
			}
		}
	}else{
		hide(".cancel");
		hide(".text");
	}

	function btnClose(){
		dialogbg.style.display = "none";
	}

	btnOk.addEventListener("click", btnClose, true);
	btnCancel.addEventListener("click", btnClose, true);

	dialogbg.style.display = "block";

	var dialog = dialogbg.querySelector(".dialog");
	dialog.style.left = (dialogbg.offsetWidth - dialog.offsetWidth) / 2 + "px";
	dialog.style.top = (dialogbg.offsetHeight - dialog.offsetHeight) / 2 + "px";
	drag(dialog, dialog.querySelector(".title"));
}
function drag(dialog, titleBar){
	var onDrag,
		pos = {},
		dialogbg = document.querySelector("html");

	titleBar.addEventListener("mousedown", function(e){
		pos.left = dialog.offsetLeft;
		pos.top = dialog.offsetTop;
		pos.x = e.pageX;
		pos.y = e.pageY;
		onDrag = true;
	}, false);

	dialogbg.addEventListener("mousemove", function(e){
		if(onDrag){
			dialog.style.left = (pos.left + e.pageX - pos.x) + "px";
			dialog.style.top = (pos.top + e.pageY - pos.y) + "px";
		}
	}, false);

	titleBar.onselectstart = function(){
		return false;
	}

	dialogbg.onmouseup = function(){
		onDrag = false;
	}
}