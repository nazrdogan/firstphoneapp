function login_list()
{
    _m_login_list = this;
    this._mode = null;
    this._forms = new Array();
    this._services = new Array();
    this._container = null;
    this._logout_container = null;
    this._signin_container = null;
    this._remember_me = null;
    this._invisible = null;
    this._is_signing = false;

    this.set_login_container = login_list.set_login_container;
    this.set_signin_container = login_list.set_signin_container;
    this.get_index = login_list.get_index;
    this.add_form = login_list.add_form;
    this.clear = login_list.clear;
    this.clear_form_elements = login_list.clear_form_elements;
    this.login = login_list.login;
	this.loginSSO = login_list.loginSSO;		//6thsept	
    this.show_logout_container = login_list.show_logout_container;
    this.create_logout_container = login_list.create_logout_container;
    this.logout = login_list.logout;
    this.set_mode = login_list.set_mode;
    this.show_service = login_list.show_service;
    this.change_view = login_list.change_view;
    this.set_service_in_use = login_list.set_service_in_use;
    this.login_completed = login_list.login_completed;
    this.is_account_in_use = login_list.is_account_in_use;
    this._add_to_services = login_list._add_to_services;
	this.is_sso_account_in_use = login_list.is_sso_account_in_use;
    this._remove_from_service = login_list._remove_from_service;
    this._get_service_index = login_list._get_service_index;

    this._checkbox = __createElement("INPUT");
    this._checkbox.state = true;
    this._checkbox.checked = true;
    this._checkbox.type = "checkbox";
    this._checkbox.onclick = function()
    {
        if( this.checked )
            this.state = this.checked; 
        else
            this.state = false;
    };

    this._inv_checkbox = __createElement("INPUT");
    this._inv_checkbox.type = "checkbox";
    this._inv_checkbox.state = false;
    this._inv_checkbox.onclick = function()
    {
        if( this.checked )
            this.state = this.checked; 
        else
            this.state = false;
    };

    this._signin = __createElement("A", "signin");
    this._signin.href = "javascript:void(0)";
    this._signin.parent_object = this;
    this._signin.onclick = function() 
    {
        if(_m_login_list._is_signing)
            return;
        _m_login_list._is_signing = true;
        _m_login_list._container.onkeypress = function(){return false;};
        if(!_m_login_list.login()){
            _m_login_list._container.onkeypress = _m_login_list._keypress;
            _m_login_list._is_signing = false;
        }
    };
    this._signin.innerHTML = _client_labels[_current_language][32];

    this._signout = __createElement("B", "signin");
    this._signout.parent_object = this;
    this._signout.onclick = this.show_logout_container;
    
    this._signout.appendChild(document.createTextNode(_client_labels[_current_language][33]));
    
    this._signout.style.display = "none";

    this._createLoginForm = login_list._createLoginForm;
    this._keypress = login_list._keypress;

    this.set_callback = login_list.set_callback;
};

login_list.set_login_container = function(container)
{
    this._container = container;
    this._container.parent_object = this;
    this._container.onkeypress = this._keypress;
};

login_list._keypress = function(e)
{
    var keyChar = window.event ? event.keyCode : e.keyCode;

    if (keyChar == 13 || keyChar == 10) {
        _m_login_list._container.onkeypress = function() {return false;};
        if(!_m_login_list.login()) {
            _m_login_list._container.onkeypress = _m_login_list._keypress;
        }
        return false;
    }
    return true;
};

login_list.login_completed = function ()
{
    this._container.onkeypress = this._keypress;
    _m_login_list._is_signing = false;
};

login_list.set_mode = function (mode)
{
    if(this._mode == mode)
        return;
    this._mode = mode;
    this.change_view();
};

login_list.change_view = function()
{
    if(this._mode == "big") {
        this._signout.style.display = "none";
        this._signin.style.display = "";
        this._remember_me.style.display = "";
        _m_login_list._checkbox.checked = _m_login_list._checkbox.state;
        this._invisible.style.display = "none";
        var i;
        for(i = 0; i < this._forms.length; i++) {
            this._forms[i][5].retract(true);
            this._forms[i][5].header.onclick = function() {this.container.retract();};
        }
    } else {
        this._signin.style.display = "none";
        this._signout.style.display = "";
        this._remember_me.style.display = "none";
        this._invisible.style.display = "none";
        var i;
        for(i = 0; i < this._forms.length; i++) {
            this._forms[i][5].retract(true);
            this._forms[i][5].header.onclick = this.show_service;
        }
    }
};

login_list.set_service_in_use = function (service, username, state)
{
    if(state)
        this._add_to_services(service, username);
    else
        this._remove_from_service(service, username);

    var i = this.get_index(service);
    if(i >= 0) {
        this._forms[i][5].disable(state);
        this._forms[i][5].clear_elements();
        this.change_view();
    }
};

login_list._add_to_services = function (service, username) {
    var i;
    for(i = 0; i < this._services.length; i++) {
        if(this._services[i][0] == service && this._services[i][1] == username)
            return;
    }
    this._services.push(new Array(service, username));
};

