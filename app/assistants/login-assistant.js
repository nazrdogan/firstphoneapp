function LoginAssistant(back)
{
    // _m_client._con.logout();
    /*for(a in _m_client)
     delete a;
     delete _m_client;*/
    //this._m_client = new mundu_client();
    var login_this;
    if (!imServerReady) 
        document.getElementById("overlay").style.display = "block";
    
    if (back && back != "") 
        this.comingBack = back;
    else 
        this.comingBack = false;
    //showconsole("MOJO>APPPATH : "+Mojo.appPath);
    // Open Database
    this.db = openDatabase('munduIMDB', '1', '', null);
    this.popupIndex;
};

function addToAutoSignInArray(serv, username, password, rememberPassword, stayInvisible, userAvatar)
{
    try 
    {
        var updateAccount;
        if (rememberPassword) 
            updateAccount = new Array(serv, username, password, stayInvisible, userAvatar);
        else 
            updateAccount = new Array(serv, username, '', stayInvisible, userAvatar);
        
        var i;
        for (i = 0; i < login_this.auto_login_arr.length; i++) 
        {
            if (login_this.auto_login_arr[i][0] == serv) 
            {
                login_this.auto_login_arr.splice(i, 0, updateAccount);
                break;
            }
        }
        if (i >= login_this.auto_login_arr.length) 
            login_this.auto_login_arr[login_this.auto_login_arr.length] = updateAccount;
        
        if (password && password != "") 
        {
            _m_client._con.login(new Array(new Array(serv, username, password, 'true')), 'visible');
            _m_client.currentLoginUsername[_m_client.currentLoginUsername.length] = new Array(serv, username);
            _m_client.currentLoginUsernameForUI[_m_client.currentLoginUsernameForUI.length] = new Array(serv, username);
            login_this.changeAccountListModel("", serv, username, password);
        }
        else 
        {
            login_this.changeAccountListModel("");
        }
    } 
    catch (er) 
    {
        showconsole("this is the errro in addToAutoSignInArray" + er);
    }
};

LoginAssistant.prototype.setup = function()
{
    login_this = this;
    this.controller.setupWidget(Mojo.Menu.appMenu, globMenu.MenuAttr, globMenu.appMenuModel);
    //this.controller.setupWidget(Mojo.Menu.appMenu, {}, this.controller.stageController.assistant.appMenuModel);
    //this.controller.stageController.getAppController().playSoundNotification( "vibrate", "" );
    this.windowOrientation = 'up';
    try 
    {
        this.nullHandleCount = 0;
        // Create table
        var createAccounts = "CREATE TABLE IF NOT EXISTS accounts " +
        "(_id integer primary key autoincrement," +
        "service varchar(10) not null," +
        "userid varchar(64) not null," +
        "password varchar(64)," +
        "alias varchar(64)," +
        "rememberpassword tinyint unsigned," +
        "connectionstartup tinyint unsigned," +
        "server varchar(64)," +
        "presencecode tinyint unsigned," +
        "statusmsg varchar(64)," +
        "loginstate tinyint unsigned," +
        "avatar text," +
        "buddylisthash varchar(64)," +
        "constraint unq unique( service,userid ) );GO"
        
        var createRosterString = "CREATE TABLE IF NOT EXISTS roster " +
        "(_id integer primary key autoincrement," +
        "userid varchar(64) not null," +
        "userservice varchar(10) not null," +
        "contactjid varchar(64)," +
        "contactservice varchar(10) not null," +
        "contactalias varchar(64)," +
        "contactsubscription varchar(20)," +
        "groupname varchar(64)," +
        "presencecode tinyint unsigned," +
        "statusmsg varchar(64)," +
        "blocked varchar(5)," +
        "chatstate tinyint unsigned," +
        "typingstatus tinyint unsigned," +
        "messagerowid integer," +
        "conferencestate tinyint unsigned," +
        "avatar text," +
        "md5image text );GO" +
        
        login_this.db.transaction((function(transaction)
        {
            transaction.executeSql(createAccounts, [], function(transaction, results) // success handler 
            {
                showconsole("Successfully created table accounts");
            }, login_this.errorHandler.bind(login_this));
        }).bind(login_this));
        
        login_this.db.transaction((function(transaction)
        {
            transaction.executeSql(createRosterString, [], function(transaction, results) // success handler 
            {
                showconsole("Successfully created table roster");
            }, login_this.errorHandler.bind(login_this));
        }).bind(login_this));
    } 
    catch (e) 
    {
        showconsole("Error creating table " + e);
    }
    
    if (!login_this.comingBack) 
    {
        this.comingBack = true;
        var mytext = 'select * from accounts order by service;';
        this.db.transaction((function(transaction)
        {
            transaction.executeSql(mytext, [], this.setupAutoSignInList.bind(this), this.errorHandler.bind(this));
        }).bind(this));
    }
    
    _m_client.setcallback("remember_user_dtls", this.rememberUserDtls);
    _m_client.setcallback("accounts_signed_in", this.changeAccountListModel);
    _m_client.setcallback("create_buddy_request", this.create_buddy_request);
    _m_client._con.set_callback("on_insertRoster", this.insertRoster);
    _m_client._con.set_callback("on_updateBuddyListHash", this.updateBuddyListHash);
    //_m_client._con.set_callback("on_retreiveRoster", this.retreiveRoster);
    _m_client._con.set_callback("on_insertRosterAvatar", this.insertRosterAvatar);
    _m_client._con.set_callback("on_updateRosterImageMD5", this.updateRosterImageMD5);
    
    
    this.accountCount = 0;
    this.editing_account = false;
    this.autoSignIn = false;
    this.auto_login_arr = new Array();
    
    
    
    /*----------------title menu started-----------------------*/
    var feedMenuPrev = {};
    var feedMenuNext = {};
    //feedMenuPrev = {icon: 'back',command: 'do-feedPrevious'};
    //feedMenuNext = {icon: 'forward',command: 'do-feedNext'};
    //this.feedMenuModel ={visible: true, items: [{items: [{label: _client_labels[_current_language][4], width: 320 },feedMenuNext]}]};
    //this.controller.setupWidget(Mojo.Menu.viewMenu,{ spacerHeight: 0, menuClass:'no-fade' },this.feedMenuModel);
    /*----------title menu ends-----------*/
    
    
    //Mojo.Event.listen(this.controller.get("showOfflineCheck"), Mojo.Event.propertyChange, this.showOfflineBuddy.bind(this));
    
    //------------- command menu starrt------------------------------//
    this.cmdMenuModel = 
    {
        visible: true,
        items: [
        {
            items: [
            {
                label: $L('Add Account'),
                //iconPath: 'images/add_account.png',
                command: 'addAccount'
            }]
        }, 
        {
            items: [
            {
                label: $L('Show Buddies'),
                //iconPath: 'images/buddies.png',
                command: 'do-feedNext'
            }]
        }, ]
    };
    
    this.controller.setupWidget(Mojo.Menu.commandMenu, undefined, this.cmdMenuModel);
    //-------------------command menu ends ----------------------------------//
    
    var listData = "";
    for (var i = 0; i < _status_message[_current_language].length; i++) 
    {
        listData += "{label:$L('" + xmlSafe(_status_message[_current_language][i][0]) + "'),value:$L('" + xmlSafe(_status_message[_current_language][i][0]) + "')},";
    }
    var temp = eval("[" + listData + "]");
    
    /*************************for account lsit***************************/
    login_this.activeAccounts = "";
    login_this.accountListData = "";
    /*for (service in _m_client.login_list) 
     {
     var username = _m_client.login_list[service]["username"];
     for (var k = 0; k < _m_client.login_list[service]['count'].length; k++)
     {
     username = _m_client.login_list[service]['count'][k];
     login_this.accountListData += "{loader:$L('none'),category:$L('" + service + "'),directory:$L('" + getAccountListIMServiceIcon(service) + "'),name:$L('" + getUIString(xmlSafe(username)) + "'),displayName:$L('" + getUIString(xmlSafe(username), 15) + "'),scene:$L(''),value:'',buddyImageIcon:$L('" + getIMIconClassName(service, "available", "no") + "'),personalStatusMessage:$L('ur personal status message..'),checked:$L('checked=true'),password:$L('')},";
     }
     }*/
    this.activeAccounts = eval("[" + login_this.accountListData + "]");
    this.controller.setupWidget('accountList', 
    {
        itemTemplate: 'login/listitem',
        //listTemplate: 'login/listTemplate',
        //dividerTemplate: 'login/divider',
        //dividerFunction: this.dividerFunc.bind(this),
        swipeToDelete: true,
        reorderable: false
    }, this.accountlistmodel = 
    {
        items: login_this.activeAccounts
    });
    this.listDeleteHandler = this.listDeleteHandler.bindAsEventListener(this);
    Mojo.Event.listen(this.controller.get("accountList"), Mojo.Event.listTap, this.handleAccountListSelect.bind(this));
    Mojo.Event.listen(this.controller.get("accountList"), Mojo.Event.listDelete, this.listDeleteHandler);
    
    /*************************for account lsit***************************/
    
    try 
    {
        this.controller.setupWidget("spinner", this.spinnerAttributes = 
        {
            spinnerSize: 'large',
            fps: 10
        }, this.spinnerModel = 
        {
            spinning: !imServerReady
        });
    } 
    catch (er) 
    {
        showconsole("error in spinner");
    }
    //this.controller.listen(document, 'orientationchange', this.handleOrientation.bind(this));
};
LoginAssistant.prototype.disableAll = function()
{
    /*
     for(var i = 0 ; i < login_this.accountlistmodel.items.length; i++)
     showconsole("IN DISABLE ALL FUCNTION OF LOGIN ASSIS"+i);
     */
    Mojo.Event.stopListening(login_this.controller.get('accountList'), Mojo.Event.listTap, login_this.handleAccountListSelect.bind(login_this));
}

