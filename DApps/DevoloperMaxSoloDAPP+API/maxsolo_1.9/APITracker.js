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
var SCRIPT_ADDRESS = "0x7B48DCB61ABA37B52649989746704E444D0BD7AB982804A2DBF3D70E4BA1DE7D";

//send address:0x7B48DCB61ABA37B52649989746704E444D0BD7AB982804A2DBF3D70E4BA1DE7D amount:7 tokenid:0x00 state:{"0":"[ADVERTISER]", "1":"0xC6496C916268F428259FA05A979A3FDE8E0901A52525A4D73578903AE2975634", "2":"[banner.jpg]", "3":"[textsample]"}

//This function just create the databases if it is not yet
function createTheDBtokensreceived(msg){
	initsql = "CREATE TABLE IF NOT EXISTS `tokensreceived` ( "
					+"  `id` IDENTITY PRIMARY KEY, "
					+"  `coinidreceived` varchar(512), "
					+"  `amountreceived` int, "
					+"  `typeofuser` varchar(64), "
					+"  `advertiseraddress` varchar(512), "
					+"  `urlimage` varchar(64), "
					+"  `urltext` varchar(64), "
					+"  `date` bigint "
					+" )";

		MDS.sql(initsql,function(msg){
			MDS.log("DB Tokens Received Inited..");
			displayPublicity();
		});
}

//This function just create the databases if it is not yet
function createtheDBtraker (){
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
      MDS.log("Addresses HAS BEEN Inserted Correctly in the DB");
			alert("Wallet Address has Changed Correctly");
    }
    else {
      MDS.log("The Addresses HAS NOT BEEN Inserted in the DB");
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


//***** NEWBALANCE Event SECTION

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
  let bool = tokenFromAdvertiser(coin);
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
				url_image = "banner.jpg";
				//<img src="banner.jpg" class='advertiser' onclick='advertiserbannerclick()'>
				//const element = document.querySelector('.AdvertiserSection');
    		//element.style.background-image.url() = banner.jpg;
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

//This function begins to check if the DAPP is runing for the first time
function runAPITracker(msg){
  if(msg.event == "inited"){
    createtheDBtraker();
    createTheDBtokensreceived();

  }
  if(msg.event == "NEWBALANCE"){
    // user's balance has changed
    MDS.log("New Balance Detected");
    //Process the new event detected
    newBalanceEvent();
  }

}

//For now the developer sets here his wallet addresses
function developerAddress(){
  DEVELOPER_WALLET_ADDRESS = "adresssdeveloperx0909090343434";
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
