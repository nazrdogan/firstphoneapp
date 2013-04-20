/*
 mundu_communication - Javascript Mundu web client API
 mundu_communication is Mundu messenger web client API written Javascript.
 This has a object oriented interface which makes it easy to use.
 Communication is implemented by using AJAX technology.
 Coding style:
 Methods and arguments internal to this object start with underscore.
 */

var Mundu_Server = "http://imose.geodesic.com/";
//var Mundu_Server = "http://webim3.im.mundu.com/";


var Mundu_PollInterval = 100;
var Mundu_CheckQueueInterval = 100;
var Mundu_SessionTimeout = 180; // Number of minutes the server should maintain this session 
var __browser = "";
var imServer = Mundu_Server;
var imServerReady = false;
var logoutAllInProgress = false;
var _current_language = 'english';
var imgPath = "images/";
var add_app = false;
var service_highlight_color = "#8497bf";
var service_supported = ["yah", "aim", "msn", "jab", "xmpp", "face", "icq"];
var _num_chat_messages = 5;
var toBeRemovedCustomMessages = new Array("Is available", "Is offline", "Is busy", "Is away");
var applications = [["text", "Home", ""], ["text", "My Profile", ""], ["text", "My Photos", ""], ["text", "Shared Videos", ""]];

function mundu_communication()
{

    _mCon = this;
    
    this._debug = false;
    
    this._rsa = new RSAKey();
    this._rsa.setPublic(rsa_key.n, rsa_key.e);
    
    // Attributes
    this._server = Mundu_Server;
    this._is_connected = false;
    this._next_box_number = 0;
    this._send_array = new Array();
    this._avatar_send_array = new Array();
    this._user_status = new Array();
    this._sso_user_accounts = new Array();
    this._poll_request = HttpRequest.create();
    this._poll_handler = mundu_communication._poll_handler;
    this._is_poll_running = false;
    this._send_request = HttpRequest.create();
    this._send_handler = mundu_communication._send_handler;
    this._is_queue_sending = false;
    this._is_paused = false;
    this._num_logins = 0;
    this._is_loging = false;
    this._num_referral = 0;
    this._remove_from_avatar_send_array = false;
    this._services_loging_in = new Array();
    //this._session = "0";
    // Methods
    this._handle_response = mundu_communication._handle_response;
    this._stop_poll = mundu_communication._stop_poll;
    this._start_poll = mundu_communication._start_poll;
    this._do_poll = mundu_communication._do_poll;
    this._start_send = mundu_communication._start_send;
    this._send_data = mundu_communication._send_data;
    this._add_to_queue = mundu_communication._add_to_queue;
    this._add_to_avatar_queue = mundu_communication._add_to_avatar_queue;
    this._is_md5_changed = mundu_communication._is_md5_changed;
    this._parse_buddy_list = mundu_communication._parse_buddy_list;
    this._parse_login_list = mundu_communication._parse_login_list;
    this._reset = mundu_communication._reset;
    this._all_services_received_response = mundu_communication._all_services_received_response;
    
    // Seters
    this.set_check_queue_interval = mundu_communication.set_check_queue_interval;
    this.set_poll_interval = mundu_communication.set_poll_interval;
    this.set_server = mundu_communication.set_server;
    
    // API
    this.connect = mundu_communication.connect;
    this.login = mundu_communication.login;
    this.logout = mundu_communication.logout;
    this.send_message = mundu_communication.send_message;
    this.for_sso_login = mundu_communication.for_sso_login;
    this.send_signup_request = mundu_communication.send_signup_request; //New
    this.set_status = mundu_communication.set_status;
    this.conf_accept_request_response = mundu_communication.conf_accept_request_response; // nivedita_conf_01042008
    this.send_typing_indicator = mundu_communication.send_typing_indicator;
    this.add_buddy = mundu_communication.add_buddy;
    this.approve_buddy = mundu_communication.approve_buddy;
    this.remove_buddy = mundu_communication.remove_buddy;
    this.rename_buddy_nick = mundu_communication.rename_buddy_nick;
    this.get_chat_history = mundu_communication.get_chat_history;
    
    this.add_group = mundu_communication.add_group; //gpm team
    this.remove_group = mundu_communication.remove_group; //gpm team
    this.move_group = mundu_communication.move_group; //gpm team
    this.rename_group = mundu_communication.rename_group; //gpm team
    this.show_empty_group = mundu_communication.show_empty_group; //gpm team
    this._on_sso_get_accounts = mundu_communication._on_sso_get_accounts;
    this._on_sso_forgot_pwd = mundu_communication._on_sso_forgot_pwd;
    this.get_acc_details_request = mundu_communication.get_acc_details_request; //New one
    this.register_user = mundu_communication.register_user;
    this.single_signon = mundu_communication.single_signon;
    this.send_edit_details_request = mundu_communication.send_edit_details_request;
    this.manage_service = mundu_communication.manage_service;
    this._send_get_contacts = mundu_communication._send_get_contacts; //address book	
    this.put_initiateconf_request = mundu_communication.put_initiateconf_request; //JCONF
    this.on_conf_host_leave = mundu_communication.on_conf_host_leave;
    this.send_conference_message = mundu_communication.send_conference_message; //JCONF
    this.send_file_details = mundu_communication.send_file_details; //FTP
    this.send_fileRequest_notification = mundu_communication.send_fileRequest_notification; //FTP
    this.on_download_file_complete = mundu_communication.on_download_file_complete; //FTP
    this.get_buddy_list = mundu_communication.get_buddy_list;
    this.get_login_list = mundu_communication.get_login_list;
    this.send_referral = mundu_communication.send_referral;
    this.disconnect = mundu_communication.disconnect;
    this.get_client_id = mundu_communication.get_client_id; // Depricated
    this.set_client_id = mundu_communication.set_client_id; // Depricated
    this.pause = mundu_communication.pause;
    this.start = mundu_communication.start;
    this.is_loging = mundu_communication.is_loging;
    this.block_buddy = mundu_communication.block_buddy;
    this.get_profile = mundu_communication.get_profile;
    this.is_popout_safe = mundu_communication.is_popout_safe;
    this.is_logged_in = mundu_communication.is_logged_in;
    // Set callback
    this.set_callback = mundu_communication.set_callback;
};

mundu_communication.is_logged_in = function(service, username)
{
    if (_m_client.login_list[service]) 
    {
        for (var i = 0; i < _m_client.login_list[service]['count'].length; i++) 
            if (_m_client.login_list[service]['count'][i] == username) 
                return true;
    }
    return false;
}

mundu_communication._poll_handler = function(transport)
{
    try 
    {
        if (!_m_client._con) 
            return;
        var xmlDoc = XMLDocument.get_xml_from_text(transport.responseText);
        if (xmlDoc.childNodes[0].attributes.length > 0) 
        {
            var old_cookie = ReadCookie("SESSTOOLBARMUNDU");
            if (xmlDoc.childNodes[0].attributes[0].nodeName == "session" && (old_cookie != xmlDoc.childNodes[0].attributes[0].nodeValue)) 
            {
                SetCookie("SESSTOOLBARMUNDU", xmlDoc.childNodes[0].attributes[0].nodeValue);
            }
        }
        
        if (transport.responseText == "" || !xmlDoc || !xmlDoc.childNodes || xmlDoc.childNodes.length == 0) 
        {
            _m_client._con._isPollSending = false;
            return;
        }
        _m_client._con._isPollSending = false;
        _m_client._con._handle_response(xmlDoc, transport.responseText);
    } 
    catch (er) 
    {
        showconsole("Handle REsponse call error : " + er);
    }
};

mundu_communication._send_handler = function(transport)
{
    try 
    {
        var xmlDoc = XMLDocument.get_xml_from_text(transport.responseText);
        if (xmlDoc.childNodes[0].attributes.length > 0) 
        {
            var old_cookie = ReadCookie("SESSTOOLBARMUNDU");
            if (xmlDoc.childNodes[0].attributes[0].nodeName == "session" && (old_cookie != xmlDoc.childNodes[0].attributes[0].nodeValue)) 
            {
                SetCookie("SESSTOOLBARMUNDU", xmlDoc.childNodes[0].attributes[0].nodeValue);
            }
        }
        if (transport.responseText == "" || !xmlDoc || !xmlDoc.childNodes ||
        xmlDoc.childNodes.length == 0 ||
        (xmlDoc.childNodes[0].childNodes[0].tagName == "error" && xmlDoc.childNodes[0].childNodes[0].getAttribute("errtype") == "proxy")) 
        {
            _m_client._con._is_queue_sending = false;
            return;
        }
    } 
    catch (er) 
    {
        showconsole("send_handler : catch " + er);
    }
    _m_client._con._is_queue_sending = false;
    if (_m_client._remove_from_avatar_send_array) 
        _m_client._con._avatar_send_array.shift();
    else 
        _m_client._con._send_array.shift();
    try 
    {
        _m_client._con._handle_response(xmlDoc, transport.responseText);
    } 
    catch (er) 
    {
        showconsole("Handle REsponse call error 1: " + er);
    }
};


