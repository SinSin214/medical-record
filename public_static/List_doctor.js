var address;
var abi;

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

      $.getJSON("abi_json/abi.json", function(data){
          abi = data;
      });
      getListDoctor();
}

    function getListDoctor(){
        let table = $("#listDoctor");
        $.get('/listDoctor', function (res) {
            res.forEach(item => {
                table.append("<tr><td style='font-weight: bold'>"+item.address+"</td><td>"+item.name+"</td><td>"+item.specialist+"</td><td>"+item.email+"</td><td>"+item.join_date+"</td></tr>")
            })
    })
};
initWeb3();