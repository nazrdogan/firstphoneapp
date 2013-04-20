function SelectServiceSceneAssistant()
{
}

SelectServiceSceneAssistant.prototype.setup = function()
{
    this.controller.get("yahButtonLabel").innerHTML = "Yahoo";
    this.controller.get("msnButtonLabel").innerHTML = "MSN";
    this.controller.get("aimButtonLabel").innerHTML = "AIM";
    this.controller.get("jabButtonLabel").innerHTML = "Gtalk";
    this.controller.get("xmppButtonLabel").innerHTML = "XMPP";
    this.controller.get("facButtonLabel").innerHTML = "Facebook";
    this.controller.get("icqButtonLabel").innerHTML = "ICQ";
    this.controller.get("buyButtonLabel").innerHTML = "Buy";
    this.controller.get("cancelButtonLabel").innerHTML = "Cancel";
    
    this.controller.setupWidget("cancelButtonId", this.attributes = {}, this.model = 
    {
        label: "Cancel",
        disabled: false
    });
    
    /* ----------- remove this comment to restrict user to only one account per service ---------
     for (serv in _m_client.login_list) 
    {
        this.controller.get(serv + "ButtonId").style.display = "none";
    }
    for (var i = 0; i < login_this.auto_login_arr.length; i++) 
    {
        this.controller.get(login_this.auto_login_arr[i][0] + "ButtonId").style.display = "none";
    }
    */
    /*if (login_this.auto_login_arr.length == 2) 
    {
        this.controller.get("fullVersionPrompt").style.display = "block";
        this.controller.get("buyButtonId").style.display = "block";
    }*/
    
    try 
    {
    
        this.handleYahSelect = this.handleYahSelect.bindAsEventListener(this);
        Mojo.Event.listen(this.controller.get("yahButtonId"), Mojo.Event.tap, this.handleYahSelect.bind(this));
        
        this.handleMSNSelect = this.handleMSNSelect.bindAsEventListener(this);
        Mojo.Event.listen(this.controller.get("msnButtonId"), Mojo.Event.tap, this.handleMSNSelect.bind(this));
        
        this.handleAIMSelect = this.handleAIMSelect.bindAsEventListener(this);
        Mojo.Event.listen(this.controller.get("aimButtonId"), Mojo.Event.tap, this.handleAIMSelect.bind(this));
        
        this.handleJabSelect = this.handleJabSelect.bindAsEventListener(this);
        Mojo.Event.listen(this.controller.get("jabButtonId"), Mojo.Event.tap, this.handleJabSelect.bind(this));
        
        this.handleIcqSelect = this.handleIcqSelect.bindAsEventListener(this);
        Mojo.Event.listen(this.controller.get("icqButtonId"), Mojo.Event.tap, this.handleIcqSelect.bind(this));
        
        this.handleFacSelect = this.handleFacSelect.bindAsEventListener(this);
        Mojo.Event.listen(this.controller.get("facButtonId"), Mojo.Event.tap, this.handleFacSelect.bind(this));
        
        this.handleXMPPSelect = this.handleXMPPSelect.bindAsEventListener(this);
        Mojo.Event.listen(this.controller.get("xmppButtonId"), Mojo.Event.tap, this.handleXMPPSelect.bind(this));
        
        this.handleBuySelect = this.handleBuySelect.bindAsEventListener(this);
        Mojo.Event.listen(this.controller.get("buyButtonId"), Mojo.Event.tap, this.handleBuySelect.bind(this));
        
        this.handleCancelSelect = this.handleCancelSelect.bindAsEventListener(this);
        Mojo.Event.listen(this.controller.get("cancelButtonId"), Mojo.Event.tap, this.handleCancelSelect.bind(this));
    } 
    catch (er) 
    {
        showconsole("m here in catch" + er);
    }
}


SelectServiceSceneAssistant.prototype.handleYahSelect = function(event)
{
    this.controller.stageController.assistant.removeScene('selectServiceScene');
    this.controller.stageController.assistant.showScene('addAccount', 'yah');
}
SelectServiceSceneAssistant.prototype.handleMSNSelect = function(event)
{
    this.controller.stageController.assistant.removeScene('selectServiceScene');
    this.controller.stageController.assistant.showScene('addAccount', 'msn');
}
SelectServiceSceneAssistant.prototype.handleAIMSelect = function(event)
{
    this.controller.stageController.assistant.removeScene('selectServiceScene');
    this.controller.stageController.assistant.showScene('addAccount', 'aim');
}
SelectServiceSceneAssistant.prototype.handleJabSelect = function(event)
{
    this.controller.stageController.assistant.removeScene('selectServiceScene');
    this.controller.stageController.assistant.showScene('addAccount', 'jab');
}
SelectServiceSceneAssistant.prototype.handleIcqSelect = function(event)
{
    this.controller.stageController.assistant.removeScene('selectServiceScene');
    this.controller.stageController.assistant.showScene('addAccount', 'icq');
}
SelectServiceSceneAssistant.prototype.handleFacSelect = function(event)
{
    this.controller.stageController.assistant.removeScene('selectServiceScene');
    this.controller.stageController.assistant.showScene('addAccount', 'face');
}
SelectServiceSceneAssistant.prototype.handleXMPPSelect = function(event)
{
    this.controller.stageController.assistant.removeScene('selectServiceScene');
    this.controller.stageController.assistant.showScene('addAccount', 'xmpp');
}
SelectServiceSceneAssistant.prototype.handleBuySelect = function(event)
{
    this.controller.stageController.assistant.removeScene('selectServiceScene');
    //this.controller.stageController.assistant.showScene('Buy', 'Buy');
}
SelectServiceSceneAssistant.prototype.handleCancelSelect = function(event)
{
    this.controller.stageController.assistant.removeScene('selectServiceScene');
}
SelectServiceSceneAssistant.prototype.activate = function(event)
{
}

SelectServiceSceneAssistant.prototype.deactivate = function(event)
{
    /* remove any event handlers you added in activate and do any other cleanup that should happen before
    
     
    
     
    
     
    
     
    
     
    
     
    
     
    
     this scene is popped or another scene is pushed on top */
    
}

SelectServiceSceneAssistant.prototype.cleanup = function(event)
{
    /* this function should do any cleanup needed before the scene is destroyed as 
     a result of being popped off the scene stack */
}
