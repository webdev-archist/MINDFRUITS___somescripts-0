<!DOCTYPE html>
<html>
  <head>
    <base target="_top">
  </head>
  <style>
    #divResult{
      right: 0;
      top: 0;
      height: 200px;
      position: absolute;
    }
    #divResult>*{float:right;clear:both}
  </style>
  <body>
  <form onsubmit="return false;">
    <ul id="ul">
    <!--
      <li><span>Goal n°1</span><input name="obj1" type="checkbox"></li>
      <li><span>Goal n°2</span><input name="obj2" type="checkbox"></li>
      <li><span>Goal n°3</span><input name="obj3" type="checkbox"></li>
      <li><span>Goal n°4</span><input name="obj4" type="checkbox"></li>
      <li><span>Goal n°5</span><input name="obj5" type="checkbox"></li>
      <li><span>Goal n°6</span><input name="obj6" type="checkbox"></li>
      <li><span>Goal n°7</span><input name="obj7" type="checkbox"></li>
      <li><span>Goal n°8</span><input name="obj8" type="checkbox"></li>
      <li><span>Goal n°9</span><input name="obj9" type="checkbox"></li>
      <li><span>Goal n°10</span><input name="obj10" type="checkbox"></li>
    -->
    </ul>
    <input type="submit" onclick="sendResp(this.form);">
  </form>
  <!--div id="divResult">
    <textarea id="theResult" readonly></textarea>
    <button onclick="theResult.select();document.execCommand('copy');google.script.host.close();">Copy</button>
  </div-->

  <script>
    var scriptId = "1nC67HPN3HYt6f8bP8Hb6Xj9D_DClbPFjB93T1H5Gvxo1GcpNZpd0E1By"
    var data = <?!= JSON.stringify(data) ?>; //Stores the data directly in the javascript code
    var objectifs = data.objectifs
    var clientName = data.clientName
    var rangeValue = data.rangeValue
    /*
    alert(Object.keys(objectifs).length)
    alert(objectifs)
    */
    console.log(objectifs)
    if(objectifs.length == 1){alert(objectifs[0]);alert('ok')}
    else for(a in objectifs)if(a != 0){
      ul.innerHTML += "<li><input name='obj"+a+"' type='checkbox'> : <span>Goal n°"+a+" : </span><span>"+objectifs[a]+"</span></li>"
    }


    function sendResp(e) {
      var end = e.length
      let checkedInput = []
      let toReturn = ""
      for(var i=1;i<=end;i++)
        if(typeof e["obj"+i] != "undefined" && e["obj"+i].checked){
          checkedInput.push("ga:goal"+i+"Starts")
        }
      toReturn = checkedInput.join(",")
      alert("Les informations sur les objectif GAnalytics ont étés ajoutés avec succès pour le client: " + clientName + "\n\nVoici ce qui a été ajouté en case "+rangeValue+":\n- " + toReturn)
      google.script.run.writeResult({row: objectifs[0], result: toReturn});
      google.script.host.close();
    }
  </script>
  </body>
</html>