LoginAssistant.prototype.dividerFunc = function(itemModel)
{
    return itemModel.category; // We're using the item's category as the divider label.
};

LoginAssistant.prototype.listDeleteHandler = function(event)
{
    //this.currentModel.items.splice(this.currentModel.items.indexOf(event.item), 1);
    login_this.popupIndex = login_this.accountlistmodel.items.indexOf(event.item);
    if (checkLoggedIn('')) 
        this.handleSignOut(this);
    for (var i = 0; i < login_this.accountlistmodel.items.length; i++) 
    {
        if (i == login_this.popupIndex) 
        {
            //_m_client._con.logout(this.accountlistmodel.items[login_this.popupIndex].category, this.accountlistmodel.items[login_this.popupIndex].name);
            login_this.removeFromAutoLoginArray(this.accountlistmodel.items[login_this.popupIndex].category, this.accountlistmodel.items[login_this.popupIndex].name);
            
            var string = "DELETE FROM accounts WHERE service='" + this.accountlistmodel.items[login_this.popupIndex].category + "' AND userid='" + this.accountlistmodel.items[login_this.popupIndex].name + "'; GO;";
            //var string = "DELETE FROM accounts WHERE service='msn' AND userid='munduweb@hotmail.com'; GO;";
            login_this.db.transaction((function(transaction)
            {
                transaction.executeSql(string, [], login_this.createRecordDataHandler.bind(login_this), login_this.errorHandler.bind(login_this));
            }).bind(login_this));
            
            var deleteRoster = "DELETE FROM roster WHERE userservice='" + this.accountlistmodel.items[login_this.popupIndex].category + "' AND userid='" + this.accountlistmodel.items[login_this.popupIndex].name + "'; GO;";
            login_this.db.transaction((function(transaction)
            {
                transaction.executeSql(deleteRoster, [], login_this.createRecordDataHandler.bind(login_this), login_this.errorHandler.bind(login_this));
            }).bind(login_this));
            
            
            break;
        }
    }
    
    //login_this.changeAccountListModel("");


}

LoginAssistant.prototype.handleAccountListSelect = function(event)
{
    /*
     if (event.originalEvent.target.id == "signInCheck" && _m_client.currentLoginUsername && _m_client.currentLoginUsername.length > 0)
     {
     //event.originalEvent.target.value = event.originalEvent.target.value;
     for(a in event.originalEvent.target)
     showconsole(a+"))))))");
     return;
     }
     else if (_m_client.currentLoginUsername && _m_client.currentLoginUsername.length > 0)
     return;*/
    try 
    {
        var target = event.originalEvent.target.id;
    } 
    catch (er) 
    {
        showconsole("ERROR handleAccountListSelect :" + er);
    }
    login_this.popupIndex = event.index;
    if (target == "accountOption") 
    {
        var myEvent = event;
        var findPlace = myEvent.originalEvent.target;
        /*	var statusListData="";
         for(var i = 0 ; i < _status_message[_current_language].length ; i++)
         {
         statusListData +="{label:$L('"+xmlSafe(_status_message[_current_language][i][0])+"'),command:$L('changeStatus')},";
         }*/
        this.controller.popupSubmenu(
        {
            onChoose: this.handleCommand,
            placeNear: findPlace,
            items: [
            {
                label: $L(_client_labels[_current_language][4]),
                command: "logIn",
                disabled: true
            }, 
            {
                label: $L(_client_labels[_current_language][15]),
                command: "logOut"
            }, 
            {
                label: $L(_client_labels[_current_language][8]),
                command: "forgetMe"
            }, 
            //{label: $L("Change Status"), items: eval("["+statusListData+"]")}
            {
                label: $L(_client_labels[_current_language][27]),
                command: "changeStatus"
            }]
        });
        return;
    }
    else if (target.substr(target.length - 15, 15) == "StatusMessage") 
    {
        //	this.handleStatusUpdate(target);	
    }
    else if (target == "signInCheck") 
    {
        try 
        {
            if (event.originalEvent.target.value == false) 
                this.handleSignIn(event);
            else 
                this.handleSignOut(this);
        } 
        catch (er) 
        {
            showconsole(er + " is the error in checkbox value detectionm ");
        }
    }
    else 
    {
        this.showLoginOptions(this);
    }
};


