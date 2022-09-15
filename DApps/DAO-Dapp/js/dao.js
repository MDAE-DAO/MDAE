/*
*********The Minima Innovation Challenge Team
*********DAO API JS
*********THE TEAM DEVELOPERS************
*********
*********
*/

//    <script type="text/javascript" src="js/service.js"></script>




/*BUY
port == 0 operation
port == 1 client_wallet_address
port == 2 client_token_id
port == 3 client_amount_desired
port == 4 client_publickkey

send address:0xC7940D0A24294691342706CCD7F2468DEB3555E5914E3586F90F0B7C6AE468B5 amount:10 tokenid:0x00 state:{"0":"[BUY]", "1":"0x7D6877B7C0B2202650DE4E829569350B6371245CEFADAABAF2AF3F4AFBAD3CA1", "2":"0x2FC125D31A832BEC3AF044633CA1B9683F35DBB2A83653C9FCDB197E76B23B3A", "3":"2", "4":"0x549E84F7F39B7AB9562D1C91C55DEC7BE6A966368814D89503D65E77935DDD3C"}
*/

/*GET_INFO
port == 0 operation
port == 1 dappcode
port == 2 topics_of_interest
port == 3 contactid
port == 4 publickey

send address:0xADD56E54F84D6A76EB05B8227FC2ECE9CAB13ECD205D9198354DB940C3C906B6 amount:1 tokenid:0x00 state:{"0":"[GET_INFO]", "1":"7646796", "2":"[sports]", "3":"[MxG18HGG6FJ038614Y8CW46US6G20810K0070CD00Z83282G60G1392G6KQFUQ1M5GKEW0AJMJZDGZKM4F4754GGZJMF9DSBFBGEYVY428PDMDAZ9PTS9USY4Z49CZVZBQ5WCRPVP063JNQRSA76E7SZN1K7H6WEGPQRW8EEMC6CTN1QQTDP4NUE69VYHUWMWT8NJR9GHDSVGSZZTTJSDCQNK5ZPMYJQJY3NJBSFRZVMB8PSDPSA6W1N42BHP7CVK10608004KW8DZM@192.168.1.248:10001]",  "4":"0x30819F300D06092A864886F70D010101050003818D00308189028181009AB970235A0CCD164F7CD0369ABF05335D17ED5DEC437D3B377AD5B918D2B98F60DC4993ECBA065F5EA01B3D7F07CF984A5D9DD9BF6972F67F74B31680D3C62BF48272590C18F3F6D3065BB38F7059896F6C12D66BEEAFB2D1E6DA6976F6A9CDD033F65A575E4A2B91E745CE16BDFE1465ECDAD63901073EF3CA99DEFBEE7C410203010001"}
}*/

/*PROFILE
port == 0 operation
port == 1 client_wallet_address
port == 2 profile
port == 3 topics_of_interest
send address:0xADD56E54F84D6A76EB05B8227FC2ECE9CAB13ECD205D9198354DB940C3C906B6 amount:10 tokenid:0x00 state:{"0":"[PROFILE]", "1":"0xE71CD49075969D6B290BD732841A7672976E15737BF5C5511712CCA5C9BBD91E", "2":"[user]", "3":"[sports]"}
*/


//tokencreate name:"aMDAE" amount:5000 decimals:0 state:{"0":"0xA2784D94B13C114BB3937118BB2419A3712D871C767202A3B178F6905728D0DA","1":"0x39383D810DC3A733E22344E02B97C940EB7A7AD4FAE918403E71FB5998C9E3C8","2":"0x62A8D572CB69B82F3ED3AE215D16F340A0EF231164D9557D6B10D24D70C4DD06","3":"0x1B17E4607ABDD642A65409A1D27D28DF628219D77B4512FA3D58A4BBE613F309","4":"0x4712CD047BDC4233788709BF5258F5F88495B986CE1F0AFAEA9A89E8EEAFB441","5":"0xE9C2AD0CF3E65DC3F85DFB9C23FCE05B1EC4CEF09ADE5D48B31E347054E772EC","6":"0.2","7":"0.2","8":"0.2","9":"1"}



var DAO_WALLET_ADDRESS = "";
var SENDPOLLUID ="";
var GLOBAL = 0;
var COUNT = 0;

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
  let address = prompt("Please paste here the MAIN DAO Wallet Address:", "");
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
      else if(sqlrow.OPERATION != "[PROFILE]") {
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
  MDS.log("Is it a Client Transaction?");
  if (operation == "[BUY]" || operation == "[SELL]" || operation == "[PROFILE]" || operation == "[GET_INFO]") {
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
	      searchSQL(coins);
			}
    }
  });
}

