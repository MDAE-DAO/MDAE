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
			    if (res.status) {

          }else{
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



//Main message handler..
MDS.init(function(msg){
  //Do initialitzation
  if(msg.event == "inited"){
    MDS.log("The service.js is initialising MDS also in the background...");
		preparingSendpoll();
    MDS.cmd("status", function(res) {
      if (res.status) {
        // get the version number and the blockchain time from the Status object returned
        const version = res.response.version;
        document.getElementById("version").innerText = version;
        const blockchaintime = res.response.chain.time;
        document.getElementById("blockchaintime").innerText = blockchaintime;
        //getcontacts();
        //getTokens();
        //Keep cheking the blockchain time.
        setInterval(updateTime, 100);
      }
    });
    MDS.cmd("maxima", function(resp) {
      if (resp.status) {
        const maximaname = resp.response.name;
        document.getElementById("maximacontactname").innerText = maximaname;
      }
    });
  }else if(msg.event == "NEWBALANCE"){
    // user's balance has changed
    MDS.log("New Balance Detected");
		//Process the new event detected
    newBalanceEvent();
    //getTokens();
  }
});