LoginAssistant.prototype.searchLoginArray = function(service, userid, Password)
{
    for (var i = 0; i < this.auto_login_arr.length; i++) 
        if (service == this.auto_login_arr[i][0] && userid == this.auto_login_arr[i][1]) 
        {
            delete this.auto_login_arr[i];
        }
};

LoginAssistant.prototype.setupAutoSignInList = function(transaction, results, service, username, password)
{
    this.auto_login_arr = new Array();
    try 
    {
        login_this.accountListData = "";
        for (var i = 0; i < results.rows.length; i++) 
        {
            var row = results.rows.item(i);
            var name = new Array();
            //this.searchLoginArray(row.service, row.userid, row.password);
            //showconsole("+_+_+_+"+row.password + " "+row.userid);
            this.auto_login_arr[this.auto_login_arr.length] = new Array(trim(row.service), trim(row.userid), row.password, true, row.avatar, row.buddylisthash);
            /*  var username = trim(row.userid);
             var clickFlag = "";
             if (_m_client.login_list[row.service])
             {
             for (var k = 0; k < _m_client.login_list[row.service]['count'].length; k++)
             if (_m_client.login_list[row.service]["count"][k] == row.userid)
             {
             clickFlag = "display:true";
             break;
             }
             }
             var dispName = row.userid.replace(/@gmail.com/i, ""); // every dispName is the gmail buddy or account name without @gmail.com
             login_this.accountListData += "{loader:$L('none'),category:$L('" + trim(row.service) + "'),directory:$L('" + getAccountListIMServiceIcon(trim(row.service)) + "'),name:$L('" + getUIString(xmlSafe(username)) + "'),displayName:$L('" + getUIString(xmlSafe(dispName), 15) + "'),scene:$L(''),value:'',buddyImageIcon:$L('" + getIMIconClassName(trim(row.service), "available", "no") + "'),personalStatusMessage:$L('ur personal status message..'),isItChecked:$L('" + clickFlag + "'),password:$L('" + row.password + "')},";
             */
        }
        /*login_this.activeAccounts = eval("[" + login_this.accountListData + "]");
         login_this.accountlistmodel.items = login_this.activeAccounts;
         login_this.controller.modelChanged(login_this.accountlistmodel);*/
        this.changeAccountListModel('');
        
        //this.autoLogin();
    } 
    catch (er) 
    {
        showconsole(er + " is the error ");
    }
};

LoginAssistant.prototype.handleSignIn = function(event)
{
    if (!checkLoggedIn("") || logoutAllInProgress) 
        if (!imServerReady) 
        {
            Mojo.Controller.errorDialog("Server not ready to connect, please Wait for few seconds and then try again.");
            return;
        }
    
    if (_m_client.vibrateAlerts) 
    {
        this.controller.stageController.getAppController().playSoundNotification("vibrate", "");
    }
    
    try 
    {
        for (var i = 0; i < login_this.accountlistmodel.items.length; i++) 
        {
            if (i == login_this.popupIndex) 
            {
                try 
                {
                    if (this.accountlistmodel.items[login_this.popupIndex].password && this.accountlistmodel.items[login_this.popupIndex].password != "" && this.accountlistmodel.items[login_this.popupIndex].password != 'undefined') 
                    {
                        _m_client.currentLoginUsername[_m_client.currentLoginUsername.length] = new Array(this.accountlistmodel.items[login_this.popupIndex].category, this.accountlistmodel.items[login_this.popupIndex].name);
                        _m_client.currentLoginUsernameForUI[_m_client.currentLoginUsernameForUI.length] = new Array(this.accountlistmodel.items[login_this.popupIndex].category, this.accountlistmodel.items[login_this.popupIndex].name);
                        showconsole("ADDED TO TJE CURRENT LOFIN USERNANE : " + _m_client.currentLoginUsernameForUI[0]);
                        //$('signInCheck').disabled = true;
                        var login_arr = new Array(new Array(this.accountlistmodel.items[login_this.popupIndex].category, this.accountlistmodel.items[login_this.popupIndex].name, this.accountlistmodel.items[login_this.popupIndex].password, 'true', this.accountlistmodel.items[login_this.popupIndex].buddylisthash));
                        _m_client._con.login(login_arr, 'visible');
                        login_this.changeAccountListModel('', this.accountlistmodel.items[login_this.popupIndex].category, this.accountlistmodel.items[login_this.popupIndex].name);
                        var loginName = this.accountlistmodel.items[login_this.popupIndex].name;
                        var serviceName = this.accountlistmodel.items[login_this.popupIndex].category;
                        /* setTimeout(function()
                         {
                         this.displayMessage(loginName, serviceName)
                         }
                         .bind(this), 60000);*/
                    }
                    else 
                    {
                        this.checkBox = event;
                        this.controller.showDialog(
                        {
                            template: 'login/password-scene',
                            assistant: new PasswordAssistant(this, this.passwordCallback.bind(this), this.accountlistmodel.items[login_this.popupIndex].name),
                            preventCancel: true
                        });
                    }
                    
                    if (this.accountlistmodel.items[login_this.popupIndex].buddylisthash != "") 
                    {
                        this.retreiveRoster(this.accountlistmodel.items[login_this.popupIndex].name, this.accountlistmodel.items[login_this.popupIndex].category);
                    }
                    
                } 
                catch (er) 
                {
                    showconsole("ERROR in handleSignIn " + er);
                }
                return;
            }
        }
    } 
    catch (er) 
    {
        showconsole("error in showin event.srcElement" + er);
    }
};

LoginAssistant.prototype.displayMessage = function(argName, argService)
{
    if (_m_client.login_list && _m_client.login_list[argService]) 
    {
        for (var k = 0; k < _m_client.login_list[argService]['count'].length; k++) 
        {
            if (_m_client.login_list[argService]['count'][k] == argName) 
            {
                // Already logged in
                return;
            }
        }
    }
    var i;
    for (i = 0; i < _m_client.currentLoginUsername.length; i++) 
    {
        if (_m_client.currentLoginUsername[i][0] == argService && _m_client.currentLoginUsername[i][1] == argName) 
            break;
    }
    if (i >= _m_client.currentLoginUsername) 
        return;
    // If reached her means there is a network problem 
    
    for (var j = 0; j < login_this.auto_login_arr.length; j++) 
    {
        var updateAccount;
        if (login_this.auto_login_arr[j][0] == argService && login_this.auto_login_arr[j][1] == argName) 
        {
        
            var xf = login_this.auto_login_arr[j][1];
            var yf = "";
            if (xf.indexOf("@") != -1) 
                yf = xf.substr(xf.indexOf("@") + 1, xf.length);
            if (yf == "chat.facebook.com") 
                yf = "face";
            
            updateAccount = 
            {
                category: login_this.auto_login_arr[j][0],
                name: getUIString(xmlSafe(login_this.auto_login_arr[j][1])),
                displayName: getUIString(xmlSafe(login_this.auto_login_arr[j][1].replace(/@gmail.com/i, "")), 15),
                directory: getAccountListIMServiceIcon(login_this.auto_login_arr[j][0], yf),
                avatar: login_this.auto_login_arr[j][4],
                loader: 'none',
                networkError: '',
                buddyImageIcon: getIMIconClassName(login_this.auto_login_arr[j][0], "available", "no", yf),
                value: '',
                isItChecked: '',
                password: login_this.auto_login_arr[j][2]
            
            }
            login_this.accountlistmodel.items.splice(j, 1, updateAccount);
            login_this.listWidget = login_this.controller.get('accountList');
            login_this.listWidget.mojo.noticeUpdatedItems(j, login_this.accountlistmodel.items.slice(j, j + 1));
        }
    }
}

