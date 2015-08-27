//cubes

// Reference needed dependencies.
// !ref: http://meshmoon.data.s3.amazonaws.com/app/lib/class.js, Script
// !ref: http://meshmoon.data.s3.amazonaws.com/app/lib/admino-utils-common-deploy.js, Script

// Include dependency scripts.
engine.IncludeFile("http://meshmoon.data.s3.amazonaws.com/app/lib/class.js");
engine.IncludeFile("http://meshmoon.data.s3.amazonaws.com/app/lib/admino-utils-common-deploy.js");

// Import QtCore for both server and client. Import QtGui only on client.
engine.ImportExtension("qt.core"); 
if (IsClient())
    engine.ImportExtension("qt.gui"); 

// Global variables
var _appInstance            = null;
var _applicationName        = "testing2";
var _MSG_INTRODUCTION       = "MSG_Action_Introduction";

//Messages for interaction between server and client
var _MSG_MOVE               = "ME_Move";
var _MSG_MOVE_STOP          = "ME_MoveStop";


// Name the logging channel.
SetLogChannelName(_applicationName);

var Server = Class.extend(
{
    init : function()
    {
        LogInfo("Server started");
        

        //Initialize data objects
        this.data = {};
        this.data.moveX = 0;
        this.data.moveZ = 0;

        // Client sent entity actions
        //me.Action(_MSG_INTRODUCTION).Triggered.connect(this, this.onClientIntroduction);

        me.Action("buttonclick").Triggered.connect(this, this.onButtonClick);
        me.Action("cuberelocate").Triggered.connect(this, this.onCubeRelocate);
        me.Action("cubedelete").Triggered.connect(this, this.onCubeDelete);

        //
        me.Action(_MSG_MOVE).Triggered.connect(this, this.onMoveCommand);
        me.Action(_MSG_MOVE_STOP).Triggered.connect(this, this.onMoveStopCommand);
        
/**/
        // Connect to new clients logging in/out
        //server.UserConnected.connect(this, this.onClientConnected);
        //server.UserDisconnected.connect(this, this.onClientDisconnected);

        if(me.name != _applicationName)
            me.name = _applicationName;

        // Frame updates
        frame.Updated.connect(this, this.onUpdate);
        //scene.physics.Updated.connect(this, this.onUpdate);
        Log("frame updates");
    },

    onMoveCommand: function(param)
    {       
        //move forward
        if(param == "forward")
        {
            print("move:", param);
            this.data.moveZ = 1;
        }
        //move backward
        else if(param == "backward")
        {
            print("move:", param);
            this.data.moveZ = -1;
        }
        //move left
        else if(param == "left")
        {
            print("move:", param);
            this.data.moveX = -1;
        }
        //move right
        else if(param == "right")
        {
            print("move:", param);
            this.data.moveX = 1;
        }
    },
    
    onMoveStopCommand: function(param)
    {
        //Stop moving forward
        if(param == "forwardStop")
        {
            print("stop moving:", param);
            this.data.moveZ = 0;
        }
        //Stop moving backward
        else if(param == "backwardStop")
        {
            print("stop moving:", param);
            this.data.moveZ = 0;
        }
        //stop moving left
        else if(param == "leftStop")
        {
            print("stop moving:", param);
            this.data.moveX = 0;
        }
        //stop moving right
        else if(param == "rightStop")
        {
            print("stop moving:", param);
            this.data.moveX = 0;
        }
    },

    onCubeRelocate : function(id)
    {
        var entity = scene.EntityById(id);
        
        if(entity )
        {
            var newPos = new float3(Math.random()*75,Math.random()*75,Math.random()*75);
        
            entity.placeable.SetPosition(newPos);

        }
    },
    
    onCubeDelete : function(id)
    {
        var entity = scene.EntityById(id);
        
        if(entity )
        {
            scene.RemoveEntity(entity.id);  //??? not working
        }
    },


    onUpdate: function(frametime)
    {
        
    },

    onButtonClick : function()
    {
        Log("buttontest");
        //return;
        var entity = null;
        var blueCubes = 10;
        var redCubes = 10;
        
        

        for (i=0; i<blueCubes; i++)
        {
            entity = scene.CreateEntity(0, ["Name","Mesh","Placeable","RigidBody"], 
                AttributeChange.Replicated, 
/**/                 true /*replicated*/, 
                true /*replicated*/, 
                false /*temporary*/);
        
            entity.name="bluecube";
            entity.mesh.meshRef="cube.mesh";
            entity.mesh.materialRefs=["cube.material"];
                
            var newPos = new float3(Math.random()*75,Math.random()*75,Math.random()*75);
            entity.placeable.SetPosition(newPos);   
            entity.rigidBody.shapeType = 0; //box
        }

        for (i=0; i<redCubes; i++)
        {
            entity = scene.CreateEntity(0, ["Name","Mesh","Placeable","RigidBody"], AttributeChange.Replicated, 
 /* */            true /*replicated*/, true /*replicated*/, false /*temporary*/);
        
            entity.name="redcube";
            entity.mesh.meshRef="cube.mesh";
            entity.mesh.materialRefs=["http://meshmoon.eu.scenes.15.s3.amazonaws.com/3dtest-0bf05f/3D-test/cube2.material"];
                
            var newPos = new float3(Math.random()*75,Math.random()*75,Math.random()*75);
            entity.placeable.SetPosition(newPos);   
            entity.rigidBody.shapeType = 0; //box
        }


      
    },

   
    

    shutDown : function()
    {
        Log("Shutting down");
        this.data = null;
    },

    

/*
    onClientConnected : function(connId, connection)
    {
        Log("Client #" + connection.id + " connected");
    },

    onClientDisconnected : function(connId, connection)
    {
        Log("Client #" + connection.id + " disconnected");
    },

    onClientIntroduction : function()
    {
        var connection = server.ActionSender();
        if (connection != null)
        {
            Log("Client '" + connection.Property("username") + "' with id #" + connection.id + " is ready");

            // Reply to client with the same Entity Action
            connection.Exec(me, _MSG_INTRODUCTION);
        }
        else
            LogError("onClientIntroduction() null entity action sender!");
    }
    */

});









