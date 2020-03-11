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

      $.getJSON("./abi_json/abi.json", function(data){
          abi = data;
      });
}

function view() {
    let contracts = $('.contractAddress').val();
    let MyContract = new web3.eth.Contract(abi, contracts);
    $(".result_medical, .noti, .text-fail, .text-successful, .loading, .noti").css("display", "none");
    MyContract.methods.getPatientLimit().call({ from: address, to: contracts }, (err, res) => {
        if (res) {
            var sympton = res[3].split(',');
            var medicine = res[4].split(',');
            $(".result_name").text(res[0]);

            sympton.forEach(item => {
              $( ".listSympton").append( "<input type='text' class='form-control result_sympton' value='"+ item +"' readonly>" );
            });

            medicine.forEach(item => {
              $( ".listMedicine").append( "<input type='text' class='form-control result_medicine' value='"+ item +"' readonly>" );
            })
            $(".result_gender").val(res[0]);
            $(".result_age").val(res[1]);
            $(".result_disease").val(res[2]);
            $("#image").attr("src", 'https://ipfs.io/ipfs/' + res[5]);

            $('.container.result_medical').css("display","inherit");
        }
        else {
            $(".noti").css("display", "block");
        }
    })
};

function deposit() {
    let contracts = $('.contractAddress').val();
    let number = String($('.eth_number').val());
    let MyContract = new web3.eth.Contract(abi, contracts);
    let data = MyContract.methods.deposit().encodeABI();
    prepare();
    web3.eth.sendTransaction({
        from: address,
        to: contracts,
        value: web3.utils.toWei(number, 'ether'),
        data: data
      }, (err, res) => {
          if(res){
            success(res);
          }
          else{
            fail();
          }
      });
};

function withdraw() {
    let contracts = $('.contractAddress').val();
    let MyContract = new web3.eth.Contract(abi, contracts);
    let data = MyContract.methods.withdraw().encodeABI();
    prepare();
    web3.eth.sendTransaction({
        from: address,
        to: contracts,
        data: data
      }, (err, res) => {
        if(res){
            success(res);
        }
        else{
            fail();
        }
      });
};

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