pragma solidity ^0.5.0;

contract Owned {
    address owner;
    mapping(address => bool) checkResearcher;
    mapping(address => uint) checkMoney;
    mapping(address => bool) isAllow;
    mapping(address => uint) expireDate;
    address[] listResearcher;
    uint[] listExpireDate;
    
    constructor () public {
        owner = msg.sender;}
    
    modifier onlyOwner() {
       require(msg.sender == owner);_;}
    
    modifier onlyResearcher(){
        require(checkResearcher[msg.sender]);_;}
    
    modifier allAuthoriry(){
        require(isAllow[msg.sender]|| msg.sender == owner);_;}

    function transfer(address _newOwner) public onlyOwner {
        owner = _newOwner;}
}

contract Record is Owned{
        string name;
        string gender;
        uint age;
        string disease;
        string symptom;
        string medicine;
        string url;
        
    constructor(string memory input_name, string memory input_gender,
        uint input_age, string memory input_disease, string memory input_symptom, 
        string memory input_medicine,string memory input_url) public {
        name = input_name;
        gender = input_gender;
        age = input_age;
        disease = input_disease;
        symptom = input_symptom;
        medicine = input_medicine;
        url = input_url;
        }

    function getPatient() onlyOwner public view returns(string memory,string
    memory, uint, string memory, string memory, string memory, string memory){
        return (name, gender, age, disease, symptom, medicine,url);
    }
    
    function getPatientLimit() allAuthoriry public view returns(string
    memory, uint, string memory, string memory, string memory, string memory){
        return (gender, age, disease, symptom, medicine,url);
    }

    function deposit() public payable {
        checkMoney[msg.sender] += msg.value;
        checkResearcher[msg.sender] = true;
    }
    
    function withdraw() onlyResearcher public {
        if(checkResearcher[msg.sender]){
            uint amount = checkMoney[msg.sender];
            msg.sender.transfer(amount);
            delete checkMoney[msg.sender];
            delete checkResearcher[msg.sender];
        }
    }
            
    function checkBalance() public view onlyOwner returns (uint){
        return address(this).balance;}
    
    function authorization() view public onlyOwner returns (address[] memory, uint[] memory){
        return (listResearcher,listExpireDate);}
    
    function exchange(address _researcher) onlyOwner public {
            isAllow[_researcher] = true;
            msg.sender.transfer(checkMoney[_researcher]);
            expireDate[_researcher] = (now + 60*60*24*3);
            listResearcher.push(_researcher);
            listExpireDate.push(now + 60*60*24*3);
            delete checkMoney[_researcher];
            delete checkResearcher[_researcher];}
    
    function giveAuthority(address _researcher, uint time) onlyOwner public {
        isAllow[_researcher] = true;
        listResearcher.push(_researcher);
        listExpireDate.push(time);}
    
    function checkTime() onlyOwner public {
        for(uint i = 0; i< listResearcher.length; i++){
            uint time = expireDate[listResearcher[i]];
            if(time < now && time > 0){
                delete(isAllow[listResearcher[i]]);
                delete listExpireDate[i];
                delete listResearcher[i];}}}
   
   function removeAuthor(address _researcher) onlyOwner public {
       for(uint i = 0 ; i < listResearcher.length; i++){
           if(listResearcher[i] == _researcher){
                delete(isAllow[_researcher]);
                delete listExpireDate[i];
                delete listResearcher[i];}}}
}