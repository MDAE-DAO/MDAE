var DAO_WALLET_ADDRESS = "0x4712CD047BDC4233788709BF5258F5F88495B986CE1F0AFAEA9A89E8EEAFB441";
var DAPP_WALLET = "0x4FF41440C0195EBDF0C6B3FF8A9C3E0AFA2707847F7C3171F3151DC09B8CC228";
var USER_WALLET ="";
var SCRIPT_ADDRESS = "";
var SCRIPT = "";
const ADVERTISING_TOKENS = ["0x6F3D1B097DD5B73FF6D9CC018ADB2524BF1F854B32820DC695ECD58E199363B6", "0x835F54EF6FBD7E3B599AA3C963E6BCE02680729AD8AE2B95882BE810A0074587"];
//const ADVERTISING_TOKENS = ["0x6F3D1B097DD5B73FF6D9CC018ADB2524BF1F854B32820DC695ECD58E199363B6", "0x835F54EF6FBD7E3B599AA3C963E6BCE02680729AD8AE2B95882BE810A0074587"];

// it is a javascript object with two arrays where the positions betwen them are syncronized, every token
// into the array of tokens is related on the same position to the minimas array with a coinid of minimas that contain the exact amouunt
// of rewards that the token needs to pay back when the publicity will be watched.
// The object is build that way when the info of publicity is exctracted from the user's publicity script address.
var USER_PUBLICITY_TOKENS ={
  tokens:[],
  minimas:[]
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
  var script = "LET finalUserWallet=" + user_wallet +
  " LET dappDeveloperWallet="+dapp_wallet + " RETURN TRUE"
  SCRIPT = script;
  return script;
}

function get_user_script(){
  var script = "LET finalUserWallet=" + USER_WALLET +
  " LET dappDeveloperWallet="+DAPP_WALLET + " RETURN TRUE"
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
function get_user_script_variable_address(target_html) {
  	document.getElementById(target_html).innerHTML = SCRIPT_ADDRESS;
}

// Register final user script before using trackerAPP for claiming to receive
// publicity, the user must set their wallet where rewards will be payed and
// the same wallet will be used to generate the script where to receive the
// publicity tokens with the DAPP wallet that will set his wallet(developer) wallet
// on the API when the APP start up.
// Also get all publicity tokens of that script address and set them as global variables.
// get_publicity_tokens
function register_user_script(script){
  var command = 'newscript trackall:true script:"'+script+'"'
  MDS.log("register_user_script: "+command);
  //alert("command script: "+command);
  MDS.cmd(command, function(res) {
  //if the response status is true
    if (res.status) {
      //alert(res.response.address);
      SCRIPT_ADDRESS = res.response.address;
      MDS.log("OK: Final User SCRIPT registered: "+JSON.stringify(res.response));
      get_publicity_tokens(SCRIPT_ADDRESS);
    }
    //if the response status is false
    else{
        MDS.log("ERROR: Could not retrieve SCRIPT address: "+JSON.stringify(res));
    }
  });
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
          if (isAdvertiserToken(coin.tokenid)) {
            MDS.log("->get_publicity_tokens: Found publicity tokenName: "+coin.token.name.name +" tokenid: "+coin.tokenid );
            var obj_token = JSON.parse(JSON.stringify(coin))
            USER_PUBLICITY_TOKENS.tokens.push(obj_token);

            // look for the minima coinid that holds the rewards to pay for that token and push INTO
            // USER_PUBLICITY_TOKENS.minimas so the token and minima keeps syncronized positions on both arrays
            var totalRewards = parseFloat(obj_token.state[15].data) + parseFloat(obj_token.state[17].data);
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
      var commissionDappDao = token.state[6].data * token.state[15].data;
      var commissionDapp = token.state[15].data - commissionDappDao
      var commissionUserDao = token.state[7].data * token.state[17].data;
      var commissionUser = token.state[17].data - commissionUserDao


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
				"txnoutput id:"+txnid+" amount:1 address:"+dao+" tokenid:"+token.tokenid+" storestate:true;"+
        "txnoutput id:"+txnid+" amount:"+commissionDapp+" address:"+DAPP_WALLET+" tokenid:0x00 storestate:false;"+
        "txnoutput id:"+txnid+" amount:"+commissionUser+" address:"+USER_WALLET+" tokenid:0x00 storestate:false;"+
        "txnoutput id:"+txnid+" amount:"+commissionDappDao+" address:"+vault+" tokenid:0x00 storestate:false;"+
        "txnoutput id:"+txnid+" amount:"+commissionUserDao+" address:"+vault+" tokenid:0x00 storestate:false;"+
        "txnstate id:"+txnid+" port:0 value:"+vault+";"+
        "txnstate id:"+txnid+" port:1 value:"+token.state[1].data+";"+
        "txnstate id:"+txnid+" port:2 value:"+token.state[2].data+";"+
        "txnstate id:"+txnid+" port:3 value:"+token.state[3].data+";"+
        "txnstate id:"+txnid+" port:4 value:"+dao+";"+
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
				"txnbasics id:"+txnid+";"+
				"txnpost id:"+txnid+";"+
				"txndelete id:"+txnid+";";

        MDS.cmd(txncreator, function(res) {
        //if the response status is true
        MDS.log("status:------>"+ JSON.stringify(res));
        //  if (res.status) {  On Multi command we dont have a way to check if the transaction goes well or not
        // In case of fail it will lauch an exception on the console
            MDS.log("get_publiciy_token_rewards: transaction commands: "+txncreator);
            MDS.log("get_publiciy_token_rewards: Execute all payouts of pulicity token: " +JSON.stringify(res.response));
            USER_PUBLICITY_TOKENS.tokens[i] = null;  //delete the spent token
            USER_PUBLICITY_TOKENS.minimas[i] = null; //delete the spent minimas
          //}
          //if the response status is false
          //else{
          //   MDS.log("ERROR: Could not execute get_publiciy_token_rewards: ");//+JSON.stringify(res));
          //}
        });


        break; // exits loop for
    }
  }
}

