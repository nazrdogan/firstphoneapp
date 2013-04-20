function BuddiesAssistant()
{
    this.count = 0;
    this.searchstr = "";
    var buddies_this;
    this.showOffline = _m_client.showOfflineBuddy;
    this.showGroupFlag = new Array();
    this.userStatus = "I am online";
    this.customMessage = _m_client.customMessage;
    this.statusCode = 1;
    this.buddyCount = 0;
    this.db = openDatabase('munduIMDB', '1', '', null);
    this.buddies_populated_counter = 0;
}

BuddiesAssistant.prototype.setup = function()
{
    var dispText;
    if (_m_client.showOfflineBuddy) 
        dispText = "Hide Offline Buddies";
    else 
        dispText = "Show Offline Buddies";
    
    globMenu.appMenuModel = 
    {
        visible: true,
        items: [Mojo.Menu.editItem, //must
         {
            label: $L("Preferences"),
            command: "do-Prefs"
        }, 
        {
            label: "Add Buddy",
            command: 'do-addBuddy'
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
    
    this.controller.setupWidget(Mojo.Menu.appMenu, globMenu.MenuAttr, globMenu.appMenuModel);
    //this.controller.setupWidget(Mojo.Menu.appMenu, {}, this.appMenuModel);
    /*for( a in this.controller.stageController.getAppController())
     showconsole(a);*/
    this.searchFor = "";
    
    var listStatusData = "";
    for (var cnt = 0; cnt < _status_message[_current_language].length; cnt++) 
    {
        listStatusData += "{label:$L('" + _status_message[_current_language][cnt][0] + "'),secondaryIconPath:$L('images/status-" + _status_message[_current_language][cnt][2] + ".png'),command:'" + cnt + "'},";
    }
    try 
    {
        this.availabilities = eval("[" + listStatusData + "]");
    } 
    catch (er) 
    {
        showconsole(er + "uis the erroir in statuslistdata");
    }
    
    try 
    {
        buddies_this = this;
        buddies_this.listWidget = this.controller.get('buddyList');
        _m_client.setcallback("for_buddy_update", this._for_buddy_update);
        _m_client.setcallback("for_buddy_update_new", this._for_buddy_update_new);
        _m_client.setcallback("for_buddy_avatar", this._for_buddy_avatar);
        _m_client.setcallback("change_logoutlist_model", this.changeLogoutListModel);
        try 
        {
            buddies_this.buddies = new Array();
            for (var service in _m_client.login_list) 
            {
                var username = _m_client.login_list[service]["username"];
                for (var k = 0; k < _m_client.login_list[service]['count'].length; k++) 
                {
                    username = _m_client.login_list[service]['count'][k];
                    var xf = username;
                    var yf = "";
                    if (xf.indexOf("@") != -1) 
                        yf = xf.substr(xf.indexOf("@") + 1, xf.length);
                    if (yf == "chat.facebook.com") 
                        yf = "face";
                    
                    for (var buddy in _m_client._m_buddy_list._buddies[service][username]) 
                    {
                        var buddy1 = new Array();
                        buddy1["service"] = service;
                        buddy1["user"] = username;
                        buddy1["buddy"] = buddy;
                        
                        buddy1["customMessage"] = _m_client._m_buddy_list._buddies[service][username][buddy].customMessage;
                        buddy1["state"] = _m_client._m_buddy_list._buddies[service][username][buddy].state;
                        //showconsole("here");
                        buddy1["alias"] = xmlSafe(_m_client._m_buddy_list._buddies[service][username][buddy].alias);
                        var dispName;
                        if (buddy1['alias'] != "" && buddy1['alias'] != "null") 
                            dispName = buddy1["alias"];
                        else 
                            dispName = buddy.replace(/@gmail.com/i, "");
                        
                        buddy1['dispName'] = dispName;
                        buddy1["blocked"] = _m_client._m_buddy_list._buddies[service][username][buddy].blocked;
                        buddy1["group"] = xmlSafe(_m_client._m_buddy_list._buddies[service][username][buddy].group);
                        //showconsole("here1");
                        buddy1["win_name"] = service + ":" + username + ":" + buddy;
                        
                        buddy1["imgClass"] = getIMIconClassName(service, buddy1["state"], buddy1["blocked"], yf);
                        //showconsole("here2");
                        if (_m_client._m_buddy_list._buddies[service][username][buddy].avatar) 
                            buddy1["avatar"] = "data:image/png;base64," + _m_client._m_buddy_list._buddies[service][username][buddy].avatar;
                        else 
                            buddy1["avatar"] = "data:image/png;base64,R0lGODlhAQABAIAAAP///////yH+FUNyZWF0ZWQgd2l0aCBUaGUgR0lNUAAh+QQBCgABACwAAAAAAQABAAACAkwBADs=";
                        if (!_m_client._m_buddy_list._buddies[service][username][buddy].avatar || (_m_client._m_buddy_list._buddies[service][username][buddy].avatar && (_m_client._m_buddy_list._buddies[service][username][buddy].avatar == "" || _m_client._m_buddy_list._buddies[service][username][buddy].avatar == "R0lGODlhAQABAIAAAP///////yH+FUNyZWF0ZWQgd2l0aCBUaGUgR0lNUAAh+QQBCgABACwAAAAAAQABAAACAkwBADs="))) 
                            buddy1["avatarFrame"] = "none";
                        else 
                            buddy1["avatarFrame"] = "";
                        
                        buddies_this.buddies[buddies_this.buddies.length] = new Array(buddy1);
                        //Mojo.Log.error("THIS IS ADDED : "+buddy1['buddy']);
                    }
                }
            }
        } 
        catch (er) 
        {
            showconsole("buddies-assis setup in makin buddies array : " + er);
        }
        for (var i = 0; i < buddies_this.buddies.length; i++) 
            for (var j = i; j < buddies_this.buddies.length; j++) 
                if (buddies_this.buddies[i][0]["group"] > buddies_this.buddies[j][0]["group"]) 
                {
                    var temp = buddies_this.buddies[i];
                    buddies_this.buddies[i] = buddies_this.buddies[j];
                    buddies_this.buddies[j] = temp;
                }
        var listData = "";
        var groups = new Array;
        var prevgrp = "";
        this.widgets = new Array();
        //for (var i = 0; i < (100 > buddies_this.buddies.length ? buddies_this.buddies.length : 100); i++)
        for (var i = 0; i < buddies_this.buddies.length; i++) 
        {
            this.buddies_populated_counter++;
            if (!(!this.showOffline && buddies_this.buddies[i][0]["state"] == "offline")) 
            {
                //listData += "{category:$L('" + buddies[i][0]["group"] + "'),avatarFrame:$L('" + buddies[i][0]["avatarFrame"] + "'),avatar:$L('" + buddies[i][0]["avatar"] + "'),buddyOptionClass:$L('feedlist-info icon right'),buddyClass:$L(''),name:$L('" + getUIString(buddies[i][0]["buddy"], 15) + "'),displayName:$L('" + getUIString(buddies[i][0]["dispName"], 15) + "'),scene:$L(''),value:'" + buddies[i][0]["win_name"] + "',buddyImageIcon:$L('" + buddies[i][0]["imgClass"] + "'),personalMessage:$L('" + xmlSafe(buddies[i][0]["customMessage"]) + "')},";
                //var listData1 = "{category:$L('" + buddies[i][0]["group"] + "'),avatarFrame:$L('" + buddies[i][0]["avatarFrame"] + "'),avatar:$L('" + buddies[i][0]["avatar"] + "'),buddyOptionClass:$L('feedlist-info icon right'),buddyClass:$L(''),name:$L('" + getUIString(buddies[i][0]["buddy"], 15) + "'),displayName:$L('" + getUIString(buddies[i][0]["dispName"], 15) + "'),scene:$L(''),value:'" + buddies[i][0]["win_name"] + "',buddyImageIcon:$L('" + buddies[i][0]["imgClass"] + "'),personalMessage:$L('" + xmlSafe(buddies[i][0]["customMessage"]) + "')},";
                //showconsole(listData1);
                this.widgets[this.widgets.length] = 
                {
                    category: buddies_this.buddies[i][0]["group"],
                    avatarFrame: buddies_this.buddies[i][0]["avatarFrame"],
                    avatar: buddies_this.buddies[i][0]["avatar"],
                    buddyOptionClass: 'feedlist-info icon right',
                    buddyClass: '',
                    name: buddies_this.buddies[i][0]["buddy"],
                    displayName: getUIString(buddies_this.buddies[i][0]["dispName"], 15),
                    value: buddies_this.buddies[i][0]["win_name"],
                    buddyImageIcon: buddies_this.buddies[i][0]["imgClass"],
                    personalMessage: xmlSafe(buddies_this.buddies[i][0]["customMessage"]),
                };
            }
        }
        /*try 
         {
         showconsole(listData);
         var temp = eval("[" + listData + "]");
         this.widgets = temp;
         }
         catch (er)
         {
         showconsole("error in eval in the setup " + er);
         this.widgets = [
         {
         category: $L('Buddies'),
         directory: $L(''),
         name: $L('please try again'),
         scene: $L('')
         }, ];
         }*/
        this.gotFilter = this.gotFilter.bind(this);
        this.controller.setupWidget('buddyList', 
        {
            itemTemplate: 'buddies/listitem',
            swipeToDelete: true,
            dividerTemplate: 'buddies/divider',
            dividerFunction: this.dividerFunc.bind(this),
            reorderable: false,
            fixedHeightItems: true,
            renderLimit: 20,
            lookahead: 15,
            itemsCallback: this.itemsCallback.bind(this),
            filterFunction: this.filterBuddies.bind(this),
            delay: 1000
        }, this.buddylistmodel = 
        {
            items: this.widgets
        });
        
        /*--------------------command menu starts here--------------------*/
        this.cmdMenuModel = 
        {
            visible: true,
            items: [
            {
                items: [
                {
                    label: $L('Home'), /*iconPath:'images/addBuddy1.png',*/
                    command: 'do-feedPrevious'
                }]
            }, 
            {
                items: [
                {
                    label: $L('Chat'), /*iconPath:'images/addBuddy1.png',*/
                    command: 'do-feedNext',
                    disabled: true
                }]
            }, ]
        };
        this.controller.setupWidget(Mojo.Menu.commandMenu, undefined, this.cmdMenuModel);
    } 
    catch (wer) 
    {
        showconsole(wer + "is the erron in logout list makin");
    }
    
    
    /*this.serachTextAreaAttributes = 
     {
     textFieldName: "searchTextAreaElement",
     multiline: false,
     focus: true,
     enterSubmits: false,
     modelProperty: "value",
     focusMode: Mojo.Widget.focusSelectMode,
     };
     
     this.controller.setupWidget('searchTextArea', this.searchTextAreaAttributes, this.searchTextAreaModel =
     {
     value: 'helloSearch',
     disabled: false
     });
     */
    Mojo.Event.listen(this.controller.get('main'), Mojo.Event.tap, this.handleTopCall.bind(this));
    //Mojo.Event.listen(this.controller.get('customMessageTextWidget'), Mojo.Event.propertyChange, this.handleStatusSelection.bind(this));
    //Mojo.Event.listen(this.controller.get('AvailabilityPicker'), Mojo.Event.tap, this.showAvailabilityOptions.bind(this));
    Mojo.Event.listen(this.controller.get("buddyList"), Mojo.Event.listTap, this.handleChatCall.bind(this));
    Mojo.Event.listen(this.controller.get('buddyList'), Mojo.Event.filter, this.gotFilter, true);
    //Mojo.Event.listen(this.controller.get("buddyList"), Mojo.Event.tap, this.showGroupList.bind(this));
    //this.controller.listen(("buddyList"), Mojo.Event.tap, this.showGroupList.bind(this));
    this.controller.listen('buddyList', Mojo.Event.listReorder, this.listReorder.bindAsEventListener(this));
    this.controller.listen(this.controller.sceneElement, Mojo.Event.keyup, this.handleKeyUpEvent.bindAsEventListener(this));
    this.controller.listen('buddyList', Mojo.Event.listDelete, this.listDelete.bindAsEventListener(this));
    //this._for_buddy_update("");
    //this.setCustomMessageHintText(); //setup the custom message
    this.controller.setInitialFocusedElement(null);
    
    
    
    //showconsole("-------ID of the AVATAR---------"+this.controller.get);
    //keep online from palm pre as default status 
    //buddies_this.handleStatusSelection(_m_client.customMessage);
};


BuddiesAssistant.prototype.handleTopCall = function(event)
{
    //buddies_this.controller.get("buddyList").mojo.revealTop();
    buddies_this.controller.getSceneScroller().mojo.revealTop(true);
}

BuddiesAssistant.prototype.gotFilter = function(event)
{
    if (event.filterString == "") 
    {
        buddies_this.controller.get("main").style.display = "";
        buddies_this.controller.get("spacer").style.display = "";
    }
    else 
    {
        buddies_this.controller.get("main").style.display = "none";
        buddies_this.controller.get("spacer").style.display = "none";
    }
}

BuddiesAssistant.prototype.filterBuddies = function(filterString, listWidget, offset, count)
{
    if (!filterString) 
    {
        this.filter = filterString;
        buddies_this.itemsCallback(listWidget, offset, count);
        return;
    }
    var subset = [];
    var totalSubsetSize = 0;
    var i = 0;
    
    if (!_m_client.showOfflineBuddy) 
    {
        buddies_this._make_buddies();
        while (i < buddies_this._searched_buddies.length) 
        {
        
            if (buddies_this._searched_buddies[i].displayName.include(filterString) ||
            buddies_this._searched_buddies[i].name.include(filterString)) 
            {
                if (subset.length < count && totalSubsetSize >= offset) 
                {
                    subset.push(buddies_this._searched_buddies[i]);
                }
                totalSubsetSize++;
            }
            i++;
        }
    }
    else 
    {
        while (i < buddies_this.buddylistmodel.items.length) 
        {
        
            if (buddies_this.buddylistmodel.items[i].displayName.include(filterString) ||
            buddies_this.buddylistmodel.items[i].name.include(filterString)) 
            {
                if (subset.length < count && totalSubsetSize >= offset) 
                {
                    subset.push(buddies_this.buddylistmodel.items[i]);
                }
                totalSubsetSize++;
            }
            i++;
        }
    }
    
    //update the items in the list with the subset
    listWidget.mojo.noticeUpdatedItems(offset, subset);
    
    //set the list's lenght & count if we're not repeating the same filter string from an earlier pass
    if (this.filter !== filterString) 
    {
        listWidget.mojo.setLength(totalSubsetSize);
        listWidget.mojo.setCount(totalSubsetSize);
    }
    this.filter = filterString;
    
}


BuddiesAssistant.prototype.itemsCallback = function(listWidget, offset, count)
{
    /*Mojo.Log.error($L("offset = ") + offset);
     Mojo.Log.error($L("count = ") + count);
     Mojo.Log.error($L("buddies_lenght = ") + buddies_this.buddies.length);*/
    if ((offset > 50) && (buddies_this.buddylistmodel.items.length < buddies_this.buddies.length)) 
    {
        try 
        {
            buddies_this.buddylistmodel.items.push.apply(buddies_this.buddylistmodel.items, buddies_this.makeItems(count, buddies_this.buddies_populated_counter));
        } 
        catch (er) 
        {
            showconsole("-------exception : " + er);
        }
    }
    listWidget.mojo.noticeUpdatedItems(offset, buddies_this.buddylistmodel.items.slice(offset, offset + count));
    listWidget.mojo.setLength(buddies_this.buddylistmodel.items.length);
}

BuddiesAssistant.prototype.makeItems = function(howMany, offset)
{
    var i;
    var items = [];
    for (i = 0; i < howMany; i++) 
    {
    
        if (!(!buddies_this.showOffline && buddies_this.buddies[i + offset][0]["state"] == "offline")) 
        {
            items.push(
            {
                category: buddies_this.buddies[i + offset][0]["group"],
                avatarFrame: buddies_this.buddies[i + offset][0]["avatarFrame"],
                avatar: buddies_this.buddies[i + offset][0]["avatar"],
                buddyOptionClass: 'feedlist-info icon right',
                buddyClass: '',
                name: buddies_this.buddies[i + offset][0]["buddy"],
                displayName: getUIString(buddies_this.buddies[i + offset][0]["dispName"], 15),
                value: buddies_this.buddies[i + offset][0]["win_name"],
                buddyImageIcon: buddies_this.buddies[i + offset][0]["imgClass"],
                personalMessage: xmlSafe(buddies_this.buddies[i + offset][0]["customMessage"]),
            });
        }
    }
    
    return items;
}

BuddiesAssistant.prototype.changeLogoutListModel = function(event)
{
    try 
    {
        /*var logoutlist = "";
         for (var service in _m_client.login_list)
         {
         logoutlist += "{label:$L('" + getIMService(service) + "'), value:$L('" + service + "')},";
         }
         logoutlist += "{label:$L('" + _client_labels[_current_language][13] + "'), value:$L('all')},";
         buddies_this.logoutChoices = eval("[" + logoutlist + "]");
         buddies_this.logoutListModel.choices = buddies_this.logoutChoices;
         buddies_this.logoutListModel.value = _client_labels[_current_language][13];*/
        // buddies_this.controller.modelChanged(buddies_this.logoutListModel);
        //buddies_this.controller.get('logoutSelector').innerHTML = _client_labels[_current_language][13];
    } 
    catch (er) 
    {
        showconsole(er + " this is the errron in modelchange of account lsit");
    }
};

BuddiesAssistant.prototype.showGroupList = function(event)
{
    try 
    {
        buddies_this._for_buddy_update('', event.item.category);
    } 
    catch (er) 
    {
        showconsole(er + " is the errro in showGroupList");
    }
};

BuddiesAssistant.prototype.listDelete = function(event)
{

    var tempDetails = event.item.value.split(":");
    
    _m_client._con.remove_buddy(tempDetails[0], tempDetails[1], tempDetails[2], event.item.category);
    _m_client._m_buddy_list.remove_buddy(tempDetails[0], tempDetails[1], tempDetails[2]);
    
};

BuddiesAssistant.prototype.listReorder = function(event)
{
    try 
    {
        var f = this.buddyListModel.items[event.fromIndex];
        var t = this.buddyListModel.items[event.toIndex];
        this.buddyListModel.items[event.fromIndex] = t;
        this.buddyListModel.items[event.toIndex] = f;
    } 
    catch (er) 
    {
        showconsole("error in listreoderin " + er);
    }
};

BuddiesAssistant.prototype.showHideOfflineBuddy = function(event)
{
    if (_m_client.showOfflineBuddy == false) 
    {
        this.showOffline = true;
        _m_client.showOfflineBuddy = true;
        //buddies_this.appMenuModel.items[0].label = "Hide Offline Buddies";
        //buddies_this.controller.modelChanged(buddies_this.appMenuModel);
    }
    else 
    {
        this.showOffline = false;
        _m_client.showOfflineBuddy = false;
        //buddies_this.appMenuModel.items[0].label = "Show Offline Buddies";
        //buddies_this.controller.modelChanged(buddies_this.appMenuModel);
    }
    
    
    //buddies_this._for_buddy_update("");
};

/*BuddiesAssistant.prototype.showAvailabilityOptions = function(event)
 {
 this.controller.popupSubmenu(
 {
 onChoose: this.handleAvailabilitySelection,
 // toggleCmd: this.Messaging.Availability.getAvailabilityAsConstText(this.currentAvailability),
 placeNear: event.target,
 items: this.availabilities
 });
 
 };
 */
/*
 BuddiesAssistant.prototype.handleAvailabilitySelection = function(event)
 {
 if (event == 'undefined')
 return;
 if (event && event != "")
 {
 //if (_status_message[_current_language][event][1] == 'Custom message')
 //this.handleStatusSelection();
 if (_status_message[_current_language][event][2] == 'invisible')
 this.controller.get('presenceicon').className = 'icon status-' + 'offline';
 else
 this.controller.get('presenceicon').className = 'icon status-' + _status_message[_current_language][event][2]
 this.userStatus = _status_message[_current_language][event][0];
 this.statusCode = _status_message[_current_language][event][1];
 if (_status_message[_current_language][event][0] == 'Custom message')
 {
 this.controller.showDialog(
 {
 template: 'buddies/status-scene',
 assistant: new StatusAssistant(this, this.handleStatusSelection.bind(this)),
 preventCancel: false
 });
 }
 else
 {
 this.customMessage = "";
 _m_client.customMessage = "";
 }
 }
 
 
 if (!this.customMessage || this.customMessage == "")
 {
 //this.controller.get('customMessageTextWidget').mojo.setValue(this.userStatus.substr(0, 1).toUpperCase() + this.userStatus.substr(1, this.userStatus.length).toLowerCase());
 if (this.statusCode == 14)
 {
 this.statusCode = 1;
 this.userStatus = 'I am online';
 }
 this.controller.get('buddiesHeaderId').innerHTML = this.userStatus;
 _m_client._con.set_status(this.statusCode, this.userStatus);
 }
 else
 {
 this.controller.get('buddiesHeaderId').innerHTML = getUIString(this.customMessage, 25);
 _m_client._con.set_status(this.statusCode, this.customMessage);
 }
 
 };
 */
BuddiesAssistant.prototype.handleStatusSelection = function(msg)
{

    this.customMessage = msg;
    _m_client.customMessage = msg;
    /*if (this.customMessage == "") 
     this.handleAvailabilitySelection("");*/
    if (this.customMessage && this.customMessage != "") 
    {
        this.statusCode = 14;
        _m_client._con.set_status(this.statusCode, this.customMessage);
        //Mojo.Log.error("----------------settin the statust : "+this.customMessage+" -- "+_m_client.customMessage);
    }
    else 
    {
        switch (_m_client.status)
        {
            case 'available':
                _m_client._con.set_status(1, 'available');
                break;
                
            case 'busy':
                _m_client._con.set_status(2, 'busy');
                break;
                
            case 'away':
                _m_client._con.set_status(4, 'away');
                break;
                
            default:
                _m_client._con.set_status(1, 'available');
                _m_client.status = 'available';
                break;
        }
    }
};

BuddiesAssistant.prototype.handleChatCall = function(event, buddyValue)
{
    try 
    {
        if (buddies_this.searchFor) 
        {
            buddies_this.searchFor = "";
            this.controller.get('buddiesHeaderId').innerHTML = 'Buddies';
            this._after_finishing_search();
        }
        
        var target = event.originalEvent.target.id;
        if (target == "buddyOption") 
        {
            var myEvent = event;
            var findPlace = myEvent.originalEvent.target;
            this.popupIndex = event.index;
            this.controller.popupSubmenu(
            
            {
                onChoose: this.handleCommand,
                placeNear: findPlace,
                items: [
                {
                    label: $L(_client_labels[_current_language][6]),
                    command: "im"
                }, 
                {
                    label: $L(_client_labels[_current_language][7]),
                    command: "block"
                }, 
                {
                    label: $L(_client_labels[_current_language][9]),
                    command: "unblock"
                }, 
                {
                    label: $L(_client_labels[_current_language][8]),
                    command: "remove"
                }, 
                {
                    label: $L('Alais'),
                    command: "alias"
                }, ]
            });
            return;
        }
    } 
    catch (er) 
    {
        showconsole("errror in handlechatcall ... " + er);
    }
    
    if (event.item.buddyClass.toLowerCase().indexOf('group_container') != -1) 
    {
        buddies_this.showGroupList(event);
        return;
    }
    
    var split_value = event.item.value.split(":");
    if (!_m_client.login_list[split_value[0]]) 
    {
        this.showDialogBox("Please Login to send messages", "The person " + split_value[2] + " is not available right now");
        try 
        {
            _m_client._m_buddy_list.buddy_window[split_value[0]][split_value[1]][split_value[2]].disable_chat();
        } 
        catch (er) 
        {
            showconsole(er + "is the error in .disable_chat");
        }
        this.value = "";
        return;
    }
    try 
    {
        _m_buddy_list.create_buddy_window(split_value[0], split_value[1], split_value[2], true);
        if (event.item.value) 
        {
            _m_client._m_buddy_list.buddy_window[split_value[0]][split_value[1]][split_value[2]].is_closed = false;
            this.controller.stageController.assistant.showScene(
            {
                'name': 'chat',
                'disableSceneScroller': true
            }, event.item.value);
        }
        else 
            this.controller.stageController.assistant.showScene(
            {
                'name': 'chat',
                'disableSceneScroller': true
            }, '');
        
        var cmdMenuListData = "";
        cmdMenuListData += "{label:$L('Home'),command:$L('do-feedPrevious')},";
        //cmdMenuListData += "{iconPath:'images/add-contact.png',label:$L('Add Buddy'),command:$L('do-addBuddy')},";
        //cmdMenuListData += "{label:$L('Add Buddy'),command:$L('do-addBuddy')},";
        cmdMenuListData += "{label:$L('Chat'),command:$L('do-feedNext'),disabled:false},";
        this.cmdMenuModel.items = eval("[" + cmdMenuListData + "]");
        this.controller.modelChanged(this.cmdMenuModel);
        
    } 
    catch (er) 
    {
        showconsole("error in pushin the chat scene " + er);
    }
};

BuddiesAssistant.prototype.showDialogBox = function(title, message)
{
    this.controller.showAlertDialog(
    {
        onChoose: function(value)
        {
        },
        title: title,
        message: message,
        choices: [
        {
            label: 'OK',
            value: 'OK',
            type: 'color'
        }]
    });
}

BuddiesAssistant.prototype.handleKeyUpEvent = function(event)
{
    return;
    var kcode = event.originalEvent.keyCode;
    if (kcode == 57575) 
        return; //key code for gesture area
    // 16 - SHIFT , 8 - BACKSPACE
    if (this.searchFor == "" && (kcode == 16 || kcode == 8)) 
    {
        return;
    }
    
    if (kcode == 16) 
    {
        this.searchFor = "";
        this.controller.get('buddiesHeaderId').innerHTML = 'Buddies';
        /*buddies_this.buddylistmodel.items = new Array();
         buddies_this.controller.modelChanged(buddies_this.buddylistmodel);
         this._for_buddy_update('');*/
        this._after_finishing_search();
    }
    else 
    {
        //if ((kcode > 47 && kcode < 91) || kcode == 190)
        //if(1(kcode == 131 || k)) 
        if (kcode == 8) 
        {
            this.searchFor = this.searchFor.substr(0, this.searchFor.length - 1);
            if (this.searchFor == "") 
            {
                this.controller.get('buddiesHeaderId').innerHTML = 'Buddies';
                /*buddies_this.buddylistmodel.items = new Array();
                 buddies_this.controller.modelChanged(buddies_this.buddylistmodel);
                 this._for_buddy_update('');*/
                this._after_finishing_search();
                return;
            }
            this.controller.get('buddiesHeaderId').innerHTML = this.searchFor;
        }
        else if (!(kcode == 131 || kcode == 129 || kcode == 27)) 
        {
            if (kcode == 190) 
                kcode = 46;
            this.searchFor += String.fromCharCode(kcode);
            this.controller.get('buddiesHeaderId').innerHTML = this.searchFor;
        }
    }
    
    if (this.searchFor && this.searchFor != "") 
        this._for_buddy_search(this.searchFor);
};

BuddiesAssistant.prototype._after_finishing_search = function()
{
    buddies_this.widgets = new Array();
    buddies_this.buddylistmodel.items = buddies_this.widgets;
    for (var i = 0; i < buddies_this.buddies.length; i++) 
    {
        if (!(!buddies_this.showOffline && buddies_this.buddies[i][0]["state"] == "offline")) 
        {
            buddies_this.widgets[buddies_this.widgets.length] = 
            {
                category: buddies_this.buddies[i][0]["group"],
                avatarFrame: buddies_this.buddies[i][0]["avatarFrame"],
                avatar: buddies_this.buddies[i][0]["avatar"],
                buddyOptionClass: 'feedlist-info icon right',
                buddyClass: '',
                name: buddies_this.buddies[i][0]["buddy"],
                displayName: getUIString(buddies_this.buddies[i][0]["dispName"], 15),
                value: buddies_this.buddies[i][0]["win_name"],
                buddyImageIcon: buddies_this.buddies[i][0]["imgClass"],
                //buddyImageIcon: getIMIconClassName(buddies_this.buddies[i][0]["group"], _m_client._m_buddy_list._buddies[buddies_this.buddies[i][0]["group"]][buddies_this.buddies[i][0]["user"]][buddies_this.buddies[i][0]["buddy"]].state, _m_client._m_buddy_list._buddies[buddies_this.buddies[i][0]["group"]][buddies_this.buddies[i][0]["user"]][buddies_this.buddies[i][0]["buddy"]].blocked),
                personalMessage: xmlSafe(buddies_this.buddies[i][0]["customMessage"]),
            };
        }
    }
    //buddies_this.buddylistmodel.items = buddies_this.widgets;
    buddies_this.controller.modelChanged(buddies_this.buddylistmodel);
}


BuddiesAssistant.prototype._for_buddy_search = function(buddyName)
{
    buddies_this.buddylistmodel.items = new Array();
    for (var service in _m_client.login_list) 
    {
        var username = _m_client.login_list[service]["username"];
        for (var k = 0; k < _m_client.login_list[service]['count'].length; k++) 
        {
            username = _m_client.login_list[service]['count'][k];
            var xf = username;
            var yf = "";
            if (xf.indexOf("@") != -1) 
                yf = xf.substr(xf.indexOf("@") + 1, xf.length);
            if (yf == "chat.facebook.com") 
                yf = "face";
            for (var buddy in _m_client._m_buddy_list._buddies[service][username]) 
            {
                var buddyClassName = "";
                try 
                {
                    if (((buddy.toLowerCase().indexOf(buddyName.toLowerCase()) != -1) || (_m_client._m_buddy_list._buddies[service][username][buddy].alias.toLowerCase().indexOf(buddyName.toLowerCase()) != -1)) && buddyName != "") 
                    {
                        var dispName;
                        var dispAvatarFrame;
                        var dispAvatar;
                        var customMessage;
                        if (_m_client._m_buddy_list._buddies[service][username][buddy].alias != "" && _m_client._m_buddy_list._buddies[service][username][buddy].alias != "null") 
                            dispName = getUIString(_m_client._m_buddy_list._buddies[service][username][buddy].alias, 15);
                        else 
                            dispName = getUIString(buddy.replace(/@gmail.com/i, ""), 15);
                        
                        if (!_m_client._m_buddy_list._buddies[service][username][buddy].avatar || (_m_client._m_buddy_list._buddies[service][username][buddy].avatar && (_m_client._m_buddy_list._buddies[service][username][buddy].avatar == "" || _m_client._m_buddy_list._buddies[service][username][buddy].avatar == "R0lGODlhAQABAIAAAP///////yH+FUNyZWF0ZWQgd2l0aCBUaGUgR0lNUAAh+QQBCgABACwAAAAAAQABAAACAkwBADs="))) 
                            dispAvatarFrame = "none";
                        else 
                            dispAvatarFrame = "";
                        
                        if (_m_client._m_buddy_list._buddies[service][username][buddy].avatar) 
                            dispAvatar = "data:image/png;base64," + _m_client._m_buddy_list._buddies[service][username][buddy].avatar;
                        else 
                            dispAvatar = "data:image/png;base64,R0lGODlhAQABAIAAAP///////yH+FUNyZWF0ZWQgd2l0aCBUaGUgR0lNUAAh+QQBCgABACwAAAAAAQABAAACAkwBADs=";
                        
                        if (_m_client._m_buddy_list._buddies[service][username][buddy].customMessage) 
                            customMessage = _m_client._m_buddy_list._buddies[service][username][buddy].customMessage;
                        else 
                            customMessage = '';
                        
                        
                        
                        var searchedBuddy = 
                        {
                            category: _m_client._m_buddy_list._buddies[service][username][buddy].group,
                            buddyOptionClass: $L('feedlist-info icon right'),
                            name: getUIString(buddy.replace(/@gmail.com/i, ""), 15),
                            displayName: dispName,
                            avatarFrame: dispAvatarFrame,
                            scene: '',
                            // _m_client._m_buddy_list._buddies[service][username][buddy].alias
                            value: service + ":" + username + ":" + buddy,
                            buddyImageIcon: getIMIconClassName(service, _m_client._m_buddy_list._buddies[service][username][buddy].state, _m_client._m_buddy_list._buddies[service][username][buddy].blocked, yf),
                            buddyClass: '',
                            personalMessage: customMessage,
                            avatar: dispAvatar
                        };
                        
                        buddies_this.buddylistmodel.items[buddies_this.buddylistmodel.items.length] = searchedBuddy;
                        
                    }
                } 
                catch (er) 
                {
                    showconsole(er + " for_search");
                }
            }
        }
    }
    buddies_this.controller.modelChanged(buddies_this.buddylistmodel);
}

BuddiesAssistant.prototype._for_buddy_avatar = function(serv, username, buddyname, base64image)
{
    try 
    {
        if (buddies_this.buddylistmodel) 
            for (i = 0; i < buddies_this.buddylistmodel.items.length; i++) 
            {
                if (buddies_this.buddylistmodel.items[i].value == (serv + ":" + username + ":" + buddyname)) 
                {
                    var avatarFrameDisp = "";
                    if (!base64image || base64image == "") 
                    {
                        avatarFrameDisp = "none";
                        base64image = "R0lGODlhAQABAIAAAP///////yH+FUNyZWF0ZWQgd2l0aCBUaGUgR0lNUAAh+QQBCgABACwAAAAAAQABAAACAkwBADs=";
                    }
                    if (!_m_client._m_buddy_list._buddies[serv][username][buddyname].avatar || (_m_client._m_buddy_list._buddies[serv][username][buddyname].avatar && (_m_client._m_buddy_list._buddies[serv][username][buddyname].avatar == "" || _m_client._m_buddy_list._buddies[serv][username][buddyname].avatar == "R0lGODlhAQABAIAAAP///////yH+FUNyZWF0ZWQgd2l0aCBUaGUgR0lNUAAh+QQBCgABACwAAAAAAQABAAACAkwBADs="))) 
                        avatarFrameDisp = "none";
                    else 
                        avatarFrameDisp = "";
                    
                    buddies_this.buddylistmodel.items[i].avatar = "data:image/png;base64," + base64image;
                    buddies_this.buddylistmodel.items[i].avatarFrame = avatarFrameDisp;
                    buddies_this.listWidget.mojo.noticeUpdatedItems(i, buddies_this.buddylistmodel.items.slice(i, i + 1));
                    break;
                }
            }
    } 
    catch (er) 
    {
        showconsole("buddies assisatatn : for_buddy_avatar : " + er);
    }
}

BuddiesAssistant.prototype._for_buddy_update_new = function(service, username, buddyname, group, state, customMessage, blocked)
{
    try 
    {
        if (!checkLoggedIn("")) 
            return;
        
        if (buddies_this.searchFor != "") 
            return;
        var updateBuddy = {};
        /*  if (customMessage && customMessage != "") 
         customMessage = xmlSafe(customMessage);
         */
        var dispName;
        if (_m_client._m_buddy_list._buddies[service][username][buddyname].alias != "" && _m_client._m_buddy_list._buddies[service][username][buddyname].alias != "null") 
            dispName = getUIString(_m_client._m_buddy_list._buddies[service][username][buddyname].alias, 15);
        else 
            dispName = getUIString(buddyname.replace(/@gmail.com/i, ""), 15);
        
        
        var dispAvatar;
        var dispAvatarFrame;
        
        if (_m_client._m_buddy_list._buddies[service][username][buddyname].avatar != "") 
            dispAvatar = "data:image/png;base64," + _m_client._m_buddy_list._buddies[service][username][buddyname].avatar;
        else 
            dispAvatar = "data:image/png;base64,R0lGODlhAQABAIAAAP///////yH+FUNyZWF0ZWQgd2l0aCBUaGUgR0lNUAAh+QQBCgABACwAAAAAAQABAAACAkwBADs=";
        
        if (!_m_client._m_buddy_list._buddies[service][username][buddyname].avatar || (_m_client._m_buddy_list._buddies[service][username][buddyname].avatar && (_m_client._m_buddy_list._buddies[service][username][buddyname].avatar == "" || _m_client._m_buddy_list._buddies[service][username][buddyname].avatar == "R0lGODlhAQABAIAAAP///////yH+FUNyZWF0ZWQgd2l0aCBUaGUgR0lNUAAh+QQBCgABACwAAAAAAQABAAACAkwBADs="))) 
            dispAvatarFrame = "none";
        else 
            dispAvatarFrame = "";
        
        var xf = username;
        var yf = "";
        if (xf.indexOf("@") != -1) 
            yf = xf.substr(xf.indexOf("@") + 1, xf.length);
        if (yf == "chat.facebook.com") 
            yf = "face";
        updateBuddy = 
        {
            category: group,
            buddyOptionClass: 'feedlist-info icon right',
            name: buddyname,
            displayName: dispName,
            avatarFrame: dispAvatarFrame,
            scene: '',
            // _m_client._m_buddy_list._buddies[service][username][buddy].alias
            value: service + ":" + username + ":" + buddyname,
            buddyImageIcon: getIMIconClassName(service, state, blocked, yf),
            buddyClass: '',
            personalMessage: customMessage,
            avatar: dispAvatar
            //avatar: xmlSafe("data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAfADIDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDxaO2zjj0pwt+BxzxWlDEuFyP7v9ab5Ywv/Af60AZohHHHpQsOccelXNgyvpxSxoOPXigCoLcHHHpTGtuOnpWpFGCV/wCA5/M0rRrgf8B/maAML7P7UVpeUKKALcUowv8AwH+tIZBhfX5f61mxXOAPwpRP0/CgC0HGR+FCOAR+FU/O6fhSLNjH4UAaccoG322/zNBmAA/D+ZrOW4xj2xUb3P8ASgC15vvRWb59FAH/2Q=="),
        
        };
        
        var i, j;
        //showconsole("Checkin if the buddy is ther in the list or not ?? if yes then update it accordingly");
        //Mojo.Log.error("Thhis is what u sent : "+service + ":" + username + ":" + buddyname);
        for (i = 0; i < buddies_this.buddylistmodel.items.length; i++) 
        {
            //Mojo.Log.error("Thhis is what we have : "+buddies_this.buddylistmodel.items[i].value);
            if (buddies_this.buddylistmodel.items[i].value == service + ":" + username + ":" + buddyname) 
            {
                if (state != 'offline') 
                {
                    buddies_this.buddylistmodel.items.splice(i, 1, updateBuddy);
                    buddies_this.listWidget.mojo.noticeUpdatedItems(i, buddies_this.buddylistmodel.items.slice(i, i + 1));
                }
                else 
                {
                    if (buddies_this.showOffline) 
                    {
                        buddies_this.buddylistmodel.items.splice(i, 1, updateBuddy);
                        buddies_this.listWidget.mojo.noticeUpdatedItems(i, buddies_this.buddylistmodel.items.slice(i, i + 1));
                    }
                    else 
                    {
                        buddies_this.buddylistmodel.items.splice(i, 1);
                        buddies_this.listWidget.mojo.noticeRemovedItems(i, 1);
                    }
                }
                break;
            }
            
        }
        if (i >= buddies_this.buddylistmodel.items.length) 
        {
            //showconsole("As the buddy cudnt be found now we ll add the buddy according to its group found");
            for (j = 0; j < buddies_this.buddylistmodel.items.length; j++) 
            {
                if (buddies_this.buddylistmodel.items[j].category == group) 
                {
                    if (state != 'offline') 
                    {
                        buddies_this.buddylistmodel.items.splice(j, 0, updateBuddy);
                        buddies_this.listWidget.mojo.noticeAddedItems(j, buddies_this.buddylistmodel.items.slice(j, j + 1));
                    }
                    else 
                    {
                        if (buddies_this.showOffline) 
                        {
                            buddies_this.buddylistmodel.items.splice(j, 1, updateBuddy);
                            buddies_this.listWidget.mojo.noticeUpdatedItems(j, buddies_this.buddylistmodel.items.slice(j, j + 1));
                        }
                        else 
                        {
                            buddies_this.buddylistmodel.items.splice(j, 1);
                            buddies_this.listWidget.mojo.noticeRemovedItems(j, 1);
                        }
                    }
                    break;
                }
            }
        }
        
        if (i >= buddies_this.buddylistmodel.items.length && j >= buddies_this.buddylistmodel.items.length) 
        {
            if (!(!buddies_this.showOffline && state == "offline")) 
            {
                //showconsole("cudnt find the buddy nor its group so now adding both");
                buddies_this.buddylistmodel.items.splice(buddies_this.buddylistmodel.items.length, 0, updateBuddy);
                buddies_this.listWidget.mojo.noticeAddedItems(buddies_this.buddylistmodel.items.length - 1, buddies_this.buddylistmodel.items.slice(buddies_this.buddylistmodel.items.length - 1, buddies_this.buddylistmodel.items.length));
            }
        }
    } 
    catch (er) 
    {
        showconsole("this is the error in new update " + er);
    }
}



BuddiesAssistant.prototype._make_buddies = function()
{
    buddies_this._searched_buddies = new Array();
    for (var service in _m_client.login_list) 
    {
        var username = _m_client.login_list[service]["username"];
        var xf = username;
        var yf = "";
        if (xf.indexOf("@") != -1) 
            yf = xf.substr(xf.indexOf("@") + 1, xf.length);
        if (yf == "chat.facebook.com") 
            yf = "face";
        
        for (var k = 0; k < _m_client.login_list[service]['count'].length; k++) 
        {
            username = _m_client.login_list[service]['count'][k];
            for (var buddy in _m_client._m_buddy_list._buddies[service][username]) 
            {
                var buddyClassName = "";
                try 
                {
                    var dispName;
                    if (_m_client._m_buddy_list._buddies[service][username][buddy].alias != "" && _m_client._m_buddy_list._buddies[service][username][buddy].alias != "null") 
                        dispName = _m_client._m_buddy_list._buddies[service][username][buddy].alias;
                    else 
                        dispName = buddy.replace(/@gmail.com/i, "");
                    var dispAvatarFrame;
                    if (!_m_client._m_buddy_list._buddies[service][username][buddy].avatar || (_m_client._m_buddy_list._buddies[service][username][buddy].avatar && (_m_client._m_buddy_list._buddies[service][username][buddy].avatar == "" || _m_client._m_buddy_list._buddies[service][username][buddy].avatar == "R0lGODlhAQABAIAAAP///////yH+FUNyZWF0ZWQgd2l0aCBUaGUgR0lNUAAh+QQBCgABACwAAAAAAQABAAACAkwBADs="))) 
                        dispAvatarFrame = "none";
                    else 
                        dispAvatarFrame = "";
                    var dispAvatar;
                    if (_m_client._m_buddy_list._buddies[service][username][buddy].avatar) 
                        dispAvatar = "data:image/png;base64," + _m_client._m_buddy_list._buddies[service][username][buddy].avatar;
                    else 
                        dispAvatar = "data:image/png;base64,R0lGODlhAQABAIAAAP///////yH+FUNyZWF0ZWQgd2l0aCBUaGUgR0lNUAAh+QQBCgABACwAAAAAAQABAAACAkwBADs=";
                    buddies_this._searched_buddies[buddies_this._searched_buddies.length] = 
                    {
                        category: service,
                        buddyOptionClass: 'feedlist-info icon right',
                        name: buddy,
                        displayName: getUIString(dispName, 15),
                        avatarFrame: dispAvatarFrame,
                        scene: '',
                        value: service + ":" + username + ":" + buddy,
                        buddyImageIcon: getIMIconClassName(service, _m_client._m_buddy_list._buddies[service][username][buddy].state, _m_client._m_buddy_list._buddies[service][username][buddy].blocked, yf),
                        buddyClass: '',
                        personalMessage: _m_client._m_buddy_list._buddies[service][username][buddy].customMessage,
                        avatar: dispAvatar
                    }
                } 
                catch (er) 
                {
                    showconsole(" error in matchin buddy name " + er);
                }
            }
        }
    }
}



BuddiesAssistant.prototype._for_buddy_update = function(buddyName, removeGroup)
{
    //var listData = "";
    var buddies = new Array();
    for (var service in _m_client.login_list) 
    {
        var username = _m_client.login_list[service]["username"];
        var xf = username;
        var yf = "";
        if (xf.indexOf("@") != -1) 
            yf = xf.substr(xf.indexOf("@") + 1, xf.length);
        if (yf == "chat.facebook.com") 
            yf = "face";
        
        for (var k = 0; k < _m_client.login_list[service]['count'].length; k++) 
        {
            username = _m_client.login_list[service]['count'][k];
            for (var buddy in _m_client._m_buddy_list._buddies[service][username]) 
            {
                var buddyClassName = "";
                try 
                {
                    if ((buddy.toLowerCase().indexOf(buddyName.toLowerCase()) != -1) && buddyName != "") 
                    {
                        buddyClassName = "buddySelectedClass";
                    }
                    else 
                    {
                        buddyClassName = "";
                    }
                    
                    var buddy1 = new Array();
                    buddy1["service"] = service;
                    buddy1["user"] = username;
                    /*if (buddy && buddy != "") 
                     buddy1["buddy"] = buddy.replace(/@gmail.com/i, "");
                     else */
                    buddy1["buddy"] = buddy;
                    //showconsole("there");
                    
                    if (_m_client._m_buddy_list._buddies[service][username][buddy].customMessage) 
                        buddy1["customMessage"] = _m_client._m_buddy_list._buddies[service][username][buddy].customMessage;
                    else 
                        buddy1["customMessage"] = '';
                    buddy1["state"] = _m_client._m_buddy_list._buddies[service][username][buddy].state;
                    buddy1["alias"] = _m_client._m_buddy_list._buddies[service][username][buddy].alias;
                    //showconsole("there1");
                    buddy1["blocked"] = _m_client._m_buddy_list._buddies[service][username][buddy].blocked;
                    buddy1["group"] = xmlSafe(_m_client._m_buddy_list._buddies[service][username][buddy].group);
                    buddy1["win_name"] = service + ":" + username + ":" + buddy;
                    buddy1["imgClass"] = getIMIconClassName(service, buddy1["state"], buddy1["blocked"], yf);
                    //showconsole("there2");
                    var dispName;
                    if (buddy1['alias'] != "" && buddy1['alias'] != "null") 
                        dispName = buddy1["alias"];
                    else 
                        dispName = buddy.replace(/@gmail.com/i, "");
                    buddy1['dispName'] = dispName;
                    buddy1["buddyClassName"] = buddyClassName;
                    if (_m_client._m_buddy_list._buddies[service][username][buddy].avatar) 
                        buddy1["avatar"] = "data:image/png;base64," + _m_client._m_buddy_list._buddies[service][username][buddy].avatar;
                    else 
                        buddy1["avatar"] = "data:image/png;base64,R0lGODlhAQABAIAAAP///////yH+FUNyZWF0ZWQgd2l0aCBUaGUgR0lNUAAh+QQBCgABACwAAAAAAQABAAACAkwBADs=";
                    if (!_m_client._m_buddy_list._buddies[service][username][buddy].avatar || (_m_client._m_buddy_list._buddies[service][username][buddy].avatar && (_m_client._m_buddy_list._buddies[service][username][buddy].avatar == "" || _m_client._m_buddy_list._buddies[service][username][buddy].avatar == "R0lGODlhAQABAIAAAP///////yH+FUNyZWF0ZWQgd2l0aCBUaGUgR0lNUAAh+QQBCgABACwAAAAAAQABAAACAkwBADs="))) 
                        buddy1["avatarFrame"] = "none";
                    else 
                        buddy1["avatarFrame"] = "";
                    buddies[buddies.length] = new Array(buddy1);
                    
                } 
                catch (er) 
                {
                    showconsole(" error in matchin buddy name " + er);
                }
            }
        }
    }
    for (var i = 0; i < buddies.length; i++) 
        for (var j = i; j < buddies.length; j++) 
            if (buddies[i][0]["group"] > buddies[j][0]["group"]) 
            {
                var temp = buddies[i];
                buddies[i] = buddies[j];
                buddies[j] = temp;
            }
    try 
    {
        if (removeGroup && removeGroup != "") 
        {
            _m_client._m_buddy_list._groups[normalText(removeGroup)].visible = (_m_client._m_buddy_list._groups[normalText(removeGroup)].visible) ? false : true;
            //removeGroup = "";
        }
    } 
    catch (er) 
    {
        showconsole("this is the error in showoff buddies " + er);
    }
    
    
    var prevgrp = "";
    if (buddyName != "") 
    {
        buddies_this.showOffline = true;
    }
    else 
    {
        buddies_this.showOffline = _m_client.showOfflineBuddy;
    }
    try 
    {
        for (var i = 0; i < buddies.length; i++) 
        {
            /*if (prevgrp != buddies[i][0]["group"]) 
             {
             prevgrp = buddies[i][0]["group"];
             var stats = _m_client._m_buddy_list.group_stats(normalText(buddies[i][0]["group"]));
             //var statsStr = "(Total Buddies : 50 Online : 15)";
             var statsStr = "(Total Buddies : " + stats["total"] + " Online :" + (stats["total"] - stats["offline"]) + ")";
             
             if (_m_client._m_buddy_list._groups[normalText(buddies[i][0]["group"])].visible)
             {
             //remove the comment of neext line for havin the grp stats and ..also thisi s done when u remove the dividerfunc
             //listData += "{category:$L('" + buddies[i][0]["group"] + "'),buddyOptionClass:$L(''),nameClass:$L('name'),buddyClass:$L('group_container'),name:$L('" + buddies[i][0]["group"] + "'),groupStats:$L('" + statsStr + "')},";
             }
             else
             {
             //remove the comment of neext line for havin the grp stats and ..also thisi s done when u remove the dividerfunc
             //listData += "{category:$L('" + buddies[i][0]["group"] + "'),buddyOptionClass:$L(''),nameClass:$L('name'),buddyClass:$L('group_container_closed'),name:$L('" + buddies[i][0]["group"] + "'),groupStats:$L('" + statsStr + "')},";
             }
             }*/
            /*   if (!(buddies_this.showOffline != true && buddies[i][0]["state"] == "offline") && _m_client._m_buddy_list._groups[normalText(buddies[i][0]["group"])].visible) 
             {
             if (buddyName && buddyName != "")
             {
             if (buddies[i][0]["buddyClassName"] == "buddySelectedClass")
             {
             listData += "{category:$L('" + buddies[i][0]["group"] + "'),avatarFrame:$L('" + buddies[i][0]["avatarFrame"] + "'),avatar:$L('" + buddies[i][0]["avatar"] + "'),buddyOptionClass:$L('feedlist-info icon right'),name:$L('" + getUIString(buddies[i][0]["buddy"], 15) + "'),displayName:$L('" + getUIString(buddies[i][0]["dispName"], 15) + "'),scene:$L(''),value:'" + buddies[i][0]["win_name"] + "',buddyImageIcon:$L('" + buddies[i][0]["imgClass"] + "'),buddyClass:$L('" + buddies[i][0]["buddyClassName"] + "'),personalMessage:$L('" + buddies[i][0]["customMessage"] + "')},";
             }
             }
             else
             {
             listData += "{category:$L('" + buddies[i][0]["group"] + "'),avatarFrame:$L('" + buddies[i][0]["avatarFrame"] + "'),avatar:$L('" + buddies[i][0]["avatar"] + "'),buddyOptionClass:$L('feedlist-info icon right'),name:$L('" + getUIString(buddies[i][0]["buddy"], 15) + "'),displayName:$L('" + getUIString(buddies[i][0]["dispName"], 15) + "'),scene:$L(''),value:'" + buddies[i][0]["win_name"] + "',buddyImageIcon:$L('" + buddies[i][0]["imgClass"] + "'),buddyClass:$L('" + buddies[i][0]["buddyClassName"] + "'),personalMessage:$L('" + buddies[i][0]["customMessage"] + "')},";
             }
             }*/
            buddies_this._for_buddy_update_new(buddies[i][0]["service"], buddies[i][0]["user"], buddies[i][0]["buddy"], buddies[i][0]["group"], buddies[i][0]["state"], buddies[i][0]["customMessage"], buddies[i][0]["blocked"]);
            
        }
    } 
    catch (wer) 
    {
        showconsole("ERROR is " + wer);
    }
    /* buddies_this.widgets = "";
     var temp;
     try
     {
     temp = eval("[" + listData + "]");
     if (buddies_this && buddies_this != "")
     {
     buddies_this.widgets = temp;
     buddies_this.buddylistmodel.items = buddies_this.widgets;
     if (buddies_this.controller && buddies_this.controller != "")
     buddies_this.controller.modelChanged(buddies_this.buddylistmodel);
     //buddies_this.controller.setWidgetModel(buddies_this.controller.get("buddyList"), buddies_this.buddylistmodel);
     }
     }
     catch (er)
     {
     showconsole("m here errror in " + er);
     //buddies_this.widgets = [{category:$L('Buddies'), directory:$L(''),name:$L('please try again'),scene:$L('')},];
     }*/
};

BuddiesAssistant.prototype.handleLogout = function(event)
{
    if (_m_client.login_list[event.model.value]) 
    {
        //_m_client.on_logout(event.model.value, _m_client.login_list[event.model.value]["username"]);
        _m_client.on_logout(event.model.value, _m_client.login_list[event.model.value]['count'][--(_m_client.login_list[event.model.value]['count'].length)]);
    }
    else if (event.model.value == "all") 
    {
        for (var serv in _m_client.login_list) 
        {
            for (var k = 0; k < _m_client.login_list[serv]['count'].length; k++) 
            {
                var username = _m_client.login_list[serv]['count'][k];
                _m_client.on_logout(serv, username);
            }
        }
        this.controller.stageController.assistant.removeScene('buddies');
        //	this.controller.stageController.assistant.removeScene('login');
        this.controller.stageController.assistant.showScene('login', true);
        return;
    }
    
    var count = 0;
    for (var serv in _m_client.login_list) 
    {
        count++;
    }
    if (count == 0) 
    {
        this.controller.stageController.assistant.removeScene('buddies');
        this.controller.stageController.assistant.removeScene('login');
        this.controller.stageController.assistant.showScene('login', true);
    }
};

BuddiesAssistant.prototype.startchat = function(event)
{
    try 
    {
        var index = event.model.items.indexOf(event.item);
        var a = this.controller.get('buddyList');
        for (var i = 0; i < a.childNodes.length; i++) 
        {
            for (var j = 0; j < a.childNodes[i].childNodes.length; j++) 
            {
                if (j == 4 && i == 0) 
                {
                    var tempchild = __createElement("IMG", "bg", "bg");
                    a.childNodes[0].childNodes[j].appendChild(tempchild);
                    a.childNodes[0].childNodes[j].style.backgroundColor = "blue";
                }
            }
            var win_name = event.item.value;
            var chat_win_name = win_name;
            var win_info = chat_win_name.split(":");
            var service = win_info[0];
            var username = win_info[1];
            var buddyname = win_info[2];
            _m_buddy_list.create_buddy_window(service, username, buddyname, true);
        }
    } 
    catch (er) 
    {
        showconsole("ERROR buddies-assistant-startchat() : " + er);
    }
};

BuddiesAssistant.prototype.handleCommand = function(event)
{
    if (event.type == Mojo.Event.command) 
    {
        switch (event.command)
        {
            case 'logoutAll':
                /*for (var serv in _m_client.login_list) 
             {
             for (var k = 0; k < _m_client.login_list[serv]['count'].length; k++)
             {
             var username = _m_client.login_list[serv]['count'][k];
             _m_client.on_logout(serv, username);
             }
             }*/
                _m_client._con.logout();
                
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
                
                _m_client.currentLoginUsername = new Array();
                _m_client.currentLoginUsernameForUI = new Array();
                var currentScenes = Mojo.Controller.stageController.getScenes();
                for (var i = 0; i < currentScenes.length; i++) 
                {
                    Mojo.Controller.stageController.assistant.removeScene(currentScenes[i]);
                }
                
                /*this.controller.stageController.assistant.removeScene('buddies');
             this.controller.stageController.assistant.removeScene('login');*/
                this.controller.stageController.assistant.showScene('login');
                
                
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
                var currentScenes = Mojo.Controller.stageController.getScenes();
                for (var i = 0; i < currentScenes.length; i++) 
                {
                    if (currentScenes[i].sceneName == 'loader') 
                    {
                        Mojo.Controller.stageController.assistant.removeScene(currentScenes[i]);
                    }
                    else if (currentScenes[i].sceneName == 'login') 
                    {
                    //currentScenes[i].assistant.drawer.mojo.setOpenState(false);
                    }
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
                
                
                try 
                {
                    /*   for(a in login_this.controller.stageController)
                 showconsole(a);
                 showconsole("------------------------------");
                 for(a in login_this.controller)
                 showconsole(a);
                 */
                    this.controller.stageController.assistant.removeScene("buddies");
                //login_this.controller.stageController.activate();  
                //login_this.controller.assistantActivate();
                } 
                catch (er) 
                {
                    showconsole("aaactivating issue : " + er);
                }
                break;
                
            case 'do-feedNext':
                //var currentScenes = Mojo.Controller.stageController.getScenes();
                //for (var i = 0; i < currentScenes.length; i++) 
                //{
                //	if (currentScenes[i].sceneName == 'chat') 
                try 
                {
                    if (buddies_this.searchFor) 
                    {
                        buddies_this.searchFor = "";
                        this.controller.get('buddiesHeaderId').innerHTML = 'Buddies';
                        this._after_finishing_search();
                    }
                    this.controller.stageController.assistant.showScene(
                    {
                        'name': 'chat',
                        'disableSceneScroller': true
                    });
                } 
                catch (er) 
                {
                    showconsole("ERror : do-feednext buddies-assis : " + er);
                }
                //}
                
                break;
                
            case 'do-addBuddy':
                try 
                {
                    /* this.controller.showDialog(
                 {
                 template: 'addBuddy/addBuddy-scene',
                 assistant: new AddBuddyAssistant(this),
                 preventCancel: true
                 });*/
                    Mojo.Controller.stageController.assistant.showScene('addContact');
                //buddies_this.controller.stageController.assistant.showScene('addBuddy');
                
                } 
                catch (er) 
                {
                    showconsole("error in addBuddy" + er);
                }
                break;
                
            case 'showhideoffline':
                try 
                {
                    buddies_this.showHideOfflineBuddy();
                } 
                catch (er) 
                {
                    showconsole("er" + er);
                }
                break;
            default:
                break;
        }
    }
};

BuddiesAssistant.prototype.dividerFunc = function(itemModel)
{
    return itemModel.category; // We're using the item's category as the divider label.
};

function searchbuddy(str, tempbuddylist)
{
    var pat1 = new RegExp(str);
    for (var service in _m_client.login_list) 
    {
        for (var k = 0; k < _m_client.login_list[serv]['count'].length; k++) 
        {
            var username = _m_client.login_list[serv]['count'][k];
            for (var buddy in _m_client._m_buddy_list._buddies[service][username]) 
            {
                if (buddy.toLowerCase().indexOf(str.toLowerCase()) != -1) 
                {
                }
                if (_m_client._m_buddy_list._buddies[service][username][buddy].group.toLowerCase().indexOf(str.toLowerCase()) != -1) 
                {
                }
            }
        }
    }
};

BuddiesAssistant.prototype.toggleCmdMenuModel = function(event)
{
    var cmdMenuListData = "";
    cmdMenuListData += "{label:$L('Home'),command:$L('do-feedPrevious')},";
    //cmdMenuListData += "{iconPath:'images/add-contact.png',label:$L('Add Buddy'),command:$L('do-addBuddy')},";
    //cmdMenuListData += "{label:$L('Add Buddy'),command:$L('do-addBuddy')},";
    for (var buddywinServ in _m_client._m_buddy_list.buddy_window) 
        for (var buddywin in _m_client._m_buddy_list.buddy_window[buddywinServ]) 
            for (var buddy in _m_client._m_buddy_list.buddy_window[buddywinServ][buddywin]) 
            {
                if (!_m_client._m_buddy_list.buddy_window[buddywinServ][buddywin][buddy].is_closed) 
                {
                    cmdMenuListData += "{label:$L('Chat'),command:$L('do-feedNext'),disabled:false},";
                    this.cmdMenuModel.items = eval("[" + cmdMenuListData + "]");
                    this.controller.modelChanged(this.cmdMenuModel);
                    return;
                }
            }
    cmdMenuListData += "{label:$L('Chat'),command:$L('do-feedNext'),disabled:true},";
    this.cmdMenuModel.items = eval("[" + cmdMenuListData + "]");
    this.controller.modelChanged(this.cmdMenuModel);
}


BuddiesAssistant.prototype.activate = function(event)
{
    this.toggleCmdMenuModel();
    // this._for_buddy_update("");
}

BuddiesAssistant.prototype.deactivate = function(event)
{
}

BuddiesAssistant.prototype.cleanup = function(event)
{
    delete this.widgets;
}

BuddiesAssistant.prototype.errorHandler = function(transaction, error)
{
    showconsole('DB-Error BuddiesAssistant ' + error.message + ' (Code ' + error.code + ')');
};
