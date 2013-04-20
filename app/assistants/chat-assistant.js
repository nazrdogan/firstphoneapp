function ChatAssistant(currentBuddyWin)
{
    try 
    {
        //	if(!_m_client._m_buddy_list.last_chat_obj)
        _m_client._m_buddy_list.last_chat_obj = currentBuddyWin;
        var chat_obj;
        this.currentBuddyWin = currentBuddyWin;
    } 
    catch (er) 
    {
        showconsole("errro in constructor of chat-assis" + er);
    }
    var chat_obj;
    this.currentBuddyWin = currentBuddyWin;
    
};
function handleNewBuddyPing(service, buddyname, username, message)
{
    try 
    {
        chat_obj.handleChatSelector(this, buddyname);
        chat_obj.handleChatWindowUpdate(this, service + ":" + username + ":" + buddyname + ":" + message);
    } 
    catch (er) 
    {
        showconsole(er + " is in handleChatWindowUpdate");
    }
}

ChatAssistant.prototype._on_message_receive = function(service, username, buddyname, message, timestamp, sender)
{
    if (sender == chat_obj.buddyName && Mojo.Controller.stageController.assistant.getActiveScene().sceneName == "chat") 
    {
        chat_obj.sendmessage(service, username, buddyname, message, timestamp, sender);
    }
    else 
    {
        //	if(_m_buddy_list.buddy_window[service][username][buddyname].chat_history.lastChild.childNodes[0].innerHTML != "")
        message = _m_buddy_list.buddy_window[service][username][buddyname].chat_history.lastChild.childNodes[0].innerHTML;
        //	else message = message.innerHTML;
        chat_obj.showNotification(this, service, buddyname, username, message);
    }
    try 
    {
        ChatAssistant.prototype._on_typing_update(service, username, buddyname, "");
    }
    catch(er){showconsole("-----error : "+er);}
};

ChatAssistant.prototype._on_status_update = function(service, username, buddyname, group, state, customMessage, blocked)
{
    if (chat_obj) 
    {
        if (chat_obj.service == service && chat_obj.buddyName == buddyname && chat_obj.username == username) 
        {
            chat_obj.state = state;
            chat_obj.customMessage = customMessage;
            
            var xf = username;
            var yf = "";
            if (xf.indexOf("@") != -1) 
                yf = xf.substr(xf.indexOf("@") + 1, xf.length);
            if (yf == "chat.facebook.com") 
                yf = "face";
            
            chat_obj.handleChatSelectorIconPath(chat_obj.service,chat_obj.username,chat_obj.buddyName,chat_obj.state,chat_obj.blocked,yf);
            
            chat_obj.controller.get("buddyImageIcon").className = getIMIconClassName(chat_obj.service, chat_obj.state, chat_obj.blocked, yf);
            if (_m_client._m_buddy_list._buddies[chat_obj.service][chat_obj.username][chat_obj.buddyName].avatar && _m_client._m_buddy_list._buddies[chat_obj.service][chat_obj.username][chat_obj.buddyName].avatar != "R0lGODlhAQABAIAAAP///////yH+FUNyZWF0ZWQgd2l0aCBUaGUgR0lNUAAh+QQBCgABACwAAAAAAQABAAACAkwBADs=") 
            {
                chat_obj.controller.get("chatAvatarImage").src = "data:image/png;base64," + _m_client._m_buddy_list._buddies[chat_obj.service][chat_obj.username][chat_obj.buddyName].avatar;
                chat_obj.controller.get("buddyAvatarIcon").style.display = "";
            }
            else 
            {
                chat_obj.controller.get("buddyAvatarIcon").style.display = "none";
            }
            chat_obj.controller.get("buddyStatusMessage").innerHTML = getUIString(chat_obj.customMessage, 30);
            chat_obj.customMessage = customMessage;
        }
    }
};

ChatAssistant.prototype._on_typing_update = function(service, username, buddyname, type)
{
    if (service == chat_obj.service && buddyname == chat_obj.buddyName && username == chat_obj.username) 
    {
        var istyping = "";
        if (type == "start") 
            istyping = chat_obj.buddyName + " is typing..";
        else if (type == "stop") 
            istyping = chat_obj.buddyName + " has stopped typing.";
        else 
            istyping = "";
        chat_obj.controller.get("isTyping").innerHTML = istyping;
    }
};

