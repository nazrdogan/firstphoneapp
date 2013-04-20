function AddAccountAssistant(service, accountName)
{
    this.fb = "";
    if (service == "face") 
    {
        this.fb = "face";
        this.service = "xmpp";
    }
    else 
    {
        this.fb = "";
        this.service = service;
    }
    
    this.accountName = accountName;
    this.mode = "add";
    
    //this.avatarBase64 = "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";
    this.avatarBase64 = "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";
    if (this.accountName != null) 
    {
        this.mode = "edit";
    }
    this.autoSignIn = false;
    this.stayInvisible = false;
    this.db = openDatabase('munduIMDB', '1', '', null);
}

AddAccountAssistant.prototype.setup = function()
{
    addAccount_this = this;
    addAccount_this.pathToFile = "";
    this.controller.get("serviceIcon").className = "left palm-account-icon " + getIMServiceIcon(this.service, this.fb);
    if (this.mode == 'edit') 
    {
        var sql = "select * from accounts where service='" + this.service + "' and userid='" + this.accountName + "';";
        this.db.transaction((function(transaction)
        {
            transaction.executeSql(sql, [], this.setupUI.bind(this), this.errorHandler.bind(this));
        }).bind(this));
    }
    
    this.controller.get("serviceHeaderId").innerHTML = getIMServiceDisplay(this.service, this.fb);
    
    if(this.fb != "face")
        this.controller.get("selectHelp").style.display = "none";
    
    //if (this.service == 'jab' || this.service == 'xmpp') 
    if (this.service == 'xmpp') 
    {
        if (this.fb == "face") 
            this.usernameHintText = "username@chat.facebook.com";
        else 
            this.usernameHintText = "username@server";
    }
    else if (this.service == 'msn') 
    {
        this.usernameHintText = "username@server";
    }
    else 
    {
        this.usernameHintText = "username";
    }
    var disableValue = false;
    
    if (_m_client.login_list[this.service]) 
        for (var acc in _m_client.login_list[this.service]['count']) 
        {
            if (this.accountName == _m_client.login_list[this.service]['count'][acc]) 
                disableValue = true;
        //console.debug(_m_client.login_list[serv]['count'][acc]);
        }
    
    
    
    this.controller.setupWidget("usrId", this.usrIdAttributes = 
    {
        hintText: this.usernameHintText,
        inputName: $L('UserName'),
        multiline: false,
        textCase: Mojo.Widget.steModeLowerCase,
        enterSubmits: false,
        focus: true,
        modelProperty: 'original'
    }, this.usrIdModel = 
    {
        'original': '',
        value: "",
        disabled: disableValue
    });
    
    this.controller.setupWidget("pswdId", this.pswdIdAttributes = 
    {
        hintText: $L('Type Password'),
        modelProperty: 'original'
    }, this.pswdIdModel = 
    {
        'original': '',
        value: "",
        disabled: disableValue
    });
    
    
    this.controller.setupWidget('rememberMeId', this.attributes = 
    {
        property: 'value',
        trueValue: true,
        falseValue: false
    }, this.signInModel = 
    {
        value: true,
        disabled: disableValue
    });
    /*    
     this.controller.setupWidget('invisibleSignInId', this.attributes =
     {
     property: 'value',
     trueValue: true,
     falseValue: false
     }, this.invisibleSignInModel =
     {
     value: false,
     disabled: false
     });
     */
   this.controller.get('cancelId').innerHTML = _client_labels[_current_language][16];
    if ("add" == this.mode) 
    {
        this.controller.get('submitId').innerHTML = _client_labels[_current_language][17];
    }
    else 
    {
        this.controller.get('submitId').innerHTML = _client_labels[_current_language][34];
    }
    //this.controller.get('rememberMeDivId').innerHTML = _client_labels[_current_language][23];
    this.controller.get('selectHelp').innerHTML = "Help";
    //this.controller.get('imageFieldId').style.verticalAlign = "middle";
    this.controller.get('rememberMeDivId').innerHTML = "Remember Password";
    //this.controller.get('invisibleSignInDivId').innerHTML = "Stay Invisible";
    Mojo.Event.listen(this.controller.get("selectHelp"), Mojo.Event.tap, this.displayHelpScreen.bind(this));
    Mojo.Event.listen(this.controller.get("cancelId"), Mojo.Event.tap, this.cancel.bind(this));
    Mojo.Event.listen(this.controller.get("submitId"), Mojo.Event.tap, this.submit.bind(this));
    Mojo.Event.listen(this.controller.get("rememberMeId"), Mojo.Event.propertyChange, this.handleAutoSignInCheck.bind(this));
    //Mojo.Event.listen(this.controller.get("rememberMeId"), Mojo.Event.propertyChange, this.handleStayInvisibleCheck.bind(this));
    Mojo.Event.listen(this.controller.get("imageFieldIdDiv"), Mojo.Event.tap, this.setAvatar.bind(this));
}

