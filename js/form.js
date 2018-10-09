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
        let currentName = "initial";
        //console.log("required elements: ", elements);
        for (let i = 0; i < elements.length; i++) {
          //handle and check radio elements
            if(elements[i].type == "radio" /*agregar verificacion de name y agruparlos asi*/) {
              //build object with names and their elements group inside
              if (currentName == "initial") {
                radioGroup[elements[i].name] = {};                
                radioGroup[elements[i].name][i] = elements[i];
                currentName = elements[i].name;
              } else if (currentName !== elements[i].name) {
                radioGroup[elements[i].name] = {};                
                radioGroup[elements[i].name][i] = elements[i];
                currentName = elements[i].name;
              } else {
                radioGroup[currentName][i] = elements[i];
                currentName = elements[i].name;
              }
            }
            //validates text inputs
            if (elements[i].value == "") {
                returnObj.elements[i] = elements[i];
                returnObj.text = "there is an input you have to fill with text,";
                accumulator.push(false);       
          } else {
            accumulator.push(true); 
          }
        }
        // another iteration within each name group to check if checked
        for (let name in radioGroup) {
          //call to anyRadio
          if (form.anyRadio(radioGroup[name])) {
              accumulator.push(true);
          } else {
           //enviar un objeto que abarque todos los radios, para el caso grandpa
            let grandpa = myForm.querySelector('[name="'+ name +'"]').parentElement.parentElement;
            //console.log("enviando: ", grandpa);
            returnObj.elements["radio-" + name] = grandpa;
            returnObj.text += " Select an option for: " + name;
            accumulator.push(false);
          }
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
          actualTest.currentQuestion = 1;
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
    anyRadio: function(rGroup) {
      /*gets object containing radios and check if any in that group is checked*/
      let any = false;
      for (let radio in rGroup) {
        if (rGroup[radio].checked) {
          any = true;
        }
      }
      return any;
    }
}