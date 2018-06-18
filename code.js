//##################### Fixes: ###################################
// 1-Escupir HTML semántico con la funcion "listo"
// 2-El metodo assess() en Test o por cada pregunta
// 3-El metodo checkAnyRadio tiene dificultades cuando no se le pasa exactamente
// un objeto que conentga claves y sus valores sean elementos html
// 4-se puede usar un objeto parecido a genOpts para generar las opciones de
// respuesta en lo multiple
//5- crear objeto css con todas las clases que vamos a usar para pasarlas
//concatenadas dentro de la string que crea el layout html y que asi
// se actualicen solas, puedo crear un metodo tambien
// que me cree el texto del css usando este objeto
// 6-que las funcionalidades de validacion sean de la propia pregunta
//7- otra idea es crear una superClase donde esten todos los elementos que
// yo necesite y desde esa ir llamandolos para que se creen segun otro objeto que yo
//cree con la estructura deseada
/*var layout = {
  div: {
    ul: {
      li: {
        class: "tal"
      },
      li: {
        class: "tal"
      },
      li: {
        class: "tal"
      },
    },
    footer: "create"
  }*/
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
  //I want to turn this into a promise (validateReq)
  //hacerlo mas  general
  //que se pueda llamar tambien cuando se este respondiendo
  //no esta validando que las opciones esten llenass
  static validateReq() {
    //el metodo tendria que permitir mostrar visualmente cuales faltan, o decirlo en el alert
    // Una forma de acceder por alla, otra seria creando el objeto form con todo lo relevantes
    // y actualizandolo al crear las opciones y pasandolo por parametro cuando se necesite buscar
    //algo en el
    //console.log("buscando: ", mainAppObj.form.children[2].children[0].querySelector("input"));
    //true if at least one field is empty
      if (mainAppObj.definedType.value !== "empty" &&
          mainAppObj.qCaption.value !== "" &&
          Evaluate.checkAnyRadio(mainAppObj.genOpts))
          { return true; }
      //true if all fields are empty and there is at least 1 question created
      else if (mainAppObj.definedType.value == "empty" &&
          mainAppObj.qCaption.value == "" &&
          !Evaluate.checkAnyRadio(mainAppObj.genOpts) &&
        actualTest.questionCount > 0) {
        return false;
      } else {
        alert("some fields are empty, please fill them");
        return false;
      }
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
  answerOptNum: document.getElementById("option-number"),
  form: document.getElementById("form"),
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
    // -Llamar a otra que guarde, para que esa pueda ser llamada por listo tambien
    //- Esa otra debe actuar segun el tipo de pregunta y asi guardar, por ahora
    // solo estamos guardando las de tipo multiple
    //############################################################################
    //opcional mientras las convierto en promesas
    if (this.fetchQuestion()) {
      //update important values
      actualTest.currentQuestion++;
      this.showCD();
      this.editOptions.innerHTML = "";
      this.qCaption.value = "";
      this.definedType.value = "empty";
      this.genOpts = {};
    }
    else {
      alert("can't go on to the next question");
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
    this.genOpts = {};

    for (let i = 1; i <= mainAppObj.answerOptNum.value; i++) {
      this.genOpts[i] = {};
      this.genOpts[i].radio = document.createElement("input");
      this.genOpts[i].radio.setAttribute("type","radio");
      this.genOpts[i].radio.setAttribute("name","correct");
      //aguantaria poner como value el texto de la respuesta ingresado
      this.genOpts[i].radio.setAttribute("value",`${i}`);

      this.genOpts[i].text = document.createElement("input");
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
    //llamada a la funcion guardar
    this.fetchQuestion();
    //si no se guardo bien la pregunta, no deberia mostrar el examen.
    // actualizar finalmente los conteos
    // crear funcion de despliegue de preguntas creadas
    // con base en un modelo de datos que especifique la  jerarquia y
    // los elementos a utilizar
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
    }
    else {
      alert("You haven't created any questions");
    }
  },
  fetchQuestion: function() {
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
      console.log("Question saved! ", actualTest.questions[actualTest.currentQuestion]);
      actualTest.questionCount++;
      return true;
    }
  }
};
let actualTest = new Test;

//Show initial question count
mainAppObj.showCD();

//add listeners
mainAppObj.definedType.addEventListener("change", mainAppObj.selectedType);
mainAppObj.answerOptNum.addEventListener("change", mainAppObj.selectedType);
mainAppObj.nextBtn.addEventListener("click", mainAppObj.nextQuestion.bind(mainAppObj));
mainAppObj.finBtn.addEventListener("click", mainAppObj.finished.bind(mainAppObj));
