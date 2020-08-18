
var websocket;

window.ws = {
	init:function(param){
		initWebSocket(param);
	}
}

function initWebSocket(param){
	
	// 1判断浏览器是否支持WebSocket
	if(window.WebSocket){
		
		// 2.连接WebSocket服务器
		websocket = new WebSocket("ws://localhost:8080/");
		
		websocket.onopen = function(){ 
			console.info("客户端连接成功。。。");
			// sendHeard(); // 连接服务端成功后开始发送心跳
			// closeConn();
			param.onopen();
		};
		
		websocket.onclose = function(){
			
			// 清楚定时发送心跳任务
			// clearInterval(sendHeardTime);
			
			// reConn(); // 关闭后要重连,如果重连失败会继续调用close方法
			
			// $("#showMsg").append("<span style ='color:red'>客户端断开连接</span><br>");
			console.info("客户端断开连接。。。");
			
			param.onclose();
			
		};
		
		websocket.onmessage = function(resp){
			var data = resp.data;
			if(data == "heard"){
				console.info(data);
				clearTimeout(closeConnTime); // 清除定时关闭的连接
				closeConn();
				return ;
			}
			// $("#showMsg").append("<span >"+data+"</span><br>");
			param.onmessage(data);
		};
		
	}else{
		alert("不支持WebSocket");
	}
}



// 5s发送一个心跳
var sendHeardTime;
function sendHeard(){
	sendHeardTime = setInterval(function(){
		websocket.send("heard");
	},5000);
}

// 关闭连接
var closeConnTime;
function closeConn(){
	closeConnTime = setTimeout(function() {
		websocket.close();
	}, 10000);
}

// 重新连接
function reConn(){
	console.info("重连。。");
	setTimeout(function(){
		init();
	},5000);
	
}