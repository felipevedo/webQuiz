//##################### Fixes: ###################################
// 2-El metodo assess() en Test o por cada pregunta
// 3-El metodo checkAnyRadio tiene dificultades cuando no se le pasa exactamente
// un objeto que conentga claves y sus valores sean elementos html
// 6-que las funcionalidades de validacion sean de la propia pregunta
//7- otra idea es crear una superClase donde esten todos los elementos que
// yo necesite y desde esa ir llamandolos para que se creen segun otro objeto que yo
//cree con la estructura deseada
  // la otra opcion es algo parecido a lo que hago con genOpts pero mas escalable,
  //############################################################################
//Data modeling
//crear mejor el objeto formulario y ahi guardar todos estos
//elementos html relacionados y pasarlo por parametro en las funciones
//se pasarian los metodos de evaluacion de requerimientos a este
//1-el objeto deberia dar cuenta de su estructura html como genOpts
//que lo hace por cada pregunta. Y actualizarse cada que se crea o elimina algo en el
var evalSession = {
  //donde se guardaran las respuestas a un examen.
  //debería haber una forma de relacionar la estructura
  //con un test en particular
  structureModel: {
    head:{
      tag: "header",
      title: 
        {
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
      }
    }
  },
  htStructure: {},
  testAnswers: {
    testName: "",
    answers: {}
  },
  evaluate: function() {
      evalSession.fetchAnswers().then((message)=>{
        for(let ques in actualTest.questions){
          actualTest.questions[ques].assess(evalSession,ques);
        }
      },
      (message)=> console.log("evaluate says: ", message));  
  },
  fetchAnswers: function(){
    return new Promise(function(fulfill,reject){
      form.validateReq(evalSession.htStructure.qCont.element).then(function(message){
        console.log("fetchVal fulfilled: ", message);
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
        reject(message);
      });
    });
  }
}
class Test {
  constructor() {
    this.questionCount = 0;
    this.currentQuestion = 1;
    this.questions = {};
  }
}
class Question {
  constructor() {
    this.options = {};
    this.correct = 0;
    this.caption = "";
    this.type = "";
    this.assess = function(session, question){
      let answers = session.testAnswers.answers;
      console.log("assessing question: ", question);
      if (this.type == "multiple") 
      {
        for (let ans in answers) {
          if (answers[ans].chosen == this.correct) 
          {
            return console.log("yeah right!");
          }
          else {
            return console.log("WRONG");
          }        
        }
      }
    }
  }
  static optionEditModel(type) {
    //console.log("tipo de pregunta: ", type);
    let multiple = {
      row: {
        tag: "div",
        class: St["answer-row"],
        label: {
          tag: "label",
          for: "defFor"
        },
        radio: {
          tag: "input",
          type: "radio",
          name: "correct",
          value: "",
          required: ""
        },
        text: {
          tag: "input",
          type: "text",
          required: ""
        }
      }
    }

    if (type == "multiple") {
      return multiple;
    }
  }
  static answerModel(type, query) {
    let multiple = {
      model: {
        fieldset: {
          tag: "fieldset",
          heading: {
            tag: "h2",
            legend: {
              tag: "legend"
            }
          },
          list: {
            tag: "ul",
          }
        }
      },
      option: {
        item: {
              tag: "li",
              input: {
                tag: "input",
                type: "radio",
                required: ""
              },
              label: {
                tag: "label"
              }
            }
      }
    }
    //console.log("tipo de rta: ", type);

    if (type == "multiple" && query == undefined) {
      return multiple.model; 
    } else if (type == "multiple" && query == "option") {
      return multiple.option;
    }
  }
}
var webQuiz = {
  htFiller: function(model, htModel= {}, propName){
      //recive un objeto con la estructura de html en propiedades
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
      //recive un objeto con la estructura de html en propiedades
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
    evalScreen.head.title.element.innerHTML = "<h1>Examen creado</h1>";
    evalScreen.btnCont.send.element.innerHTML = "Enviar";


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
    webQuiz.binder(evalScreen.btnCont.send.element, "click",evalSession.evaluate);
  },
  binder: function(element, ev, func){
    //takes an html element, the event as string and a function to bind to it
    element.addEventListener(ev, func);
  }
}
var form = {
    optNumber: document.getElementById("option-number"),
    qType: document.getElementById("question-type"),
    editOptions: document.getElementById("edit-options"),
    qCaption: document.getElementById("question-caption"),
    nextBtn: document.getElementById("next-question"),
    countDisplay: document.getElementById('question-count'),
    finBtn: document.getElementById("finished-test"),
    structure:document.getElementById("form"),
    validateReq: function(myForm) {
      return new Promise(function(fulfill, reject) {
        //falta agregar la condicion de que se haya creado al menos una pregunta
        let returnObj = {
          elements: {},
          text: "",
          exception: false
        };
        let accumulator = [];
        let elements = myForm.querySelectorAll("[required]");
        let radioGroup = {};
        //console.log("required elements: ", elements);
        for (let i = 0; i < elements.length; i++) {
            if(elements[i].type == "radio" /*agregar verificacion de name y agruparlos asi*/) {
                radioGroup[i] = elements[i];
            }
            if (elements[i].value == "") {
                returnObj.elements[i] = elements[i];
                returnObj.text = "there is an input you have to fill with text,";
                accumulator.push(false);       
          } else {
            accumulator.push(true); 
          }
        }
        if (form.anyRadio(radioGroup)) {
          accumulator.push(true);
        } else {
          //enviar un objeto padre por ejemplo el edit options
          returnObj.elements["radio"] = form.editOptions;
          returnObj.text += " Which is the right answer?";
          accumulator.push(false);
        }
        //final check to resolve promise
        //console.log("accumulator: ", accumulator);
        if (accumulator.every((bool)=> bool)) 
        {
          //console.log("Aceptado: ", returnObj);
          fulfill(returnObj);
        } else if (accumulator.every((bool)=> bool == false)){
          //console.log("Aceptado con exception: ", returnObj);
          returnObj.exception = true;
          fulfill(returnObj);
        }else {
          //console.log("rechazada: ", returnObj);
          reject(returnObj);
        }
      });
    },
    nextQuestion: function(){
      //##################### Esta funcion debe: ###################################
      // - Guardar todos los datos relevantes de la pregunta que se acaba de crear
      // -Validar o crear otro metodo para validar todos los valores antes de guardar
      // -Llamar a otra que guarde, para que esa pueda ser llamada por listo tambien
      //- Esa otra debe actuar segun el tipo de pregunta y asi guardar, por ahora
      // solo estamos guardando las de tipo multiple
      //############################################################################
      //opcional mientras las convierto en promesas
      form.fetchQuestion().then(function(message){
        //update important values
        //llamada a funcion para remover bordes rojos 
        if (message.exception == false) {
        cleanClass(form.structure, St.required);
        actualTest.currentQuestion++;
        webQuiz.showCD();
        form.editOptions.innerHTML = "";
        form.qCaption.value = "";
        form.qType.value = "";
        form.genOpts = {};
        }
      }, function(message){
          //console.log("fetchQuestion rechazada: ", message);
          alert("can't go  to next question: " + message.text);
          cleanClass(form.structure, St.required);
          for(let el in message.elements){
            message.elements[el].classList.add(St.required);          
          }
      }); 
    },
    selectedType: function() {
        //llama a set options y esta llama a los modelos pasando el tipo de opciones
        //que necesita crear y asimismo segun el tipo, las setea.
        form.setOptions(form.qType.value, Question.optionEditModel(form.qType.value));
    },
    finished: function(){
      //si no se guardo bien la pregunta, no deberia mostrar el examen.
      // actualizar finalmente los conteos
      // crear funcion de despliegue de preguntas creadas
      // con base en un modelo de datos que especifique la  jerarquia y
      // los elementos a utilizar
      //llamada a la funcion guardar
      form.fetchQuestion().then(function(message){
        if (actualTest.questionCount > 0) {
          console.log("test finiquitado ",actualTest);
          webQuiz.setAnswers();
        } else {
          alert("You haven't created any questions");
        }
      }, function(message){
        alert("can't save Test: " + message.text);
        cleanClass(form.structure, St.required);
          for(let el in message.elements){
            message.elements[el].classList.add(St.required);          
          }
      });  
    },
    fetchQuestion: function() {
      //only works for one type of question
      return new Promise(function(fulfill, reject){
          form.validateReq(form.structure).then(function(message){
            if (message.exception == false) {
              actualTest.questions[actualTest.currentQuestion] = new Question;
              //update question type
              actualTest.questions[actualTest.currentQuestion].type = form.qType.value;
              //update question enunciate
              actualTest.questions[actualTest.currentQuestion].caption = form.qCaption.value;
              //iterate to update some properties
              for (let opt in form.genOpts) {
                //update options
                actualTest.questions[actualTest.currentQuestion].options[opt] = form.genOpts[opt].row.text.element.value;
                //check correct answer
                if (form.genOpts[opt].row.radio.element.checked) {
                  //update correct answer
                  actualTest.questions[actualTest.currentQuestion].correct = form.genOpts[opt].row.radio.element.value;
                }
              }
              //agregar esto al objeto mensaje
              console.log("Question saved! ", actualTest.questions[actualTest.currentQuestion]);
              actualTest.questionCount++;
              fulfill(message);
            } else {
              message.text = "No info to fetch";
              fulfill(message);
            }
        }, function(message){
          //console.log("corre rechazo validateReq:", message.text);
          reject(message);
       });

      });   
    },
    setOptions: function(kind, model) {
      if (kind == "multiple") 
      {
        let genObj = {};
        form.editOptions.innerHTML = "";

        for (let i = 1; i <= form.optNumber.value; i++) {

          let fullModel = webQuiz.htFiller(model);

          fullModel.row.radio.element.setAttribute("value",`${i}`);
          fullModel.row.radio.element.setAttribute("id",`radio${i}`);
          fullModel.row.text.element.value = "defaultr " + i;
          fullModel.row.label.element.setAttribute("for", `radio${i}`);
          fullModel.row.label.element.innerHTML = i + ") ";

          genObj[i] = fullModel;

          webQuiz.htPrinter(genObj[i], form.editOptions);
        }
        form.genOpts = genObj;
       // console.log("form.genOpts: ", form.genOpts);
      }
      else if (kind == "complete") {
          //codigo para completación
          form.editOptions.innerHTML = "Has seleccionado: " + form.qType.value;
      }
      else if (kind == "fov") {
          //codigo para falso o verdadero
         form.editOptions.innerHTML = "Has seleccionado: " + form.qType.value;
      }
      else {
          form.editOptions.innerHTML = "";
      }
    },
    anyRadio: function(elementsObj) {
      /*crear iteracion por names y que  busque en any pero en cada uno de ellos*/
      let any = false;
      for (let optElements in elementsObj) {
        if (elementsObj[optElements].checked) {
          any = true;
        }
      }
      return any;
    }
}

let actualTest = new Test;
//Show initial question count
webQuiz.showCD();

//add listeners
form.qType.addEventListener("change", form.selectedType);
form.optNumber.addEventListener("change", form.selectedType);
form.nextBtn.addEventListener("click", form.nextQuestion);
form.finBtn.addEventListener("click", form.finished);