mundu_communication._handle_response = function(xmlIn, textIn, first_handler)
{
    var e, el, i, service, username, buddyname;
    var string = (new XMLSerializer()).serializeToString(xmlIn);
    showconsole("RESPONSE XML start ===============================");
    showconsole(string);
    showconsole("RESPONSE XML end   ===============================");
    
    if (this._num_logins == 0) 
    {
        var tmp = xmlIn.getElementsByTagName("buddies");
        if (tmp) 
            this._num_logins = tmp.length;
    }
    e = xmlIn.childNodes[0];
    // this._session = e.attributes.getNamedItem("session").nodeValue;
    // showconsole("in handleresponse this._session"+this._session)
    // SetCookie("sess",e.attributes.getNamedItem("session").nodeValue);
    showconsole("LENGTH OF THE RESPONSE : " + e.childNodes.length);
    for (i = 0; i < e.childNodes.length; i++) 
    {
        var tag = e.childNodes[i].tagName;
        if (!this._is_connected) 
        {
            if (tag == "error") 
            {
                this._on_connect(false);
            }
            else 
            {
                //this._on_connect(true);
                //window.parent._m_client._on_connect(true);
                this._is_connected = true;
            }
        }
        if (_m_client.currentLoginUsername.length > 0) 
            _m_client.updateCounter = i;
        switch (tag)
        {
            case 'response':
                el = e.childNodes[i];
                this._start_poll();
                var type = el.getAttribute("type");
                switch (type)
                {
                    case 'progress':
                        var code = (el.getAttribute("code")) ? el.getAttribute("code") : null;
                        _o_client._on_progress(el.firstChild.data, code);
                        break;
                    case 'error':
                        try 
                        {
                        //this._on_deactivate_spinner();
                        } 
                        catch (er) 
                        {
                            showconsole("ERROR mundu-main-_handel_response() : " + er);
                        }
                        service = (el.getAttribute("im")) ? el.getAttribute("im") : null;
                        username = (el.getAttribute("login")) ? el.getAttribute("login") : null;
                        var errtype = (el.getAttribute("errtype")) ? el.getAttribute("errtype") : null;
                        var errcode = (el.getAttribute("code")) ? el.getAttribute("code") : null;
                        switch (errtype)
                        {
                            case 'fatal':
                                this._num_logins--;
                                if (this._all_services_received_response(service) && this._num_logins <= 0) 
                                {
                                    this._is_loging = false;
                                    this._on_login_complete();
                                    this._services_loging_in = new Array();
                                }
                                this._on_fatal_error(service, username, el.firstChild.data, errcode);
                                break;
                            case 'nonfatal':
                                errcode = parseInt(errcode);
                                if (errcode == 201 || errcode == 202 || errcode == 203 || errcode == 204 || errcode == 205 || errcode == 206 || errcode == 207) 
                                {
                                    this._on_group_non_fatal_error(service, username, el.firstChild.data, errcode, el.getAttribute("group"));
                                }
                                else 
                                {
                                    this._on_non_fatal_error(service, username, el.firstChild.data, errcode);
                                }
                                break;
                            case 'client':
                                this._on_error(el.firstChild.data, errcode);
                                break;
                            default:
                                this._on_error(el.firstChild.data, errcode);
                                break;
                        }
                        break;
                    case 'success':
                        break;
                    default:
                        break;
                }
                break;
            case 'login_form':
                globMenu.appMenuModel.items[2].disabled = true;
                imServerReady = true;
                try 
                {
                    login_this.spinnerModel.spinning = false;
                    login_this.controller.modelChanged(login_this.spinnerModel);
                    login_this.changeAccountListModel('');
                } 
                catch (er) 
                {
                    showconsole("error in callin changeaccountlistmodel : login form case handle : " + er);
                }
                document.getElementById("overlay").style.display = "none";
                this._parse_login_list(e.childNodes[i]);
                break;
            case 'rename':
                el = e.childNodes[i];
                this._on_rename_grouplist(el.getAttribute("im"), el.getAttribute("login"), el.getAttribute("oldgroup"), el.getAttribute("newgroup"), el.getAttribute("name"));
                setTimeout("_m_client._con._start_poll();", 1000);
                break;
            case 'buddies':
                //this._on_loginlist_update();
                try 
                {
                    this._num_logins--;
                    el = e.childNodes[i];
                    service = el.getAttribute("im");
                    username = el.getAttribute("login");
                    _o_client._on_login_success(service, username);
                } 
                catch (er) 
                {
                    showconsole("ERROR mundu-main - _handle_response() (1): " + er);
                }
                this._parse_buddy_list(el);
                var currentScenes = Mojo.Controller.stageController.getScenes();
                var j;
                for (j = 0; j < currentScenes.length; j++) 
                {
                    if (currentScenes[j].sceneName == 'buddies') 
                        break;
                }
                if (j == currentScenes.length) 
                {
                    //calll here the deactivatespinner function
                    try 
                    {
                    //this._on_deactivate_spinner();
                    } 
                    catch (er) 
                    {
                        showconsole("ERROR mundu-main - _handle_response() (2) : " + er)
                    }
                    
                }
                if (this._all_services_received_response(service) && this._num_logins <= 0) 
                {
                    //if(this._num_logins <= 0) {
                    this._is_loging = false;
                    this._on_login_complete(service, username);
                    this._services_loging_in = new Array();
                }
                //setTimeout("_m_client._con._start_poll();", 1000);
                this._start_poll.bind(this).delay(0.2);
                break;
            case 'message':
                el = e.childNodes[i];
                this._on_message(el.getAttribute("im"), el.getAttribute("login"), el.getAttribute("name"), el.firstChild.data, el.getAttribute("time"), el.getAttribute("name"));
                break;
            case 'typing':
                el = e.childNodes[i];
                this._on_typing(el.getAttribute("im"), el.getAttribute("login"), el.getAttribute("name"), el.getAttribute("type"));
                break;
            case 'avatar':
                el = e.childNodes[i];
                var code = (el.getAttribute("code")) ? el.getAttribute("code") : null;
                if (code == 2) 
                {
                    this.insertRosterAvatar(el.getAttribute("im"), el.getAttribute("login"), el.getAttribute("name"), el.childNodes[0].nodeValue);
                    this._on_buddy_avatar(el.getAttribute("im"), el.getAttribute("login"), el.getAttribute("name"), el.childNodes[0].nodeValue);
                }
                break;
            case 'avatarupdate':
                el = e.childNodes[i];
                if (this._is_md5_changed(el.getAttribute("im"), el.getAttribute("login"), el.getAttribute("name"), el.getAttribute('imageMD5'))) 
                {
                    if (el.getAttribute('imageMD5') && el.getAttribute('imageMD5') == "") 
                    {
                        this._on_buddy_avatar(el.getAttribute("im"), el.getAttribute("login"), el.getAttribute("name"), '');
                    }
                    else 
                    {
                        try 
                        {
                                                        //if (_m_client._is_account_logged_in(el.getAttribute("im"), el.getAttribute("login"))) 
                            {
                               var xmlDoc = "<IM_CLIENT><AVATAR im='" + el.getAttribute("im") + "' login='" + el.getAttribute("login") + "' name='" + el.getAttribute("name") + "' filename='' type='get' /></IM_CLIENT>";
                               this._add_to_avatar_queue("POST", null, xmlDoc, false);
                            }
                        } 
                        catch (er) 
                        {
                            showconsole("ERROR IN IS_ACCOUINT_LOGGED IN : " + er);
                        }
                    }
                }
                
                if (((_m_client.updateCounter + 1) >= _m_client.updateLength) && (_m_client.currentLoginUsername.length > 0)) 
                {
                    _m_client.updateLength = 0;
                    _m_client.updateCounter = 0;
                    _m_client.removeFromCurrentLoginUsername(el.getAttribute("im"), el.getAttribute("login"));
                    var currentScenes = Mojo.Controller.stageController.getScenes();
                    var x;
                    for (x = 0; x < currentScenes.length; x++) 
                    {
                        if (currentScenes[x].sceneName == 'buddies') 
                        {
                            break;
                        }
                    }
                    if (x >= currentScenes.length) 
                    {
                    //Mojo.Controller.stageController.assistant.showScene('buddies');
                    }
                }
                
                break;
            case 'update':
                try 
                {
                    if (_m_client.currentLoginUsername.length > 0) 
                    {
                        if (_m_client.updateLength == 0) 
                            _m_client.updateLength = e.childNodes.length;
                    }
                    else 
                    {
                        _m_client.updateLength = 0;
                    }
                } 
                catch (er) 
                {
                    showconsole("mundu-main : handle_response : currentLoginUsername " + er);
                }
                el = e.childNodes[i];
                
                if (el.getAttribute("login") == "" || el.getAttribute("im") == "" || el.getAttribute("name") == "") 
                {
                    return;
                }
                var code = "";
                try 
                {
                    code = (el.getAttribute("code")) ? el.getAttribute("code") : null;
                } 
                catch (er) 
                {
                    showconsole("mundu-main : update case : " + er);
                }
                
                
                try 
                {
                    //var custMess = "";
                    var custMess = (toBeRemovedCustomMessages.indexOf(el.getAttribute("custom")) != -1) ? "" : el.getAttribute("custom");
                    var imageMD5 = (el.getAttribute("imageMD5") == "") ? _m_client._m_buddy_list._buddies[el.getAttribute("im")][el.getAttribute("login")][el.getAttribute("name")].md5 : el.getAttribute("imageMD5");
                    this._on_buddy_update(el.getAttribute("im"), el.getAttribute("login"), el.getAttribute("name"), el.getAttribute("group"), el.getAttribute("status"), custMess, el.getAttribute("blocked"), code, imageMD5, el.getAttribute("nickname"));
                    //this.updateRoster(username, service, el.getAttribute("name"), el.getAttribute("im"), el.getAttribute("nickname"), el.getAttribute("subscription"), el.getAttribute("group"), 127, custMess, el.getAttribute("blocked"), 127, 0, 0, 0, el.getAttribute("imageMD5"),"");
                //this._on_handle_response('update',el.getAttribute("im"), el.getAttribute("login"), el.getAttribute("name"), el.getAttribute("group"), el.getAttribute("status"), el.getAttribute("custom"), el.getAttribute("blocked"), code);
                } 
                catch (er) 
                {
                    showconsole("ERROR mundu-main - _handle_response() update case : " + er)
                }
                break;
            case 'box':
                this._start_box_number = e.childNodes[i].getAttribute("start");
                this._next_box_number = e.childNodes[i].getAttribute("next");
                break;
            case 'referral':
                var referral_sent = e.childNodes[i].getAttribute("progress");
                this._on_all_referral_sent(referral_sent);
                break;
            case 'logout':
                if (e.childNodes[i].getAttribute("im")) 
                {
                    this._on_disconnect(e.childNodes[i].getAttribute("im"), e.childNodes[i].getAttribute("login"));
                }
                else if (e.childNodes[i].getAttribute("timeout")) 
                {
                    var timeout = e.childNodes[i].getAttribute("timeout");
                    this._stop_poll();
                    //Mojo.Controller.errorDialog("Connection Terminated");
                    this._on_disconnect(null, null, timeout);
                    this._start_box_number = 0;
                    this._next_box_number = 1;
                    this._user_status = new Array();
                    this._is_loging = false;
                    this._num_logins = 0;
                    setTimeout("_m_client._con._reset()", 100);
                }
                try 
                {
                    logoutAllInProgress = false;
                    login_this.changeAccountListModel('');
                } 
                catch (er) 
                {
                    showconsole("lgoin this not defined in lgoutcase of mundumain" + er);
                }
                break;
            case 'buddyapprove':
                var service = e.childNodes[i].getAttribute("im");
                var username = e.childNodes[i].getAttribute("login");
                var buddy = e.childNodes[i].getAttribute("name");
                var type = e.childNodes[i].getAttribute("type");
                this._on_friendship(service, username, buddy, type);
                break;
            case 'profile':
                var profile_tag = e.childNodes[i];
                var service;
                if (profile_tag.childNodes[0] && profile_tag.childNodes[0].firstChild && profile_tag.childNodes[0].firstChild.data) 
                {
                    service = profile_tag.childNodes[0].firstChild.data;
                }
                var buddyname;
                if (profile_tag.childNodes[1] && profile_tag.childNodes[1].firstChild && profile_tag.childNodes[1].firstChild.data) 
                {
                    buddyname = profile_tag.childNodes[1].firstChild.data;
                }
                var username;
                if (profile_tag.childNodes[2] && profile_tag.childNodes[2].firstChild && profile_tag.childNodes[2].firstChild.data) 
                {
                    username = profile_tag.childNodes[2].firstChild.data;
                }
                var response_str = textIn;
                var start = response_str.indexOf("<data>");
                var stop = response_str.indexOf("</data>", start);
                var data = response_str.substring(start + 6, stop);
                
                this._on_profile_receive(service, username, buddyname, data);
                break;
            case 'new_instance':
                this.pause();
                var new_instace_flag = true;
                this._on_disconnect(null, null, new_instace_flag);
                this._on_new_instance();
                break;
            case 'remove':
                var service = e.childNodes[i].getAttribute("im");
                var username = e.childNodes[i].getAttribute("login");
                var group = e.childNodes[i].getAttribute("group");
                var buddy = e.childNodes[i].getAttribute("name");
                this._on_remove_buddy(service, username, buddy, group);
                break;
            case 'removegroup':
                var service = e.childNodes[i].getAttribute("im");
                var username = e.childNodes[i].getAttribute("login");
                var group = e.childNodes[i].getAttribute("group");
                this._on_remove_group(service, username, group);
                break;
            case 'move':
                var service = e.childNodes[i].getAttribute("im");
                var username = e.childNodes[i].getAttribute("login");
                var oldgroup = e.childNodes[i].getAttribute("oldgroup");
                var newgroup = e.childNodes[i].getAttribute("newgroup");
                var buddy = e.childNodes[i].getAttribute("name");
                this._on_move_buddy(service, username, oldgroup, newgroup, name);
                break;
            case 'add_buddies': // new_gpm ------ if grp removal is not successful
                var list = e.childNodes[i];
                var k;
                for (k = 0; k < list.childNodes.length; k++) 
                {
                    var e2 = list.childNodes[k];
                    this._on_buddy_receive(e2.getAttribute("im"), e2.getAttribute("login"), e2.getAttribute("name"), e2.getAttribute("group"), e2.getAttribute("status"), e2.getAttribute("custom"), e2.getAttribute("blocked"));
                }
                break;
            case 'rename_group': // new_gpm ------ if grp rename is not successful
                el = e.childNodes[i];
                window.parent._m_client._buddy_list.rename_update_group(el.getAttribute("old_group"), el.getAttribute("new_group"));
                break;
            case 'remove_group': // new_gpm ------ if grp addition is not successful
                var service = e.childNodes[i].getAttribute("im");
                var username = e.childNodes[i].getAttribute("login");
                var group = e.childNodes[i].getAttribute("group");
                this._on_remove_group(service, username, group);
                break;
            case 'move_contact': // new_gpm ------ if move contact is not successful
                var service = e.childNodes[i].getAttribute("im");
                var username = e.childNodes[i].getAttribute("login");
                var oldgroup = e.childNodes[i].getAttribute("old_group");
                var newgroup = e.childNodes[i].getAttribute("new_group");
                var buddy = e.childNodes[i].getAttribute("name");
                //window.parent._m_client._buddy_list.update_buddy_group(service, username, oldgroup, newgroup, buddy);        
                break;
            case 'dnone':
                break;
            default:
                break;
        }
    }
};

