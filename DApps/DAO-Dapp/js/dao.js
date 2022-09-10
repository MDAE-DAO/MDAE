/*
*********The Minima Innovation Challenge Team
*********DAO API JS
*********THE TEAM DEVELOPERS************
*********
*********
*/

//    <script type="text/javascript" src="js/service.js"></script>


var DAO_WALLET_ADDRESS = "";
var SENDPOLLUID ="";
var GLOBAL = 0;
var COUNT = 0;

//send address:0x9D90EE44464722B25EA05EBC443755FB81D8AAB1077726D5A2A09010BD041184 amount:7 tokenid:0x00 state:{"0":"[BUY]", "1":"0xC6496C916268F428259FA05A979A3FDE8E0901A52525A4D73578903AE2975634", "2":"0x00", "3":"7"}
//send address:0xD9F2043CE2197E2358F7808064F448784C3290BE2BF92FA132343C19DF7295F6 amount:7 tokenid:0x00 state:{"0":"[PROFILE]", "1":"0x121312312", "2":"[DEVELOPER]", "3":"[Sports, Computers, Gaming, Minima.global]"}


/////*****MAXIMA SECTION

//This function just list the Maxima contacts
function contact(){
  MDS.cmd("maxima", function(resp) {
    if (resp.status) {
      var contact = JSON.stringify(resp.response, undefined, 2);
      document.getElementById("status-object").innerText = contact;
    }
  });
}

//This function add a Maxima contact
function addContact() {
  //Get the information
  var contactname 	= document.getElementById('namecontact').value;
	var publickey = document.getElementById('publickeycontact').value;
  var contactid = document.getElementById('idcontact').value;
  CreateContact = "maxcontacts action:add contact:"+contactid+" publickey:"+publickey
  MDS.cmd(CreateContact, function(resp) {
    if (resp.status) {
      alert("Contact Created!");
      var nodeStatus = JSON.stringify(resp.response, undefined, 2);
      document.getElementById("status-object").innerText = nodeStatus;
      //MDS.log("Contact: "+CreateContact);
      //MDS.log(JSON.stringify(resp));
      Getcontacts();
    }
    //if the response status is false
    else{
      var nodeStatus = JSON.stringify(resp, undefined, 2);
      document.getElementById("status-object").innerText = nodeStatus;
      alert("Could not create the Contact");
      //MDS.log("Contact: "+CreateContact);
      //MDS.log(JSON.stringify(resp));
    }
  });
}



//*****BALANCE SECTION

//This function just list the Minima Token Balance
function minimaBalance(){
  // run the Minima balance command to return information about the node's current balance
  MDS.cmd("balance", function(res) {
  //if the response status is true
    if (res.status) {
      //Count the numberof tokens listed
      balance = res.response;
		  //For each token do...
		  for(var i = 0; i < balance.length; i++) {
        //Look for Minima token
        if(balance[i].tokenid == "0x00"){
          //Get the values
      	  var MinimaToken = balance[i].token;
          document.getElementById("MinimaToken").innerText = MinimaToken;
          var MinimaTokenid = balance[i].tokenid;
          document.getElementById("MinimaTokenid").innerText = MinimaTokenid;
          var MinimaCoins = balance[i].coins;
          document.getElementById("MinimaCoins").innerText = MinimaCoins;
      	  var MinimaSendable 	= balance[i].sendable;
          document.getElementById("MinimaSendable").innerText = MinimaSendable;
          var MinimaTotal = balance[i].total;
          document.getElementById("MinimaTotal").innerText = MinimaTotal;
  		  }
      }
    }
    //if the response status is false
    else{
      document.getElementById("StatusBalances").innerText = "Warning: Could not retrieve current Balance Status";
    }
  });
}

