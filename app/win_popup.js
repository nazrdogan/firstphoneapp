function win_login()
{
	_win_l = this;
	this._create_login_container = win_login._create_login_container;
	this._create_loggedin_container = win_login._create_loggedin_container;
	this._create_service_icon_area = win_login._create_service_icon_area;
	this._create_logout = win_login._create_logout;
	this._start_loader =  win_login._start_loader;
	this._user_logins = win_login._user_logins;
	this._user_loggedin = win_login._user_loggedin;
	this._service_user_index = win_login._service_user_index;
	this._add_win = win_login._add_win;
	this._on_approve_request = win_login._on_approve_request;
	this.logout = win_login.logout;
	this._change_service_color = win_login._change_service_color;
};
win_login._service_user_index = function(service, username, state)
{
	if(!service || !username || !state) return -1;
	for(var i=0;i<_m_client._login_box.user_login_screens.childNodes.length;i++)
	{
		if(_m_client._login_box.user_login_screens.childNodes[i].service ==service && _m_client._login_box.user_login_screens.childNodes[i].username==username && _m_client._login_box.user_login_screens.childNodes[i].state == state) return i;
	}
	return -1;

};
win_login._user_loggedin = function(service,username)
{
};

win_login._user_logins = function()
{

};

win_login._start_loader = function(service,text)
{
};

win_login.logout = function(service, username, flag, write_to_poll, timeout)
{
	delete _m_client.login_list[service][username];
	// close all chat windows
	if (_m_client._m_buddy_list.buddy_window[service])
	{
		for(var i in _m_client._m_buddy_list.buddy_window[service][username])
		{
			if (timeout)
				_m_client._m_buddy_list.buddy_window[service][username][i].disable_chat();
			else {
				if(!_m_client._m_buddy_list.buddy_window[service][username][i].is_closed)
					_m_client._m_buddy_list.buddy_window[service][username][i].close(true);
				delete _m_client._m_buddy_list.buddy_window[service][username][i];
			}
		}
	}
	//close all chat windows end	 
	//delete all the buddies from the buddy list

	if (_m_client._m_buddy_list._buddies[service])
	{
		for(var buddy in _m_client._m_buddy_list._buddies[service][username])
		{
			var buddyobj = _m_client._m_buddy_list._buddies[service][username][buddy];
			delete _m_client._m_buddy_list._buddy_list[service][username][buddy];
		}
	}
	delete _m_client._m_buddy_list._buddies[service][username];
	delete _m_client._m_buddy_list._buddy_list[service][username];
	//delete all the buddies from the buddy list end
    

	//_m_client._con.logout(service, username);
	_m_client._m_buddy_list.search = true;
	_m_client._m_buddy_list.clear_search();

};

win_login._create_logout = function(service,username,flag){
};

win_login._create_loggedin_container = function(service , username){
};

win_login._add_win = function(service)
{
};

win_login._on_approve_request = function(service, username, buddyname, group)
{

};

win_login._change_service_color = function(){
};
win_login._create_service_icon_area = function(){
};

win_login._create_login_container = function(service){
};

function win_buddies()
{
	_win_b = this;
	this._create_status = win_buddies._create_status;
	this._create_search_buddy = win_buddies._create_search_buddy;
	this._create_show_all = win_buddies._create_show_all;
	this.resize_buddy_container = win_buddies.resize_buddy_container;
};

win_buddies.resize_buddy_container = function()
{
};

win_buddies._create_search_buddy = function()
{
};

win_buddies._create_show_all = function()
{
};

