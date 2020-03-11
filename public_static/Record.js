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

function getInfo() {
    let contracts = $('.contractAddress').val();
    let MyContract = new web3.eth.Contract(abi, contracts);
    $('.loading').css('display','none');
    MyContract.methods.getPatient().call({ from: address, to: contracts }, (err, res) => {
        if (res) {
            var sympton = res[4].split(',');
            var medicine = res[5].split(',');
            $('.container.result_medical').css("display", "inherit");
            $(".result_name").val(res[0]);
            sympton.forEach(item => {
                $(".listSympton").append("<input type='text' class='form-control result_sympton' value='" + item + "' readonly>");
            });

            medicine.forEach(item => {
                $(".listMedicine").append("<input type='text' class='form-control result_medicine' value='" + item + "' readonly>");
            })
            $(".result_name").val(res[0]);
            $(".result_gender").val(res[1]);
            $(".result_age").val(res[2]);
            $(".result_disease").val(res[3]);
            $("#image").attr("src", 'https://ipfs.io/ipfs/' + res[6]);
        }
        else {
            $(".noti").css("display", "block");
        }
    })
}

function getAuthorization() {
    contracts = $('.contractAddress').val();
    let MyContract = new web3.eth.Contract(abi, contracts);
    $('.loading').css('display','none');
    MyContract.methods.authorization().call({ from: address, to: contracts }, (err, res) => {
        if (res) {
            for (let i = 0; i < res[0].length; i++) {
                if (res[0][i] != '0x0000000000000000000000000000000000000000') {
                    let date = new Date(res[1][i] * 1000).toDateString();
                    $(".table-body").append("<tr class='row-table'> <td>" + res[0][i] + "</td><td>" + date + "</td></tr>")
                }
            }
            $('.container.result_authorization').css("display", "inherit");
        }
        else {
            $(".noti").css("display", "block");
        }
    })
}

function remove() {
    contracts = $('.contractAddress').val();
    let remove = $('.trading_address').val();
    let MyContract = new web3.eth.Contract(abi, contracts);
    let data = MyContract.methods.removeAuthor(remove).encodeABI();
    prepare();
    web3.eth.sendTransaction({ from: address, to: contracts, data: data }, (err, res) => {
        $('.result_balance, .result_authorization, .result_medical').css("display", "none");
        if (res) {
            success(res);
        } else {
            fail()
        };
    });
}

function giveAuthor() {
    let contracts = $('.contractAddress').val();
    let researcher = $('.address_input').val();
    let day = $('.day').val();
    var dateTime = parseInt(new Date().getTime() / 1000) + (Number(day) * 60 * 60 * 24);
    let MyContract = new web3.eth.Contract(abi, contracts);
    let data = MyContract.methods.giveAuthority(researcher, dateTime).encodeABI();
    prepare();
    web3.eth.sendTransaction({ from: address, to: contracts, data: data }, (err, res) => {
        if (res) {
            success(res);
        } else {
            fail()
        };
    })
}

function trade() {
    let contracts = $('.contractAddress').val();
    let researcher = $('.trading_address').val();
    let MyContract = new web3.eth.Contract(abi, contracts);
    let data = MyContract.methods.exchange(researcher).encodeABI();
    prepare();
    web3.eth.sendTransaction({ from: address, to: contracts, data: data }, (err, res) => {
        if (res) {
            success(res);
        } else {
            fail()
        };
    })
}

function expire() {
    let contracts = $('.contractAddress').val();
    let MyContract = new web3.eth.Contract(abi, contracts);
    let data = MyContract.methods.checkTime().encodeABI();
    prepare();
    web3.eth.sendTransaction({ from: address, to: contracts, data: data }, (err, res) => {
        if (res) {
            success(res);
        } else {
            fail()
        };
    })
}

function success(data) {
    $(".transaction").text(data);
    $(".circle-loader-later").toggleClass("checkmark-later");
    $(".circle-loader-later").toggleClass("load-complete-later");
    $(".text-process").css("display", "none");
    $(".text-successful").css("display", "block");
}

function fail() {
    $(".circle-loader-later").toggleClass("failmark-later");
    $(".circle-loader-later").toggleClass("load-complete-later");
    $(".text-process").css("display", "none");
    $(".text-fail").css("display", "block");
}

function prepare(){
    $('.loading, .text-process').css("display", "block");
    if ($(".circle-loader-later").hasClass("failmark-later")) {
        $(".circle-loader-later").toggleClass("failmark-later");
    }
    else if ($(".circle-loader-later").hasClass("checkmark-later")) {
        $(".circle-loader-later").toggleClass("checkmark-later");
    }
    $(".circle-loader-later").toggleClass("load-complete-later");
}

initWeb3();