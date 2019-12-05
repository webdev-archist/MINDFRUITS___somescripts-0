var tmp, tmpbis, cpt, cptbis, tmparr, cptarr, a,b,c,i,j,k;
var shBdd = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1BXXPAHb6qlyKj_zUyhtZAaVuUppI8nffxB9E5OW0Iss/")
var shBddGAds = shBdd.getSheetByName("global")
var shBddProfiles = shBdd.getSheetByName("ProfilesAnalytics")
var shEvolutionChecker = shBdd.getSheetByName("evolutionChecker")
var shEvolutionChecker_ = shBdd.getSheetByName("evolutionChecker_")
/*
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
*/
function restarting(){
  if(typeof GAId !=  "undefined"){
    var metrics = "ga:sessions"
    var dimensions = {'dimensions': ''}
    if(client.ObjectifCA == "Oui" || client.ObjectifGA.indexOf('ga:') != -1){
      if(client.ObjectifCA == "Oui"){
        metrics += ',ga:transactionRevenue'
      }
      if(client.ObjectifGA.indexOf('ga:') != -1){
        metrics += ','+client.ObjectifGA
      }
    }

    /*
    var ok = Analytics.Management.Goals.get(
      '103871936',
      'webPropertyId': 'UA-123456-1',
      'profileId': '7654321',
      '4'
    );
    */
    Logger.log('ok')
  }
}
function Arr_1Dfrom2D(arr){
  tmp = []
  for(a in arr)
    tmp.push(arr[a][0])
  return tmp
}
/*
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
*/
function aa(client){
  var a = Analytics.Data.Ga.get(
    "ga:103871936",
    "2019-12-01",
    "2019-12-31",
    "ga:sessions,ga:goal5Starts,ga:goal6Starts"
  )
  Logger.log('ok')
}
function ff(client){
  var a = REquery({id: 103871936, start: '01/12/2019', end: '31/12/2019', metrics: 'ga:sessions'})
  Logger.log('ok')
}
function getCompagnies(client){

  var half, full
  var cptCA = 0
  var cptGA = 0
  var cptOUI = 0
  var cptNON = 0
  var results = {half:[],full:[]}
  var header = [["dimension", "Sessions", "CA", "GA1", "GA2", "GA3", "GA4", "GA5", "GA6", "GA7", "GA8", "GA9", "GA10"]]
  if(shEvolutionChecker.getLastRow()!=0){
    shEvolutionChecker.getRange(1,1,shEvolutionChecker.getLastRow(),shEvolutionChecker.getLastColumn()).clearContent().setBackground('white')
    shEvolutionChecker_.getRange(1,1,shEvolutionChecker_.getLastRow(),shEvolutionChecker_.getLastColumn()).clearContent().setBackground('white')
  }
  shEvolutionChecker.getRange(1,1,1,  header[0].length).setValues(header)
  shEvolutionChecker_.getRange(1,1,1,  header[0].length).setValues(header)
  shEvolutionChecker.getRange(1,1,1,shEvolutionChecker.getLastColumn()).setBackground("brown")
  shEvolutionChecker_.getRange(1,1,1,shEvolutionChecker_.getLastColumn()).setBackground("brown")

  var compagnies = shBddGAds.getRange('A3:A'+shBddGAds.getLastRow()).getValues();
  var compagnies_gads = shBddGAds.getRange('E3:E'+shBddGAds.getLastRow()).getValues();
  var compagnies_objCA = shBddGAds.getRange('N3:N'+shBddGAds.getLastRow()).getValues();
  var compagnies_objGA = shBddGAds.getRange('O3:O'+shBddGAds.getLastRow()).getValues();


  var i=0
  for(a in compagnies){
    var metrics = "ga:sessions"
    var dimensions = {'dimensions': ''}
    var compagnieName = compagnies[a][0]
    compagnies[a].push(compagnies_gads[a][0])
    compagnies[a].push(compagnies_objCA[a][0])
    compagnies[a].push(compagnies_objGA[a][0])

    if(compagnies_objGA[a][0].indexOf('ga:') != -1 || compagnies_objCA[a][0] == "Oui"){
                        var gg = compagnies[a]
                        var period_half = getDateRange("half")
                        var period_full = getDateRange("full")

      cptOUI++
      if(compagnies_objCA[a][0] == "Oui"){
        cptCA++
        metrics += ',ga:transactionRevenue'
      }
      if(compagnies_objGA[a][0].indexOf('ga:') != -1){
        cptGA++
        metrics += ","+compagnies_objGA[a][0]
      }
      if(metrics.split(',').length > 1){
        i++
        Logger.log('oui '+i)
        Logger.log('compagnies[a]: %s', compagnies[a])
        half = requestGA("ga:"+compagnies_gads[a][0], metrics, dimensions, period_half, compagnieName)
        full = requestGA("ga:"+compagnies_gads[a][0], metrics, dimensions, period_full, compagnieName)
        results.half.push(half)
        results.full.push(full)
        Logger.log('results: %s', results)
        Logger.log('ok11')
        //CEST ICI QUIL FAUT INSERER LES DONNEES DANS LA FUILLE DE CALCUL
        if(typeof half != "undefined"){
          shEvolutionChecker.getRange(shEvolutionChecker.getLastRow()+1, 1, results.half[0].length, results.half[0][0].length).setValues(half).setBorder(false,false,true,false,false,false)
          shEvolutionChecker.getRange("A1:A"+shEvolutionChecker.getLastRow()).setBackground("red")
        }else Logger.log("typeof half != 'undefined'.\nVoici les param")
        if(typeof full != "undefined"){
          shEvolutionChecker_.getRange(shEvolutionChecker_.getLastRow()+1, 1, results.full[0].length, results.full[0][0].length).setValues(full).setBorder(false,false,true,false,false,false)
          shEvolutionChecker_.getRange("A1:A"+shEvolutionChecker_.getLastRow()).setBackground("red")
        }
      }else Logger.log('non '+i)
    }else cptNON++
  }
  /*
  shEvolutionChecker.getRange(shEvolutionChecker.getLastRow()+1, 1, results.half[0].length, results.half[0][0].length).setValues(results.half[0])
  shEvolutionChecker_.getRange(shEvolutionChecker_.getLastRow()+1, 1, results.full[0].length, results.full[0][0].length).setValues(results.full[0])
  shEvolutionChecker.getRange("A1:A"+shEvolutionChecker.getLastRow()).setBackground("red")
  shEvolutionChecker_.getRange("A1:A"+shEvolutionChecker_.getLastRow()).setBackground("red")
  */
  Logger.log('ok')

}
function requestGA(GA_Id, metrics, dimensions, period, compagnieName) {
  var startDate, endDate, _startDate, _endDate
  var allResults = {}
  var allResults_ = [[], [], [], [], [], [], [], [], [], []]
  var delta = {}
  var delta_ = []
  var ttt= GA_Id.substring(GA_Id.indexOf(':')+1)
  var rrr = compagnieName
  var goalsArray = getGoalsFromActiveCellll(ttt)
  for(var i=0;i<10;i++)if(typeof goalsArray[i] == "undefined")goalsArray[i]=""
Logger.log('ok')
/*
  ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

  if(GA_Id.indexOf("ga:")==-1)GA_Id = "ga:"+GA_Id

  if(typeof GA_Id == "undefined")return;
  if(typeof metrics == "undefined")metrics = ''
  if(typeof dimensions == "undefined")dimensions = {}

  /*
  if(typeof GA_Id == "undefined")GA_Id = 'ga:103871936'
  if(GA_Id.indexOf("ga:")==-1)GA_Id = "ga:"+GA_Id
  if(typeof metrics == "undefined")metrics = 'ga:sessions,ga:transactionRevenue,ga:transactions'
  if(typeof dimensions == "undefined")dimensions = {'dimensions': 'ga:channelGrouping,ga:month,ga:year'}
  */
/*------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
*/
  startDate = period.thisYear[0]
  endDate = period.thisYear[1]
  _startDate = period.prevYear[0]
  _endDate = period.prevYear[1]
  tmp=null

  //Logger.log('ok')
  //setCAHeader()
  try{
    var results = Analytics.Data.Ga.get(
      GA_Id,
      startDate,
      endDate,
      metrics,
      dimensions
    )
    var _results = Analytics.Data.Ga.get(
      GA_Id,
      _startDate,
      _endDate,
      metrics,
      dimensions
    )
  }
  catch(err){var erreur = err}

  Logger.log('ok')
  if(!erreur){
    cpt = results.getTotalResults()
    cptbis = _results.getTotalResults()

    Logger.log('ok')
    if(cpt != 0 && cptbis != 0){
      cpt = results.getRows()
      cptbis = _results.getRows()
      allResults[GA_Id] = {thisYear: cpt, prevYear: cptbis}

      var arrayAllResults = []
      var objAllResults = {sessions:0, ca: 0, ga1: 0, ga2: 0, ga3: 0, ga4: 0, ga5: 0, ga6: 0, ga7: 0, ga8: 0, ga9: 0, ga10: 0, }
      var objAllResultsPrev = {sessions:0, ca: 0, ga1: 0, ga2: 0, ga3: 0, ga4: 0, ga5: 0, ga6: 0, ga7: 0, ga8: 0, ga9: 0, ga10: 0, }
      var objAllResultsDelta = {sessions:0, ca: 0, ga1: 0, ga2: 0, ga3: 0, ga4: 0, ga5: 0, ga6: 0, ga7: 0, ga8: 0, ga9: 0, ga10: 0, }
      var offset = metrics.indexOf('ga:transactionRevenue') == -1 ? 0 : 1
      var offset2 = 0
      if(metrics.indexOf('ga:sessions') != -1){
        objAllResults.sessions = parseInt(cpt[0][0]);
        objAllResultsPrev.sessions = parseInt(cptbis[0][0]);
        objAllResultsDelta.sessions = ((objAllResults.sessions - objAllResultsPrev.sessions)/objAllResultsPrev.sessions)*100;
      }
      if(metrics.indexOf('ga:transactionRevenue') != -1){
        objAllResults.ca = parseInt(cpt[0][1]);
        objAllResultsPrev.ca = parseInt(cptbis[0][1]);
        objAllResultsDelta.ca = ((parseInt(objAllResults.ca) - parseInt(objAllResultsPrev.ca)) / parseInt(objAllResultsPrev.ca))*100
        if(objAllResults.ca == 0 && objAllResultsPrev.ca == 0)objAllResultsDelta.ca = 0
      }else objAllResults.ca = objAllResultsPrev.ca = objAllResultsDelta.ca = 0/*"Donnée non demandée"*/
      if(metrics.indexOf('ga:goal')!=-1){
        var gagoal = []
        for(var i=1;i<=10;i++){
          if(metrics.indexOf('ga:goal'+i+'Starts') != -1){
            gagoal[i] = "--nom goal--"
            offset2++
            Logger.log("1 + offset + offset2: %s", (1 + offset + offset2))
            Logger.log("cpt: %s", cpt)
            Logger.log("cptbis: %s", cptbis)
            objAllResults["ga"+i] = parseInt(cpt[0][offset + offset2]);
            objAllResultsPrev["ga"+i] = parseInt(cptbis[0][offset + offset2]);
            tmp = ((objAllResults['ga'+i] - objAllResultsPrev['ga'+i]) / objAllResultsPrev['ga'+i])*100
            Logger.log("___tmp: %s", tmp)
            objAllResultsDelta["ga"+i] = tmp == "Infinity" ? 100 : tmp
            if(objAllResults["ga"+i] == 0 && objAllResultsPrev["ga"+i] == 0)objAllResultsDelta["ga"+i] = 0
          }else objAllResults["ga"+i] = objAllResultsPrev["ga"+i] = objAllResultsDelta["ga"+i] = 0/*"Donnée non demandée"*/
        }
        Logger.log("objAllResults: %s; objAllResultsPrev: %s; objAllResultsDelta: %s", objAllResults, objAllResultsPrev, objAllResultsDelta)
      }else objAllResults["ga"+i] = objAllResultsPrev["ga"+i] = objAllResultsDelta["ga"+i] = 0/*"Donnée non demandée"*/
      //var h = [["compagnieName: "+compagnieName, "GA_Id: "+GA_Id, "metrics: "+metrics+";;;period: "+period, "", "", "", "", "", "", "", "", "", ""]]
      var h = [["compagnieName: "+compagnieName, "GA_Id: "+GA_Id, "metrics: "+metrics+";;;period: "+period, goalsArray[0], goalsArray[1], goalsArray[2], goalsArray[3], goalsArray[4], goalsArray[5], goalsArray[6], goalsArray[7], goalsArray[8], goalsArray[9]]]
      var hh = h.join(';;;')
      if(period == "half")shEvolutionChecker.getRange(shEvolutionChecker.getLastRow()+1, 1, h.length, h[0].length).setValues(h).setBackground("yellow").setBorder(true, false, false, false, false, false)
      if(period == "full")shEvolutionChecker_.getRange(shEvolutionChecker_.getLastRow()+1, 1, h.length, h[0].length).setValues(h).setBackground("yellow").setBorder(true, false, false, false, false, false)
      /*
      if(period == "half")shEvolutionChecker.getRange(shEvolutionChecker.getLastRow()+1, 1, h.length, 3).mergeAcross()
      if(period == "full")shEvolutionChecker_.getRange(shEvolutionChecker_.getLastRow()+1, 1, h.length, 3).mergeAcross()
      */
      arrayAllResults.push(
        ["This year", objAllResults.sessions, objAllResults.ca, objAllResults.ga1, objAllResults.ga2, objAllResults.ga3, objAllResults.ga4, objAllResults.ga5, objAllResults.ga6, objAllResults.ga7, objAllResults.ga8, objAllResults.ga9, objAllResults.ga10],
        ["Last year", objAllResultsPrev.sessions, objAllResultsPrev.ca, objAllResultsPrev.ga1, objAllResultsPrev.ga2, objAllResultsPrev.ga3, objAllResultsPrev.g4a, objAllResultsPrev.ga5, objAllResultsPrev.ga6, objAllResultsPrev.ga7, objAllResultsPrev.ga8, objAllResultsPrev.ga9, objAllResultsPrev.ga10],
        ["Delta", objAllResultsDelta.sessions, objAllResultsDelta.ca, objAllResultsDelta.ga1, objAllResultsDelta.ga2, objAllResultsDelta.ga3, objAllResultsDelta.g4a, objAllResultsDelta.ga5, objAllResultsDelta.ga6, objAllResultsDelta.ga7, objAllResultsDelta.ga8, objAllResultsDelta.ga9, objAllResultsDelta.ga10]
      )

      Logger.log('arrayAllResults: %s', arrayAllResults)
      Logger.log('ok')

      return arrayAllResults
    }
    else cpt=cptbis=null
  }
}

function getDateRange(period) {
  var startDate = new Date()
  startDate.setDate(1)
  var endDate = new Date()

  if(period=="half")
    endDate.setDate(15)
  else if(period=="full"){
    endDate.setMonth(endDate.getMonth()+1)
    endDate.setDate(0)
  }

  var startDateString =  startDate.getFullYear() + "-" + completeDate(startDate.getMonth()+1) + "-01"
  var endDateString =  endDate.getFullYear() + "-" + completeDate(endDate.getMonth()+1) + "-" + completeDate(endDate.getDate())
  var _startDateString =  startDate.getFullYear()-1 + "-" + completeDate(startDate.getMonth()+1) + "-01"
  var _endDateString =  endDate.getFullYear()-1 + "-" + completeDate(endDate.getMonth()+1) + "-" + completeDate(endDate.getDate())

  return {prevYear: [_startDateString, _endDateString], thisYear: [startDateString, endDateString]}
}
function completeDate(date) {
  if(parseFloat(date)<10) {
   return String("0" + date);
  } else {
   return date;
  }
}
