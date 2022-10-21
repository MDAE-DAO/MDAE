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

send address:0xADD56E54F84D6A76EB05B8227FC2ECE9CAB13ECD205D9198354DB940C3C906B6 amount:1 tokenid:0x00 state:{"0":"[GET_INFO]", "1":"7646796", "2":"[sports]", "3":"[MxG18HGG6FJ038614Y8CW46US6G20810K0070CD00Z83282G60G1CJNTAZHK4Q990JHACB6JM7UHVHC7T8K1RAFQB2943G1ZYM6S1FZAAFM41J1USJDNW9CTDH61PM0RCKEZ2N0829GKDVA2SN5RRYC1V4W1Y39512SVEKQEUSK62WJNTWYUKUFR2BFMW5VB0DCGY58TQY637ARNDTKC4TJ85F4SMG2FDK8YAPR7F23P1VEQCE152UHYQQNKBYPR410608004655WDM@192.168.1.190:10001]",  "4":"0x30819F300D06092A864886F70D010101050003818D0030818902818100A8ADDC95096C2E3529FA7A1C91282F5867ED4EF204B71A3F46C0651F38FADBD8C57AADA74BD2692E675B8DAE75E8E8132DAA6AD93DC738AC92A418C02CB52CFC8B478A9288D3EC811C9558DD4A29E01ACC21D85F38B66A951CEA469EC3C793CA5CFB07D281572906FA7607F7548A59837030C99B3B8F51461A500548B3105DAD0203010001"}
}*/

/*PROFILE
port == 0 operation
port == 1 client_wallet_address
port == 2 profile
port == 3 topics_of_interest
send address:0xADD56E54F84D6A76EB05B8227FC2ECE9CAB13ECD205D9198354DB940C3C906B6 amount:10 tokenid:0x00 state:{"0":"[PROFILE]", "1":"0xE71CD49075969D6B290BD732841A7672976E15737BF5C5511712CCA5C9BBD91E", "2":"[user]", "3":"[sports]"}

/*CONFIGURE_TOKENS
port == 0 operation
port == 1 contactid
port == 2 publickey

*/


//tokencreate name:"aMDAE" amount:5000 decimals:0 state:{"0":"0xA2784D94B13C114BB3937118BB2419A3712D871C767202A3B178F6905728D0DA","1":"0x39383D810DC3A733E22344E02B97C940EB7A7AD4FAE918403E71FB5998C9E3C8","2":"0x62A8D572CB69B82F3ED3AE215D16F340A0EF231164D9557D6B10D24D70C4DD06","3":"0x1B17E4607ABDD642A65409A1D27D28DF628219D77B4512FA3D58A4BBE613F309","4":"0x4712CD047BDC4233788709BF5258F5F88495B986CE1F0AFAEA9A89E8EEAFB441","5":"0xE9C2AD0CF3E65DC3F85DFB9C23FCE05B1EC4CEF09ADE5D48B31E347054E772EC","6":"0.2","7":"0.2","8":"0.2","9":"1"}



var DAO_WALLET_ADDRESS = "";
var SENDPOLLUID ="";
var GLOBAL = 0;
var COUNT = 0;
var ADVERTISING_TOKENS =[];

MDS.init(function(msg){
  //Do initialitzation
  if(msg.event == "inited"){
    MDS.log("The DAO app init...");
    getcontacts();
    getTokens();
    loadAdvertisingTokensFromNode();
  }
  else if(msg.event == "NEWBLOCK"){
  // the chain tip has changed
  }
  else if(msg.event == "NEWBALANCE"){
    // user's balance has changed
    MDS.log("New Balance Detected");
		//Process the new event detectedload
    newBalanceEvent();
    getcontacts();
    getTokens();
    loadAdvertisingTokensFromNode();
    minimaBalance();
  }
  else if(msg.event == "MINING"){
  // mining has started or ended
  }
  else if(msg.event == "MINIMALOG"){
  // new Minima log message
  }
  else{
  }
});


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
      getcontacts();
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