//This function just list any Token Balance
function tokenBalance(){
  // run the Minima balance command to return information about the node's current balance
  MDS.cmd("balance", function(res) {
    //if the response status is true
    if (res.status) {
      //Count the numberof tokens listed
      balance = res.response;
      //Grab the token to look for its balance.
      var select = document.getElementById('tokens2');
      var value = select.options[select.selectedIndex].value;
      for(var i = 0; i < balance.length; i++) {
        //Look for the token
        if(balance[i].tokenid == value){
          //Return the function value as true and Get the values
          var Tokenid = balance[i].tokenid;
          document.getElementById("Tokenid").innerText = Tokenid;
          var Coins = balance[i].coins;
          document.getElementById("Coins").innerText = Coins;
      	  var Sendable 	= balance[i].sendable;
          document.getElementById("Sendable").innerText = Sendable;
          var Total = balance[i].total;
          document.getElementById("Total").innerText = Total;
          return;

  		  }
      }
    }
    //if the response status is false
    else{
      document.getElementById("Status-object").innerText = "Warning: Could not retrieve current Balance Status";
    }
  });
}



//***** BUY AND SEND TOKEN SECTION

//This function send a token to anyone
function sendTokens(){
  //Get the information
  var tokenid 	= document.getElementById('tokens').value;
	var address = document.getElementById('destinationaddress').value;
  var amount = document.getElementById('amount').value;
  CreateSend = "Send address:"+address+" amount:"+amount+" tokenid:"+tokenid
  MDS.cmd(CreateSend, function(resp) {
    if (resp.status) {
      alert("Token Send!");
      var nodeStatus = JSON.stringify(resp.response, undefined, 2);
      document.getElementById("status-object").innerText = nodeStatus;
    }
    //if the response status is false
    else{
      var nodeStatus = JSON.stringify(resp, undefined, 2);
      document.getElementById("status-object").innerText = nodeStatus;
      alert("Could not send the Token");
      MDS.log("Token NOT Send");
    }
  });
}

//This function create a new token
function createToken(){
  //Get the information
  var tokenname 	= document.getElementById('TokenName').value;
	var tokenamount = document.getElementById('Amount').value;
	if(tokenamount=="" || tokenamount < 0){
		alert("Invalid amount..");
		return;
	}
  CreateTokenFunction = "tokencreate name:"+tokenname+" amount:"+tokenamount
  MDS.cmd(CreateTokenFunction, function(resp) {
    if (resp.status) {
      alert("Token Created!");
      var nodeStatus = JSON.stringify(resp.response, undefined, 2);
      document.getElementById("status-object").innerText = nodeStatus;
      MDS.log("TOKEN: "+CreateTokenFunction);
      MDS.log(JSON.stringify(resp));
    }
    //if the response status is false
    else{
      var nodeStatus = JSON.stringify(resp, undefined, 2);
      document.getElementById("status-object").innerText = nodeStatus;
      alert("Could not create the Token");
    }
  });
  GetTokens();
}



//***** STAUS AND TOOLS SECTION

//This function just create a new address
function newAddress(){
  MDS.cmd("newaddress", function(resp) {
    if (resp.status) {
      var nodeStatus = JSON.stringify(resp.response, undefined, 2);
      document.getElementById("status-object").innerText = nodeStatus;
    }
  })
}

//This function just get an address
function getAddress(){
  MDS.cmd("getaddress", function(resp) {
    if (resp.status) {
      var nodeStatus = JSON.stringify(resp.response, undefined, 2);
      document.getElementById("status-object").innerText = nodeStatus;
    }
  });
}

//This function just list the coins
function coins(){
  MDS.cmd("coins", function(resp) {
    if (resp.status) {
      var nodeStatus = JSON.stringify(resp.response, undefined, 2);
      document.getElementById("status-object").innerText = nodeStatus;
    }
  });
}

//This function set a Maxima name
function setMaximaName(){
  let name = prompt("Please enter the MAXIMA Name:", "");
  if (name == null || name == "") {
    alert("Could not set the name!");
  }else{
    MDS.log(name);
    setname = "maxima action:setname name:"+name
    MDS.cmd(setname, function(resp) {
      if (resp.status) {
        alert("Name Seted!");
        MDS.cmd("maxima", function(resp) {
          if (resp.status) {
            var maximaname = resp.response.name;
            document.getElementById("maximacontactname").innerText = maximaname;
          }
        });
      }
      //if the response status is false
      else{
        var nodeStatus = JSON.stringify(resp.response, undefined, 2);
        document.getElementById("status-object").innerText = nodeStatus;
        alert("Could not set the name!");
      }
    });
  }
}

