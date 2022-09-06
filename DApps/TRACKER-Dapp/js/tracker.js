/*
*********The Minima Innovation Challenge Team
*********DAO API JS
*********THE TEAM DEVELOPERS************
*********
*********
*/

//    <script type="text/javascript" src="js/service.js"></script>


var SCRIPT_ADDRESS = "0x7B48DCB61ABA37B52649989746704E444D0BD7AB982804A2DBF3D70E4BA1DE7D";
var USER_WALLET_ADDRESS = "";
var DEVELOPER_WALLET_ADDRESS = "";
var ADVERTISER_WALLET_ADDRESS = "";
var SENDPOLLUID ="";
var GLOBAL = 0;
var COUNT = 0;

//send address:0x9D90EE44464722B25EA05EBC443755FB81D8AAB1077726D5A2A09010BD041184 amount:7 tokenid:0x00 state:{"0":"[BUY]", "1":"0xC6496C916268F428259FA05A979A3FDE8E0901A52525A4D73578903AE2975634", "2":"0x00", "3":"7"}


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


//***** WALLETS SECTION

//This function just shows the wallet address
function WalletAddress(datarole){
  if (datarole == "user"){
    getid = "userwalletaddress";
    selectdb = "userwalletaddress";
  }
  if (datarole == "developer"){
    getid = "developerwalletaddress";
    selectdb = "developerwalletaddress";
  }
  if (datarole == "advertiser"){
    getid = "advertiserwalletaddress";
    selectdb = "advertiserwalletaddress";
  }
  MDS.sql("SELECT * from "+selectdb+"", function(sqlmsg){
    if (sqlmsg.status) {
      if (sqlmsg.count == 0){
        MDS.log("Any address registered yet for the role: "+datarole);
      }
      else{
        var sqlrows = sqlmsg.rows;
        //Takes the last address recorded
        let i = (sqlrows.length -1);
        var sqlrow = sqlrows[i];
        var nodeStatus = JSON.stringify(sqlrow, undefined, 2);
        getwalletaddress = sqlrow.WALLETADDRESS;
        document.getElementById(getid).innerText = getwalletaddress;
        var nodeStatus = JSON.stringify(sqlrow, undefined, 2);
        document.getElementById("status-object").innerText = nodeStatus;
      }
    }
  });
}

function insertDAta(datarole){
  if (datarole == "user"){
    address = USER_WALLET_ADDRESS;
    selectdb = "userwalletaddress";
  }
  if (datarole == "developer"){
    address = DEVELOPER_WALLET_ADDRESS;
    selectdb = "developerwalletaddress";
  }
  if (datarole == "advertiser"){
    address = ADVERTISER_WALLET_ADDRESS;
    selectdb = "advertiserwalletaddress";
  }
  var fullsql = "INSERT INTO "+selectdb+" (walletaddress,date) VALUES "
      +"('"+address+"',"+Date.now()+")";

  MDS.sql(fullsql, function(resp){
    MDS.log(JSON.stringify(resp));
    if (resp.status) {
      MDS.log("Address HAS BEEN Inserted Correctly in the DB");
			alert("Wallet Address has Changed Correctly");
      WalletAddress(datarole)
    }
    else {
      MDS.log("The Address HAS NOT BEEN Inserted in the DB");
    }
  });
}

function processWallet(datarole){
  if (datarole == "user"){
    selectdb = "userwalletaddress";
  }
  if (datarole == "developer"){
    selectdb = "developerwalletaddress";
  }
  if (datarole == "advertiser"){
    selectdb = "advertiserwalletaddress";
  }
  MDS.sql("SELECT * from "+selectdb+"", function(sqlmsg){
    if (sqlmsg.status) {
      if (sqlmsg.count == 0){
        MDS.log("Inserting the address for the first time..");
        rolAddress(datarole);
        if (sqlmsg.status) {
        }else{
          MDS.log(JSON.stringify(sqlmsg));
        }
      }
      else{
        MDS.log("Inserting the address..");
        rolAddress(datarole);
      }
    }
  });
}

