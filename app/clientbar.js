function mundu_client()
{

    _m_client = this;
    
    this._is_connected = false;
    try 
    {
        this._con = new mundu_communication();
    } 
    catch (e) 
    {
        showconsole("clientbar- mundu_client() : " + e);
        setTimeout("delete _o_client;_o_client = null;", 100);
    }
    this.supported_services = ['yah', 'msn', 'jab', 'aim', 'icq', 'xmpp'];
    this.login_list = {};
    this.to_show = [];
    this.logout_container = null;
    this.login_container = null;
    this.service_area = null;
    this.login_heading = null;
    this.yahoo_block = false;
    this.poll_interval = null;
    this.sync_chat_history_interval = null;
    this.window_status_interval = null;
    this.available_services = new Array();
    this.remeberMe = false;
    this.showOfflineBuddy = false;
    this.vibrateAlerts = true;
    this.soundAlerts = false;
    this.updateCount = -1;
    this.updateCountLimit = 0;
    this.buddyUpdateListLengthNew = -1
    this.currentLoginUsername = new Array();
    this.currentLoginUsernameForUI = new Array();
    this.updateLength = 0;
    this.updateCounter = 0;
    this.customMessage = _client_labels[_current_language][35];
    this.status = "available";
    this.prefChanged = false;
    this.darkTheme = true;
    
    
    /*this.login_list = new Array();
     this.login_list['yah'] = 'yah';
     this.login_list['msn'] = 'msn';
     this.login_list['jab'] = 'jab';
     this.login_list['aim'] = 'aim';
     this.login_list['icq'] = 'icq';
     for(service in this.login_list)
     this.login_list[service]['count'] = new Array();
     */
    this.save_browser_title = window.document.title;
    this._rotate_title_time = null;
    this._m_buddy_list = new buddy_list();
    //this._m_data = new mirror_data();//-------was commented
    
    this._create_chat_bar = mundu_client._create_chat_bar;
    this._on_connect = mundu_client._on_connect;
    
    this.open = mundu_client.open;
    this.slide = mundu_client.slide;
    this.slide_buddies_bar = mundu_client.slide_buddies_bar;
    this.rotate_browser_title = mundu_client.rotate_browser_title;
    //this._create_buddy_request = mundu_client._create_buddy_request;
    
    this._on_buddy_receive = mundu_client._on_buddy_receive;
    this._on_buddy_update = mundu_client._on_buddy_update;
    this._on_buddy_avatar = mundu_client._on_buddy_avatar;
    
    this._on_progress = mundu_client._on_progress;
    this._on_message = mundu_client._on_message;
    this.on_send_message = mundu_client.on_send_message;
    this.on_send_typing = mundu_client.on_send_typing;
    
    this._on_typing = mundu_client._on_typing;
    this._on_status_change = mundu_client._on_status_change;
    this._on_error = mundu_client._on_error;
    this._on_disconnect = mundu_client._on_disconnect;
    this._on_fatal_error = mundu_client._on_fatal_error;
    this._on_non_fatal_error = mundu_client._on_non_fatal_error;
    this._notify_error = mundu_client._notify_error;
    this._update_count = mundu_client._update_count;
    this._is_account_logged_in = mundu_client._is_account_logged_in;
    
    
    this._on_login_complete = mundu_client._on_login_complete;
    this._on_login_success = mundu_client._on_login_success;
    this._on_login_request = mundu_client._on_login_request;
    this._on_handle_response = mundu_client._on_handle_response;
    
    this.palm_show_account_selector = mundu_client.palm_show_account_selector;
    this.on_login = mundu_client.on_login;
    this.on_logout = mundu_client.on_logout;
    this._on_login_form = mundu_client._on_login_form;
    this._on_new_instance = mundu_client._on_new_instance;
    this._on_friendship = mundu_client._on_friendship;
    
    this.block_buddy = mundu_client.block_buddy;
    this.update_buddy_statusPre = mundu_client.update_buddy_statusPre;
    this.set_chat_history_record = mundu_client.set_chat_history_record;
    this.removeFromCurrentLoginUsername = mundu_client.removeFromCurrentLoginUsername;
    this.removeFromCurrentLoginUsernameForUI = mundu_client.removeFromCurrentLoginUsernameForUI;
    this._reset_session = mundu_client._reset_session;
    this.setcallback = mundu_client.setcallback;
    
    
    this._con.set_callback("on_login_form", this._on_login_form);
    this._con.set_callback("on_new_instance", this._on_new_instance);
    this._con.set_callback("on_connect", this._on_connect);
    this._con.set_callback("on_buddy_receive", this._on_buddy_receive);
    
    this._con.set_callback("on_login", this._on_login_request);
    this._con.set_callback("on_login_complete", this._on_login_complete);
    this._con.set_callback("on_buddy_update", this._on_buddy_update);
    this._con.set_callback("on_buddy_avatar", this._on_buddy_avatar);
    this._con.set_callback("on_progress", this._on_progress);
    this._con.set_callback("on_message", this._on_message);
    
    this._con.set_callback("on_typing", this._on_typing);
    this._con.set_callback("on_status", this._on_status_change);
    this._con.set_callback("on_error", this._on_error);
    this._con.set_callback("on_fatal_error", this._on_fatal_error);
    this._con.set_callback("on_non_fatal_error", this._on_non_fatal_error);
    this._con.set_callback("on_disconnect", this._on_disconnect);
    this._con.set_callback("on_login_success", this._on_login_success);
    this._con.set_callback("on_handle_response", this._on_handle_response);
    
    this._con.set_callback("on_friendship", this._on_friendship);
    this._con.set_callback("on_remove_buddy", this._on_remove_buddy);
    
    
    
};

mundu_client.set_chat_history_record = function(service, username, buddyname, message, timestamp, sender)
{
    if (!_m_buddy_list._chat_log[service]) 
        _m_buddy_list._chat_log[service] = {};
    
    if (!_m_buddy_list._chat_log[service][username]) 
        _m_buddy_list._chat_log[service][username] = {};
    
    if (!_m_buddy_list._chat_log[service][username][buddyname]) 
        _m_buddy_list._chat_log[service][username][buddyname] = new Array();
    
    var d = new Date();
    timestamp = d.getTime();
    
    /*	if (_m_buddy_list._chat_log[service][username][buddyname].length == _num_chat_messages)
     _m_buddy_list._chat_log[service][username][buddyname].shift();*/
    _m_buddy_list._chat_log[service][username][buddyname].push(new Array(sender, message, timestamp));
};

mundu_client.setcallback = function(on, to)
{
    if (on == "for_buddy_avatar") 
    {
        this._for_buddy_avatar = to;
    }
    else if (on == "for_buddy_update_new") 
    {
        this._for_buddy_update_new = to;
    }
    else if (on == "for_buddy_update") 
    {
        this._for_buddy_update = to;
    }
    else if (on == "on_message") 
    {
        this._for_message_receieve = to;
    }
    else if (on == "on_status") 
    {
        this._for_status_update = to;
    }
    else if (on == "on_typing") 
    {
        this._for_typing_update = to;
    }
    else if (on == "change_logoutlist_model") 
    {
        this._change_logoutlist_model = to;
    }
    else if (on == "remember_user_dtls") 
    {
        this._remember_user_dtls = to;
    }
    else if (on == "accounts_signed_in") 
    {
        this._accounts_signed_in = to;
    }
    else if (on == "create_buddy_request") 
    {
        this._create_buddy_request = to;
    }
    
};