LoginAssistant.prototype.handleEditAccount = function(event)
{
    try 
    {
        for (var i = 0; i < login_this.accountlistmodel.items.length; i++) 
        {
            if (i == login_this.popupIndex) 
            {
                try 
                {
                    //var login_arr = new Array(new Array(this.accountlistmodel.items[login_this.popupIndex].category, this.accountlistmodel.items[login_this.popupIndex].name, this.accountlistmodel.items[login_this.popupIndex].password, 'true'));
                    this.controller.stageController.pushScene('addAccount', this.accountlistmodel.items[login_this.popupIndex].category, this.accountlistmodel.items[login_this.popupIndex].name);
                } 
                catch (er) 
                {
                    showconsole("ERROR in handleEditAccount " + er);
                }
                return;
            }
        }
    } 
    catch (er) 
    {
        showconsole("error in handleEditAccount " + er);
    }
};

LoginAssistant.prototype.passwordCallback = function(value)
{
    if (value.length == 0) 
    {
        login_this.changeAccountListModel('');
        //login_this.checkBox.originalEvent.target.checked = false;
        return;
    }
    _m_client.currentLoginUsername[_m_client.currentLoginUsername.length] = new Array(this.accountlistmodel.items[login_this.popupIndex].category, this.accountlistmodel.items[login_this.popupIndex].name);
    _m_client.currentLoginUsernameForUI[_m_client.currentLoginUsernameForUI.length] = new Array(this.accountlistmodel.items[login_this.popupIndex].category, this.accountlistmodel.items[login_this.popupIndex].name);
    var login_arr = new Array(new Array(this.accountlistmodel.items[login_this.popupIndex].category, this.accountlistmodel.items[login_this.popupIndex].name, value, 'true', this.accountlistmodel.items[login_this.popupIndex].buddylisthash));
    _m_client._con.login(login_arr, 'visible');
    login_this.changeAccountListModel('', this.accountlistmodel.items[login_this.popupIndex].category, this.accountlistmodel.items[login_this.popupIndex].name);
}

LoginAssistant.prototype.handleSignOut = function(event)
{
    if (_m_client.vibrateAlerts) 
    {
        this.controller.stageController.getAppController().playSoundNotification("vibrate", "");
    }
    
    try 
    {
        if (chat_obj && chat_obj != "") 
        {
            for (var i = 0; i < chat_obj.chatModel.choices.length; i++) 
            {
                if (chat_obj.chatModel.choices[i].value.split(":")[1] == this.accountlistmodel.items[login_this.popupIndex].name) 
                {
                    chat_obj.handleWindowCloseNew(chat_obj.chatModel.choices[i].value.split(":")[0], chat_obj.chatModel.choices[i].value.split(":")[1], chat_obj.chatModel.choices[i].value.split(":")[2]);
                }
            }
        }
    } 
    catch (er) 
    {
        showconsole("login-assistatn : handlesignout : " + er);
    }
    
    try 
    {
    
        for (var i = 0; i < login_this.accountlistmodel.items.length; i++) 
        {
            if (i == login_this.popupIndex) 
            {
                var userid = this.accountlistmodel.items[login_this.popupIndex].name;
                /*this.db.transaction((function(transaction)
                 {
                 transaction.executeSql("delete from roster where userid='" + userid + "'", [], function(transaction, results) // success handler
                 {
                 showconsole("Roster deleted for : " + userid);
                 }, function(transaction, results) // error handler
                 {
                 showconsole("Error clearing roster table");
                 });
                 }).bind(this));*/
                this.closeService(this, userid, this.accountlistmodel.items[login_this.popupIndex].category);
                
                return;
            }
        }
    } 
    catch (er) 
    {
        showconsole("error in showin event.srcElement" + er);
    }
};

LoginAssistant.prototype.subMenuHandler = function(event)
{

};

LoginAssistant.prototype.handleCommand = function(event)
{

    try 
    {
        if (event.type == Mojo.Event.command) 
        {
            switch (event.command)
            {
            
                case 'logoutAll':
                    _m_client._con.logout();
                    _m_client.currentLoginUsername = new Array();
                    _m_client.currentLoginUsernameForUI = new Array();
                    var currentScenes = Mojo.Controller.stageController.getScenes();
                    for (var i = 0; i < currentScenes.length; i++) 
                    {
                        Mojo.Controller.stageController.assistant.removeScene(currentScenes[i]);
                    }
                    
                    this.controller.stageController.assistant.showScene('login');
                    /*this.controller.stageController.assistant.removeScene('buddies');
                 this.controller.stageController.assistant.removeScene('login');
                 this.controller.stageController.assistant.showScene('login');*/
                    break;
                    
                case 'do-myAbout':
                    login_this.popupIndex = event.index;
                    this.controller.popupSubmenu(
                    {
                        onChoose: this.subMenuHandler,
                        placeNear: event.target,
                        items: [
                        {
                            label: 'mysubmenu',
                            items: [
                            {
                                label: 'All Unread1',
                                command: 'feed-unread1'
                            }, 
                            {
                                label: 'All Unread2',
                                command: 'feed-unread2'
                            }, 
                            {
                                label: 'All Unread3',
                                command: 'feed-unread3'
                            }]
                        }, 
                        {
                            label: 'Hey ney label',
                            command: 'feed-unread4'
                        }]
                    });
                    break;
                    
                case 'remove-accounts':
                    try 
                    {
                        _m_client._con.logout();
                        this.db.transaction((function(transaction)
                        {
                            transaction.executeSql('DELETE FROM accounts; GO;', []);
                        }).bind(this));
                        
                        this.controller.stageController.assistant.removeScene('login');
                        this.controller.stageController.assistant.showScene('login');
                    } 
                    catch (er) 
                    {
                        showconsole("remove-accounts : " + er);
                    }
                    break;
                    
                case 'do-feedPrevious':
                    this.controller.stageController.assistant.removeScene("buddies");
                    break;
                    
                case 'do-feedNext':
                    if (checkLoggedIn('')) 
                    {
                       // if (!login_this.presentScene("buddies")) 
                            this.controller.stageController.assistant.showScene('buddies');
                       // else 
                       //     buddies_this.controller.assistantActivate();
                    }
                    else 
                    {
                        //Mojo.Controller.errorDialog("Please login first");
                        this.controller.showAlertDialog(
                        {
                            onChoose: function(value)
                            {
                            },
                            title: _alert_message_list[_current_language][29][0],
                            message: _alert_message_list[_current_language][29][1],
                            choices: [
                            {
                                label: 'OK',
                                value: 'OK',
                                type: 'color'
                            }]
                        });
                    }
                    break;
                    
                case 'addAccount':
                    this.controller.stageController.assistant.showScene('selectServiceScene');
                    break;
                    
                case 'do-about':
                    this.controller.stageController.assistant.showScene('about');
                    break;
                    
                default:
                    break;
            }
        }
        else 
        {
            switch (event)
            {
                case 'logIn':
                    this.handleSignIn(this);
                    break;
                    
                case 'logOut':
                    this.handleSignOut(this);
                    break;
                    
                case 'changeStatus':
                    this.handleChangeStatus(this);
                    break;
                    
                default:
                    break;
            }
        }
    } 
    catch (er) 
    {
        showconsole("hadnlecommand error : " + er);
    }
};

