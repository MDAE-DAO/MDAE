
var DAPP_WALLET = "0xF9B9AE1B70572D553A1CBB6FA21AADF48936F8FE298141C6C008F4D611879772";
var USER_WALLET = "";
var DAO_WALLET_ADDRESS = "0x54C12B5978FDA46D648FEB54127CC6124A14711AEBEA0A7DCB03BF43ED9EA929";
var SCRIPT_ADDRESS = "";
var SCRIPT = "";
var ADVERTISING_TOKENS = [];
//const ADVERTISING_TOKENS = ["0x6F3D1B097DD5B73FF6D9CC018ADB2524BF1F854B32820DC695ECD58E199363B6", "0x835F54EF6FBD7E3B599AA3C963E6BCE02680729AD8AE2B95882BE810A0074587"];

// it is a javascript object with two arrays where the positions betwen them are syncronized, every token
// into the array of tokens is related on the same position to the minimas array with a coinid of minimas that contain the exact amouunt
// of rewards that the token needs to pay back when the publicity will be watched.
// The object is build that way when the info of publicity is exctracted from the user's publicity script address.
var USER_PUBLICITY_TOKENS ={
  tokens:[],
  minimas:[]
};

var MAXIMA = new Object();

//Main message handler..
//set_dapp_wallet(0xE52DB05CF2E2C91290168D15CAB7BCD3DB64518AF1CDB2936615D838A1010842);
//check if there is a user wallet on the database otherwise ask for it
//And set global variables user wallet
//isthereaWallet("user");
//And triggers all steps to register the script, and
//get all publicity tokens on the script and set them on USER_PUBLICITY_TOKENS
//register_user_script(get_user_script());

MDS.init(function(msg){
  //Do initialitzation
  if(msg.event == "inited"){
    MDS.log("The service.js is initialising MDS also in the background...");
    createTheDBUserWalletAddress();
    if (SCRIPT_ADDRESS.length != 0) get_publicity_tokens(SCRIPT_ADDRESS);
    isthereaWallet("user");
  }
  else if(msg.event == "NEWBLOCK"){
  // the chain tip has changed
  }
  else if(msg.event == "NEWBALANCE"){
    // user's balance has changed
    MDS.log("New Balance Detected");
		//Process the new event detected
    if (SCRIPT_ADDRESS.length > 0) get_publicity_tokens(SCRIPT_ADDRESS);
  }
  else if(msg.event == "MAXIMA"){
    // CONFIGURE data: Advertiser-Dapp-data-configure"  :Receives the pubicity tokens avaiable from DAO
    if(msg.data.application == "Advertiser-Dapp-data-configure"){

      //Relevant data
      //Object to receive over MAXIMA
      /*
      var data = {};
      data.id_maxima = "";
      data.users 	= [];
      data.developers	= [];
      data.tokens_publicity = [];
      */

      //remove the leading 0x
      var datastr	= msg.data.data.substring(2);

      //Convert the data..
      var jsonstr = hexToUtf8(datastr);

      //And create the actua object data received
      var maxjson = JSON.parse(jsonstr);
      ADVERTISING_TOKENS = maxjson.tokens_publicity;
      alert(JSON.stringify(maxjson, undefined, 2));
      if (SCRIPT_ADDRESS.length != 0) get_publicity_tokens(SCRIPT_ADDRESS);
      MDS.log("Received Maxima data: "+ JSON.stringify(maxjson, undefined, 2));
    }
  }
  else if(msg.event == "MINIMALOG"){
  // new Minima log message
  }
  else{
  }
});

function hexToUtf8(s){
  return decodeURIComponent(
     s.replace(/\s+/g, '') // remove spaces
      .replace(/[0-9A-F]{2}/g, '%$&') // add '%' before each 2 characters
  );
}

// Get the maxima info most recent of the miima node and set it on memory
function getMaximaInfo(callback) {
  MDS.cmd("maxima action:info", function(resp) {
    if (resp.status) {
      //alert("Contact maxima action info!");
      MDS.log("getting MAXIMA info....");
      MDS.log("Maxima info:"+JSON.stringify(resp.response, undefined, 2));
      MAXIMA.contact = resp.response.contact;
      MAXIMA.publickey = resp.response.publickey;
      MAXIMA.name = resp.response.name;
      MAXIMA.info = [];
      callback(resp);
    }else{
      var nodeStatus = JSON.stringify(resp, undefined, 2);
      MDS.log("ERROR getmaxsoloting MAXIMA info...."+nodeStatus);
    }
  });
}

