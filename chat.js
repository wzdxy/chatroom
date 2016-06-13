window.onload=function(){
            
            //ws = new WebSocket("ws://127.0.0.1:2346");
            ws=new WebSocket("ws://192.168.3.76:2346");
            var id=Math.floor(Math.random()*99999+1);
            var nameInput=document.getElementById('name-input');
            nameInput.value='游客-' + id;
            
            ws.onopen = function() {
                userOnline(id,nameInput.value);
            };
            
            ws.onmessage = function(e) {
                innerChat(e);             
            }
            
            textInput=document.getElementById('text-input');
            sentBtn=document.getElementById('sent-btn');
            
            textInput.addEventListener('keydown',function (event) {
                if(event.keyCode==13){
                    sendMessage(id,nameInput.value,textInput.value);
                    textInput.value='';   
                }
            })
            
            
            
            sentBtn.onclick=function () {
                if(textInput.value){
                    sendMessage(id,nameInput.value,textInput.value);
                    textInput.value='';    
                }
                    
            }
                        
       };
function sendMessage(id,name,text) {
    var message=new Object();
    message.type='speak';
    //message.id=id;
    message.name=name;
    message.text=text;    
    var messageJSON=JSON.stringify(message);
    //alert(messageJSON);
    ws.send(messageJSON);
    
}       
function userOnline(id,name) {
    var message=new Object();
    message.type='online';
    message.id=id;
    message.name=name;
    var messageJSON=JSON.stringify(message);
    //console.log(messageJSON);
    ws.send(messageJSON);
}
function innerChat(e) {
    data=JSON.parse(e.data);
    var chatList=document.getElementById('chat-list');
    var aLi=document.createElement('li');
    var aTime=document.createElement('span');
    var aName=document.createElement('span');
    var aText=document.createElement('span');
    var now=new Date();
    aTime.innerHTML=now.toLocaleTimeString();
    aTime.className='time-text';
    aName.innerHTML=data.name;
    aName.className='name-text';
    if(data.type=='online'){
        aText.innerHTML='上线了';
        aText.className="online-text";
    }else if(data.type=='speak'){
        aText.innerHTML=data.text;
        aText.className="speak-text";
    }
    aLi.appendChild(aTime);
    aLi.appendChild(aName);
    aLi.appendChild(aText);
    chatList.appendChild(aLi);
}