mundu_client._on_login_form = function(service, title, image, userText, passText, regiter_new, forgot_password)
{
    //_m_client.available_services[_m_client.available_services.length] = service;
    /*if(getServerURL)
     {
     newRegisterURL[service]=regiter_new;
     forgotPasswordURL[service]=forgot_password;
     }*/
};

mundu_client.palm_show_account_selector = function()
{
    this._account_selector = "";
    for (var service in this.login_list) 
    {
        for (var k = 0; k < this.login_list[service]['count'].length; k++) 
        {
            var xf = this.login_list[service]['count'][k];
            var yf = "";
            if (xf.indexOf("@") != -1) 
                yf = xf.substr(xf.indexOf("@") + 1, xf.length);
            if (yf == "chat.facebook.com") 
                yf = "face";
            this._account_selector += "{label:$L('" + this.login_list[service]['count'][k] + "'), iconPath:'" + getIMImage(service, yf) + "', value:$L('" + this.login_list[service]['count'][k] + ":" + service + "')},";
        }
    }
    if (this._account_selector != "") 
        return eval("[" + this._account_selector + "]");
    return eval("[{label:$L(''),value:''}]");
};

mundu_client.on_logout = function(service, username, timeout)
{
    try 
    {
        if (_m_client._m_buddy_list._buddies[service]) 
        {
            for (var buddy in _m_client._m_buddy_list._buddies[service][username]) 
            {
                var buddyobj = _m_client._m_buddy_list._buddies[service][username][buddy];
                delete _m_client._m_buddy_list._buddy_list[service][username][buddy];
            }
        }
        delete _m_client._m_buddy_list._buddies[service][username];
        delete _m_client._m_buddy_list._buddy_list[service][username];
        if (_m_client._m_buddy_list.buddy_window[service]) 
            delete _m_client._m_buddy_list.buddy_window[service]
        
        var k, flag = false;
        for (k = 0; k < _m_client.login_list[service]['count'].length; k++) 
        {
            if (username == _m_client.login_list[service]['count'][k] && !flag) 
            {
                delete _m_client.login_list[service]['count'][k];
                flag = true;
            }
            else if (flag) 
            {
                _m_client.login_list[service]['count'][k - 1] = _m_client.login_list[service]['count'][k];
                
            }
        }
        if (k == _m_client.login_list[service]['count'].length) 
        {
            delete _m_client.login_list[service]['count'][k - 1];
            _m_client.login_list[service]['count'].length = k - 1;
        }
        if (_m_client.login_list[service]['count'].length == 0) 
        {
            delete _m_client.login_list[service]['count'];
            delete _m_client.login_list[service]['username'];
            delete _m_client.login_list[service];
        }
        // delete _m_client.login_list[service];
        _m_client._con.logout(service, username);
        
        if (!checkLoggedIn("") && _m_client.currentLoginUsernameForUI.length == 0) 
        {
            var currentScenes = Mojo.Controller.stageController.getScenes();
            var g;
            for (g = 0; g < currentScenes.length - 1; g++) 
            {
                login_this.controller.stageController.assistant.removeScene();
            }
            _m_client._con._stop_poll();
            _m_client._con._send_array = new Array();
            _m_client._con._avatar_send_array = new Array();
            if (ReadCookie("SESSTOOLBARMUNDU") != 0) 
            {
                _m_client._con.logout();
                imServerReady = false;
                try 
                {
                    login_this.spinnerModel.spinning = true;
                    login_this.controller.modelChanged(login_this.spinnerModel);
                    login_this.controller.getSceneScroller().mojo.revealTop(true);
                } 
                catch (er) 
                {
                    showconsole("error in cliebat logout: " + er);
                }
                document.getElementById("overlay").style.display = "block";
            }
            //setTimeout("_m_client._con.logout()", 100);
            //_m_client._reset_session();
        }
        
        try 
        {
            // _m_client._change_logoutlist_model();
            _m_client._for_buddy_update("");
            _m_client._accounts_signed_in("none");
        } 
        catch (er) 
        {
            showconsole("clientbar - on_logout " + er);
        }
    } 
    catch (wer) 
    {
        showconsole(wer + " errrorun in m_client.logout function ");
    }
    //if(_m_client.login_list[service].username == username) 
    //	_m_client._login_box.logout(service, username, true, true, timeout);
};

mundu_client.on_remove_buddy = function(service, username, buddy, group)
{
    _m_client._m_buddy_list.remove_buddy(service, username, buddy);
};

mundu_client._on_friendship = function(service, username, buddy, type)
{
    switch (type)
    {
        case "confirm":
            var exists = false;
            if (_m_client._m_buddy_list._buddies[service] && _m_client._m_buddy_list._buddies[service][buddy]) 
            {
                exists = true;
            }
            _m_client._create_buddy_request(service, username, buddy, exists);
            break;
        case "deny":
            var tmp = _alert_message_list[_current_language][14][1].replace("%%%", buddy);
            _m_client.error_notification.container._notificationschild(_client_labels[_current_language][0], tmp, "error");
            _m_client._m_buddy_list.remove_buddy(service, username, buddy);
            break;
        case "invalid":
            var tmp = _alert_message_list[_current_language][16][1];
            _m_client.error_notification.container._notificationschild(_client_labels[_current_language][1], tmp, "error");
            _m_client._m_buddy_list.remove_buddy(service, username, buddy);
            break;
    }
};

mundu_client.block_buddy = function(service, username, buddy, block)
{
    var group = this._m_buddy_list._buddies[service][buddy].group;
    _m_client._con.block_buddy(service, username, buddy, group, block);
    if (service != "yah" || block) 
    {
        _m_client._m_buddy_list.set_blocked(service, username, buddy, block);
    }
    else 
    {
        _m_client.yahoo_block = true;
    }
    if (service == "yah" && !block) 
    {
        //add buddy here
        _m_client.login_box._add_win(service);
        var ele = _m_client._login_box._add_form.getElementsByTagName("INPUT");
        ele[0].value = buddy;
        ele[0].disabled = true;
        if (group != ".") 
            ele[1].value = group;
    }
    
};
/*mundu_client._create_buddy_request = function(service, username, buddy, exists)
 {
 var obj = _m_client._login_box._on_approve_request(service, username, buddy, "");
 _m_client.error_notification.container._notificationschild(_client_labels[_current_language][2], obj, "obj");
 
 };*/
mundu_client._on_handle_response = function()
{
    _m_client._m_data.data_to_be_polled.push(arguments);
};
//<<<FTP
mundu_client._on_file_received = function(im, login, name, filename, filesize, key)
{
    document.downloadfile.filename.value = filename;
    document.downloadfile.submit();
};

