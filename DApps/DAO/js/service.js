function CreateTheTable(){
  //Create the DB if not exists
	initsql = "CREATE TABLE IF NOT EXISTS `messages` ( "
          +"  `id` IDENTITY PRIMARY KEY, "
          +"  `coinid` varchar(512) NOT NULL, "
					+"  `amount` int NOT NULL, "
					+"  `address` varchar(512) NOT NULL, "
					+"  `miniaddress` varchar(512) NOT NULL, "
					+"  `tokenid` varchar(512) NOT NULL, "
					//+"  `token` varchar(512) NOT NULL DEFAULT, "
					//+"  `storestate` varchar(5) NOT NULL, "
					//+"  `state` varchar(128) NOT NULL DEFAULT '', "
          +"  `spent` varchar(5) NOT NULL, "
          +"  `mmrentry` int NOT NULL DEFAULT 0, "
					+"  `created` int NOT NULL, "
          +"  `date` bigint NOT NULL "
					+" )";

	//Run this..
	MDS.sql(initsql,function(msg){
	   MDS.log("DAO API Service SQL Inited..");
	})
}

/*function InsertTheRecivedToeknInDB(){
  //First Insert the data to the DB
	var coinid 	= msg.data.coinid;
	var amount 	= msg.data.amount;
	var address 	= msg.data.address;
	var miniaddress 	= msg.data.miniaddress;
	var tokenid 	= msg.data.tokenid;
	//var token 	= msg.data.token;
	//var storestate 	= msg.data.storestate;
	//var state 	= msg.data.state;
	var spent 	= msg.data.spent;
	var mmrentry 	= msg.data.mmrentry;
	var created 	= msg.data.created;


	//insert into the DB
	var msgsql = "INSERT INTO messages (coinid,amount,address,miniaddress,tokenid,spent,mmrentry,created,date) VALUES "
    					+"('"+coinid+"','"+amount+"','"+address+"','"+miniaddress+"','"+tokenid+"','"+spent+"','"+mmrentry+"','"+created+"', "+Date.now()+")";

	//Insert into DB
	MDS.sql(msgsql);

	//Second thing
	//SendTheTokensInReturn();
}*/






//Main message handler..
MDS.init(function(msg){
    //Do initialitzation
    if(msg.event == "inited"){
      MDS.log("service.js inited in the background...");
      CreateTheTable();
    }
    //Is a NEWBALANCE message?
    else if(msg.event == "NEWBALANCE"){
			MDS.log("NEWBALANCE DETECTED...");
			//InsertTheRecivedToeknInDB();
			var coinid 	= msg.data.coinid;
			var amount 	= msg.data.amount;
			var address 	= msg.data.address;


			//insert into the DB
			var msgsql = "INSERT INTO messages (coinid,amount,address) VALUES "
		    					+"('"+coinid+"','"+amount+"','"+address+"')";

			//Insert into DB
			MDS.sql(msgsql);
    }
});
