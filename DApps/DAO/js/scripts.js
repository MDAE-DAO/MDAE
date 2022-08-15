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

function CheckgDAPPBalance(){
  var result = false;
  // run the Minima balance command to return information about the node's current balance
  MDS.cmd("balance", function(res) {
    //if the response status is true
    if (res.status) {
      //Count the numberof tokens listed
      balance = res.response;
      //For each token do...
		  for(var i = 0; i < balance.length; i++) {
        //Look for gDAPP token
        //*****Should be used tokenid when the token will be finally created****
        if(balance[i].token.name == "gDAPP"){
          //Return the function value as true and Get the values
          result = true;
          var gDAPPToken = balance[i].token.name;
          document.getElementById("gDAPPToken").innerText = gDAPPToken;
          var gDAPPTokenid = balance[i].tokenid;
          document.getElementById("gDAPPTokenid").innerText = gDAPPTokenid;
          var gDAPPCoins = balance[i].coins;
          document.getElementById("gDAPPCoins").innerText = gDAPPCoins;
      	  var gDAPPSendable 	= balance[i].sendable;
          document.getElementById("gDAPPSendable").innerText = gDAPPSendable;
          var gDAPPTotal = balance[i].total;
          document.getElementById("gDAPPTotal").innerText = result;//gDAPPTotal;
  		  }
      }
    }
    //if the response status is false
    else{
    document.getElementById("StatusBalances").innerText = "Warning: Could not retrieve current Balance Status";
    }
  })
  return Boolean(result);
}

function CreateToken(){
  //Get the information
  var tokenname 	= document.getElementById('TokenName').value;
	var tokenamount = document.getElementById('Amount').value;
	if(tokenamount=="" || tokenamount < 0){
		alert("Invalid amount..");
		return;
	}
  result = CheckgDAPPBalance();
  if (result == false){
  //if the response status is true
    CreateTokenFunction = "tokencreate name:"+tokenname+" amount:"+tokenamount
    MDS.cmd(CreateTokenFunction, function(resp) {
      if (resp.status) {
        alert("Token Created!");
        const nodeStatus = JSON.stringify(resp.response, " ", '\t');
        document.getElementById("node-status").innerText = nodeStatus;
        MDS.log("TOKEN: "+CreateTokenFunction);
        MDS.log(JSON.stringify(resp));
        CheckgDAPPBalance()
      }
      //if the response status is false
      else{
        const nodeStatus = JSON.stringify(resp.response, " ", '\t');
        document.getElementById("node-status").innerText = nodeStatus;
        alert("Could not create the Token");
      }
    })
  }
}


//Initialise web socket
MDS.init(function(msg){
  if(msg.event == "inited") {
    // READY TO RUN CMDS!
    // run the Minima status command to return information about the node's current state
    MDS.cmd("status", function(res) {
      if (res.status) {
        // get the version number and the blockchain time from the Status object returned
        const version = res.response.version;
        document.getElementById("version").innerText = version;
        const blockchaintime = res.response.chain.time;
        document.getElementById("blockchaintime").innerText = blockchaintime;
      }
    })
  }
  else if(msg.event == "NEWBLOCK"){
  // the chain tip has changed
  }
  else if(msg.event == "NEWBALANCE"){
  // user's balance has changed
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
