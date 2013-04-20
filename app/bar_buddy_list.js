
function buddy_list()
{
    try 
    {
        _m_buddy_list = this;
        this.buddy_window = new Object();
        
        this._buddies = new Object();
        //this._last_person_to_converse = "";
        this._group_names = new Object();
        this._groups = new Object();
        this._chat_log = new Object();
        this._chat_window_status = new Array();
        this._open_chat_window = new Object();
        this._rename_buddy = null;
        this._show_offline = ReadCookie("show_offline_buddies") == "true" ? true : false;
        
        this._win_buddies = new win_buddies();
        this._buddy_list = new Object();
        this._bubble = null;
        
        this.group_stats = buddy_list.group_stats;
        this.add_buddy = buddy_list.add_buddy;
        this.update_buddy = buddy_list.update_buddy;
        this.remove_buddy = buddy_list.remove_buddy;
        
        this._create_buddy_object = buddy_list._create_buddy_object;
        this._add_to_buddy_list = buddy_list._add_to_buddy_list;
        this._create_group_object = buddy_list._create_group_object;
        this._online_buddies_in_group = buddy_list._online_buddies_in_group;
        this.create_buddy_window = buddy_list.create_buddy_window;
        this.create_add_buddy_window = buddy_list.create_add_buddy_window;
        this.realign = buddy_list.realign;
        this.realign_left = buddy_list.realign_left;
        this.realign_right = buddy_list.realign_right;
        this.set_nav_count = buddy_list.set_nav_count;
        this.show_buddy = buddy_list.show_buddy;
        this.search_buddy = buddy_list.search_buddy;
        this.clear_search = buddy_list.clear_search;
        this.show_bubble = buddy_list.show_bubble;
        this.clear_bubble = buddy_list.clear_bubble;
        this.set_blocked = buddy_list.set_blocked;
        this.show_group_selector = buddy_list.show_group_selector;
        this.palm_show_group_selector = buddy_list.palm_show_group_selector;
        this.create_group_list = buddy_list.create_group_list;
        this.change_buddy_nick = buddy_list.change_buddy_nick;
        this.clear_rename_nick = buddy_list.clear_rename_nick;
        this.get_chat_history = buddy_list.get_chat_history;
        this.show_all_buddies = buddy_list.show_all_buddies;
        this.notify_hidden_message = buddy_list.notify_hidden_message;
    } 
    catch (wer) 
    {
        showconsole("in bar buddy list" + wer);
    }
    
};

buddy_list.group_stats = function(group)
{
    if (group == "") 
        return;
    var groups = new Array();
    var flag = false;
    for (var service in _m_client.login_list) 
    {
        var username = _m_client.login_list[service]["username"];
        for (var k = 0; k < _m_client.login_list[service]['count'].length; k++) 
        {
            username = _m_client.login_list[service]['count'][k];
            for (var buddy in _m_client._m_buddy_list._buddies[service][username]) 
            {
                if (!groups[_m_client._m_buddy_list._buddies[service][username][buddy]["group"]]) 
                {
                    groups[_m_client._m_buddy_list._buddies[service][username][buddy]["group"]] = new Object;
                    groups[_m_client._m_buddy_list._buddies[service][username][buddy]["group"]]["name"] = _m_client._m_buddy_list._buddies[service][username][buddy]["group"];
                    groups[_m_client._m_buddy_list._buddies[service][username][buddy]["group"]]["total"] = 0;
                    groups[_m_client._m_buddy_list._buddies[service][username][buddy]["group"]]["offline"] = 0;
                }
                if (_m_client._m_buddy_list._buddies[service][username][buddy]["state"] == "offline") 
                {
                    groups[_m_client._m_buddy_list._buddies[service][username][buddy]["group"]]["total"] = groups[_m_client._m_buddy_list._buddies[service][username][buddy]["group"]]["total"] + 1;
                    groups[_m_client._m_buddy_list._buddies[service][username][buddy]["group"]]["offline"] = groups[_m_client._m_buddy_list._buddies[service][username][buddy]["group"]]["offline"] + 1;
                }
                else 
                    groups[_m_client._m_buddy_list._buddies[service][username][buddy]["group"]]["total"] = groups[_m_client._m_buddy_list._buddies[service][username][buddy]["group"]]["total"] + 1;
            }
        }
    }
    return groups[group];
};



