function ChangeStatusAssistant(temp)
{
    this.controller = temp.controller;
}

ChangeStatusAssistant.prototype.setup = function(widget)
{
    try 
    {
        this.widget = widget;
        this.add = this.add.bindAsEventListener(this);
        this.cancel = this.cancel.bindAsEventListener(this);
        this.showStatusList = this.showStatusList.bindAsEventListener(this);
        this.controller.get('buddyStatusTag').innerHTML = _client_labels[_current_language][27] + " :"
        
        this.controller.get('cancel').innerHTML = _client_labels[_current_language][16];
        this.controller.get('add').innerHTML = _client_labels[_current_language][17];
        this.controller.setupWidget("buddyStatusList", 
        {
            label: $L(_client_labels[_current_language][27])
        }, this.buddyStatusSelectorModel = 
        {
            choices: [{}],
            disabled: false
        });
        
        Mojo.Event.listen(this.controller.get("buddyStatusList"), Mojo.Event.propertyChange, this.handleStatusSelect.bind(this));
        Mojo.Event.listen(this.controller.get('buddyStatus'), Mojo.Event.tap, this.showStatusList);
        Mojo.Event.listen(this.controller.get('add'), Mojo.Event.tap, this.add);
        Mojo.Event.listen(this.controller.get('cancel'), Mojo.Event.tap, this.cancel);
        
    } 
    catch (er) 
    {
        showconsole(er + " is the error in changestatus setup");
    }
};

ChangeStatusAssistant.prototype.handleStatusSelect = function(event)
{
    this.controller.get("buddyStatus").value = event.value;
    this.controller.get("buddyStatusList").style.display = "none";
    
};

ChangeStatusAssistant.prototype.add = function(event)
{
    showconsole("m in save status opton");
};



ChangeStatusAssistant.prototype.showStatusList = function(event)
{
    try 
    {
        var listData = "";
        for (var i = 0; i < _status_message[_current_language].length; i++) 
        {
            listData += "{label:$L('" + xmlSafe(_status_message[_current_language][i][0]) + "'),value:$L('" + xmlSafe(_status_message[_current_language][i][0]) + "')},";
        }
        this.buddyStatusSelectorModel.choices = eval("[" + listData + "]");
        this.controller.modelChanged(this.buddyStatusSelectorModel);
        this.controller.get("buddyStatusList").style.display = "block";
    } 
    catch (er) 
    {
        showconsole("this is the errro in showstttist function" + er);
    }
    
};


ChangeStatusAssistant.prototype.cancel = function(event)
{
    this.widget.mojo.close();
}



ChangeStatusAssistant.prototype.activate = function(event)
{
    /* put in event handlers here that should only be in effect when this scene is active. For
    
    
     
    
    
     
    
    
     example, key handlers that are observing the document */
    
    
}


ChangeStatusAssistant.prototype.deactivate = function(event)
{
    /* remove any event handlers you added in activate and do any other cleanup that should happen before
    
     
    
     this scene is popped or another scene is pushed on top */
    
}

ChangeStatusAssistant.prototype.cleanup = function(event)
{
    /* this function should do any cleanup needed before the scene is destroyed as 
     a result of being popped off the scene stack */
}