ChatAssistant.prototype.setup = function()
{
    globMenu.appMenuModel = 
    {
        visible: true,
        items: [Mojo.Menu.editItem, //must
         {
            label: $L("Preferences"),
            command: "do-Prefs"
        }, 
        {
            label: "Logout All",
            command: 'logoutAll'
        }, 
        {
            label: $L('Chat Options'),
            command: 'do-showChatOptions'
        }, 
        {
            label: $L("About"),
            command: "do-about"
        },
        {
            label: $L("Help"),
            command: "do-help",
            disabled: true
        }]
    };
    
  
    
    this.controller.setupWidget(Mojo.Menu.appMenu, globMenu.MenuAttr, globMenu.appMenuModel);
    this.chatScroller = this.controller.get('chatMsgScroller');
    this.sendmessage = ChatAssistant.prototype.sendmessage;
    this._on_message_receive = ChatAssistant.prototype._on_message_receive;
    this._on_status_update = ChatAssistant.prototype._on_status_update;
    this._on_typing_update = ChatAssistant.prototype._on_typing_update;
    _m_client.setcallback("on_message", this._on_message_receive);
    _m_client.setcallback("on_status", this._on_status_update);
    _m_client.setcallback("on_typing", this._on_typing_update);
    
    this.showChatOptionsList = [
    {
        label: 'Smileys',
        value: 'selectSmiley',
        command: 'do-selectSmiley'
    },    /*{
     label: 'Font',
     value: 'fontStyle',
     command: 'do-fontStyle'
     }*/
    ];
    
    this.smileyList = [
    {
        iconPath: 'images/smile/wink_22x22.png',
        label: 'Wink',
        command: 'do-beatup'
    }, 
    {
        label: 'Big Smile',
        iconPath: 'images/smile/smile_22x22.png',
        command: 'do-bigsmile'
    }, 
    {
        label: 'Surprised',
        iconPath: 'images/smile/suprised_22x22.png',
        command: 'do-ooooh'
    }, 
    {
        label: 'Sad',
        iconPath: 'images/smile/sad_22x22.png',
        command: 'do-sad'
    }, 
    {
        label: 'Smile',
        iconPath: 'images/smile/big_grin_22x22.png',
        command: 'do-smiley'
    }, 
    {
        label: 'Tounge',
        iconPath: 'images/smile/tongue_out_22x22.png',
        command: 'do-tounge'
    }];
    
    
    var chatListData = "";
    
    try 
    {
        for (var buddywinServ in _m_client._m_buddy_list.buddy_window) 
            for (var buddywin in _m_client._m_buddy_list.buddy_window[buddywinServ]) 
                for (var buddy in _m_client._m_buddy_list.buddy_window[buddywinServ][buddywin]) 
                {
                    if (!_m_client._m_buddy_list.buddy_window[buddywinServ][buddywin][buddy].is_closed) 
                    {
                        var dispName = buddy;
                        if (_m_client._m_buddy_list._buddies[buddywinServ][buddywin] && _m_client._m_buddy_list._buddies[buddywinServ][buddywin][buddy]) 
                            if (_m_client._m_buddy_list.buddy_window[buddywinServ][buddywin][buddy].alias != "" && _m_client._m_buddy_list.buddy_window[buddywinServ][buddywin][buddy].alias != "null") 
                                dispName = xmlSafe(_m_client._m_buddy_list.buddy_window[buddywinServ][buddywin][buddy].alias);
                    
                        if (_m_client._m_buddy_list._buddies[buddywinServ][buddywin] && _m_client._m_buddy_list._buddies[buddywinServ][buddywin][buddy]) 
                        {
                            chatListData += "{iconPath: '" + chatSelectorIconPath(buddywinServ, _m_client._m_buddy_list._buddies[buddywinServ][buddywin][buddy].state, _m_client._m_buddy_list._buddies[buddywinServ][buddywin][buddy].blocked, yf) + "', label:$L('" + dispName + "'),value:$L('" + buddywinServ + ":" + buddywin + ":" + buddy + "'),command:'" + buddywinServ + ":" + buddywin + ":" + buddy + "'},";
                        }
                        else 
                            chatListData += "{iconPath: '" + chatSelectorIconPath(buddywinServ, "online", "no", yf) + "', label:$L('" + dispName + "'),value:$L('" + buddywinServ + ":" + buddywin + ":" + buddy + "'),command:'" + buddywinServ + ":" + buddywin + ":" + buddy + "'},"
                        this.lastBuddyAdded = buddy;
                        
                        /*                        
                        chatListData += "{iconPath: 'images/smile/wink_22x22.png', label:$L('" + buddy + "'),value:$L('" + buddywinServ + ":" + buddywin + ":" + buddy + "'),command:$L('" + buddywinServ + ":" + buddywin + ":" + buddy + "')},";
                        this.lastBuddyAdded = buddy;*/
                    }
                }
        if (chatListData == "") 
        {
            globMenu.appMenuModel = 
            {
                visible: true,
                items: [Mojo.Menu.editItem, //must
                 {
                    label: $L("Preferences"),
                    command: "do-Prefs"
                }, 
                {
                    label: "Logout All",
                    command: 'logoutAll'
                }, 
                {
                    label: $L("About"),
                    command: "do-about"
                },
                {
                    label: $L("Help"),
                    command: "do-help",
                    disabled: true
                }]
            };
            this.controller.stageController.assistant.removeScene("chat");
            return;
        }
        var chatListDataJSON = eval("[" + chatListData + "]");
        this.chatChoices = chatListDataJSON;
        chat_obj = this;
        if (this.currentBuddyWin && this.currentBuddyWin != "") 
        {
            try 
            {
                chat_obj.currentBuddyWin = this.currentBuddyWin;
            } 
            catch (er) 
            {
                showconsole("error in initialisin the chat_obj" + er);
            }
        }
        else 
        {
            chat_obj.currentBuddyWin = this.chatChoices[0].value;
        }
        
        chat_obj.service = chat_obj.currentBuddyWin.split(":")[0];
        chat_obj.username = chat_obj.currentBuddyWin.split(":")[1];
        chat_obj.buddyName = chat_obj.currentBuddyWin.split(":")[2];
        
        if (_m_client._m_buddy_list._buddies[chat_obj.service][chat_obj.username] && _m_client._m_buddy_list._buddies[chat_obj.service][chat_obj.username][chat_obj.buddyName]) 
        {
            chat_obj.state = _m_client._m_buddy_list._buddies[chat_obj.service][chat_obj.username][chat_obj.buddyName].state;
            chat_obj.blocked = _m_client._m_buddy_list._buddies[chat_obj.service][chat_obj.username][chat_obj.buddyName].blocked;
            chat_obj.customMessage = _m_client._m_buddy_list._buddies[chat_obj.service][chat_obj.username][chat_obj.buddyName].customMessage;
        }
        else
        {
            chat_obj.state = "online";
            chat_obj.blocked = "no";
            chat_obj.customMessage = "";
            chat_obj.message = chat_obj.currentBuddyWin.split(":")[3]; 
        }
        
        var xf = chat_obj.username;
        var yf = "";
        if (xf.indexOf("@") != -1) 
            yf = xf.substr(xf.indexOf("@") + 1, xf.length);
        if (yf == "chat.facebook.com") 
            yf = "face";
        var dispName = chat_obj.buddyName;
        if (_m_client._m_buddy_list._buddies[chat_obj.service][chat_obj.username] && _m_client._m_buddy_list._buddies[chat_obj.service][chat_obj.username][chat_obj.buddyName]) 
        {
            if (_m_client._m_buddy_list._buddies[chat_obj.service][chat_obj.username][chat_obj.buddyName].alias != "" && _m_client._m_buddy_list._buddies[chat_obj.service][chat_obj.username][chat_obj.buddyName].alias != "null") 
                dispName = xmlSafe(_m_client._m_buddy_list._buddies[chat_obj.service][chat_obj.username][chat_obj.buddyName].alias);
        }
        
        chat_obj.dispName = dispName;
        chat_obj.controller.get('buddyNameHeader').innerHTML = getUIString(chat_obj.dispName.replace(/@[A-Za-z0-9\.]*/i, ""), 20);
        
        
        chat_obj.controller.get("buddyImageIcon").className = getIMIconClassName(chat_obj.service, chat_obj.state, chat_obj.blocked, yf);
        if (_m_client._m_buddy_list._buddies[chat_obj.service][chat_obj.username] && _m_client._m_buddy_list._buddies[chat_obj.service][chat_obj.username][chat_obj.buddyName]) 
        {
            if (_m_client._m_buddy_list._buddies[chat_obj.service][chat_obj.username][chat_obj.buddyName].avatar && _m_client._m_buddy_list._buddies[chat_obj.service][chat_obj.username][chat_obj.buddyName].avatar != "R0lGODlhAQABAIAAAP///////yH+FUNyZWF0ZWQgd2l0aCBUaGUgR0lNUAAh+QQBCgABACwAAAAAAQABAAACAkwBADs=") 
            {
                chat_obj.controller.get("chatAvatarImage").src = "data:image/png;base64," + _m_client._m_buddy_list._buddies[chat_obj.service][chat_obj.username][chat_obj.buddyName].avatar;
                chat_obj.controller.get("buddyAvatarIcon").style.display = "";
            }
            else 
            {
                chat_obj.controller.get("buddyAvatarIcon").style.display = "none";
            }
        }
        chat_obj.controller.get("buddyStatusMessage").innerHTML = getUIString(chat_obj.customMessage, 30);
        
    } 
    catch (er) 
    {
        showconsole("error in startin of chatassist setup " + er);
    }
    
    
    
    this.cmdMenuModel = 
    {
        visible: true,
        items: [
        {
            label: $L('Buddies'), /*iconPath:'images/addBuddy1.png',*/
            command: 'do-feedPrevious'
        }, 
        {
            label: $L('Active-Chats'),
            command: 'do-activeChats'
        }, ]
    };
    
    this.controller.setupWidget(Mojo.Menu.commandMenu, undefined, this.cmdMenuModel);

    this.controller.setupWidget('chatSelector', 
    {
        label: 'Active-Chats',
        secondaryIcon: 'status-away',
        modelProperty: "currentChatBuddy"
    }, this.chatModel = 
    {
        currentChatBuddy: this.lastBuddyAdded,
        choices: this.chatChoices,
        disabled: false
    });
    Mojo.Event.listen(this.controller.get("chatSelector"), Mojo.Event.propertyChange, this.handleChatWindowUpdate.bind(this));
    
    this.controller.setupWidget('sendChatTextArea', this.sendChatAttributes = 
    {
        multiline: true,
        enterSubmits: true,
        emoticons: true,
        limitResize: true,
        requiresEnterKey: true,
        changeOnKeyPress: true,
        focus: true,
        modelProperty: 'original'
    
    }, this.sendChatAreaModel = 
    {
        'original': '',
        value: "",
        win: chat_obj.currentBuddyWin,
        disabled: false
    });
    
    this.controller.setupWidget('ChatTextArea', this.attributes = 
    {
        multiline: true,
        enterSubmits: false,
        emoticons: true,
        focus: false
    }, this.model = 
    {
        value: "",
        win: chat_obj.currentBuddyWin,
        disabled: true
    });
    
    if(Mojo.Environment.DeviceInfo.screenHeight < 480)
        this.controller.get("chatMsgScroller").className = "chat_history_pixi";
    
    Mojo.Event.listen(this.controller.get('sendChatTextArea'), Mojo.Event.propertyChange, this.onsubmit.bind(this));
    Mojo.Event.listen(this.controller.get('sendBtn'), Mojo.Event.tap, this.sendMessage.bind(this));
    Mojo.Event.listen(this.controller.get("closeChatWindow"), Mojo.Event.tap, this.handleWindowClose.bind(this));
    
    //if(chat_obj.message && chat_obj.message != "" && (chat_obj.buddyName == "AOL System Msg" || chat_obj.buddyName == "Aim") && chat_obj.service == "aim" )
    if(chat_obj.message && chat_obj.message != "")
    {
            var msg = __createElement("DIV", "msg");
            msg.innerHTML = chat_obj.message;
            msg.className = 'self';
            // showconsole("message is " + msg.innerHTML + " and class is " + msg.className);
            chat_obj.controller.get("chatTextArea").appendChild(msg);
    }
    else
        chat_obj.handleChatSelector(this, '');
};

