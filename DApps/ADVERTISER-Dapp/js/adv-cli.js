/*
*********The Minima Innovation Challenge Team
*********ADV-CLI Dapp JS
*********THE TEAM DEVELOPERS************
*********
*********
-> BALANCE is a global variable that will be automatically updated on NEWBALANCE event as well and manually.
*/

//    <script type="text/javascript" src="js/service.js"></script>


var DAO_WALLET_ADDRESS = "0x614190606CD54F2CF78D06813CE1BF4C71438C7897234C7D0F788D4F65F84BDE";
var SENDPOLLUID ="";
var GLOBAL = 0;
var COUNT = 0;
var BALANCE = {};
const ADVERTISING_TOKENS = ["0x65504C6C205224A70C95BD963139F7BFB3646BED25CCB7F03DE960B2D1C51246", "0x835F54EF6FBD7E3B599AA3C963E6BCE02680729AD8AE2B95882BE810A0074587"];

//send address:0x9D90EE44464722B25EA05EBC443755FB81D8AAB1077726D5A2A09010BD041184 amount:7 tokenid:0x00 state:{"0":"[BUY]", "1":"0xC6496C916268F428259FA05A979A3FDE8E0901A52525A4D73578903AE2975634", "2":"0x00", "3":"7"}


/////*****MAXIMA SECTION

//This function just list the Maxima contacts
function Contact(){
  MDS.cmd("maxima", function(resp) {
    if (resp.status) {
      var contact = JSON.stringify(resp.response, undefined, 2);
      document.getElementById("").innerText = contact;
    }
  });
}

//This function add a Maxima contact
function AddContact() {
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
//Modified to fetch the data from the global BALANCE variable
function MinimaBalance(){
		  //For each token do...
		  for(var i = 0; i < BALANCE.length; i++) {
        //Look for Minima token
        if(BALANCE[i].tokenid == "0x00"){
          //Get the values
      	  var MinimaToken = BALANCE[i].token;
          document.getElementById("MinimaToken").innerText = MinimaToken;
          var MinimaTokenid = BALANCE[i].tokenid;
          document.getElementById("MinimaTokenid").innerText = MinimaTokenid;
          var MinimaCoins = BALANCE[i].coins;
          document.getElementById("MinimaCoins").innerText = MinimaCoins;
      	  var MinimaSendable 	= BALANCE[i].sendable;
          document.getElementById("MinimaSendable").innerText = MinimaSendable;
          var MinimaTotal = BALANCE[i].total;
          document.getElementById("MinimaTotal").innerText = MinimaTotal;
  		  }
      }
}




//***** BUY AND SEND TOKEN SECTION

//This function send a token to anyone
function SendMoney(){
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
      //MDS.log(JSON.stringify(resp));
    }
  });
}

