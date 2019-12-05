//============================================================================================================================================================//
//============================================================================================================================================================//
//==============================| GMC & Shopping Impressions Checker| Créé par Lucas ARAKELIAN pour Mindfruits SARL|===============================//
//============================================================================================================================================================//
//==============================================================| Mis à jour le 20/02/2019 |=======================================================================//
//============================================================================================================================================================//
//=> CHANGELOG <==============================================================================================================================================//
//= - V1.1 : Correction de l'email d'erreur dans la BDD. =================================================================================================================//
//============================================================================================================================================================//


/*
 Ressources:
  Documentation JS Content API : https://developers.google.com/apps-script/advanced/shopping-content
    Documentation globale Content API : https://developers.google.com/shopping-content/v2/reference/v2/
    Documentation Sheets API : https://developers.google.com/apps-script/reference/spreadsheet/

    Sheet BDD : https://docs.google.com/spreadsheets/d/1BXXPAHb6qlyKj_zUyhtZAaVuUppI8nffxB9E5OW0Iss/edit
*/

var d = new Date(), hour = d.getUTCHours()+1, minutes = d.getMinutes()+1, day = d.getDate(), month = d.getMonth()+1, year = d.getFullYear()
var spreadsheetBdd = SpreadsheetApp.openById('1BXXPAHb6qlyKj_zUyhtZAaVuUppI8nffxB9E5OW0Iss'),
    adwordsSheetBdd = spreadsheetBdd.getSheetByName("adwords"),
    contactSheetBdd = spreadsheetBdd.getSheetByName("people"),
    followUpSpreadsheet = SpreadsheetApp.openById("1A_2zPSfRV4sa4PNqmv_xVQ-p_4m5r0nlIaup_LzYkLc"),
    followUpSheet = followUpSpreadsheet.getSheetByName("produits_actifs"),
    historySheet = followUpSpreadsheet.getSheetByName("history");

