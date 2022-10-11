/*
*********The Minima Innovation Challenge Team
*********ADV-CLI Dapp JS
*********THE TEAM DEVELOPERS************
*********
*********
-> BALANCE is a global variable that will be automatically updated on NEWBALANCE event as well and manually.
*/

//    <script type="text/javascript" src="js/service.js"></script>


var DAO_WALLET_ADDRESS = "";
var ADVERTISER_WALLET_ADDRESS ="";
var ADVERTISER_PUBLICKEY ="";
var SENDPOLLUID ="";
var GLOBAL = 0;
var COUNT = 0;
var BALANCE = {};
const ADVERTISING_TOKENS = [];
var BUYER_ADDRESS ="";
var BUYER_PUBLICKEY="";
var CAMPAIGNS = new Object();
var TARGET_USERS = [];
var TARGET_DEVELOPERS = [];

//Main message handler..
MDS.init(function(msg){
  //Do initialitzation
  if(msg.event == "inited"){
    MDS.log("The service.js is initialising MDS also in the background...");
    //createTheDB();
		//preparingSendpoll()
    listcampaignsDB(true);
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
    createTheDBDAOWalletAddress();
    createTheDBAdvertiserWalletAddress()
    createTheDBcampaign();
  }
  else if(msg.event == "NEWBLOCK"){
  // the chain tip has changed
  }
  else if(msg.event == "NEWBALANCE"){
    // user's balance has changed
    MDS.log("New Balance Detected");
		//Process the new event detected
    //alert("NEW BALANCE");
    getNewBalance();
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



//send address:0x9D90EE44464722B25EA05EBC443755FB81D8AAB1077726D5A2A09010BD041184 amount:7 tokenid:0x00 state:{"0":"[BUY]", "1":"0xC6496C916268F428259FA05A979A3FDE8E0901A52525A4D73578903AE2975634", "2":"0x00", "3":"7"}

/////*****MAXIMA SECTION

//This function just list the Maxima contacts
function Contact(){
  MDS.cmd("maxima", function(resp) {
    if (resp.status) {
      var contact = JSON.stringify(resp.response, undefined, 2);
      document.getElementById("").innerText = contact;
    }
  });
}

//This function add a Maxima contact
function AddContact() {
  //Get the information
  var contactname 	= document.getElementById('namecontact').value;
	var publickey = document.getElementById('publickeycontact').value;
  var contactid = document.getElementById('idcontact').value;
  CreateContact = "maxcontacts action:add contact:"+contactid+" publickey:"+publickey
  MDS.cmd(CreateContact, function(resp) {
    if (resp.status) {
      alert("Contact Created!");
      var nodeStatus = JSON.stringify(resp.response, undefined, 2);
      document.getElementById("status-object").innerText = nodeStatus;
      //MDS.log("Contact: "+CreateContact);
      //MDS.log(JSON.stringify(resp));
      Getcontacts();
    }
    //if the response status is false
    else{
      var nodeStatus = JSON.stringify(resp, undefined, 2);
      document.getElementById("status-object").innerText = nodeStatus;
      alert("Could not create the Contact");
      //MDS.log("Contact: "+CreateContact);
      //MDS.log(JSON.stringify(resp));
    }
  });
}

// Add the publicity token manually introduced
function add_publicity_token(){
  var tokenid = prompt("Please enter the Advertising Token id:", "");
  ADVERTISING_TOKENS.push(tokenid);
  GetTokens();
}

//Add the target user address manually introduced
function add_user_address(){
  var address = prompt("Please enter the User address:", "");
  TARGET_USERS.push(address);
  GetTokens();
}

//Add the target developer address manually introduced
function add_developer_address(){
  var address = prompt("Please enter the Developer address:", "");
  TARGET_DEVELOPERS.push(address);
  GetTokens();
}
//*****BALANCE SECTION

//This function just list the Minima Token Balance
//Modified to fetch the data from the global BALANCE variable
function MinimaBalance(){
  MDS.cmd("balance", function(res) {
  //if the response status is true
    if (res.status) {
      BALANCE = res.response;
      for(var i = 0; i < BALANCE.length; i++) {
        //Look for Minima token
        if(BALANCE[i].tokenid == "0x00"){
          //Get the values
      	  var MinimaToken = BALANCE[i].token;
          document.getElementById("MinimaToken").innerText = MinimaToken;
          var MinimaTokenid = BALANCE[i].tokenid;
          document.getElementById("MinimaTokenid").innerText = MinimaTokenid;
          var MinimaCoins = BALANCE[i].coins;
          document.getElementById("MinimaCoins").innerText = MinimaCoins;
      	  var MinimaSendable 	= BALANCE[i].sendable;
          document.getElementById("MinimaSendable").innerText = MinimaSendable;
          var MinimaTotal = BALANCE[i].total;
          document.getElementById("MinimaTotal").innerText = MinimaTotal;
  		  }
      }
      GetTokens();
      //alert("new balance event");
    }
    //if the response status is false
    else{
      document.getElementById("StatusBalances").innerText = "Warning: Could not retrieve current Balance Status";
    }
  });
}



//This function ley buy advertising tokens in exchange of Minimas
/*BUY
port == 0 operation
port == 1 client_wallet_address
port == 2 client_token_id
port == 3 client_amount_desired
port == 4 client_publickkey
*/
function BuyTokens(){
  //Get the information

  var select3	= document.getElementById('tokens3');
  var tokenid = select3.options[select3.selectedIndex].value;       // tokens to buy
	var buyer_address = document.getElementById('destinationaddress').value; //buyer address
  var amount = document.getElementById('amount').value;             //minimas to use to buy tokens
  var amount_buy_tokens = document.getElementById('amounttobuy').value;

  var state_vars = '{"0":"[BUY]","1":"'+buyer_address+'","2":"'+tokenid+'","3":"'+amount_buy_tokens+'","4":"'+ADVERTISER_PUBLICKEY+'"}';
  //alert(state_vars);
  //alert(DAO_WALLET_ADDRESS);
  var CreateSend = "send address:"+DAO_WALLET_ADDRESS+" amount:"+amount+" tokenid:0x00" + " state:"+state_vars;
  alert(CreateSend);
  MDS.cmd(CreateSend, function(resp) {
    if (resp.status) {
      MDS.log("Token Buyed "+CreateSend);
      alert("Buy Tokens executed!"+ CreateSend);
      var nodeStatus = JSON.stringify(resp.response, undefined, 2);
      document.getElementById("status-object").innerText = nodeStatus;
    }
    else{
      var nodeStatus = JSON.stringify(resp, undefined, 2);
      document.getElementById("status-object").innerText = nodeStatus;
      alert("Could not buy the Tokens");
      MDS.log("Token NOT Buyed "+CreateSend);
      //MDS.log(JSON.stringify(resp));
    }
  });
}



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
      //BUYER_ADDRESS = resp.response.address;
      //BUYER_PUBLICKEY = resp.response.publickey;
    }
  });
}

