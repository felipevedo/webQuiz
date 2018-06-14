//##################### Fixes: ###################################
// -Escupir HTML semántico con la funcion "listo"
// -El metodo assess() en Evaluate
//############################################################################

//Data modeling
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
  }
}
class Evaluate {
  //I want to turn this into a promise
  static validateReq() {
      if (mainAppObj.definedType.value !== "empty" &&
          mainAppObj.qCaption.value !== "" &&
          Evaluate.checkAnyRadio(mainAppObj.genOpts))
          { return true; }
      else { return false; }
  }
  static checkAnyRadio(elementsObj) {
    let any = false;
    for (let optElements in elementsObj) {
      if (elementsObj[optElements].radio.checked) {
        any = true;
      }
    }
    return any;
  }
}
let mainAppObj = {
  answerOptNum: 4,
  definedType: document.getElementById("question-type"),
  countDisplay: document.getElementById('question-count'),
  editOptions: document.getElementById("edit-options"),
  qCaption: document.getElementById("question-caption"),
  nextBtn: document.getElementById("next-question"),
  finBtn: document.getElementById("finished-test"),
  genOpts: {},
  nextQuestion: function(){
    //##################### Esta funcion debe: ###################################
    // - Guardar todos los datos relevantes de la pregunta que se acaba de crear
    // -Validar o crear otro metodo para validar todos los valores antes de guardar
    // -Llamar a otra que guarde, para que es pueda ser llamada por listo tambien
    //- Esa otra debe actuar segun el tipo de pregunta y asi guardar, por ahora
    // solo estamos guardando las de tipo multiple
    //############################################################################
    if (Evaluate.validateReq()) {
      actualTest.questions[actualTest.currentQuestion] = new Question;
      //update question type
      actualTest.questions[actualTest.currentQuestion].type = this.definedType.value;
      //update question enunciate
      actualTest.questions[actualTest.currentQuestion].caption = this.qCaption.value;
      //iterate to update some properties
      for (let opt in this.genOpts) {
        //update options
        actualTest.questions[actualTest.currentQuestion].options[opt] = this.genOpts[opt].text.value;
        //check correct answer
        if (this.genOpts[opt].radio.checked) {
          //update correct answer
          actualTest.questions[actualTest.currentQuestion].correct = this.genOpts[opt].radio.value;
        }
      }

      //update important values
      console.log("Question saved! ", actualTest.questions);
      actualTest.questionCount++;
      actualTest.currentQuestion++;
      this.showCD();
      this.editOptions.innerHTML = "";
      this.definedType.value = "empty";
    }
    else {
      alert("some fields are empty, we can't create a test without them");
    }
  },
  selectedType: function() {
    //actuar segun el tipo seleccionado, por ahora solo unica respuesta
    if (mainAppObj.definedType.value == "multiple") {
      mainAppObj.genMultiple();
    }
    else if (mainAppObj.definedType.value == "complete") {
      //codigo para completación
      mainAppObj.editOptions.innerHTML = "Has seleccionado: " + mainAppObj.definedType.value;
    }
    else if (mainAppObj.definedType.value == "fov") {
      //codigo para falso o verdadero
      mainAppObj.editOptions.innerHTML = mainAppObj.editOptions.innerHTML = "Has seleccionado: " + mainAppObj.definedType.value;
    }
    else {
      mainAppObj.editOptions.innerHTML = "";
    }
  },
  showCD: function() {
    this.countDisplay.innerHTML = `Pregunta ${actualTest.currentQuestion}/${actualTest.questionCount}`;
  },
  genMultiple: function() {

    this.editOptions.innerHTML = "";
    this.genOpts.legend = document.createElement("legend");
    this.genOpts.legend.innerHTML = "Check the right answer";
    this.editOptions.appendChild(this.genOpts.legend);
    //para los radios
    for (let i = 1; i <= mainAppObj.answerOptNum; i++) {
      //debo primero saber como detectar la correcta
      this.genOpts[i] = {};
      this.genOpts[i].radio = document.createElement("input");
      this.genOpts[i].radio.setAttribute("id", `radio${i}`);
      this.genOpts[i].radio.setAttribute("type","radio");
      this.genOpts[i].radio.setAttribute("name","correct");
      //aguantaria poner como value el texto de la respuesta ingresado
      this.genOpts[i].radio.setAttribute("value",`${i}`);

      this.genOpts[i].text = document.createElement("input");
      this.genOpts[i].text.setAttribute("id", `text${i}`);
      this.genOpts[i].text.setAttribute("type","text");
      this.genOpts[i].text.value = "defaultr " + i;


      this.genOpts[i].row = document.createElement("div");
      this.genOpts[i].row.setAttribute("class", "answer-row");

      this.genOpts[i].label = document.createElement("label");
      this.genOpts[i].label.setAttribute("for", `radio${i}`);
      this.genOpts[i].label.innerHTML = i + ") ";

      this.genOpts[i].row.appendChild(this.genOpts[i].label);
      this.genOpts[i].row.appendChild(this.genOpts[i].radio);
      this.genOpts[i].row.appendChild(this.genOpts[i].text);

      this.editOptions.appendChild(this.genOpts[i].row);
    }
    console.log("genOpts: ", this.genOpts);
  },
  finished: function(){
    if (actualTest.questionCount > 0) {
      let d = document.body;
      d.innerHTML = `Estamos a punto de cambiar el mundo</br>
      <p>${actualTest.questions[1].caption}</p>
      <ul>
      <li>${actualTest.questions[1].options[1]}</li>
      <li>${actualTest.questions[1].options[2]}</li>
      <li>${actualTest.questions[1].options[3]}</li>
      <li>${actualTest.questions[1].options[4]}</li>
      </ul>`;
    }
    else {
      alert("You haven't created any questions");
    }

  }
};
let actualTest = new Test;

//Show initial question count
mainAppObj.showCD();

//add listeners
mainAppObj.definedType.addEventListener("change", mainAppObj.selectedType);
mainAppObj.nextBtn.addEventListener("click", mainAppObj.nextQuestion.bind(mainAppObj));
mainAppObj.finBtn.addEventListener("click", mainAppObj.finished);