//This function grab the user address
function rolAddress(datarole){
  let address = prompt("Please enter the address:", "");
  if (address == null || address == "") {
    alert("Could not set the address!");
  }else{
    if (datarole == "user"){
      USER_WALLET_ADDRESS = address;
      insertDAta(datarole);
    }
    if (datarole == "developer"){
      DEVELOPER_WALLET_ADDRESS = address;
      insertDAta(datarole);
    }
    if (datarole == "advertiser"){
      ADVERTISER_WALLET_ADDRESS = address;
      insertDAta(datarole);
    }
  }
}



//***** NEWBALANCE Event SECTION

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

function newBalanceEvent(){
  //Load a sendpoll
  //getSendpolluid()
  var command = "coins address:"+SCRIPT_ADDRESS;
  MDS.cmd(command, function(result){
    if (result.status){
      var coins = result.response;
      COUNT = coins.length;
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

function checkTokenReceived(coin, sqlmsg){
  //MDS.log(JSON.stringify(sqlmsg));
  if (sqlmsg.count == 0){
    MDS.log("NEW ADVERTISER TRANSACTION HAS BEEN DETECTED.."+coin.coinid);
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

function tokenFromAdvertiser(coin){
  //Checking if this is a transaction with a advertiser state variables
  var typeofuser ="";
  for(let j = 0; j < coin.state.length; j++) {
    if (coin.state[j].port == 0) typeofuser = coin.state[j].data;
  }
  MDS.log("It's an Advetiser Transaction?");
  if (typeofuser == "[ADVERTISER]") {
    return true
  }else{
    return false
  }
}

/* Advertiser Token send with the State variables
coinid
coinamount
1: typeofuser: [ADVERTISER]
2: advertiseraddress
3: URLimage
4: URLtext
*/
//This function register all the transaction data in the DB
function registerTransactionInDB(coin) {
  MDS.log("Registering the Transaction in the DB..");
  var type_of_user;
  var advertiser_address;
  var url_image;
  var url_text;
  for(var i = 0; i < coin.state.length; i++) {
    if (coin.state[i].port == 0) type_of_user = coin.state[i].data;
    if (coin.state[i].port == 1) advertiser_address = coin.state[i].data;
    if (coin.state[i].port == 2) url_image = coin.state[i].data;
    if (coin.state[i].port == 3) url_text = coin.state[i].data;
  }
  var fullsql = "INSERT INTO tokensreceived (coinidreceived,amountreceived,typeofuser,advertiseraddress,urlimage,urltext,date) VALUES "
			+"('"+coin.coinid+"','"+coin.amount+"','"+type_of_user+"','"+advertiser_address+"','"+url_image+"','"+url_text+"',"+Date.now()+")";

	MDS.sql(fullsql, function(resp){
    MDS.log(JSON.stringify(resp));
		if (resp.status) {
      MDS.log("Transaction Registered Correctly in the DB with the Following coinid: "+coin.coinid);
      //Now is time to display the publicity
      displayPublicity();
    }
    else {
      MDS.log("Transaction NOT Inserted in the DB");
      //We sould register that problem into another DataBase. It allow to check the transacions who has not been processet although they should have been processed
    }
	});
}

function displayPublicity(){
	MDS.log("Displaying the Publicity in the Dapp..");
  var url_image;
  var url_text;
	MDS.sql("SELECT * from tokensreceived",function(sqlmsg){
    if (sqlmsg.status) {
      var sqlrows = sqlmsg.rows;
      //Takes the last publicity recorded
			MDS.log(sqlrows.length);
			if (sqlrows.length == 0){
				//No banner Registered on the database so takes an image directly
        url_image = "images/banner.jpg";
        //url_image = "/home/joanramon/GIT/MDAE/DApps/TRACKER-Dapp/images/banner.jpg";
        addsection = "<img src="+url_image+" class='advertiser' onclick='advertiserbannerclick()'>";
				document.getElementById("advertiserbanner").innerHTML = addsection;

			}
			else{
				let i = (sqlrows.length -1);
	      var sqlrow = sqlrows[i];
	      var nodeStatus = JSON.stringify(sqlrow, undefined, 2);
				MDS.log(JSON.stringify(sqlmsg));
	      url_image = sqlrow.URLIMAGE.slice(1,-1); // remove "[]"
				url_text = sqlrow.URLTEXT;
				MDS.log(url_image);
				//Build the advertiser banner
				addsection = "<img src="+url_image+" class='advertiser' onclick='advertiserbannerclick()'>";
				document.getElementById("advertiserbanner").innerHTML = addsection;
	    }
		}
  });
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