/*CONFIGURE_TOKENS
port == 0 operation
port == 1 Maxima Contact
port == 2 Publickey
*/
function getPublicityTokensFromDAO(){
  //Get the information
  MDS.log("getPublicityTokensFromDAO ");
  getMaximaInfo(function(res){
    var state_vars = '{"0":"[CONFIGURE_TOKENS]","1":"['+MAXIMA.contact+']","2":"['+MAXIMA.publickey+']"}';
    //alert(state_vars);
    //alert(DAO_WALLET_ADDRESS);
    var CreateSend = "send address:"+DAO_WALLET_ADDRESS+" amount:1 tokenid:0x00" + " state:"+state_vars;
    alert("- Wallwet -> Maxima reesponse command:\n -:"+CreateSend);
    MDS.cmd(CreateSend, function(resp) {
      if (resp.status) {
        MDS.log("getPublicityTokensFromDAO command sent ");

        // The DAO will respond sending a message thru MAXIMA

        //var nodeStatus = JSON.stringify(resp.response, undefined, 2);
        //document.getElementById("status-object").innerText = nodeStatus;
      }
      else{
        //var nodeStatus = JSON.stringify(resp, undefined, 2);
        //document.getElementById("status-object").innerText = nodeStatus;
        MDS.log("ERROR: getPublicityTokensFromDAO ");
        MDS.log(JSON.stringify(resp, undefined, 2));
      }
    });
  });

}

function set_script_wallets(dapp_wallet, user_wallet){
  DAPP_WALLET = dapp_wallet;
  USER_WALLET = user_wallet;
}

function set_dapp_wallet(dapp_wallet){
  DAPP_WALLET = dapp_wallet;
}

function set_user_wallet(user_wallet){
  USER_WALLET = user_wallet;
}

function set_user_script(dapp_wallet, user_wallet){
  var script = "LET finaluserwallet=" + user_wallet +
  " LET dappdeveloperwallet="+dapp_wallet + " RETURN TRUE"
  SCRIPT = script;
  return script;
}

function get_user_script(){
  var script = "LET finaluserwallet=" + USER_WALLET +
  " LET dappdeveloperwallet="+DAPP_WALLET + " RETURN TRUE"
  return script;
}

function get_user_script_address(script){
  var command = 'runscript script:"'+script+'"'
  MDS.cmd(command, function(res) {
  //if the response status is true
    if (res.status) {
      SCRIPT_ADDRESS = res.response.script.address;
    }
    //if the response status is false
    else{
        MDS.log("ERROR: Could not retrieve SCRIPT address: "+JSON.stringify(res));
    }
  });
}

function get_user_script_address(){
  return SCRIPT_ADDRESS;
}

// Retunr addrress script on target html element
function get_user_script_variable_address() {
  register_user_script(get_user_script());
}

// Simulate newBalanceEvent to load new Developer Wallet and new Publicity Tokens to refresh screen
function update_publicity_tokens(){
  get_publicity_tokens(SCRIPT_ADDRESS);
}

// Register final user script before using trackerAPP for claiming to receive
// publicity, the user must set their wallet where rewards will be payed and
// the same wallet will be used to generate the script where to receive theSCRIPT_ADDRESS
// publicity tokens with the DAPP wallet that will set his wallet(developer) wallet
// on the API when the APP start up.
// Also get all publicity tokens of that script address and set them as global variables.
// get_publicity_tokens
function register_user_script(script){
  alert("REGSITERING SCRIPT: "+script);
  var command = 'newscript trackall:true script:"'+script+'"'
  MDS.log("register_user_script: "+command);
  //alert("command script: "+command);
  MDS.cmd(command, function(res) {
  //if the response status is true
    if (res.status) {
      //alert(res.response.address);
      SCRIPT_ADDRESS = res.response.address;
      //document.getElementById("scriptwalletaddress").innerHTML = SCRIPT_ADDRESS;
      MDS.log("OK: Final User SCRIPT registered: "+JSON.stringify(res.response));
      get_publicity_tokens(SCRIPT_ADDRESS);
    }
    //if the response status is false
    else{
        MDS.log("ERROR: Could not retrieve SCRIPT address: "+JSON.stringify(res));
    }
  });
}


// Add the publicity token manually introduced
function add_publicity_token(){
  var tokenid = prompt("Please enter the Advertising Token id:", "");
  ADVERTISING_TOKENS.push(tokenid);
}

