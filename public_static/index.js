var address;
var abi;
const fs = require('fs');
const Web3 = require('web3');
const IPFS = require('ipfs-api');
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
function initWeb3() {
  if (typeof web3 !== 'undefined') {
    web3Provider = web3.currentProvider;
    web3 = new Web3(web3.currentProvider);
  } else {
    web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    web3 = new Web3(web3Provider);
  }
  const input = fs.readFileSync('./contracts/Record.sol');
  $.getJSON("abi_json/abi.json", function(data){
    abi = data;
});
  web3.eth.getAccounts().then(res => {
    address = res[0];
    $(".listAccount").html(res);
  });
};

  function sendData() {
    $.post('/checkDoctor', { address: address }, function (res) {
      if (res == 'True') {
        let contracts = $(".form-control.contract").val();
        let MyContract = new web3.eth.Contract(abi, contracts);

        let name = $(".form-control.name").val();
        let diseaseName = $(".form-control.disease_name").val();
        let gender = $("input[name='gender']:checked").val();
        let age = $(".form-control.age").val();
        let tempSympton = [];
        $('.form-control.sympton').each(function () {
          tempSympton.push($(this).val());
        })
        let sympton = tempSympton.join();
        let tempMedicine = [];
        $('.form-control.medicine').each(function () {
          tempMedicine.push($(this).val());
        })
        let medicine = tempMedicine.join();
        let ownership = $(".form-control.ownership").val();

        const reader = new FileReader();
        reader.onloadend = function () {
          let content = ipfs.types.Buffer.from(reader.result);
          ipfs.files.add(content).then(res => {
            let url = res[0].hash
            let data = MyContract.methods.setPatient(name, gender, age, diseaseName, sympton, medicine, url).encodeABI();
            web3.eth.sendTransaction({ from: address, to: contracts, data: data }, (err, res) => {
              if (res) {
                let transfer = MyContract.methods.transfer(ownership).encodeABI();
                web3.eth.sendTransaction({ from: address, to: contracts, data: transfer }, (err, res) => {
                  if (res) {
                    var qrcode = new QRCode("id_qrcode", {
                      text: contracts,
                      width: 100,
                      height: 100,
                      colorDark: "#000000",
                      colorLight: "#ffffff",
                      correctLevel: QRCode.CorrectLevel.H
                    });
                    $('.container.form').css("display", "none");
                    $('.container.result').css("display", "inherit");
                    $(".result_name").text(name);
                    $(".result_contract").text(contracts);
                    $(".result_gender").text(gender);
                    $(".result_age").text(age);
                    $(".result_disease").text(diseaseName);

                    tempSympton.forEach(item => {
                      $(".result_sympton").append("<li>" + item + "</li>");
                    });
                    tempMedicine.forEach(item => {
                      $(".result_medicine").append("<li>" + item + "</li>");
                    })
                    $("#image").attr("src", 'https://ipfs.io/ipfs/' + url);
                    $(".result_ownerAddress").text(ownership);
                  }
                })
              }
            })
          })
        }
        const photo = document.getElementById("image_record");
        reader.readAsArrayBuffer(photo.files[0]);
      }
      else { alert("You are not a doctor, cannot create record!!!"); }
    });
  };