buddy_list.get_chat_history = function(service, buddyname)
{
    _m_client._con.get_chat_history(service, _m_client.login_list[service].username, buddyname);
};

buddy_list.show_all_buddies = function()
{
    if (this._show_offline) 
    {
        for (var group in this._group_names) 
            this._groups[group].style.display = "none";
        
        for (var service in this._buddies) 
        {
            for (var login in this._buddy_list[service]) 
            {
                for (var buddy in this._buddy_list[service][login]) 
                {
                    this._buddy_list[service][login][buddy].style.display = "";
                    this._groups[this._buddies[service][login][buddy].group].style.display = "";
                }
            }
        }
    }
    else 
    {
        for (var group in this._group_names) 
            this._groups[group].style.display = "none";
        
        for (var service in this._buddies) 
        {
            for (var login in this._buddies[service]) 
            {
                for (var buddy in this._buddies[service][login]) 
                {
                    if (this._buddies[service][login][buddy].state != "offline") 
                    {
                        this._buddy_list[service][login][buddy].style.display = "";
                        this._groups[this._buddies[service][login][buddy].group].style.display = "";
                    }
                    else 
                    {
                        this._buddy_list[service][login][buddy].style.display = "none";
                    }
                }
            }
        }
    }
};

buddy_list.palm_show_group_selector = function()
{

    this._group_selector = "";
    for (var gpname in this._group_names) 
    {
        if (gpname != "" && gpname != ".") 
        {
            this._group_selector += "{label:$L('" + gpname + "'),value:$L('" + gpname + "')},";
        }
    }
    
    this._group_selector += "{label:$L('Add New..'),value:$L('Add')},";
    return eval("[" + this._group_selector + "]");
};



buddy_list.show_group_selector = function()
{
};

buddy_list.create_group_list = function()
{
};


buddy_list.set_blocked = function(service, username, buddyname, block)
{
    var blk = (block) ? "yes" : "no";
    var state = (service != "msn") ? "offline" : this._buddies[service][username][buddyname].state;
    var cstate = (service != "msn") ? _word_list[_current_language]['Is'] + " " + _word_list[_current_language]['offline'] : this._buddies[service][username][buddyname].customMessage;
    this.update_buddy(service, username, buddyname, this._buddies[service][username][buddyname].group, state, cstate, blk);
};

buddy_list.remove_buddy = function(service, username, buddyname)
{
    try 
    {
        if (this._buddies[service][username][buddyname]) 
        {
            var buddyobj = this._buddies[service][username][buddyname];
            delete this._buddy_list[service][username][buddyname];
            delete this._buddies[service][username][buddyname];
        }
        _m_client._update_count();
        _m_client._m_buddy_list.search = true;
        // _m_client._m_buddy_list.clear_search();
    } 
    catch (er) 
    {
        showconsole("in remove buddyyyyyyyyyyyy" + er);
    }
};

buddy_list.search_buddy = function(query)
{
    this.clear_bubble();
    this.search = true;
    var buddy_found = false;
    if (query == "") 
    {
        _m_client._m_buddy_list.clear_search();
        return;
    }
    for (var group in this._group_names) 
        this._groups[group].style.display = "none";
    for (var service in this._buddies) 
    {
        for (var login in this._buddies[service]) 
        {
            for (var buddy in this._buddies[service][login]) 
            {
                var toFind = buddy;
                if (this._buddies[service][login][buddy].alias && this._buddies[service][login][buddy].alias != "") 
                    toFind = this._buddies[service][login][buddy].alias;
                if (toFind.toLowerCase().indexOf(query.toLowerCase()) == 0) 
                {
                    this._buddy_list[service][login][buddy].style.display = "";
                    this._groups[this._buddies[service][login][buddy].group].style.display = "";
                    buddy_found = true;
                }
                else 
                {
                    this._buddy_list[service][login][buddy].style.display = "none";
                }
            }
        }
    }
    _m_client._m_buddy_list._win_buddies.search_close.style.display = "";
    //if (!buddy_found)
    //TODO show message 
};