ChatAssistant.prototype.sendMessage = function(event)
{
    var message = this.sendChatAreaModel['original'];
    if (message == "") 
        return;
    message = message.replace(/>/gi, "&gt;");
    message = message.replace(/</gi, "&lt;");
    
    var txt = message;
    
    message = message.replace(new RegExp("\\n", "g"), "<br/>");
    message = message.replace(new RegExp("\\r", "g"), "");
    
    var messDiv = __createElement("DIV", "msg");
    messDiv.innerHTML = "<font color='#fd9'>" + message + "</font>";
    
    _m_client._m_buddy_list.buddy_window[chat_obj.service][chat_obj.username][chat_obj.buddyName].set_chat_history(chat_obj.service, chat_obj.username , chat_obj.buddyName, messDiv.innerHTML, '', true, chat_obj.username);
    try 
    {
        chat_obj.sendmessage(chat_obj.service, chat_obj.username, chat_obj.buddyName, message, "", chat_obj.username);
    } 
    catch (er) 
    {
        showconsole(er + "here is the eerror ");
    }
    _m_client._con.send_message(chat_obj.service, chat_obj.username, chat_obj.buddyName, txt);
    
    //this.sendChatAreaModel['value'] = "";
    //event.srcElement.childNodes[5].value = "";
    
    try 
    {
        event.stopPropagation();
        this.controller.get("sendChatTextArea").mojo.setValue("");
        this.controller.get("sendChatTextArea").mojo.focus();
        //event.srcElement.mojo.setValue("");
        //event.srcElement.mojo.focus();
    } 
    catch (er) 
    {
        showconsole(er + "error in focusin the textfield");
    }
    
}