// not updated!!!!!!!!!!!!!!

var Client = Class.extend(
{
    init: function()
    {
        //Initialize data objects
        this.data = {};
        //console.log('Initialize data objects');
        Log("Initialize data objects");


/*
        var _loadPolymerElements = IApplication.loadDependencies(this, "menu-element.html");
        _loadPolymerElements.done(function(v){
            console.log('polymer element(s) loaded! ');
            this.selectionMenu = document.createElement("menu-element");
            this.selectionMenu.hidden=true;
            Tundra.ui.addToCorner(this.selectionMenu, Tundra.ui.$class.Corner.BottomRight, Tundra.ui.$class.Position.Bottom);
            console.log('...!!');
        }.bind(this));
*/

//        IApplication.loadDependencies(this,
//            "Eater.js"
//        ).done(function()
//        {
            //this.onDependenciesLoaded();
//        }.bind(this));
 //       console.log('Eater.js');

        //Register raw input context and connect KeyPressed and KeyReleased
//        this.data.inputContext = input.RegisterInputContextRaw("EaterInput", 100);
        //console.log('input');
        Log("input");
//        this.data.inputContext.KeyPressed.connect(this, this.keyPressed);
 //       this.data.inputContext.KeyReleased.connect(this, this.keyReleased);
        //this.subscribeEvent(Tundra.input.onKeyPress(this, this.onKeyPress));
        //this.subscribeEvent(Tundra.input.onKeyRelease(this, this.onKeyRelease));
        //console.log('keypress&release subscribeEvents');
        Log("keypress&release subscribeEvents");
        //this.inputContext.KeyPress.connect(this, this.onKeyPress);
        //this.inputContext.KeyRelease.connect(this, this.onKeyRelease);
        
        
        // Monitor entity mouse clicks on hover
            //this.subscribeEvent(Tundra.input.onMousePress(this, this.onMousePress));
        this.data.subscribeEvent(input.onMousePress(this, this.onMousePress));
            //this.data.subscribeEvent(Tundra.input.onMousePress(this, this.onMousePress));
        //this.subscribeEvent(Tundra.input.onMouseMove(this, this.onMouseMove));
        //this.subscribeEvent(Tundra.input.onButtonClick(this, this.onButtonClick));
        //this.subscribeEvent(Tundra.input.onCubeRelocate(this, this.onCubeRelocate));
        //this.subscribeEvent(Tundra.input.onCubeDelete(this, this.onCubeDelete));
        /*
        me.Action("buttonclick").Triggered.connect(this, this.onButtonClick);
        me.Action("cuberelocate").Triggered.connect(this, this.onCubeRelocate);
        me.Action("cubedelete").Triggered.connect(this, this.onCubeDelete);*/

        // Listen for client/server sent entity actions
        //this.entity.onEntityAction(this, this.onEntityAction);

        // Introduce client app to the server
        //this.entity.exec(EntityAction.Server, _MSG_INTRODUCTION);

        

        
        

        
        //Create camera
        this.createCamera();
        console.log("createCamera -done");

        this.initUi();
    //    
        //Connect onSceneResized() to be called when user changes the window size.
        ui.GraphicsScene().sceneRectChanged.connect(this, this.onSceneResized);
        this.onSceneResized(ui.GraphicsScene().sceneRect);

//        create_eater = new THREE.Eater();
//        create_eater.calllback = function (object) {
//            addEater(object, -60, 4,25, 1); //10
//        }
        
    },

//    onActiveCameraChanged : function(activeCameraComponent, prevCameraComponent)
//    {
//        var cameraName = (activeCameraComponent.parentEntity ? activeCameraComponent.parentEntity.name : "");
//        if (cameraName === "" || !cameraName)
//            return;
        // Adjust far plane to handle big scene for Meshmoon GEO functionality
//        this.camera = activeCameraComponent.parentEntity;
        //this.camera.camera.farPlane = 1000000;

//        this.log.debug("Active camera changed", this.camera.name);

        // If RTS camera execute configuration
    //    if (this.camera.name === "MeshmoonRtsCamera" && this.state.camera.configured === undefined)
    //    {
    //        this.state.camera.configured = true;
    //        this.timing.async("rts.config", function() {
    //            this.camera.exec(EntityAction.Local, "SetRotation", { x : -40, y : 0, z : 0 });
    //            this.camera.exec(EntityAction.Local, "SetDistance", 5000);
    //            this.camera.exec(EntityAction.Local, "SetMinDistance", 200);
    //            this.camera.exec(EntityAction.Local, "SetMaxDistance", this.camera.camera.farPlane * 0.4);
    //        }, 100);
    //    }

//    },


    

    initUi : function()
    {
        this.ui = {};
        this.ui.baseCSS = {
            "position" : "absolute",
            "padding"  : 10,
            "top" : 25,
            "left" : 25,
            "font-family" : "RobotoDraft, Arial",
            "color" : "white",
            "background-color" : "rgba(8,149,195,0.8)"
        };

        this.cubeButton = $("<button/>", { text : "Add cubes and start", id : "cubeButton"});
        //this.ui.welcome = $("<button/>", { text : "Add cube to random place" });

        //this.cubeButton.posButton = $("<button/>", { text : "Add" });
        
        //this.mouseMenu = $("<div/>" {id: "menu"});
        // create two buttons
        //this.mouseMenu.posButton = $("<button/>" {text : "Relocate", id: "relocate"});
        //this.mouseMenu.b2 = $("<button/>" {text : "Delete", id: "delete"});
        
        //var posButton = 
        //var delButton = 
        
        //this.mouseMenu.append(posButton);
        //this.mouseMenu.append(delButton);
        
        var that = this;
        this.cubeButton.click(function( event ) 
        {
            //event.preventDefault();
            console.log("BUTTON CLICKED");
            //onButtonClick();
            that.entity.exec(EntityAction.Server, "buttonclick");
            //this.cubeButton.disabled = "true";
            //this.cubeButton.onClick="this.disabled=true;";
        });/**/
        
        this.cubeButton.css(this.ui.baseCSS);
        this.cubeButton.hide();

        this.framework.ui.addWidgetToScene(this.cubeButton);
        //this.framework.ui.addWidgetToScene(this.mouseMenu);
        this.cubeButton.fadeIn(5000);

        //this.mouseMenu.fadeIn(5000);

        //this.selectionMenu = document.createElement("menu-element");
        //this.selectionMenu.hidden = true;
        //Tundra.ui.add(this.selectionMenu);

    },
    
    keyPressed: function(keyEvent)
    {
        if(keyEvent.IsRepeat())
            return;
        
        if(keyEvent.keyCode == Qt.Key_W)
            me.Exec(2, _MSG_MOVE, "forward");
        else if(keyEvent.keyCode == Qt.Key_S)
            me.Exec(2, _MSG_MOVE, "backward");
        else if(keyEvent.keyCode == Qt.Key_A)
            me.Exec(2, _MSG_MOVE, "left");
        else if(keyEvent.keyCode == Qt.Key_D)
            me.Exec(2, _MSG_MOVE, "right");
            
        //if(keyEvent.keyCode == Qt.Key_N)
         //   me.Exec(2, _MSG_NEW_CUBE);
    },
    
    keyReleased: function(keyEvent)
    {
        if(keyEvent.keyCode == Qt.Key_W)
            me.Exec(2, _MSG_MOVE_STOP, "forwardStop");
        else if(keyEvent.keyCode == Qt.Key_S)
            me.Exec(2, _MSG_MOVE_STOP, "backwardStop");
        else if(keyEvent.keyCode == Qt.Key_A)
            me.Exec(2, _MSG_MOVE_STOP, "leftStop");
        else if(keyEvent.keyCode == Qt.Key_D)
            me.Exec(2, _MSG_MOVE_STOP, "rightStop");
    },

/*
    onKeyPress: function(key)
    {
        //if(key.pressed() == true) //keyEvent.IsRepeat())
        if(key.isRepeat()) //keyEvent.IsRepeat())
            return;
        
        if(key.keyCode == Qt.Key_Up)
        {
            this.Exec(2, _MSG_MOVE, "forward");
            console.log("forward");
        }
        else if(key.keyCode == Qt.Key_Down)
            me.Exec(2, _MSG_MOVE, "backward");
        else if(key.keyCode == Qt.Key_Left)
            me.Exec(2, _MSG_MOVE, "left");
        else if(key.keyCode == Qt.Key_Right)
            me.Exec(2, _MSG_MOVE, "right");
    },
    
    onKeyRelease: function(key)
    {
        if(key.keyCode == Qt.Key_Up)
            me.Exec(2, _MSG_MOVE_STOP, "forwardStop");
        else if(key.keyCode == Qt.Key_Down)
            me.Exec(2, _MSG_MOVE_STOP, "backwardStop");
        else if(key.keyCode == Qt.Key_Left)
            me.Exec(2, _MSG_MOVE_STOP, "leftStop");
        else if(key.keyCode == Qt.Key_Right)
            me.Exec(2, _MSG_MOVE_STOP, "rightStop");
    },
  */  
    onSceneResized: function(rect)
    {
        
    },

    /*
        Script destroy/unload handler. Called automatically 
        by the framework when the application is closed.
    */
//    onScriptDestroyed : function()
//    {
//        this.log.info("Shutting down");

        // Clean up any UI created by this application.
//        if (this.ui && this.ui.welcome)
//            this.ui.welcome.remove();
//        this.ui = null;
 //   },

    createCamera: function() //function(parent) 
    {        
        console.log("createCamera function");
        //if(!scene.EntityByName("Camera"))
        //{
            var cameraEntity = Tundra.scene.CreateLocalEntity(Tundra.scene.NextFreeId(), ["Name", "Camera", "Placeable"]);
            //var cameraEntity = Tundra.renderer.activeCameraEntity();
            
            if(cameraEntity != null)
            {
                cameraEntity.placeable.parentRef = "Eater";
                cameraEntity.name = "Camera";
                console.log("camera: " +cameraEntity.name);
                var cameraTransform = cameraEntity.placeable.transform;
                cameraTransform.pos = new float3(-85, 25, 28); //eater -60, 4,25
                cameraTransform.rot.y = 0; //180;
                cameraEntity.placeable.transform = cameraTransform;
                
                cameraEntity.temporary = true;                
                cameraEntity.camera.SetActive(); //true
                
            }
            else 
                Log("Camera not found");            
        //}
    },



    /*
    onMouseMove : function(event)      
    {
        var result = this.framework.renderer.raycast();
        if (result.entity != null && result.entity.name == "cube")
        {
            this.selectionMenu.style.left = event.x + 'px';
            this.selectionMenu.style.top = event.y + 'px';
        }
            


        else
            this.ui.help.text("Click gfdsg...");
    },
    */
  
/*talteen
    onMouseMove : function()      
    {
        var result = this.framework.renderer.raycast();
        if (result.entity != null && result.entity.name == "cube")
            this.ui.help.text("Click me");
        else
            this.ui.help.text("Click the cube to command the server to toggle rotation state");
    },
    */
  
    onMousePress : function(event)    
    {
        //this.mouseMenu.fadeIn(5000);
        //var posX = event.x;
        //var posY = event.y;
    
        // Raycast to our cube, if hit, send entity action to the server.
        var result = this.framework.renderer.raycast();
        if (result.entity != null && result.entity.name == "bluecube")
        {
            // TODO näytä menu kyseisen cuben kohdalla
            
            this.selectionMenu.style.left = event.x + 'px';
            this.selectionMenu.style.top = event.y + 'px';

            this.selectionMenu.hidden = false;
        }
            //this.entity.exec(EntityAction.Server, "cuberelocate", [result.entity.id]);
        else
        {
           // this.selectionMenu.hidden = true;
        }


    },

    

    /*talteen
    onMousePress : function(event)    
    {
        //this.mouseMenu.fadeIn(5000);
        //var posX = event.x;
        //var posY = event.y;
    
        // Raycast to our cube, if hit, send entity action to the server.
        var result = this.framework.renderer.raycast();
        if (result.entity != null && result.entity.name == "cube")
            this.entity.exec(EntityAction.Server, "cuberelocate", [result.entity.id]);
    },
    */
  
//    onEntityAction : function (entityAction)
//    {
//        if (entityAction.name === _MSG_INTRODUCTION)
//        {
//            this.log.info("Server messaged it is ready");
//        }
//    },

    shutDown: function()
    {
        this.data = null;
    }
});

