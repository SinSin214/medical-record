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

    $.getJSON("abi_json/abi.json", function (data) {
        abi = data;
    });
}

function getRecord() {
    let record = $('.record_address').val();
    let table = $("#listRecord");
    $('#record').remove();
    $.post('/getRecord', { record: record }, function (res) {
        if (res.length > 0) {
            $('.list_record').css("display", "block");
            res = res[0];
            table.append("<tr id='record'><td>" + res.disease_name + "</td><td>" + res.date + "</td><td>" + res.name + "</td><td>" + res.address + "</td></tr>")
        }
        else alert('Record not found !');
    })
};
initWeb3();

$('#click').click(function () {
    getRecord();
})