ChatAssistant.prototype.onsubmit = function(event)
{
    // showconsole("in onsbumit event" + this.sendChatAreaModel + "this is event.originalevent.tpy" + event.originalEvent );
    // showconsole(event.originalEvent.keyCode);
    //Mojo.Log.error(chat_obj.controller.get('sendChatTextArea').mojo.getCursorPosition().selectionStart+" start and end "+chat_obj.controller.get('sendChatTextArea').mojo.getCursorPosition().selectionEnd);
    
    try 
    {
        if (event.originalEvent) 
        {
            if (event.originalEvent.type != "keyup") 
                return;
            
            if (event.originalEvent.keyCode != 13) 
                return;
        }
        else
         return;
    } 
    catch (er) 
    {
        showconsole("keyup error is .." + er);
    }
    chat_obj.sendMessage(event);
    return false;
};


ChatAssistant.prototype.handleWindowClose = function(event)
{
    try 
    {
        _m_client._m_buddy_list.buddy_window[chat_obj.service][chat_obj.username][chat_obj.buddyName].is_closed = true;
        this.handleChatSelector(this, '');
        this.handleChatWindowUpdate(this,'',true);
    } 
    catch (er) 
    {
        showconsole("handleWindowClose : " + er);
    }
};

ChatAssistant.prototype.handleWindowCloseNew = function(serv, user, buddy)
{
    try 
    {
        _m_client._m_buddy_list.buddy_window[serv][user][buddy].is_closed = true;
        //chat_obj.handleChatSelector(chat_obj, '');
        //showconsole("coame here");
        //chat_obj.handleChatWindowUpdate(chat_obj);
    } 
    catch (er) 
    {
        showconsole("handleWindowClose : " + er);
    }
};

ChatAssistant.prototype.handleChatSelectorIconPath = function(service,user,buddy,state,blocked,yf)
{
    for (var p = 0; p < chat_obj.chatChoices.length; p++) 
    {
        if (chat_obj.chatChoices[p].value == service + ":" + user + ":" + buddy) 
        {
            chat_obj.chatChoices[p].iconPath = chatSelectorIconPath(service, state, blocked, yf);
            break;
        }
    }
}

