var webQuiz = {
  htFiller: function(model, htModel= {}, propName){
      //recibe un objeto con la estructura de html en propiedades
      //devuelve otro con esa estructura completada
      //console.log("Corre funcion, modelo es: ", model);
      //console.log("corre funcion, htModel: ", htModel);
      // console.log("padre ahora es: ", propName);
      for (let property in model) {

        //console.log("Evaluando propiedad " + property + ": ", typeof(model[property]));
        if (typeof(model[property]) == "object"){
          htModel[property] = {};
          htModel[property]["element"] = {}
          htModel[property]["element"]= document.createElement(model[property].tag);
          //console.log("exito! " + property + " creado en htModel", htModel);
          this.htFiller(model[property],htModel[property], property);
        } else if (typeof(model[property]) == "object" && htModel[propName]["element"] instanceof HTMLElement) {
         //console.log("corre segunda instrancia") ;
          htModel[propName][property] = {};
          htModel[propName][property]["element"] = {};
          htModel[propName][property]["element"] = document.createElement(model[property].tag);
          //console.log("htObject["+ propName +"]"+ "["+ property +"]", htObject[propName][property]);
          //console.log("exito! " + property + " creado en htModel ["+ propName +"]["+ property +"]" + "[element]");
          this.htFiller(model[property], htModel[property], property);
        } else if (typeof(model[property]) == "string" && property !== "tag") {
          //console.log("abuelo ahora es: ", grandPa);
          //console.log("padre ahora es: ", propName);
          //console.log("es htModel[element] un HTML: ", htModel["element"] instanceof HTMLElement);
          htModel["element"].setAttribute(property, model[property]);
          //console.log("atributo " + property + " vale: ", htModel["element"]);
        }
        //console.log("htModel va asi: ", htModel);
      }
      return htModel;
  },
  htPrinter: function(model, htFather){
      //recibe un objeto con la estructura de html en propiedades
      //devuelve otro con esa estructura completada
      //console.log("Corre funcion, modelo es: ", model);
      //console.log("corre funcion, htFather: ", htFather);
      for (let property in model) {
       // console.log("Evaluando propiedad " + property + ": ", typeof(model[property]));
        if (typeof(model[property]) == "object" && property !== "element" &&
         model[property]["element"] instanceof HTMLElement && htFather instanceof HTMLElement){
         // console.log("model[property][element] es: ", model[property]["element"]);
          htFather.appendChild(model[property]["element"]);
         // console.log("exito! " + model[property]["element"] + " apendeado en: ", htFather)
          this.htPrinter(model[property],model[property]["element"]);
        } else if (typeof(model[property]) == "object" && property !== "element") {
          this.htPrinter(model[property], model[property]);
        }
      }
      //console.log("acaba htFather asi: ", htFather);
  },
  showCD: function() {
    form.countDisplay.innerHTML = `Pregunta ${actualTest.currentQuestion}/${actualTest.questionCount}`;
  },
  // este metodo deberia recibir el Test
  setAnswers: function(){
    let body = document.body;
    body.innerHTML = "";
    //Set stuff for the main screen
    let evalScreen = webQuiz.htFiller(evalSession.structureModel);
    evalScreen.head.title.element.innerHTML = "Examen creado";
    evalScreen.btnCont.send.element.innerHTML = "Calificar";
    evalScreen.btnCont.results.element.innerHTML = "Ver resultados";


    for (let ques in actualTest.questions) {
      if (actualTest.questions[ques].type == "multiple"){
        //creating the question object
        evalScreen.qCont[ques] = {};
        //ask for and set this question model
        let model = Question.answerModel(actualTest.questions[ques].type);
        let fullModel = webQuiz.htFiller(model);
        fullModel.fieldset.heading.legend.element.innerHTML = `${ques} - ¿ ${actualTest.questions[ques].caption} ?`;

        //ask and set each option and update fullModel object after the setting
        for (let option in actualTest.questions[ques].options) {
          let qModel = Question.answerModel(actualTest.questions[ques].type, "option");
          let fullQ = webQuiz.htFiller(qModel);
          fullModel.fieldset.list[option] = {};

          //Setting stuff
          fullQ.item.input.element.setAttribute("id",`${ques}-${option}`);
          fullQ.item.input.element.setAttribute("name",`rta${ques}`);
          fullQ.item.label.element.setAttribute("for",`${ques}-${option}`);
          fullQ.item.label.element.innerHTML = `${option}) ${actualTest.questions[ques].options[option]}`;

          //updating
          fullModel.fieldset.list[option] = fullQ.item;
        }

        //updating main Father 
        evalScreen.qCont[ques] = fullModel.fieldset;
      } else if (actualTest.questions[ques].type == "complete") {
        //codigo para completación
        evalScreen.qCont[ques] = {};
      }
      else if (actualTest.questions[ques].type == "fov") {
        //codigo para falso o verdadero
        evalScreen.qCont[ques] = {};
      }
      else {
        //codigo por si nada sirve
      }
    }

    //update and print the whole new screen
    evalSession.htStructure = evalScreen;
    console.log("printed: ", evalSession.htStructure);
    webQuiz.htPrinter(evalScreen, body);
    webQuiz.binder(evalScreen.btnCont.send.element, "click", evalSession.evaluate);
    webQuiz.binder(evalScreen.btnCont.results.element, "click", resultsFrame.setResults);
  },
  binder: function(element, ev, func){
    //takes an html element, the event as string and a function to bind to it
    element.addEventListener(ev, func);
  }
}