function gmcMain() {
  // Definir la sensibilité du script à la variation de produits dans le flux
  var gmcSensitivity = 0.2; // Format : 0.2 = 20% --> une baisse de >20% déclenche l'envoi d'e-mail d'alerte
  var shoppingImpressionsSensitivity = 50; // Format : 50 = 50% --> une baisse de >50% déclenche l'envoi d'e-mail d'alerte
  var searchImpressionsSensitivity = 65; // Format : 50 = 50% --> une baisse de >50% déclenche l'envoi d'e-mail d'alerte

  var accountsToCheck = [], accountsManagers = [], accountsManagersEmail = {}, accountsAdwordsIds = [], accountGmcIds = [], arrayToPaste = [["Nombre de produits à "+hour+"h"+minutes+" le "+day+"/"+month+"/"+year]], allAdwordsIds = [];
  // Récupération des comptes à checker et stockage dans des arrays leurs différents attributs
  for(var i = 0; i<adwordsSheetBdd.getMaxRows(); i++) {
    // Récupération uniquement des comptes contenant des campagnes Shopping
    if( adwordsSheetBdd.getRange(i+2,8).getValue()=="Oui" ) {
      accountsToCheck.push(adwordsSheetBdd.getRange(i+2,1).getValue());
      accountsManagers.push(adwordsSheetBdd.getRange(i+2,4).getValue());
      accountsAdwordsIds.push(adwordsSheetBdd.getRange(i+2,2).getValue());
      accountGmcIds.push(adwordsSheetBdd.getRange(i+2,7).getValue().toString());
    };
    // Récupération de tous les comptes gérés par l'agence.
    if( adwordsSheetBdd.getRange(i+2,3).getValue()=="Oui" ) {
      allAdwordsIds.push(adwordsSheetBdd.getRange(i+2,2).getValue());
    };
  };

  // Récupération des e-mails des managers
  var uniqueAccountManagers = accountsManagers.filter( function(item,pos,self) {
    return self.indexOf(item)===pos;
  });

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

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // Partie servant à supprimer une ligne entière si un compte est supprimé de la BDD et rajouter si nouveau

  // Récupération de la liste des comptes actuels dans un array en 2D
  var a = followUpSheet.getRange(5,2,25,1).getValues();
  // Transformation de l'array en 2D en un array à 1D
  var b = [];
  for(var i = 0; i < a.length; i++)
  {
    b = b.concat(a[i]);
  }

  // Suppression des élements vides de l'array
  var accountsCheckedCurrently = b.filter(function (element) {
    return element != "";
  });

  // Boucle qui check la correspondance entre les comptes checkés et la BDD, et supprime la ligne si la corres
  for(var a in accountsCheckedCurrently) {
    if ( accountsToCheck.indexOf(accountsCheckedCurrently[a]) == -1 ) {
      followUpSheet.deleteRow( Number(a)+5 );
    }
  }

  // Partie du script servant à ajouter un compte au script s'il n'existe pas
  for(var acc in accountsToCheck) {
    if( accountsCheckedCurrently.indexOf(accountsToCheck[acc])== -1 ) {
      followUpSheet.getRange(followUpSheet.getLastRow()+1,2).setValue(accountsToCheck[acc])
      followUpSheet.getRange(followUpSheet.getLastRow(),3).setValue(accountGmcIds[acc])
    }
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Partie qui check le nombre de produits du flux, garde un suivi quotidien, et alerte par email si erreur

  // Début boucle for qui récupère le nombre de produits dans chaque compte
  for(var account in accountsToCheck) {
    var accountName = accountsToCheck[account], accountManager = accountsManagers[account],
        merchantId = accountGmcIds[account], accountAdwordsId = accountsAdwordsIds[account],
        maxResults = 250, numberOfProducts = Number(0);
    var pageToken = undefined;

    Logger.log(accountName)
    Logger.log(merchantId)

    try{
      // Méthode qui récupère tous les produits d'un compte gmc via son id.
      do {
        var products = ShoppingContent.Productstatuses.list(merchantId, {
          pageToken: pageToken,
          maxResults: maxResults,
        });

        if(products.resources != undefined) {
          for (var i = 0; i < products.resources.length; i++) {
            if(products.resources[i].destinationStatuses[0].approvalStatus == "approved") {
              numberOfProducts++;
            }
          }
        }

        pageToken = products.nextPageToken;

      } while (pageToken);

      // Array qui contient le nombre de produit de chaque compte
      arrayToPaste.push([numberOfProducts]);

      Logger.log("Nombre de produits : " + numberOfProducts);
      Logger.log("------------------------------------------------------------");
    } catch(e) {
      Logger.log(e.stack);
      Logger.log(e.name);
      Logger.log(e.message);

      products.resources==undefined ? arrayToPaste.push([0]) : false
      Logger.log("------------------------------------------------------------");
    }

  } // Fin boucle for

  // Collage du nombre de produit de chaque compte dans la feuille et suppression de colonne après 24 entrées
  followUpSheet.getRange(4,24).getValue() != "" ? followUpSheet.deleteColumn(24) : false;
  followUpSheet.insertColumns(5);
  followUpSheet.getRange(4,5,arrayToPaste.length,arrayToPaste[0].length).setValues(arrayToPaste);

  var errorArray = [], allManagers = [];

  // Partie qui alerte d'une erreur sur la sheets, et qui récupère des données servant à envoyer
  // le mail d'alerte en cas d'erreur.
  for(var i = 5; i<arrayToPaste.length+4; i++) {

    // Formattage de cellule en fonction de la présence ou non d'une erreur
    (followUpSheet.getRange(i,5).getValues()-followUpSheet.getRange(i,6).getValues())/followUpSheet.getRange(i,6).getValues() < -gmcSensitivity ?
      followUpSheet.getRange(i,4).setValue("OUI").setBackground("#c71e1e").setFontColor("white") :
    followUpSheet.getRange(i,4).setValue("NON").setBackground("green").setFontColor("white");

    // Récupération de données (compte, manager, nombre de produits avant & après, email) dans un array pour les
    // comptes en erreur. Ces données servent à la fonction d'envoi d'email.
    if(followUpSheet.getRange(i,4).getValue()==="OUI") {

      // Formatage en rouge de la cellule si le compte est en erreur
      followUpSheet.getRange(i,5).setBackground("#f4cccc").setFontWeight("bold")

      var managerName = accountsManagers[accountsToCheck.indexOf(followUpSheet.getRange(i,2).getValue())];
      if( managerName.indexOf(",") > -1 ) {
        var email = emailListFixator(managerName);
      } else {
        var email = [accountsManagersEmail[managerName]];
      };

      // Push dans l'array et récupération des autres données.
      errorArray.push([followUpSheet.getRange(i,2).getValue(),
                       managerName,
                       followUpSheet.getRange(i,5).getValue(),
                       followUpSheet.getRange(i,6).getValue(),
                       email
                      ]);
      // Push du nom des managers dans un array (possibles doublons si 2 comptes d'un même managers sont en erreur)
      allManagers.push(managerName);
    } else {
      followUpSheet.getRange(i,5).setBackground(null).setFontWeight("normal");
    };
  }

  // Suppression des doublons, et utilisations de cette variable comme destinataires du mail.
  var uniqueManagers = allManagers.filter(function(item, pos, self) {
    return self.indexOf(item) == pos;
  });

  // Envoi d'email d'erreur
  sendEmail(uniqueManagers,errorArray)

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Partie du script qui check les performances Search et Shopping et envoie un email d'alerte en cas de chute

  /* Variables servant à la partie du script en charge de checker si un mail d'erreur a été envoyé récemment pour une
  campagne donnée, et le cas échéant, bloquer l'envoi d'un nouvel email, afin d'éviter qu'une même erreur soit envoyée
  tous les jours. Un mail suffit.

  Fonctionnement : à chaque execution, le script va coller dans la feuille nommée "history" un array contenant
  chaque campagne de chaque compte, et ajouter la mention "mistake" si un email a été envoyé lors de la dernière execution.
  Avant de faire cela, le script va d'abord récupérer le tableau existant, et vérifier si les campagnes en erreur lors de
  l'execution en cours comportent la mention "mistake", afin de savoir s'il faut oui ou non envoyer un email pour ces campagnes là.

  Ces 2 processus se font respectivement pour les campagnes Shopping et les campagnes Search.
  Nomenclature des variables : les variables précédées de "sho" concernent les campagnes shopping, et celles précédées de
  "sea" concernent les campagnes Search.*/

  /* Array que l'on va  coller pour rafraîchir le tableau dans la feuille "history". Appelons-le "array de rafraîchissement".
  / Il va s'agir d'un array à 2 dimensions, contenant le nom des campagnes dans une colonne, et une autre colonne vide, dans
  laquelle la mention "mistake" peut être ajoutée.*/
  var shoHistoryArray = [];
  // Variable contenant le contenu actuel du tableau. Appelons-le "array de vérification".
  var shoHistoricData = historySheet.getRange(2,1,historySheet.getLastRow(),2).getValues();

  // Même variables pour les campagnes Search.
  var seaHistoryArray = [];
  var seaHistoricData = historySheet.getRange(2,4,historySheet.getLastRow(),2).getValues();


  /* Objet contenant les arguments à passer à la fonction d'envoi d'e-mail. Pour chaque campagne en erreur, le script ajoute
  a cet objet un certain nombre d'informations concernant cette campagnes, listées dans l'objet. L'objet contient autant de
  propriétés que de gestionnaires de compte. Pour ajouter un gestionnaire, ajouter une propriété prenant le nom du gestionnaire
  et copier-coller les éléments de la propriété à partir des autres gestionnaires.*/
  var optArgs = {}

  for(var manager in uniqueAccountManagers) {
    optArgs[uniqueAccountManagers[manager]] = {};
    optArgs[uniqueAccountManagers[manager]].manager = [];
    if( uniqueAccountManagers[manager].indexOf(",") > -1 ) {
      optArgs[uniqueAccountManagers[manager]].email = emailListFixator(uniqueAccountManagers[manager]);
    } else {
      optArgs[uniqueAccountManagers[manager]].email = [accountsManagersEmail[uniqueAccountManagers[manager]]];
    }
    optArgs[uniqueAccountManagers[manager]].shoAccounts=[];
    optArgs[uniqueAccountManagers[manager]].shoCampaign= [];
    optArgs[uniqueAccountManagers[manager]].pImpSho=[];
    optArgs[uniqueAccountManagers[manager]].cImpSho=[];
    optArgs[uniqueAccountManagers[manager]].seaAccounts=[];
    optArgs[uniqueAccountManagers[manager]].seaCampaign=[];
    optArgs[uniqueAccountManagers[manager]].pImpSea=[];
    optArgs[uniqueAccountManagers[manager]].cImpSea=[];
  }

  var contactsArray = Object.keys(optArgs);
}