ChatAssistant.prototype.handleChatSelector = function(event, newBuddy)
{
    var chatListData = "";
    for (var buddywinServ in _m_client._m_buddy_list.buddy_window) 
        for (var buddywin in _m_client._m_buddy_list.buddy_window[buddywinServ]) 
            for (var buddy in _m_client._m_buddy_list.buddy_window[buddywinServ][buddywin]) 
            {
                if (!_m_client._m_buddy_list.buddy_window[buddywinServ][buddywin][buddy].is_closed) 
                {
                    var xf = buddywin;
                    var yf = "";
                    if (xf.indexOf("@") != -1) 
                        yf = xf.substr(xf.indexOf("@") + 1, xf.length);
                    if (yf == "chat.facebook.com") 
                        yf = "face";
                    
                    var dispName = buddy;
                    if(_m_client._m_buddy_list._buddies[buddywinServ][buddywin] && _m_client._m_buddy_list._buddies[buddywinServ][buddywin][buddy])
                    {
                        if (_m_client._m_buddy_list.buddy_window[buddywinServ][buddywin][buddy].alias != "" && _m_client._m_buddy_list.buddy_window[buddywinServ][buddywin][buddy].alias != "null") 
                            dispName = xmlSafe(_m_client._m_buddy_list.buddy_window[buddywinServ][buddywin][buddy].alias);
                        
                        chatListData += "{iconPath: '" + chatSelectorIconPath(buddywinServ, _m_client._m_buddy_list._buddies[buddywinServ][buddywin][buddy].state, _m_client._m_buddy_list._buddies[buddywinServ][buddywin][buddy].blocked, yf) + "', label:$L('" + dispName + "'),value:$L('" + buddywinServ + ":" + buddywin + ":" + buddy + "'),command:'" + buddywinServ + ":" + buddywin + ":" + buddy + "'},";
                    }
                    else
                        chatListData += "{iconPath: '"+ chatSelectorIconPath(buddywinServ, "online", "no", yf) +"', label:$L('" + dispName + "'),value:$L('" + buddywinServ + ":" + buddywin + ":" + buddy + "'),command:'" + buddywinServ + ":" + buddywin + ":" + buddy + "'},"
                    this.lastBuddyAdded = buddy;
                }
            }
    if (newBuddy && newBuddy != "") 
        this.lastBuddyAdded = newBuddy;
    
    if (chatListData == "" && chat_obj.controller) 
    {
    
        globMenu.appMenuModel = 
        {
            visible: true,
            items: [Mojo.Menu.editItem, //must
             {
                label: $L("Preferences"),
                command: "do-Prefs"
            }, 
            {
                label: "Logout All",
                command: 'logoutAll'
            }, 
            {
                label: $L("About"),
                command: "do-about"
            },
            {
                label: $L("Help"),
                command: "do-help",
                disabled: true
            }]
        };
        chat_obj.controller.stageController.assistant.removeScene("chat");
    }
    
    
    
    var chatListDataJSON = eval("[" + chatListData + "]");
    chat_obj.chatChoices = chatListDataJSON;
    chat_obj.chatModel.choices = chat_obj.chatChoices;
    if (chat_obj.controller) 
        chat_obj.controller.modelChanged(chat_obj.chatModel);
    
    chat_obj.handleChatWindowUpdate(event, event.service + ":" + event.username + ":" + event.buddyName + ":" + "");
};


ChatAssistant.prototype.handleChatTextAreaKeypress = function(event)
{
    var message = event.model.value;
};