//This function just shows the main wallet address
function mainWalletAddress(){
  MDS.sql("SELECT * from daowalletaddress",function(sqlmsg){
    if (sqlmsg.status) {
      var sqlrows = sqlmsg.rows;
      //Takes the last address recorded
      let i = (sqlrows.length -1);
      var sqlrow = sqlrows[i];
      var nodeStatus = JSON.stringify(sqlrow, undefined, 2);
      DAO_WALLET_ADDRESS = sqlrow.WALLETADDRESS;
      document.getElementById("walletaddress").innerText = DAO_WALLET_ADDRESS;
      var nodeStatus = JSON.stringify(sqlrow, undefined, 2);
      document.getElementById("status-object").innerText = nodeStatus;

    }else{
      var nodeStatus = JSON.stringify(sqlmsg, undefined, 2);
      document.getElementById("status-object").innerText = nodeStatus;
      MDS.log(JSON.stringify(sqlmsg));
    }

  });
}

//This function set the DAO wallet address
function setDAOWalletAddress() {
  let address = prompt("Please paste here the Wallet Address:", "");
  if (address == null || address == "") {
    alert("Could not set the Address!");
  }else{
    var fullsql = "INSERT INTO daowalletaddress (walletaddress,date) VALUES "
  			+"('"+address+"',"+Date.now()+")";

  	MDS.sql(fullsql, function(resp){
      MDS.log(JSON.stringify(resp));
  		if (resp.status) {
        MDS.log("DAO Wallet Address has Changed Correctly in the DB with the Following address: "+address);
        alert("DAO Wallet Address has Changed Correctly");
        DAO_WALLET_ADDRESS = address;
        mainWalletAddress();
      }
      else {
        MDS.log("The Address Change HAS NOT BEEN Inserted in the DB");
        alert("Could not set the DAO Wallet Address on the DB!");
      }
  	});
  }
}

//This function lists ALL the tokensreceived Data Base
function listtokensreceivedDB(){
  MDS.sql("SELECT * FROM tokensreceived",function(sqlmsg){
    if (sqlmsg.status) {
      var nodeStatus = JSON.stringify(sqlmsg, undefined, 2);
      document.getElementById("status-object").innerText = nodeStatus;
      MDS.log(JSON.stringify(sqlmsg));
    }else{
      var nodeStatus = JSON.stringify(sqlmsg, undefined, 2);
      document.getElementById("status-object").innerText = nodeStatus;
      MDS.log(JSON.stringify(sqlmsg));
    }
  });
}

//This function lists ALL the profiles received in the Data Base
function listprofilesreceivedDB(){
  MDS.sql("SELECT * FROM profiles",function(sqlmsg){
    if (sqlmsg.status) {
      var nodeStatus = JSON.stringify(sqlmsg, undefined, 2);
      document.getElementById("status-object").innerText = nodeStatus;
      MDS.log(JSON.stringify(sqlmsg));
    }else{
      var nodeStatus = JSON.stringify(sqlmsg, undefined, 2);
      document.getElementById("status-object").innerText = nodeStatus;
      MDS.log(JSON.stringify(sqlmsg));
    }
  });
}



//***** NEWBALANCE Recive and then send SECTION

//This function get a sendpoll uid
function getSendpolluid(){
  MDS.cmd("sendpoll action:list", function(res){
    if (res.status) {
      var suid = res.response.commands;
      var uid = suid[0];
      SENDPOLLUID = uid.uid;
    }
    else{
      var nodeStatus = JSON.stringify(res, undefined, 2);
      document.getElementById("status-object").innerText = nodeStatus;
      MDS.log(JSON.stringify(res));
    }
  });
}

