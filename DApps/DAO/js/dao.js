/*
*********The Minima Innovation Challenge Team
*********DAO API JS
*********THE TEAM DEVELOPERS************
*********
*********
*/


function CheckMinimaBalance(){
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
  })
}

function IsAMinimaTokenRecived(){
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
    document.getElementById("StatusBalances").innerText = "Warning: Could not retrieve current Balance Status";
    }
  })
}


function TokenBalance(){
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
    document.getElementById("StatusBalances").innerText = "Warning: Could not retrieve current Balance Status";
    }
  })
}

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
      const nodeStatus = JSON.stringify(resp.response, undefined, 2);
      document.getElementById("node-status").innerText = nodeStatus;
      MDS.log("TOKEN: "+CreateTokenFunction);
      MDS.log(JSON.stringify(resp));
    }
    //if the response status is false
    else{
      const nodeStatus = JSON.stringify(resp.response, undefined, 2);
      document.getElementById("node-status").innerText = nodeStatus;
      alert("Could not create the Token");
    }
  })
  GetTokens();
}

function SendMoney(){
  //Get the information
  var tokenid 	= document.getElementById('tokens').value;
	var address = document.getElementById('destinationaddress').value;
  var amount = document.getElementById('amount').value;
  CreateSend = "Send address:"+address+" amount:"+amount+" tokenid:"+tokenid
  MDS.cmd(CreateSend, function(resp) {
    if (resp.status) {
      alert("Token Send!");
      const nodeStatus = JSON.stringify(resp.response, undefined, 2);
      document.getElementById("node-status").innerText = nodeStatus;
      //MDS.log("Contact: "+CreateContact);
      //MDS.log(JSON.stringify(resp));
    }
    //if the response status is false
    else{
      const nodeStatus = JSON.stringify(resp.response, undefined, 2);
      document.getElementById("node-status").innerText = nodeStatus;
      alert("Could not send the Token");
      MDS.log("Token NOT Send");
      //MDS.log(JSON.stringify(resp));
    }
  })
}

function NewAddress(){
  MDS.cmd("newaddress", function(resp) {
    if (resp.status) {
      const nodeStatus = JSON.stringify(resp.response, undefined, 2);
      document.getElementById("node-status").innerText = nodeStatus;
    }
  })
}

function GetAddress(){
  MDS.cmd("getaddress", function(resp) {
    if (resp.status) {
      const nodeStatus = JSON.stringify(resp.response, undefined, 2);
      document.getElementById("node-status").innerText = nodeStatus;
    }
  })
}

function Coins(){
  MDS.cmd("coins", function(resp) {
    if (resp.status) {
      const nodeStatus = JSON.stringify(resp.response, undefined, 2);

      document.getElementById("node-status").innerText = nodeStatus;
    }
  })
}

function Contact(){
  MDS.cmd("maxima", function(resp) {
    if (resp.status) {
      const contact = JSON.stringify(resp.response, undefined, 2);
      document.getElementById("node-status").innerText = contact;
    }
  })
}

function LoadSQLMessage(){
  MDS.sql("SELECT * from messages", function(sqlmsg){
	   var sql = sqlmsg;
     document.getElementById("node-status").innerText = sql;
     //Get the data
		var sqlrows = sqlmsg.rows;

		//Reverse them ( I use a limit..)
		sqlrows.reverse();

		//Create a table..
		var send = "";

    //Create the sends List..
		for(var i = 0; i < sqlrows.length; i++) {
		  var sqlrow = sqlrows[i];

		 	send += "<b>"+sqlrow.coinid+"</b><br><b>"+sqlrow.amount+"</b><br><b>"+sqlrow.address+"</b><br><br>";

		}

		//Set this as the send list
		document.getElementById("node-status").innerHTML = send;



  })
}




function AddContact() {
  //Get the information
  var contactname 	= document.getElementById('namecontact').value;
	var publickey = document.getElementById('publickeycontact').value;
  var contactid = document.getElementById('idcontact').value;
  CreateContact = "maxcontacts action:add contact:"+contactid+" publickey:"+publickey
  MDS.cmd(CreateContact, function(resp) {
    if (resp.status) {
      alert("Contact Created!");
      const nodeStatus = JSON.stringify(resp.response, undefined, 2);
      document.getElementById("node-status").innerText = nodeStatus;
      //MDS.log("Contact: "+CreateContact);
      //MDS.log(JSON.stringify(resp));
      Getcontacts();
    }
    //if the response status is false
    else{
      const nodeStatus = JSON.stringify(resp.response, undefined, 2);
      document.getElementById("node-status").innerText = nodeStatus;
      alert("Could not create the Contact");
      //MDS.log("Contact: "+CreateContact);
      //MDS.log(JSON.stringify(resp));
    }
  })
}


function Scripts(){
  MDS.cmd("scripts", function(resp) {
    if (resp.status) {
      const nodeStatus = JSON.stringify(resp.response, undefined, 2);
      document.getElementById("node-status").innerText = nodeStatus;
    }
  })
}
