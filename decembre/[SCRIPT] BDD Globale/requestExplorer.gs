function REquery(obj) {
  Logger.log("\n\n\n")
  if(typeof obj.id=="undefined" || typeof obj.start=="undefined" || typeof obj.end=="undefined" || typeof obj.metrics=="undefined"){
    Logger.log("REquery dit: L'argument obj ne comprend pas une des clés suivante: {id,startDate,endDate,metrics,dimensions\n\n\n")
    return false
  }
  if(obj.metrics.indexOf('ga:') == -1){
    Logger.log("REquery dit: Votre metrics n'est pas au bon format")
    return false
  }
  Logger.log("\n\n\n")

  if(typeof obj.dimensions == "undefined")obj.dimensions = {'dimensions': ''}
  if((typeof obj.id == 'string' && obj.id.indexOf('ga:') == -1) || typeof obj.id == 'number')
    obj.id="ga:"+obj.id
  var isDateOk = formatDate([obj.start, obj.end])

  Logger.log('ok')
  if(isDateOk !== false){
    var results = Analytics.Data.Ga.get(
      obj.id,
      isDateOk[0],
      isDateOk[1],
      obj.metrics,
      obj.dimensions
    )
    return results
  }else return false
}







/*------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
function formatDate(stringORarray){
          /*inutilisé*/
          ///"^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$"
          /*inutilisé*/
  var array = []
  var msgError = ""
  if(typeof stringORarray == "string")
    if(new Date(stringORarray).getDate())
      array = [new Date(stringORarray)]
    else throw "Le paramètre de date: '"+stringORarray+"', n'est pas valide";
  if(typeof stringORarray == "object")
    if(Array.isArray(stringORarray)){
      for(a in stringORarray)
        if(typeof stringORarray[a] == "string"){
          if(new Date(stringORarray[a]).getDate())
            stringORarray[a] = new Date(stringORarray[a])
          else{
            msgError += "'"+stringORarray[a]+"', "
            Logger.log('okok')
            Logger.log(stringORarray[a])
            Logger.log(new Date(stringORarray[a]))
          }
          if(msgError != "")throw "Les paramètres de date[] suivants: '"+msgError+"' , ne sont pas valides.";
        }else if(!typeof stringORarray[a] == "object" || new Date(stringORarray[a]).getDate())
          throw "Les paramètres de date dans le array ne sont pas au bon format date";
      array = stringORarray
    }
  for(a in array)
    array[a] = RERestituteGoodFormat(array[a])

  return array
}
function RERestituteGoodFormat(date) {
  return date.getFullYear() + "-" + completeDate(date.getMonth()+1) + "-" +completeDate(date.getDate())
}
function completeDate(date) {
  if(parseFloat(date)<10) {
   return String("0" + date);
  } else {
   return date;
  }
}
