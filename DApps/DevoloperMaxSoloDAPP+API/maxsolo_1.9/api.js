/*
*********The Minima Innovation Challenge Team
*********DAO API JS
*********THE TEAM DEVELOPERS************
*********
*********
*/

//


var DEVELOPER_WALLET_ADDRESS = "";
var USER_WALLET_ADDRESS = "";
var DAO_WALLET_ADDRESS = "";

function createtheDB (){
  //Create the DB if not exists
  initsql = "CREATE TABLE IF NOT EXISTS `api` ( "
        +"  `id` IDENTITY PRIMARY KEY, "
        +"  `developerwalletaddress` varchar(512) NOT NULL, "
        +"  `userwalletaddress` varchar(512) NOT NUL, "
        +"  `date` bigint NOT NULL "
        +" )";

  //Run this..
  MDS.sql(initsql,function(msg){
    MDS.log("API Service SQL Inited..");
  });
  var fullsql = "INSERT INTO api (developerwalletaddress,userwalletaddress,date) VALUES "
      +"('"+DEVELOPER_WALLET_ADDRESS+"','"+USER_WALLET_ADDRESS+"',"+Date.now()+")";

  MDS.sql(fullsql, function(resp){
    MDS.log(JSON.stringify(resp));
    if (resp.status) {
      MDS.log("Addresses has Inserted Correctly in the DB");
      sendInfototheDAO();
    }
    else {
      MDS.log("The Addresses Change HAS NOT BEEN Inserted in the DB");
    }
  });
}

function sendInfototheDAO() {
  var operation;
  for(var z = 0; z < coin.state.length; z++) {
    if (coin.state[z].port == 0) operation = "NEWCLIENTDAPP";
    if (coin.state[z].port == 1) developer_wallet_address = DEVELOPER_WALLET_ADDRESS;
    if (coin.state[z].port == 2) user_wallet_addres = USER_WALLET_ADDRESS;
  }
  statevariables = "{\"0\":\"[NEWCLIENTDAPP]\", \"1\":\""+developer_wallet_address+"\", \"2\":\""+user_wallet_addres+"\"}";
  command = "sendpoll address:"+DAO_WALLET_ADDRESS+" amount:"+client_amount_desired+" tokenid:"+client_token_id+" state:"+statevariables+" uid:"+SENDPOLLUID;


}

function istheFirstTimeRuning(){
  MDS.sql("SELECT * from api", function(sqlmsg){
    if (sqlmsg.status) {
      if (sqlmsg.count == 0){
        MDS.log("Runing the Dapp for the first time..");
        userAddress();
        developerAddress();
        createtheDB();
        return;
      }
      else{

      }
    }
  });
}

//This function send a portion of minima to the developer's trakerDAPP and wait an automatic response about his address
function developerAddress(){

}

function daoAdress() {

}

//This function grab the user address
function userAddress(){
  let address = prompt("Please enter the address where you want to receive the tokens:", "");
  if (address == null || address == "") {
    alert("Could not set the address!");
  }else{
    MDS.log(address);
    USER_WALLET_ADDRESS = address;

  }
}