LoginAssistant.prototype.handleChangeStatus = function(event)
{
    try 
    {
        this.controller.showDialog(
        {
            template: 'changeStatus/changeStatus-scene',
            assistant: new ChangeStatusAssistant(this),
            preventCancel: true
        });
    } 
    catch (er) 
    {
        showconsole("error in chanestatusasssiss" + er);
    }
    
};
LoginAssistant.prototype.presentScene = function(val)
{
    var currentScenes = Mojo.Controller.stageController.getScenes();
    var cs;
    for (cs = 0; cs < currentScenes.length; cs++) 
    {
        if(currentScenes[cs].sceneName == val)
         return true;
    }
    return false;
}

LoginAssistant.prototype.autoLogin = function()
{
    try 
    {
        _m_client._con.login(this.auto_login_arr, 'visible');
    } 
    catch (er) 
    {
        showconsole("this is error in autologin" + er);
    }
};

LoginAssistant.prototype.create_buddy_request = function(service, username, buddy, exists)
{
    login_this.controller.stageController.topScene().showDialog(
    {
        template: 'login/approveBuddy-scene',
        assistant: new ApproveBuddyAssistant(login_this, login_this.buddyApproveCallback.bind(login_this), service, username, buddy, exists),
        preventCancel: true
    });
}

LoginAssistant.prototype.buddyApproveCallback = function(value)
{
    var xmlDoc = "<IM_CLIENT><FRIENDSHIP im ='" + value.split(":")[0] + "' login ='" + value.split(":")[1] + "' name ='" + value.split(":")[2] + "' nickname ='' message = 'hi there' type ='" + value.split(":")[3] + "' group ='' message ='' /></IM_CLIENT>";
    _m_client._con._add_to_queue("POST", null, xmlDoc, false);
}


