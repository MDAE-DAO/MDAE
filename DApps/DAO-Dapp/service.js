/*
*********The Minima Innovation Challenge Team
*********service.js
*********THE TEAM DEVELOPERS************
*********
*********
*/


//This function just create the databases if they are not yet
function createTheDBTokens(msg){
	initsql = "CREATE TABLE IF NOT EXISTS `tokensmdae` ( "
					+"  `id` IDENTITY PRIMARY KEY, "
					+"  `tokenid` varchar(512), "
          +"  `name` varchar(64), "
          +"  `description` varchar(256), "
					+"  `date` bigint "
					+" )";

		MDS.sql(initsql,function(msg){
			MDS.log("DB tokensMDAE Inited..");
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
          +"  `clientpublickkey` varchar(512), "
					+"  `trxdone` int, "
					+"  `date` bigint "
					+" )";

		MDS.sql(initsql,function(msg){
			MDS.log("DB Tokens Received Inited..");
		});
}

//This function just create the databases if they are not yet
function createTheDBDAOWalletAddress(msg){
	initsql = "CREATE TABLE IF NOT EXISTS `daowalletaddress` ( "
					+"  `id` IDENTITY PRIMARY KEY, "
					+"  `walletaddress` varchar(512), "
					+"  `date` bigint "
					+" )";

		MDS.sql(initsql,function(msg){
			MDS.log("DB DAO Wallet Addresses Inited..");
		});
}

//This function just create the databases if they are not yet
function createTheDBProfiles(msg){
	initsql = "CREATE TABLE IF NOT EXISTS `profiles` ( "
					+"  `id` IDENTITY PRIMARY KEY, "
          +"  `coinidreceived` varchar(512), "
          +"  `amountreceived` int, "
          +"  `operation` varchar(64), "
          +"  `clientwalletaddress` varchar(512), "
          +"  `profile` varchar(64), "
					+"  `topicsofinterest` varchar(512), "
          +"  `trxdone` int, "
					+"  `date` bigint "
					+" )";

		MDS.sql(initsql,function(msg){
			MDS.log("DB DAO Profiles Inited..");
		});
}

//This function just create the databases if they are not yet
function createTheDBAdvertisers(msg){
	initsql = "CREATE TABLE IF NOT EXISTS `advertisersDAO` ( "
					+"  `id` IDENTITY PRIMARY KEY, "
          +"  `coinidreceived` varchar(512), "
          +"  `amountreceived` int, "
          +"  `operation` varchar(64), "
          +"  `topicsofinterest` varchar(64), "
          +"  `dappcode` varchar(512), "
          +"  `contactid` varchar(1024), "
					+"  `publickey` varchar(512), "
          +"  `trxdone` int, "
					+"  `date` bigint "
					+" )";

		MDS.sql(initsql,function(msg){
			MDS.log("DB DAO Profiles Inited..");
		});
}


//Main message handler..
MDS.init(function(msg){
  //Do initialitzation
  if(msg.event == "inited"){
    MDS.log("The service.js is initialising MDS in the background...");
    createTheDBtokensreceived();
    createTheDBDAOWalletAddress();
    createTheDBProfiles();
    createTheDBAdvertisers();
    createTheDBTokens();
  }//else if(msg.event == "NEWBALANCE"){
    // user's balance has changed
    //MDS.log("New Balance Detected");
		//Process the new event detected
    //newBalanceEvent();
    //getTokens();
  //}
});