//This function just shows the main wallet address
function mainWalletAddress(){
  document.getElementById("daoaddress_id").innerText = DAO_WALLET_ADDRESS;
}

//This function just shows the main wallet address
function advertiserWalletAddress(){
  document.getElementById("advertiseraddress_id").innerText = ADVERTISER_WALLET_ADDRESS;
  document.getElementById("advertiserpublickey_id").innerText = ADVERTISER_PUBLICKEY;
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

//This function set a Maxima name
function SetMaximaName(){
  name = prompt("Please enter the MAXIMA Name:", "");
  MDS.log(name);
  setname = "maxima action:setname name:"+name
  MDS.cmd(setname, function(resp) {
    if (resp.status) {
      alert("Name Seted!");
      MDS.cmd("maxima", function(resp) {
        if (resp.status) {
          var maximaname = resp.response.name;
          document.getElementById("maximacontactname").innerText = maximaname;
        }
      });
    }
    //if the response status is false
    else{
      var nodeStatus = JSON.stringify(resp.response, undefined, 2);
      document.getElementById("status-object").innerText = nodeStatus;
      alert("Could not set the name!");
    }
  });
}

//This function lists ALL the tokensreceived Data Base
function ListtokensreceivedDB(){
  MDS.sql("SELECT * FROM tokensreceived",function(sqlmsg){
    if (sqlmsg.status) {
      var nodeStatus = JSON.stringify(sqlmsg, undefined, 2);
      document.getElementById("status-object").innerText = nodeStatus;
      MDS.log(JSON.stringify(sqlmsg));
    }
  });
}



//***** NEWBALANCE Recive and then send SECTION





//This function sends the tokens to the buyer once all has been checked
function SendTheTokensToTheBuyer(coin){

  MDS.log("Preparing the Transaction with the Following coind: "+coin.coinid);
  //MDS.log(JSON.stringify(coin));
  //Note that the state variables has changed and adapted to the client database.
  var operation;
  var client_wallet_address;
  var client_token_id;
  var client_amount_desired;
  for(var z = 0; z < coin.state.length; z++) {
    if (coin.state[z].port == 0) operation = coin.state[z].data;
    if (coin.state[z].port == 1) client_wallet_address = coin.state[z].data;
    if (coin.state[z].port == 2) client_token_id = coin.state[z].data;
    if (coin.state[z].port == 3) client_amount_desired = coin.state[z].data;
  }
  MDS.log("Client Operation to Process: "+operation);
  if (operation == "[BUY]"){
    if (coin.amount == client_amount_desired){
      //*****Note that for now the exchage rate between tokens is 1:1******
      MDS.log("Transaction Checked with the Following coinid: "+coin.coinid);
      MDS.log("Sending the Tokens to the Client with the Following Client Address: "+client_wallet_address)
      statevariables = "{\"0\":\"[BUY]\", \"1\":\""+client_wallet_address+"\", \"2\":\""+client_token_id+"\", \"3\":\""+client_amount_desired+"\"}";
      command = "sendpoll address:"+client_wallet_address+" amount:"+client_amount_desired+" tokenid:"+client_token_id+" state:"+statevariables+" uid:"+SENDPOLLUID;
      //command = "send address:"+client_wallet_address+" amount:"+client_amount_desired+" tokenid:"+client_token_id+" state:"+statevariables;
      MDS.cmd(command, function(res){
      if (res.status) {
        MDS.log("The Tokens HAS BEEN SENT to Following Client Address: "+client_wallet_address);
        //actualitzate the DB as the tokens has been send
        MDS.sql("UPDATE tokensreceived SET trxdone=1 WHERE coinidreceived='"+coin.coinid+"'", function(resp){
          if (resp.status) {
            MDS.log("Transaction Updated in the Data Base");
            MDS.log("CLIENT TRANSACTION PROCESS ENDED CORRECTLY");
          }
        });
      }
      else{
          var nodeStatus = JSON.stringify(res, undefined, 2);
          document.getElementById("status-coin").innerText = nodeStatus;
          MDS.log(JSON.stringify(res));
        }
      });
    }
  }
}


//***** SERVICE.JS FUNCTIONS SECTION

//This function just update the Blockchain time
function updateTime(){
  MDS.cmd("status", function(res) {
    if (res.status) {
      const blockchaintime = res.response.chain.time;
      document.getElementById("blockchaintime").innerText = blockchaintime;
    }
  });
}


function setBuyerAddressForm(){
  document.getElementById('destinationaddress').value = ADVERTISER_WALLET_ADDRESS;
  //alert(document.getElementById('destinationaddress').value);
}

//This function just list any Token Balance
//Fetches the data from global variable BALANCE
function TokenBalance(){
      //Grab the token to look for its balance.
      var select = document.getElementById('tokens2');
      var value = select.options[select.selectedIndex].value;
      for(var i = 0; i < BALANCE.length; i++) {
        //Look for the token
        if(BALANCE[i].tokenid == value){
          //Return the function value as true and Get the values
          var Tokenid = BALANCE[i].tokenid;
          document.getElementById("Tokenid").innerText = Tokenid;
          var Coins = BALANCE[i].coins;
          document.getElementById("Coins").innerText = Coins;
      	  var Sendable 	= BALANCE[i].sendable;
          document.getElementById("Sendable").innerText = Sendable;
          var Total = BALANCE[i].total;
          document.getElementById("Total").innerText = Total;
          return;
  		  }
      }
}

//This function just get the Balance of selected Advertiser token
//Fetches the data from global variable BALANCE
function TokenAdvertiserBalance(){
      //Grab the token tofrom Status tools and Section clicking on <b>Get Address</b> look for its balance.
      var select = document.getElementById('select_advertiser_tokens');
      var value = select.options[select.selectedIndex].value;
      for(var i = 0; i < BALANCE.length; i++) {
        //Look for the token
        if(BALANCE[i].tokenid == value){
          //Return the function value as true and Get the values
      	  var Sendable 	= BALANCE[i].sendable;
          document.getElementById("availableTokensConfigure").innerText = Sendable;
          //var Total = BALANCE[i].total;
          //document.getElementById("Total").innerText = Total;
          return;
  		  }
      }
}

//This function the token that has been fetched
//on globbal variable BALANCE
function getTokenByTokenID(tokenid){
      for(var i = 0; i < BALANCE.length; i++) {
        //Look for the token
        if(BALANCE[i].tokenid == tokenid){
          return BALANCE[i];  // return the token that matched the tokenid
  		  }
      }
}

//This function just detect if the type advertise type is set to Text then
//It shows all texts fields and delete the content of web/image and disables it
function TypeAdvertiseChange(){
      //Grab the token to look for its balance.
      var select = document.getElementById('select_type_advertise');
      var value = select.options[select.selectedIndex].value;
      if (value == 0) {  // Text
        // we initilalize the text fields with "-" to avoid a minima bug when Sending
        // a transaction with multucommands, if the string is empty or contains one space,
        // the transaction will fails.

        document.getElementById('web_img_input').value = "-";
        document.getElementById('web_img_input').disabled = true;
        document.getElementById("text_0_adv").disabled = false;
        document.getElementById("text_1_adv").disabled = false;
        document.getElementById("text_2_adv").disabled = false;
        document.getElementById("text_3_adv").disabled = false;
        document.getElementById("text_4_adv").disabled = false;
        document.getElementById("text_5_adv").disabled = false;
        document.getElementById("text_6_adv").disabled = false;
        document.getElementById("text_7_adv").disabled = false;
        document.getElementById("text_8_adv").disabled = false;
      } else {
        document.getElementById('web_img_input').disabled = false;
        document.getElementById("text_0_adv").value = "-";
        document.getElementById("text_1_adv").value = "-";
        document.getElementById("text_2_adv").value = "-";
        document.getElementById("text_3_adv").value = "-";
        document.getElementById("text_4_adv").value = "-";
        document.getElementById("text_5_adv").value = "-";
        document.getElementById("text_6_adv").value = "-";
        document.getElementById("text_7_adv").value = "-";
        document.getElementById("text_8_adv").value = "-";
        document.getElementById("text_0_adv").disabled = true;
        document.getElementById("text_1_adv").disabled = true;
        document.getElementById("text_2_adv").disabled = true;
        document.getElementById("text_3_adv").disabled = true;
        document.getElementById("text_4_adv").disabled = true;
        document.getElementById("text_5_adv").disabled = true;
        document.getElementById("text_6_adv").disabled = true;
        document.getElementById("text_7_adv").disabled = true;
        document.getElementById("text_8_adv").disabled = true;
      }
}


// Execute minima balance command and set the balance as a Global variable BALANCE every time is called
// It is called by default on NEWBALANCE event
// It is called by default when the app starts also
function getNewBalance(){
  MDS.cmd("balance", function(res) {
  //if the response status is true
    if (res.status) {
      BALANCE = res.response;
      GetTokens();
      //alert("new balance event");
    }
    //if the response status is false
    else{
      document.getElementById("StatusBalances").innerText = "Warning: Could not retrieve current Balance Status";
    }
  });
}


function get_user_script(){
  var select_users_wallets= document.getElementById("select_users_wallets");
  var user_address = select_users_wallets.options[select_users_wallets.selectedIndex].value;
  var select_developers_wallets= document.getElementById("select_developers_wallets");
  var developer_address = select_developers_wallets.options[select_developers_wallets.selectedIndex].value;

  var script = "LET finalUserWallet=" + user_address +
  " LET dappDeveloperWallet="+developer_address+ " RETURN TRUE"
  return script;
}


function get_minima_amount_available(){
  for(var i=0; i < BALANCE.length; i++) {
    if(BALANCE[i].tokenid == "0x00"){
      return BALANCE[i].sendable;
    }
  }
}


// Build the transaction for sending a campaign to the final user
// rewards_coinid[] is an array of coinid that all of them sum the quantity necesary, so that the configured campaign tokens
// indicates to be sent to the final user, otherwise, if the rewards sent to the final user than the campaign dictates are
// not send,the payouts on the final user will fail as well as the script that verify that the stablished rules
// are meet.
function getTxSendCampaignString(token, address, camapign_address, rewards_coinid, rewards_token, rewards_amount, pubicity_amout, advertiser_wallet, change_back, change_back_token){
  //Create a random txn id..
  var txnid = Math.floor(Math.random()*1000000000);

  //Construct Transaction..
  var txncreator = "txncreate id:"+txnid+";"+
    "txninput id:"+txnid+" coinid:"+token.coinid+";"

    //alert("txncreator: "+JSON.stringify(rewards_coinid));
    for (var i=0; i<rewards_coinid.length; i++) {
      txncreator += "txninput id:"+txnid+" coinid:"+rewards_coinid[i]+";"
      //alert("txncreator: "+rewards_coinid[i]);
    }

    txncreator +=
    "txnoutput id:"+txnid+" amount:"+rewards_amount+" address:"+address+" tokenid:"+rewards_token+" storestate:false;"+
    "txnoutput id:"+txnid+" amount:"+pubicity_amout+" address:"+address+" tokenid:"+token.tokenid+" storestate:true;"
    if (change_back > 0) {
      txncreator += "txnoutput id:"+txnid+" amount:"+change_back+" address:"+advertiser_wallet+" tokenid:"+rewards_token+" storestate:false;"
    }
    if (change_back_token > 0) {
      txncreator += "txnoutput id:"+txnid+" amount:"+change_back_token+" address:"+camapign_address+" tokenid:"+token.tokenid+" storestate:true;"
    }
    txncreator +=
    "txnstate id:"+txnid+" port:0 value:"+token.state[0].data+";"+
    "txnstate id:"+txnid+" port:1 value:"+token.state[1].data+";"+
    "txnstate id:"+txnid+" port:2 value:"+token.state[2].data+";"+
    "txnstate id:"+txnid+" port:3 value:"+token.state[3].data+";"+
    "txnstate id:"+txnid+" port:4 value:"+token.state[4].data+";"+ //DAO wallet
    "txnstate id:"+txnid+" port:5 value:"+token.state[5].data+";"+
    "txnstate id:"+txnid+" port:6 value:"+token.state[6].data+";"+
    "txnstate id:"+txnid+" port:7 value:"+token.state[7].data+";"+
    "txnstate id:"+txnid+" port:8 value:"+token.state[8].data+";"+
    "txnstate id:"+txnid+" port:9 value:"+token.state[9].data+";"+
    "txnstate id:"+txnid+" port:10 value:"+token.state[10].data+";"+
    "txnstate id:"+txnid+" port:11 value:"+token.state[11].data+";"+
    "txnstate id:"+txnid+" port:12 value:"+token.state[12].data+";"+
    "txnstate id:"+txnid+" port:13 value:"+token.state[13].data+";"+
    "txnstate id:"+txnid+" port:14 value:2;"+     // 2:sent  -> set state to Token to used
    "txnstate id:"+txnid+" port:15 value:"+token.state[15].data+";"+
    "txnstate id:"+txnid+" port:16 value:"+token.state[16].data+";"+
    "txnstate id:"+txnid+" port:17 value:"+token.state[17].data+";"+
    "txnstate id:"+txnid+" port:18 value:"+token.state[18].data+";"+
    "txnstate id:"+txnid+" port:19 value:"+token.state[19].data+";"+
    "txnstate id:"+txnid+" port:20 value:"+token.state[20].data+";"+
    "txnstate id:"+txnid+" port:21 value:"+token.state[21].data+";"+
    "txnstate id:"+txnid+" port:22 value:"+token.state[22].data+";"+
    "txnstate id:"+txnid+" port:23 value:"+token.state[23].data+";"+
    "txnstate id:"+txnid+" port:24 value:"+token.state[24].data+";"+
    "txnstate id:"+txnid+" port:25 value:"+token.state[25].data+";"+
    "txnstate id:"+txnid+" port:26 value:"+token.state[26].data+";"+
    "txnstate id:"+txnid+" port:27 value:"+token.state[27].data+";"+
    "txnstate id:"+txnid+" port:28 value:"+token.state[28].data+";"+
    "txnstate id:"+txnid+" port:29 value:"+token.state[29].data+";"+
    "txnstate id:"+txnid+" port:30 value:"+token.state[30].data+";"+
    "txnstate id:"+txnid+" port:31 value:"+token.state[31].data+";"+
    "txnbasics id:"+txnid+";"+
    "txnsign id:"+txnid+" publickey:auto;"+
    "txnpost id:"+txnid+";"+
    "txndelete id:"+txnid+";";
    return txncreator;
}


// Send a publicity campaign token configured to the final user script address, composed of a user wallet and developer
// walletWALLET_ADDRES as well as the rewards of the user and the developer in order to the final user script can make
// the payouts when the publicty token will be watched
function sendCampaign(){
  // get script address
  var command = 'runscript script:"'+get_user_script()+'"';

  MDS.cmd(command, function(res) {
  //if the response status is true
    if (res.status) {
      var final_user_script_address = res.response.script.address;
      var campaign_name_select= document.getElementById("select_campaigns");
      var campaign_tokenid = campaign_name_select.options[campaign_name_select.selectedIndex].value;
      var campaign_name = campaign_name_select.options[campaign_name_select.selectedIndex].text;
      var campaign_address = CAMPAIGNS[campaign_name].campaign_address;
      var campaign_amount = CAMPAIGNS[campaign_name].amount;

      MDS.cmd("coins address:"+campaign_address, function(res){
        if (res.status) {
          if (res.response.length == 0) {alert("There are no more tokens avaiable for this campaign");return;}
          MDS.log("Getting token info to send the campaing to : "+res.response[0].tokenid);
          //alert(JSON.stringify(res.response, undefined, 2));

          const coin = res.response[0];
          var tokenid = coin.tokenid;
          var coinid  = coin.coinid;
          var user_rewards = parseFloat(coin.state[17].data);
          var developer_rewards = parseFloat(coin.state[15].data);
          var total_rewards_to_send = developer_rewards + user_rewards;
          var change_back_token = 0;

          MDS.log(JSON.stringify(coin))
          //alert(total_rewards_to_send+" ,"+developer_rewards+" ,"+user_rewards);

          var advertiser_wallet = coin.state[10].data;   // buyer address

          // Get the total amount of tokens for this campaign to get the change  back amount
          var change_back_token = 0;  //coin.tokenamount - 1;
          var total_amount_tokens = 0;
          for (var i=0; i<res.response.length; i++){
            var token = res.response[i];
            if (token.tokenid != 0x00){
              total_amount_tokens += token.tokenamount;
            }
          }
          if (total_amount_tokens > 0) change_back_token = total_amount_tokens - 1; // we send only one token at a time
          alert("change_back_token: "+change_back_token);

          // check if there are enough funds quantity to send along with the campaign token since the token specify
          // the amount needed to send, so far we only consider minima token rewards
          // we only look into ADVERTISER_WALLET_ADDRESS to assure the minimas we got are from the same node
          // and not other coins from other nodes tracked
          if (get_minima_amount_available() < total_rewards_to_send) {
            alert("You don't have enough minima funds to send the campaign, you need: "+total_rewards_to_send+" minimas and only have: "+get_minima_amount_available);
            return;
          }else {
            // ## Look for and fetch coinid minimas rewards to send on the transaciot
            // we need to get all coinids  of minima tokens that sum at least the total_rewards_to_send
            MDS.cmd("coins address:"+ADVERTISER_WALLET_ADDRESS+" tokenid:0x00", function(res){
              if (res.status) {
                var change_back = 0.0;
                var coinid_rewards = [];
                var total_minima_coinids = 0.0;

                // Get the list of coinid that sum at least the ammount of rewards to send
                for (var i=0; i<res.response.length; i++){
                  var coinid = res.response[i];
                  // discard minimas with state variables set
                  if (coinid.state.length == 0){
                    coinid_rewards.push(coinid.coinid);
                    total_minima_coinids += parseFloat(coinid.amount);
                    alert(total_minima_coinids+", "+total_rewards_to_send);
                    if (total_minima_coinids >= parseFloat(total_rewards_to_send)) break;
                  }
                }
                change_back = total_minima_coinids - total_rewards_to_send;
                //alert("tokensChangeBack:"+coin.tokenamount - 1);
                // SENDING campaign building a custom transaction
                var command = getTxSendCampaignString(coin, final_user_script_address, campaign_address, coinid_rewards, "0x00", total_rewards_to_send, "1", advertiser_wallet, change_back, change_back_token);
                MDS.log("Send Campaign minima command: "+command);
                //alert(command);
                MDS.log("PRINTING splitted command: ");
                var split_command = command.split(';');
                split_command.forEach(function (value) {
                  MDS.log(value);
                });

                MDS.cmd(command, function(res){
                  var status = true;
                  for (var i=0; i<res.length; i++){ //CHECK  FOR ERRORS ON EVERY COMMAND OF TRANSACTION
                      if (!res[i].status) { // if some comand fails
                        alert("ERROR: Campaign tokens has not been sent");
                        MDS.log("---ERROR--- Send Campaign "+campaign_name+" token : "+campaign_name+" command : "+res[i].command+" token : "+JSON.stringify(res[i].params)+" token : "+tokenid+" to address: "+campaign_address);
                        var nodeStatus = JSON.stringify(res[i], undefined, 2);
                        document.getElementById("status-object").innerText = nodeStatus;
                        status = false;
                        MDS.log(JSON.stringify(res[i]));
                        break;
                      }
                  }
                  if (status) {
                    alert("Campaign "+campaign_name+" sento to final user script address: "+final_user_script_address);
                    MDS.log("Send Campaign "+campaign_name+" token : "+tokenid+" to address: "+campaign_address);
                    MDS.log("Send Campaign rewards amount:"+total_rewards_to_send);
                    MDS.log("Send Campaign change back amount: "+change_back);
                    // update campaing database and subtract 1 to the amount of tokens
                    update_campaign_amount(campaign_name, campaign_amount - 1);
                    var nodeStatus = JSON.stringify(res, undefined, 2);
                    document.getElementById("status-object").innerText = nodeStatus;
                  }
                });
              }else {
                MDS.log(JSON.stringify(sqlmsg));
              }
            });
          }
        }else {
          alert("There are not tokens on this address"+campaign_address);
          MDS.log(JSON.stringify(sqlmsg));
        }
      });
      }else{
        MDS.log(JSON.stringify(sqlmsg));
      }
    });
}


//Send the Tokens available to the dongles
//Fetch the data from BALANCE global variable
//It is called from getNewBalance as it must be updated every time a NEWBALANCE even happensç
//And also fetches all selects combo info that need to update on load or every newbalance event
function GetTokens(){
    //Create the select dongles
    var select = document.getElementById('tokens');
    while (select.hasChildNodes()) {
      select.removeChild(select.firstChild);
    }
    var select2  = document.getElementById('tokens2');
    while (select2.hasChildNodes()) {
      select2.removeChild(select2.firstChild);
    }
    var select3  = document.getElementById('tokens3');
    while (select3.hasChildNodes()) {
      select3.removeChild(select3.firstChild);
    }
    var select4  = document.getElementById('select_campaigns');
    while (select4.hasChildNodes()) {
      select4.removeChild(select4.firstChild);
    }
    var select_advertiser_tokens = document.getElementById('select_advertiser_tokens');
    while (select_advertiser_tokens.hasChildNodes()) {
      select_advertiser_tokens.removeChild(select_advertiser_tokens.firstChild);
    }
    var select_tokens_type_reward_dapp = document.getElementById('tokens_type_reward_dapp');
    while (select_tokens_type_reward_dapp.hasChildNodes()) {
      select_tokens_type_reward_dapp.removeChild(select_tokens_type_reward_dapp.firstChild);
    }
    var select_tokens_type_reward_user = document.getElementById('tokens_type_reward_user');
    while (select_tokens_type_reward_user.hasChildNodes()) {
      select_tokens_type_reward_user.removeChild(select_tokens_type_reward_user.firstChild);
    }
    var select_users_wallets = document.getElementById('select_users_wallets');
    while (select_users_wallets.hasChildNodes()) {
      select_users_wallets.removeChild(select_users_wallets.firstChild);
    }
    var select_developers_wallets = document.getElementById('select_developers_wallets');
    while (select_developers_wallets.hasChildNodes()) {
      select_developers_wallets.removeChild(select_developers_wallets.firstChild);
    }

    //Add each Token
    //Add the tokens to the dongle Buy a Token (spend)
    for(var i = 0; i < BALANCE.length; i++) {
      var opt = document.createElement('option');
      if(BALANCE[i].tokenid == "0x00"){
        opt.value = BALANCE[i].tokenid;
        opt.innerHTML = BALANCE[i].token;
      }/*else{
        opt.value = BALANCE[i].tokenid;
        opt.innerHTML = BALANCE[i].token.name;
      }*/
      select.appendChild(opt);
      break;
    }

    //Add tokens to the dongle Token balance
    for(var i = 0; i < BALANCE.length; i++) {
      var opt = document.createElement('option');
      if(BALANCE[i].tokenid == "0x00"){
        opt.value = BALANCE[i].tokenid;
        opt.innerHTML = BALANCE[i].token;
      }else{
        opt.value = BALANCE[i].tokenid;
        opt.innerHTML = BALANCE[i].token.name;
      }
      select2.appendChild(opt);
    }

    //Add tokens to the dongle buy a Token (buy)

    for(var i = 0; i < ADVERTISING_TOKENS.length; i++) {
      var opt = document.createElement('option');
      opt.value = ADVERTISING_TOKENS[i];
      opt.innerHTML = ADVERTISING_TOKENS[i];
      select3.appendChild(opt);
    }


    //Add tokens to the dongle configure Advertiser token
    //Add blank element on the first position, so in the changeGetTokens event the
    //amount of tokens can be triggered automatically
    var opt = document.createElement('option');
    select_advertiser_tokens.appendChild(opt);
    for(var i = 0; i < BALANCE.length; i++) {
      if(BALANCE[i].tokenid != "0x00"){
        if (isAdvertiserToken(BALANCE[i].tokenid)) {
          opt = document.createElement('option');
          opt.value = BALANCE[i].tokenid;
          opt.innerHTML = BALANCE[i].token.name;
          select_advertiser_tokens.appendChild(opt);
        }
      }

    }

    //Add the tokens to the dongle type of Dapp rewards
    for(var i = 0; i < BALANCE.length; i++) {
      var opt = document.createElement('option');
      if(BALANCE[i].tokenid == "0x00"){
        opt.value = BALANCE[i].tokenid;
        opt.innerHTML = BALANCE[i].token;
      }else{
        opt.value = BALANCE[i].tokenid;
        opt.innerHTML = BALANCE[i].token.name;
      }
      select_tokens_type_reward_dapp.appendChild(opt);
    }

    //Add the tokens to the dongle type of User rewards
    for(var i = 0; i < BALANCE.length; i++) {
      var opt = document.createElement('option');
      if(BALANCE[i].tokenid == "0x00"){
        opt.value = BALANCE[i].tokenid;
        opt.innerHTML = BALANCE[i].token;
      }else{
        opt.value = BALANCE[i].tokenid;
        opt.innerHTML = BALANCE[i].token.name;
      }
      select_tokens_type_reward_user.appendChild(opt);
    }

    //Add Target Users to the dongle Send Camapign
    //alert(TARGET_USERS.length);
    for(var i = 0; i < TARGET_USERS.length; i++) {
      var opt = document.createElement('option');
      opt.value = TARGET_USERS[i];
      opt.innerHTML = TARGET_USERS[i];
      select_users_wallets.appendChild(opt);
    }

    //Add Target Developers to the dongle Send Camapign
    //alert(TARGET_DEVELOPERS.length);
    for(var i = 0; i < TARGET_DEVELOPERS.length; i++) {
      var opt = document.createElement('option');
      opt.value = TARGET_DEVELOPERS[i];
      opt.innerHTML = TARGET_DEVELOPERS[i];
      select_developers_wallets.appendChild(opt);
    }



    //Add the configured campaigns from memory to the dongle Send Campaign
    //alert(Object.keys(CAMPAIGNS));
    setTimeout(() => {
      //alert(Object.keys(CAMPAIGNS).length);
      while (select4.hasChildNodes()) {
        select4.removeChild(select4.firstChild);
      }

         Object.keys(CAMPAIGNS).forEach(function(key, idx) {
           console.log("getting campaign: "+CAMPAIGNS[key].campaign_name + ": " + CAMPAIGNS[key].tokenid);
           var opt = document.createElement('option');
           opt.value = CAMPAIGNS[key].tokenid;
           opt.innerHTML = CAMPAIGNS[key].campaign_name;
           select4.appendChild(opt);
           if (idx == 0) {  // first element, we updated the related fields
             var campaign_tokenid = CAMPAIGNS[key].tokenid;
             var campaign_name = CAMPAIGNS[key].campaign_name;
             var campaign_address = CAMPAIGNS[key].campaign_address;
             var token_amount = CAMPAIGNS[key].amount;
             document.getElementById('availableTokensCampaign').innerHTML = token_amount;
             document.getElementById('tokeidcampaign').innerHTML = campaign_tokenid;
             document.getElementById('addresscampaign').innerHTML = campaign_address;
           }
        });
    }, 300);
}

// Once a campaig in Send Campaing is selected it gets the info of the
// campaign and sets it on the interface
function onupdateSelectCapaignInfo(){
  var campaign_name_select= document.getElementById("select_campaigns");
  var campaign_tokenid = campaign_name_select.options[campaign_name_select.selectedIndex].value;
  var campaign_name = campaign_name_select.options[campaign_name_select.selectedIndex].text;
  var campaign_address = CAMPAIGNS[campaign_name].campaign_address;
  var campaign_amount = CAMPAIGNS[campaign_name].amount;
  document.getElementById('availableTokensCampaign').innerHTML = campaign_amount;
  document.getElementById('tokeidcampaign').innerHTML = campaign_tokenid;
  document.getElementById('addresscampaign').innerHTML = campaign_address;
}


// Returns true is a given tokenid is an Advertiser TokenName
function isAdvertiserToken(tokenID){
  for (var i=0; i < ADVERTISING_TOKENS.length; i++) {
    if (ADVERTISING_TOKENS[i] === tokenID) return true;
  }
  return false;
}

//This function excutes a flashloan contract kind of on a
//Avertiser Token, so the token is send to itself but with all
//state variables related to campaing set on the token as the script requires.
//state 14 set to 1(configured)
function ConfigureCampaign(){
  MDS.log("Configurig Campaign , flahLoan contract: ");

  var campaign = document.getElementById("campaign_name").value;
  var advertiser_token_select= document.getElementById("select_advertiser_tokens");
  var advertiser_token = advertiser_token_select.options[advertiser_token_select.selectedIndex].value;
  var token_amount = document.getElementById("token_amount_configure").value;
  var tk = getTokenByTokenID(advertiser_token);
  //alert(token_amount+", "+tk.sendable);
  var available = tk.sendable - token_amount;
  if (available < 0) {
    alert("You cannot configure more tokens than you have, MAX available tokens amount: "+tk.sendable);
    return;
  }
  var type_advertise_select = document.getElementById("select_type_advertise");
  var type_advertise = type_advertise_select.options[type_advertise_select.selectedIndex].value;
  //alert("Advertise type:"+type_advertise);
  var web_img = document.getElementById("web_img_input").value;
  var dapp_rewards = document.getElementById("dapp_rewards").value;
  var tokens_type_reward_dapp = document.getElementById("tokens_type_reward_dapp").value;
  var user_rewards = document.getElementById("user_rewards").value;
  var tokens_type_reward_user = document.getElementById("tokens_type_reward_user").value;
  var actions_adv = document.getElementById("actions_adv").value;
  var rules_adv = document.getElementById("rules_adv").value;
  var text_0_adv = document.getElementById("text_0_adv").value;
  var text_1_adv = document.getElementById("text_1_adv").value;
  var text_2_adv = document.getElementById("text_2_adv").value;
  var text_3_adv = document.getElementById("text_3_adv").value;
  var text_4_adv = document.getElementById("text_4_adv").value;
  var text_5_adv = document.getElementById("text_5_adv").value;
  var text_6_adv = document.getElementById("text_6_adv").value;
  var text_7_adv = document.getElementById("text_7_adv").value;
  var text_8_adv = document.getElementById("text_8_adv").value;


    MDS.cmd("coins tokenid:"+advertiser_token, function(res){
      if (res.status) {
        MDS.log("Getting token info to Configure Campaign by tokenid: "+res.response[0].tokenid);
        alert(JSON.stringify(res.response, undefined, 2));
        var nodeStatus = JSON.stringify(res, undefined, 2);
        document.getElementById("status-object").innerText = nodeStatus;
        MDS.log(JSON.stringify(res));


        var coin = res.response[0];
        var state_vars = '{' + get_state_vars_string(coin, 12) +
            '"13":"['+campaign+']",' +
            '"14":"1",' +
            '"15":"'+dapp_rewards+'",' +
            '"16":"'+tokens_type_reward_dapp+'",' +
            '"17":"'+user_rewards+'",' +
            '"18":"'+tokens_type_reward_dapp+'",' +
            '"19":"'+type_advertise+'",';
            if (web_img.length == 0) state_vars += '"20":"['-']",';
            else state_vars += '"20":"['+web_img+']",';


            state_vars +=
            '"21":"['+actions_adv+']",' +
            '"22":"['+rules_adv+']",' +
            '"23":"['+text_0_adv+']",' +
            '"24":"['+text_1_adv+']",' +
            '"25":"['+text_2_adv+']",' +
            '"26":"['+text_3_adv+']",' +
            '"27":"['+text_4_adv+']",' +
            '"28":"['+text_5_adv+']",' +
            '"29":"['+text_6_adv+']",' +
            '"30":"['+text_7_adv+']",' +
            '"31":"['+text_8_adv+']"}';

            MDS.log("STATE VARS:"+state_vars);
            // Send tokent to himself (buyer) = coin.state[10]

            //alert(JSON.stringify(res.response[0]));
            //Check if the campaign name exists on the database
            MDS.sql("SELECT * from configured_campaign WHERE campaign_name='"+campaign+"'", function(sqlmsg){
              if (sqlmsg.status) {
                if (sqlmsg.count > 0){
                  alert("The Campaign ALREADY EXISTS in the DB, choose another name");
                  return;
                }else {
                  register_token_campaign_script(advertiser_token, campaign, function(res1){
                    alert(JSON.stringify(res1));
                    var campaign_script_address = res1.response.address;
                    var command = 'send address:' + campaign_script_address + ' amount:'+token_amount+ ' tokenid:'+advertiser_token + ' state:'+state_vars;
                    alert(command);
                    MDS.cmd(command, function(res2){
                      if (res2.status) {
                        //registers de campaign to the database
                        register_campaing(campaign, advertiser_token, campaign_script_address, token_amount);
                        MDS.log("Configured tokens Camapign with state vars of Campaign: "+campaign+" tokenid:"+advertiser_token+" campaign_script_address: "+campaign_script_address);
                        //alert(JSON.stringify(res.response, undefined, 2));
                        //alert("TOKEN SENT "+advertiser_token);
                        var nodeStatus = JSON.stringify(res2, undefined, 2);
                        document.getElementById("status-object").innerText = nodeStatus;
                      }
                      else{
                          alert("ERROR ConfigureCampaign tokens failed to be sent");
                          var nodeStatus = JSON.stringify(res2, undefined, 2);
                          document.getElementById("status-object").innerText = nodeStatus;
                          MDS.log(JSON.stringify(res2));
                        }
                    });
                  });
                }
              }else {
                  MDS.log(JSON.stringify(sqlmsg));
              }
            });

      }
      else{
          //alert("ERROR");
          //var nodeStatus = JSON.stringify(res, undefined, 2);
          //document.getElementById("status-coin").innerText = nodeStatus;
          MDS.log(JSON.stringify(res));
        }
    });
}

// Get the state vars of a tokenID until the last number specified by end
// The string returned is not the Json object, it is a string of type ( "0":"abc", "1":"56", "2":"ght")
function get_state_vars_string (coin, end){
  var state_vars = '';
      for(var z = 0; z < coin.state.length; z++) {
        if (coin.state[z].port < end+1) {
          state_vars += '"'+coin.state[z].port+'":'+'"'+coin.state[z].data+'",';
        } else break;
      }
  //alert(state_vars);
  return state_vars;
}

// new evolution Adveriser.

//This function just create the databases if they are not yet
function createTheDBDAOWalletAddress(){
	initsql = "CREATE TABLE IF NOT EXISTS `daowalletaddress` ( "
					+"  `id` IDENTITY PRIMARY KEY, "
					+"  `walletaddress` varchar(512), "
					+"  `date` bigint "
					+" )";

		MDS.sql(initsql,function(msg){
			MDS.log("DB DAO Wallet Addresses Inited..");
      setWalletDAO_Data();
		});
}

//This function just create the databases if they are not yet
function createTheDBcampaign(){
	initsql = "CREATE TABLE IF NOT EXISTS `configured_campaign` ( "
					+"  `campaign_name` VARCHAR(64) PRIMARY KEY, "
					+"  `tokenid` varchar(512), "
          +"  `campaing_address` varchar(512), "
					+"  `amount` int "
					+" )";

		MDS.sql(initsql,function(res){
      var nodeStatus = JSON.stringify(res, undefined, 2);
      document.getElementById("status-object").innerText = nodeStatus;
      MDS.log(JSON.stringify(res));
			MDS.log("DB configured_camapaign created");
		});
}

//This function just create the databases if they are not yet
function createTheDBAdvertiserWalletAddress(){
	initsql = "CREATE TABLE IF NOT EXISTS `advertiserwalletaddress` ( "
					+"  `id` IDENTITY PRIMARY KEY, "
					+"  `walletaddress` varchar(512), "
          +"  `publickey` varchar(512), "
					+"  `date` bigint "
					+" )";

		MDS.sql(initsql,function(msg){
			MDS.log("DB Advertiser Wallet Addresses Inited..");
      setWalletAdvertiser_Data();
		});
}

function deleteCapmpaignsRegisters(){
  var fullsql = "DELETE from configured_campaign";

  MDS.sql(fullsql, function(resp){
    MDS.log(JSON.stringify(resp));
    if (resp.status) {
      MDS.log("Deleting all campaigns from configured_campaign DB");
      CAMPAIGNS = new Object();
      GetTokens(); //Update the inteface
    }
    else {
      MDS.log("The registers from configured_campaignDB HAS NOT BEEN deleted");
    }
  });
}

function setWalletDAO_Data(){
  MDS.sql("SELECT * from daowalletaddress", function(sqlmsg){
    if (sqlmsg.status) {
      if (sqlmsg.count == 0){
        MDS.log("Runing the Dapp for the first time..");
        setDAOWalletAddress();
        MDS.log("Runing the Dapp for the first time..setWalletDAO_Data");
      }
      else{
        var sqlrows = sqlmsg.rows;
        //Takes the last address recorded
        let i = (sqlrows.length -1);
        var sqlrow = sqlrows[i];
        DAO_WALLET_ADDRESS = sqlrow.WALLETADDRESS;
        mainWalletAddress();
      }
    }else {
        alert(JSON.stringify(sqlmsg));
      }
  });
}

function setWalletAdvertiser_Data(){
  MDS.sql("SELECT * from advertiserwalletaddress", function(sqlmsg){
    if (sqlmsg.status) {
      if (sqlmsg.count == 0){
        MDS.log("Runing the Dapp for the first time..setWalletAdvertiser_Data");
        setAdvertiserWalletAddress();
      }
      else{
        var sqlrows = sqlmsg.rows;
        //Takes the last address recorded
        let i = (sqlrows.length -1);
        var sqlrow = sqlrows[i];
        ADVERTISER_WALLET_ADDRESS = sqlrow.WALLETADDRESS;
        ADVERTISER_PUBLICKEY = sqlrow.PUBLICKEY;
        advertiserWalletAddress();
      }
    }else {
      alert(JSON.stringify(sqlmsg));
    }
  });
}


function get_campaign_script_string(campaign_name, tokenid){
  var script = "LET tokenid=" + tokenid + " LET campaignname=[" +campaign_name+ "] RETURN TRUE";
  return script;
}

// Based on (campaign_name, tokenid) it findout which script addres by runing the minima command "runscript"
// to find out the address of the script combination parameters
// then pass the info to the callback function
function get_campaign_script_address(campaign_name, tokenid, callback){
  var campaign_script = get_campaign_script_string(campaign_name,tokenid);
  alert(campaign_script);
  var command = 'runscript trackall:true script:"'+campaign_script+'"'
  MDS.cmd(command, function(res) {
  //if the response status is true
    if (res.status) {
      callback(res);
    }
    //if the response status is false
    else{
        MDS.log("ERROR: Could not retrieve SCRIPT CAMPAIGN address: "+JSON.stringify(res));
    }
  });
}

// Inserts on the database, the  configured camapign data and also updates the global CAMPAIGNS variable object
// And also registers the script to the minima node if is a new campaign
function register_campaing(campaign_name, tokenid, campaign_script_address, amount) {
  var selectdb = "configured_campaign";
  MDS.log("Checking if there is a campaign saved");

  MDS.sql("SELECT * from "+selectdb+" WHERE campaign_name='"+campaign_name+"'", function(sqlmsg){
    if (sqlmsg.status) {
      if (sqlmsg.count == 0){
        MDS.log("Inserting the campaing name for the first time..");
          var campaing_address = campaign_script_address;
          var fullsql = "INSERT INTO configured_campaign (campaign_name,tokenid,campaing_address,amount) VALUES "
              +"('"+campaign_name+"','"+tokenid+"','"+campaing_address+"','"+amount+"')";

          MDS.sql(fullsql, function(resp){
            MDS.log(JSON.stringify(resp));
            if (resp.status) {
              MDS.log("Campaign HAS BEEN Inserted Correctly in the DB");
              // Replicate on memory the campaing object of the database
              var campaign = new Object();
                campaign.campaign_name = campaign_name;
                campaign.tokenid = tokenid;
                campaign.campaign_address = campaign_script_address;
                campaign.amount = amount;
                CAMPAIGNS [campaign_name] = campaign;    //Replicate the insert to the Global memory objec CAMPAIGNS
                //alert("Wallet CAMPAIGN has Saved Correctly"+JSON.stringify(campaign));
                //alert("Wallet CAMPAIGNS ARRAY:"+JSON.stringify(CAMPAIGNS));
                // Registering the script to the node after inserting the camapign register to the database
                // register_token_campaign_script(tokenid, campaign_name, amount);
                //GetTokens();
            } else {
              MDS.log("The Campaign HAS NOT BEEN Inserted in the DB");
              alert("The Campaign HAS NOT BEEN Inserted in the DB");
            }
          });
      }
      else{
        /*
        //Takes  recorded ammount of the campign
        // update the amount subtracting the amount of the databse with the amount of the actuall camppaing(already)
        var sqlrows = sqlmsg.rows;
        //Takes the last amount recorded
        var sqlrow = sqlrows[];
        var nodeStatus = JSON.stringify(sqlrow, undefined, 2);
        var amountDB = sqlrow.AMOUNT;
        var update_amountDB = amountDB - amount;
        update_campaign_amount(update_amountDB);
        */
        MDS.log("The Campaign name is already in use, choose another one");
        alert("The Campaign name is already in use, choose another one");
      }
    }
  });
}

//Update the amount of tokens of the campaign on the DB and also on the interface
function update_campaign_amount(campaign_name, update_amountDB) {
  MDS.sql("UPDATE configured_campaign SET amount="+update_amountDB+" WHERE campaign_name='"+campaign_name+"'", function(resp){
    if (resp.status) {
      CAMPAIGNS [campaign_name].amount = update_amountDB;  //GLOBAL variable updated
      onupdateSelectCapaignInfo();
      MDS.log("Transaction update_campaign_amount in the Data Base amount: "+update_amountDB);
      MDS.log("update_campaign_amount TRANSACTION PROCESS ENDED CORRECTLY");
    }
  });
}


// Register on the node the script with tokenid and campaign_name that will be part of it
// and the address generated acts a container for the configured tokens for a concrete campaing
// before lauching this campaign with all the tokens or only a part of it.
// and also registers on the database (tokenid, campaign_name, campaign_address*,amount_tokens) *=script addres generated
function register_token_campaign_script(tokenid, campaign_name, callback){
  var script = get_campaign_script_string(campaign_name, tokenid);
  var command = 'newscript trackall:true script:"'+script+'"'

  MDS.log("register_token_campaign_script: "+command);
  //alert("command script: "+command);0x7518EC03A64B1AC4BFCFC771437315FC71FEAA30A0FF8C821CE154C066A0EB34
  MDS.cmd(command, function(res) {
  //if the response status is true
    if (res.status) {
      //MDS.log(JSON.stringify(resp));
      MDS.log("Registered register_token_campaign_script SCRIPT Correctly in the minima node with the Following campaign_address: "+res.response.address);
      callback(res);
    }
      else{
          MDS.log("ERROR: Could not register the script, register_token_campaign_script: "+JSON.stringify(res));
      }
  });
}


//This function set the DAO wallet address
function setDAOWalletAddress() {
  let address = prompt("Please paste here the MAIN DAO Wallet Address:", "");
  if (address == null || address == "") {
    alert("Could not set the Address!");
  }else{
    var fullsql = "INSERT INTO daowalletaddress (walletaddress,date) VALUES "
  			+"('"+address+"',"+Date.now()+")";

  	MDS.sql(fullsql, function(resp){
      MDS.log(JSON.stringify(resp));
  		if (resp.status) {
        MDS.log("DAO Wallet Address has Changed Correctly in the DB with the Following address: "+address);
        alert("DAO Wallet Address has Changed Correctly");
        DAO_WALLET_ADDRESS = address;
        mainWalletAddress();
      }
      else {
        MDS.log("The Address Change HAS NOT BEEN Inserted in the DB");
        alert("Could not set the DAO Wallet Address on the DB!");
      }
  	});
  }
}

//This function set the Advertiser wallet address from the command getaddress
function setAdvertiserWalletAddress() {
  var command = 'getaddress';
  MDS.cmd(command, function(res) {
  //if the response status is true
    if (res.status) {
      var address = res.response.address;
      var publickey = res.response.publickey;
      var fullsql = "INSERT INTO advertiserwalletaddress (walletaddress,publickey,date) VALUES "
          +"('"+address+"','"+publickey+"',"+Date.now()+")";

      MDS.sql(fullsql, function(resp){
        MDS.log(JSON.stringify(resp));
        if (resp.status) {
          MDS.log("ADVERTISER Wallet Address has Changed Correctly in the DB with the Following address: "+address);
          alert("ADVERTISER Wallet Address has Changed Correctly");
          ADVERTISER_WALLET_ADDRESS = address;
          ADVERTISER_PUBLICKEY = publickey;
          BUYER_ADDRESS = address;
          BUYER_PUBLICKEY = publickey;
          advertiserWalletAddress();
        }
        else {
          MDS.log("The Address Change HAS NOT BEEN Inserted in the DB");
          alert("Could not set the DAO Wallet Address on the DB!");
        }
      });
    }
    else {
      MDS.log("The setAdvertiserWalletAddress: command getaddres has failed");
    }
  });
}


//This function lists ALL the campaign_name of the  Data Base and also sets
// them as a memory object CAMPAIGNS if start variable is set to true (at startup application)
function listcampaignsDB(start){
  MDS.sql("SELECT * FROM configured_campaign",function(sqlmsg){
    if (sqlmsg.status) {
      // the app starts ups and sets the database of campaings as a javascript object on memory
      if (start) {
        var sqlrows = sqlmsg.rows;
        for(var i = 0; i < sqlrows.length ; i++) {
          var sqlrow = sqlrows[i];
          var campaign = new Object();
            campaign.campaign_name = sqlrow.CAMPAIGN_NAME;
            campaign.tokenid = sqlrow.TOKENID;
            campaign.campaign_address = sqlrow.CAMPAING_ADDRESS;
            campaign.amount = sqlrow.AMOUNT;
            CAMPAIGNS [sqlrow.CAMPAIGN_NAME] = campaign;    //Replicate the insert to the Global memory objec CAMPAIGNS
        }
        //alert("Wallet CAMPAIGNS ARRAY:"+JSON.stringify(CAMPAIGNS));
      }else {
        var nodeStatus = JSON.stringify(sqlmsg, undefined, 2);
        document.getElementById("status-object").innerText = nodeStatus;
        MDS.log(JSON.stringify(sqlmsg));
      }
    }else{
      var nodeStatus = JSON.stringify(sqlmsg, undefined, 2);
      document.getElementById("status-object").innerText = nodeStatus;
      MDS.log(JSON.stringify(sqlmsg));
    }
  });
}
