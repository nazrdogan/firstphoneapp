function StageAssistant()
{
    globMenu = {};
    
    globMenu.MenuAttr = 
    {
        omitDefaultItems: true
    };
}

StageAssistant.prototype.setup = function()
{
    stage_this = this;
    
    
    if (Mojo.Environment.DeviceInfo.screenHeight == 480) 
    { 
        _m_client.customMessage = "I'm on munduIM from Palm Pre";
    }
    else 
    {
        _m_client.customMessage = "I'm on munduIM from Palm Pixi";
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
            command: 'logoutAll',
            disabled: true
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
    //this.controller.pushScene("preferences");
    
    // Setting COOKIE for Preferences if not found else assigning value to global variable _m_client
    this.prefsCookie = new Mojo.Model.Cookie('preferences');
    try 
    {
        _m_client.showOfflineBuddy = this.prefsCookie.get().showOfflineBuddy;
        _m_client.vibrateAlerts = this.prefsCookie.get().vibrateAlerts;
        _m_client.soundAlerts = this.prefsCookie.get().soundAlerts;
        _m_client.status = this.prefsCookie.get().status;
        _m_client.customMessage = this.prefsCookie.get().customMessage;
        //_m_client.darkTheme = this.prefsCookie.get().darkTheme;
        showconsole("Cookie showOfflineBuddies -> " + this.prefsCookie.get().showOfflineBuddy);
        showconsole("Cookie vibrateAlerts      -> " + this.prefsCookie.get().vibrateAlerts);
        showconsole("Cookie soundAlerts        -> " + this.prefsCookie.get().soundAlerts);
    } 
    catch (e) 
    {
        showconsole("Cookie not found. Creating cookie");
        this.prefsCookie.put(
        {
            showOfflineBuddy: _m_client.showOfflineBuddy,
            vibrateAlerts: _m_client.vibrateAlerts,
            soundAlerts: _m_client.soundAlerts,
        });
        
    }
    
    if (_m_client.darkTheme == true) 
    {
        $$('body')[0].removeClassName('palm-default');
        $$('body')[0].addClassName('palm-dark');
    }
    else if (_m_client.darkTheme == false) 
    {
        $$('body')[0].addClassName('palm-default');
        $$('body')[0].removeClassName('palm-dark');
    }
    
    this.controller.pushScene("splash");
}

StageAssistant.prototype.showScene = function(scene, arguments)
{
    this.controller.pushScene(scene, arguments);
}

StageAssistant.prototype.removeScene = function(scene, arguments)
{
    this.controller.popScene(scene);
}

StageAssistant.prototype.getActiveScene = function()
{
    return this.controller.activeScene();
}

StageAssistant.prototype.changeScene = function(scene)
{
    this.controller.swapScene(
    {
        'name': scene,
        transition: Mojo.Transition.crossFade
    });
}

StageAssistant.prototype.handleCommand = function(event)
{
    var currentScene = Mojo.Controller.stageController.activeScene().sceneName;
    if (event.type == Mojo.Event.commandEnable) 
    {
        if ((event.command == "do-Update")) 
        {
            event.preventDefault();
        }
    }
    else 
    {
        if (event.type == Mojo.Event.command) 
        {
            switch (event.command)
            {
                case "do-about":
                    //Mojo.Controller.stageController.pushScene('support');
                    showconsole("stage-assistant - Display About Scene");
                    break;
                    
                case "do-Prefs":
                    showconsole("stage-assistant - Display Preference Scene");
                    
                    Mojo.Controller.stageController.pushScene("preferences", currentScene);
                    break;
                case 'logoutAll':
                    try 
                    {
                        showconsole("in logouta lla : ");
                        _m_client._con.logout();
                        imServerReady = false;
                        try 
                        {
                            if (_m_client.vibrateAlerts) 
                            {
                                login_this.controller.stageController.getAppController().playSoundNotification("vibrate", "");
                            }
                            login_this.spinnerModel.spinning = true;
                            login_this.controller.modelChanged(login_this.spinnerModel);
                        }
                        catch(er){showconsole("------vibrate alert exception : "+er);}
                        document.getElementById("overlay").style.display = "block";
                        _m_client.currentLoginUsername = new Array();
                        _m_client.currentLoginUsernameForUI = new Array();
                        var currentScenes = Mojo.Controller.stageController.getScenes();
                        for (var i = 0; i < currentScenes.length -2; i++) 
                        {
                            Mojo.Controller.stageController.assistant.removeScene(currentScenes[i]);
                        }
                        
                        //this.controller.stageController.assistant.showScene('login');
                    } 
                    catch (er) 
                    {
                        showconsole(er + " stage assis");
                    }
                    break;
            }
        }
    }
}