buddy_list.clear_search = function()
{
    if (this.search) 
    {
        this.show_all_buddies();
        this.search = false;
        _m_client._m_buddy_list._win_buddies.search_input.value = "";
        _m_client._m_buddy_list._win_buddies.search_close.style.display = "none";
        _m_client._m_buddy_list._win_buddies.search_input.onblur();
    }
    this.clear_bubble();
};

buddy_list.add_buddy = function(service, username, buddyname, group, state, customMessage, blocked, alias, imageMD5, avatar)
{
    try 
    {
        if (!_m_buddy_list._buddies[service]) 
            _m_buddy_list._buddies[service] = {};
        if (!_m_buddy_list._buddies[service][username]) 
            _m_buddy_list._buddies[service][username] = {};
        if (_m_buddy_list._buddies[service][username][buddyname]) 
            this.remove_buddy(service, username, buddyname);
            
        _m_buddy_list._create_buddy_object(service, username, buddyname, group, state, customMessage, blocked, alias, imageMD5, avatar);
    } 
    catch (er) 
    {
        showconsole("ERROR bar_buddy-add_buddy() : " + er);
    }
};

buddy_list._create_group_object = function(group)
{

    this._groups[group] = __createElement("DIV", "group_container");
    this._groups[group].gp_name = __createElement("DIV", "name");
    this._groups[group].visible = true;
    this._groups[group].gp_name.innerHTML = getUIString(group, 20);
    /*this._groups[group].gp_name.onclick = function()
     {
     var obj = this.parentNode.childNodes[1];
     if (obj.style.display == "none")
     {
     obj.style.display = "";
     this.className = "name";
     }
     else
     {
     obj.style.display = "none";
     this.className += " contract";
     }
     };*/
    try 
    {
        this._groups[group].container = __createElement("DIV", "cont");
        this._groups[group].appendChild(this._groups[group].gp_name);
        this._groups[group].appendChild(this._groups[group].container);
        this._groups[group].style.display = "none";
        //this._buddy_container.appendChild(this._groups[group]);
    } 
    catch (er) 
    {
        showconsole("ERROR bar_buddy- create_group_object() : " + er);
    }
    
};


buddy_list._online_buddies_in_group = function(group)
{
    for (var service in this._buddies) 
    {
        for (var username in this._buddies[service]) 
        {
            for (var buddy in this._buddies[service][username]) 
            {
                if (this._buddies[service][username][buddy].group == group && this._buddies[service][username][buddy].state != 'offline') 
                    return true;
            }
        }
    }
    return false;
};

buddy_list._create_buddy_object = function(service, username, buddyname, group, state, customMessage, blocked, alias, imageMD5, avatar)
{
    group = (group == "") ? "." : group;
    if (!this._buddy_list[service]) 
        this._buddy_list[service] = {};
    if (!this._buddy_list[service][username]) 
        this._buddy_list[service][username] = {};
    //showconsole(service+"--"+ username+"----"+ buddyname+"----"+ group+"---- state--->"+ state+"----"+ customMessage+"----"+ blocked+"----"+ alias);
    this._buddy_list[service][username][buddyname] = this._add_to_buddy_list(service, username, buddyname, group, state, customMessage, blocked, alias, false, imageMD5, avatar);
    
};