function xmlhttpPost(strURL)
{
    var xmlHttpReq = false;
    
    if (window.XMLHttpRequest) 
    {
        xmlHttpReq = new XMLHttpRequest();
        xmlHttpReq.onreadystatechange = callBackFunction.bind(this);
        
        if (xmlHttpReq.overrideMimeType) 
        {
            xmlHttpReq.overrideMimeType("text/plain; charset=x-user-defined")
        }
    }
    if (!xmlHttpReq) 
    {
        Mojo.Log.error('ERROR AJAX:( Cannot create an XMLHTTP instance');
        return false;
    }
    xmlHttpReq.open('GET', strURL);
    xmlHttpReq.send(null);
}

function callBackFunction(response)
{
    var decodedData;
    try 
    {
        if (response.target.readyState == 4) 
        {
        
            Mojo.Log.error('FILE LENGTH : ' + response.target.responseText.length / 1024 + ' kb');
            //this function won't handle really large files
            decodedData = window.btoa(makeBinaryContent(response.target.responseText));
            
            //for large files we need to use a custom function to break them up (todo - make this
            //function break the large files up!)
            //decodedData = Base64.encode(makeBinaryContent(response.target.responseText));
            
            //show the base64'd image
            $('imageFieldId').src = 'data:image/png;base64,' + decodedData;
            addAccount_this.avatarBase64 = decodedData;
        }
    } 
    catch (e) 
    {
        Mojo.Log.Error(e + "addacc callback exception");
    }
}

function makeBinaryContent(text)
{
    var ff = [];
    var mx = text.length;
    var scc = String.fromCharCode;
    for (var z = 0; z < mx; z++) 
    {
        ff[z] = scc(text.charCodeAt(z) & 255);
    }
    var b = ff.join("");
    return b;
}

AddAccountAssistant.prototype.setAvatar = function(event)
{
    showconsole("in set avatar : ");
    var params = 
    {
        defaultKind: 'image',
        //actionType: 'attach', kinds: ['image'], crop: { width: 150, height: 150 }, 
        onSelect: function(file)
        {
            //var pathToFile = Mojo.appPath + file.fullPath;
            addAccount_this.pathToFile = file.fullPath;
            Mojo.Log.error("F I L E N A M E : " + addAccount_this.pathToFile);
            xmlhttpPost(addAccount_this.pathToFile);
        }
    }
    Mojo.FilePicker.pickFile(params, this.controller.stageController);
}


AddAccountAssistant.prototype.displayHelpScreen = function(event)
{
    this.controller.stageController.assistant.showScene('help');
}