login_list._remove_from_service = function (service, username)
{
    var i;
    for(i = 0; i < this._services.length; i++) {
        if(this._services[i][0] == service && this._services[i][1] == username) {
            this._services.splice(i, 1);
            return;
        }
    }
};

login_list.is_account_in_use = function(service, username)
{
    var i;
    for(i = 0; i < this._services.length; i++) {
        if(this._services[i][0] == service && this._services[i][1] == username)
            return true;
    }
    return false;
};
login_list.is_sso_account_in_use = function(service, username)
{
	//alert(service + username);
    var i;
    for(i = 0; i < this._services.length; i++) 
	{
		//if((this._services[i][0] == service) && (this._services[i][1] != username)&&(this._services[i][1].length >0 && username.length>0) )
		//{ ===changed on 28thfeb cause the relogin was happening on sso configure option submit click

   		if(this._services[i][0] == service)
		{
			if(this._services[i][1] != username)
			{
				if(service == "yah")
					 servicename = "Yahoo";
				else if(service == "msn")
					servicename = "Msn";
				else if(service == "aim")
					servicename = "Aim";
				else if(service == "jab")
					servicename = "Gtalk";
				var tmp = _alert_message_list[_current_language][68][2].replace("%%%", servicename);
				_m_client._create_alert_window(_alert_message_list[_current_language][68][0]+service, _alert_message_list[_current_language][68][1], tmp);
			}
			return true;
		}
	}
    return false;
};
login_list._get_service_index = function(service)
{
    var i;
    for(i = 0; i < this._services.length; i++) {
        if(this._services[i][0] == service)
            return i;
    }
    return -1;
};

login_list.show_service = function()
{
    if(this.container.is_disabled) {
		if(this.container.service == "sso")
		{
			_m_client._show_other_option_on_logon(this);
		}
		else
		{
			_m_client._create_alert_window(_alert_message_list[_current_language][24][0], _alert_message_list[_current_language][24][1], _alert_message_list[_current_language][24][2]);
		}
        return;
    }
    var index = _m_login_list.get_index(this.container.service);
    var mode = _m_login_list._forms[index][5]._mode;
    _m_login_list._forms[index][5].hide();
    var j;
    for(j = 0; j < _m_login_list._forms.length; j++) {
        if(mode) {
            _m_login_list._signin.style.display = "none";
            _m_login_list._signout.style.display = "";
            _m_login_list._forms[j][5].retract(true);
            _m_login_list._remember_me.style.display = "none";
            _m_login_list._invisible.style.display = "none";
        } else {
            if(_m_login_list._forms[j][0] == this.container.service) {
                _m_login_list._signout.style.display = "none";
                _m_login_list._signin.style.display = "";
                _m_login_list._remember_me.style.display = "";
                _m_login_list._checkbox.checked = _m_login_list._checkbox.state;
                _m_login_list._invisible.style.display = "none";
                _m_login_list._forms[j][5].show();
                continue;
            }
            _m_login_list._forms[j][5].hide();
        }
    }
};
login_list.loginSSO = function()
{
	var i;
	var username = _m_login_list._forms[0][5].get_username();
	username = (username != _m_login_list._forms[0][3]) ? username : "";
	var password = _m_login_list._forms[0][5].get_password();
	password = (password != _m_login_list._forms[0][4]) ? password : "";

	if(username == "" || password == "")
	{
		_m_login_list._forms[0][5].clear_elements();
        _m_client._create_alert_window(_alert_message_list[_current_language][33][0], _alert_message_list[_current_language][33][1], _alert_message_list[_current_language][33][2]);
		return false;
	}
	if(username.length > 20 || password.length > 20) 
	{
		_m_login_list._forms[0][5].clear_elements();
		_m_client._create_alert_window(_alert_message_list[_current_language][25][0], _alert_message_list[_current_language][25][1], _alert_message_list[_current_language][25][2]);
		return false;
    }
	/*if(username.search(/[ \)\(/\?\|#!\$%\^\&\*~`_"'/\\><,;:\]\[\{\}]/g) >= 0 ) {
		_m_login_list._forms[0][5].clear_elements();
		_m_client._create_alert_window(_alert_message_list[_current_language][26][0], _alert_message_list[_current_language][26][1], _alert_message_list[_current_language][26][2]);
		return false;
	}*/
	if(username.search("[^A-Za-z0-9_.]") >=0) 
		{
		_m_login_list._forms[0][5].clear_elements();
		_m_client._create_alert_window(_alert_message_list[_current_language][26][0], _alert_message_list[_current_language][26][1], _alert_message_list[_current_language][26][2]);
		return false;
	        }

/*	if(password.search(/"/g) >= 0 ) {
		_m_login_list._forms[0][5].clear_elements();
		_m_client._create_alert_window(_alert_message_list[_current_language][27][0], _alert_message_list[_current_language][27][1], _alert_message_list[_current_language][27][2]);
		return false;
	}*/
	if(_m_login_list._checkbox.checked)
		SetCookie('sso', username);
	else
		SetCookie('sso', username, -1);

	 _m_client._root_window.set_processbar_text(_client_labels[_current_language][72], _client_labels[_current_language][72]);
    _m_client._root_window.show_processbar(true);
	
	_m_client._num_logins = 1;

	var inv_flag = false; //_m_login_list._inv_checkbox.checked;

	var rsa = new RSAKey();
	rsa.setPublic(rsa_key.n, rsa_key.e);
	var encrypt_pass = rsa.encrypt(password);

	
	SetCookie('sso_pass',encrypt_pass,1);	
	SetCookie('sso_login',username);	
	_m_client._on_sso_signon (username,encrypt_pass);
};