LoginAssistant.prototype.changeAccountListModel = function(loaderValue, service, username, password)
{
    try 
    {
        login_this.accountListData = "";
        
        if (login_this.auto_login_arr.length > 0) 
        {
            login_this.controller.get("start").style.display = "none";
        }
        else 
            login_this.controller.get("start").style.display = "";
        
        for (var j = 0; j < login_this.auto_login_arr.length; j++) 
        {
            try 
            {
                var k = 0;
                var dispName = login_this.auto_login_arr[j][1].replace(/@gmail.com/i, "");
                
                var xf = login_this.auto_login_arr[j][1];
                var yf = "";
                if (xf.indexOf("@") != -1) 
                    yf = xf.substr(xf.indexOf("@") + 1, xf.length);
                if (yf == "chat.facebook.com") 
                    yf = "face";
                
                if (_m_client.login_list[login_this.auto_login_arr[j][0]] && _m_client.login_list[login_this.auto_login_arr[j][0]]['count']) 
                {
                    for (; k < _m_client.login_list[login_this.auto_login_arr[j][0]]['count'].length; k++) 
                    {
                        if (_m_client.login_list[login_this.auto_login_arr[j][0]]["count"][k] == login_this.auto_login_arr[j][1]) 
                        {
                        
                            //if (username && (login_this.auto_login_arr[j][1] == username || _m_client.currentLoginUsername[any] == username))
                            if (login_this._is_logging_in(login_this.auto_login_arr[j][0], login_this.auto_login_arr[j][1])) 
                                login_this.accountListData += "{buddylisthash:$L('" + login_this.auto_login_arr[j][5] + "'), avatar:$L('" + login_this.auto_login_arr[j][4] + "'),networkError:$L('none'),isDisabled:$L('DISABLED'),loader:$L(''),category:$L('" + login_this.auto_login_arr[j][0] + "'),directory:$L('" + getAccountListIMServiceIcon(login_this.auto_login_arr[j][0], yf) + "'),name:$L('" + getUIString(xmlSafe(login_this.auto_login_arr[j][1])) + "'),displayName:$L('" + getUIString(xmlSafe(dispName), 15) + "'),scene:$L(''),value:'',buddyImageIcon:$L('" + getIMIconClassName(login_this.auto_login_arr[j][0], "available", "no", yf) + "'),personalStatusMessage:$L('ur personal status message..'),isItChecked:$L('checked=true'),password:$L('" + login_this.auto_login_arr[j][2] + "')},";
                            else 
                                login_this.accountListData += "{buddylisthash:$L('" + login_this.auto_login_arr[j][5] + "'),avatar:$L('" + login_this.auto_login_arr[j][4] + "'),networkError:$L('none'),isDisabled:$L(''),loader:$L('none'),category:$L('" + login_this.auto_login_arr[j][0] + "'),directory:$L('" + getAccountListIMServiceIcon(login_this.auto_login_arr[j][0], yf) + "'),name:$L('" + getUIString(xmlSafe(login_this.auto_login_arr[j][1])) + "'),displayName:$L('" + getUIString(xmlSafe(dispName), 15) + "'),scene:$L(''),value:'',buddyImageIcon:$L('" + getIMIconClassName(login_this.auto_login_arr[j][0], "available", "no", yf) + "'),personalStatusMessage:$L('ur personal status message..'),isItChecked:$L('checked=true'),password:$L('" + login_this.auto_login_arr[j][2] + "')},";
                            break;
                        }
                    }
                    if (k == _m_client.login_list[login_this.auto_login_arr[j][0]]['count'].length) 
                    {
                        if (login_this._is_logging_in(login_this.auto_login_arr[j][0], login_this.auto_login_arr[j][1])) 
                            login_this.accountListData += "{buddylisthash:$L('" + login_this.auto_login_arr[j][5] + "'),avatar:$L('" + login_this.auto_login_arr[j][4] + "'),networkError:$L('none'),isDisabled:$L('DISABLED'),loader:$L(''),category:$L('" + login_this.auto_login_arr[j][0] + "'),directory:$L('" + getAccountListIMServiceIcon(login_this.auto_login_arr[j][0], yf) + "'),name:$L('" + getUIString(xmlSafe(login_this.auto_login_arr[j][1])) + "'),displayName:$L('" + getUIString(xmlSafe(dispName), 15) + "'),scene:$L(''),value:'',buddyImageIcon:$L('" + getIMIconClassName(login_this.auto_login_arr[j][0], "available", "no", yf) + "'),personalStatusMessage:$L('ur personal status message..'),isItChecked:$L('checked=true'),password:$L('" + login_this.auto_login_arr[j][2] + "')},";
                        else 
                            login_this.accountListData += "{buddylisthash:$L('" + login_this.auto_login_arr[j][5] + "'),avatar:$L('" + login_this.auto_login_arr[j][4] + "'),networkError:$L('none'),isDisabled:$L(''),loader:$L('none'),category:$L('" + login_this.auto_login_arr[j][0] + "'),directory:$L('" + getAccountListIMServiceIcon(login_this.auto_login_arr[j][0], yf) + "'),name:$L('" + getUIString(xmlSafe(login_this.auto_login_arr[j][1])) + "'),displayName:$L('" + getUIString(xmlSafe(dispName), 15) + "'),scene:$L(''),value:'',buddyImageIcon:$L('" + getIMIconClassName(login_this.auto_login_arr[j][0], "available", "no", yf) + "'),personalStatusMessage:$L('ur personal status message..'),isItChecked:$L(''),password:$L('" + login_this.auto_login_arr[j][2] + "')},";
                    }
                }
                else 
                {
                    if (login_this._is_logging_in(login_this.auto_login_arr[j][0], login_this.auto_login_arr[j][1])) 
                    {
                        login_this.accountListData += "{buddylisthash:$L('" + login_this.auto_login_arr[j][5] + "'),avatar:$L('" + login_this.auto_login_arr[j][4] + "'),networkError:$L('none'),isDisabled:$L('DISABLED'),loader:$L(''),category:$L('" + login_this.auto_login_arr[j][0] + "'),directory:$L('" + getAccountListIMServiceIcon(login_this.auto_login_arr[j][0], yf) + "'),name:$L('" + getUIString(xmlSafe(login_this.auto_login_arr[j][1])) + "'),displayName:$L('" + getUIString(xmlSafe(dispName), 15) + "'),scene:$L(''),value:'',buddyImageIcon:$L('" + getIMIconClassName(service, "available", "no", yf) + "'),personalStatusMessage:$L('ur personal status message..'),isItChecked:$L('checked=true'),password:$L('" + password + "')},";
                    }
                    else 
                        login_this.accountListData += "{buddylisthash:$L('" + login_this.auto_login_arr[j][5] + "'),avatar:$L('" + login_this.auto_login_arr[j][4] + "'),networkError:$L('none'),isDisabled:$L(''),loader:$L('none'),category:$L('" + login_this.auto_login_arr[j][0] + "'),directory:$L('" + getAccountListIMServiceIcon(login_this.auto_login_arr[j][0], yf) + "'),name:$L('" + getUIString(xmlSafe(login_this.auto_login_arr[j][1])) + "'),displayName:$L('" + getUIString(xmlSafe(dispName), 15) + "'),scene:$L(''),value:'',buddyImageIcon:$L('" + getIMIconClassName(login_this.auto_login_arr[j][0], "available", "no".yf) + "'),personalStatusMessage:$L('ur personal status message..'),isItChecked:$L(''),password:$L('" + login_this.auto_login_arr[j][2] + "')},";
                }
            } 
            catch (er) 
            {
                showconsole(er + " this is the catch wher we do operation of adding a new account to the acc list");
            }
        }
        
        login_this.activeAccounts = eval("[" + login_this.accountListData + "]");
        login_this.accountlistmodel.items = login_this.activeAccounts;
        login_this.controller.modelChanged(login_this.accountlistmodel);
    } 
    catch (er) 
    {
        showconsole(er + " this is the error in modelchange of account lsit");
    }
    login_this.toggleShowBudddy();
    
};

LoginAssistant.prototype._is_logging_in = function(service, username)
{
    try 
    {
        showconsole(_m_client.currentLoginUsernameForUI.length);
        showconsole(_m_client.currentLoginUsernameForUI[0]);
        for (var p = 0; p < _m_client.currentLoginUsernameForUI.length; p++) 
            if (_m_client.currentLoginUsernameForUI[p][0] == service && _m_client.currentLoginUsernameForUI[p][1] == username) 
                return true;
    } 
    catch (er) 
    {
        showconsole("is logging in error : " + er);
    }
    return false;
}

LoginAssistant.prototype.handleOrientation = function(event)
{
    login_this.windowOrientation = PalmSystem.screenOrientation;
    this.controller.stageController.setWindowOrientation(login_this.windowOrientation);
};

LoginAssistant.prototype.login = function(event)
{

    if ((_m_client.login_list[this.service_selected]) && _m_client.login_list[this.service_selected]["username"] != "") 
    {
        Mojo.Controller.errorDialog("this service already in use");
        return false;
    }
    
    var login_arr = new Array(new Array(this.service_selected, $('username').value, $('password').value, 'true'));
    try 
    {
        _m_client._con.login(login_arr, 'visible');
        if (this.autoSignIn) 
        {
            /*var string = 'INSERT INTO userTable (col1, col2, col3) VALUES ("' + this.service_selected + '","' + $('username').value + '","'+ $('password').value+'"); GO;';	
             this.db.transaction(
             (function (transaction) {
             transaction.executeSql(string, [], this.createRecordDataHandler.bind(this), this.errorHandler.bind(this));
             }).bind(this)
             ); */
        }
        else 
        {
            /*
             var string = 'REMOVE FROM userTable (col1, col2, col3) VALUES ("' + this.service_selected + '","' + $('username').value + '","'+ $('password').value+'"); GO;';
             this.db.transaction(
             (function (transaction) {
             transaction.executeSql(string, [], this.createRecordDataHandler.bind(this), this.errorHandler.bind(this));
             }).bind(this)
             );
             */
        }
        //this.controller.get(this.service_selected+'LoggedIn').style.display = "block";
        /*	for (var i=0;i< service_supported.length;i++){
         this.controller.get(service_supported[i]+"LogoutPre").service = service_supported[i];
         this.controller.get(service_supported[i]+"LogoutPre").onclick = function() {
         _m_client.on_logout(this.service , _m_client.login_list[this.service]["username"]);
         //document.getElementById(this.service+'LoggedIn').style.display = "none";
         //document.getElementById('loginContainer').style.display = "block";
         };
         }*/
    } 
    catch (er) 
    {
        showconsole("ERROR login-assistant - login() : " + er);
    }
    //this.controller.get('username').value = "";
    //this.controller.get('password').value = "";
};