mundu_communication._reset = function()
{
    delete this._poll_request;
    this._poll_request = HttpRequest.create();
    
    try 
    {
        if (!checkLoggedIn("")) 
        {
            _m_client._reset_session();
        }
    } 
    catch (er) 
    {
        showconsole(er + " main : _reset");
    }
};

mundu_communication._parse_login_list = function(list)
{
    var i, el;
    _m_client.available_services = new Array();
    for (i = 0; i < list.childNodes.length; i++) 
    {
    
        el = list.childNodes[i];
        if (el.getAttribute("im") != "xmpp") 
        {
            _m_client.available_services[_m_client.available_services.length] = el.getAttribute("im");
            this._on_login_form(el.getAttribute("im"), el.getAttribute("title"), el.getAttribute("image"), el.getAttribute("user"), el.getAttribute("pass"), el.getAttribute("register"), el.getAttribute("forgot"));
        }
    }
    return true;
};

mundu_communication._is_md5_changed = function(service, username, buddyname, md5value)
{
    try 
    {
        if (_m_client._m_buddy_list._buddies[service][username][buddyname].md5 == md5value) 
            return false;
        else 
        {
            _m_client._m_buddy_list._buddies[service][username][buddyname].md5 = md5value;
            this.updateRosterImageMD5(service,username,buddyname,md5value);
            return true;
        }
    } 
    catch (er) 
    {
        showconsole("---------buddies  assistant : is_md5_changed : " + er);
        return false;
    }
}


