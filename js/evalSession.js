var evalSession = {
  //donde se guardaran las respuestas a un examen.
  //debería haber una forma de relacionar la estructura
  //con un test en particular
  structureModel: {
    head:{
      tag: "header",
      title: {
        tag: "h1",
      }
    },
    qCont:{
      tag: "section",
      class: St.qContainer
    },
    btnCont:{
      tag: "section",
      send: {
        tag: "button",
        id: "sendBtn",
      },
      results: {
        tag:"button"
      }
    }
  },
  htStructure: {},
  testAnswers: {
    testName: "",
    answers: {}
  },
  evaluate: function() {
    console.clear();
    return new Promise((fulfill,reject)=>{

      evalSession.fetchAnswers().then((message)=>{

        for(let ques in actualTest.questions){
          evalSession.assessed[ques] = actualTest.questions[ques].assess(evalSession.testAnswers,ques);
          if (!evalSession.assessed[ques]) {
            //codigo para capturar las preguntas equivocadas
            //Se afectará con CSS al contenedor mayor de tipo Fieldset
            //me pregunto si tengo que crear un nuevo objeto contenedor de estos y que en el mismo, se
            //puedan guardar tanto correctos como incorrectos.

            //esta linea devuelve el elemento que esta incorrecto
            console.log("something wrong here! ", evalSession.htStructure.qCont[ques].element);
            //segunda idea: no creo mas objetos ni nada, simplemente hago una iteracion que compare
            //el objeto evalsession.assessed[elmismo] con el htStructure.qCont[elmismo].element y si es correcto, 
            //le ponga una clase, y si no, otra ... classList.add(St.required);
          }
        }
        console.log("objeto assessed ", evalSession.assessed);
        console.log(`in percentage: ${evalSession.percentageResult(evalSession.assessed)}%`);
        console.log(`in scale: ${evalSession.scaleResult(actualTest)}`);
        fulfill();
      }, (message) => reject(message));  
    });
  },
  fetchAnswers: function(){
    return new Promise(function(fulfill,reject){
      form.validateReq(evalSession.htStructure.qCont.element).then(function(message){
        console.log("fetchVal fulfilled: ", message);
        cleanClass(evalSession.htStructure.qCont.element, St.required);
        //fetching code
        for(let ques in actualTest.questions){

          for(let opt in evalSession.htStructure.qCont[ques].list){

            if (opt !== "element" && evalSession.htStructure.qCont[ques].list[opt].input.element.checked) {
              evalSession.testAnswers.answers[ques] = {};
              evalSession.testAnswers.answers[ques].chosen = opt;
            }
            
          }
        }
        console.log("fetched: ", evalSession.testAnswers);
        //end of fetching code
        fulfill(message);
      },function(message){
        console.log("fetchVal rejected: ", message);
        cleanClass(evalSession.htStructure.qCont.element, St.required);

        //painting required fields 
        for(let el in message.elements){
            message.elements[el].classList.add(St.required);          
        }
        reject(message);
      });
    });
  },
  assessed: {},
  percentageResult: function(){
  		let stats = evalSession.resultsStats(evalSession.assessed);
  		console.log("total stats: ", stats.total);
  		//after the iterations calculate percentage
  		let rightPerc = (stats.rightCount/stats.total) * 100;
  		return rightPerc;
  },
  resultsStats: function(results){
	  	let stats = {
	    rightCount: 0,
	    wrongCount:0,
	    total: 0
	  }
	  for(let value in results) {
	    stats.total++;
	    if (results[value]) {
	      stats.rightCount++;
	    } else {
	      stats.wrongCount++
	    }
	  }
	  return stats;
  },
  scaleResult: function(test){
	  let stats = evalSession.resultsStats(evalSession.assessed);
	  let result = (stats.rightCount*test.scaleRange.max)/stats.total;
	  return result;
	}
}