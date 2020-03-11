var address = '';

function initWeb3() {
    if (typeof web3 !== 'undefined') {
        web3Provider = web3.currentProvider;
        web3 = new Web3(web3.currentProvider);
    } else {
        web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
        web3 = new Web3(web3Provider);
    }
      web3.eth.getAccounts().then(res => {
        address = res[0];
      });
};
initWeb3();

window.onload = function() {
	$(".menu.chatroom a").css({"background-color": "#111", "color": "white"});
    var messages = [];
    var socket = io.connect('http://localhost:3000');
    var field = document.getElementById("field");
    var sendButton = document.getElementById("send");  
    var content = document.getElementById("content");

    socket.on('message', function (data) {
        if(data.message) {
            messages.push(data);
            var html = '';
            for(var i=0; i<messages.length; i++) {
                if(messages[i].username == address){
                html += '<p><b style="color: red">' + (messages[i].username ? messages[i].username : 'Server') + ': </b>';
                html += messages[i].message + '</p>';
            }
                else{
                    html += '<p><b>' + (messages[i].username ? messages[i].username : 'Server') + ': </b>';
                    html += messages[i].message + '</p>';
                }
            }
            content.innerHTML = html;
            content.scrollTop = content.scrollHeight;
        } else {
            console.log("There is a problem:", data);
        }
    });

    sendButton.onclick = function() {
        initWeb3();
        setTimeout(function(){
            if(address == '') {
                alert("You have not login Metamask yet");
            } else {
                var text = (field.value).replace(/\n\r?/g, '<br />');
                field.value = '';
                socket.emit('send', { message: text, username: address });
            }
        }, 100);

    };

}