function checkTokenReceived(coin, sqlmsg){
  //MDS.log(JSON.stringify(sqlmsg));
  if (sqlmsg.count == 0){
    MDS.log("NEW CLIENT TRANSACTION HAS BEEN DETECTED.."+coin.coinid);
    registerTransactionInDB(coin);
    return;
  }
  var sqlrows = sqlmsg.rows;
  for(let k = 0; k < sqlrows.length; k++) {
    var sqlrow = sqlrows[k];
    if (sqlrow.COINIDRECEIVED == coin.coinid){
      MDS.log("The Transaction ALREADY EXISTS with the Following coinid:"+coin.coinid);
      if(sqlrow.TRXDONE == "1"){
        MDS.log("..and the Transaction WAS Processed with Following Data: "+sqlrow.DATE);
        return;
      }
      else {
        //This flag can show if a transaction has not been processed yet
        MDS.log("..but the Transaction WAS NEVER Processed when it was Registered with Data: "+sqlrow.DATA);
        //Houston We Have a Problem!
        return;
      }
    }
  }
}

function tokenFromClient (coin){
  //Checking if this is a transaction with a client state variables
  var operation ="";
  for(let j = 0; j < coin.state.length; j++) {
    if (coin.state[j].port == 0) operation = coin.state[j].data;
  }
  MDS.log("It's a Client Transaction?");
  if (operation == "[BUY]" || operation == "[SELL]" || operation == "[PROFILE]") {
    return true
  }else{
    return false
  }
}

function newBalanceEvent(){
  //Load a sendpoll
  getSendpolluid()
  var command = "coins address:"+DAO_WALLET_ADDRESS;
  MDS.cmd(command, function(result){
    if (result.status){
      var coins = result.response;
      COUNT = coins.length
      MDS.log("TOTAL Coins Number to Check: "+COUNT);
			if (COUNT > 0){
				COUNT = COUNT-1;
	      MDS.log("TOTAL Coins Number to Check: "+COUNT);
	      searchSQL(coins);
			}
    }
  });
}

function searchSQL(coins){
  var coin = coins[COUNT];
  MDS.log("Coin Countdown: "+COUNT);
  MDS.log("Current coinid Checking: "+coin.coinid);
  //let fromclient
  let bool = tokenFromClient(coin);
  MDS.log(bool);
  if (bool){
    var operation ="";
    for(let j = 0; j < coin.state.length; j++) {
      if (coin.state[j].port == 0) operation = coin.state[j].data;
    }
    if (operation == "[BUY]" || operation == "[SELL]"){
      MDS.sql("SELECT * from tokensreceived WHERE coinidreceived='"+coin.coinid+"'", function(sqlmsg){
        if (sqlmsg.status) {
          COUNT = COUNT-1;
          checkTokenReceived(coin, sqlmsg);
          if (COUNT >= 0){
            searchSQL(coins);
          }
        }
      });
    }
    if (operation == "[PROFILE]"){
      MDS.sql("SELECT * from profiles WHERE coinidreceived='"+coin.coinid+"'", function(sqlmsg){
        if (sqlmsg.status) {
          COUNT = COUNT-1;
          checkTokenReceived(coin, sqlmsg);
          if (COUNT >= 0){
            searchSQL(coins);
          }
        }
      });
    }
    if (operation == "[GET_INFO]"){
      MDS.sql("SELECT * from profiles WHERE coinidreceived='"+coin.coinid+"'", function(sqlmsg){
        if (sqlmsg.status) {
          COUNT = COUNT-1;
          checkTokenReceived(coin, sqlmsg);
          if (COUNT >= 0){
            searchSQL(coins);
          }
        }
      });
    }
  }else{
    COUNT = COUNT-1;
    if (COUNT >= 0){
      searchSQL(coins);
    }
  }
}