mundu_client._on_ftp_fatal_error = function(service, username, error, code)
{
    var objNotify = _m_client.error_notification.container;
    var str = "";
    if (service) 
        str += getIMService(service) + ": ";
    str += error;
    objNotify._notificationschild("File Transfer", str, "error");
    if (_m_client.error_notification.container.style.display == "none") 
        _m_client.error_notification.container.toggle();
};

mundu_client._on_ask_file_request = function(service, username, buddyname, filename, filesize, key)
{
    var value = _alert_message_list[_current_language][28][1].replace("%%%", buddyname);
    value = value.replace("###", filename);
    _m_client.error_notification.container.toggle("show");
    var buts = _m_client.error_notification._show_confirm_notification("File Transfer Request", value);
    if (buts) 
    {
        buts[0].onclick = function()
        {
            _m_client._con.send_fileRequest_notification(service, username, buddyname, filename, filesize, key, "accept");
            buts[2].destroy_notification();
        };
        buts[1].onclick = function()
        {
            _m_client._con.send_fileRequest_notification(service, username, buddyname, filename, filesize, key, "deny");
            buts[2].destroy_notification();
        };
    }
};

//FTP>>>
mundu_client._notify_error = function(service, username, error, code)
{
    var main_conatiner = __createElement('DIV', 'buddy_container');
    var err = __createElement("DIV", "buddy");
    var err_text = __createElement("SPAN");
    var str = "";
    if (service) 
        str += getIMService(service) + ": ";
    str += _server_error_codes[_current_language][code - 101];
    err_text.innerHTML = str;
    err.appendChild(err_text);
    main_container.appendChild(err);
    _m_client.error_notification.container.appendChild(main_conatiner);
    if (_m_client.error_notification.container.style.display == "none") 
        _m_client.error_notification.container.toggle();
};

mundu_client._on_connect = function()
{
    if (this.poll_interval) 
        return;
    this.poll_interval = setInterval("_m_client._m_data.poll_data()", 200);
    if (!this.window_status_interval) 
    {
        this.window_status_interval = setInterval("_m_client._m_data.get_window_status()", 500);
    }
    if (!this.sync_chat_history_interval) 
    {
        this.sync_chat_history_interval = setInterval("_m_client._m_data.sync_chat_history()", 1000);
    }
    
    
};
mundu_client._on_buddy_receive = function(service, username, buddyname, group, state, customMessage, blocked, alias, imageMD5, avatar)
{
    if (buddyname == "offline@offline.com") 
        return;
    if (!customMessage) 
        customMessage = "";
    if (!blocked) 
        blocked = "no";
    /*        if (group[group.length - 1] == "\\") 
     group += "\\";
     //group = group.substr(0,group.length - 1);
     */
    _m_client._m_buddy_list.add_buddy(service, username, buddyname, group, state, customMessage, blocked, alias, imageMD5, avatar);
};

//mundu_client._on_login_form = function() {};

mundu_client._on_login_request = function()
{
};
mundu_client._on_login_complete = function()
{
};

mundu_client._on_buddy_avatar = function(serv, username, buddyname, base64image)
{
    try 
    {
        _m_client._m_buddy_list._buddies[serv][username][buddyname].avatar = base64image;
    } 
    catch (er) 
    {
        showconsole("clietnbar : on_buddy_avatar : " + er);
    }
    //if(_m_buddy_list._buddies[serv][username][buddyname].avatar != "")
    _m_client._for_buddy_avatar(serv, username, buddyname, base64image);
}

mundu_client._reset_session = function()
{
    //showconsole("settin seession cookiee to zeroooo : " + ReadCookie("SESSTOOLBARMUNDU"));
    SetCookie("SESSTOOLBARMUNDU", "0");
    SetCookie("SESSMUNDU", "0");
    //showconsole("Done :" + ReadCookie("SESSTOOLBARMUNDU"));
    _m_client._con._add_to_queue("GET", null, null, false);
    
}

mundu_client.removeFromCurrentLoginUsernameForUI = function(service, username)
{
    var k, flag = false;
    for (k = 0; k < _m_client.currentLoginUsernameForUI.length; k++) 
    {
        if (username == _m_client.currentLoginUsernameForUI[k][1] && service == _m_client.currentLoginUsernameForUI[k][0] && !flag) 
        {
            //showconsole("Deleting : " + _m_client.currentLoginUsernameForUI[k][1]);
            delete _m_client.currentLoginUsernameForUI[k];
            flag = true;
        }
        else if (flag) 
        {
            _m_client.currentLoginUsernameForUI[k - 1] = _m_client.currentLoginUsernameForUI[k];
            
        }
    }
    if (k == _m_client.currentLoginUsernameForUI.length && k != 0) 
    {
        //showconsole("DELETING1 : "+_m_client.currentLoginUsernameForUI[k - 1]);
        delete _m_client.currentLoginUsernameForUI[k - 1];
        _m_client.currentLoginUsernameForUI.length = k - 1;
    }
    if (_m_client.currentLoginUsernameForUI.length == 0) 
    {
        //showconsole("DELETING2 : ");
        _m_client.currentLoginUsernameForUI = new Array();
    }
    
    
}

mundu_client.removeFromCurrentLoginUsername = function(service, username)
{
    var k, flag = false;
    for (k = 0; k < _m_client.currentLoginUsername.length; k++) 
    {
        if (username == _m_client.currentLoginUsername[k][1] && service == _m_client.currentLoginUsername[k][0] && !flag) 
        {
            delete _m_client.currentLoginUsername[k];
            flag = true;
        }
        else if (flag) 
        {
            _m_client.currentLoginUsername[k - 1] = _m_client.currentLoginUsername[k];
            
        }
    }
    if (k == _m_client.currentLoginUsername.length) 
    {
        delete _m_client.currentLoginUsername[k - 1];
        _m_client.currentLoginUsername.length = k - 1;
    }
    if (_m_client.currentLoginUsername.length == 0) 
    {
        _m_client.currentLoginUsername = new Array();
    }
    /*
    
     for (var i = 0; i < login_this.accountlistmodel.items.length; i++)
    
     {
    
     if (login_this.accountlistmodel.items[i].name == username && login_this.accountlistmodel.items[i].category == service)
    
     {
    
     if (login_this.accountlistmodel.items[i].category != "face")
    
     var xmlDoc = "<IM_CLIENT><AVATAR im='" + login_this.accountlistmodel.items[i].category + "' login='" + login_this.accountlistmodel.items[i].name + "' filename='/media/internal/wallpapers/06.jpg' type='set' />" + login_this.accountlistmodel.items[i].avatar + "</IM_CLIENT>";
    
     else
    
     var xmlDoc = "<IM_CLIENT><AVATAR im='xmpp' login='" + login_this.accountlistmodel.items[i].name + "' filename='/media/internal/wallpapers/06.jpg' type='set' />" + login_this.accountlistmodel.items[i].avatar + "</IM_CLIENT>";
    
     // _m_client._con._add_to_queue("POST", null, xmlDoc, false);
    
     }
    
     }
    
     */
    
}