mundu_communication._parse_buddy_list = function(list)
{
    var i, el;
    var service = list.getAttribute("im");
    var username = list.getAttribute("login");
    var ts = 0;
    _m_client.buddyUpdateListLengthNew = list.childNodes.length;
    try 
    {
        if (login_this.popupIndex && login_this.popupIndex != "") 
        {
            showconsole("Popup  Index : "+login_this.popupIndex);
            showconsole("Popup  Index 1: "+login_this.accountlistmodel.items[login_this.popupIndex]);
            
            if (list.getAttribute("buddylisthash") != login_this.accountlistmodel.items[login_this.popupIndex].buddylisthash) 
            {
                this.updateBuddyListHash(username, service, list.getAttribute("buddylisthash"));
                login_this.accountlistmodel.items[login_this.popupIndex].buddylisthash = list.getAttribute("buddylisthash");
            }
        }
        else 
        {
            this.updateBuddyListHash(username, service, list.getAttribute("buddylisthash"));
            //login_this.activate();
        }
    } 
    catch (er) 
    {
        showconsole("ERror in callin updatebuddylisthash : " + er);
    }
    /*--------a logic that which works when too many updates comes from the server, so the UI for palm-pre is not updated everytime on the fist list of updates but instead at regular interval*/
    if (list.childNodes.length > 999999) 
    {
        _m_client.updateCount = 1;
        _m_client.updateCountLimit = list.childNodes.length;
    }
    /*---check the clientbar on_buddy_update fucntion for that--------*/
    /*--------end of logic that which works when too many updates comes from the server, so the UI for palm-pre is not updated everytime on the fist list of updates but instead at regular interval*/
    for (i = 0; i < list.childNodes.length; i++) 
    {
        el = list.childNodes[i];
        //showconsole ("ELEMENT : " + el);
        if (el.getAttribute("status") == "online") 
            ts++;
        try 
        {
            var custMess = (toBeRemovedCustomMessages.indexOf(el.getAttribute("custom")) != -1) ? "" : el.getAttribute("custom");
            this._on_buddy_receive(service, username, el.getAttribute("name"), el.getAttribute("group"), el.getAttribute("status"), custMess, el.getAttribute("blocked"), el.getAttribute("nickname"), el.getAttribute("imageMD5"));
            /* FOR INSERT TO ROSTER TABLE ===== userid , userservice , contactjid, contactservice, contactalias, contactsubscription, groupname, presencecode, 
             statusmsg, blocked, chatstate, typingstatus, messagerowid, conferencestate, md5image */
            this.insertRoster(username, service, el.getAttribute("name"), el.getAttribute("im"), el.getAttribute("nickname"), el.getAttribute("subscription"), el.getAttribute("group"), 127, custMess, el.getAttribute("blocked"), 127, 0, 0, 0, el.getAttribute("imageMD5"),"");
        } 
        catch (er) 
        {
            showconsole("error in parse_buddy_list " + er);
        }
    }
    
    return true;
};

mundu_communication._start_poll = function()
{
    if (this._is_poll_running) 
        return;
    
    this._is_poll_running = true;
    this._do_poll();
};

mundu_communication._stop_poll = function()
{
    this._is_poll_running = false;
    this._isPollSending = false;
    //showconsole("POOOOLLLLLLLLLLLLLLLLLLLL SENDIN SET TTO FALSE : "+this._is_poll_running);
    if (__browser == "sf") 
        this._poll_request.abort();
};

mundu_communication._do_poll = function()
{
    showconsole("---------do_poll 1 = " + this._is_poll_running);
    try 
    {
        if (!this._isPollSending && this._is_poll_running && !this._is_queue_sending) 
        {
            this._isPollSending = true;
            var domstr = "<IM_CLIENT><REQUEST type='poll' box='" + this._next_box_number + "' /></IM_CLIENT>";
            showconsole("POLL REQUEST");
            showconsole(domstr);
            showconsole("SESSTOOLBARMUNDU COOKIE :" + ReadCookie("SESSTOOLBARMUNDU"));
            
            this._poll_request = new Ajax.Request(this._server, 
            {
                method: "post",
                postBody: domstr,
                //requestHeaders: {"SESSTOOLBARMUNDU": ReadCookie("SESSTOOLBARMUNDU")},
                requestHeaders: ['Cookie', "SESSTOOLBARMUNDU=" + ReadCookie("SESSTOOLBARMUNDU")],
                //requestHeaders: ['Accept-Encoding', "txt"],
                onSuccess: this._poll_handler,
            });
            //this._poll_request.setRequestHeader("Mundu-Customer", __customer_id);
        }
        else 
        {
            //if(this._debug) alert("no poll: running: "+this._is_poll_running+"; sending: "+this._isPollSending+"; queue:"+this._is_queue_sending);
        }
    } 
    catch (er) 
    {
        showconsole("do_poll EXCEPTION : " + er);
    }
    if (this._is_poll_running) 
    {
        //setTimeout("_m_client._con._do_poll()", Mundu_PollInterval);
        this._do_poll.bind(this).delay(0.2);
    }
};

mundu_communication._add_to_queue = function(method, getData, postData, login, req_time)
{
    if (!req_time) 
    {
        req_time = null;
    }
    this._send_array.push(new Array(method, getData, postData, login, req_time));
};
mundu_communication._add_to_avatar_queue = function(method, getData, postData, login, req_time)
{
    if (!req_time) 
    {
        req_time = null;
    }
    this._avatar_send_array.push(new Array(method, getData, postData, login, req_time));
};

mundu_communication._start_send = function()
{
    this._is_queue_sending = false;
    this._send_data();
};

mundu_communication._send_data = function()
{
    try 
    {
        if (!this._is_queue_sending && (this._send_array.length || this._avatar_send_array.length) && !this._is_loging) 
        {
            var data;
            if (this._send_array.length > 0) 
            {
                data = this._send_array[0];
                _m_client._remove_from_avatar_send_array = false;
            }
            else 
            {
                data = this._avatar_send_array[0];
                _m_client._remove_from_avatar_send_array = true;
            }
            
            var query_str = "";
            if (data[1]) 
            {
                //query_str += "?" + data[1];
            }
            this._is_queue_sending = true;
            showconsole('sendDATA : ' + data[2]);
            showconsole("SESSTOOLBARMUNDU COOKIE 1 :" + ReadCookie("SESSTOOLBARMUNDU"));
            this._send_request = new Ajax.Request(this._server + query_str, 
            {
                method: 'post',
                //requestHeaders: {"SESSTOOLBARMUNDU": ReadCookie("SESSTOOLBARMUNDU")},
                requestHeaders: ['Cookie', "SESSTOOLBARMUNDU=" + ReadCookie("SESSTOOLBARMUNDU")],
                //requestHeaders: ['Accept-Encoding', "txt"],
                onSuccess: this._send_handler,
                postBody: data[2]
            });
            
            
            //this._send_request.setRequestHeader("Mundu-Customer", __customer_id);
            this._is_loging = data[3];
        }
        //setTimeout("_m_client._con._send_data()", Mundu_CheckQueueInterval);
        this._send_data.bind(this).delay(0.2);
    } 
    catch (er) 
    {
        showconsole("error in sned_Data call : " + er);
    }
};

// Seters
mundu_communication.set_server = function(server)
{
    this._server = server;
};

mundu_communication.set_poll_interval = function(interval)
{
    Mundu_PollInterval = interval;
};

mundu_communication.set_check_queue_interval = function(interval)
{
    Mundu_CheckQueueInterval = interval;
};

