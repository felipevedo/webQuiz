class Test {
  constructor() {
    this.questionCount = 0;
    this.currentQuestion = 1;
    this.questions = {};
    this.scaleRange = {min:0, max:5};
  }
}
class Question {
  constructor() {
    this.options = {};
    this.correct = 0;
    this.caption = "";
    this.type = "";
    this.assess = function(answerObj, question){
      let answers = answerObj.answers;
      //console.log("assessing question: ", question);
      if (this.type == "multiple") 
      {
        let result;
        if (answers[question].chosen == this.correct) 
        { 
          result = true;
        }
        else {
          result = false;
        }        
        return result;
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
let actualTest = new Test;
//Show initial question count
webQuiz.showCD();

//add listeners
form.qType.addEventListener("change", form.selectedType);
form.optNumber.addEventListener("change", form.selectedType);
form.nextBtn.addEventListener("click", form.nextQuestion);
form.finBtn.addEventListener("click", form.finished);