mundu_client._on_buddy_update = function(service, username, buddyname, group, state, customMessage, blocked, code, md5value, alias)
{

    try 
    {
        if (_m_client.login_list[service]) 
        {
            /*if (!group || group == "") 
             group = _m_client._m_buddy_list._buddies[service][username][buddyname].group;
             if (!state || state == "")
             state = _m_client._m_buddy_list._buddies[service][username][buddyname].state;
             if (!blocked || blocked == "")
             blocked = _m_client._m_buddy_list._buddies[service][username][buddyname].blocked;
             if (!alias || alias == "")
             alias = _m_client._m_buddy_list._buddies[service][username][buddyname].alias;
             if (!customMessage || customMessage == "")
             customMessage = _m_client._m_buddy_list._buddies[service][username][buddyname].customMessage;*/
            _m_client._m_buddy_list.update_buddy(service, username, buddyname, group, state, customMessage, blocked, alias, md5value);
        }
        
        if (((_m_client.updateCounter + 1) >= _m_client.updateLength) && (_m_client.currentLoginUsername.length > 0)) 
        {
            _m_client.updateLength = 0;
            _m_client.updateCounter = 0;
            //_m_client.currentLoginUsername = new Array();
            
            _m_client.removeFromCurrentLoginUsername(service, username);
            //_m_client._accounts_signed_in("");
            var currentScenes = Mojo.Controller.stageController.getScenes();
            var i;
            for (i = 0; i < currentScenes.length; i++) 
            {
                if (currentScenes[i].sceneName == 'buddies') 
                {
                    break;
                }
            }
            if (i >= currentScenes.length) 
            {
                //Mojo.Controller.stageController.assistant.showScene('buddies');
            }
            
            //now push the buddies scene
        }
        else if (_m_client.currentLoginUsername.length > 0) 
        {
            // _m_client.updateCounter++;
        }
        else 
        {
            // _m_client._for_buddy_update("");
            _m_client.update_buddy_statusPre(service, username, buddyname, group, state, customMessage, blocked);
        }
        /*if (_m_client._m_buddy_list.buddy_window[service] &&  _m_client._m_buddy_list.buddy_window[service][username] &&  _m_client._m_buddy_list.buddy_window[service][username][buddyname])
         {
         _m_client._m_buddy_list.buddy_window[service][username][buddyname].set_status_img(state);
         }*/
        //Mojo.Controller.SceneController.modelChanged
    
    } 
    catch (er) 
    {
        showconsole("error in on_buddy_update" + er);
    }
    
    /*
     if (_m_client.updateCountLimit <= 0)
     {
     _m_client.update_buddy_statusPre(service, username, buddyname, group, state, customMessage, blocked);
     //_m_client.updateCount = 0;
     }
     else
     {
     _m_client.updateCount++;
     showconsole(_m_client.updateCount++);
     if (_m_client.updateCount % 10 == 0)
     {
     _m_client.update_buddy_statusPre(service, username, buddyname, group, state, customMessage, blocked);
     //_m_client.updateCount = 0;
     }
     else
     {
     //setTimeout("_m_client._for_buddy_update('');", 1000);
     }
     }
     
     if (_m_client.updateCount >= _m_client.updateCountLimit)
     {
     _m_client.updateCount = -1;
     _m_client.updateCountLimit = 0;
     //_m_client._for_buddy_update("");
     //showconsole("callin the new udpate");
     //_m_client._for_buddy_update_new(service, username, buddyname, group, state, customMessage, blocked);
     
     }*/
};
mundu_client.update_buddy_statusPre = function(service, username, buddyname, group, state, customMessage, blocked)
{
    try 
    {
        var currentScenes = Mojo.Controller.stageController.getScenes();
        for (var i = 0; i < currentScenes.length; i++) 
        {
            if (currentScenes[i].sceneName == 'chat') 
            {
                _m_client._for_status_update(service, username, buddyname, group, state, customMessage, blocked);
                break;
            }
            else if (currentScenes[i].sceneName == 'buddies') 
            {
                // _m_client._for_buddy_update("");
                //showconsole("update buddy "+buddyname);
                //showconsole("callin the new udpate");
                _m_client._for_buddy_update_new(service, username, buddyname, group, state, customMessage, blocked);
            }
        }
    } 
    catch (er) 
    {
        showconsole("errro in callin for_status_update" + er);
    }
};

mundu_client._on_progress = function()
{
};
mundu_client._on_message = function(service, username, buddyname, message, time, sender)
{

    if (_m_client.soundAlerts) 
    {
        login_this.controller.serviceRequest('palm://com.palm.audio/systemsounds', 
        {
            method: "playFeedback",
            parameters: 
            {
                name: "dtmf_3"
            },
            onSuccess: showconsole("DTMF_3 PLAYED"),
            onFailure: showconsole("ERROR IN PLAYIN DTMF_3")
        });
    }
    
    if (!_m_buddy_list.buddy_window[service] || !_m_buddy_list.buddy_window[service][username] || !_m_buddy_list.buddy_window[service][username][buddyname] || (!_m_buddy_list.buddy_window[service][username][buddyname].is_minimized && !_m_buddy_list.buddy_window[service][username][buddyname].is_hidden)) 
    {
        _m_buddy_list.create_buddy_window(service, username, buddyname, true);
    }
    _m_buddy_list.buddy_window[service][username][buddyname].set_chat_history(service, username, buddyname, message, time, true, buddyname);
    try 
    {
        var currentScenes = Mojo.Controller.stageController.getScenes();
        var i = 0;
        for (; i < currentScenes.length; i++) 
        {
            if (currentScenes[i].sceneName == 'chat') 
            {
                _m_client._for_message_receieve(service, username, buddyname, message, time, sender);
                break;
            }
        }
        if (i == currentScenes.length) 
        {
            if (login_this) 
                login_this.controller.stageController.getAppController().playSoundNotification("vibrate", "");
            
            try 
            {
                var parsed_mess = message;
                var sender_val = buddyname;
                
                if (_m_client._m_buddy_list._buddies[service][username][buddyname] && _m_client._m_buddy_list._buddies[service][username][buddyname].alias && _m_client._m_buddy_list._buddies[service][username][buddyname].alias != ""  && _m_client._m_buddy_list._buddies[service][username][buddyname].alias != "null") 
                    sender_val = _m_client._m_buddy_list._buddies[service][username][buddyname].alias;
                if (message.indexOf("<font") != -1 || message.indexOf("<FONT") != -1) 
                    parsed_mess = (new DOMParser()).parseFromString(message, "text/xml").childNodes[0].childNodes[0].textContent;
                if (sender_val && sender_val.length > 12 && sender_val.length > 0) 
                {
                    sender_val = sender_val.substring(0, 10) + '..';
                }
                Mojo.Controller.getAppController().showBanner(
                {
                    messageText: sender_val + " says.. " + parsed_mess
                }, "launchArguments", "myCategory");
            } 
            catch (er) 
            {
                showconsole(er + " clientbar : _on_message ");
            }
            
            try 
            {
                var appController = Mojo.Controller.getAppController();
                var stageName = "notification";
                var dashboardStage = appController.getStageProxy(stageName);
                message = _m_buddy_list.buddy_window[service][username][buddyname].chat_history.lastChild.childNodes[0].innerHTML;
                if (!dashboardStage) 
                {
                    var f = function(stageController)
                    {
                        stageController.pushScene(
                        {
                            name: "notification",
                            sceneTemplate: "notification/notification-scene"
                        }, 
                        {
                            message: service + ":" + buddyname + ":" + username + ":" + message,
                            stage: stageName
                        });
                    };
                    appController.createStageWithCallback(
                    {
                        name: stageName,
                        lightweight: true,
                        assistant: "NotificationAssistant",
                        //height: 10
                    }, f, 'dashboard');
                }
                else 
                {
                    dashboardStage.delegateToSceneAssistant("testDashboard", service, buddyname, username, message);
                }
            } 
            catch (er) 
            {
                showconsole(er + "error in show notification fun");
            }
        }
    } 
    catch (ex) 
    {
        showconsole("hellos " + ex);
    }
};