// API
mundu_communication.connect = function(server_path)
{
    //if(server_path)
    //    this._server = server_path;
    this._start_send();
    // if(this._session !="0") 
    //this.get_login_list();
    //else
    SetCookie("SESSTOOLBARMUNDU", "0");
    SetCookie("SESSMUNDU", "0");
    this._add_to_queue("GET", null, null, false);
    return true;
};

mundu_communication.disconnect = function()
{
    this.pause(true);
    this._next_box_number = 0;
    //showconsole("muundu comm disconnect metod");
    this._add_to_queue("GET", null, null, false);
};

mundu_communication.pause = function(st)
{
    if (!st) 
        this._is_paused = true;
    this._is_poll_running = false;
    if (__browser == "sf") 
        this._poll_request.abort();
    this._is_queue_sending = false;
    if (__browser == "sf") 
        this._send_request.abort();
    this._is_connected = false;
};

mundu_communication.start = function()
{
    if (this._is_paused) 
    {
        this._poll_request = HttpRequest.create();
        this._send_request = HttpRequest.create();
        this._is_connected = true;
        this._is_poll_running = false;
    }
    this._is_paused = false;
};

mundu_communication.login = function(aLogin, mode)
{

    /*if (aLogin.length == 0) 
     {
     this._on_deactivate_spinner();
     return false;
     }*/
    //login_this.disableAll();
    var domstr = "";
    var i, res, len;
    this._num_logins = aLogin.length;
    for (i = 0; i < aLogin.length; i++) 
    {
        /*if(aLogin[i][1]=="" || aLogin[i][2]=="")
         return;*/
        len = (rsa_key.n.length / 2) - 2;
        if (aLogin[i][1].length > len || aLogin[i][0].length > len) 
        {
            Mojo.Controller.errorDialog("Lengthy username/password.");
            //this._on_deactivate_spinner();
            return false;
        }
        //this._on_progress("Encrypting passwords...");
        res = this._rsa.encrypt(aLogin[i][2]);
        //res = aLogin[i][2];
        if (aLogin[i][0] == 'xmpp' && aLogin[i][1].match(/@geodesic.com/i)) 
            res = this._rsa.encrypt(MD5(aLogin[i][2]));
        /* else
         res = aLogin[i][2];*/
        var login_mode = (aLogin[i][3]) ? "visible" : "invisible";
        //var login_mode = 'invisible';
        if (aLogin[i][0] == "face") 
            domstr += "<LOGIN im=\"xmpp\" login=\"" + aLogin[i][1] + "\" pass=\"" + res + "\" buddylisthash=\"" + aLogin[i][4] + "\" mode=\"" + login_mode + "\" timeout=\"" + Mundu_SessionTimeout + "\" mech=\"rsa\" />";
        else 
            domstr += "<LOGIN im=\"" + aLogin[i][0] + "\" login=\"" + aLogin[i][1] + "\" pass=\"" + res + "\" buddylisthash=\"" + aLogin[i][4] + "\" mode=\"" + login_mode + "\" timeout=\"" + Mundu_SessionTimeout + "\" mech=\"rsa\" />";
        //domstr += "<LOGIN im=\"" + aLogin[i][0] + "\" login=\"" + aLogin[i][1] + "\" pass=\"" + res + "\" mode=\"" + login_mode + "\" timeout=\"" + Mundu_SessionTimeout + \"" />";
        this._services_loging_in.push(new Array(aLogin[i][0], false));
    }
    domstr = "<IM_CLIENT>" + domstr + "</IM_CLIENT>";
    this._add_to_queue("POST", null, domstr, false);
    
    //this.set_status("13","I am invisible");
    //this.set_status();
    //this._on_progress("Connecting to server...");	
    return true;
};

mundu_communication.for_sso_login = function(SSO_user_accounts)
{
    var domstr = "";
    var i = 0;
    var flag = 0;
    while (this._sso_user_accounts.length > 0) 
    {
        if ((this._sso_user_accounts[i][1] != '') && (this._sso_user_accounts[i][2] != 'undefined') && (!window.parent._m_client._login_list.is_sso_account_in_use(this._sso_user_accounts[i][0], this._sso_user_accounts[i][1]))) 
        {
            domstr += "<LOGIN im=\"" + this._sso_user_accounts[i][0] + "\" login=\"" + this._sso_user_accounts[i][1] + "\" pass=\"" + this._sso_user_accounts[i][2] + "\" mode=\"" + this._sso_user_accounts[i][3] + "\" timeout=\"" + Mundu_SessionTimeout + "\" />";
            this._services_loging_in.push(new Array(this._sso_user_accounts[i][0], false));
            flag = 1;
        }
        this._sso_user_accounts.shift();
    }
    if (flag == 1) 
    {
        domstr = "<IM_CLIENT>" + domstr + "</IM_CLIENT>";
        this._add_to_queue("POST", null, domstr, true);
        this.set_status();
        this._on_progress("Connecting to server...");
        return true;
    }
    else 
        return false;
};

mundu_communication._send_get_contacts = function()
{
    var xmlDoc = "<IM_CLIENT><GET_CONTACTS></GET_CONTACTS></IM_CLIENT>";
    this._add_to_queue("POST", null, xmlDoc, false);
    return true;
};

mundu_communication.manage_service = function(sso_login, sso_pass, service, login, password, visibility, type)
{
    if (!sso_login || !sso_pass) 
        return false;
    if (type == 'add') 
    {
        password = this._rsa.encrypt(password);
    }
    
    var xmlDoc = "<IM_CLIENT><SSO_ACCOUNT sso_login ='" + sso_login + "' sso_pass ='" + sso_pass + "'><SSO_MANAGE im='" + service + "' login='" + login + "' pass='" + password + "' visibility='" + visibility + "' type='" + type + "'/></SSO_ACCOUNT></IM_CLIENT>";
    this._add_to_queue("POST", null, xmlDoc, false);
    /*	if(type=="remove")
     {
     //this.logout(service, login);
     window.parent._m_client.on_logout(service, login);
     }
     */
    return true;
};

mundu_communication.logout = function(service, username)
{
    var domstr = "";
    domstr += "<IM_CLIENT><LOGOUT";
    if (!service) 
    {
        domstr += " im='all' />";
        logoutAllInProgress = true;
    }
    else 
        domstr += " im='" + service + "' login='" + username + "' />";
    domstr += "</IM_CLIENT>";
    
    this._is_loging = false;
    this._add_to_queue("POST", null, domstr, false);
    return true;
};

mundu_communication.send_message = function(service, username, buddyname, message)
{
    if (service.search(/^((yah)|(msn)|(aim)|(jab)|(xmpp)|(icq))$/) < 0) 
        return false;
    if (!username || !buddyname || !message) 
        return false;
    if (service != 'jab' && service != 'xmpp') 
        message = '<font color="#000000">' + message + '</font>';
    var xmlDoc = "";
    message = message.replace(new RegExp("(\r\n)|(\n)", "gi"), "%0A");
    message = xmlSafe(message);
    if (service == "face") 
        xmlDoc += "<IM_CLIENT><MESSAGE im ='xmpp' login ='" + username + "' name ='" + buddyname + "'>" + message + "</MESSAGE></IM_CLIENT>";
    else 
        xmlDoc += "<IM_CLIENT><MESSAGE im ='" + service + "' login ='" + username + "' name ='" + buddyname + "'>" + message + "</MESSAGE></IM_CLIENT>";
    this._add_to_queue("POST", null, xmlDoc, false);
    return true;
};

mundu_communication.send_conference_message = function(service, username, buddyname_array, message, conf_id)
{
    if (service.search(/^((yah)|(msn)|(aim)|(jab)|(xmpp))$/) < 0) 
        return false;
    if (!username || buddyname_array.length <= 0 || !message) 
        return false;
    
    var xmlDoc = "";
    message = message.replace(new RegExp("(\r\n)|(\n)", "gi"), "%0A");
    message = xmlSafe(message);
    xmlDoc += "<IM_CLIENT><CONF hostname='" + username + "' hostservice='" + service + "' id='" + conf_id + "' operation='message'><MESSAGE>" + message + "</MESSAGE></CONF></IM_CLIENT>";
    this._add_to_queue("POST", null, xmlDoc, false);
    return true;
};