//Send the Contacts available to the dongles
function getcontacts() {
  MDS.cmd("maxcontacts", function(result) {
    //MDS.log(JSON.stringify(result));
    var contact = result.response.contacts;
    if (result.status) {
      if(contact.length==0){
        return;
      }
      else{
        //Create the select dongles
        var select = document.getElementById('contactslist');
        while (select.hasChildNodes()) {
          select.removeChild(select.firstChild);
        }
        //Add each Token
        contact = result.response.contacts;
        //Add the contacts to the dongle list contacts
        for(var i = 0; i < contact.length; i++) {
          var opt = document.createElement('option');
          opt.value = contact[i].id;
          opt.innerHTML = contact[i].extradata.name;
          document.getElementById("contactname").innerText = contact[i].extradata.name;
          document.getElementById("contactpublickey").innerText = contact[i].publickey;
          document.getElementById("contactid").innerText = contact[i].currentaddress;
          select.appendChild(opt);
        }
      }
    }
  })
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
  getTokens();
  minimaBalance();
}


//This function create a new complex token
function createComplexToken(){
  //Get the information
  var tokenname 	= document.getElementById('ComplexTokenName').value;
	var tokenamount = document.getElementById('ComplexAmount').value;
	if(tokenamount=="" || tokenamount < 0){
		alert("Invalid amount..");
		return;
	}
  var complexDecimals = document.getElementById('ComplexDecimals').value;
  var vault = document.getElementById('vault').value;
  var publickey1 = document.getElementById('publickey1').value;
  var publickey2 = document.getElementById('publickey2').value;
  var publickey3 = document.getElementById('publickey3').value;
  var dAOAddress = document.getElementById('DAOAddress').value;
  var dAOPublickey = document.getElementById('DAOPublickey').value;
  var nameOfToken = document.getElementById('ComplexTokenName').value;
  var percentagePartyComission = document.getElementById('PercentagePartyComission').value;
  var percentageUserComission = document.getElementById('PercentageUserComission').value;
  var percentageValueRewards = document.getElementById('PercentageValueRewards').value;
  var toeknPrice = document.getElementById('ToeknPrice').value;
  var tokenname = nameOfToken;
  var state_vars = '{'+
      '"0":"'+vault+'",' +
      '"1":"'+publickey1+'",' +
      '"2":"'+publickey2+'",' +
      '"3":"'+publickey3+'",' +
      '"4":"'+dAOAddress+'",' +
      '"5":"'+dAOPublickey+'",' +
      '"6":"'+percentagePartyComission+'",' +
      '"7":"'+percentageUserComission+'",' +
      '"8":"'+percentageValueRewards+'",' +
      '"9":"'+toeknPrice+'",' +
      '"99":"['+tokenname+']",' +
      '"100":"[MDAE]"}';

  CreateTokenFunction = "tokencreate name:"+nameOfToken+" amount:"+tokenamount+" decimals:"+complexDecimals+" state:"+state_vars;
  MDS.log("STATE VARS:"+CreateTokenFunction);
  MDS.cmd(CreateTokenFunction, function(resp) {
    if (resp.status) {
      alert("Token Created!");
      var nodeStatus = JSON.stringify(resp.response, undefined, 2);
      document.getElementById("status-object").innerText = nodeStatus;
      MDS.log("TOKEN: "+CreateTokenFunction);
      //MDS.log(JSON.stringify(resp.response, undefined, 2));

 //        !!!!! The tokenid is not saved on the db, we will perform a node search instead when required

/*
      //Saving to the database ...... skipping, too tricky as you only will get the tokenid once created
      //after the transaction is minted, so no easy way to get this tokenid , so instead to keeping it INTO
      //a database we will search on the node for those tokens with specific state variable setted
      var fullsql = "INSERT INTO tokenmdae (tokenid,name,description,date) VALUES "
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
*/
    }
    //if the response status is false
    else{
      var nodeStatus = JSON.stringify(resp, undefined, 2);
      document.getElementById("status-object").innerText = nodeStatus;
      alert("Could not create the Token");
    }
  });
  //getTokens();
  //minimaBalance();
}