ChatAssistant.prototype.handleChatWindowUpdate = function(event, buddyDetails, win_close)
{

    try 
    {
        chat_obj.controller.get("isTyping").innerHTML = "";
        
        if (event.srcElement) 
        {
            chat_obj.currentBuddyWin = event.value;
            chat_obj.chatModel.currentChatBuddy = chat_obj.currentBuddyWin.split(":")[2];
            chat_obj.lastBuddyAdded = chat_obj.currentBuddyWin.split(":")[2];
        }
        else 
        {
            if (buddyDetails && buddyDetails != "") 
            {
                chat_obj.currentBuddyWin = buddyDetails.split(":")[0] + ":" + buddyDetails.split(":")[1] + ":" + buddyDetails.split(":")[2];
                chat_obj.chatModel.currentChatBuddy = chat_obj.currentBuddyWin.split(":")[2];
                chat_obj.lastBuddyAdded = chat_obj.currentBuddyWin.split(":")[2];
            }
            else if(win_close) 
            {
                try 
                {
                    chat_obj.currentBuddyWin = chat_obj.chatModel.choices[0].value;
                    chat_obj.chatModel.currentChatBuddy = chat_obj.currentBuddyWin.split(":")[2];
                    chat_obj.lastBuddyAdded = chat_obj.currentBuddyWin.split(":")[2];
                } 
                catch (er) 
                {
                    showconsole("error in chatModel.choices.value : " + er);
                }
                
            }
        }
        chat_obj.controller.modelChanged(chat_obj.chatModel);
        
        chat_obj.service = chat_obj.currentBuddyWin.split(":")[0];
        chat_obj.username = chat_obj.currentBuddyWin.split(":")[1];
        chat_obj.buddyName = chat_obj.currentBuddyWin.split(":")[2];
        if (_m_client._m_buddy_list._buddies[chat_obj.service][chat_obj.username] && _m_client._m_buddy_list._buddies[chat_obj.service][chat_obj.username][chat_obj.buddyName]) 
        {
            chat_obj.state = _m_client._m_buddy_list._buddies[chat_obj.service][chat_obj.username][chat_obj.buddyName].state;
            chat_obj.blocked = _m_client._m_buddy_list._buddies[chat_obj.service][chat_obj.username][chat_obj.buddyName].blocked;
            chat_obj.customMessage = _m_client._m_buddy_list._buddies[chat_obj.service][chat_obj.username][chat_obj.buddyName].customMessage;
        }
        else
        {
            chat_obj.state = "online";
            chat_obj.blocked = "no";
            chat_obj.customMessage = "";
            chat_obj.message = chat_obj.currentBuddyWin.split(":")[3]; 
        }
        for (var cnt = 0; cnt < chat_obj.controller.get("chatTextArea").childNodes.length; cnt++) 
        {
            delete chat_obj.controller.get("chatTextArea").childNodes[cnt];
        }
        chat_obj.controller.get('chatTextArea').innerHTML = "";
        
        var dispName= chat_obj.buddyName;
        if(_m_client._m_buddy_list._buddies[chat_obj.service][chat_obj.username] && _m_client._m_buddy_list._buddies[chat_obj.service][chat_obj.username][chat_obj.buddyName])
            if (_m_client._m_buddy_list._buddies[chat_obj.service][chat_obj.username][chat_obj.buddyName].alias != "" && _m_client._m_buddy_list._buddies[chat_obj.service][chat_obj.username][chat_obj.buddyName].alias != "null") 
                dispName = xmlSafe(_m_client._m_buddy_list._buddies[chat_obj.service][chat_obj.username][chat_obj.buddyName].alias);
        
        chat_obj.dispName = dispName;
        chat_obj.controller.get('buddyNameHeader').innerHTML = getUIString(chat_obj.dispName.replace(/@[A-Za-z0-9\.]*/i, ""), 20);
        
        var xf = chat_obj.username;
        var yf = "";
        if (xf.indexOf("@") != -1) 
            yf = xf.substr(xf.indexOf("@") + 1, xf.length);
        if (yf == "chat.facebook.com") 
            yf = "face";
        
        //chat_obj.handleChatSelectorIconPath(chat_obj.service,chat_obj.username,chat_obj.buddyName,chat_obj.state,chat_obj.blocked,yf);
        
        chat_obj.controller.get("buddyImageIcon").className = getIMIconClassName(chat_obj.service, chat_obj.state, chat_obj.blocked, yf);
        if (_m_client._m_buddy_list._buddies[chat_obj.service][chat_obj.username][chat_obj.buddyName].avatar && _m_client._m_buddy_list._buddies[chat_obj.service][chat_obj.username][chat_obj.buddyName].avatar != "R0lGODlhAQABAIAAAP///////yH+FUNyZWF0ZWQgd2l0aCBUaGUgR0lNUAAh+QQBCgABACwAAAAAAQABAAACAkwBADs=") 
        {
            chat_obj.controller.get("chatAvatarImage").src = "data:image/png;base64," + _m_client._m_buddy_list._buddies[chat_obj.service][chat_obj.username][chat_obj.buddyName].avatar;
            chat_obj.controller.get("buddyAvatarIcon").style.display = "";
        }
        else 
        {
            chat_obj.controller.get("buddyAvatarIcon").style.display = "none";
        }
        chat_obj.controller.get("buddyStatusMessage").innerHTML = getUIString(chat_obj.customMessage, 30);
        for (var i = 0; i < _m_buddy_list.buddy_window[chat_obj.service][chat_obj.username][chat_obj.buddyName].chat_history.childNodes.length; i++) 
        {
            var msg = __createElement("DIV", "msg");
            /*			if(i==0 && _m_buddy_list.buddy_window[chat_obj.service][chat_obj.username][chat_obj.buddyName].chat_history.childNodes[i].className != "oth")
             {
             var newMessage1 = __createElement("DIV");
             newMessage1.innerHTML = sender;
             newMessage1.className = "oth";
             chat_obj.controller.get("chatTextArea").appendChild(newMessage1);
             }*/
            msg.innerHTML = _m_buddy_list.buddy_window[chat_obj.service][chat_obj.username][chat_obj.buddyName].chat_history.childNodes[i].innerHTML;
            msg.className = _m_buddy_list.buddy_window[chat_obj.service][chat_obj.username][chat_obj.buddyName].chat_history.childNodes[i].className;
            // showconsole("message is " + msg.innerHTML + " and class is " + msg.className);
            chat_obj.controller.get("chatTextArea").appendChild(msg);
        }
        chat_obj.controller.get("chatMsgScroller").mojo.revealBottom();
    } 
    catch (er) 
    {
        showconsole("error caht_obj " + er);
    }
    
};