LoginAssistant.prototype.showLoginOptions = function(event)
{

    var x = "";
    var userid = "";
    var disableValue = false;
    
    for (var i = 0; i < login_this.accountlistmodel.items.length; i++) 
    {
        if (i == login_this.popupIndex) 
        {
            if (this.accountlistmodel.items[login_this.popupIndex].name && this.accountlistmodel.items[login_this.popupIndex].name != "") 
            {
                if (this.accountlistmodel.items[login_this.popupIndex].isDisabled == "DISABLED") 
                    return;
                serv = this.accountlistmodel.items[login_this.popupIndex].category;
                userid = this.accountlistmodel.items[login_this.popupIndex].name;
                break;
            }
        }
    }
    
    /*---uncomment this for disablin the edit acc otpion when that acc is logged in -----------*/
    if (_m_client.login_list[serv]) 
        for (var acc in _m_client.login_list[serv]['count']) 
        {
            if (userid == _m_client.login_list[serv]['count'][acc]) 
                disableValue = true;
        //console.debug(_m_client.login_list[serv]['count'][acc]);
        }
    /*---uncomment this for disablin the edit acc otpion when that acc is logged in -----------*/
    
    this.loginOptions = [
    {
        label: $L('Login'),
        //secondaryIcon: 'status-available',
        command: 'loginAccount',
        disabled: disableValue
    }, 
    {
        label: $L('Logout'),
        //secondaryIcon: 'status-busy',
        command: 'logoutAccount',
        disabled: !disableValue
    }, 
    {
        label: $L('Edit'),
        command: 'editAccount',
        disabled: false
    }, 
    {
        label: $L('Remove'),
        //secondaryIcon: 'status-offline',
        command: 'removeAccount',
        disabled: disableValue
    }];
    
    this.controller.popupSubmenu(
    {
        onChoose: this.handleLoginOptionSelection,
        // toggleCmd: this.Messaging.Availability.getAvailabilityAsConstText(this.currentAvailability),
        placeNear: event.target,
        items: this.loginOptions
    });
    
};


LoginAssistant.prototype.handleLoginOptionSelection = function(event)
{
    if (event == 'undefined') 
        return;
    if (event && event != "") 
    {
        switch (event)
        {
            case 'loginAccount':
                this.handleSignIn(this);
                break;
                
            case 'logoutAccount':
                this.handleSignOut(this);
                break;
            case 'editAccount':
                this.editing_account = true;
                this.handleEditAccount(this);
                
                break;
            case 'removeAccount':
                this.handleSignOut(this);
                for (var i = 0; i < login_this.accountlistmodel.items.length; i++) 
                {
                    if (i == login_this.popupIndex) 
                    {
                        //_m_client._con.logout(this.accountlistmodel.items[login_this.popupIndex].category, this.accountlistmodel.items[login_this.popupIndex].name);
                        login_this.removeFromAutoLoginArray(this.accountlistmodel.items[login_this.popupIndex].category, this.accountlistmodel.items[login_this.popupIndex].name);
                        
                        var string = "DELETE FROM accounts WHERE service='" + this.accountlistmodel.items[login_this.popupIndex].category + "' AND userid='" + this.accountlistmodel.items[login_this.popupIndex].name + "'; GO;";
                        //var string = "DELETE FROM accounts WHERE service='msn' AND userid='munduweb@hotmail.com'; GO;";
                        login_this.db.transaction((function(transaction)
                        {
                            transaction.executeSql(string, [], login_this.createRecordDataHandler.bind(login_this), login_this.errorHandler.bind(login_this));
                        }).bind(login_this));
                        
                        
                        break;
                    }
                }
                
                login_this.changeAccountListModel("");
                break;
                
            default:
                break;
                
        }
    }
};

LoginAssistant.prototype.removeFromAutoLoginArray = function(serv, username)
{
    _m_client._con.logout(serv, username);
    
    var k, flag = false;
    for (k = 0; k < login_this.auto_login_arr.length; k++) 
    {
        if (username == login_this.auto_login_arr[k][1] && serv == login_this.auto_login_arr[k][0] && !flag) 
        {
            delete login_this.auto_login_arr[k];
            flag = true;
        }
        else if (flag) 
        {
            login_this.auto_login_arr[k - 1] = login_this.auto_login_arr[k];
        }
    }
    if (k == login_this.auto_login_arr.length) 
    {
        delete login_this.auto_login_arr[k - 1];
        login_this.auto_login_arr.length = k - 1;
    }
}


LoginAssistant.prototype.closeService = function(event, userName, serv)
{
    try 
    {
        _m_client.on_logout(serv, userName);
        //  _m_client.removeFromCurrentLoginUsernameForUI(serv, userName);
        login_this.changeAccountListModel("none");
    } 
    catch (er) 
    {
        showconsole("ERROR login-assistant closeService() : " + er);
    }
};

LoginAssistant.prototype.serviceChange = function(event)
{
    this.service_selected = event.value;
    for (var i = 0; i < service_supported.length; i++) 
    {
        //this.controller.get(service_supported[i]+'LoggedIn').style.display = "none";
    }
    //this.controller.get('loginContainer').style.display = "none";
    if ((_m_client.login_list[this.service_selected]) && _m_client.login_list[this.service_selected]["username"] != "") 
    {
        //this.controller.get(this.service_selected+'LoggedIn').style.display = "block";
    }
    else 
    {
        //this.controller.get('loginContainer').style.display = "block";
    }
    
    /*	if(this.controller.get(this.service_selected+'LoggedIn').style.display == "none")
     {
     this.controller.get('loginContainer').style.display = "block";
     }
     else
     {
     this.controller.get('loginContainer').style.display = "none";
     }*/
};

LoginAssistant.prototype.rememberUserDtls = function(event)
{
    try 
    {
        if (_m_client.rememberMe) 
        {
            /*var string = 'INSERT INTO userTable (col1, col2, col3) VALUES ("' + login_this.service_selected + '","' + login_this.controller.get('username').value + '","'+ login_this.controller.get('password').value+'"); GO;';
             login_this.db.transaction(
             (function (transaction) {
             transaction.executeSql(string, [], login_this.createRecordDataHandler.bind(login_this), login_this.errorHandler.bind(login_this));
             }).bind(login_this)
             ); */
        }
        else 
        {
        
        }
    } 
    catch (er) 
    {
        showconsole("Error in rememberUserDtls" + er);
    }
    //	login_this.controller.get("username").value = "";
    //	login_this.controller.get("password").value = "";

}


