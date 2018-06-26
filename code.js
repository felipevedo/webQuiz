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
class Test {
  constructor() {
    this.questionCount = 0;
    this.currentQuestion = 1;
    this.questions = {};
    this.nextQuestion = function(){
      //##################### Esta funcion debe: ###################################
      // - Guardar todos los datos relevantes de la pregunta que se acaba de crear
      // -Validar o crear otro metodo para validar todos los valores antes de guardar
      // -Llamar a otra que guarde, para que esa pueda ser llamada por listo tambien
      //- Esa otra debe actuar segun el tipo de pregunta y asi guardar, por ahora
      // solo estamos guardando las de tipo multiple
      //############################################################################
      //opcional mientras las convierto en promesas
      if (form.fetchQuestion()) {
        //update important values
        actualTest.currentQuestion++;
        webQuiz.showCD();
        form.editOptions.innerHTML = "";
        form.qCaption.value = "";
        form.qType.value = "empty";
        form.genOpts = {};
      }
      else {
        alert("can't go on to the next question");
      }
    };
  }
}
class Question {
  constructor() {
    this.options = {};
    this.correct = 0;
    this.caption = "";
    this.type = "";
  }
  static optionEditModel(type) {
    //console.log("tipo de pregunta: ", type);
    let multipleModel = {
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
      return multipleModel;
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
}
var form = {
    optNumber: document.getElementById("option-number"),
    qType: document.getElementById("question-type"),
    editOptions: document.getElementById("edit-options"),
    qCaption: document.getElementById("question-caption"),
    nextBtn: document.getElementById("next-question"),
    countDisplay: document.getElementById('question-count'),
    finBtn: document.getElementById("finished-test"),
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
            if(elements[i].type == "radio") {
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
          ///console.log("Aceptado con exception: ", returnObj);
          returnObj.exception = true;
          fulfill(returnObj);
        }else {
          //console.log("rechazada: ", returnObj);
          reject(returnObj);
        }
      });
    },
    structure:document.getElementById("form"),
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
        cleanClass(form.structure, St.required);
        actualTest.currentQuestion++;
        webQuiz.showCD();
        form.editOptions.innerHTML = "";
        form.qCaption.value = "";
        form.qType.value = "empty";
        form.genOpts = {};
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
        let d = document.body;
        let ht = "";
        d.innerHTML = "";
        ht = "<h1>Examen creado</h1>";
        for (let ques in actualTest.questions) {
          ht += `<fieldset><h2><legend>${ques} - ¿ ${actualTest.questions[ques].caption} ?</legend></h2>`
          ht += `<ul>`;
          for (let option in actualTest.questions[ques].options) {
            // ht += '<li><input type="radio" id="' + option +'" name="rta' + ques +
            ht += `<li><input type="radio" id="${ques}-${option}" name="rta${ques}"/><label for="${ques}-${option}">${option})${actualTest.questions[ques].options[option]}</label></li>`;
          }
          ht += `</fieldset></ul>`;
          d.innerHTML = ht;
        }
        console.log("test finiquitado ",actualTest);
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
        console.log("form.genOpts: ", form.genOpts);
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
