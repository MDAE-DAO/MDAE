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

function createtheDB (){
  //Create the DB if not exists
        initsql = "CREATE TABLE IF NOT EXISTS `tracker` ( "
              +"  `id` IDENTITY PRIMARY KEY, "
              +"  `developerwalletaddress` varchar(512) NOT NULL, "
              +"  `userwalletaddress` varchar(512) NOT NULL, "
              +"  `date` bigint NOT NULL "
              +" )";

  //Run this..
  MDS.sql(initsql,function(msg){
    MDS.log("Tracker Service SQL Inited..");
    processData();
  });
}

function insertDAta(){
  var fullsql = "INSERT INTO tracker (developerwalletaddress,userwalletaddress,date) VALUES "
      +"('"+DEVELOPER_WALLET_ADDRESS+"','"+USER_WALLET_ADDRESS+"',"+Date.now()+")";

  MDS.sql(fullsql, function(resp){
    MDS.log(JSON.stringify(resp));
    if (resp.status) {
      MDS.log("Addresses has Inserted Correctly in the DB");
    }
    else {
      MDS.log("The Addresses Change HAS NOT BEEN Inserted in the DB");
    }
  });
}

function processData(){
  MDS.sql("SELECT * from tracker", function(sqlmsg){
    if (sqlmsg.status) {
      if (sqlmsg.count == 0){
        MDS.log("Runing the Dapp for the first time..");
        userAddress();
        developerAddress();
        insertDAta();
        if (sqlmsg.status) {
        }else{
          MDS.log(JSON.stringify(sqlmsg));
        }
      }
      else{
      }
    }
  });
}

//This function begins to check if the DAPP is runing for the first time
function runAPITracker(){
  createtheDB();
}

//For now the developer sets here his wallet addresses
function developerAddress(){
  DEVELOPER_WALLET_ADDRESS = "adressssadeprovesx0909090343434";
}

//This function grab the user address
function userAddress(){
  let address = prompt("Please enter the address where you want to receive the tokens:", "");
  if (address == null || address == "") {
    alert("Could not set the address!");
  }else{
    USER_WALLET_ADDRESS = address;
  }
}

/********************************************************
function nonamefunctionfornow {
  var operation;
  for(var z = 0; z < coin.state.length; z++) {
    if (coin.state[z].port == 0) operation = "NEWCLIENTDAPP";
    if (coin.state[z].port == 1) developer_wallet_address = DEVELOPER_WALLET_ADDRESS;
    if (coin.state[z].port == 2) user_wallet_addres = USER_WALLET_ADDRESS;
  }
  statevariables = "{\"0\":\"[NEWCLIENTDAPP]\", \"1\":\""+developer_wallet_address+"\", \"2\":\""+user_wallet_addres+"\"}";
}*/
