CreateTheTable(){
  //Create the DB if not exists
	initsql = "CREATE TABLE IF NOT EXISTS `messages` ( "
          +"  `id` IDENTITY PRIMARY KEY, "
          +"  `coinid` varchar(512) NOT NULL, "
					+"  `Transaction Mined` varchar(512) NOT NULL, "
					+"  `amount` int NOT NULL, "
					+"  `address` varchar(512) NOT NULL, "
					+"  `miniaddress` varchar(512) NOT NULL, "
					+"  `tokenid` varchar(512) NOT NULL, "
					+"  `token` varchar(512) NOT NULL DEFAULT, "
					+"  `storestate` varchar(5) NOT NULL, "
					+"  `state` varchar(128) NOT NULL DEFAULT '', "
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

/*
function SendTheTokensInReturn(){
  //First Insert the data to the DB
	var coinid 	= msg.data.from;

			//remove the leading 0x
			var datastr	= msg.data.data.substring(2);

			//Convert the data..
			var jsonstr = hexToUtf8(datastr);

			//And create the actual JSON
			var maxjson = JSON.parse(jsonstr);

			//URL encode the message and deal with apostrophe..
			let encoded = encodeURIComponent(maxjson.message).replace("'", "%27");

			//insert into the DB
			var msgsql = "INSERT INTO messages (roomname,publickey,username,type,message,filedata,date) VALUES "
					+"('"+maxjson.username+"','"+pubkey+"','"+maxjson.username+"','"+maxjson.type+"','"+encoded+"','"+maxjson.filedata+"', "+Date.now()+")";

			//Insert into DB
			MDS.sql(msgsql);
}

*/


//Main message handler..
MDS.init(function(msg){
    //Do initialitzation
    MDS.log(JSON.stringify(msg));
    if(msg.event == "inited"){
      MDS.log("MY Service Inited..");
      CreateTheTable();
    }
    //Is a NEWBALANCE message?
    else if(msg.event == "NEWBALANCE"){
      SendTheTokensInReturn();
    }
});