ChatAssistant.prototype.handleCommand = function(event)
{
    if (event.type == Mojo.Event.command) 
    {
        switch (event.command)
        {
            case 'logoutAll':
                this.handleWindowClose(this);
                /*for (var serv in _m_client.login_list) 
             {
             _m_client.on_logout(serv, _m_client.login_list[serv]["username"]);
             }*/
                _m_client._con.logout();
                _m_client.currentLoginUsername = new Array();
                _m_client.currentLoginUsernameForUI = new Array();
                
                var currentScenes = Mojo.Controller.stageController.getScenes();
                for (var i = 0; i < currentScenes.length ; i++) 
                {
                        Mojo.Controller.stageController.assistant.removeScene(currentScenes[i]);
                }
                
                this.controller.stageController.assistant.showScene('login');
                
                /*this.controller.stageController.assistant.removeScene('buddies');
                this.controller.stageController.assistant.removeScene('login');
                //this.controller.stageController.assistant.showScene('login', true);
                this.controller.stageController.assistant.showScene('login');*/
                break;
                
            case 'do-about':
                this.controller.stageController.assistant.showScene('about');
                break;
                
            case 'do-myAbout':
                this.popupIndex = event.index;
                this.controller.popupSubmenu(
                {
                    onChoose: this.firstpopupHandler,
                    placeNear: event.target,
                    items: [
                    {
                        label: 'All Unread',
                        command: 'feed-unread'
                    }, 
                    {
                        label: 'All Read',
                        command: 'feed-read'
                    }, 
                    {
                        label: 'Edit Feed',
                        command: 'feed-edit'
                    }]
                });
                break;
                
            case 'do-feedPrevious':
                try 
                {
                    _m_client._m_buddy_list.last_chat_obj = chat_obj.currentBuddyWin;
                } 
                catch (er) 
                {
                    showconsole("errro in storin chat_obj" + er);
                }
                
                globMenu.appMenuModel = 
                {
                    visible: true,
                    items: [Mojo.Menu.editItem, //must
                     {
                        label: $L("Preferences"),
                        command: "do-Prefs"
                    }, 
                    {
                        label: "Logout All",
                        command: 'logoutAll'
                    }, 
                    {
                        label: $L("About"),
                        command: "do-about"
                    },
                    {
                        label: $L("Help"),
                        command: "do-help",
                        disabled: true
                    }]
                };
                
                this.controller.stageController.assistant.removeScene("chat");
                break;
                
            case 'do-activeChats':
                
                this.controller.popupSubmenu(
                {
                    onChoose: this.activeChatPopupHandler,
                    placeNear: event.target,
                    items: chat_obj.chatChoices
                });
                
                break;
                
            case 'showhideoffline':
            
                if (buddies_this) 
                    buddies_this.showHideOfflineBuddy();
               // _m_client.prefChanged = !(_m_client.prefChanged);
                
                break;
                
            case 'do-showChatOptions':
                this.controller.popupSubmenu(
                {
                    onChoose: this.showChatOptionsPopupHandler,
                    placeNear: event.target,
                    items: chat_obj.showChatOptionsList
                });
                
            default:
                break;
        }
    }
};

ChatAssistant.prototype.fontStylePopupHandler = function(event)
{

}

ChatAssistant.prototype.smileyPopupHandler = function(event)
{
    try 
    {
        var x = chat_obj.sendChatAreaModel['original'];
        var cursor, p, q;
        var y = x;
        if (x && x != "") 
        {
            cursor = chat_obj.controller.get('sendChatTextArea').mojo.getCursorPosition();
            p = cursor.selectionStart;
            q = cursor.selectionEnd;
        }
        else 
        {
            p = 0;
            q = 0;
        }
        
        switch (event)
        {
            case 'do-smiley':
                y = x.substr(0, p) + ":-)" + x.substr(q);
                break;
                
            case 'do-beatup':
                y = x.substr(0, p) + ";-)" + x.substr(q);
                break;
                
            case 'do-bigsmile':
                y = x.substr(0, p) + ":-D" + x.substr(q);
                break;
                
            case 'do-ooooh':
                y = x.substr(0, p) + ":-O" + x.substr(q);
                break;
                
            case 'do-tounge':
                y = x.substr(0, p) + ":-P" + x.substr(q);
                break;
                
            case 'do-sad':
                y = x.substr(0, p) + ":-(" + x.substr(q);
                break;
                
            default:
                break;
        }
        chat_obj.sendChatAreaModel['original'] = y;
        chat_obj.controller.get('sendChatTextArea').mojo.setCursorPosition(p + 3, p + 3);
        chat_obj.controller.modelChanged(chat_obj.sendChatAreaModel);
    } 
    catch (er) 
    {
        showconsole("EXCE{PT : " + er);
    }
}

ChatAssistant.prototype.showChatOptionsPopupHandler = function(event)
{
    switch (event)
    {
        case 'do-selectSmiley':
            chat_obj.controller.popupSubmenu(
            {
                onChoose: this.smileyPopupHandler,
                placeNear: event.target,
                items: this.smileyList
            });
            break;
            
        case 'do-fontStyle':
            chat_obj.controller.popupSubmenu(
            {
                onChoose: this.fontStylePopupHandler,
                placeNear: event.target,
                items: [
                {
                    //iconPath: 'images/aim.png',
                    label: 'Bold',
                    command: 'do-bold'
                }, 
                {
                    label: 'Italic',
                    //iconPath: 'images/icq.png',
                    command: 'do-itallics'
                }, 
                {
                    label: 'Underline',
                    //iconPath: 'images/icq.png',
                    command: 'do-underline'
                }]
            });
            break;
        default:
            break;
    }
    
    
}

