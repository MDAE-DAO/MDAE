/*
*********The Minima Innovation Challenge Team
*********ADV-CLI Dapp JS
*********THE TEAM DEVELOPERS************
*********
*********
-> BALANCE is a global variable that will be automatically updated on NEWBALANCE event as well and manually.
*/

//    <script type="text/javascript" src="js/service.js"></script>


//***** STAUS AND TOOLS SECTION

//This function just create a new address
function NewAddress(){
  MDS.cmd("newaddress", function(resp) {
    if (resp.status) {
      var nodeStatus = JSON.stringify(resp.response, undefined, 2);
      document.getElementById("status-object").innerText = nodeStatus;
    }
  })
}

//This function just get an address
function GetAddress(){
  MDS.cmd("getaddress", function(resp) {
    if (resp.status) {
      var nodeStatus = JSON.stringify(resp.response, undefined, 2);
      document.getElementById("status-object").innerText = nodeStatus;
    }
  });
}

//This function just shows the main wallet address

function MainWalletAddress(){
  document.getElementById("status-object").innerText = "Actual DAO Wallet Address: "+DAO_WALLET_ADDRESS;
}

//This function just list the coins
function Coins(){
  MDS.cmd("coins", function(resp) {
    if (resp.status) {
      var nodeStatus = JSON.stringify(resp.response, undefined, 2);
      document.getElementById("status-object").innerText = nodeStatus;
    }
  });
}

//This function just list the scritps
function Scripts(){
  MDS.cmd("scripts", function(resp) {
    if (resp.status) {
      var nodeStatus = JSON.stringify(resp.response, undefined, 2);
      document.getElementById("status-object").innerText = nodeStatus;
    }
  });
}