mundu_client._on_typing = function(service, username, buddyname, type)
{
    /*try{if (_m_client._m_buddy_list.buddy_window[service]  && _m_client._m_buddy_list.buddy_window[service][username] && _m_client._m_buddy_list.buddy_window[service][username][buddyname])
     {
     _m_client._m_buddy_list.buddy_window[service][username][buddyname].set_typing(type);
     }
     }catch(er){showconsole("this is the errro in typing "+er);}*/
    try 
    {
        _m_client._for_typing_update(service, username, buddyname, type);
    } 
    catch (er) 
    {
        showconsole("on_typin erro : " + er);
    }
};
mundu_client._on_status_change = function()
{
};
mundu_client._on_error = function()
{
};
mundu_client._on_non_fatal_error = function()
{
};
mundu_client._on_fatal_error = function(service, username, error, code)
{
    /*if(code == 102)
     {
     for(var i=0;i<_m_client._login_box.user_login_screens.childNodes.length;i++)
     {
     if(_m_client._login_box.user_login_screens.childNodes[i].service == "loader")
     _m_client._login_box.user_login_screens.removeChild(_m_client._login_box.user_login_screens.childNodes[i]);
     else
     {
     if(_m_client._login_box.user_login_screens.childNodes[i].service == service && _m_client._login_box.user_login_screens.childNodes[i].state == "offline")
     _m_client._login_box.user_login_screens.childNodes[i].style.display ="";
     else
     _m_client._login_box.user_login_screens.childNodes[i].style.display = "none";
     }
     }
     }*/
    service = service.toLowerCase();
    try 
    {
        if (service == "xmpp" && username.substr(username.indexOf("@") + 1, username.length) == "chat.facebook.com") 
            service = "face";
        if (_m_client.login_list[service] && _m_client.login_list[service]['count']) 
        {
            for (var k = 0; k < _m_client.login_list[service]['count'].length; k++) 
            {
                if (_m_client.login_list[service]['count'][k] == username) 
                {
                    _m_client.on_logout(service, username);
                    break;
                }
            }
        }
        
        var str = "";
        if (service) 
            str += getIMService(service) + " : " + username;
        try 
        {
            _m_client.removeFromCurrentLoginUsername(service, username);
            _m_client.removeFromCurrentLoginUsernameForUI(service, username);
        } 
        catch (er) 
        {
            showconsole("ERROR IN HANDLING FATAL ERROR : " + er);
        }
        _m_client._accounts_signed_in("none");
    } 
    catch (er) 
    {
        showconsole("CLIENTBAR ON_FATAL_ERROR : " + er);
    }
    try 
    {
                /*for(a in login_this.controller.stageController.topScene())
         showconsole(a);*/
        //if (chat_obj) 
        {
            if (!checkLoggedIn("")) 
            {
                login_this.controller.showAlertDialog(
                {
                    onChoose: function(value)
                    {
                        
                    },
                    title: $L(_client_labels[_current_language][32]),
                    message: $L(str + " - " + _server_error_codes[_current_language][code - 101] + " " + error),
                    choices: [
                    {
                        label: $L('Ok'),
                        value: "ok"
                    }, ]
                });
            }
            else 
            {
                login_this.controller.stageController.topScene().showAlertDialog(
                {
                    onChoose: function(value)
                    {
                        //this.controller.get("area-to-update").update("Alert result = " + value);
                        var currentScenes = Mojo.Controller.stageController.getScenes();
                        var cs;
                        for (cs = 0; cs < currentScenes.length - 1; cs++) 
                        {
                            Mojo.Controller.stageController.assistant.removeScene();
                        }
                        
                    },
                    title: $L(_client_labels[_current_language][32]),
                    message: $L(str + " - " + _server_error_codes[_current_language][code - 101] + " " + error),
                    choices: [
                    {
                        label: $L('Ok'),
                        value: "ok"
                    }, ]
                });
            }
        }
    } 
    catch (er) 
    {
        Mojo.Controller.errorDialog(str + " - " + _server_error_codes[_current_language][code - 101] + " " + error);
        var currentScenes = Mojo.Controller.stageController.getScenes();
        var cs;
        for (cs = 0; cs < currentScenes.length - 1; cs++) 
        {
            login_this.controller.stageController.assistant.removeScene();
        }
    }
    //login_this.controller.stageController.assistant.removeScene("chat");
    //login_this.controller.stageController.assistant.removeScene("buddies");

};
mundu_client._on_disconnect = function(service, username, timeout)
{
    if (!_m_client) 
        return;
    if (!service) 
    {
        for (var service in _m_client.login_list) 
            _m_client.on_logout(service, _m_client.login_list[service].username, timeout);
        //_m_client._login_box.logout(service,_m_client.login_list[service].username, true, true);
    }
    else 
    {
        _m_client.currentLoginUsername = new Array();
        _m_client.currentLoginUsernameForUI = new Array();
        _m_client._accounts_signed_in("none");
        if (_m_client.login_list[service]) 
        {
            //    _m_client._login_box.logout(service, username, true, true);
        }
    }
};
//<<<CONF
mundu_client._initiate_conference = function(service, username, conf_id)
{
    _m_client.confWindow = __createElement("DIV", "confWindow");
    var confTitle = __createElement("DIV", "confTitle");
    _m_client.confWindow.appendChild(confTitle);
    confTitle.appendChild(__createElement("DIV", "confTitleText"));
    confTitle.childNodes[0].innerHTML = "Conference";
    confTitle.appendChild(__createElement("DIV", "confClose"));
    confTitle.childNodes[1].appendChild(__createElement("IMG"));
    confTitle.childNodes[1].childNodes[0].src = imgPath + "blank.gif";
    confTitle.childNodes[1].childNodes[0].className = "win-close-icon";
    confTitle.childNodes[1].childNodes[0].onclick = function()
    {
        deleteElements(_m_client.confWindow);
    };
    var confClientWindow = __createElement("DIV", "confClientWindow");
    var confAddBuddy = __createElement("DIV", "confAddBuddy");
    confAddBuddy.appendChild(__createElement("DIV", "contactList"));
    confAddBuddy.childNodes[0].innerHTML = "Contact List";
    var add_buddy_list = __createElement("div", "add_buddy_list");
    var j = 0;
    for (username in _m_client._m_buddy_list._buddies[service]) 
    {
        for (buddyname in _m_client._m_buddy_list._buddies[service][username]) 
        {
            if (conf_id != "" && _m_client._m_buddy_list.buddy_window[service][username][conf_id].is_member(buddyname)) 
                continue;
            if (_m_client._m_buddy_list._buddies[service][username][buddyname].state != "offline") 
            {
                add_buddy_list.appendChild(__createElement("DIV", "list"));
                add_buddy_list.childNodes[j].innerHTML = buddyname;
                add_buddy_list.childNodes[j].onclick = function()
                {
                    if (this.style.fontWeight != "bold") 
                        this.style.fontWeight = "bold";
                    else 
                        this.style.fontWeight = "normal";
                };
                j++;
            }
        }
    }
    confAddBuddy.appendChild(add_buddy_list);
    
    var confAddButton = __createElement("DIV", "confAddButton");
    confAddButton.appendChild(__createElement("BUTTON", "buttonDiv"));
    var added_buddy_list = __createElement("div", "added_buddy_list");
    confAddButton.childNodes[0].innerHTML = "&raquo;";
    confAddButton.childNodes[0].onclick = function()
    {
        var i = 0;
        while (add_buddy_list.childNodes[i]) 
        {
            if (add_buddy_list.childNodes[i].style.fontWeight == "bold") 
            {
                var list = added_buddy_list.appendChild(__createElement("DIV", "list"));
                list.innerHTML = add_buddy_list.childNodes[i].innerHTML;
                deleteElements(add_buddy_list.childNodes[i]);
                i--;
            }
            i++;
        }
        for (var i = 0; i < added_buddy_list.childNodes.length; i++) 
        {
            added_buddy_list.childNodes[i].onclick = function()
            {
                if (this.style.fontWeight != "bold") 
                    this.style.fontWeight = "bold";
                else 
                    this.style.fontWeight = "normal";
            };
        }
    };
    confAddButton.appendChild(__createElement("BUTTON", "buttonDiv"));
    confAddButton.childNodes[1].innerHTML = "&laquo;";
    confAddButton.childNodes[1].onclick = function()
    {
        var i = 0;
        while (added_buddy_list.childNodes[i]) 
        {
            if (added_buddy_list.childNodes[i].style.fontWeight == "bold") 
            {
                var list = add_buddy_list.appendChild(__createElement("DIV", "list"));
                list.innerHTML = added_buddy_list.childNodes[i].innerHTML;
                deleteElements(added_buddy_list.childNodes[i]);
                i--;
            }
            i++;
        }
        for (var i = 0; i < add_buddy_list.childNodes.length; i++) 
        {
            add_buddy_list.childNodes[i].onclick = function()
            {
                if (this.style.fontWeight != "bold") 
                    this.style.fontWeight = "bold";
                else 
                    this.style.fontWeight = "normal";
            };
        }
    };
    var confBuddy = __createElement("DIV", "confBuddy");
    confBuddy.appendChild(__createElement("DIV", "invitationList"));
    confBuddy.childNodes[0].innerHTML = "Invitation List";
    confBuddy.appendChild(added_buddy_list);
    var actionButton = __createElement("DIV", "confButtonsContainer");
    actionButton.appendChild(__createElement("BUTTON", "confAlertButton"));
    actionButton.childNodes[0].innerHTML = _client_labels[_current_language][33];
    actionButton.childNodes[0].onclick = function()
    {
        for (var i = 0; i < added_buddy_list.childNodes.length; i++) 
        {
            if (!_m_client.arrBuddies[i]) 
                _m_client.arrBuddies[i] = new Array;
            _m_client.arrBuddies[i]["serv"] = service;
            _m_client.arrBuddies[i]["user"] = username;
            _m_client.arrBuddies[i]["divId"] = added_buddy_list.childNodes[i].innerHTML;
        }
        var oprn = (conf_id != "") ? "invite" : "initiate";
        _m_client._con.put_initiateconf_request(service, username, _m_client.arrBuddies, conf_id, oprn);
        deleteElements(_m_client.confWindow);
    };
    actionButton.appendChild(__createElement("BUTTON", "confAlertButton"));
    actionButton.childNodes[1].innerHTML = _client_labels[_current_language][16];
    actionButton.childNodes[1].onclick = function()
    {
        deleteElements(_m_client.confWindow);
    };
    confClientWindow.appendChild(confAddBuddy);
    confClientWindow.appendChild(confAddButton);
    confClientWindow.appendChild(confBuddy);
    confClientWindow.appendChild(actionButton);
    _m_client.confWindow.appendChild(confClientWindow);
    //document.getElementsByTagName("BODY")[0].appendChild(_m_client.confWindow);
    document.getElementById("palm_main_div").appendChild(_m_client.confWindow);
};

