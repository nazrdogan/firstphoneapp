function AddContactAssistant() {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
}

AddContactAssistant.prototype.setup = function() {
	this.add = this.add.bindAsEventListener(this);
	this.cancel = this.cancel.bindAsEventListener(this);
    this.selectorChanged = this.selectorChanged.bindAsEventListener(this);
    
    this.setupChoices();
  
	this.controller.get('cancel').innerHTML =	_client_labels[_current_language][16];
	this.controller.get('add').innerHTML =	_client_labels[_current_language][17];
    
    this.controller.setupWidget("addBuddyName", this.addBuddyNameAttributes = 
    {
        hintText: "Contact Name",
        multiline: false,
        textCase: Mojo.Widget.steModeLowerCase,
        enterSubmits: false,
        focus: true,
        modelProperty: 'original'
    }, this.addBuddyNameModel = 
    {
        'original': '',
        value: "",
        disabled: false
    });
    
    this.controller.setupWidget("addBuddyAlias", this.addBuddyAliasAttributes = 
    {
        hintText: "Alias (if any)",
        multiline: false,
        textCase: Mojo.Widget.steModeLowerCase,
        enterSubmits: false,
        focus: true,
        modelProperty: 'original'
    }, this.addBuddyAliasModel = 
    {
        'original': '',
        value: "",
        disabled: false
    });
   this.controller.setupWidget('accountSelector', {label: $L('Account'), choices: this.accounts, modelProperty:'currentAccount'}, this.selectorModelAccount);
   this.controller.setupWidget('groupSelector',  {label: $L('Group'), modelProperty:'currentGroup'}, this.selectorModelGroup);
   
   Mojo.Event.listen(this.controller.get('groupSelector'), Mojo.Event.propertyChange, this.selectorChanged);
	Mojo.Event.listen(this.controller.get('add'),Mojo.Event.tap,this.add);
	Mojo.Event.listen(this.controller.get('cancel'),Mojo.Event.tap,this.cancel);
};

AddContactAssistant.prototype.selectorChanged = function()
{
    if (this.selectorModelGroup.currentGroup == "Add") 
    {
        //Mojo.Controller.errorDialog("New Group Selected");
        this.controller.showDialog(
                        {
                            template: 'newgroup/newgroup-scene',
                            assistant: new NewgroupAssistant(this, this.newGroupCallback.bind(this), this.selectorModelAccount.currentAccount ),
                            preventCancel: true
                        });
        //this.controller.stageController.assistant.showScene('newgroup');
        //Mojo.Controller.stageController.assistant.showScene('newgroup');
    }
}

AddContactAssistant.prototype.newGroupCallback = function(val)
{
    Mojo.Log.error("this is the lenght of the groups list : "+this.selectorModelGroup.choices[0]['label']);
    var newItem = {label:"Add New..",value:"Add"};
    this.selectorModelGroup.choices[this.selectorModelGroup.choices.length - 1]['label'] = val;
    this.selectorModelGroup.choices[this.selectorModelGroup.choices.length - 1]['value'] = val;
  /*  this.selectorModelGroup.choices[this.selectorModelGroup.choices.length] = new Array({label:"New"},{value:"New"});
*/
    //this.selectorModelGroup.value = newItem;
    
    
    this.selectorModelGroup.choices.push(newItem);
    //this.groupList.mojo.addItems(this.selectorModelGroup.choices.length, [newItem]);
}   



AddContactAssistant.prototype.setupChoices = function(){
    this.groups = _m_client._m_buddy_list.palm_show_group_selector();
    this.accounts = _m_client.palm_show_account_selector();
    this.selectorModelGroup = { currentGroup: this.groups[0].value, choices: this.groups};
    this.selectorModelAccount = { currentAccount: this.accounts[0].value};
    
}

AddContactAssistant.prototype.add = function(event)
{
	if(this.addBuddyNameModel['original'] == "" || this.selectorModelGroup.currentGroup == "" || this.selectorModelAccount.currentAccount == "")
	{
		//this.widget.mojo.close();
        Mojo.Controller.errorDialog("Please enter proper detail");
        //Mojo.Controller.stageController.assistant.removeScene();
		return;
	}
	try
	{
		_m_client.yahoo_block = false;
		var ele = new Array();
		ele[0] = this.addBuddyNameModel;
        ele[1] = this.selectorModelGroup;
		ele[2] = this.addBuddyAliasModel;
        
		var buddy = this.addBuddyNameModel['original'];
		var group = this.selectorModelGroup.currentGroup;
        var username = this.selectorModelAccount.currentAccount.split(":")[0];
        var service = this.selectorModelAccount.currentAccount.split(":")[1];
        var nick = this.addBuddyAliasModel['original'];
        showconsole("buddy contaxct : "+username+" "+service+" "+group+" "+buddy);
		var login = username;
		if( service == "" || login == "" || !buddy || buddy == "" || !group || group == "") 
		{
			Mojo.Controller.errorDialog(_alert_message_list[_current_language][2][1]);
			return false;
		}
		if(service == "msn")
		{
			if(buddy.search(/[ \)\(/\?\|#!\$%\^\&\*~`"'/\\><,;:\]\[\{\}]/g) >= 0 ) 
			{
				Mojo.Controller.errorDialog(_alert_message_list[_current_language][3][1]);
				ele[0].focus();
				return false;
			}
		}
		if(service == "jab" || service == "xmpp")
		{
			if(buddy.search(/[ \)\(/\?\|#!\$%\^\&\*~`_"'/\\><,;:\]\[\{\}]/g) >= 0 ) 
			{
				Mojo.Controller.errorDialog(_alert_message_list[_current_language][3][1]);
				ele[0].focus();
				return false;
			}
		}
		if(service == "aim")
		{
			if(buddy.search(/[\)\(/\?\|#!\$%\^\&\*\-~`_\."'/\\><,;:\]\[\{\}]/g) >= 0 ) 
			{
				Mojo.Controller.errorDialog(_alert_message_list[_current_language][3][1]);
				ele[0].focus();
				return false;
			}
		}
		if(service == "yah") 
		{
			if(buddy.search(/[ \)\(/\?\|#!\$%\^\&\*\-~`"'/\\><,;:\]\[\{\}]/g) >= 0 ) 
			{
				Mojo.Controller.errorDialog(_alert_message_list[_current_language][3][1]);
				ele[0].focus();
				return false;
			}
		}
		if((service == "jab" || service == "msn") && buddy.search(/@.*\.com$/) < 1)
		{
			Mojo.Controller.errorDialog(_alert_message_list[_current_language][3][1]);
			ele[0].focus();
			return false;
		}
		if( _m_client._m_buddy_list._buddies[service]  && ( !_m_client._m_buddy_list._buddies[service][buddy] || (service=="yah" && !_m_client._m_buddy_list._buddies[service][buddy].blocked!='yes'))) {
			_m_client._con.add_buddy(service, login, buddy, group, _client_labels[_current_language][18], nick);
            Mojo.Controller.stageController.assistant.removeScene();
			//this.widget.mojo.close();
            
		} else {
			Mojo.Controller.errorDialog(_alert_message_list[_current_language][4][1]);
		}
		return false;
	}
	catch(er)
	{
		showconsole(er+" is the rerrroin adding buddy option onclick");
	}
};

AddContactAssistant.prototype.cancel = function(event) 
{
//	this.widget.mojo.close();
Mojo.Controller.stageController.assistant.removeScene();
}



AddContactAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
};

AddContactAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
};

AddContactAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
};