AddAccountAssistant.prototype.cancel = function(event)
{
    this.controller.stageController.assistant.removeScene('addAccount');
}
AddAccountAssistant.prototype.handleAutoSignInCheck = function(event)
{
    this.autoSignIn = event.value;
}
AddAccountAssistant.prototype.handleStayInvisibleCheck = function(event)
{
    this.stayInvisible = event.value;
}
AddAccountAssistant.prototype.submit = function(event)
{
    this.pwd = "";
    showconsole("---??"+this.service+"...."+this.fb);
    this.db = openDatabase('munduIMDB', '1', '', null);
    //var remMe = "true" == "" + this.signInModel.value ? 1 : 0;
    var remMe = 1;
    var uname = this.usrIdModel['original'];
    if (uname == "") 
    {
        Mojo.Controller.errorDialog("Enter the Username");
        return;
    }
    else if ((this.service == 'xmpp' && uname.search('@') == -1 && this.fb != "face")) 
    {
        Mojo.Controller.errorDialog(_alert_message_list[_current_language][11]);
        //uname += "@chat.facebook.com"; 
        return;
    }
    else if (this.service == 'xmpp' && this.fb == "face") 
    {
        var pos = uname.indexOf("@");
        if(pos == -1)
            uname += "@chat.facebook.com";
        else if (pos == 0) 
        {
            Mojo.Controller.errorDialog(_alert_message_list[_current_language][11]);
            return;
        }
        else 
        {
            var subs = uname.substr(pos + 1);
            if (subs != "chat.facebook.com") 
            {
                Mojo.Controller.errorDialog(_alert_message_list[_current_language][12]);
                return;
            }
        }
    }
    else if (this.service == 'jab' && uname.search('@') == -1) 
    {
        uname = uname + '@gmail.com';
    }
    else if(this.service == 'yah' && uname.search('@') != -1)
    {
        if (uname.substring(uname.indexOf("@") + 1, uname.indexOf("@") + 7) == "yahoo.") 
        {
            if (uname.substr(uname.indexOf("@") + 1).length > 7) 
            {
                uname = uname.substring(0, uname.indexOf("@"));
            }
            else 
            {
                Mojo.Controller.errorDialog(_alert_message_list[_current_language][10]);
                return;
            }
        }    
    }
    
    if (remMe == 1) 
    {
        this.pwd = this.pswdIdModel['original'];
    }
    
    if (!checkloginData(this.service, uname, this.pwd)) 
    {
     Mojo.Log.error("ertrunerxcddd : ");
        return;
    }
    
    if (_m_client._con.is_logged_in(this.service, uname)) 
    {
        if (this.service == "face") 
            var xmlDoc = "<IM_CLIENT><AVATAR im='xmpp' login='" + uname + "' filename='avatar.jpg' type='set' >" + this.avatarBase64 + "</AVATAR></IM_CLIENT>";
        else 
            var xmlDoc = "<IM_CLIENT><AVATAR im='" + this.service + "' login='" + uname + "' filename='avatar.jpg' type='set' >" + this.avatarBase64 + "</AVATAR></IM_CLIENT>";
        //var xmlDoc = "<IM_CLIENT><AVATAR im='" + this.service + "' login='" + uname + "' filename='"+ addAccount_this.pathToFile+"' type='set' >" + this.avatarBase64 + "</AVATAR></IM_CLIENT>";
        _m_client._con._add_to_queue("POST", null, xmlDoc, false);
    }
    
    if ("add" == this.mode) 
    {
        try 
        {
            var insertAccount = 'INSERT INTO accounts (service, userid, password, rememberpassword, avatar, buddylisthash) VALUES ("' +
            this.service +
            '","' +
            uname +
            '","' +
            this.pwd +
            '",' +
            remMe +
            ',"' +
            this.avatarBase64 +
            '",""); GO;';
            
            this.db.transaction((function(transaction)
            {
                transaction.executeSql(insertAccount, [], this.successAdd.bind(this), this.errorHandler.bind(this));
            }).bind(this));
        } 
        catch (wer) 
        {
            showconsole("ERROR inserting account " + wer);
        }
        
    }
    else 
    {
        try 
        {
            var updateAccount = "UPDATE accounts set userid='" + uname +
            "', password='" +
            this.pwd +
            "', avatar='" +
            this.avatarBase64 +
            "', rememberpassword=" +
            remMe +
            " where userid='" +
            this.userid +
            "' and service='" +
            this.service +
            "'";
            this.db.transaction((function(transaction)
            {
                transaction.executeSql(updateAccount, [], this.successEdit.bind(this), this.errorHandler.bind(this));
            }).bind(this));
        } 
        catch (wer) 
        {
            showconsole("ERROR inserting account " + wer);
        }
    }
}