mundu_client._close_alert_window = function()
{
    for (i = 0; i <= _m_client.body.childNodes.length; i++) 
    {
        _m_client.body.removeChild(_m_client.body.childNodes[i]);
    }
    _m_client.chat_bar_main.removeChild(_m_client.outerBody);
    _m_client.chat_bar_main.removeChild(_m_client.body);
};
//CONF>>>
mundu_client._create_alert_window = function(title, details, str, type)
{
    _m_client.outerBody = __createElement("DIV", "outerWindow");
    _m_client.outerBody.style.background = "SteelBlue";
    _m_client.outerBody.style.bottom = 0; //getScrollPosition()+"px";
    _m_client.outerBody.style.zIndex = "1000";
    _m_client.body = __createElement("DIV", "alertWindow");
    var alertTitle = __createElement("DIV", "alertTitle");
    alertTitle.appendChild(__createElement("DIV", "alertClose"));
    alertTitle.childNodes[0].appendChild(__createElement("IMG"));
    alertTitle.childNodes[0].childNodes[0].src = imgPath + "close.gif";
    alertTitle.childNodes[0].childNodes[0].onclick = _m_client._close_alert_window;
    alertTitle.appendChild(__createElement("DIV", "TitleText"));
    alertTitle.childNodes[1].innerHTML = title;
    _m_client.body.appendChild(alertTitle);
    var alertContent = __createElement("DIV", "alertContent");
    _m_client.body.appendChild(alertContent);
    alertContent.appendChild(__createElement("DIV", "alertDetails"));
    alertContent.childNodes[0].innerHTML = details;
    alertContent.appendChild(__createElement("DIV", "alertImage"));
    alertContent.childNodes[1].appendChild(__createElement("IMG"));
    if (type == "confirm") 
        alertContent.childNodes[1].childNodes[0].src = imgPath + "confirm.png";
    else 
        alertContent.childNodes[1].childNodes[0].src = imgPath + "alert.png";
    alertContent.appendChild(__createElement("DIV", "alertInfo"));
    alertContent.childNodes[2].innerHTML = str;
    var action = __createElement("DIV", "alertButtonsContainer");
    _m_client.body.appendChild(action);
    
    action.appendChild(__createElement("BUTTON", "alertButton"));
    action.childNodes[0].innerHTML = _client_labels[_current_language][10];
    if (type == "confirm") 
    {
        action.appendChild(__createElement("BUTTON", "alertButton"));
        action.childNodes[1].innerHTML = _client_labels[_current_language][9];
        action.childNodes[1].onclick = _m_client._close_alert_window;
    }
    else 
    {
        action.appendChild(__createElement("SPAN"));
    }
    _m_client.outerBody.style.width = (__getInnerWidth()) + "px";
    _m_client.outerBody.style.height = __getInnerHeight() + "px";
    _m_client.chat_bar_main.appendChild(_m_client.outerBody);
    _m_client.chat_bar_main.appendChild(_m_client.body);
    var width = (_m_client.body.offsetWidth) / 2;
    var height = (_m_client.body.offsetHeight) / 2;
    _m_client.body.style.left = Math.ceil((__getInnerWidth() / 2) - width) + "px";
    _m_client.body.style.bottom = Math.ceil(__getInnerHeight() / 2) - height + "px";
    return new Array(action.childNodes[0], action.childNodes[1]);
};