win_buddies._create_status = function(service,username)
{
};
function win_popup(service,username,buddyname,write_history)
{
	_win = this;
	this.is_minimized = false;
	this.is_closed = false;
	this.is_hidden = false;
	this.win_buddyname = buddyname;
	this.win_service = service;
	this.win_username = username;
	this.is_conf = false;
	this.is_typing = false;
	this.alias = buddyname;
	this.unread_message = 0;
	if (_m_client._m_buddy_list._buddies[service] && _m_client._m_buddy_list._buddies[service][username] && _m_client._m_buddy_list._buddies[service][username][buddyname] && 
			_m_client._m_buddy_list._buddies[service][username][buddyname].alias && _m_client._m_buddy_list._buddies[service][username][buddyname].alias!="" && _m_client._m_buddy_list._buddies[service][username][buddyname].alias!="null")
		this.alias =  _m_client._m_buddy_list._buddies[service][username][buddyname].alias;

	this.set_chat_history = win_popup.set_chat_history;
	this.close = win_popup.close;
	this.toggle = win_popup.toggle;
	this.open = win_popup.open;
	this.toggle_other_windows = win_popup.toggle_other_windows;
	this.show = win_popup.show;
	this.hide = win_popup.hide;
	this.send_typing = win_popup.send_typing;
	this.send_stop_typing = win_popup.send_stop_typing;
	this.set_typing = win_popup.set_typing;
	this.set_status_img = win_popup.set_status_img;
	//this._tool_box_object = new message_tool_box();
	this.disable_chat = function() {
		this.chat_input.setAttribute("disabled", "disabled");
	};
	this.enable_chat = function() {
		this.chat_input.removeAttribute("disabled");
	};
	this.container = __createElement("DIV","win_chat",buddyname);

	var _container_header =  __createElement("DIV","win_header","");
	var _container_winname =  __createElement("DIV","win_header_chatR","");
	var _container_closeoptionsclose =  __createElement("DIV","win_header_close win-close-icon","");
	_container_closeoptionsclose.onclick = function(){
		_m_client._m_buddy_list.buddy_window[service][username][buddyname].close(true);
	};

	var _clearfloat = __createElement("DIV","clear","");
	_container_header.appendChild(_container_closeoptionsclose);
	_container_winname.appendChild(document.createTextNode(" "+this.alias));
	_container_header.appendChild(_container_winname);
	_container_header.appendChild(_clearfloat);

	var chat_area = __createElement("DIV","chat_area","");
	var chat_history = __createElement("DIV","chat_history","");
	var chat_input = __createElement("TEXTAREA","chat_input","");

	chat_area.appendChild(chat_history);
	chat_area.appendChild(chat_input);
	this.chat_history = chat_history;
	this.chat_input = chat_input;
};



/*function win_popup(service,username,buddyname,write_history)
{
	_win = this;
	this.is_minimized = false;
	this.is_closed = false;
	this.is_hidden = false;
	this.win_buddyname = buddyname;
	this.win_service = service;
	this.win_username = username;
	this.is_conf = false;
	this.is_typing = false;
	this.alias = buddyname;
	this.unread_message = 0;
	if (_m_client._m_buddy_list._buddies[service] && _m_client._m_buddy_list._buddies[service][username] && _m_client._m_buddy_list._buddies[service][username][buddyname] && 
			_m_client._m_buddy_list._buddies[service][username][buddyname].alias && _m_client._m_buddy_list._buddies[service][username][buddyname].alias!="")
		this.alias =  _m_client._m_buddy_list._buddies[service][username][buddyname].alias;

	this.set_chat_history = win_popup.set_chat_history;
	this.close = win_popup.close;
	this.toggle = win_popup.toggle;
	this.open = win_popup.open;
	this.toggle_other_windows = win_popup.toggle_other_windows;
	this.show = win_popup.show;
	this.hide = win_popup.hide;
	this.send_typing = win_popup.send_typing;
	this.send_stop_typing = win_popup.send_stop_typing;
	this.set_typing = win_popup.set_typing;
	this.set_status_img = win_popup.set_status_img;
	this.disable_chat = function() {
	};
	this.enable_chat = function() {
	};
	var chat_area = __createElement("DIV","chat_area","");
	var chat_history = __createElement("DIV","chat_history","");
	var chat_input = __createElement("TEXTAREA","chat_input","");
	chat_area.appendChild(chat_history);

};*/

