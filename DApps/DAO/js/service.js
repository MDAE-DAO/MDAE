
function updateTime(){
  MDS.cmd("status", function(res) {
    if (res.status) {
      const blockchaintime = res.response.chain.time;
      document.getElementById("blockchaintime").innerText = blockchaintime;
    }
  })
}


//Main message handler..
MDS.init(function(msg){
  //Do initialitzation




  if(msg.event == "inited"){
    MDS.log("service.js inited also in the background...");
    MDS.cmd("status", function(res) {
      if (res.status) {
        // get the version number and the blockchain time from the Status object returned
        const version = res.response.version;
        document.getElementById("version").innerText = version;
        const blockchaintime = res.response.chain.time;
        document.getElementById("blockchaintime").innerText = blockchaintime;
        //Keep cheking the blockchain time.
        setInterval(updateTime, 10000);
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
    MDS.log(JSON.stringify(msg));
    CheckMinimaBalance();

    //var tokenid 	= document.getElementById('tokens').value;
    //var address = document.getElementById('destinationaddress').value;
    //var amount = document.getElementById('amount').value;
    //CreateSend = "Send address:"+address+" amount:"+amount+" tokenid:"+tokenid

    var send = "send address:0xE4FCA5AFA376263DA0C62E55AEDC2206CE9FADAF33D2AA0E935DD4781305483F amount:1 tokenid:0x00";
    MDS.cmd(send, function(resp) {
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