mundu_communication.send_signup_request = function(sso_login, sso_pass, sso_username, sso_email, sso_sex, sso_age)
{
    //	PuT the request part here
    if (!sso_login || !sso_pass || !sso_email) 
        return false;
    var xmlDoc = "";
    xmlDoc += "<IM_CLIENT><SSO_REGISTER sso_login ='" + sso_login + "' sso_pass ='" + sso_pass + "' username ='" + sso_username + "' email ='" + sso_email + "' sex ='" + sso_sex + "' age='" + sso_age + "' /></IM_CLIENT>";
    this._add_to_queue("POST", null, xmlDoc, false);
    return true;
};

mundu_communication.send_edit_details_request = function(sso_login, sso_pass, sso_newpass, sso_username, sso_email, sso_sex, sso_age)
{
    //	PuT the request part here
    if (!sso_login || !sso_pass || !sso_newpass || !sso_email) 
        return false;
    var xmlDoc = "";
    xmlDoc += "<IM_CLIENT><SSO_MODIFY sso_login ='" + sso_login + "' sso_old_pass ='" + sso_pass + "' sso_new_pass ='" + sso_newpass + "' username ='" + sso_username + "' email ='" + sso_email + "' sex ='" + sso_sex + "' age='" + sso_age + "' /></IM_CLIENT>";
    this._add_to_queue("POST", null, xmlDoc, false);
    return true;
};

mundu_communication.send_referral = function(customer, landing_page, private_data, msg, url, a_buddies)
{
    if (!a_buddies.length || !customer || !url || !landing_page) 
        return false;
    var i, bud;
    var xmlDoc = XMLDocument.create();
    var xmlDoc = "";
    xmlDoc += "<IM_CLIENT><REFERRAL url ='" + url + "' landing ='" + landing_page + "' customer ='" + customer + "'";
    if (private_data) 
        xmlDoc += " private ='" + private_data + "'>";
    msg = xmlSafe(msg);
    xmlDoc += "<MESSAGE>" + msg + "</MESSAGE>";
    for (i = 0; i < a_buddies.length; i++) 
        xmlDoc += "<BUDDY im ='" + a_buddies[i][0] + "' login ='" + a_buddies[i][1] + "' name ='" + a_buddies[i][2] + "'/>";
    xmlDoc += "</REFERRAL>";
    xmlDoc += "</IM_CLIENT>";
    this._add_to_queue("POST", null, xmlDoc, false);
    this._num_referral++;
    return true;
};

mundu_communication.set_status = function(status_code, status_message, service, username)

{

    if (status_code && status_message) 
        // TODO: 
        this._user_status[0]/*[service+":"+username]*/ = new Array(status_code, status_message);
    else if (this._user_status.length) 
    {
        status_code = this._user_status[0][0];
        status_message = this._user_status[0][1];
    }
    else 
    {
        return;
    }
    var xmlDoc = "<IM_CLIENT><STATUS code=\"" + status_code + "\" custom=\"" + xmlSafe(status_message) + "\" /></IM_CLIENT>";
    this._add_to_queue("POST", null, xmlDoc, false);
    return true;
};
// nivedita_conf_01042008 starts
mundu_communication.conf_accept_request_response = function(login, service, buddyname, buddy_service, operation, conf_id)
{
    if (!service || !login || !buddyname || !buddy_service || !operation || !conf_id) 
        return false;
    var xmlDoc = "<IM_CLIENT><CONF hostname='" + login + "' hostservice='" + service + "' id='" + conf_id + "' operation='" + operation + "'><CONFERENCE im ='" + buddy_service + "' login ='" + login + "'><BUDDY name='" + buddyname + "'/></CONFERENCE></CONF></IM_CLIENT>";
    this._add_to_queue("POST", null, xmlDoc, false);
    return true;
};
// nivedita_conf_01042008 ends
mundu_communication.send_typing_indicator = function(service, username, buddyname, typing_status)
{
    if (service.search(/^((yah)|(msn)|(aim)|(jab)|(xmpp))$/) < 0) 
        return false;
    if (!username || !buddyname || !typing_status) 
        return false;
    
    var xmlDoc = "<IM_CLIENT><TYPING im='" + service + "' login='" + username + "' name='" + buddyname + "' type='" + typing_status + "' /></IM_CLIENT>";
    this._add_to_queue("POST", null, xmlDoc, false);
    return true;
};

mundu_communication.add_buddy = function(service, username, buddyname, group, message, nickname)
{
    if (service.search(/^((yah)|(msn)|(aim)|(jab)|(xmpp)|(icq))$/) < 0) 
        return false;
    if (!username || !buddyname || !group) 
        return false;
    var xmlDoc = "<IM_CLIENT><FRIENDSHIP im ='" + service + "' login ='" + username + "' name ='" + buddyname + "' nickname ='" + nickname + "' type ='" + "add" + "' group ='" + xmlSafe(group) + "' message ='" + message + "' /></IM_CLIENT>";
    this._add_to_queue("POST", null, xmlDoc, false);
    //this._add_to_queue("POST", null, xmlDoc, false);
    this._on_buddy_receive(service, username, buddyname, group, "offline", "Is offline", "no");
    return true;
};

mundu_communication.add_group = function(service, username, group)
{
    if (service.search(/^((yah)|(msn)|(aim)|(jab)|(xmpp)|(icq))$/) < 0) 
        return false;
    if (!username || !group) 
        return false;
    var xmlDoc = "<IM_CLIENT><GROUP im ='" + service + "' login ='" + username + "' type ='" + "add" + "' group ='" + xmlSafe(group) + "' /></IM_CLIENT>";
    this._add_to_queue("POST", null, xmlDoc, false);
    this._on_add_group_receive(group); // setcall backup
    return true;
};

mundu_communication.remove_group = function(group)
{
    if (!group) 
        return false;
    var xmlDoc = "<IM_CLIENT><GROUP type ='" + "remove" + "' group ='" + xmlSafe(group) + "' /></IM_CLIENT>";
    this._add_to_queue("POST", null, xmlDoc, false);
    return true;
};

mundu_communication.move_group = function(service, username, buddyname, group, newgroup)
{
    if (service.search(/^((yah)|(msn)|(aim)|(jab)|(xmpp)|(icq))$/) < 0) 
        return false;
    //if(!group)
    //     return false;
    var xmlDoc = "<IM_CLIENT><GROUP im ='" + service + "' login ='" + username + "' contact ='" + buddyname + "' type ='" + "movecontact" + "' group ='" + xmlSafe(group) + "' newgroup ='" + xmlSafe(newgroup) + "' /></IM_CLIENT>";
    this._add_to_queue("POST", null, xmlDoc, false);
    return true;
};

mundu_communication.rename_group = function(oldgroup, newgroup)
{
    if (!oldgroup || oldgroup == "" || !newgroup || newgroup == "") 
        return false;
    var xmlDoc = "<IM_CLIENT><GROUP type ='" + "rename" + "' group ='" + xmlSafe(oldgroup) + "' newgroup ='" + xmlSafe(newgroup) + "' /></IM_CLIENT>";
    this._add_to_queue("POST", null, xmlDoc, false);
    return true;
};

mundu_communication.show_empty_group = function()
{
    var xmlDoc = "<IM_CLIENT><GROUP type ='" + "showempty" + "' /></IM_CLIENT>";
    this._add_to_queue("POST", null, xmlDoc, false);
    return true;
};

mundu_communication.register_user = function(sso_login, sso_pass, username, email, sex1, age)
{
    if (!sso_login || !sso_pass || !username || !email) 
        return false;
    
    var xmlDoc = "<IM_CLIENT><SSO_REGISTER sso_login ='" + sso_login + "' sso_pass ='" + sso_pass + "' username ='" + username + "' email ='" + email + "' sex ='" + sex1 + "' age ='" + age + "' /></IM_CLIENT>";
    
    this._add_to_queue("POST", null, xmlDoc, false);
    
    return true;
};