ChatAssistant.prototype.activeChatPopupHandler = function(event)
{
    chat_obj.handleChatWindowUpdate("default", event);
    chat_obj.sendChatAreaModel.value = "";
    chat_obj.sendChatAreaModel.original = "";
    chat_obj.controller.modelChanged(chat_obj.sendChatAreaModel);
    
}



ChatAssistant.prototype.sendmessage = function(service, username, buddyName, message, timestamp, sender)
{
    var d = new Date();
    try 
    {
        if (timestamp) 
        {
            if (timestamp.length < 13) 
                timestamp = timestamp * 1000;
            d.setTime(timestamp);
        }
    } 
    catch (er) 
    {
        showconsole("ERROR chat-assistant-sendMessage() : " + er);
    }
    var ap = " AM";
    hour = d.getHours();
    min = d.getMinutes();
    if (hour > 11) 
    {
        ap = " PM";
    }
    if (hour > 12) 
    {
        hour = hour - 12;
    }
    if (hour == 0) 
    {
        hour = 12;
    }
    if (min < 10) 
    {
        min = "0" + min.toString();
    }
    
    var showtime = hour + ":" + min + ap;
    
    for (var t = 0; t < chat_obj.controller.get("chatTextArea").childNodes.length; t++) 
        chat_obj.controller.get("chatTextArea").removeChild(chat_obj.controller.get("chatTextArea").childNodes[t]);
    try 
    {
        chat_obj.controller.get('chatTextArea').innerHTML = "";
    } 
    catch (er) 
    {
        showconsole("chat_obj is not ther mann" + er);
    }
    for (var i = 0; i < _m_buddy_list.buddy_window[service][username][buddyName].chat_history.childNodes.length; i++) 
    {
        var newMessage = __createElement("DIV", "msg");
        newMessage.innerHTML = _m_buddy_list.buddy_window[service][username][buddyName].chat_history.childNodes[i].innerHTML;
        newMessage.className = _m_buddy_list.buddy_window[service][username][buddyName].chat_history.childNodes[i].className;
        chat_obj.controller.get("chatTextArea").appendChild(newMessage);
    }
    try 
    {
        chat_obj.controller.get("chatMsgScroller").mojo.revealBottom();
    } 
    catch (er) 
    {
        showconsole("revealBottom is creatin probs " + er);
    }
};


ChatAssistant.prototype.activate = function(event)
{
    try 
    {
        chat_obj.controller.get("chatMsgScroller").mojo.revealBottom();
    } 
    catch (er) 
    {
        showconsole("---+++" + er);
    }
}


ChatAssistant.prototype.deactivate = function(event)
{
try 
    {
        if (_m_client.prefChanged) 
        {
             var currentScenes = Mojo.Controller.stageController.getScenes();
             var i;
             for (i = 0 ; i < currentScenes.length - 2 ; i++) 
             {
                   Mojo.Controller.stageController.assistant.removeScene(currentScenes[i]);
             }
             Mojo.Controller.stageController.assistant.showScene({'name': 'buddies',transition: Mojo.Transition.crossFade});
             _m_client.prefChanged = false;
        }
    } 
    catch (er) 
    {
        showconsole("error in deactivate of pref : " + er);
    }
}

ChatAssistant.prototype.cleanup = function(event)
{
    /* this function should do any cleanup needed before the scene is destroyed as 
     a result of being popped off the scene stack */
    /*	 Mojo.Event.stopListening(this.controller.get('chatSelector'), Mojo.Event.propertyChange, this.handleChatWindowUpdate.bind(this));
     delete this.chatChoices;*/
};

ChatAssistant.prototype.showNotification = function(event, service, buddyname, username, message)
{
    try 
    {
        var parsed_mess = message;
        var sender_val = buddyname;
        
        if (_m_client._m_buddy_list._buddies[service][username][buddyname].alias && _m_client._m_buddy_list._buddies[service][username][buddyname].alias != "" && _m_client._m_buddy_list._buddies[service][username][buddyname].alias != "null") 
                    sender_val = _m_client._m_buddy_list._buddies[service][username][buddyname].alias;
        if(message.indexOf("<font") != -1 || message.indexOf("<FONT") != -1)
            parsed_mess = (new DOMParser()).parseFromString(message,"text/xml").childNodes[0].childNodes[0].textContent;
            
        if (sender_val && sender_val.length > 12 && sender_val.length > 0) 
        {
            sender_val = sender_val.substring(0, 10) + '..';
        }
        Mojo.Controller.getAppController().showBanner({messageText: sender_val + " says.. " + parsed_mess}, "launchArguments", "myCategory");
    } 
    catch (er) 
    {
        showconsole(er + "chatassis : shownotification : ");
    }
    
    
    try 
    {
        var appController = Mojo.Controller.getAppController();
        var stageName = "notification";
        var dashboardStage = appController.getStageProxy(stageName);
        
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
                //height: 20
            }, f, 'dashboard');
        }
        else 
        {
            //dashboardStage.setAlertSound("dtmf_0");
            dashboardStage.delegateToSceneAssistant("testDashboard", service, buddyname, username, message);
        }
        /*		Mojo.Controller.getAppController().showBanner("Dave? Dave? What are you doing, Dave?", 
         {source: 'notification'});*/
    } 
    catch (er) 
    {
        showconsole(er + "error in show notification fun");
    }
};