win_popup.set_chat_history = function(service,username,buddyname,message,timestamp,write_history,sender)
{
	try{
    for(i = 0; i < smileys.length; i++) {
		rexp = eval("/"+smileys[i][0].replace(/\)/gi, "\\)").replace(/\(/gi, "\\(")+"/gi;");
		message = message.replace(rexp, "<IMG class='smiley-icon-size "+smileys[i][3]+"' src='images/blank.gif'></IMG>");
	}
	var reg = /((((http|https|ftp|gopher|mailto)[\.:][/]+)|(www\.))[^<>"\t\n\s]+)/gi;
	var m = reg.exec(message);
	var match;
	var str_http = "http://";
	message = message.replace(reg, "<a target='_blank' href='"+str_http+"$1'>$1</a>");
	reg = /(http:\/\/)(http|https|ftp|gopher|mailto)/gi;
	message = message.replace(reg, '$2');
try{
	var alias = sender;
	if (_m_client._m_buddy_list._buddies[service] && _m_client._m_buddy_list._buddies[service][username][sender] 
			&& _m_client._m_buddy_list._buddies[service][username][sender].alias && _m_client._m_buddy_list._buddies[service][username][sender].alias!="" && _m_client._m_buddy_list._buddies[service][username][sender].alias!="null")
		alias = _m_client._m_buddy_list._buddies[service][username][sender].alias;

	//if (l==1 || _m_client._m_buddy_list._chat_log[service][username][buddyname][l-2][0]!=sender)
    
    if(_m_client._m_buddy_list._buddies[service][username][buddyname] && _m_client._m_buddy_list._buddies[service][username][buddyname].last_person_to_converse != sender)
	{
        _m_client._m_buddy_list._buddies[service][username][buddyname].last_person_to_converse = sender;
        var conv = __createElement("DIV","oth");
		var ts_span = __createElement("SPAN","ts");
		if (username==sender) conv.className = "self";
		var d = new Date();
		if (timestamp)
		{
			//fix for timestamp coming from server
			if (timestamp.length<13)
				timestamp =timestamp* 1000;
			d.setTime(timestamp);
		}
		var ap = " AM";
		hour = d.getHours();
		min = d.getMinutes();
		if (hour > 11) { ap = " PM";}
		if (hour > 12) { hour = hour - 12; }
		if (hour == 0) { hour = 12;}
		if (min < 10)  { min = "0"+min.toString();}

		ts_span.innerHTML = hour + ":"+min + ap;
		conv.appendChild(ts_span);
		alias = sender;
		if (_m_client._m_buddy_list._buddies[service] && _m_client._m_buddy_list._buddies[service][username][sender] 
				&& _m_client._m_buddy_list._buddies[service][username][sender].alias && _m_client._m_buddy_list._buddies[service][username][sender].alias!="" && _m_client._m_buddy_list._buddies[service][username][sender].alias!="null")
			alias = _m_client._m_buddy_list._buddies[service][username][sender].alias;
		conv.innerHTML += getUIString(alias,18);
		this.chat_history.appendChild(conv);
	}
	var msg = __createElement("DIV","msg");
    
    
    if (username != sender && (message.indexOf("<font") == -1 && message.indexOf("<FONT") == -1)) 
         message = "<font color='#fd9'>" + message + "</font>";
    else 
    {
    /*var xmlobject = (new DOMParser()).parseFromString(message, "text/xml");
     xmlobject.childNodes[0].setAttribute('color','#fd9');
     message = (new XMLSerializer()).serializeToString(xmlobject);*/
    }
    if(message == "<font color=#f00>BUZZ!!!</font>")
        if (login_this) 
            login_this.controller.stageController.getAppController().playSoundNotification("vibrate", "");
	msg.innerHTML = normalText(message);
	this.chat_history.appendChild(msg);
}
catch(er){showconsole("ERROR win_popup-set_chat_history (1) : "+er);}
}
catch(er){showconsole("ERROR win_popup-set_chat_history (2) : "+er);}

};

win_popup.send_typing = function()
{
	if (this.is_typing)
	{
		if (this.typingid)
		{
			clearTimeout(this.typingid);
		}
	}
	else 
	{
		_m_client._con.send_typing_indicator(this.win_service,this.win_username,this.win_buddyname,"start");
	}
	this.is_typing =true;
	this.typingid = setTimeout("_m_client._m_buddy_list.buddy_window['"+this.win_service+"']['"+this.win_username+"']['"+this.win_buddyname+"'].send_stop_typing()", 2000);
};

win_popup.send_stop_typing = function()
{
	_m_client._con.send_typing_indicator(this.win_service,this.win_username,this.win_buddyname,"stop");
	this.is_typing = false;
};

win_popup.set_typing = function(type)
{

};

win_popup.close = function(write_history)
{
	this.is_closed = true;
	this.unread_message = 0;
};

win_popup.open = function(write_history)
{
	this.is_closed = false;
	this.toggle_other_windows();
	_m_client._m_buddy_list._chat_window_status.push(new Array(this.win_service, this.win_username, this.win_buddyname));
	if (write_history)
		_m_client._m_buddy_list._open_chat_window = [this.win_service, this.win_username, this.win_buddyname];
	if (!this.is_hidden && !this.is_minimized)
		this.chat_input.focus();

};

win_popup.toggle_other_windows = function(write_history)
{
};

win_popup.toggle = function(write_history)
{
};

win_popup.show = function()
{
};

win_popup.hide = function()
{
};

win_popup.set_status_img = function(state)
{
};

