/*-------------------------------------------------------------------------------------------------------------------
-------------------------SCRIPT D'ARNAUD(pour récupérer tous les comptes avec le Management API)-------------------------------------
-------------------------------------------------------------------------------------------------------------------
*/
var profilesArray = [];
var ite = 0;
var excludedAccounts = [["Admin"], ["ananke"], ["Bafimmo.com"], ["Buro parc"], ["Cartridge World Marseille ( Julien)"], ["Cleanair"], ["CRC Lombardo"], ["crea-land"], ["CYMA"], ["dating-libertins.com"], ["Decoration-On-Line"], ["Distri Club Medical 2"], ["Docks de la Literie"], ["docteur-benhamou.com"], ["EFFIA"], ["espace croix d'or"], ["HOTEL LE MARCEL"], ["Ipone.fr"], ["Kerstee"], ["LaCompagnieDesForestiers"], ["leadbox.fr"], ["Libre Assurances"], ["Light My Boutique"], ["M64"], ["monbonmaster"], ["Net Invaders"], ["PCW.fr (Clevo.Fr)"], ["Provence Services"], ["RDrone Shop"], ["Saoya"], ["Site MDS"], ["SMS CONSEIL"], ["Sneackers-Feel"], ["statutentreprise.com"], ["walea-club.com SITE PRODUCTION"], ["wooxo"], ["www.admobili.fr"], ["www.decostock.fr"], ["www.diouda.fr"], ["www.empruntnet.com"], ["www.meuble-et-jardin.fr"], ["www.pomotherapie.net"], ["www.residence-mixte.com"], ["www.smsenvoi.com"], ["www.televitale.fr"], ["www.travelandchic.com"], ["www.troisfoisvin.com"], ["Quotatis FR"], ["www.bazile.fr"], ["www.cyclable.com"], ["Futur Telecom"], ["mercadier.fr"], ["Concessions Mondial Piscine"], ["Concessions Mondial Piscine - 1"]]

function listAccounts() {
  var shProfilesAnalytics = shBdd.getSheetByName("test");
  shProfilesAnalytics.getRange("A1:B" + shProfilesAnalytics.getLastRow()).setValue("");

  var accounts = Analytics.Management.Accounts.list();
  if (accounts.items && accounts.items.length) {
    for (var i = 0; i < accounts.items.length; i++) {
      var account = accounts.items[i];
//      Logger.log('Account: name "%s", id "%s".', account.name, account.id);

      // List web properties in the account.
      if(!isToExclude(account.name)) {
        listWebProperties(account.id,account.name);
      }
    }
  } else {
    Logger.log('No accounts found.');
  }

  Logger.log("===> ARRAY <===")
  Logger.log(profilesArray)

  shProfilesAnalytics.getRange("A1:B" + profilesArray.length ).setValues(profilesArray);

  // Classe les comptes par ordre alphabétique
  var arrrange = shProfilesAnalytics.getRange("A1:B" + shProfilesAnalytics.getLastRow());
  arrrange.sort({column: 1, ascending: true});

  //  Browser.msgBox("La liste des sites existants sur MyPoseo et les profiles de Google Analytics viennent d'être mis à jour.")
  Browser.msgBox("La liste des profiles de Google Analytics vient d'être mis à jour.")
}

function listWebProperties(accountId,accountName) {
  var webProperties = Analytics.Management.Webproperties.list(accountId);
  if (webProperties.items && webProperties.items.length) {
    for (var i = 0; i < webProperties.items.length; i++) {
      var webProperty = webProperties.items[i];
      Logger.log('\tWeb Property: name "%s", id "%s".', webProperty.name,
          webProperty.id);

      // List profiles in the web property.
      if(!isBot(webProperty.name)) {
        listProfiles(accountId, webProperty.id,webProperty.name,accountName);
      }
    }
  } else {
    Logger.log('\tNo web properties found.');
  }
}

function listProfiles(accountId, webPropertyId,webPropertyName,accountName) {
  // Note: If you experience "Quota Error: User Rate Limit Exceeded" errors
  // due to the number of accounts or profiles you have, you may be able to
  // avoid it by adding a Utilities.sleep(1000) statement here.
  Utilities.sleep(50)

  var profiles = Analytics.Management.Profiles.list(accountId,
      webPropertyId);
  if (profiles.items && profiles.items.length) {
    for (var i = 0; i < profiles.items.length; i++) {
      var profile = profiles.items[i];
      profilesArray.push([]);
      // Compte : | Propriété : | Vue:
      profilesArray[ite].push("Compte : " +accountName + " | Propriété : " + webPropertyName + " | Vue : " + profile.name,profile.id);
      ite++;
    }
  } else {
    Logger.log('\t\tNo web properties found.');
  }
}

function isToExclude(accountName) {
  for(var i in excludedAccounts) {
    if(excludedAccounts[i][0]===accountName) {
        return true
    }
  }
  return false
}


function isBot(propertyName) {
  var excludedTerms = [['Bot'],['bot']]
  for(var i in excludedTerms) {
    if(propertyName.indexOf(excludedTerms[i][0])>(-1)) {
        return true
    }
  }
  return false
}

function testIsBot() {
 Logger.log(isBot("Bots vue connard"));
}
