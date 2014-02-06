
	
var peers = {};
var currentRoom;

function generateRoomId(){
var chars = "0123456789abcefghijklmnopqrstuvwxyzABCEFGHIJKLMNOPQRSTUVWXYZ";
var randomId = "";

for( var i=0; i<20; i++ ){
randomId += chars.charAt( Math.random() * 60 );
}
return randomId;
}

function getRoomIdFromHash(){
var hash = window.location.hash.match( /#([0-9a-zA-Z]{20})/ );
return hash ? hash[ 1 ] : undefined;
}

function getConferenceLink( id ){
return location.protocol + "//" + location.host + "/conference#" + id ;
}

// KO viewmodel
function ViewModel(){

this.connected = ko.observable( false );
this.joinedRoom = ko.observable( false );

this.messages = ko.observableArray( [] );
this.message = ko.observable( "" );

}

ViewModel.prototype = {

startWebcamSD: function(){
this._startStream( "webcamSD" );
},

startWebcamHD: function(){
this._startStream( "webcamHD" );
},

shareScreen: function(){
this._startStream( "screen" );
},

quitConference: function(){
BistriConference.quitRoom( currentRoom );
},

selectContent: function( model, evt ){
evt.srcElement.select();
},

sendMessage: function(){
window.displayMessage( "me > " + this.message() );
for( peer in peers ){
if( "channel" in peers[ peer ] ){
peers[ peer ].channel.send( this.message() )
}
}
this.message( "" );
},

isCompatible: function(){
return BistriConference.isCompatible();
},

_startStream: function( device ){

document.querySelector( ".stripes" ).style.display = "block";

BistriConference.startStream( device, function( stream ){

var roomId = getRoomIdFromHash() || generateRoomId();

document.querySelector( ".conference-link textarea" ).value = getConferenceLink( roomId );
document.querySelector( ".stripes" ).style.display = "none";

// when the local stream is received we attach it to a node in the page to display it
BistriConference.attachStream( stream, document.querySelector( ".local-stream" ), { autoplay: true, fullscreen: true } );

// when the local stream has been started and attached to the page
// we are ready join the conference room.
// event "onJoinedRoom" is triggered when the operation successed.
BistriConference.joinRoom( roomId );
} );
}
};

// Bistri Conference API


// when Bistri Conference api is ready "onBistriConferenceReady" function is called.
var onBistriConferenceReady = function(){

var viewModel = new ViewModel();

ko.applyBindings( viewModel );

// first we need to initialize the api with appId and appKey.
BistriConference.init( {
appId: "appId",
appKey: "appKey",
debug: true,
userId: undefined,
userName: "Bistri User"
} );

// we register an handler for "onDisconnected" event.
BistriConference.signaling.addHandler( "onDisconnected", function( data ){

// when we are disconnected from the signaling server we end all existing calls
BistriConference.endCalls( currentRoom );

// then we display the "connecting" screen
viewModel.connected( false );
} );

// we register an handler for "onConnected" event.
BistriConference.signaling.addHandler( "onConnected", function( data ){

// once we are connected to the signaling server we display the "device selection" screen
viewModel.connected( true );
} );

// we register an handler for "onJoinedRoom" event.
BistriConference.signaling.addHandler( "onJoinedRoom", function( data ){

viewModel.joinedRoom( true );

currentRoom = data.room;
//etherpad doc link id
document.getElementById('docLink').src= "http://co-work.ece.fr:9001/p/conf"+data.room;
// test if the number of users in the room is < 4
//if(data.members.length < 4){

// once user has successfully joined the room we start a call and open a data channel with every single room members
for( var i = 0; i < data.members.length; i++ ){

peers[ data.members[ i ].id ] = data.members[ i ];

// send a call request to peer
BistriConference.call( data.members[ i ].id, data.room );

// send data channel request to peer
BistriConference.openDataChannel( data.members[ i ].id, "myChannel", data.room, { reliable: true } );
}
//}
/*else{
alert("The conference room is full !!! ");
}*/
} );

// we register an handler for "onJoinRoomError" event.
BistriConference.signaling.addHandler( "onJoinRoomError", function( data ){
} );

// we register an handler for "onJoinedRoom" event.
BistriConference.signaling.addHandler( "onQuittedRoom", function( data ){
viewModel.joinedRoom( false );
currentRoom = undefined;
BistriConference.stopStream();
var nodes = document.querySelectorAll( "div[id^=video-] video" );
for(var i=0;  i < nodes.length; i++ ){
nodes[ i ].parentNode.removeChild( nodes[ i ] );
}
count = 0;
} );

// we register an handler for "onSessionError" event.
BistriConference.signaling.addHandler( "onSessionError", function( data ){

// when an error occurred, print a message in the console
if( data && data.error && console && console.log ){
console.log( data.error );
}
} );

// we register an handler for "onPeerJoinedRoom" event, triggered when a remote user join a room
BistriConference.signaling.addHandler( "onPeerJoinedRoom", function( data ){
peers[ data.pid ] = data;
} );

// we register an handler for "onPeerQuittedRoom" event, triggered when a remote user quit a room
BistriConference.signaling.addHandler( "onPeerQuittedRoom", function( data ){
if( data.pid in peers ){
delete peers[ data.pid ];
isAvailablePeers();
}
} );

// we register an handler for "onJoinedRoom" event, triggered whe user joined a room
BistriConference.streams.addHandler( "onStreamAdded", function( stream, pid ){

// when a remote stream is received we attach it to a node in the page to display it
var nodes = document.querySelectorAll( ".remote-streams .span6" );

for(var i=0;  i < nodes.length; i++ ){
if( !nodes[ i ].firstChild ){
if( peers[ pid ] ){
peers[ pid ].name = "peer " + ( i + 1 );
}
BistriConference.attachStream( stream, nodes[ i ], { autoplay: true, fullscreen: true } );
break;
}
}
} );

// we register an handler for "onStreamClosed" event.
BistriConference.streams.addHandler( "onStreamClosed", function( stream, pid ){

// when a stream is closed we detach it from the page
BistriConference.detachStream( stream, true );
} );

function setDataChannelsEvents( channel, pid ){
channel.onOpen = function( event ){
if( !( pid in peers ) ){
peers[ pid ] = {};
}
peers[ pid ].channel = channel;
isAvailablePeers();
}
channel.onClosed = function( event ){
if( pid in peers ){
delete peers[ pid ].channel;
}
isAvailablePeers();
}
channel.onMessage = function( event ){
window.displayMessage( peers[ pid ].name + " > " + event.data );
}
}

function isAvailablePeers(){
var channelExists = false;
var input = document.querySelector( ".message-field" );
var panel = document.querySelector( ".messages" );
for( peer in peers ){
if( peers[ peer ][ "channel" ] ){
channelExists = true;
}
}
input[ channelExists ? "removeAttribute" : "setAttribute" ]( "readonly", true );
panel.style.backgroundColor = channelExists ? "#fff" : "#f5f5f5";
}

window.displayMessage = function( message ){
var panel = document.querySelector( ".messages" );
viewModel.messages.push( message );
panel.scrollTop = panel.scrollHeight;
};

// we register an handler for "onDataChannelCreated" event.
BistriConference.channels.addHandler( "onDataChannelCreated", setDataChannelsEvents );

// we register an handler for "onDataChannelRequested" event.
BistriConference.channels.addHandler( "onDataChannelRequested", setDataChannelsEvents );

// connect user to the signaling server.
// event "onConnected" is triggered when the operation successed.
if( BistriConference.isCompatible() ){
BistriConference.connect();
}

};