// Returns true is a given tokenid is an Advertiser TokenName
function isAdvertiserToken(tokenID){
  for (var i=0; i < ADVERTISING_TOKENS.length; i++) {
    if (ADVERTISING_TOKENS[i] === tokenID) return true;
  }
  return false;
}

// Show publicity from the tokens deposited on script finall user to
// the html section specify on the Dapp
function displayPublicity(section){
  var targetPublicity = "advertiserbanner";
  if (section != null) targetPublicity = section;
  var url_image;
  var url_text = [];

  if (USER_PUBLICITY_TOKENS.tokens.length == 0) {
        MDS.log("Any Publicity token recibed yet");
        MDS.log("Displaying the default MDAE Publicity in the Dapp..");
        url_image = "images/banner.jpg";
        var msg = "This is a sample                                                                                                                       image, still no tokens of publicity received by any Advertiser";
        addsection = "<img src="+url_image+" class='advertiser' style='width: 35vw; height: auto;' onclick='get_publiciy_token_rewards(null)'>";
				document.getElementById(targetPublicity).innerHTML = addsection;
        // Reset on the html page all the payouts
        document.getElementById("rew_vault_dev").innerHTML = "";
        document.getElementById("rew_vault_user").innerHTML = "";
        document.getElementById("rew_dao_token").innerHTML = "";
        document.getElementById("rew_dev").innerHTML = "";
        document.getElementById("rew_user").innerHTML = "";

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
        }else if (token.state[19].data == 0) {
          addsection = "<DIV class='advertiser' onclick=\"get_publiciy_token_rewards(\"" +token.coinid+ "\")>"+
          "<span>"+ token.state[23].data +"</span>"+
          "<span>"+ token.state[24].data +"</span>"+
          "<span>"+ token.state[25].data +"</span>"+
          "<span>"+ token.state[26].data +"</span>"+
          "<span>"+ token.state[27].data +"</span>"+
          "<span>"+ token.state[28].data +"</span>"+
          "<span>"+ token.state[29].data +"</span>"+
          "<span>"+ token.state[30].data +"</span>"+
          "<span>"+ token.state[31].data +"</span>"+
          "</DIV>";
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
              WalletAddress("user", address);
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
        WalletAddress("user", USER_WALLET);
        register_user_script(get_user_script());
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
      WalletAddress("user", "");
      USER_WALLET = "";
      SCRIPT_ADDRESS = ""
      document.getElementById("scriptwalletaddress").innerText = "";
      document.getElementById("userwalletaddress").innerText = "";
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
    });
    isthereaWallet("user");
  }
  else if(msg.event == "NEWBLOCK"){
  // the chain tip has changed
  }
  else if(msg.event == "NEWBALANCE"){
    // user's balance has changed
    MDS.log("New Balance Detected");
		//Process the new event detected
    if (SCRIPT_ADDRESS.length != 0) get_publicity_tokens(SCRIPT_ADDRESS);
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
