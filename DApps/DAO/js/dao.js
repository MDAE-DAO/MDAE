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

function onchange(e) {
    if (e.currentTarget.value === 'refresh') {
        window.location.reload();
    }
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
      //var value = select.value;
      var value = select.options[select.selectedIndex].value;
      //console.log(value);
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
      const nodeStatus = JSON.stringify(resp.response, " ", '\t');
      document.getElementById("node-status").innerText = nodeStatus;
      MDS.log("TOKEN: "+CreateTokenFunction);
      MDS.log(JSON.stringify(resp));
      CheckMinimaBalance();
      GetTokens();
    }
    //if the response status is false
    else{
      const nodeStatus = JSON.stringify(resp.response, " ", '\t');
      document.getElementById("node-status").innerText = nodeStatus;
      alert("Could not create the Token");
    }
  })
}

function NewAddress(){
  MDS.cmd("newaddress", function(resp) {
    if (resp.status) {
      const nodeStatus = JSON.stringify(resp.response, " ", '\t');
      document.getElementById("node-status").innerText = nodeStatus;
    }
  })
}

function GetAddress(){
  MDS.cmd("getaddress", function(resp) {
    if (resp.status) {
      const nodeStatus = JSON.stringify(resp.response, " ", '\t');
      document.getElementById("node-status").innerText = nodeStatus;
    }
  })
}

function Coins(){
  MDS.cmd("coins", function(resp) {
    if (resp.status) {
      const nodeStatus = JSON.stringify(resp.response, " ", '\t');
      document.getElementById("node-status").innerText = nodeStatus;
    }
  })
}

function Contact(){
  MDS.cmd("maxima", function(resp) {
    if (resp.status) {
      const contact = resp.response.contact;
      document.getElementById("node-status").innerText = contact;
    }
  })
}

function MaxContacts(){
  MDS.cmd("maxcontacts", function(resp) {
    if (resp.status) {
      const contact = resp.response.contact;
      document.getElementById("node-status").innerText = contact;
    }
  })
}

function Scripts(){
  MDS.cmd("scripts", function(resp) {
    if (resp.status) {
      const nodeStatus = JSON.stringify(resp.response, " ", '\t');
      document.getElementById("node-status").innerText = nodeStatus;
    }
  })
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
  // user's balance has changed(
    alert("new balance")
    MDS.log("NEWBALANCE event")
    MDS.cmd("balance",function(result){

				//Add each contact
				balance = result.response;

				//Add the contacts
				for(var i = 0; i < balance.length; i++) {
          // check if we recived minima tokens and his state variables
          // contains an order to buy tokens
					if(balance[i].tokenid == "0x00"){
            MDS.cmd("coins address:0x55DA27A0E823BDE3B8A229E432780F931C1D1326E7B8CD356A839E6A6AAB370C",function(result){
              MDS.log("result_coins address: "+ result.respone)
              var resp = result.response;
              var coind_received = resp.coinid;
              var amount_received = resp.amount;
              var states = resp.state;
              var operation;
              var buyer_wallet;
              var token_to_buy;
              var amount_to_buy;
              for(var i = 0; i <resp.state.length; i++) {
                if (resp.state[i].port == 0) operation = resp.state[i].data;
                if (resp.state[i].port == 1) buyer_wallet = resp.state[i].data;
                if (resp.state[i].port == 2) token_to_buy = resp.state[i].data;
                if (resp.state[i].port == 3) amount_to_buy = resp.state[i].data;
              }
              if (operation === "buy_tokens") && amount_to_buy == amount_received && buyer_wallet && token_to_buy{
                //If all is ok, then excute the sell order using send command or building a transaction
                MDS.log("Order to buy received and sending the tokens to the buyer")
                MDS.cmd("send address:"+buyer_wallet" + " tokenid:"+token_to_buy + " amount:" + amount_to_buy,function(result){
                  alert(result);
                  // here it goes the send function to send tokens back to the buyer.
                }
              }
            }

					}
				}
			});
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