// Add the developer wallet manually introduced And register the new script where the publicity tokens will arrive
// It let you simulate to have two different developers app installed
// Every new wallet added acts as a new App so a new script developer wallet plus user wallet has to be created
function add_wallet_developer(){
  var address = prompt("Please enter the Developer address:", "");
  DAPP_WALLET = address;
  //register_user_script(get_user_script());
}

// Add the user wallet manually introduced And register the new script where the publicity tokens will arrive
// It let you simulate to have two different users app installed
// Every new wallet added acts as a new App so a new script developer wallet plus user wallet has to be created
function add_wallet_user(){
  var address = prompt("Please enter the User address:", "");
  USER_WALLET = address;
  //register_user_script(get_user_script());
}

// Needed to comunitcate with the DAO to get the publicity tokens available, on a real case scenario This
// address will be hardcoded by the developer of the DAPP or a service will be called to get that address or Also
// it could not be necessary if the developer hardcode the tokenid of the publicity tokens to be received by his DAPP
function add_wallet_DAO(){
  var address = prompt("Please enter the DAO address:", "");
  DAO_WALLET_ADDRESS = address;
  getPublicityTokensFromDAO();
  //register_user_script(get_user_script());
}

function set_wallet_DAO(address){
  DAO_WALLET_ADDRESS = address;
  getPublicityTokensFromDAO();
}

// Needs to be called on a NEWBALANCE event if it is a publiciy token
// Returns an javascript array of publicity tokens as Javascript Objects of parsed JSON objects of
// publicity tokens sent to the final user script as a global variable USER_PUBLICITY_TOKENS
// As well as the minimas related to the token to payback the rewards are set on the same position on the
// array minimas of USER_PUBLICITY_TOKENS
function get_publicity_tokens(script_address){
  USER_PUBLICITY_TOKENS.tokens = [];
  USER_PUBLICITY_TOKENS.minimas = [];
  MDS.cmd("coins address:"+script_address, function(res){
    MDS.log("Getting publicity tokens from script address:"+script_address);
    if (res.status) {
      var numMinimaCoins = 0;
      var minimaCoins = [];   // Array of obj_minima
      for(var i = 0; i < res.response.length; i++) {
        var coin = res.response[i];
        if(coin.tokenid == "0x00"){
            MDS.log("->get_publicity_tokens: Found publicity minima coinid: "+coin.coinid +" amount: "+coin.amount );
            numMinimaCoins++;
            var obj_minima = JSON.parse(JSON.stringify(coin))
            minimaCoins.push(obj_minima);
        }
       }
      //USER_PUBLICITY_TOKENS.minimas = Array(numMinimaCoins);

      for(var i = 0; i < res.response.length; i++) {
        var coin = res.response[i];
        if(coin.tokenid != "0x00"){
          //if (isAdvertiserToken(coin.tokenid)) {
          if (isAdvertiserTokenCoin(coin)) {
            MDS.log("->get_publicity_tokens: Found publicity tokenName: "+coin.token.name.name +" tokenid: "+coin.tokenid );
            var obj_token = JSON.parse(JSON.stringify(coin))
            USER_PUBLICITY_TOKENS.tokens.push(obj_token);

            // look for the minima coinid that holds the rewards to pay for that token and push INTO
            // USER_PUBLICITY_TOKENS.minimas so the token and minima keeps syncronized positions on both arrays
            var totalRewards = parseFloat(obj_token.state[15].data) + parseFloat(obj_token.state[17].data);
            alert("Total Rewards received: "+totalRewards);
            for (j=0; j < minimaCoins.length; j++){
              var obj_minima = minimaCoins[j];
              if (obj_minima != null) {
                if (obj_minima.amount == totalRewards) {
                  USER_PUBLICITY_TOKENS.minimas.push(obj_minima);
                  minimaCoins[j] = null; // delete de minima coin matches the rewards amount of the array
                  break;
                }
              }
            }
          }
        }
       }
       displayPublicity(null);
      } else{
        //alert("ERROR");
          //var nodeStatus = JSON.stringify(res, undefined, 2);
          //document.getElementById("status-coin").innerText = nodeStatus;
          MDS.log(JSON.stringify(res));
        }
    });
}

function roundUsing(func, number, prec) {
    var tempnumber = number * Math.pow(10, prec);
    tempnumber = func(tempnumber);
    return tempnumber / Math.pow(10, prec);
}

