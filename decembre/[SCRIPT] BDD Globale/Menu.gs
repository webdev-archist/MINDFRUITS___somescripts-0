function getGoalsFromActiveCellll(GAView){
  var GAIds = shBddProfiles.getRange("B2:B"+shBddProfiles.getLastRow()).getValues()
  var GAViewIds = shBddProfiles.getRange("F2:F"+shBddProfiles.getLastRow()).getValues()
  var GAId = false
  for(a in GAViewIds)
    if(GAViewIds[a][0]==GAView)
      GAId = GAIds[a][0]
  if(GAId !== false){
    var listObjectifs = Analytics.Management.Goals.list(
      GAId,
      'UA-'+GAId+'-1',
      GAView
    ).items
    return getGAGoalsFromArray(listObjectifs)
  }else return false

}
function getGAGoalsFromArray(responseGAGoal){
  var goalsArray = []

  for(a in responseGAGoal){
    goalsArray.push(responseGAGoal[a].name)
  }
  return goalsArray
}
function getGoalsFromActiveCell(){
  var GAId
  var goals = []
  var GAIds = shBddProfiles.getRange("B2:B"+shBddProfiles.getLastRow()).getValues()
  var GAViewIds = shBddProfiles.getRange("F2:F"+shBddProfiles.getLastRow()).getValues()
  GAIds = Arr_1Dfrom2D(GAIds)
  GAViewIds = Arr_1Dfrom2D(GAViewIds)
 /* -------------------------------- */
  var activeCel = SpreadsheetApp.getActiveRange().getA1Notation();
  var activeRow = activeCel.substring(1)
  var compName = shBddGAds.getRange('A'+activeRow).getValue()
  var client = {name: compName,
    GAId: shBddGAds.getRange('E'+activeCel.substring(1)).getValue(),
    GAdsId: shBddGAds.getRange('H'+activeCel.substring(1)).getValue(),
    GMCId: shBddGAds.getRange('L'+activeCel.substring(1)).getValue(),
    ObjectifCA: shBddGAds.getRange('N'+activeCel.substring(1)).getValue(),
    ObjectifGA: shBddGAds.getRange('O'+activeCel.substring(1)).getValue()
  }
  if(GAViewIds.indexOf(client.GAId) != -1)
    GAId = GAIds[GAViewIds.indexOf(client.GAId)]
  if(shBddGAds.getRange('I'+activeCel.substring(1)).getValue() == "Oui"){
    var listObjectifs = Analytics.Management.Goals.list(
      GAId,
      'UA-'+GAId+'-1',
      client.GAId
    ).items
    tmp = []
    tmp.push(activeRow)
    for(i=0;i<listObjectifs.length;i++)
      tmp.push(listObjectifs[i].name)
    listObjectifs = tmp

    return listObjectifs
  }else{
    return ["Cette utilisateur n'est plus votre client"]
  }
}
function getGAInfos_fromAllAccounts(){
  var shProfilesAnalytics = shBdd.getSheetByName("ProfilesAnalytics");
  var i,j,k
  var profileArray = []
  var profileArray_ = []
  Utilities.sleep(100)
  var accounts = Analytics.Management.Accounts.list();
  if(accounts.items && accounts.items.length){
    for(i=0;i<accounts.items.length;i++){
      var account = accounts.items[i]
      Analytics.Management.Webproperties.list(account.id)
      var webProperties = Analytics.Management.Webproperties.list(account.id)
      if(webProperties.items && webProperties.items.length){
        for(j=0;j<webProperties.items.length;j++){
          var webProperty = webProperties.items[j]
          var listProfiles = Analytics.Management.Profiles.list(account.id,webProperty.id)
          if(listProfiles.items && listProfiles.items.length){
            for(var k=0;k<listProfiles.items.length;k++){
              var profile = listProfiles.items[k]
              profileArray.push([account.name, account.id, webProperty.name, webProperty.id, profile.name, profile.id])
              profileArray_.push({compte: [account.name, account.id], property: [webProperty.name, webProperty.id], view: [profile.name, profile.id]})
            }
          }
        }
      }
    }
  }
  shProfilesAnalytics.getRange(2,1,profileArray.length,profileArray[0].length).setValues(profileArray);
  Logger.log('ok')
}
/*
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
*/
function addMenu() {
    var menu = SpreadsheetApp.getUi();
    menu.createMenu("Ajouter objectif GA")
    .addItem("A partir selection > générer objectifs GA", 'addGAGoals')
    .addToUi();
}
function addGAGoals(){
  var activeCase = SpreadsheetApp.getActiveRange().getA1Notation()
  var activeSheet = SpreadsheetApp.getActiveSheet()
  Logger.log("activeCase: "+activeCase)
  if(activeSheet.getName() == "global" && activeCase != "A1"){
    var clientName = shBddGAds.getRange("A"+activeCase.substring(1)).getValue()
    Logger.log(activeCase.substring(0,1)+"1")
    Logger.log(clientName)
    var htmlTemplate = HtmlService.createTemplateFromFile('GAGoals');
    htmlTemplate.data = {objectifs: getGoalsFromActiveCell(), clientName: clientName, rangeValue: "O"+activeCase.substring(1)};
    var htmlOutput = htmlTemplate.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME).setTitle('sample');
    SpreadsheetApp.getUi().showModalDialog(htmlOutput, "Objectif Google Analytics")
  }else{
    var htmlTemplate = HtmlService.createTemplateFromFile('errorMessage');
    htmlTemplate.data = {message: "Veuillez d'abord selectionner une case correspondant à un client, afin de pouvoir ajouter les informations demandés"};
    var htmlOutput = htmlTemplate.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME).setTitle('sample');
    SpreadsheetApp.getUi().showModalDialog(htmlOutput, "Erreur !")
  }
}
function showResult(x){
  Logger.log('ok')

    var htmlTemplate = HtmlService.createTemplateFromFile('showResult');
    htmlTemplate.data = {result: x};
    var htmlOutput = htmlTemplate.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME).setTitle('sample');
    SpreadsheetApp.getUi().showModalDialog(htmlOutput, "Résultats")
}
function writeResult(x){
  /*
  Logger.log(x)
  Logger.log(x.row)
  Logger.log(typeof x)
  Logger.log(shBddGAds.getRange("L"+x.row).getValue())
  */
  shBddGAds.getRange("N"+x.row).setValue("Oui")
  shBddGAds.getRange("O"+x.row).setValue(x.result)
}
/*
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
*/
function setCAHeader(){
  var cols = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]
  shBddGAds.getRange(cols[shBddGAds.getLastColumn()]+"1:"+cols[shBddGAds.getLastColumn()+1]+"1").setValues([["Objectifs CA & Goals",""]])
  shBddGAds.getRange(cols[shBddGAds.getLastColumn()-1]+"1:"+cols[shBddGAds.getLastColumn()]+"1").activate().mergeAcross()
  shBddGAds.getRange(cols[shBddGAds.getLastColumn()-1]+"2").setValues([["CA"]])
  shBddGAds.getRange(cols[shBddGAds.getLastColumn()]+"2").setValues([["GA"]])
  shBddGAds.getRange(cols[shBddGAds.getLastColumn()-1]+"3:"+cols[shBddGAds.getLastColumn()-1]+""+shBddGAds.getLastRow()).clearContent().clearDataValidations()
}