// Returns true is a given tokenid is an Advertiser TokenName
function isAdvertiserToken(tokenID){
  for (var i=0; i < ADVERTISING_TOKENS.length; i++) {
    if (ADVERTISING_TOKENS[i].tokenid === tokenID) return true;
  }
  return false;
}

// Get the state vars specifc port data of a coin
function get_state_vars_port_data (coin, port){
  var data = null;
      for(var z = 0; z < coin.state.length; z++) {
        if (coin.state[z].port == port) {
          data = coin.state[z].data;
          break;
        }
      }

  //alert(state_vars);
  return data;
}

// It should be triggered on the init once the app loads
// This will look for publicity tokens on the node and it will set it on ADVERSING_TOKENS var
function loadAdvertisingTokensFromNode(){
  MDS.log("Loading Tokens of publicity from node to memory : ");

  // Get all tokens and only choose the publicity ones [MDAE] 100 and load to ADVERSING_TOKENS var
  MDS.cmd("coins", function(res){
    if (res.status) {
      if (res.response.length == 0) {MDS.log("...there are not coins yet to load");return;}

      //alert(JSON.stringify(res.response, undefined, 2));

      // Get the list of tokens that are publicity tokens [MDAE] state vars 100
      // skip the repeated using isAdvertiserToken()functions.

      for (var i=0; i<res.response.length; i++){
        var coin = res.response[i];
        // pick the coins with state variables set to MDAE and not minimas
        //alert(cointoken);
        if (coin.state.length != 0 && coin.tokenid !== "0x00"){
          var data = get_state_vars_port_data(coin, 100);
          //alert(data+", "+coin.token.name.name);
          if (data != null){
            if (data === "[MDAE]") {
              // if not repeated
              if (!isAdvertiserToken(coin.tokenid)){   // if true, means is already on memory,so skip it
                ADVERTISING_TOKENS.push(coin);
                MDS.log(".....loaded token:"+" "+coin.token.name.name+" -> "+coin.tokenid);
              }
            }
          }
        }
      }
    }  //if the response status is false
    else{
        MDS.log("ERROR:.....loaded token process failed, tokens are not loaded !!");
        var nodeStatus = JSON.stringify(resp, undefined, 2);
        document.getElementById("status-object").innerText = nodeStatus;
      }
    });
}

//Send the Tokens available to the dongles
function getTokens(){
  MDS.cmd("balance",function(result){
    //Create the select dongles
    var select = document.getElementById('tokens');
    while (select.hasChildNodes()) {
      select.removeChild(select.firstChild);
    }
    var select2  = document.getElementById('tokens2');
    while (select2.hasChildNodes()) {
      select2.removeChild(select2.firstChild);
    }
    //Add each Token
    balance = result.response;
    //Add the tokens to the dongle Buy a Token (spend)
    for(var i = 0; i < balance.length; i++) {
      var opt = document.createElement('option');
      if(balance[i].tokenid == "0x00"){
        opt.value = balance[i].tokenid;
        opt.innerHTML = balance[i].token;
      }else{
        opt.value = balance[i].tokenid;
        opt.innerHTML = balance[i].token.name;
      }
      select.appendChild(opt);
    }
    //Add tokens to the dongle Token balance
    for(var i = 0; i < balance.length; i++) {
      var opt = document.createElement('option');
      if(balance[i].tokenid == "0x00"){
        opt.value = balance[i].tokenid;
        opt.innerHTML = balance[i].token;
      }else{
        opt.value = balance[i].tokenid;
        opt.innerHTML = balance[i].token.name;
      }
      select2.appendChild(opt);
    }
  });
}



//***** STAUS AND TOOLS SECTION

//This function just create a new addressgetTokens
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
  }ADVERTISING_TOKENS
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