mundu_client._is_account_logged_in = function(service, username)
{
    if (!_m_client.login_list[service]) 
        return false;
    
    for (var c = 0; c < _m_client.login_list[service]['count'].length; c++) 
        if (_m_client.login_list[service]['count'][c] == username) 
        {
            return true;
        }
    return false;
    
}

mundu_client._on_login_success = function(service, username)
{
    imServerReady = false;
    if (!_m_client.login_list[service]) 
    {
        _m_client.login_list[service] = new Array();
        _m_client.login_list[service]['username'] = username;
    }
    
    if (!_m_client.login_list[service]['count']) 
        _m_client.login_list[service]['count'] = new Array();
    _m_client.login_list[service]['username'] = username;
    _m_client.login_list[service]['count'][_m_client.login_list[service]['count'].length] = username;
    
    
    
    
    
    this._remember_user_dtls();
    //_m_client.removeFromCurrentLoginUsername(service,username);
    _m_client.removeFromCurrentLoginUsernameForUI(service, username);
    try 
    {
        this._accounts_signed_in("none");
    } 
    catch (er) 
    {
        showconsole("this is error in accounts_signed_in in _on_login_succes" + er);
    }
    //this._change_logoutlist_model();
    //this._for_buddy_update("");
    for (var u in _m_client._m_buddy_list.buddy_window[service]) 
    {
        for (var i in _m_client._m_buddy_list.buddy_window[service][u]) 
        {
            if (username == _m_client._m_buddy_list.buddy_window[service][u][i].win_username) 
                _m_client._m_buddy_list.buddy_window[service][u][i].enable_chat();
            else 
            {
            }
        }
    }
    //_m_client._login_box._user_loggedin(service, username);
    if (!_m_client._m_buddy_list._buddies[service]) 
    {
        _m_client._m_buddy_list._buddies[service] = new Object();
    }
    
    globMenu.appMenuModel.items[2].disabled = false;
    //_m_client._con.set_status("14", _m_client.customMessage);

};

mundu_client._on_new_instance = function()
{

};

mundu_client._update_count = function()
{
    this.no_online_buddies = 0;
    var buddies = this._m_buddy_list._buddies;
    for (var service in buddies) 
    {
        for (var username in buddies[service]) 
        {
            for (var name in buddies[service][username]) 
            {
                if (buddies[service][username][name].state != "offline") 
                    this.no_online_buddies++;
            }
        }
    }
    //this.online_buddy.innerHTML = _client_labels[_current_language][3] + " (" + this.no_online_buddies + ")";
};

mundu_client._create_chat_bar = function()
{
    _m_client._login_box = new win_login();
    _m_client._chat_bar = __createElement("DIV", "chatbar");
    var bar_left = __createElement("DIV", "chat_icon o_min");
    
    bar_left.innerHTML = _client_labels[_current_language][4];
    
    bar_left.onclick = function()
    {
        _m_client._login_box.container.toggle();
    };
    _m_client.online_buddy = __createElement("DIV", "chat_icon o_min", "chat_icon");
    this.no_online_buddies = 0;
    _m_client.online_buddy.innerHTML = _client_labels[_current_language][3] + "(" + this.no_online_buddies + ")";
    _m_client.online_buddy.onclick = function()
    {
        _m_client._m_buddy_list._win_buddies.container.toggle();
    };
    _m_client.errorSym = __createElement("DIV", "err_mark err_min");
    _m_client.errorSym.innerHTML = "!";
    _m_client.errorSym.onclick = function()
    {
        _m_client.error_notification.container.toggle();
    };
    _m_client._login_label = bar_left;
    
    _m_client._chat_bar.appendChild(_m_client._login_label);
    _m_client._chat_bar.appendChild(_m_client.errorSym);
    _m_client._chat_bar.appendChild(_m_client.online_buddy);
    _m_client._buddies_bar_main = __createElement("DIV", '', "buddies_bar-main");
    _m_client._buddies_bar_main.style.width = "auto";
    _m_client._buddies_bar_main.left_nav = __createElement("DIV", "left_nav");
    _m_client._buddies_bar_main.right_nav = __createElement("DIV", "rht_nav");
    _m_client._buddies_bar_main.notification = __createElement("DIV");
    _m_client._buddies_bar_main.left_nav.style.display = "none";
    _m_client._buddies_bar_main.right_nav.style.display = "none";
    _m_client._buddies_bar = __createElement("DIV", "buddies_bar");
    _m_client._buddies_bar.style.left = "265px";
    _m_client.chat_bar_main = __createElement("DIV", "chatbar-main");
    _m_client._buddies_bar_main.appendChild(_m_client._buddies_bar_main.left_nav);
    _m_client._buddies_bar_main.appendChild(_m_client._buddies_bar);
    _m_client._buddies_bar_main.appendChild(_m_client._buddies_bar_main.right_nav);
    _m_client.chat_bar_main.appendChild(_m_client._chat_bar);
    _m_client.chat_bar_main.appendChild(_m_client._m_buddy_list._win_buddies.container);
    //_m_client.chat_bar_main.appendChild(_m_client._buddies_bar_main);
    _m_client._chat_bar.appendChild(_m_client._buddies_bar_main);
    _m_client.chat_bar_main.appendChild(_m_client._login_box.container);
    
    //document.getElementsByTagName("BODY")[0].appendChild(_m_client.chat_bar_main);
    try 
    {
        document.getElementById("palm_main_div").appendChild(_m_client.chat_bar_main);
    } 
    catch (er) 
    {
        showconsole("ERROR in : client baar  - creeate_caht_bar" + er);
    }
    //var login_arr = new Array (new Array('yah','mundu.check','mundu123','true'));
    //_m_client._con.login(login_arr,'visble');
    _m_client.error_notification = new win_notification();
    
    if (add_app) 
    {
        _m_client.app_text = __createElement("DIV", "application o_min");
        _m_client.app_text.innerHTML = _client_labels[_current_language][5] + "&#9650";
        _m_client.app_text.onclick = function()
        {
            _m_client._applications.container.toggle();
        };
        _m_client._applications = new win_application();
        _m_client._chat_bar.appendChild(_m_client.app_text);
        for (var i = 0; i < applications.length; i++) 
        {
            _m_client._applications.add_application(applications[i][0], applications[i][1], applications[i][2]);
        }
    }
    
    window.onfocus = function()
    {
        _m_client._is_focus = true;
    };
    window.onblur = function()
    {
        _m_client._is_focus = false;
    };
    document.onblur = window.onblur;
    document.focus = window.onfocus;
    
    //close the poll request by sending 
    try 
    {
        /*	if (BrowserDetect.browser == "Explorer")
         {
         window.onbeforeunload = function()
         {
         if(_m_client._con)
         {
         var domstr = "null";
         _m_client._con._poll_request.open("POST", _m_client._con._server, true);
         _m_client._con._poll_request.send(domstr);
         }
         };
         }*/
    } 
    catch (er) 
    {
    }
    
    window.onresize = function()
    {
        _m_client._m_buddy_list.realign("other");
    };
    
};