mundu_communication.single_signon = function(sso_login, sso_pass, yah_login, yah_pass, yah_inv, msn_login, msn_pass, msn_inv, aol_login, aol_pass, aol_inv, jab_login, jab_pass, jab_inv)
{
    if (!sso_login || !sso_pass) 
        return false;
    var encrypt_yah_pass = "", encrypt_msn_pass = "", encrypt_aol_pass = "", encrypt_jab_pass = "";
    if (yah_pass.length != 0) 
        encrypt_yah_pass = this._rsa.encrypt(yah_pass);
    if (msn_pass.length != 0) 
        encrypt_msn_pass = this._rsa.encrypt(msn_pass);
    if (aol_pass.length != 0) 
        encrypt_aol_pass = this._rsa.encrypt(aol_pass);
    if (jab_pass.length != 0) 
        encrypt_jab_pass = this._rsa.encrypt(jab_pass);
    
    var xmlDoc = "<IM_CLIENT><SSO_ACCOUNT sso_login ='" + sso_login + "' sso_pass ='" + sso_pass + "'>";
    
    if (encrypt_msn_pass.length > 0 && msn_login.length > 0) 
        xmlDoc += "<SSO_MANAGE im='" + "msn" + "' login='" + msn_login + "' pass='" + encrypt_msn_pass + "' visibility='" + msn_inv + "' type='" + "add" + "'/>";
    if (encrypt_yah_pass.length > 0 && yah_login.length > 0) 
        xmlDoc += "<SSO_MANAGE im='" + "yah" + "' login='" + yah_login + "' pass='" + encrypt_yah_pass + "' visibility='" + yah_inv + "' type='" + "add" + "'/>";
    if (encrypt_aol_pass.length > 0 && aol_login.length > 0) 
        xmlDoc += "<SSO_MANAGE im='" + "aim" + "' login='" + aol_login + "' pass='" + encrypt_aol_pass + "' visibility='" + aol_inv + "' type='" + "add" + "'/>";
    if (encrypt_jab_pass.length > 0 && jab_login.length > 0) 
        xmlDoc += "<SSO_MANAGE im='" + "jab" + "' login='" + jab_login + "' pass='" + encrypt_jab_pass + "' visibility='" + jab_inv + "' type='" + "add" + "' />";
    
    //	if(xmlDoc.length > 0)
    //	{
    var xmlDoc_final = "<IM_CLIENT><SSO_ACCOUNT sso_login ='" + sso_login + "' sso_pass ='" + sso_pass + "'>" + xmlDoc;
    xmlDoc_final += "</SSO_ACCOUNT></IM_CLIENT>";
    this._add_to_queue("POST", null, xmlDoc_final, false);
    //	}	
    return true;
};


mundu_communication.get_acc_details_request = function(sso_login, sso_pass)
{
    if (!sso_login || !sso_pass) 
        return false;
    var xmlDoc = "<IM_CLIENT><SSO_GET_USER sso_login ='" + sso_login + "' sso_pass ='" + sso_pass + "' /></IM_CLIENT>";
    this._add_to_queue("POST", null, xmlDoc, false);
};

mundu_communication._on_sso_forgot_pwd = function(sso_login)
{
    if (!sso_login) 
        return false;
    var xmlDoc = "<IM_CLIENT><SSO_FORGOT_PASSWORD sso_login='" + sso_login + "'/></IM_CLIENT>";
    this._add_to_queue("POST", null, xmlDoc, false);
};

mundu_communication._on_sso_get_accounts = function(sso_login, sso_pass)
{
    if (!sso_login || !sso_pass) 
        return false;
    for (var c = 0; c < this._services_loging_in.length; c++) 
    {
        if (this._services_loging_in[c][0] == "sso" && this._services_loging_in[c][1] == false) 
        {
            return;
        }
    }
    
    var xmlDoc = "<IM_CLIENT><SSO_ACCOUNT sso_login ='" + sso_login + "' sso_pass ='" + sso_pass + "'><SSO_GET_ACCOUNTS/></SSO_ACCOUNT></IM_CLIENT>";
    this._add_to_queue("POST", null, xmlDoc, false);
    this._services_loging_in.push(new Array("sso", false));
};
/*--------------------------------------FTP -------------------------------------------*/
mundu_communication.send_file_details = function(service, touser, fromuser, filename)
{
    if (!service || !touser || !fromuser || !filename) 
        return false;
    var xmlDoc = "<IM_CLIENT><FILE im='" + service + "' login='" + fromuser + "' name='" + touser + "' file_name='" + filename + "' file_size='' key='' type='send'/></IM_CLIENT>";
    this._add_to_queue("POST", null, xmlDoc, false);
};
mundu_communication.send_fileRequest_notification = function(im, login, name, filename, filesize, key, type)
{
    if (!im || !login || !name || !filename || (type == "accept" && !key)) 
        return false;
    var xmlDoc = "<IM_CLIENT><FILE im='" + im + "' login='" + login + "' name='" + name + "' file_name='" + filename + "' file_size='" + filesize + "' key='" + key + "' type='" + type + "'/></IM_CLIENT>";
    this._add_to_queue("POST", null, xmlDoc, false);
};

mundu_communication.on_download_file_complete = function(filename, code)
{
    if (!filename || !code) 
        return false;
    var xmlDoc = "<IM_CLIENT><FILE file_name='" + filename + "' code='" + code + "'/></IM_CLIENT>";
    this._add_to_queue("POST", null, xmlDoc, false);
};
//conference
mundu_communication.on_conf_host_leave = function(hostservice, hostname, confID)
{
    if (!hostservice || !hostname || !confID) 
        return;
    
    var xmlDoc = "<IM_CLIENT><CONF hostname='" + hostname + "' hostservice='" + hostservice + "' id='" + confID + "' operation='leave'>";
    xmlDoc += "<CONFERENCE im ='" + hostservice + "' login ='" + hostname + "'  service ='" + hostservice + "' name='" + hostname + "' >";
    xmlDoc += "</CONFERENCE></CONF></IM_CLIENT>";
    this._add_to_queue("POST", null, xmlDoc, false);
    return true;
    
};
mundu_communication.put_initiateconf_request = function(service, login, buddies_invited_for_conf, conf_id, operation)
{
    if (!service || !login || buddies_invited_for_conf.length <= 0) 
        return false;
    
    //var services = window.parent._m_client._login_list._services;
    var services = new Array();
    var servid = new Array();
    if (buddies_invited_for_conf.length != 0) 
    {
        for (m = 0; m < buddies_invited_for_conf.length; m++) 
        {
            //for IE as Array.indexOf does'nt work for IE
            if (!Array.indexOf) 
            {
                Array.prototype.indexOf = function(obj)
                {
                    for (var i = 0; i < this.length; i++) 
                    {
                        if (this[i] == obj) 
                        {
                            return i;
                        }
                    }
                    return -1;
                };
            }
            if ((servid.indexOf(buddies_invited_for_conf[m].serv)) >= 0) 
            {
                continue;
            }
            else 
            {
                services.push(new Array(buddies_invited_for_conf[m].serv, buddies_invited_for_conf[m].user));
                servid.push(buddies_invited_for_conf[m].serv);
            }
        }
    }
    var xmlDoc = "<IM_CLIENT><CONF hostname='" + login + "' hostservice='" + service + "' id='" + conf_id + "' operation='" + operation + "'>";
    for (var i = 0; i < services.length; i++) 
    {
    
        xmlDoc += "<CONFERENCE im ='" + services[i][0] + "' login ='" + services[i][1] + "'>";
        for (var j = 0; j < buddies_invited_for_conf.length; j++) 
        {
            if (services[i][0] == buddies_invited_for_conf[j].serv) 
                xmlDoc += "<BUDDY name='" + buddies_invited_for_conf[j].divId + "'/>";
        }
        xmlDoc += "</CONFERENCE>";
        
        
    }
    xmlDoc += "</CONF></IM_CLIENT>";
    this._add_to_queue("POST", null, xmlDoc, false);
    return true;
};

mundu_communication.approve_buddy = function(service, username, buddyname, group, type)
{
    if (service.search(/^((yah)|(msn)|(aim)|(jab)|(xmpp)|(icq))$/) < 0) 
        return false;
    if (!username || !buddyname) 
        return false;
    var st;
    if (type) 
    {
        st = "authorize";
        //this._on_buddy_receive(service, username, buddyname, group, "offline", "Is offline", "no");
    }
    else 
        st = "deny";
    /*friendship.setAttribute("type", st);
     im.appendChild(friendship);*/
    var xmlDoc = "<IM_CLIENT><FRIENDSHIP im ='" + service + "' login ='" + username + "' name ='" + buddyname + "' group ='" + xmlSafe(group) + "' type='" + st + "'/></IM_CLIENT>";
    this._add_to_queue("POST", null, xmlDoc, false);
    return true;
};