function listadvertisersDB(){
  MDS.sql("SELECT * FROM advertisersDAO",function(sqlmsg){
    if (sqlmsg.status) {
      var nodeStatus = JSON.stringify(sqlmsg, undefined, 2);
      document.getElementById("status-object").igetTokensnnerText = nodeStatus;
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
      MDS.log("The Transaction ALREADY EXISTS with the Following coinid: "+coin.coinid);
      if(sqlrow.TRXDONE == "1"){
        MDS.log("..and the Transaction WAS Processed with Following coinid: "+coin.coinid);
        return;
      }
      else if(sqlrow.OPERATION != "[PROFILE]") {
        //This flag can show if a transaction has not been processed yet
        MDS.log("..but the Transaction WAS NEVER Processed when it was Registered with the following coinid: "+coin.coinid);
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
  if (operation == "[BUY]" || operation == "[SELL]" || operation == "[PROFILE]" || operation == "[GET_INFO]" || operation == "[CONFIGURE_TOKENS]") {
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
      MDS.log("with Operation: "+operation);
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
      MDS.sql("SELECT * from advertisersDAO WHERE coinidreceived='"+coin.coinid+"'", function(sqlmsg){
        if (sqlmsg.status) {
          COUNT = COUNT-1;
          checkTokenReceived(coin, sqlmsg);
          if (COUNT >= 0){
            searchSQL(coins);
          }
        }
      });
    }
    if (operation == "[CONFIGURE_TOKENS]"){
      MDS.log("With Operation: "+operation);
      MDS.sql("SELECT * from advertisersDAO WHERE coinidreceived='"+coin.coinid+"'", function(sqlmsg){
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
    var fullsql = "INSERT INTO advertisersDAO (coinidreceived,amountreceived,operation,topicsofinterest,dappcode,contactid,publickey,trxdone,date) VALUES "
  			+"('"+coin.coinid+"','"+coin.amount+"','"+operation+"','"+topics_of_interest+"','"+dappcode+"','"+contactid+"','"+publickey+"','"+trx_done+"',"+Date.now()+")";

  	MDS.sql(fullsql, function(resp){
      MDS.log(JSON.stringify(resp));
  		if (resp.status) {
        MDS.log("Advertiser Data GET_INFO Registered Correctly in the DB with the Following coinid: "+coin.coinid);
        //alert("before sendTheDataToTheAdvertiser");
        sendTheDataToTheAdvertiser(coin);
      }
      else {
        MDS.log("Advertiser Data GET_INFO NOT Inserted in the DB with the followig coinid: "+coin.coinid);
        MDS.log("ERROR inserting Adversting Data GET_INFO: "+JSON.stringify(resp, undefined, 2));
        //We sould register that problem into another DataBase. It allow to check the transacions who has not been processet although they should have been processed
      }
  	});
  }
  if (operation == "[CONFIGURE_TOKENS]"){
    //Operation from a client who wants to get info from the DAO profiles DB
    MDS.log("Registering the Transaction from an ADVERTISER Client operation [CONFIGURE_TOKENS] in the DB..");
    var dappcode="";
    var topics_of_interest="";
    var contactid;
    var publickey;
    for(var i = 0; i < coin.state.length; i++) {
      if (coin.state[i].port == 1) contactid = coin.state[i].data;
      if (coin.state[i].port ==2) publickey = coin.state[i].data;
    }
    var trx_done = 0;
    var fullsql = "INSERT INTO advertisersDAO (coinidreceived,amountreceived,operation,topicsofinterest,dappcode,contactid,publickey,trxdone,date) VALUES "
  			+"('"+coin.coinid+"','"+coin.amount+"','"+operation+"','"+topics_of_interest+"','"+dappcode+"','"+contactid+"','"+publickey+"','"+trx_done+"',"+Date.now()+")";

  	MDS.sql(fullsql, function(resp){
      MDS.log(JSON.stringify(resp));
  		if (resp.status) {
        MDS.log("Advertiser Data CONFIGURE_TOKENS Registered[CONFIGURE_TOKENS] Correctly in the DB with the Following coinid: "+coin.coinid);
        //alert("before sendTheDataToTheAdvertiser");
        sendConfigureDataOverMaxima(coin);
      }
      else {
        MDS.log("Advertiser Data CONFIGURE_TOKENS NOT Inserted in the DB with the followig coinid: "+coin.coinid);
        MDS.log("ERROR inserting Adversting Data CONFIGURE_TOKENS: "+JSON.stringify(resp, undefined, 2));
        //We sould register that problem into another DataBase. It allow to check the transacions who has not been processet although they should have been processed
      }
  	});
  }
}

/*
.................... From MAXSOLO -------------------
*/
const utf8encoder = new TextEncoder();

function utf8ToHex(s)
{
  const rb = utf8encoder.encode(s);
  let r = '';
  for (const b of rb) {
    r += ('0' + b.toString(16)).slice(-2);
  }
  return r;
}
/*
.................... From MAXSOLO END ------------------
*/
function searchDeveloperProfileonDB(){

}


// Is using MAXIMA for rturning the asked data
function sendTheDataToTheAdvertiser(coin){
  //For now only load the last user who has insert this topic and set manually the DAPP..
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
  //alert("topics_of_interest: "+topics_of_interest);
  var trx_done = 0;
  //Object to send over MAXIMA
  var data = {};
  data.id_maxima = "";
  data.users 	= [];
  data.developers	= [];
  data.tokens_publicity = [];

  MDS.log("Preparing the Transaction with the Following coind: "+coin.coinid);
  //MDS.sql("SELECT * from profiles WHERE topicsofinterest='"+topics_of_interest+"'", function(sqlmsg){
  MDS.sql("SELECT * from profiles WHERE topicsofinterest='"+topics_of_interest+"' AND profile='[user]'", function(sqlmsg){
    if (sqlmsg.status) {
      if (sqlmsg.count > 0){
        var sqlrows = sqlmsg.rows;
        //Takes the last address recorded
        let j = (sqlrows.length -1);
        var sqlrow = sqlrows[j];
        MDS.log(JSON.stringify(sqlmsg));
        var client_wallet_address = sqlrow.CLIENTWALLETADDRESS;
        data.users.push(client_wallet_address);

        MDS.sql("SELECT * from profiles WHERE topicsofinterest='"+topics_of_interest+"' AND profile='[developer]'", function(sqlmsg2){
          if (sqlmsg2.status) {
            MDS.log(JSON.stringify(sqlmsg2));
            if (sqlmsg2.count > 0){
              var sqlrows2 = sqlmsg2.rows;
              //Takes the last address recorded
              let m = (sqlrows2.length -1);
              var sqlrow2 = sqlrows2[m];
              var client_wallet_address2 = sqlrow2.CLIENTWALLETADDRESS;
              MDS.log(JSON.stringify(sqlmsg2));
              data.developers.push(client_wallet_address2);
              MDS.log(JSON.stringify(sqlmsg));
                contactid = contactid.slice(1,-1); // remove "[]"
                publickey = publickey.slice(1,-1); // remove "[]"

                //Add the maxima contact to the DAO
                CreateContact = "maxcontacts action:add contact:"+contactid+" publickey:"+publickey;
                //alert(CreateContact);
                MDS.cmd(CreateContact, function(resp) {
                  if (resp.status) {
                    MDS.log("New Maxima Contact Created: "+CreateContact);
                    //Convert all the data object to a string..
  /*---->*/         var datastr = JSON.stringify(data);
                    //And now convert to HEX
                    var hexstr = "0x"+utf8ToHex(datastr).toUpperCase().trim();
                    //sendinfo = 'maxima action:send publickey:'+publickey+ ' to:'+contactid+' application:Advertiser-Dapp-data data:"'+client_wallet_address+'"';
                    sendinfo = 'maxima action:send publickey:'+publickey+ ' to:'+contactid+' application:Advertiser-Dapp-data data:'+hexstr;
                    alert(sendinfo);
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
                  //if the response status is false
                  else{
                    var nodeStatus = JSON.stringify(resp, undefined, 2);
                    document.getElementById("status-object").innerText = nodeStatus;
                    MDS.log("ERROR: "+JSON.stringify(resp));
                  }
                });
            } else {
              MDS.log("Warning: no results on database: "+JSON.stringify(sqlmsg2, undefined, 2));
            }
          } else {
            var nodeStatus = JSON.stringify(sqlmsg2, undefined, 2);
            document.getElementById("status-object").innerText = nodeStatus;
            MDS.log("ERROR: "+JSON.stringify(sqlmsg2));
          }
        });
      } else {
        MDS.log("Warning: no results on database: "+JSON.stringify(sqlmsg, undefined, 2));
      }
    }else {
      var nodeStatus = JSON.stringify(sqlmsg2, undefined, 2);
      document.getElementById("status-object").innerText = nodeStatus;
      MDS.log("ERROR: "+JSON.stringify(sqlmsg2));
    }
  });
}

// Is using MAXIMA for rturning the asked data
function sendConfigureDataOverMaxima(coin){
  var contactid;
  var publickey;
  for(var i = 0; i < coin.state.length; i++) {
    if (coin.state[i].port == 1) contactid = coin.state[i].data;
    if (coin.state[i].port == 2) {publickey = coin.state[i].data;break;}    //exit when found
  }

  MDS.log("Preparing the Transaction with the Following coind: "+coin.coinid);

  //alert("into else");
  contactid = contactid.slice(1,-1); // remove "[]"
  publickey = publickey.slice(1,-1); // remove "[]"
  //alert(contactid);
  //alert(publickey);
  //Add the maxima contact to the DAO
  CreateContact = "maxcontacts action:add contact:"+contactid+" publickey:"+publickey;
  //alert(CreateContact);
  MDS.cmd(CreateContact, function(resp) {
    if (resp.status){
      MDS.log("New Maxima Contact Created: "+CreateContact);
      alert("CreateContact: "+JSON.stringify(resp, undefined, 2));
      //Object to send over MAXIMA
      var data = {};
      data.id_maxima = "";
    	data.users 	= [];
    	data.developers	= [];
      data.tokens_publicity = ADVERTISING_TOKENS;
      //Convert to a string..
      var datastr = JSON.stringify(data);
      //And now convert to HEX
      var hexstr = "0x"+utf8ToHex(datastr).toUpperCase().trim();
      //sendinfo = 'maxima action:send publickey:'+publickey+ ' to:'+contactid+' application:Advertiser-Dapp-data data:"'+client_wallet_address+'"';
      sendinfo = 'maxima action:send publickey:'+publickey+ ' to:'+contactid+' application:Advertiser-Dapp-data-configure data:'+hexstr;
      alert(sendinfo);
      MDS.cmd(sendinfo, function(resp) {
        if (resp.status) {
          MDS.log("Maxima CONFIGURE_TOKENS information sended coinid: "+coin.coinid);
          MDS.log(JSON.stringify(data, undefined, 2));
        }
        //if the response status is false
        else{
          var nodeStatus = JSON.stringify(resp, undefined, 2);
          document.getElementById("status-object").innerText = nodeStatus;
          MDS.log("ERROR: Sending maxima data of Publicity Tokens: "+JSON.stringify(resp));
        }
      });
    }else{
      var nodeStatus = JSON.stringify(resp, undefined, 2);
      document.getElementById("status-object").innerText = nodeStatus;
      MDS.log("ERROR: "+JSON.stringify(resp));
    }
  });
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
    if (coin.amount == client_amount_desired){
      //*****Note that for now the exchage rate between tokens is 1:1******
      MDS.log("Transaction Checked with the Following coinid: "+coin.coinid);
      MDS.log("Sending the Tokens to the Client with the Following Client Address: "+client_wallet_address)
      MDS.cmd("coins tokenid:"+client_token_id, function(res){
        if (res.status) {
          MDS.log("Getting tokenid info: "+res.response[0].tokenid);
          //alert(JSON.stringify(res.response, undefined, 2));

          // Look for coinid which amount is bigger the amoount asked
          var token_to_send;
          for(var i = 0; i < res.response.length; i++) {
            var coin2 = res.response[i];
            if (coin2.tokenamount > parseFloat(client_amount_desired)){
              token_to_send = coin2;
              break;
            }
          }
          MDS.log("Got the token to send, amount, coinid: "+token_to_send.tokenamount+", "+token_to_send.coinid);

            var state_vars = '{' +
              '"10":"'+client_wallet_address+'",' +
              '"11":"'+client_amount_desired+'",' +
              '"12":"'+client_publickkey+'"}';
              //alert("state vars:"+state_vars);

              //var command = 'send address:0x614190606CD54F2CF78D06813CE1BF4C71438C7897234C7D0F788D4F65F84BDE amount:'+token_amount+' state:'+state_vars;
              //var command = "sendpoll address:"+client_wallet_address+" amount:"+client_amount_desired+" tokenid:"+client_token_id+" state:"+state_vars +" uid:"+SENDPOLLUID;
              var command = getManualSendTXtoken_string(token_to_send, client_amount_desired, client_wallet_address, DAO_WALLET_ADDRESS, state_vars);
              alert(command.split(";"));
              MDS.log(command.split(";"));
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

////////////////////////////////////////
//It emulates send minima command, but this version keep the change back state variables.
//Returns the changeback to the address specified
//We need to use this function whenever we want to send tokens than must preserve his state variables on the
//origin when the change back is returned
function getManualSendTXtoken_string(token, amount, targetAddress, change_back_address, state_vars){
  var change_back = token.tokenamount - amount;
  //alert(JSON.stringify(state_vars, undefined, 2));
  //Create a random txn id..
  var txnid = Math.floor(Math.random()*1000000000);

  //Construct Transaction..
  var txncreator = "txncreate id:"+txnid+";"

    // Constructs state variables, getting the tokens statevars,
    for (var i=0; i<token.state.length; i++){
      txncreator += "txnstate id:"+txnid+" port:"+token.state[i].port+" value:"+token.state[i].data+";";
    }

    //Add the new state_vars to the transaction
    const obj = JSON.parse(state_vars);
    Object.keys(obj).forEach(function(key, idx) {
      txncreator += "txnstate id:"+txnid+" port:"+key+" value:"+obj[key]+";";
      //alert("states vars to add: "+" port:"+key+" value:"+obj[key]);
      //alert(txncreator);
    });
/*    // Adding the new state vars to the transaction
    for (var i=0; i<obj.length; i++){
      var port = obj[i][0];
      var value = obj[i][1];
      txncreator += "txnstate id:"+txnid+" port:"+port+" value:"+value+";";
    }
*/
    //input token
    txncreator += "txninput id:"+txnid+" coinid:"+token.coinid+";";

    //outputs the token and the change back
    txncreator +=
    "txnoutput id:"+txnid+" amount:"+amount+" address:"+targetAddress+" tokenid:"+token.tokenid+" storestate:true;";

    if (change_back > 0) {
      txncreator += "txnoutput id:"+txnid+" amount:"+change_back+" address:"+change_back_address+" tokenid:"+token.tokenid+" storestate:true;";
    }

    txncreator +=
    "txnbasics id:"+txnid+";"+
    "txnsign id:"+txnid+" publickey:auto;"+
    "txnpost id:"+txnid+";"+
    "txndelete id:"+txnid+";";

    var nodeStatus = JSON.stringify(txncreator, undefined, 2);
    document.getElementById("status-object").innerText = nodeStatus;
    MDS.log(JSON.stringify(txncreator, undefined, 2));
    alert("TXNCREATOR end function: "+JSON.stringify(txncreator, undefined, 2));
    return txncreator;
}

// Get the state vars of a tokenID until the last number specified by end
// The string returned is not the Json object, it is a string of type ( "0":"abc", "1":"56", "2":"ght")
function get_state_vars_string2 (coin, end){
  //Duplicate the object only until end parameters
  const newStatevars = new Object();
  const statevars = JSON.parse(JSON.stringify(coin.state));

  Object.keys(statevars).forEach(function(key, idx) {
    if (idx <= end) newStatevars.key = statevars[key];
  });
  alert("into get_state_vars_string2_slice:"+JSON.stringify(coin.state));
  alert("into get_state_vars_string2_slice: "+JSON.stringify(newStatevars).slice[1,-1]);
  return JSON.stringify(newStatevars).slice[1,-1];
}

function deleteProfilesRegisters(){
  var fullsql = "DROP TABLE profiles";

  MDS.sql(fullsql, function(resp){
    MDS.log(JSON.stringify(resp));
    if (resp.status) {
      MDS.log("Deleting all profiles from Profiles DB");
    }
    else {
      MDS.log("The registers from profiles HAS NOT BEEN deleted");
    }
  });
}