//Name for a fighter entity
function EaterName()
{
    return "Eater";
}

/*
Script destroy/unload handler.
Called from EC_Script automatically.
*/
function OnScriptDestroyed()
{
    /** Note: if you have client and server classes
        both should implement your shutdown function.
        This way you don't need any custom checkingh here.*/
    if(_p != null)
    {
        _p.shutDown();
        _p = null;
    }
}

/*Bootstrapper, initialize client and server class instances.*/
if(IsClient())
    _p = new Client();
else
    _p = new Server();
























/*
var Client = Class.extend(
{
    init: function()
    {
        LogInfo("Client started");

        //Initialize data objects
        this.data = {};
        
        //Register raw input context and connect KeyPressed and KeyReleased
        this.data.inputContext = input.RegisterInputContextRaw("FighterInput", 100);
        this.data.inputContext.KeyPressed.connect(this, this.keyPressed);
        this.data.inputContext.KeyReleased.connect(this, this.keyReleased);

        //Connect onSceneResized() to be called when user changes the window size.
        ui.GraphicsScene().sceneRectChanged.connect(this, this.onSceneResized);
        this.onSceneResized(ui.GraphicsScene().sceneRect);

        this.initUi();

        // Listen for client/server sent entity actions
        me.Action(_MSG_INTRODUCTION).Triggered.connect(this, this.onServerIntroduction);

        // Introduce client app to the server
        me.Exec(EntityAction.Server, _MSG_INTRODUCTION);
    },

    shutDown : function()
    {
        Log("Shutting down");

        // Clean up any UI created by this application.
        ui.RemoveWidgetFromScene(this.ui.proxy);
        this.ui = null;
    },

    initUi : function()
    {
        var baseCSS = "QLabel { color: white; font-size: 14px; background-color: rgba(8,149,195,210); border: 0px; padding: 25px; }";

        this.ui = {};
        this.ui.welcome = new QLabel("Welcome to the '" + _applicationName + "' application");
        this.ui.welcome.styleSheet = baseCSS;

        this.ui.proxy = ui.AddWidgetToScene(this.ui.welcome);
        this.ui.proxy.windowFlags = Qt.Widget;

        this.ui.welcome.move(25, 25);
        this.ui.welcome.visible = true;
    },*/
