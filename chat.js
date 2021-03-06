window.onload=function(){
            var name=User.getName();
            var id=User.getId();
            var textInput=document.getElementById('text-input');//聊天内容输入
            var sentBtn=document.getElementById('sent-btn');//发送按钮
            var nameInput=document.getElementById('name-input');//昵称输入
            
            ws = new WebSocket("ws://127.0.0.1:2346");
            //ws=new WebSocket("ws://192.168.3.76:2346");
                        
            ws.onopen = function() {
                userOnline(id,name);
            };
            
            ws.onmessage = function(e) {
                innerChat(e);             
            }
            
            nameInput.addEventListener('blur',function () {
                User.changeName(nameInput.value);
            });
            
            textInput.addEventListener('keypress',function (event) {
                if(event.keyCode==13){
                    sendMessage(id,name,textInput.value);
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

var User={
    getId:function () {        
         if(!localStorage.getItem("userid")){                       //如果没有设置过则随机生成一个
            var id=Math.floor(Math.random()*999999+1);
            var nameInput=document.getElementById('name-input');
            nameInput.value='游客-' + id;
            localStorage.setItem('username','游客-'+id);
            localStorage.setItem('userid',id);
            return localStorage.getItem("userid");        
        }else{                                                       //设置过，直接查询返回
            return localStorage.getItem("userid");
        }
           
    },
    getName:function () {
        var nameInput=document.getElementById('name-input');
        if(!localStorage.getItem("username")){                          //如果没有设置过则随机设置一个
            var id=Math.floor(Math.random()*99999+1);            
            nameInput.value='游客-' + id;
            localStorage.setItem('username','游客-'+id);
            return localStorage.getItem("username");        
        }else{                                                          //设置过，修改昵称显示并返回
            nameInput.value=localStorage.getItem("username");
            return localStorage.getItem("username");
        }     
    },
    changeName:function (newName) {
        localStorage.setItem('username',newName);                         
    }
}

  
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