//Excute a transaction on the clicked publicity Token (a coinid is the token)
//And that transaction pays to all parties all rewaards and returns the publicity Token to the DAO
function get_publiciy_token_rewards(token_coinid){
  if (token_coinid == null) {
    alert("This is a sample image, still no publicity tokens received on your script user");
    return;
  }
  var tokens = USER_PUBLICITY_TOKENS.tokens;
  var minimas = USER_PUBLICITY_TOKENS.minimas;

  //alert(JSON.stringify(tokens));
  //alert(JSON.stringify(minimas));
  for (i=0; i < tokens.length; i++){
    if (tokens[i] == null) continue;
    var token = tokens[i];
    if (token == null) continue; //skip this step loop
    if (token.coinid == token_coinid) {
      var minima = minimas[i];
      var minima_coinid = minima.coinid;

      var vault = token.state[0].data;
      var dao = token.state[4].data;
      var avertiser_buyer = token.state[10].data;
      var commissionDappDao = (token.state[6].data/100) * token.state[15].data;
      alert(commissionDappDao);
      commissionDappDao = roundUsing(Math.floor, commissionDappDao, 4);
      alert(commissionDappDao);
      var commissionDapp = token.state[15].data - commissionDappDao;
      var commissionUserDao = (token.state[7].data/100) * token.state[17].data;
      commissionUserDao = roundUsing(Math.floor, commissionUserDao, 4);
      var commissionUser = token.state[17].data - commissionUserDao;


      // Show on the html page all the payouts
      //document.getElementById("rew_vault_dev").innerHTML = commissionDappDao;
      //document.getElementById("rew_vault_user").innerHTML = commissionUserDao;
      //document.getElementById("rew_dao_token").innerHTML = token.tokenid;
      //document.getElementById("rew_dev").innerHTML = commissionDapp;
      //document.getElementById("rew_user").innerHTML = commissionUser;


      // do the transaction and pay all parts according to state vairables of the token

			//Create a random txn id..
			var txnid = Math.floor(Math.random()*1000000000);


//Construct Transaction..
			var txncreator = "txncreate id:"+txnid+";";

//StateVars
      // Constructs state variables, getting the tokens statevars,
      for (var i=0; i<token.state.length; i++){
        txncreator += "txnstate id:"+txnid+" port:"+token.state[i].port+" value:"+token.state[i].data+";";
      }
      txncreator += "txnstate id:"+txnid+" port:14 value:3;" ;   // 3:used  -> set state to Token used
//inputs
			txncreator += "txninput id:"+txnid+" coinid:"+token_coinid+";"+
      "txninput id:"+txnid+" coinid:"+minima_coinid+";";
//outputs
      txncreator += "txnoutput id:"+txnid+" amount:1 address:"+avertiser_buyer+" tokenid:"+token.tokenid+" storestate:true;";
      if (commissionDapp>0) txncreator += "txnoutput id:"+txnid+" amount:"+commissionDapp+" address:"+DAPP_WALLET+" tokenid:0x00 storestate:false;";
      if (commissionUser>0) txncreator += "txnoutput id:"+txnid+" amount:"+commissionUser+" address:"+USER_WALLET+" tokenid:0x00 storestate:false;"
      if (commissionDappDao>0) txncreator += "txnoutput id:"+txnid+" amount:"+commissionDappDao+" address:"+vault+" tokenid:0x00 storestate:false;";
      if (commissionUserDao>0) txncreator += "txnoutput id:"+txnid+" amount:"+commissionUserDao+" address:"+vault+" tokenid:0x00 storestate:false;";
//endingTX
      txncreator +=
			"txnbasics id:"+txnid+";"+
    //  "txnsign id:"+txnid+" publickey:auto;"+
			"txnpost id:"+txnid+";"+
			"txndelete id:"+txnid+";";

//run transaction
        MDS.cmd(txncreator, function(res) {
          var status = true;
          for (var i=0; i<res.length; i++){ //CHECK  FOR ERRORS ON EVERY COMMAND OF TRANSACTION
              if (!res[i].status) { // if some comand fails
                alert("ERROR: Campaign tokens rewards have not been payout");
                MDS.log("---ERROR--- Getting Rewards Campaign "+campaign_name+" token : "+campaign_name+" command : "+res[i].command+" token : "+JSON.stringify(res[i].params)+" token : "+tokenid+" to address: "+campaign_address);
                var nodeStatus = JSON.stringify(res[i], undefined, 2);
                //document.getElementById("status-object").innerText = nodeStatus;
                status = false;
                MDS.log(JSON.stringify(res[i]));
                break;
              }
          }
          if (status) {
            alert("Campaign tokens rewards have been payout to the parties");
            MDS.log("PRINTING splitted command: ");
            var split_command = txncreator.split(';');
            split_command.forEach(function (value) {
              MDS.log(value);
            });
            MDS.log("get_publiciy_token_rewards: transaction commands: "+txncreator);
            MDS.log("get_publiciy_token_rewards: Execute all payouts of pulicity token: " +JSON.stringify(res.response));
            MDS.log("payout vault address:"+ vault);
            MDS.log("payout vault developer amount:"+ commissionDappDao);
            MDS.log("payout vault user amount:"+ commissionUserDao);
            MDS.log("payout developer address:"+ DAPP_WALLET);
            MDS.log("payout developer amount:"+ commissionDapp);
            MDS.log("payout user address:"+ USER_WALLET);
            MDS.log("payout user amount:"+ commissionUser);
            MDS.log("payout advertiser address:"+ avertiser_buyer);
            MDS.log("payout advertiser 1 token, tokenid:"+ token.tokenid);
            USER_PUBLICITY_TOKENS.tokens[i] = null;  //delete the spent token
            USER_PUBLICITY_TOKENS.minimas[i] = null; //delete the spent minimas
            //var nodeStatus = JSON.stringify(res, undefined, 2);
            //document.getElementById("status-object").innerText = nodeStatus;
            //  MDS.log(JSON.stringify(res));
          }
          //if the response status is false
          //else{
          //   MDS.log("ERROR: Could not execute get_publiciy_token_rewards: ");//+JSON.stringify(res));
          //}
        });


        break; // exits loop for
    }
  }
}