AddAccountAssistant.prototype.setupUI = function(transaction, results)
{
    try 
    {
        var row = results.rows.item(0);
        this.userid = row.userid;
        this.password = row.password;
        this.rempwd = row.rememberpassword;
        this.avatarBase64 = row.avatar;
        this.controller.get("imageFieldId").src = "data:image/png;base64," + this.avatarBase64;
        this.usrIdModel.original = this.userid;
        this.controller.modelChanged(this.usrIdModel);
        this.pswdIdModel.original = this.password;
        this.controller.modelChanged(this.pswdIdModel);
        if (this.rempwd == 1) 
        {
            this.signInModel.value = true;
        }
        else 
        {
            this.signInModel.value = false;
        }
        this.controller.modelChanged(this.signInModel);
    } 
    catch (e) 
    {
        showconsole("ERROR in setupUI : " + e);
    }
}

AddAccountAssistant.prototype.successAdd = function(event)
{
    /*showconsole("A c c o u n t   a d d e d : [service]" + this.service + " [username]" + this.usrIdModel.original +
    " [password]" +
    this.pswdIdModel.original +
    " [rememberme]" +
    this.signInModel.value);
    Mojo.Log.error("-------sucess add");*/
    this.controller.stageController.assistant.removeScene('addAccount');
    var user = this.usrIdModel.original;;
    if (this.service == "jab" && user.search('@') == -1) 
        user += "@gmail.com";
    else if (this.service == 'yah' && user.search('@') != -1) 
    {
        if ((user.substring(user.indexOf("@") + 1, user.indexOf("@") + 7) == "yahoo.") && (user.substr(user.indexOf("@") + 1).length > 7)) 
        {
            user = user.substring(0, user.indexOf("@"));
        }
    }
    else if (this.service == 'xmpp' && this.fb == "face") 
    {
        var pos = user.indexOf("@");
        if (pos == -1) 
            user += "@chat.facebook.com";
    }
      
    
    addToAutoSignInArray(this.service, user, this.pswdIdModel['original'], true, this.stayInvisible, addAccount_this.avatarBase64);
    
}

AddAccountAssistant.prototype.successEdit = function(event)
{
    showconsole("A c c o u n t   e d i t e d : [service]" + this.service + " [username]" + this.usrIdModel.original +
    " [password]" +
    this.pswdIdModel.original +
    " [rememberme]" +
    this.signInModel.value);
    this.controller.stageController.assistant.removeScene('addAccount');
}

AddAccountAssistant.prototype.errorHandler = function(transaction, error)
{
    showconsole('Error was [' + error.message + '] (Code ' + error.code + ')');
    Mojo.Controller.errorDialog("Error in adding Account");
    return;
}

AddAccountAssistant.prototype.activate = function(event)
{
    /* put in event handlers here that should only be in effect when this scene is active. For
    
     
    
     
    
     
    
     example, key handlers that are observing the document */
    
}

AddAccountAssistant.prototype.deactivate = function(event)
{
    this.db = null;
    /* remove any event handlers you added in activate and do any other cleanup that should happen before
    
     
    
     
    
     
    
     this scene is popped or another scene is pushed on top */
    
}

AddAccountAssistant.prototype.cleanup = function(event)
{
    Mojo.Event.stopListening(this.controller.get("cancelId"), Mojo.Event.tap, this.cancel);
    Mojo.Event.stopListening(this.controller.get("submitId"), Mojo.Event.tap, this.submit);
    Mojo.Event.stopListening(this.controller.get("rememberMeId"), Mojo.Event.propertyChange, this.handleAutoSignInCheck);
    Mojo.Event.stopListening(this.controller.get("rememberMeId"), Mojo.Event.propertyChange, this.handleStayInvisibleCheck);
}
