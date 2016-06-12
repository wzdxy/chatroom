<?php
use Workerman\Worker;
//require_once './Workerman/Autoloader.php';
require_once 'Autoloader.php';

// 创建一个Worker监听2346端口，使用websocket协议通讯
$ws_worker = new Worker("websocket://0.0.0.0:2346");

// 启动4个进程对外提供服务
$ws_worker->count = 4;

// 当收到客户端发来的数据后返回hello $data给客户端
$ws_worker->onMessage = function($ws_worker,$data)use($ws_worker)
{
    print("log:".$data."\n");
    //var_dump(json_decode($data));
    // $receive=json_decode($data);
    // $receive[date]=time();
    // if($receive[type]=='online'){
                                
    // }else if($receive[type]=='speak'){
        
    // }
    // $response=json_encode($receive);

     foreach($ws_worker->connections as $conn)
        {
            $conn->send($data);
        }
};

// 运行worker
Worker::runAll();