mundu_communication.remove_buddy = function(service, username, buddyname, group)
{
    if (service.search(/^((yah)|(msn)|(aim)|(jab)|(xmpp)|(icq))$/) < 0) 
        return false;
    if (!username || !buddyname) 
        return false;
    
    var xmlDoc = "<IM_CLIENT><FRIENDSHIP im ='" + service + "' login ='" + username + "' name ='" + buddyname + "' group ='" + xmlSafe(group) + "' type ='" + "remove" + "' /></IM_CLIENT>";
    this._add_to_queue("POST", null, xmlDoc, false);
    return true;
};

mundu_communication.rename_buddy_nick = function(service, username, buddyname, nickname)
{
    if (service.search(/^((yah)|(msn)|(aim)|(jab)|(xmpp)|(icq))$/) < 0) 
        return false;
    if (!username || !buddyname) 
        return false;
    var xmlDoc = "<IM_CLIENT><BUDDYRENAME service ='" + service + "' login ='" + username + "' name ='" + buddyname + "'  nick ='" + nickname + "' /></IM_CLIENT>";
    this._add_to_queue("POST", null, xmlDoc, false);
    return true;
};


mundu_communication.get_chat_history = function(service, username, buddyname)
{
    if (service.search(/^((yah)|(msn)|(aim)|(jab)|(xmpp)|(icq))$/) < 0) 
        return false;
    if (!username || !buddyname) 
        return false;
    var xmlDoc = "<IM_CLIENT><CHISTORY im ='" + service + "' login ='" + username + "' name ='" + buddyname + "'  /></IM_CLIENT>";
    this._add_to_queue("POST", null, xmlDoc, false);
    return true;
    
};

mundu_communication.block_buddy = function(service, username, buddyname, group, block)
{
    if (service.search(/^((yah)|(msn)|(aim)|(jab)|(xmpp)|(icq))$/) < 0) 
        return false;
    if (!username || !buddyname) 
        return false;
    
    var xmlDoc = "<IM_CLIENT><FRIENDSHIP im ='" + service + "' login ='" + username + "' name ='" + buddyname + "' group ='" + xmlSafe(group) + "' type ='";
    if (block) 
        xmlDoc += "block";
    else 
        xmlDoc += "unblock";
    
    xmlDoc += "' /></IM_CLIENT>";
    this._add_to_queue("POST", null, xmlDoc, false);
    return true;
};

mundu_communication.get_buddy_list = function(service, username)
{
    //SetCookie("SESSTOOLBARMUNDU","");
    //SetCookie("SESSMUNDU","");
    this._add_to_queue("GET", null, null, false);
    return true;
};

mundu_communication.get_login_list = function()
{

    SetCookie("SESSTOOLBARMUNDU", "0");
    SetCookie("SESSMUNDU", "0");
    this._add_to_queue("GET", "loginform=1", null, false);
};

mundu_communication.set_callback = function(on, to)
{
    if (on == "on_connect") 
        this._on_connect = to;
    else if (on == "on_deactivate_spinner") 
        this._on_deactivate_spinner = to;
    else if (on == "on_status_chagne") 
        this._on_status_change = to;
    else if (on == "on_insertRoster") 
        this.insertRoster = to;
    else if (on == "on_updateRosterImageMD5") 
        this.updateRosterImageMD5 = to
    else if (on == "on_insertRosterAvatar") 
        this.insertRosterAvatar = to;
    else if (on == "on_updateBuddyListHash") 
        this.updateBuddyListHash = to;
    else if (on == "on_retreiveRoster") 
        this.retreiveRoster = to;
    else if (on == "on_login_form") 
        this._on_login_form = to;
    else if (on == "on_message") 
        this._on_message = to;
    else if (on == "on_typing") 
        this._on_typing = to;
    else if (on == "on_status") 
        this._on_status = to;
    else if (on == "on_loginlist_update") 
        this._on_loginlist_update = to;
    else if (on == "on_buddy_receive") 
        this._on_buddy_receive = to;
    else if (on == "on_buddy_update") 
        this._on_buddy_update = to;
    else if (on == "on_buddy_avatar") 
        this._on_buddy_avatar = to;
    else if (on == "on_progress") 
        this._on_progress = to;
    else if (on == "on_error") 
        this._on_error = to;
    else if (on == "on_fatal_error") 
        this._on_fatal_error = to;
    else if (on == "on_non_fatal_error") 
        this._on_non_fatal_error = to;
    else if (on == "on_disconnect") 
        this._on_disconnect = to;
    else if (on == "on_login_success") 
        this._on_login_success = to;
    else if (on == "on_friendship") 
        this._on_friendship = to;
    else if (on == "on_login_complete") 
        this._on_login_complete = to;
    else if (on == "on_all_referral_sent") 
        this._on_all_referral_sent = to;
    else if (on == "on_profile_receive") 
        this._on_profile_receive = to;
    else if (on == "on_new_instance") 
        this._on_new_instance = to;
    else if (on == "on_rename_grouplist") //gpm team
        this._on_rename_grouplist = to;
    else if (on == "on_remove_group") 
        this._on_remove_group = to;
    else if (on == "on_remove_buddy") 
        this._on_remove_buddy = to;
    else if (on == "on_move_buddy") 
        this._on_move_buddy = to;
    else if (on == "on_group_non_fatal_error") 
        this._on_group_non_fatal_error = to;
    else if (on == "on_sso_error") 
        this._on_sso_error = to;
    else if (on == "on_sso_get_user_receive") 
        this._on_sso_get_user_receive = to;
    else if (on == "on_join_conference") //==============JCONF
        this._on_join_conference = to;
    else if (on == "on_conference_message_recvd") 
        this._on_conference_message_recvd = to;
    else if (on == "on_conference_accept_request") // nivedita_conf_01042008
        this._on_conference_accept_request = to;
    else if (on == "on_conference_leave") // leave conf
        this._on_conference_leave = to;
    else if (on == "on_refresh_confbuddy_recieve") // refresh conf
        this._on_refresh_confbuddy_recieve = to;
    else if (on == "on_sso_account_details_new") 
        this._on_sso_account_details_new = to;
    else if (on == "on_add_group_receive") 
        this._on_add_group_receive = to;
    else if (on == "on_register_user") 
        this._on_register_user = to;
    else if (on == "on_sso_forgot_password_receive") 
        this._on_sso_forgot_password_receive = to;
    /*-----------------------FTP -------------------------------------*/
    else if (on == "on_ask_file_request") 
        this._on_ask_file_request = to;
    else if (on == "on_file_received") 
        this._on_file_received = to;
    else if (on == "on_ftp_fatal_error") 
        this._on_ftp_fatal_error = to;
    else if (on == "on_download_complete") 
        this._on_download_complete = to;
    /*-----------------------FTP -------------------------------------*/
    else if (on == "on_address_book_recieve") 
        this._on_address_book_recieve = to;
    else if (on == "on_handle_response") 
        this._on_handle_response = to;
    else 
        return false;
    return true;
};

//Depricated
mundu_communication.get_client_id = function()
{
    return 0;
};

//Depricated
mundu_communication.set_client_id = function(client_id)
{
};

mundu_communication.is_loging = function()
{
    return this._is_loging;
};

mundu_communication._send_debug_to_server = function()
{
    var xmlDoc = "<IM_CLIENT><DEBUG type='fail' event='login' /></IM_CLIENT>";
    this._add_to_queue("POST", null, xmlDoc, false);
};

mundu_communication.get_profile = function(service, username, buddyname)
{
    this._add_to_queue("GET", "profile=1&service=" + service + "&buddyname=" + buddyname + "&login=" + username, null, false);
};

mundu_communication._all_services_received_response = function(service)
{
    var c, done = true;
    for (c = 0; c < this._services_loging_in.length; c++) 
    {
        if (this._services_loging_in[c][0] == service) 
            this._services_loging_in[c][1] = true;
        if (!this._services_loging_in[c][1]) 
            done = false;
    }
    return done;
};

mundu_communication.is_popout_safe = function()
{
    if (this._send_array.length > 0) 
        return false;
    return true;
};

try 
{
    if (!_o_client) 
    {
        try 
        {
            var _o_client = new mundu_client();
        } 
        catch (er) 
        {
            showconsole("pointless : " + er);
        }
    }
    //_o_client.open();
} 
catch (er) 
{
    showconsole("error in creatin _o_client obj" + er);
}


//var munduComm = new mundu_communication();
//munduComm.connect();

try 
{
    _o_client._con.connect();
} 
catch (er) 
{
    showconsole("error in con.connect()" + er);
}

function showconsole(text)
{
    //console.log("LOG ===========" + text + "===============");
    //Mojo.Log.error("LOG ===> " + text);
};