buddy_list.create_buddy_window = function(service, username, buddyname, write_history)
{
    //showconsole(service+username+buddyname+write_history);
    try 
    {
        if (!_m_buddy_list.buddy_window[service]) 
            _m_buddy_list.buddy_window[service] = {};
        if (!_m_buddy_list.buddy_window[service][username]) 
            _m_buddy_list.buddy_window[service][username] = {};
        if (!_m_buddy_list.buddy_window[service][username][buddyname]) 
            _m_buddy_list.buddy_window[service][username][buddyname] = new win_popup(service, username, buddyname, write_history);
        else if (_m_buddy_list.buddy_window[service][username][buddyname].is_closed == true) 
        {
            //_m_buddy_list.buddy_window[service][username][buddyname].open(write_history);
        }
        else if (_m_buddy_list.buddy_window[service][username][buddyname].is_minimized == true) 
        {
            _m_buddy_list.buddy_window[service][username][buddyname].toggle(write_history);
            _m_buddy_list.buddy_window[service][username][buddyname].toggle_other_windows(write_history);
        }
        else if (_m_buddy_list.buddy_window[service][username][buddyname].is_hidden == true) 
            _m_buddy_list.show_buddy(service, username, buddyname);
    } 
    catch (er) 
    {
        showconsole("error in createbuddywindow  " + er);
    }
};

buddy_list.update_buddy = function(service, username, buddyname, group, state, customMessage, blocked, alias, md5value)
{
    try 
    {
        group = (group == "") ? "." : group;
        this._add_to_buddy_list(service, username, buddyname, group, state, customMessage, blocked, alias, true, md5value);
        group = this._buddies[service][username][buddyname].group;
        if (this.search) 
            return;
    } 
    catch (wer) 
    {
        showconsole("ERROR bar_buddy -update_buddy() " + wer);
    }
};

buddy_list._add_to_buddy_list = function(service, username, buddyname, group, state, customMessage, blocked, alias, update, md5value, avatar)
{
    if (!alias) 
        alias = "";
    if (update && alias == "" && this._buddies[service] && this._buddies[service][username] && this._buddies[service][username][buddyname]) 
        alias = this._buddies[service][username][buddyname].alias;
    group = (group == "") ? "." : group;
    if (this._buddies[service][username] && this._buddies[service][username][buddyname]) 
        group = this._buddies[service][username][buddyname].group;
    
    var tempAvatar;
    if(avatar && avatar != "")
        tempAvatar = avatar;
    else if (this._buddies[service][username] && this._buddies[service][username][buddyname]) 
        tempAvatar = this._buddies[service][username][buddyname].avatar;
    else 
        tempAvatar = "R0lGODlhAQABAIAAAP///////yH+FUNyZWF0ZWQgd2l0aCBUaGUgR0lNUAAh+QQBCgABACwAAAAAAQABAAACAkwBADs=";
    
    var tempImageMD5;
    if(md5value && md5value != "")
        tempImageMD5 = md5value;
    else if (this._buddies[service][username] && this._buddies[service][username][buddyname]) 
        tempImageMD5 = this._buddies[service][username][buddyname].md5;
    
    
    if (customMessage && customMessage != "") 
        customMessage = normalText(customMessage);
    _m_buddy_list._buddies[service][username][buddyname] = 
    {
        'group': group,
        'state': state,
        'customMessage': customMessage,
        'blocked': blocked,
        'alias': alias,
        'md5': tempImageMD5,
        'avatar': tempAvatar,
        'last_person_to_converse': ''
    };
    
    if (!this._group_names[group]) 
    {
        this._group_names[group] = group;
        this._create_group_object(group);
    }
    if (update) 
    {
        var obj = _m_buddy_list._buddies[service][username][buddyname];
        return obj;
    }
};

buddy_list.show_bubble = function(service, username, buddyname, group)
{
};

buddy_list.change_buddy_nick = function(service, username, buddyname, nickname)
{
};

buddy_list.clear_rename_nick = function()
{
};

buddy_list.clear_bubble = function()
{

};

buddy_list.realign = function(type)
{
};

buddy_list.show_buddy = function(service, username, buddyname)
{
};

buddy_list.notify_hidden_message = function()
{

};

buddy_list.set_nav_count = function(left, right)
{

};
