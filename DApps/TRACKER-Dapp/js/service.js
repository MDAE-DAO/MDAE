/*
*********The Minima Innovation Challenge Team
*********service.js
*********THE TEAM DEVELOPERS************
*********
*********
*/

//This function just create the sendpoll if it is not yet
function preparingSendpoll(){
  MDS.cmd("sendpoll action:list", function(res){
    if (res.status) {
      MDS.log("Number of sendpoll: "+res.response.total);
      if (res.response.total == 0){
        MDS.log("Creating a uid sendpoll");
				MDS.cmd("sendpoll action:add", function(res){
			    if (res.status) {}
			    else{
			      var nodeStatus = JSON.stringify(res, undefined, 2);
			      document.getElementById("status-object").innerText = nodeStatus;
			      MDS.log(JSON.stringify(res));
			    }
			  });
      }
    }
    else{
      var nodeStatus = JSON.stringify(res, undefined, 2);
      document.getElementById("status-object").innerText = nodeStatus;
      MDS.log(JSON.stringify(res));
    }
  });
}


//This function just create the databases if they are not yet
function createTheDBtokensreceived(msg){
	initsql = "CREATE TABLE IF NOT EXISTS `tokensreceived` ( "
					+"  `id` IDENTITY PRIMARY KEY, "
					+"  `coinidreceived` varchar(512), "
					+"  `amountreceived` int, "
					+"  `operation` varchar(64), "
					+"  `clientwalletaddress` varchar(512), "
					+"  `clienttokenid` varchar(512), "
					+"  `clientamountdesired` int, "
					+"  `trxdone` int, "
					+"  `date` bigint "
					+" )";

		MDS.sql(initsql,function(msg){
			MDS.log("DB Tokens Received Inited..");
		});
}

//This function just create the databases if they are not yet
function createTheDBUserWalletAddress(msg){
	initsql = "CREATE TABLE IF NOT EXISTS `userwalletaddress` ( "
					+"  `id` IDENTITY PRIMARY KEY, "
					+"  `walletaddress` varchar(512), "
					+"  `date` bigint "
					+" )";

		MDS.sql(initsql,function(msg){
			MDS.log("DB USER Wallet Addresses Inited..");
		});
}

//This function just create the databases if they are not yet
function createTheDBDeveloperWalletAddress(msg){
	initsql = "CREATE TABLE IF NOT EXISTS `developerwalletaddress` ( "
					+"  `id` IDENTITY PRIMARY KEY, "
					+"  `walletaddress` varchar(512), "
					+"  `date` bigint "
					+" )";

		MDS.sql(initsql,function(msg){
			MDS.log("DB DEVELOPER Wallet Addresses Inited..");
		});
}

//This function just create the databases if they are not yet
function createTheDBAdvertiserWalletAddress(msg){
	initsql = "CREATE TABLE IF NOT EXISTS `advertiserwalletaddress` ( "
					+"  `id` IDENTITY PRIMARY KEY, "
					+"  `walletaddress` varchar(512), "
					+"  `date` bigint "
					+" )";

		MDS.sql(initsql,function(msg){
			MDS.log("DB ADVERTISER Wallet Addresses Inited..");
		});
}


//Main message handler..
MDS.init(function(msg){
  //Do initialitzation
  if(msg.event == "inited"){
    MDS.log("The service.js is initialising MDS also in the background...");
    createTheDBtokensreceived();
    createTheDBUserWalletAddress();
    createTheDBDeveloperWalletAddress();
    createTheDBAdvertiserWalletAddress();
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