/*
    keyPressed: function(keyEvent)
    {
        if(keyEvent.IsRepeat())
            return;
        
        if(keyEvent.keyCode == Qt.Key_Up)
            me.Exec(2, _MSG_MOVE, "forward");
        else if(keyEvent.keyCode == Qt.Key_Down)
            me.Exec(2, _MSG_MOVE, "backward");
        else if(keyEvent.keyCode == Qt.Key_Left)
            me.Exec(2, _MSG_MOVE, "left");
        else if(keyEvent.keyCode == Qt.Key_Right)
            me.Exec(2, _MSG_MOVE, "right");
    },
    
    keyReleased: function(keyEvent)
    {
        if(keyEvent.keyCode == Qt.Key_Up)
            me.Exec(2, _MSG_MOVE_STOP, "forwardStop");
        else if(keyEvent.keyCode == Qt.Key_Down)
            me.Exec(2, _MSG_MOVE_STOP, "backwardStop");
        else if(keyEvent.keyCode == Qt.Key_Left)
            me.Exec(2, _MSG_MOVE_STOP, "leftStop");
        else if(keyEvent.keyCode == Qt.Key_Right)
            me.Exec(2, _MSG_MOVE_STOP, "rightStop");
    },*/
    
/*    onSceneResized: function(rect)
    {
        
    },

    shutDown: function()
    {
        this.data = null;
    }//,

//    onServerIntroduction : function()
//    {
//        Log("Server messaged it is ready");
//    }
});


//Name for a fighter entity
function EaterName()
{
    return "Eater";
}


// Script destroy/unload handler. Called automatically 
// by the framework when the application is closed.

function OnScriptDestroyed()
{
    if (_appInstance != null)
    {
        if (typeof _appInstance.shutDown === "function")
            _appInstance.shutDown();
        _appInstance = null;
    }
}

// Initialize client or server instances,
// dependeing where the script is being ran.

if (IsClient())
    _appInstance = new Client();
else
    _appInstance = new Server();

*/