/*
//Excute a transaction on the clicked publicity Token (a coinid is the token)
//And that transaction pays to all parties all rewaards and returns the publicity Token to the DAO
function get_publiciy_token_rewards(token_coinid){
  if (token_coinid == null) {
    alert("This is a sample image, still no publicity tokens received on your script user");
    return;
  }
  var tokens = USER_PUBLICITY_TOKENS.tokens;
  var minimas = USER_PUBLICITY_TOKENS.minimas;

  //alert(JSON.stringify(tokens));
  //alert(JSON.stringify(minimas));
  for (i=0; i < tokens.length; i++){
    if (tokens[i] == null) continue;
    var token = tokens[i];
    if (token == null) continue; //skip this step loop
    if (token.coinid == token_coinid) {
      var minima = minimas[i];
      var minima_coinid = minima.coinid;

      var vault = token.state[0].data;
      var dao = token.state[4].data;
      var avertiser_buyer = token.state[10].data;
      var commissionDappDao = (token.state[6].data/100) * token.state[15].data;
      var commissionDapp = token.state[15].data - commissionDappDao;
      var commissionUserDao = (token.state[7].data/100) * token.state[17].data;
      var commissionUser = token.state[17].data - commissionUserDao;


      // Show on the html page all the payouts
      document.getElementById("rew_vault_dev").innerHTML = commissionDappDao;
      document.getElementById("rew_vault_user").innerHTML = commissionUserDao;
      document.getElementById("rew_dao_token").innerHTML = token.tokenid;
      document.getElementById("rew_dev").innerHTML = commissionDapp;
      document.getElementById("rew_user").innerHTML = commissionUser;


      // do the transaction and pay all parts according to state vairables of the token

			//Create a random txn id..
			var txnid = Math.floor(Math.random()*1000000000);

    //  alert("txnstate id:"+txnid+" port:20 value:"+token.state[20].data+";");
    //  alert("txnstate id:"+txnid+" port:21 value:"+token.state[21].data+";");
			//Construct Transaction..
			var txncreator = "txncreate id:"+txnid+";"+
				"txninput id:"+txnid+" coinid:"+token_coinid+";"+
        "txninput id:"+txnid+" coinid:"+minima_coinid+";"+
				"txnoutput id:"+txnid+" amount:1 address:"+avertiser_buyer+" tokenid:"+token.tokenid+" storestate:true;";
        if (commissionDapp>0) txncreator += "txnoutput id:"+txnid+" amount:"+commissionDapp+" address:"+DAPP_WALLET+" tokenid:0x00 storestate:false;";
        if (commissionUser>0) txncreator += "txnoutput id:"+txnid+" amount:"+commissionUser+" address:"+USER_WALLET+" tokenid:0x00 storestate:false;"
        if (commissionDappDao>0) txncreator += "txnoutput id:"+txnid+" amount:"+commissionDappDao+" address:"+vault+" tokenid:0x00 storestate:false;";
        if (commissionUserDao>0) txncreator += "txnoutput id:"+txnid+" amount:"+commissionUserDao+" address:"+vault+" tokenid:0x00 storestate:false;";
        txncreator +=
        "txnstate id:"+txnid+" port:0 value:"+vault+";"+
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
        "txnstate id:"+txnid+" port:14 value:3;"+     // 3:used  -> set state to Token used
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
        "txnstate id:"+txnid+" port:99 value:"+token.state[99].data+";"+
        "txnstate id:"+txnid+" port:100 value:"+token.state[100].data+";"+
				"txnbasics id:"+txnid+";"+
				"txnpost id:"+txnid+";"+
				"txndelete id:"+txnid+";";

        MDS.cmd(txncreator, function(res) {
          var status = true;
          for (var i=0; i<res.length; i++){ //CHECK  FOR ERRORS ON EVERY COMMAND OF TRANSACTION
              if (!res[i].status) { // if some comand fails
                alert("ERROR: Campaign tokens rewards have not been payout");
                MDS.log("---ERROR--- Getting Rewards Campaign "+campaign_name+" token : "+campaign_name+" command : "+res[i].command+" token : "+JSON.stringify(res[i].params)+" token : "+tokenid+" to address: "+campaign_address);
                var nodeStatus = JSON.stringify(res[i], undefined, 2);
                document.getElementById("status-object").innerText = nodeStatus;
                status = false;
                MDS.log(JSON.stringify(res[i]));
                break;
              }
          }
          if (status) {
            alert("Campaign tokens rewards have been payout to the parties");
            MDS.log("PRINTING splitted command: ");
            var split_command = txncreator.split(';');
            split_command.forEach(function (value) {
              MDS.log(value);
            });
            MDS.log("get_publiciy_token_rewards: transaction commands: "+txncreator);
            MDS.log("get_publiciy_token_rewards: Execute all payouts of pulicity token: " +JSON.stringify(res.response));
            MDS.log("payout vault address:"+ vault);
            MDS.log("payout vault developer amount:"+ commissionDappDao);
            MDS.log("payout vault user amount:"+ commissionUserDao);
            MDS.log("payout developer address:"+ DAPP_WALLET);
            MDS.log("payout developer amount:"+ commissionDapp);
            MDS.log("payout user address:"+ USER_WALLET);
            MDS.log("payout user amount:"+ commissionUser);
            MDS.log("payout advertiser address:"+ avertiser_buyer);
            MDS.log("payout advertiser 1 token, tokenid:"+ token.tokenid);
            USER_PUBLICITY_TOKENS.tokens[i] = null;  //delete the spent token
            USER_PUBLICITY_TOKENS.minimas[i] = null; //delete the spent minimas
            var nodeStatus = JSON.stringify(res, undefined, 2);
            document.getElementById("status-object").innerText = nodeStatus;
            //  MDS.log(JSON.stringify(res));
          }
          //if the response status is false
          //else{
          //   MDS.log("ERROR: Could not execute get_publiciy_token_rewards: ");//+JSON.stringify(res));
          //}
        });


        break; // exits loop for
    }
  }
}
*/