//This function register all the transaction data in the DB
function registerTransactionInDB(coin) {
  MDS.log("Registering the Transaction in the DB..");
  var operation ="";
  for(let j = 0; j < coin.state.length; j++) {
    if (coin.state[j].port == 0) operation = coin.state[j].data;
  }
  if (operation == "[BUY]" || operation == "[SELL]"){
    //Operation from a buyier or seller client
    var client_wallet_address;
    var client_token_id;
    var client_amount_desired;
    for(var i = 0; i < coin.state.length; i++) {
      if (coin.state[i].port == 0) operation = coin.state[i].data;
      if (coin.state[i].port == 1) client_wallet_address = coin.state[i].data;
      if (coin.state[i].port == 2) client_token_id = coin.state[i].data;
      if (coin.state[i].port == 3) client_amount_desired = coin.state[i].data;
    }
    var trx_done = 0;
    var fullsql = "INSERT INTO tokensreceived (coinidreceived,amountreceived,operation,clientwalletaddress,clienttokenid,clientamountdesired,trxdone,date) VALUES "
  			+"('"+coin.coinid+"','"+coin.amount+"','"+operation+"','"+client_wallet_address+"','"+client_token_id+"','"+client_amount_desired+"','"+trx_done+"',"+Date.now()+")";

  	MDS.sql(fullsql, function(resp){
      MDS.log(JSON.stringify(resp));
  		if (resp.status) {
        MDS.log("Transaction Registered Correctly in the DB with the Following coinid: "+coin.coinid);
        //Now is time to Process the transacion and Send the tokens to the Buyer
        sendTheTokensToTheBuyer(coin);
      }
      else {
        MDS.log("Transaction NOT Inserted in the DB");
        //We sould register that problem into another DataBase. It allow to check the transacions who has not been processet although they should have been processed
      }
  	});
  }
  if (operation == "[PROFILE]"){
    //Operation from a client who wants to store his profile to the DAO DB
    var client_wallet_address;
    var profile;
    var topics_of_interest;
    for(var i = 0; i < coin.state.length; i++) {
      if (coin.state[i].port == 0) operation = coin.state[i].data;
      if (coin.state[i].port == 1) client_wallet_address = coin.state[i].data;
      if (coin.state[i].port == 2) profile = coin.state[i].data;
      if (coin.state[i].port == 3) topics_of_interest = coin.state[i].data;
    }
    var trx_done = 0;
    var fullsql = "INSERT INTO profiles (coinidreceived,amountreceived,operation,clientwalletaddress,profile,topicsofinterest,trxdone,date) VALUES "
  			+"('"+coin.coinid+"','"+coin.amount+"','"+operation+"','"+client_wallet_address+"','"+profile+"','"+topics_of_interest+"','"+trx_done+"',"+Date.now()+")";

  	MDS.sql(fullsql, function(resp){
      MDS.log(JSON.stringify(resp));
  		if (resp.status) {
        MDS.log("Profile Data Registered Correctly in the DB with the Following coinid: "+coin.coinid);
      }
      else {
        MDS.log("Profile Data NOT Inserted in the DB");
        //We sould register that problem into another DataBase. It allow to check the transacions who has not been processet although they should have been processed
      }
  	});
  }
  if (operation == "[GET_INFO]"){
    //Operation from a client who wants to store his profile to the DAO DB
    var maxima;
    var dapps;
    var topics_of_interest;
    for(var i = 0; i < coin.state.length; i++) {
      if (coin.state[i].port == 0) operation = coin.state[i].data;
      if (coin.state[i].port == 1) dapps = coin.state[i].data;
      if (coin.state[i].port == 2) maxima = coin.state[i].data;
      if (coin.state[i].port == 3) topics_of_interest = coin.state[i].data;
    }


    var fullsql = "INSERT INTO profiles (coinidreceived,amountreceived,operation,clientwalletaddress,profile,topicsofinterest,trxdone,date) VALUES "
  			+"('"+coin.coinid+"','"+coin.amount+"','"+operation+"','"+client_wallet_address+"','"+profile+"','"+topics_of_interest+"','"+trx_done+"',"+Date.now()+")";

  	MDS.sql(fullsql, function(resp){
      MDS.log(JSON.stringify(resp));
  		if (resp.status) {
        MDS.log("Profile Data Registered Correctly in the DB with the Following coinid: "+coin.coinid);
      }
      else {
        MDS.log("Profile Data NOT Inserted in the DB");
        //We sould register that problem into another DataBase. It allow to check the transacions who has not been processet although they should have been processed
      }
  	});
  }
}