login_list.login = function()
{	
    var i, login = false;
    var login_arr = new Array();
	//======remove to deactive the SSO ====start 
	if(_m_login_list._forms[0][5].get_username()!="" && _m_login_list._forms[0][5].get_password()!="")
	{
		_m_login_list.loginSSO();
		return;
	}
	//======remove to deactive the SSO ====End

   for(i = 0; i < _m_login_list._forms.length; i++) {  //6thsept

        var service = _m_login_list._forms[i][0];
		var username = _m_login_list._forms[i][5].get_username() ;
        username = (username != _m_login_list._forms[i][3]) ? username : "";
        var password = _m_login_list._forms[i][5].get_password();
        password = (password != _m_login_list._forms[i][4]) ? password : "";

        if(username == "" || password == "")
            continue;

        if(username.length > 100 || password.length > 100) {
            _m_login_list._forms[i][5].clear_elements();
            //alert("Lengthy username/password.");
            _m_client._create_alert_window(_alert_message_list[_current_language][25][0], _alert_message_list[_current_language][25][1], _alert_message_list[_current_language][25][2]);
            return false;
        }

        if(service == "jab" || service == "oth") {
            if(username.search(/[ \)\(/\?\|#!\$%\^\&\*~`_"'/\\><,;:\]\[\{\}]/g) >= 0 ) {
                _m_login_list._forms[i][5].clear_elements();
                //alert("Invalid username. (Jabber)");
                _m_client._create_alert_window(_alert_message_list[_current_language][26][0], _alert_message_list[_current_language][26][1], _alert_message_list[_current_language][26][2]);
                return false;
            }
            if(password.search(/"/g) >= 0 ) {
                _m_login_list._forms[i][5].clear_elements();
                //alert("Invalid password. (Jabber)");
                _m_client._create_alert_window(_alert_message_list[_current_language][27][0], _alert_message_list[_current_language][27][1], _alert_message_list[_current_language][27][2]);
                return false;
            }
        }

        if(service == "msn") {
            if(username.search(/[ \)\(/\?\|#!\$%\^\&\*~`"'/\\><,;:\]\[\{\}]/g) >= 0 ) {
                _m_login_list._forms[i][5].clear_elements();
                //alert("Invalid username. (MSN)");
                _m_client._create_alert_window(_alert_message_list[_current_language][28][0], _alert_message_list[_current_language][28][1], _alert_message_list[_current_language][28][2]);
                return false;
            }
        }

        if(service == "aim") {
           // if(username.search(/[ \)\(/\?\|#!\$%\^\&\*\-~`_\."'/\\><,;:\]\[\{\}]/g) >= 0 || username.search(/[a-z]+/ig) < 0) {
		   if(username.search(/[\)\(/\?\|#!\$%\^\&\*\-~`_\."'/\\><,;:\]\[\{\}]/g) >= 0 || username.search(/[a-z]+/ig) < 0) {
                _m_login_list._forms[i][5].clear_elements();
                //alert("Invalid username. (AIM)");
                _m_client._create_alert_window(_alert_message_list[_current_language][29][0], _alert_message_list[_current_language][29][1], _alert_message_list[_current_language][29][2]);
                return false;
            }
			username = username.replace(/[ ]/gi, "");
            if(password.search(/"_\-\+\=",\./g) >= 0 ) {
                _m_login_list._forms[i][5].clear_elements();
                //alert("Invalid password. (AIM)");
                _m_client._create_alert_window(_alert_message_list[_current_language][30][0], _alert_message_list[_current_language][30][1], _alert_message_list[_current_language][30][2]);
                return false;
            }
        }

        if(service == "yah") {
            if(username.search(/[ \)\(/\?\|#!\$%\^\&\*\-~`"'/\\><,;:\]\[\{\}]/g) >= 0 ) {
                _m_login_list._forms[i][5].clear_elements();
                //alert("Invalid username. (Yahoo)");
                _m_client._create_alert_window(_alert_message_list[_current_language][31][0], _alert_message_list[_current_language][31][1], _alert_message_list[_current_language][31][2]);
                return false;
            }
        }

        if((service == "jab" || service == "msn" || service == "oth") && username.search(/@.*\.com$/) < 1){
            //alert("Please provide name@server");
			
				_m_client._create_alert_window(_alert_message_list[_current_language][32][0], _alert_message_list[_current_language][32][1], _alert_message_list[_current_language][32][2]);
				_m_login_list._forms[i][5].set_focus();
            return false;
        }
        /*
        if(service == "aim" && username.search(/[a-z]+/ig) < 0) {
            //alert("Invalid AIM Id.");
            _m_client._create_alert_window(_alert_message_list[_current_language][29][0], _alert_message_list[_current_language][29][1], _alert_message_list[_current_language][29][2]);
            return false;
        }
        */
		username=username.toLowerCase();
        login_arr.push(new Array(_m_login_list._forms[i][0], username, password, _m_login_list._forms[i][5].login_invisible()));
        if(_m_login_list._checkbox.checked)
            SetCookie(service, username);
        else
            SetCookie(service, username, -1);
        login = true;
    }
    if(login) {

        var inv_flag = false; //_m_login_list._inv_checkbox.checked;
        _m_login_list.on_login(login_arr, inv_flag);
        //_m_login_list._inv_checkbox.checked = false;
		_m_client._root_window.show_processbar(true);
        return true;
    } else {

        //alert("Please provide correct username and password.");
		if(sso_call != "ssologin")
		{	
			_m_client._create_alert_window(_alert_message_list[_current_language][33][0], _alert_message_list[_current_language][33][1], _alert_message_list[_current_language][33][2]);
		}
        return false;
    }
};


login_list.show_logout_container = function()
{

    if(_m_login_list._logout_container && _m_login_list._logout_container.style.display == "")
        return;
    _m_login_list.create_logout_container();
    var pos = getAbsoluteOffsetRight(this);
    _m_login_list._logout_container.style.visibility = "hidden";
    _m_login_list._logout_container.style.display = "";
    if(browser.isSafari)
        _m_login_list._logout_container.style.top = pos.top + 15 + "px";
    if(browser.isNS)
        _m_login_list._logout_container.style.top = pos.top + 20 + "px";
    if(browser.isIE)
        _m_login_list._logout_container.style.top = pos.top + 18 + "px";
    var div_width = _m_login_list._logout_container.offsetWidth;
    _m_login_list._logout_container.style.left = pos.left - div_width + 2 + "px";
    _m_login_list._logout_container.display_time = new Date();
    _m_login_list._logout_container.style.visibility = "visible";
};

login_list.create_logout_container = function()
{
    if(!_m_login_list._logout_container) {
        _m_login_list._logout_container = __createElement("DIV", "networkSelector");
        _m_login_list._logout_container.style.display = "none";
        var objElm = document.getElementsByTagName("BODY");
        objElm[0].appendChild(_m_login_list._logout_container);
    } else {
        var len = _m_login_list._logout_container.childNodes.length;
        for(var i = 0; i < len; i++)
            _m_login_list._logout_container.removeChild(_m_login_list._logout_container.childNodes[0]);
    }

    var services = _m_login_list._services;

	//alert(_m_login_list._forms);
    for(var i=0; i<services.length; i++) {

        var form_indx = _m_login_list.get_index(services[i][0]); 
        var form_obj = _m_login_list._forms[form_indx];


        var objP = __createElement("SPAN");
        objP.username = services[i][1];
        objP.service = services[i][0];
        objP.appendChild(__createElement("IMG"));
        objP.childNodes[0].src = imgPath + form_obj[2];
        objP.appendChild(document.createTextNode(services[i][1]));
        objP.onmouseover = function() { this.style.background = "#DCDCDC"; };
        objP.onmouseout = function() { this.style.background = "white"; };
		if(services[i][0] == "sso")
		{
			objP.onclick = function() 
			{
				if(_window_control.is_referring)
				{
					var buts = _m_client._create_alert_window(_alert_message_list[_current_language][6][0], _alert_message_list[_current_language][6][1], _alert_message_list[_current_language][6][2]);
					if(buts) 
					{
						buts[0].onclick = function(){this.parentWindow.destroy();};
						return ;
					}	
					return ;
				}
			     sso_call="";
				_m_login_list.logout("sso",ReadCookie('sso_login'));
				this.style.background = "white";
				_m_login_list._logout_container.style.display = "none";			
			};
		}
		else
		{
			objP.onclick = function() 
			{
				if(_window_control.is_referring)
				{
					var buts = _m_client._create_alert_window(_alert_message_list[_current_language][6][0], _alert_message_list[_current_language][6][1], _alert_message_list[_current_language][6][2]);
					if(buts) 
					{
						buts[0].onclick = function(){this.parentWindow.destroy();};
						return ;
					}		
					return ;
				}
				_m_login_list.logout(this.service, this.username);
				this.style.background = "white";
				_m_login_list._logout_container.style.display = "none";
			};
		}
        _m_login_list._logout_container.appendChild(objP);
    }

    var objP = __createElement("SPAN");
    objP.appendChild(__createElement("IMG"));
    objP.childNodes[0].src = imgPath + "blank.gif";
    objP.appendChild(document.createTextNode(_client_labels[_current_language][34])); 
    objP.style.borderTop = "1px solid black";
    objP.onmouseover = function() { this.style.background = "#DCDCDC"; };
    objP.onmouseout = function() { this.style.background = "white"; };
    objP.onclick = function() 
    {   
	   //  _m_login_list.logout();
		if(_window_control.is_referring)
		{
			var buts = _m_client._create_alert_window(_alert_message_list[_current_language][6][0], _alert_message_list[_current_language][6][1], _alert_message_list[_current_language][6][2]);
			if(buts) 
			{
				buts[0].onclick = function(){this.parentWindow.destroy();};
				return ;
			}
			return ;
		}
		sso_call="";
		SetCookie("imUserStatus","",-1); 
		SetCookie('sso_pass',"",1);
		SetCookie('sso_login',"",1);
		SetCookie('SESSMUNDU',"0",1);
		delete global_sso_service_arr;
        global_sso_service_arr = new Array();
        this.style.background = "white";
		 _m_login_list.logout();
        _m_login_list._logout_container.style.display = "none";
    };
    _m_login_list._logout_container.appendChild(objP);
};

login_list.logout = function (service, username)
{
	if(service == "sso")
	{
		_m_client.check_sso_user_cookie();
		sso_call="sso_logout";
		_m_client._con._on_sso_get_accounts(ReadCookie('sso_login'),ReadCookie('sso_pass'));
		return;
	}
	sso_call="";
    if(!service)
        _m_login_list.on_logout();
    else
        _m_login_list.on_logout(service, username);
};

login_list.set_signin_container = function (container)
{
    this._signin_container = container;
    this._remember_me = __createElement("SPAN");
    this._invisible = __createElement("SPAN");
    this._invisible.style.display = "none";
    with(container) {
        appendChild(this._remember_me);
        childNodes[0].appendChild(this._checkbox);
        childNodes[0].appendChild(document.createTextNode(_client_labels[_current_language][35]));
        appendChild(this._invisible);
        childNodes[1].appendChild(this._inv_checkbox);
        childNodes[1].appendChild(document.createTextNode(_client_labels[_current_language][36]));
    }
    container.appendChild(this._signin);
    container.appendChild(this._signout);
};

login_list.get_index = function (service)
{
    var i;
    for(i = 0; i < this._forms.length; i++)
        if(this._forms[i][0] == service)
            return i;
    return -1;
};

login_list.add_form = function (service, title, image, userText, passText, regiter_new, forgot_password)
{
    if(this.get_index(service) >= 0) return;
    var form = this._createLoginForm(service, title, image, userText, passText, regiter_new, forgot_password);
    form.retract(true);
    var i = this._get_service_index(service);
    if(i >= 0)
        form.disable(true);
    this._forms.push(new Array(service, title, image, userText, passText, form));
    this._container.appendChild(form);
    this.change_view();
};

login_list.clear = function()
{
    delete this._services;
    this._services = new Array();
    this.clear_form_elements();
};

login_list.set_callback = function(type, fun)
{
    if(type == "on_login") {
        this.on_login = fun;
    } else if (type == "on_logout") {
        this.on_logout = fun;
    }
};

login_list.clear_form_elements = function ()
{
    var i;
    for(i = 0; i < this._forms.length; i++) {
        this._forms[i][5].clear_elements();
        if(this._services.length == 0) {
            this._forms[i][5].disable(false);
        }
    }
};

login_list._createLoginForm = function(service, title, image, userText, passText, regiter_new, forgot_password)
{ 
    var header, form, new_user, container;
    var retract_image;
    container = __createElement("DIV", "container");

	if(service == "sso")
	{
		container.style.background =  sso_service_color;
	}
	else
	{
		if(_m_client._buddy_list._buddies.length >0)
		{
	
		}
		else
		{
			SetCookie('sso_pass',"",1);
			SetCookie('sso_login',"",1);
		}
	}
    container.service = service;
    container._mode = false;
    container.is_disabled = false;

    header = __createElement("B");
    header.appendChild(__createElement("DIV"));

    retract_image = __createElement("IMG","retract","img_"+service);
    header.childNodes[0].appendChild(retract_image);
    retract_image.src = imgPath + "down.png";

    header.childNodes[0].appendChild(__createElement("IMG"));
    header.childNodes[0].childNodes[1].src = imgPath + image;
    header.childNodes[0].appendChild(__createElement("B"));
    header.childNodes[0].childNodes[2].innerHTML = title;
    if(browser.isIE)
    {
        header.childNodes[0].onmouseover = function()
        {
			if(service == "sso")
			{
				this.style.background = sso_service_hover_color;
			}
			else
			{
				this.style.background = service_hover_color;
			}
        };

        header.childNodes[0].onmouseout = function()
        {
            this.style.background = "transparent";
        };
    }
	else
	{
		header.childNodes[0].onmouseover = function()
		{
			if(service == "sso")
			{
				this.style.background = sso_service_hover_color;
			}
			else
			{
				this.style.background = service_hover_color;
			}
		};
		header.childNodes[0].onmouseout = function()
		{
			this.style.background = "transparent";
		};
	}

    header.container = container;
    header.onclick = function() 
    {
        if(this.container.is_disabled) {
            //alert("You have logged into this service.");
            _m_client._create_alert_window(_alert_message_list[_current_language][34][0], _alert_message_list[_current_language][34][1], _alert_message_list[_current_language][34][2]);
            return;
        }
        this.container.retract();
    };

    form = __createElement("DIV", "loginlist", service);

    var username_text = __createElement("SPAN");
    username_text.appendChild(document.createTextNode(userText));
    form.appendChild(username_text);

    var username_element = __createElement("INPUT", "use", service+"_us");
    if(ReadCookie(service)) {
        username_element.style.color = "black";
        username_element.value = ReadCookie(service);
    } else {
        username_element.style.color = "gray";
        username_element.value = username_text.firstChild.data;
    }
    username_element.container = container;
    username_element.onfocus = function ()
    {
        var str = this.container.username_text.firstChild.data;
        if(this.value == str) {
            this.style.color = "black";
            this.value = "";
        }
    };

    username_element.onblur = function ()
    {
        if(this.value == "") {
            var username = ReadCookie(this.container.service);
            if(username) {
                this.style.color = "black";
                this.value = username;
            } else {
                this.style.color = "gray";
                this.value = this.container.username_text.firstChild.data;
            }
        }
    };
    form.appendChild(username_element);
    
    var password_text = __createElement("SPAN");
    password_text.appendChild(document.createTextNode(" "+passText+ " "));
    form.appendChild(password_text);

    var password_element = __createElement("INPUT", "pse", service+"_pa");
    password_element.type = "password";
    password_element.style.display = "none";
    password_element.container = container;
    password_element.onblur = function ()
    {
        if(this.value == "") {
            this.style.display = "none";
            this.container.text_element.style.display = "";
        }
    };
    form.appendChild(password_element);

    var text_element = __createElement("INPUT", "pse");
    text_element.style.color = "gray";
    text_element.value = passText + " ";
    text_element.container = container;
    text_element.onfocus = function ()
    {
        this.style.display = "none";
        this.container.password_element.style.display = "";
        this.container.password_element.focus();
    };
    
    form.appendChild(text_element);


	if(service != "sso")
	{
		new_user = __createElement("DIV", "newUserContainer");
		new_user.appendChild(__createElement("I"));
		new_user.appendChild(__createElement("A"));
		new_user.appendChild(__createElement("A"));
		var checkbox = null;
		if(service == "yah" || service == "aim") {
			checkbox = __createElement("input");
			checkbox.type = "checkbox";
			new_user.childNodes[0].appendChild(checkbox);
			new_user.childNodes[0].appendChild(document.createTextNode(" "+_client_labels[_current_language][36]));
			container.invisible_checkbox = checkbox;
		}
		new_user.childNodes[1].innerHTML = _client_labels[_current_language][37];
		new_user.childNodes[1].href = unescape(regiter_new);
		new_user.childNodes[1].target= "_blank";
		new_user.childNodes[2].innerHTML = _client_labels[_current_language][38];
		new_user.childNodes[2].href = unescape(forgot_password);
		new_user.childNodes[2].target= "_blank";

		form.appendChild(new_user);
	}
	else
	{
		new_user = __createElement("DIV", "newUserContainer");
		new_user.appendChild(__createElement("I"));
		new_user.appendChild(__createElement("A"));
		new_user.appendChild(__createElement("A"));
		var checkbox = null;
		if(service == "yah" || service == "aim") {
			checkbox = __createElement("input");
			checkbox.type = "checkbox";
			new_user.childNodes[0].appendChild(checkbox);
			new_user.childNodes[0].appendChild(document.createTextNode(" "+_client_labels[_current_language][36]));
			container.invisible_checkbox = checkbox;
		}
		new_user.childNodes[1].innerHTML = _client_labels[_current_language][37];
		new_user.childNodes[1].href = "javascript:void(0);";
		new_user.childNodes[1].onclick = function ()
		{
			_m_client._root_window.show_sso_register_window(welcomeTitle_sso_register[_current_language], welcomeMessage_sso_register[_current_language]);
		};
		new_user.childNodes[2].innerHTML = _client_labels[_current_language][38];
		new_user.childNodes[2].href = "javascript:void(0);";
		new_user.childNodes[2].onclick = function ()
		{
			_m_client._root_window.show_sso_forgot_pwd_window();
		};
		form.appendChild(new_user);
	}
    container.appendChild(header);
    container.appendChild(form);

    container.retract= function (st)
    {
        if(st == null)
            st = (this.form.style.display == "") ? true : false;
        var value = (st) ? "none" : "";
        var image;
        if(this.is_disabled)
            image = "blank.gif";
        else {
            if(st)
                image = "right.png";
            else
                image = "down.png";
        }
        //var image = (this.disable) ? "blank.gif" : ((st) ? "right.png" : "down.png");
        this.header.style.display = "";
        this.form.style.display = value;
        this.retract_image.src = imgPath + image;
    };

    container.get_username = function() 
    {
        return this.username_element.value;
    };

    container.get_password = function ()
    {
        return this.password_element.value;
    };

    container.clear_elements = function ()
    {
        this.username_element.value = "";
        this.username_element.onblur();
        this.password_element.value = "";
        this.password_element.onblur();
        if(container.invisible_checkbox)
            container.invisible_checkbox.checked = false;
    };

    container.set_focus = function ()
    {
        if( this.form.style.display == "" )
            this.username_element.focus();
    };

    container.hide = function ()
    {
        this.header.style.display = "none";
        this.form.style.display = "none";
        this._mode = false;
    };
    
    container.show = function ()
    {
        this.header.style.display = "";
        this.form.style.display = "";
        this.retract_image.src = imgPath + "down.png";
        this._mode = true;
    };

    container.disable = function(state)
    {
        this.is_disabled = state;
        var image = (state) ? "blank.gif" : "right.png";
        this.retract_image.src = imgPath + image;
    };

    container.login_invisible = function()
    {
        if(this.invisible) {
            return this.invisible.checked;
        } else {
            return false;
        }
    };
    
    container.header = header;
    container.form = form;
    container.retract_image = retract_image;
    container.username_text = username_text;
    container.username_element = username_element;
    container.password_text = password_text;
    container.password_element = password_element;
    container.text_element = text_element;
    container.invisible = checkbox;
    return container;
};
function win_keypress_sso(e , wn)
{
    var keyChar = window.event ? event.keyCode : e.keyCode;

    if (keyChar == 13 || keyChar == 10) {
        sso_call = "ssologin";
    }
};
login_list._createSSOLoginForm = function(service, title, image, userText, passText, regiter_new, forgot_password)
{ 
    var header, form, new_user, container;
    var retract_image;
    container = __createElement("DIV", "container");
    container.service = service;
    container._mode = false;
    container.is_disabled = false;

	header = __createElement("B");
    header.appendChild(__createElement("DIV"));
    if(ReadCookie("sso_login") != "" && ReadCookie("sso_pass")!="" && service=="sso")
	{
	//	_m_client._signin_container.style.display = "none";
		header.childNodes[0].innerHTML = "Logged In as : "+ReadCookie("sso_login");
		header.appendChild(__createElement("B"));
		header.childNodes[1].appendChild(__createElement("A"));
		header.childNodes[1].childNodes[0].href="#";
	    header.childNodes[1].childNodes[0].innerHTML = "Sign Out";
		header.childNodes[1].childNodes[0].onclick = function()
		{
			
			sso_call="";
			SetCookie("imUserStatus","",-1); 
			SetCookie('sso_pass',"",1);
			SetCookie('sso_login',"",1);
			SetCookie('SESSMUNDU',"0",1);
			_m_client._logout();			
			_m_login_list.clear();			
				delete _m_login_list._forms;
				_m_login_list._forms = new Array();
			_m_client._root_window.frameWindow.style.display = 'none';
			while(header.childNodes.length >0)
			{
				header.removeChild(header.childNodes[0]);
			}

		};
		header.childNodes[1].appendChild(__createElement("A"));
	    header.childNodes[1].childNodes[1].innerHTML = "Edit";
	    header.childNodes[1].childNodes[1].href = "#";
		header.childNodes[1].childNodes[1].onclick = function ()
		{
			_m_client.check_sso_user_cookie();
			_m_client.get_acc_details(ReadCookie('sso_login'),ReadCookie('sso_pass'));
		};
		header.appendChild(__createElement("A"));
		header.childNodes[2].innerHTML = "Configure SSO123";
		header.childNodes[2].href = "#";
		header.childNodes[2].onclick = function ()
		{
			
		};

		container.appendChild(header);
		return container;
	}
	
    retract_image = __createElement("IMG","retract","img_"+service);
    header.childNodes[0].appendChild(retract_image);
    retract_image.src = imgPath + "down.png";

    header.childNodes[0].appendChild(__createElement("IMG"));
    header.childNodes[0].childNodes[1].src = imgPath + image;
    header.childNodes[0].appendChild(__createElement("B"));
    header.childNodes[0].childNodes[2].innerHTML = title;
    if(browser.isIE)
    {
        header.childNodes[0].onmouseover = function()
        {
            this.style.background = service_hover_color;
        };

        header.childNodes[0].onmouseout = function()
        {
            this.style.background = "transparent";
        };
    }


    header.container = container;
    header.onclick = function() 
    {
        if(this.container.is_disabled) {
            _m_client._create_alert_window(_alert_message_list[_current_language][34][0], _alert_message_list[_current_language][34][1], _alert_message_list[_current_language][34][2]);
            return;
        }
        this.container.retract();
    };

    form = __createElement("DIV", "loginlist", service);

    var username_text = __createElement("SPAN");
    username_text.appendChild(document.createTextNode(userText));
    form.appendChild(username_text);

    var username_element = __createElement("INPUT", "use", service+"_us");
    if(ReadCookie(service)) {
        username_element.style.color = "black";
        username_element.value = ReadCookie(service);
    } else {
        username_element.style.color = "gray";
        username_element.value = username_text.firstChild.data;
    }
    username_element.container = container;
    username_element.onfocus = function ()
    {
        var str = this.container.username_text.firstChild.data;
        if(this.value == str) {
            this.style.color = "black";
            this.value = "";
        }
    };
	username_element.onkeypress = win_keypress_sso;
    username_element.onblur = function ()
    {
        if(this.value == "") {
            var username = ReadCookie(this.container.service);
            if(username) {
                this.style.color = "black";
                this.value = username;
            } else {
                this.style.color = "gray";
                this.value = this.container.username_text.firstChild.data;
            }
        }
    };
    form.appendChild(username_element);
    
    var password_text = __createElement("SPAN");
    password_text.appendChild(document.createTextNode(" "+passText+ " "));
    form.appendChild(password_text);

    var password_element = __createElement("INPUT", "pse", service+"_pa");
    password_element.type = "password";
    password_element.style.display = "none";
    password_element.container = container;
	password_element.onkeypress = win_keypress_sso;
    password_element.onblur = function ()
    {
        if(this.value == "") {
            this.style.display = "none";
            this.container.text_element.style.display = "";
        }
    };
    form.appendChild(password_element);

    var text_element = __createElement("INPUT", "pse");
    text_element.style.color = "gray";
    text_element.value = passText + " ";
    text_element.container = container;
    text_element.onfocus = function ()
    {
        this.style.display = "none";
        this.container.password_element.style.display = "";
        this.container.password_element.focus();
    };
    form.appendChild(text_element);

    new_user = __createElement("DIV", "newUserContainer");
    new_user.appendChild(__createElement("I"));
    new_user.appendChild(__createElement("A"));
    new_user.appendChild(__createElement("A"));
    var checkbox = null;
    if(service == "yah" || service == "aim") {
        checkbox = __createElement("input");
        checkbox.type = "checkbox";
        new_user.childNodes[0].appendChild(checkbox);
        new_user.childNodes[0].appendChild(document.createTextNode(" "+_client_labels[_current_language][36]));
        container.invisible_checkbox = checkbox;
    }
    new_user.childNodes[1].innerHTML = _client_labels[_current_language][37];
    new_user.childNodes[1].href = "javascript:void(0);";
    new_user.childNodes[1].onclick = function ()
	{
		_m_client._root_window.show_sso_register_window(welcomeTitle_sso_register[_current_language], welcomeMessage_sso_register[_current_language]);
	};
    new_user.childNodes[2].innerHTML = _client_labels[_current_language][38];
    new_user.childNodes[2].href = unescape(forgot_password);
    new_user.childNodes[2].target= "_blank";
    form.appendChild(new_user);

	var sso_signin = __createElement("DIV", "newUserContainer");
    sso_signin.appendChild(__createElement("I"));
	sso_signin.appendChild(__createElement("A"));
	sso_signin.childNodes[1].innerHTML = _client_labels[_current_language][32];
    sso_signin.childNodes[1].href = "javascript:void(0)";
	sso_signin.childNodes[1].onclick = function() 
    {
		sso_call="signin";
		 if(_m_login_list._is_signing)
            return;
        _m_login_list._is_signing = true;
        _m_login_list._container.onkeypress = function(){return false;};
        if(!_m_login_list.loginSSO()){
            _m_login_list._container.onkeypress = _m_login_list._keypress;
            _m_login_list._is_signing = false;
        }
    };
	form.appendChild(sso_signin);
	container.appendChild(header);
    container.appendChild(form);


	

    container.retract= function (st)
    {
        if(st == null)
            st = (this.form.style.display == "") ? true : false;
        var value = (st) ? "none" : "";
        var image;
        if(this.is_disabled)
            image = "blank.gif";
        else {
            if(st)
                image = "right.png";
            else
                image = "down.png";
        }
 
        this.header.style.display = "";
        this.form.style.display = value;
        this.retract_image.src = imgPath + image;
    };

    container.get_username = function() 
    {
        return this.username_element.value;
    };

    container.get_password = function ()
    {
        return this.password_element.value;
    };

    container.clear_elements = function ()
    {
        this.username_element.value = "";
        this.username_element.onblur();
        this.password_element.value = "";
        this.password_element.onblur();
        if(container.invisible_checkbox)
            container.invisible_checkbox.checked = false;
    };

    container.set_focus = function ()
    {
        if( this.form.style.display == "" )
            this.username_element.focus();
    };

    container.hide = function ()
    {
        this.header.style.display = "none";
        this.form.style.display = "none";
        this._mode = false;
    };
    
    container.show = function ()
    {
        this.header.style.display = "";
        this.form.style.display = "";
        this.retract_image.src = imgPath + "down.png";
        this._mode = true;
    };

    container.disable = function(state)
    {
        this.is_disabled = state;
        var image = (state) ? "blank.gif" : "right.png";
        this.retract_image.src = imgPath + image;
    };

    container.login_invisible = function()
    {
        if(this.invisible) {
            return this.invisible.checked;
        } else {
            return false;
        }
    };
    
    container.header = header;
    container.form = form;
    container.retract_image = retract_image;
    container.username_text = username_text;
    container.username_element = username_element;
    container.password_text = password_text;
    container.password_element = password_element;
    container.text_element = text_element;
    container.invisible = checkbox;
    return container;
};