// Get the state vars specifc port data of a coin
function get_state_vars_port_data (coin, port){
  var data = null;
      for(var z = 0; z < coin.state.length; z++) {
        if (coin.state[z].port == port) {
          data = coin.state[z].data;
          break;
        }
      }

  //alert(state_vars);
  return data;
}

// Returns true is a given tokenid is an Advertiser TokenName
function isAdvertiserToken(tokenID){
  for (var i=0; i < ADVERTISING_TOKENS.length; i++) {
    if (ADVERTISING_TOKENS[i] === tokenID) return true;
  }
  return false;
}

// Returns true is a given coin is an Advertiser Token checking state var port 100
function isAdvertiserTokenCoin(coin){
  var found = false;
  if (coin.state.length != 0){
    var data = get_state_vars_port_data(coin, 100);
    //alert(data+", "+coin.token.name.name);
    if (data != null){
      if (data === "[MDAE]") {
        found = true;
        // if not repeated
        if (!isAdvertiserToken(coin.tokenid)){   // if true, means is already on memory,so skip it
          ADVERTISING_TOKENS.push(coin);
          //MDS.log(".....loaded token:"+" "+coin.token.name.name+" -> "+coin.tokenid);
        }
      }
    }
  }
  return found;
}

// Show publicity from the tokens deposited on script finall user to
// the html section specify on the Dapp
function displayPublicity(section){
  var targetPublicity = "advertiserbanner";
  if (section != null) targetPublicity = section;
  var url_image;
  var url_text;

  if (USER_PUBLICITY_TOKENS.tokens.length == 0) {
        MDS.log("Any Publicity token recibed yet");
        MDS.log("Displaying the default MDAE Publicity in the Dapp..");
        url_image = "images/banner.jpg";
        var msg = "This is a sample                                                                                                                       image, still no tokens of publicity received by any Advertiser";
        addsection = "<img src="+url_image+" class='advertiser' style='width: 35vw; height: auto;' onclick='get_publiciy_token_rewards(null)'>";
				document.getElementById(targetPublicity).innerHTML = addsection;
        // Reset on the html page all the payouts
        //document.getElementById("rew_vault_dev").innerHTML = "";
        //document.getElementById("rew_vault_user").innerHTML = "";
        //document.getElementById("rew_dao_token").innerHTML = "";
        //document.getElementById("rew_dev").innerHTML = "";
        //document.getElementById("rew_user").innerHTML = "";

	} else{
        var token = USER_PUBLICITY_TOKENS.tokens[0];
        MDS.log("Ready to display the Publicity in the Dapp..");
        if (token.state[19].data == 2) {  // image
          url_image = token.state[20].data;
          url_image = url_image.replace('[', '');
          url_image = url_image.replace(']', '');

          MDS.log("Showing the following advertiser image: "+url_image);
  				//Build the advertiser banner
  			//	addsection = "<img src='"+url_image+"' class='advertiser' onclick='get_publiciy_token_rewards('"+token.coinid+"')' >";
          addsection = "<img src='"+url_image+"' class='advertiser' onclick='data_value=\""+token.coinid+"\";get_publiciy_token_rewards(data_value);' >";
        //  faiqueuactionlinks + "<img title='Access Activity Log' class='modified20' src='/QMSWebApp/Images/info[1].jpg' onclick='genericActivityLog('miscdisplay2'," + firstArticleV8.getRecseq() + ",'drawmfaial','RECSEQ','L')' >";
  				document.getElementById(targetPublicity).innerHTML = addsection;
        }else if (token.state[19].data == 0) {  //TXT version , get rid of of first two characters (0x)
          addsection = "<div class='advertiser' style='border:2px solid red;' onclick='data_value=\""+token.coinid+"\";get_publiciy_token_rewards(data_value);'>"+
          "<p>"+ hexToUtf8(token.state[23].data).slice(2) +"</p>"+
          "<p>"+ hexToUtf8(token.state[24].data).slice(2) +"</p>"+
          "<p>"+ hexToUtf8(token.state[25].data).slice(2) +"</p>"+
          "<p>"+ hexToUtf8(token.state[26].data).slice(2) +"</p>"+
          "<p>"+ hexToUtf8(token.state[27].data).slice(2) +"</p>"+
          "<p>"+ hexToUtf8(token.state[28].data).slice(2) +"</p>"+
          "<p>"+ hexToUtf8(token.state[29].data).slice(2) +"</p>"+
          "<p>"+ hexToUtf8(token.state[30].data).slice(2) +"</p>"+
          "<p>"+ hexToUtf8(token.state[31].data).slice(2) +"</p>"+
          "</div>";
          MDS.log("maxima style:"+addsection);
/*
          "<p>"+ token.state[23].data.replace('[', '').replace(']', '') +"</p>"+
          "<p>"+ token.state[24].data.replace('[', '').replace(']', '') +"</p>"+
          "<p>"+ token.state[25].data.replace('[', '').replace(']', '') +"</p>"+
          "<p>"+ token.state[26].data.replace('[', '').replace(']', '') +"</p>"+
          "<p>"+ token.state[27].data.replace('[', '').replace(']', '') +"</p>"+
          "<p>"+ token.state[28].data.replace('[', '').replace(']', '') +"</p>"+
          "<p>"+ token.state[29].data.replace('[', '').replace(']', '') +"</p>"+
          "<p>"+ token.state[30].data.replace('[', '').replace(']', '') +"</p>"+
          "<p>"+ token.state[31].data.replace('[', '').replace(']', '') +"</p>"+
          "</div>";
*/
          document.getElementById(targetPublicity).innerHTML = addsection;
        }
	 }
}