//This function create a new token
function CreateToken(){
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
function NewAddress(){
  MDS.cmd("newaddress", function(resp) {
    if (resp.status) {
      var nodeStatus = JSON.stringify(resp.response, undefined, 2);
      document.getElementById("status-object").innerText = nodeStatus;
    }
  })
}

//This function just get an address
function GetAddress(){
  MDS.cmd("getaddress", function(resp) {
    if (resp.status) {
      var nodeStatus = JSON.stringify(resp.response, undefined, 2);
      document.getElementById("status-object").innerText = nodeStatus;
    }
  });
}

//This function just shows the main wallet address

function MainWalletAddress(){
  document.getElementById("status-object").innerText = "Actual DAO Wallet Address: "+DAO_WALLET_ADDRESS;
}

//This function just list the coins
function Coins(){
  MDS.cmd("coins", function(resp) {
    if (resp.status) {
      var nodeStatus = JSON.stringify(resp.response, undefined, 2);
      document.getElementById("status-object").innerText = nodeStatus;
    }
  });
}

//This function just list the scritps
function Scripts(){
  MDS.cmd("scripts", function(resp) {
    if (resp.status) {
      var nodeStatus = JSON.stringify(resp.response, undefined, 2);
      document.getElementById("status-object").innerText = nodeStatus;
    }
  });
}

//This function set a Maxima name
function SetMaximaName(){
  name = prompt("Please enter the MAXIMA Name:", "");
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

//This function lists ALL the tokensreceived Data Base
function ListtokensreceivedDB(){
  MDS.sql("SELECT * FROM tokensreceived",function(sqlmsg){
    if (sqlmsg.status) {
      var nodeStatus = JSON.stringify(sqlmsg, undefined, 2);
      document.getElementById("status-object").innerText = nodeStatus;
      MDS.log(JSON.stringify(sqlmsg));
    }
  });
}



//***** NEWBALANCE Recive and then send SECTION

//This function get a sendpoll uid
function GetSendpolluid(){
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
    RegisterTransactionInDB(coin);
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
  if (operation == "[BUY]" || operation == "[SELL]") {
    return true
  }else{
    return false
  }
}

function newBalanceEvent(){
  //Load a sendpoll
  GetSendpolluid()
  var command = "coins address:"+DAO_WALLET_ADDRESS;
  MDS.cmd(command, function(result){
    if (result.status){
      var coins = result.response;
      COUNT = coins.length
      COUNT = COUNT-1;
      MDS.log("TOTAL Coins Number to Check: "+COUNT);
      searchSQL(coins);
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
    MDS.sql("SELECT * from tokensreceived WHERE coinidreceived='"+coin.coinid+"'", function(sqlmsg){
      if (sqlmsg.status) {
        COUNT = COUNT-1;
        checkTokenReceived(coin, sqlmsg);
        if (COUNT >= 0){
          searchSQL(coins);
        }
      }
    });
  }else{
    COUNT = COUNT-1;
    if (COUNT >= 0){
      searchSQL(coins);
    }
  }
}

//This function register all the transaction data in the DB
function RegisterTransactionInDB(coin) {
  MDS.log("Registering the Transaction in the DB..");
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
      SendTheTokensToTheBuyer(coin);
    }
    else {
      MDS.log("Transaction NOT Inserted in the DB");
      //We sould register that problem into another DataBase. It allow to check the transacions who has not been processet although they should have been processed
    }
	});
}

//This function sends the tokens to the buyer once all has been checked
function SendTheTokensToTheBuyer(coin){

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

// ---------------------Every thing modified by JOSUA goes here to help to locate the changes.

//Main message handler..
MDS.init(function(msg){
  //Do initialitzation
  if(msg.event == "inited"){
    MDS.log("The service.js is initialising MDS also in the background...");
    createTheDB();
		preparingSendpoll()
    MDS.cmd("status", function(res) {
      if (res.status) {
        // get the version number and the blockchain time from the Status object returned
        const version = res.response.version;
        document.getElementById("version").innerText = version;
        const blockchaintime = res.response.chain.time;
        document.getElementById("blockchaintime").innerText = blockchaintime;
        //Keep cheking the blockchain time.
        setInterval(updateTime, 100);
      }
    })
    MDS.cmd("maxima", function(resp) {
      if (resp.status) {
        const maximaname = resp.response.name;
        document.getElementById("maximacontactname").innerText = maximaname;
      }
    })
  }
  else if(msg.event == "NEWBLOCK"){
  // the chain tip has changed
  }
  else if(msg.event == "NEWBALANCE"){
    // user's balance has changed
    MDS.log("New Balance Detected");
		//Process the new event detected
    //alert("NEW BALANCE");
    getNewBalance();
    newBalanceEvent();
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


//This function just list any Token Balance
//Fetches the data from global variable BALANCE
function TokenBalance(){
      //Grab the token to look for its balance.
      var select = document.getElementById('tokens2');
      var value = select.options[select.selectedIndex].value;
      for(var i = 0; i < BALANCE.length; i++) {
        //Look for the token
        if(BALANCE[i].tokenid == value){
          //Return the function value as true and Get the values
          var Tokenid = BALANCE[i].tokenid;
          document.getElementById("Tokenid").innerText = Tokenid;
          var Coins = BALANCE[i].coins;
          document.getElementById("Coins").innerText = Coins;
      	  var Sendable 	= BALANCE[i].sendable;
          document.getElementById("Sendable").innerText = Sendable;
          var Total = BALANCE[i].total;
          document.getElementById("Total").innerText = Total;
          return;
  		  }
      }
}

//This function just get the Balance of selected Advertiser token
//Fetches the data from global variable BALANCE
function TokenAdvertiserBalance(){
      //Grab the token to look for its balance.
      var select = document.getElementById('select_advertiser_tokens');
      var value = select.options[select.selectedIndex].value;
      for(var i = 0; i < BALANCE.length; i++) {
        //Look for the token
        if(BALANCE[i].tokenid == value){
          //Return the function value as true and Get the values
      	  var Sendable 	= BALANCE[i].sendable;
          document.getElementById("availableTokensConfigure").innerText = Sendable;
          //var Total = BALANCE[i].total;
          //document.getElementById("Total").innerText = Total;
          return;
  		  }
      }
}

//This function just detect if the type advertise type is set to Text then
//It shows all texts fields and delete the content of web/image and disables it
function TypeAdvertiseChange(){
      //Grab the token to look for its balance.
      var select = document.getElementById('select_type_advertise');
      var value = select.options[select.selectedIndex].value;
      if (value == 0) {  // Text
        document.getElementById('web_img_input').value = "";
        document.getElementById('web_img_input').disabled = true;
        document.getElementById("text_0_adv").disabled = false;
        document.getElementById("text_1_adv").disabled = false;
        document.getElementById("text_2_adv").disabled = false;
        document.getElementById("text_3_adv").disabled = false;
        document.getElementById("text_4_adv").disabled = false;
        document.getElementById("text_5_adv").disabled = false;
        document.getElementById("text_6_adv").disabled = false;
        document.getElementById("text_7_adv").disabled = false;
        document.getElementById("text_8_adv").disabled = false;
      } else {
        document.getElementById('web_img_input').disabled = false;
        document.getElementById("text_0_adv").value = "";
        document.getElementById("text_1_adv").value = "";
        document.getElementById("text_2_adv").value = "";
        document.getElementById("text_3_adv").value = "";
        document.getElementById("text_4_adv").value = "";
        document.getElementById("text_5_adv").value = "";
        document.getElementById("text_6_adv").value = "";
        document.getElementById("text_7_adv").value = "";
        document.getElementById("text_8_adv").value = "";
        document.getElementById("text_0_adv").disabled = true;
        document.getElementById("text_1_adv").disabled = true;
        document.getElementById("text_2_adv").disabled = true;
        document.getElementById("text_3_adv").disabled = true;
        document.getElementById("text_4_adv").disabled = true;
        document.getElementById("text_5_adv").disabled = true;
        document.getElementById("text_6_adv").disabled = true;
        document.getElementById("text_7_adv").disabled = true;
        document.getElementById("text_8_adv").disabled = true;
      }
}

//Send the Tokens available to the dongles
//Fetch the data from BALANCE global variable
//It is called from getNewBalance as it must be updated every time a NEWBALANCE even happens
function GetTokens(){
    //Create the select dongles
    var select = document.getElementById('tokens');
    while (select.hasChildNodes()) {
      select.removeChild(select.firstChild);
    }
    var select2  = document.getElementById('tokens2');
    while (select2.hasChildNodes()) {
      select2.removeChild(select2.firstChild);
    }
    var select3  = document.getElementById('tokens3');
    while (select3.hasChildNodes()) {
      select3.removeChild(select3.firstChild);
    }
    var select_advertiser_tokens = document.getElementById('select_advertiser_tokens');
    while (select_advertiser_tokens.hasChildNodes()) {
      select_advertiser_tokens.removeChild(select_advertiser_tokens.firstChild);
    }
    var select_tokens_type_reward_dapp = document.getElementById('tokens_type_reward_dapp');
    while (select_tokens_type_reward_dapp.hasChildNodes()) {
      select_tokens_type_reward_dapp.removeChild(select_tokens_type_reward_dapp.firstChild);
    }
    var select_tokens_type_reward_user = document.getElementById('tokens_type_reward_user');
    while (select_tokens_type_reward_user.hasChildNodes()) {
      select_tokens_type_reward_user.removeChild(select_tokens_type_reward_user.firstChild);
    }
    //Add each Token
    //Add the tokens to the dongle Buy a Token (spend)
    for(var i = 0; i < BALANCE.length; i++) {
      var opt = document.createElement('option');
      if(BALANCE[i].tokenid == "0x00"){
        opt.value = BALANCE[i].tokenid;
        opt.innerHTML = BALANCE[i].token;
      }else{
        opt.value = BALANCE[i].tokenid;
        opt.innerHTML = BALANCE[i].token.name;
      }
      select.appendChild(opt);
    }

    //Add tokens to the dongle Token balance
    for(var i = 0; i < BALANCE.length; i++) {
      var opt = document.createElement('option');
      if(BALANCE[i].tokenid == "0x00"){
        opt.value = BALANCE[i].tokenid;
        opt.innerHTML = BALANCE[i].token;
      }else{
        opt.value = BALANCE[i].tokenid;
        opt.innerHTML = BALANCE[i].token.name;
      }
      select2.appendChild(opt);
    }

    //Add tokens to the dongle buy a Token (buy)
    for(var i = 0; i < BALANCE.length; i++) {
      var opt = document.createElement('option');
      if(BALANCE[i].tokenid == "0x00"){
        opt.value = BALANCE[i].tokenid;
        opt.innerHTML = BALANCE[i].token;
      }else{
        opt.value = BALANCE[i].tokenid;
        opt.innerHTML = BALANCE[i].token.name;
      }
      select3.appendChild(opt);
    }

    //Add tokens to the dongle configure Advertiser token
    //Add blank element on the first position, so in the change event the
    //amount of tokens can be triggered automatically
    var opt = document.createElement('option');
    select_advertiser_tokens.appendChild(opt);
    for(var i = 0; i < BALANCE.length; i++) {
      if(BALANCE[i].tokenid != "0x00"){
        if (isAdvertiserToken(BALANCE[i].tokenid)) {
          opt = document.createElement('option');
          opt.value = BALANCE[i].tokenid;
          opt.innerHTML = BALANCE[i].token.name;
          select_advertiser_tokens.appendChild(opt);
        }
      }

    }

    //Add the tokens to the dongle type of Dapp rewards
    for(var i = 0; i < BALANCE.length; i++) {
      var opt = document.createElement('option');
      if(BALANCE[i].tokenid == "0x00"){
        opt.value = BALANCE[i].tokenid;
        opt.innerHTML = BALANCE[i].token;
      }else{
        opt.value = BALANCE[i].tokenid;
        opt.innerHTML = BALANCE[i].token.name;
      }
      select_tokens_type_reward_dapp.appendChild(opt);
    }

    //Add the tokens to the dongle type of User rewards
    for(var i = 0; i < BALANCE.length; i++) {
      var opt = document.createElement('option');
      if(BALANCE[i].tokenid == "0x00"){
        opt.value = BALANCE[i].tokenid;
        opt.innerHTML = BALANCE[i].token;
      }else{
        opt.value = BALANCE[i].tokenid;
        opt.innerHTML = BALANCE[i].token.name;
      }
      select_tokens_type_reward_user.appendChild(opt);
    }

}



// Execute minima balance command and set the balance as a Global variable BALANCE every time is called
// It is called by default on NEWBALANCE event
// It is called by default when the app starts also
function getNewBalance(){
  MDS.cmd("balance", function(res) {
  //if the response status is true
    if (res.status) {
      BALANCE = res.response;
      GetTokens();
    }
    //if the response status is false
    else{
      document.getElementById("StatusBalances").innerText = "Warning: Could not retrieve current Balance Status";
    }
  });
}

// Returns true is a given tokenid is an Advertiser TokenName
function isAdvertiserToken(tokenID){
  for (var i=0; i < ADVERTISING_TOKENS.length; i++) {
    if (ADVERTISING_TOKENS[i] === tokenID) return true;
  }
  return false;
}

//This function excutes a flashloan contract kind of on a
//Avertiser Token, so the token is send to itself but with all
//state variables related to campaing set on the token as the script requires.
//state 14 set to 1(configured)
function ConfigureCampaign(){
  MDS.log("Configurig Campaign , flahLoan contract: ");

  var campaign = document.getElementById("campaign_name").value;
  var advertiser_token_select= document.getElementById("select_advertiser_tokens");
  var advertiser_token = advertiser_token_select.options[advertiser_token_select.selectedIndex].value;
  var token_amount = document.getElementById("token_amount_configure").value;
  var type_advertise_select = document.getElementById("select_type_advertise");
  var type_advertise = type_advertise_select.options[type_advertise_select.selectedIndex].value;
  var web_img = document.getElementById("web_img_input").value;
  var dapp_rewards = document.getElementById("dapp_rewards").value;
  var tokens_type_reward_dapp = document.getElementById("tokens_type_reward_dapp").value;
  var user_rewards = document.getElementById("user_rewards").value;
  var tokens_type_reward_user = document.getElementById("tokens_type_reward_user").value;
  var actions_adv = document.getElementById("actions_adv").value;
  var rules_adv = document.getElementById("rules_adv").value;
  var text_0_adv = document.getElementById("text_0_adv").value;
  var text_1_adv = document.getElementById("text_0_adv").value;
  var text_2_adv = document.getElementById("text_0_adv").value;
  var text_3_adv = document.getElementById("text_0_adv").value;
  var text_4_adv = document.getElementById("text_0_adv").value;
  var text_5_adv = document.getElementById("text_0_adv").value;
  var text_6_adv = document.getElementById("text_0_adv").value;
  var text_7_adv = document.getElementById("text_0_adv").value;
  var text_8_adv = document.getElementById("text_0_adv").value;

/*  var state_vars = '{' + get_state_vars_string (advertiser_token, 12) +
    '"13":"'+campaign+'",' +
    '"14":"1",' +
    '"15":"'+dapp_rewards+'",' +
    '"16":"'+tokens_type_reward_dapp+'",' +
    '"17":"'+user_rewards+'",' +
    '"18":"'+tokens_type_reward_dapp+'",' +
    '"19":"'+type_advertise+'",' +
    '"20":"'+web_img+'",' +
    '"21":"'+actions_adv+'",' +
    '"22":"'+rules_adv+'",' +
    '"23":"'+text_0_adv+'",' +
    '"24":"'+text_1_adv+'",' +
    '"25":"'+text_2_adv+'",' +
    '"26":"'+text_3_adv+'",' +
    '"27":"'+text_4_adv+'",' +
    '"28":"'+text_5_adv+'",' +
    '"29":"'+text_6_adv+'",' +
    '"30":"'+text_7_adv+'",' +
    '"31":"'+text_8_adv+'"}';
*/

    MDS.cmd("coins tokenid:"+advertiser_token, function(res){
      if (res.status) {
        MDS.log("Getting token info to Configure Campaign by tokenid: "+res.response[0].tokenid);
        //alert(JSON.stringify(res.response, undefined, 2));

        var state_vars = '{' + get_state_vars_string(res.response[0], 12) +
            '"13":"['+campaign+']",' +
            '"14":"1",' +
            '"15":"'+dapp_rewards+'",' +
            '"16":"'+tokens_type_reward_dapp+'",' +
            '"17":"'+user_rewards+'",' +
            '"18":"'+tokens_type_reward_dapp+'",' +
            '"19":"'+type_advertise+'",' +
            '"20":"['+web_img+']",' +
            '"21":"['+actions_adv+']",' +
            '"22":"['+rules_adv+']",' +
            '"23":"['+text_0_adv+']",' +
            '"24":"['+text_1_adv+']",' +
            '"25":"['+text_2_adv+']",' +
            '"26":"['+text_3_adv+']",' +
            '"27":"['+text_4_adv+']",' +
            '"28":"['+text_5_adv+']",' +
            '"29":"['+text_6_adv+']",' +
            '"30":"['+text_7_adv+']",' +
            '"31":"['+text_8_adv+']"}';

            alert("state vars:"+state_vars);
            var command = 'send address:0x614190606CD54F2CF78D06813CE1BF4C71438C7897234C7D0F788D4F65F84BDE amount:'+token_amount+' state:'+state_vars;
            alert(command);
            MDS.cmd(command, function(res){
              if (res.status) {
                MDS.log("Sending token configured with state vars of Campaign");
                //alert(JSON.stringify(res.response, undefined, 2));
                alert("TOKEN SENT "+advertiser_token);
              }
              else{
                //alert("ERROR");
                  //var nodeStatus = JSON.stringify(res, undefined, 2);
                  //document.getElementById("status-coin").innerText = nodeStatus;
                  MDS.log(JSON.stringify(res));
                }
            });
      }
      else{
        //alert("ERROR");
          //var nodeStatus = JSON.stringify(res, undefined, 2);
          //document.getElementById("status-coin").innerText = nodeStatus;
          MDS.log(JSON.stringify(res));
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
