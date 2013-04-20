function SplashAssistant()
{
  /*  this.db = openDatabase('munduIMDB', '1', '', null );
    this.db.transaction((function(transaction)
    {
        transaction.executeSql( "delete from roster", [], 
        function(transaction, results)  // success handler 
        {
             showconsole("Roster table cleared"); 
        }, 
        function(transaction, results)  // error handler 
        {
             showconsole("Error clearing roster table"); 
        });
    }).bind(this));*/
}

SplashAssistant.prototype.setup = function()
{
    this.showLoginScene.bind(this).delay(1);
}

SplashAssistant.prototype.activate = function(event)
{
}

SplashAssistant.prototype.deactivate = function(event)
{
}

SplashAssistant.prototype.cleanup = function(event)
{
}

SplashAssistant.prototype.showLoginScene = function()
{
    //this.controller.stageController.popScene('splash');
    //this.controller.stageController.pushScene('login');
    Mojo.Controller.stageController.assistant.removeScene('splash');
    Mojo.Controller.stageController.assistant.showScene('login');

}