function searchSQL(coins){
  var coin = coins[COUNT];
  MDS.log("Coin Countdown: "+COUNT);
  MDS.log("Current coinid Checking: "+coin.coinid);
  let bool = tokenFromClient(coin);
  MDS.log(bool);
  if (bool){
    var operation ="";
    for(let j = 0; j < coin.state.length; j++) {
      if (coin.state[j].port == 0) operation = coin.state[j].data;
    }
    if (operation == "[BUY]"){
      MDS.log("With Operation: "+operation);
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
      MDS.log("With Operation: "+operation);
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
      MDS.log("With Operation: "+operation);
      MDS.sql("SELECT * from advertisers WHERE coinidreceived='"+coin.coinid+"'", function(sqlmsg){
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
  var operation ="";
  for(let j = 0; j < coin.state.length; j++) {
    if (coin.state[j].port == 0) operation = coin.state[j].data;
  }
  if (operation == "[BUY]"){
    //Operation from a buyier or seller client
    MDS.log("Registering the Transaction from a BUYIER Client in the DB..");
    var client_wallet_address;
    var client_token_id;
    var client_amount_desired;
    var client_publickkey;
    for(var i = 0; i < coin.state.length; i++) {
      if (coin.state[i].port == 0) operation = coin.state[i].data;
      if (coin.state[i].port == 1) client_wallet_address = coin.state[i].data;
      if (coin.state[i].port == 2) client_token_id = coin.state[i].data;
      if (coin.state[i].port == 3) client_amount_desired = coin.state[i].data;
      if (coin.state[i].port == 4) client_publickkey = coin.state[i].data;
    }
    var trx_done = 0;
    var fullsql = "INSERT INTO tokensreceived (coinidreceived,amountreceived,operation,clientwalletaddress,clienttokenid,clientamountdesired,clientpublickkey,trxdone,date) VALUES "
  			+"('"+coin.coinid+"','"+coin.amount+"','"+operation+"','"+client_wallet_address+"','"+client_token_id+"','"+client_amount_desired+"','"+client_publickkey+"','"+trx_done+"',"+Date.now()+")";

  	MDS.sql(fullsql, function(resp){
      MDS.log(JSON.stringify(resp));
  		if (resp.status) {
        MDS.log("Transaction Registered Correctly in the DB with the Following coinid: "+coin.coinid);
        //Now is time to Process the transacion and Send the tokens to the Buyer
        sendTheTokensToTheBuyer(coin);
      }
      else {
        MDS.log("Transaction NOT Inserted in the DB with the followig coinid: "+coin.coinid);
        //We sould register that problem into another DataBase. It allow to check the transacions who has not been processet although they should have been processed
      }
  	});
  }
  if (operation == "[PROFILE]"){
    //Operation from a client who wants to store his profile to the DAO DB
    MDS.log("Registering the Transaction from a PROFILE Client in the DB..");
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
        MDS.log("Profile Data NOT Inserted in the DB with the followig coinid: "+coin.coinid);
        //We sould register that problem into another DataBase. It allow to check the transacions who has not been processet although they should have been processed
      }
  	});
  }
  if (operation == "[GET_INFO]"){
    //Operation from a client who wants to get info from the DAO profiles DB
    MDS.log("Registering the Transaction from an ADVERTISER Client in the DB..");
    var dappcode;
    var topics_of_interest;
    var contactid;
    var publickey;
    for(var i = 0; i < coin.state.length; i++) {
      if (coin.state[i].port == 1) dappcode = coin.state[i].data;
      if (coin.state[i].port == 2) topics_of_interest = coin.state[i].data;
      if (coin.state[i].port == 3) contactid = coin.state[i].data;
      if (coin.state[i].port == 4) publickey = coin.state[i].data;
    }
    var trx_done = 0;
    var fullsql = "INSERT INTO advertisers (coinidreceived,amountreceived,operation,topicsofinterest,dappcode,contactid,publickey,trxdone,date) VALUES "
  			+"('"+coin.coinid+"','"+coin.amount+"','"+operation+"','"+topics_of_interest+"','"+dappcode+"','"+contactid+"','"+publickey+"''"+trx_done+"',"+Date.now()+")";

  	MDS.sql(fullsql, function(resp){
      MDS.log(JSON.stringify(resp));
  		if (resp.status) {
        MDS.log("Advertiser Data Registered Correctly in the DB with the Following coinid: "+coin.coinid);
        sendTheDataToTheAdvertiser(coin);
      }
      else {
        MDS.log("Advertiser Data NOT Inserted in the DB with the followig coinid: "+coin.coinid);
        //We sould register that problem into another DataBase. It allow to check the transacions who has not been processet although they should have been processed
      }
  	});
  }
}

function sendTheDataToTheAdvertiser(coin){
  //For now only load the last user who has insert this topic and set manually the DAPP..
  MDS.log("Preparing the Transaction with the Following coind: "+coin.coinid);
  MDS.sql("SELECT * from profiles WHERE topicsofinterest='"+coin.topics_of_interest+"'", function(sqlmsg){
    if (sqlmsg.status) {
      MDS.log(JSON.stringify(sqlmsg));
      if (sqlmsg.count == 0){
        MDS.log("TOPIC DB: "+topics_of_interest);
        MDS.log("Any topic registered yet for the role: "+topics_of_interest);
      }
      else{
        var dappcode;
        var topics_of_interest;
        var contactid;
        var publickey;
        for(var i = 0; i < coin.state.length; i++) {
          if (coin.state[i].port == 1) dappcode = coin.state[i].data;
          if (coin.state[i].port == 2) topics_of_interest = coin.state[i].data;
          if (coin.state[i].port == 3) contactid = coin.state[i].data;
          if (coin.state[i].port == 4) publickey = coin.state[i].data;
        }
        var trx_done = 0;
        contactid = contactid.slice(1,-1); // remove "[]"
        //Add the maxima contact to the DAO
        CreateContact = "maxcontacts action:add contact:"+contactid+" publickey:"+publickey
        MDS.cmd(CreateContact, function(resp) {
          if (resp.status) {
            MDS.log("New Maxima Contact Created: "+CreateContact);
            Getcontacts();
          }
          //if the response status is false
          else{
            var nodeStatus = JSON.stringify(resp, undefined, 2);
            document.getElementById("status-object").innerText = nodeStatus;
            MDS.log(JSON.stringify(resp));
          }
        });
        var sqlrows = sqlmsg.rows;
        //Takes the last address recorded
        let j = (sqlrows.length -1);
        var sqlrow = sqlrows[j];
        var nodeStatus = JSON.stringify(sqlrow, undefined, 2);
        var client_wallet_address = sqlrow.CLIENTWALLETADDRESS;
        //Now is time to send the info via maxima
        sendinfo = "maxima action:send publickey:"+publickey+" application:Advertiser-Dapp data:"+client_wallet_address;
        MDS.cmd(sendinfo, function(resp) {
          if (resp.status) {
            MDS.log("Maxima Contact information sended with the following coinid: "+coin.coinid);
            MDS.log(JSON.stringify(resp));
            //Needs to update the trxdone at the database.
          }
          //if the response status is false
          else{
            var nodeStatus = JSON.stringify(resp, undefined, 2);
            document.getElementById("status-object").innerText = nodeStatus;
            MDS.log(JSON.stringify(resp));
          }
        });
      }
    }
  });
}

// Get the state vars of a tokenID until the last number specified by end
// The string returned is not the Json object, it is a string of type ( "0":"abc", "1":"56", "2":"ght")
function get_state_vars_string (coin, end){
  var state_vars = '';
      for(var z = 0; z < coin.state.length; z++) {
        if (coin.state[z].port < end+1) {
          state_vars += '"'+coin.state[z].port+'":'+'"'+coin.state[z].data+'",';
        } else break;
      }
  //alert(state_vars);
  return state_vars;
}

//This function sends the tokens to the buyer once all has been checked
function sendTheTokensToTheBuyer(coin){
  MDS.log("Preparing the Transaction with the Following coind: "+coin.coinid);
  var client_wallet_address;
  var client_token_id;
  var client_amount_desired;
  var client_publickkey;
  var operation;
  for(var i = 0; i < coin.state.length; i++) {
    if (coin.state[i].port == 0) operation = coin.state[i].data;
    if (coin.state[i].port == 1) client_wallet_address = coin.state[i].data;
    if (coin.state[i].port == 2) client_token_id = coin.state[i].data;
    if (coin.state[i].port == 3) client_amount_desired = coin.state[i].data;
    if (coin.state[i].port == 4) client_publickkey = coin.state[i].data;
  }
  MDS.log("Client Operation to Process: "+operation);
  if (operation == "[BUY]"){
    if (coin.amount < client_amount_desired){
      //*****Note that for now the exchage rate between tokens is 1:1******
      MDS.log("Transaction Checked with the Following coinid: "+coin.coinid);
      MDS.log("Sending the Tokens to the Client with the Following Client Address: "+client_wallet_address)
      MDS.cmd("coins tokenid:"+client_token_id, function(res){
        if (res.status) {
          MDS.log("Getting tokenid info: "+res.response[0].tokenid);
          //alert(JSON.stringify(res.response, undefined, 2));

          var state_vars = '{' + get_state_vars_string(res.response[0], 12) +
              '"10":"['+client_wallet_address+']",' +
              '"11":"['+client_amount_desired+']",' +
              '"12":"['+client_publickkey+']"}';

              alert("state vars:"+state_vars);
              //var command = 'send address:0x614190606CD54F2CF78D06813CE1BF4C71438C7897234C7D0F788D4F65F84BDE amount:'+token_amount+' state:'+state_vars;
              var command = "sendpoll address:"+client_wallet_address+" amount:"+client_amount_desired+" tokenid:"+client_token_id+" state:"+state_vars +" uid:"+SENDPOLLUID;
              alert(command);
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
                    //var nodeStatus = JSON.stringify(res, undefined, 2);
                    //document.getElementById("status-coin").innerText = nodeStatus;
                    MDS.log(JSON.stringify(res));
                  }
              });
        }
        else{
            //var nodeStatus = JSON.stringify(res, undefined, 2);
            //document.getElementById("status-coin").innerText = nodeStatus;
            MDS.log(JSON.stringify(res));
          }
      });
    }else{
      alert("Insuficient Founds Recived by the Buyer with Operation: "+operation);
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

function processData(){
  MDS.sql("SELECT * from daowalletaddress", function(sqlmsg){
    if (sqlmsg.status) {
      if (sqlmsg.count == 0){
        MDS.log("Runing the Dapp for the first time..");
        setDAOWalletAddress();
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