LoginAssistant.prototype.toggleShowBudddy = function(event)
{
    var cmdMenuListData = "";
    //cmdMenuListData += "{iconPath:'images/add_account.png',label:$L('Add Account'),command:$L('addAccount')},";
    cmdMenuListData += "{label:$L('Add Account'),command:$L('addAccount')},";
    if (checkLoggedIn('')) 
    {
        cmdMenuListData += "{label:$L('Show Buddies'),command:$L('do-feedNext'),disabled:false},";
        //cmdMenuListData += "{iconPath:'images/buddies.png',label:$L('Show Buddies'),command:$L('do-feedNext'),disabled:false},";
    }
    else 
    {
        cmdMenuListData += "{label:$L('Show Buddies'),command:$L('do-feedNext'),disabled:true},";
        //cmdMenuListData += "{iconPath:'images/buddies.png',label:$L('Show Buddies'),command:$L('do-feedNext'),disabled:true},";
    }
    this.cmdMenuModel.items = eval("[" + cmdMenuListData + "]");
    this.controller.modelChanged(this.cmdMenuModel);
    
};

LoginAssistant.prototype.activate = function(event)
{
    this.toggleShowBudddy();
    /*----this is for edit account only----------*/
    if (this.editing_account) 
    {
        try 
        {
            var mytext = 'select * from accounts order by service;';
            this.db.transaction((function(transaction)
            {
                transaction.executeSql(mytext, [], this.setupAutoSignInList.bind(this), this.errorHandler.bind(this));
            }).bind(this));
        } 
        catch (er) 
        {
            showconsole("error in activate of the login scene " + er);
        }
        this.editing_account = false;
        
    }
    this.changeAccountListModel('');
    /*----this is for edit account only----------*/
};

LoginAssistant.prototype.deactivate = function(event)
{
    /* remove any event handlers you added in activate and do any other cleanup that should happen before
     this scene is popped or another scene is pushed on top */
};

LoginAssistant.prototype.cleanup = function(event)
{
    /* this function should do any cleanup needed before the scene is destroyed as 
     a result of being popped off the scene stack */
    //_m_client._con.logout();
    /*for(a in _m_client)
     delete a;
     delete _m_client;*/
};

LoginAssistant.prototype.errorHandler = function(transaction, error)
{
    showconsole('Error login-assistant was ' + error.message + ' (Code ' + error.code + ')');
};

LoginAssistant.prototype.createRecordDataHandler = function(transaction, results)
{
};




LoginAssistant.prototype.retreiveRoster = function(userid, userservice)
{
    try 
    {
        var myQuery = 'select * from roster where userid = "' + userid + '" and userservice = "' + userservice + '" order by contactjid;';
        login_this.db.transaction((function(transaction)
        {
            transaction.executeSql(myQuery, [], login_this.createRoster.bind(login_this), login_this.errorHandler.bind(login_this));
        }).bind(login_this));
    } 
    catch (er) 
    {
        showconsole("error in activate of the login scene " + er);
    }
}

LoginAssistant.prototype.createRoster = function(transaction, results)
{

    if (_m_client) 
    {
        for (var i = 0; i < results.rows.length; i++) 
        {
            var row = results.rows.item(i);
            _m_client._on_buddy_receive(row.userservice, row.userid, row.contactjid, row.groupname, "offline", row.statusmsg, row.blocked, row.contactalias, row.md5image, row.avatar);
        }
    }
}


LoginAssistant.prototype.updateBuddyListHash = function(userid, userservice, buddylisthash)
{
    try 
    {
        var updateAccount = "UPDATE accounts set buddylisthash='" + buddylisthash +
        "'" +
        " where userid='" +
        userid +
        "' and service='" +
        userservice +
        "';";
        login_this.db.transaction((function(transaction)
        {
            transaction.executeSql(updateAccount, [], login_this.successEdit.bind(login_this), login_this.errorHandler.bind(login_this));
        }).bind(login_this));
    } 
    catch (wer) 
    {
        showconsole("ERROR inserting account " + wer);
    }
}
LoginAssistant.prototype.updateRosterImageMD5 = function(service, username, buddy, imageMD5)
{
    showconsole("in insert roster avatar : " + imageMD5 + " " + buddy);
    try 
    {
        var updateRoster = "UPDATE roster set md5image='" + imageMD5 +
        "'" +
        " where userid='" +
        username +
        "' and userservice='" +
        service +
        "' and contactjid='" +
        buddy +
        "';";
        login_this.db.transaction((function(transaction)
        {
            transaction.executeSql(updateRoster, [], login_this.successEdit.bind(login_this), login_this.errorHandler.bind(login_this));
        }).bind(login_this));
    } 
    catch (wer) 
    {
        showconsole("ERROR inserting account " + wer);
    }
}

LoginAssistant.prototype.insertRosterAvatar = function(service, username, buddy, avatar)
{
    showconsole("in insert roster avatar : " + username);
    try 
    {
        var updateAccount = "UPDATE roster set avatar='" + avatar +
        "'" +
        " where userid='" +
        username +
        "' and userservice='" +
        service +
        "' and contactjid='" +
        buddy +
        "';";
        login_this.db.transaction((function(transaction)
        {
            transaction.executeSql(updateAccount, [], login_this.successEdit.bind(login_this), login_this.errorHandler.bind(login_this));
        }).bind(login_this));
    } 
    catch (wer) 
    {
        showconsole("ERROR inserting account " + wer);
    }
}

LoginAssistant.prototype.successEdit = function(event)
{
    return;
}

LoginAssistant.prototype.errorHandler = function(transaction, error)
{
    showconsole("eRORR I UPDATIN THE ACCOUNT : " + transaction + " - " + error);
    return;
}

LoginAssistant.prototype.insertRoster = function(userid, userservice, contactjid, contactservice, contactalias, contactsubscription, groupname, presencecode, statusmsg, blocked, chatstate, typingstatus, messagerowid, conferencestate, md5image, avatar)
{
    showconsole("INSERT ROSTER : md5 " + md5image);
    var insertSQL = "insert into roster( userid , userservice , contactjid, contactservice, contactalias, " +
    "contactsubscription, groupname, presencecode, statusmsg, blocked, chatstate, typingstatus, messagerowid, " +
    "conferencestate, avatar, md5image ) values ('" +
    userid +
    "', '" +
    userservice +
    "', '" +
    contactjid +
    "', '" +
    contactservice +
    "', '" +
    contactalias +
    "', '" +
    contactsubscription +
    "', '" +
    groupname +
    "', '" +
    presencecode +
    "', '" +
    statusmsg +
    "', '" +
    blocked +
    "', '" +
    chatstate +
    "', '" +
    typingstatus +
    "', '" +
    messagerowid +
    "', '" +
    conferencestate +
    "', '" +
    avatar +
    "', '" +
    md5image +
    "' )";
    
    //    showconsole("Insert roster : " + insertSQL );
    
    login_this.db.transaction((function(transaction)
    {
        transaction.executeSql(insertSQL, [], function(transaction, results) // success handler 
        {
            //showconsole("Successfully inserted roster of " + contactjid ); 
        }, login_this.errorHandler.bind(login_this));
    }).bind(login_this));
    
}