//This function just shows the wallet address
function WalletAddress(datarole){
  if (datarole == "user"){
    getid = "userwalletaddress";
    selectdb = "userwalletaddress";
  }
  if (datarole == "developer"){
    getid = "developerwalletaddress";
    selectdb = DAPP_WALLET;
  }
  if (datarole == "developer") {
    document.getElementById(getid).innerText = selectdb;
  }else {
    MDS.sql("SELECT * from "+selectdb+"", function(sqlmsg){
      if (sqlmsg.status) {
        if (sqlmsg.count == 0){
          MDS.log("Any address registered yet for the role: "+datarole);
        }
        else{
          var sqlrows = sqlmsg.rows;
          //Takes the last address recorded
          let i = (sqlrows.length -1);
          var sqlrow = sqlrows[i];
          var nodeStatus = JSON.stringify(sqlrow, undefined, 2);
          getwalletaddress = sqlrow.WALLETADDRESS;
          document.getElementById(getid).innerText = getwalletaddress;
          var nodeStatus = JSON.stringify(sqlrow, undefined, 2);
          document.getElementById("status-object").innerText = nodeStatus;
        }
      }
    });
  }
}


// Check if there is user wallet registered , and if not, it register it.
// Also it triggers the script creation and set the global variables to keep it
// all synchronized when the app starts
function isthereaWallet(section){
  var selectdb = "userwalletaddress";
  MDS.log("Checking if there is a user wallet saved");

  MDS.sql("SELECT * from "+selectdb+"", function(sqlmsg){
    if (sqlmsg.status) {
      if (sqlmsg.count == 0){
        MDS.log("Inserting the user address for the first time..");
        var address = prompt("Please enter the address where you want to receive the rewards: ", "");
        if (address == null || address == "") {
          alert("Could not set the address!, if you don't restart the Dapp, you wont be able to receive publicity");
        } else {
          var fullsql = "INSERT INTO userwalletaddress (walletaddress,date) VALUES "
              +"('"+address+"',"+Date.now()+")";

          MDS.sql(fullsql, function(resp){
            MDS.log(JSON.stringify(resp));
            if (resp.status) {
              MDS.log("Address HAS BEEN Inserted Correctly in the DB");
              alert("Wallet Address has Changed Correctly");
              //WalletAddress("user", address);
              USER_WALLET = address;
              register_user_script(get_user_script());
            }
            else {
              MDS.log("The Address HAS NOT BEEN Inserted in the DB");
            }
          });
        }
        if (sqlmsg.status) {
        }else{
          MDS.log(JSON.stringify(sqlmsg));
        }
      }
      else{
        var sqlrows = sqlmsg.rows;
        //Takes the last address recorded
        let i = (sqlrows.length -1);
        var sqlrow = sqlrows[i];
        var nodeStatus = JSON.stringify(sqlrow, undefined, 2);
        getwalletaddress = sqlrow.WALLETADDRESS;
        USER_WALLET = getwalletaddress;
        get_user_script_address(get_user_script());
        //WalletAddress("user", USER_WALLET);
//        register_user_script(get_user_script());
      }
    }
  });
}

function deleteUserWallet(){
  var fullsql = "DELETE from userwalletaddress";

  MDS.sql(fullsql, function(resp){
    MDS.log(JSON.stringify(resp));
    if (resp.status) {
      MDS.log("Address from userwalletaddress HAS BEEN deleted Correctly in the DB");
      alert("Wallet Address has Deleted Correctly");
      //WalletAddress("user", "");
      USER_WALLET = "";
      SCRIPT_ADDRESS = ""
    //  document.getElementById("scriptwalletaddress").innerText = "";
    //  document.getElementById("userwalletaddress").innerText = "";
    }
    else {
      MDS.log("The Address HAS NOT BEEN deleted in the DB");
    }
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

//This function just update the Blockchain time
function updateTime(){
  MDS.cmd("status", function(res) {
    if (res.status) {
      const blockchaintime = res.response.chain.time;
      document.getElementById("blockchaintime").innerText = blockchaintime;
    }
  });
}