mundu_client.open = function()
{
    _m_client._create_chat_bar();
    if (!_m_client._is_connected) 
        _m_client._con.connect(imServer);
    
    _m_client._con.start();
};

mundu_client.slide_buddies_bar = function(left, count)
{
    var moveOffset = 5;
    if (!left) 
        moveOffset = -moveOffset;
    _m_client._buddies_bar.style.position = "absolute";
    _m_client._buddies_bar.style.left = parseInt(_m_client._buddies_bar.style.left) - moveOffset + "px";
    if (isNaN(count)) 
        count = 0;
    count++;
    if (count < 30) 
        setTimeout("_m_client.slide_buddies_bar(" + left + "," + count + ");", 10);
    else 
    {
        var wnd = _m_client.to_show;
        _m_client._m_buddy_list.buddy_window[wnd[0]][wnd[1]][wnd[2]].show();
        _m_client._buddies_bar.style.left = "265px";
        _m_client._buddies_bar.style.position = "";
    }
};


mundu_client.slide = function(left, count, leftOffset)
{
    var wbs = _m_client._m_buddy_list.buddy_window;
    var moveOffset = 150;
    if (!left) 
        moveOffset = -moveOffset;
    for (var s in wbs) 
    {
        for (var u in wbs[s]) 
        {
            for (var b in wbs[s][u]) 
            {
                if (!wbs[s][u][b].is_closed) 
                {
                    if (isNaN(leftOffset) || parseInt(wbs[s][u][b].container.style.left) + 1 > leftOffset) 
                    {
                        wbs[s][u][b].container.style.left = parseInt(wbs[s][u][b].container.style.left) - moveOffset + "px";
                        //wbs[s][b]._top_container.style.left = parseInt( wbs[s][b]._top_container.style.left ) - moveOffset + "px";
                    }
                }
            }
        }
    }
    if (isNaN(count)) 
        count = 0;
    count++;
    if (count < 1) 
        setTimeout("_m_client.slide(" + left + "," + count + "," + leftOffset + ");", 10);
    else 
        count = 0;
};

mundu_client.rotate_browser_title = function(msg)
{
    window.document.title = msg;
    if (!this._is_focus) 
    {
        if (this._rotate_title_time) 
            clearTimeout(this._rotate_title_time);
        msg = msg.substring(1) + msg.substring(0, 1);
        this._rotate_title_time = setTimeout("_m_client.rotate_browser_title('" + msg + "')", 300);
    }
    else 
    {
        clearTimeout(this._rotate_title_time);
        window.document.title = this.save_browser_title;
    }
};
//<<<FTP
mundu_client.putfiletrasRequest = function(service, touser, fromuser, formname)
{
    if (document.forms[formname].elements["uploadinputnewfile"].value == null) 
        return;
    if (document.forms[formname].elements["uploadinputnewfile"].value == "") 
    {
        setTimeout("_m_client.putfiletrasRequest('" + service + "','" + touser + "','" + fromuser + "','" + formname + "')", 300);
    }
    else 
    {
        __tool_box.CreateOverlay('none');
        //document.getElementById('uploadimage').style.display = 'none';
        var filename = document.forms[formname].elements["uploadinputnewfile"].value;
        document.forms[formname].elements["uploadinputnewfile"].value = "";
        _m_client._con.send_file_details(service, touser, fromuser, filename);
    }
};
//FTP>>>
//<<<CONF
mundu_client._on_join_conference = function(hostname, host_service, buddyname, buddy_service, operation, conf_id)
{
    _m_buddy_list._on_join_conference(hostname, host_service, buddyname, buddy_service, operation, conf_id);
};

mundu_client._on_conference_message_recvd = function(hostname, host_service, buddyname, buddy_service, operation, conf_id, message)
{
    _m_buddy_list._on_conference_message_recvd(hostname, host_service, buddyname, buddy_service, operation, conf_id, message);
};

mundu_client._on_conference_leave = function(hostname, host_service, buddyname, buddy_service, operation, conf_id)
{
    _m_buddy_list._on_conference_leave(hostname, host_service, buddyname, buddy_service, operation, conf_id);
};

mundu_client._on_conference_accept_request = function(hostname, host_service, buddyname, buddy_service, operation, conf_id, message)
{
    if (host_service == "msn") 
        return;
    var body = _alert_message_list[_current_language][27][1].replace("%%%", buddyname).replace("***", message);
    _m_client.error_notification.container.toggle("show");
    var buts = _m_client.error_notification._show_confirm_notification(_alert_message_list[_current_language][27][0], body);
    if (buts) 
    {
        buts[0].onclick = function()
        {
            _m_client._con.conf_accept_request_response(hostname, host_service, buddyname, buddy_service, 'accept', conf_id);
            buts[2].destroy_notification();
        };
        buts[1].onclick = function()
        {
            _m_client._con.conf_accept_request_response(hostname, host_service, buddyname, buddy_service, 'reject', conf_id);
            buts[2].destroy_notification();
        };
    }
};

mundu_client._on_refresh_confbuddy_recieve = function(el, conf_id, hostname, host_service, operation)
{
    _m_client._m_buddy_list._open_conference(host_service, hostname, conf_id, false);
    for (i = 0; i < el.childNodes.length; i++) 
    {
        var e = el.childNodes[i];
        if (e.tagName == "conference") 
        {
            _m_client._m_buddy_list.buddy_window[host_service][hostname][conf_id].add_buddy_to_conf(e.getAttribute("service"), e.getAttribute("name"));
        }
    }
    
};
//CONF>>>

function Chat()
{
    if (!_o_client) 
    {
        _o_client = new mundu_client();
    }
    _o_client.open();
};

//create_ckman_iframe();
//loadIframe();
