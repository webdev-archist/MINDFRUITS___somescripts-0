var shBdd = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1BXXPAHb6qlyKj_zUyhtZAaVuUppI8nffxB9E5OW0Iss/")
var shBddGAds = shBdd.getSheetByName("global")

// Fonction qui explore la BDD Global pour récupérer les comptes Google Ads pour lesquels un budget fixe est précisé
function queryGoogleAdsDatabase(headerName,IDName) {

 /* START | Variables to remove */
 var headerName = "Budget Fixe"; //
 var IDName = "GAdsID";
 /* STOP | Variables to remove */

 var lastRow = shBddGAds.getLastRow()-1;
 var lastCol = shBddGAds.getLastColumn();
 var googleAdsData = shBddGAds.getRange(2,1,lastRow,lastCol).getValues();

 var headerPosition = googleAdsData[0].indexOf(headerName);
 var idPosition = googleAdsData[0].indexOf(IDName);


 var googleAdsDataToReturn = [];

 for(var i  in googleAdsData) {
   if(googleAdsData[i][headerPosition] == "Oui") {
     googleAdsDataToReturn.push(googleAdsData[i][idPosition])
   }
 }

 return googleAdsDataToReturn;
}


function callEmailElements() {
 var emailTemplateElements = getEmailTemplate();
 Logger.log(emailTemplateElements[0]);
 Logger.log(emailTemplateElements[1]);
}


function getEmailTemplate() {
 var allElements = shBdd.getSheetByName("Email").getRange("C4:C7").getValues();
 return [allElements[0][0],allElements[2][0]];
}


function testFilterFunction() {
 var spreadsheetBdd = SpreadsheetApp.openById('1BXXPAHb6qlyKj_zUyhtZAaVuUppI8nffxB9E5OW0Iss');
 var accountsManagers = ["Arnaud","Kévin"];

 // Récupération des e-mails des managers
 var uniqueAccountManagers = accountsManagers.filter(function(item,pos,self) {
   return self.indexOf(item)===pos;
 });

 var accountsManagersEmail = {}

 var contactSheetBdd = spreadsheetBdd.getSheetByName("people");

 var allMailManagerCouple = contactSheetBdd.getRange(2,2, contactSheetBdd.getLastRow(),3).getValues();

 var mailManagerCouple = allMailManagerCouple.filter(function(item) {
   for (var manager in uniqueAccountManagers) {
     if ( item[0]==uniqueAccountManagers[manager] ) {
       return true
     };
   };
 });


 for(var couple in mailManagerCouple) {
   accountsManagersEmail[mailManagerCouple[couple][0]] = mailManagerCouple[couple][2];
 };

 Logger.log(mailManagerCouple);
}

function whentorun() {
 var date = new Date();
 var dayOfWeek = date.getDay();
 var jourSem = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"]
 var JourSemaine = jourSem[dayOfWeek-1]

 if(dayOfWeek<6 && isOdd(dayOfWeek)==1 && dayOfWeek!=3) {
   Logger.log("RUN car " + JourSemaine)
 } else {
   if(dayOfWeek<6) {
     Logger.log("Pas d'exécution car nous sommes le " + JourSemaine)
   } else {
     Logger.log("Pas d'exécution car c'est le week-end")
   }
 }

}

function testjourSem() {
 var jourSem = ["Lundi",	"Mardi",	"Mercredi",	"Jeudi",	"Vendredi",	"Samedi",	"Dimanche"]
 var date = new Date();
 var dayOfWeek = date.getDay()+1;
 Logger.log("Pas d'exécution car " + jourSem[dayOfWeek-2])

}

function isOdd(num) {
 return num % 2;
}


// Fonction qui explore la BDD AdWords pour récupérer les comptes AdWords pour lesquels un budget fixe est précisé
function getAdWordsBudgets() {
 var shbdd = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1BXXPAHb6qlyKj_zUyhtZAaVuUppI8nffxB9E5OW0Iss/")
 var shbddadwords = shbdd.getSheetByName("adwords")
 var lr = shbddadwords.getLastRow();
 var lc = shbddadwords.getLastColumn()-1;
 var adwordsdata = shbddadwords.getRange("A1:" + getcolumn(lc) + lr).getValues();
 var adwordsBudgets = []
 var j = Number(0)

 for(var i in adwordsdata) {
   if(adwordsdata[i][5] == "Oui") {
     adwordsBudgets.push([])

     if(adwordsdata[i][4]>0) {
       adwordsBudgets[j].push(adwordsdata[i][1])
       adwordsBudgets[j].push(adwordsdata[i][4])
       j++
     }
   }
 }

 Logger.log(adwordsBudgets)
}



// Fonction qui trouve le nom de la colonne en fonction du chiffre.
function getcolumn(a) {
var b = 26
var alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]

var column = String();

if (a<26) {
  column = alphabet[a]
} else {
  column = alphabet[((a-(a%b))/b)-1]
  column = column + alphabet[(a%b)]
}

return column
}

var shbdd = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1BXXPAHb6qlyKj_zUyhtZAaVuUppI8nffxB9E5OW0Iss/")
var shbddadwords = shbdd.getSheetByName("adwords")

// Fonction qui explore la BDD AdWords pour récupérer les comptes AdWords pour lesquels un budget fixe est précisé
function getAdWordsBudgets() {
 var lr = shbddadwords.getLastRow();
 var lc = shbddadwords.getLastColumn()-1;
 var adwordsdata = shbddadwords.getRange("A1:" + getcolumn(lc) + lr).getValues();
 var adwordsbudgets = []

 for(var i  in adwordsdata) {
   if(adwordsdata[i][5] == "Oui") {
     adwordsbudgets.push(adwordsdata[i][4])
   }
 }

 return adwordsbudgets

}


// Fonction qui explore la BDD AdWords pour récupérer les comptes AdWords pour lesquels il faut faire un reporting.
function getAdWordsIds() {

 var lr = shbddadwords.getLastRow();
 var lc = shbddadwords.getLastColumn()-1;
 var adwordsdata = shbddadwords.getRange("A1:" + getcolumn(lc) + lr).getValues();
 var adwordsids = []

 for(var i  in adwordsdata) {
   if(adwordsdata[i][5] == "Oui") {
     adwordsids.push(adwordsdata[i][1])
   }
 }

 return adwordsids

}

// Fonction qui trouve le nom de la colonne en fonction du chiffre.
function getcolumn(a) {
var b = 26
var alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]

var column = String();

if (a<26) {
  column = alphabet[a]
} else {
  column = alphabet[((a-(a%b))/b)-1]
  column = column + alphabet[(a%b)]
}

return column
}