//This function sends the tokens to the buyer once all has been checked
function sendTheTokensToTheBuyer(coin){

  MDS.log("Preparing the Transaction with the Following coind: "+coin.coinid);
  //MDS.log(JSON.stringify(coin));
  //Note that the state variables has changed and adapted to the client database.
  var operation;
  var client_wallet_address;
  var client_token_id;
  var client_amount_desired;
  for(var z = 0; z < coin.state.length; z++) {
    if (coin.state[z].port == 0) operation = coin.state[z].data;
    if (coin.state[z].port == 1) client_wallet_address = coin.state[z].data;
    if (coin.state[z].port == 2) client_token_id = coin.state[z].data;
    if (coin.state[z].port == 3) client_amount_desired = coin.state[z].data;
  }
  MDS.log("Client Operation to Process: "+operation);
  if (operation == "[BUY]"){
    if (coin.amount == client_amount_desired){
      //*****Note that for now the exchage rate between tokens is 1:1******
      MDS.log("Transaction Checked with the Following coinid: "+coin.coinid);
      MDS.log("Sending the Tokens to the Client with the Following Client Address: "+client_wallet_address)
      statevariables = "{\"0\":\"[BUY]\", \"1\":\""+client_wallet_address+"\", \"2\":\""+client_token_id+"\", \"3\":\""+client_amount_desired+"\"}";
      command = "sendpoll address:"+client_wallet_address+" amount:"+client_amount_desired+" tokenid:"+client_token_id+" state:"+statevariables+" uid:"+SENDPOLLUID;
      //command = "send address:"+client_wallet_address+" amount:"+client_amount_desired+" tokenid:"+client_token_id+" state:"+statevariables;
      MDS.cmd(command, function(res){
      if (res.status) {
        MDS.log("The Tokens HAS BEEN SENT to Following Client Address: "+client_wallet_address);
        //actualitzate the DB as the tokens has been send
        MDS.sql("UPDATE tokensreceived SET trxdone=1 WHERE coinidreceived='"+coin.coinid+"'", function(resp){
          if (resp.status) {
            MDS.log("Transaction Updated in the Data Base");
            MDS.log("CLIENT TRANSACTION PROCESS ENDED CORRECTLY");
          }
        });
      }
      else{
          var nodeStatus = JSON.stringify(res, undefined, 2);
          document.getElementById("status-coin").innerText = nodeStatus;
          MDS.log(JSON.stringify(res));
        }
      });
    }
  }
}


//***** SERVICE.JS FUNCTIONS SECTION

//This function just update the Blockchain time
function updateTime(){
  MDS.cmd("status", function(res) {
    if (res.status) {
      const blockchaintime = res.response.chain.time;
      document.getElementById("blockchaintime").innerText = blockchaintime;
    }
  });
}

//The following functions grab the main DAO Wallet address and store the address in the DB
function setdaowalletaddress(){
  let address = prompt("Please enter the main DAO Wallet address:", "");
  if (address == null || address == "") {
    alert("Could not set the address!");
  }else{
    DAO_WALLET_ADDRESS = address;
  }
}

function processData(){
  MDS.sql("SELECT * from daowalletaddress", function(sqlmsg){
    if (sqlmsg.status) {
      if (sqlmsg.count == 0){
        MDS.log("Runing the Dapp for the first time..");
        setdaowalletaddress();
        insertDAta();
        if (sqlmsg.status) {
        }else{
          MDS.log(JSON.stringify(sqlmsg));
        }
      }
      else{
        mainWalletAddress();
      }
    }
  });
}

function insertDAta(){
  var fullsql = "INSERT INTO daowalletaddress (walletaddress,date) VALUES "
      +"('"+DAO_WALLET_ADDRESS+"',"+Date.now()+")";

  MDS.sql(fullsql, function(resp){
    MDS.log(JSON.stringify(resp));
    if (resp.status) {
      MDS.log("Addresses HAS BEEN Inserted Correctly in the DB");
			alert("Wallet Address has Changed Correctly");
    }
    else {
      MDS.log("The Addresses HAS NOT BEEN Inserted in the DB");
    }
  });
}
