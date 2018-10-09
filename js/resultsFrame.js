var resultsFrame = {
  model:{
    head:{
      tag: "header",
      title: {
        tag: "h1",
      }
    },
    percentage: {
      tag: "div",
      class: St.resultContainer+" "+St.percentage,
      txt:{
        tag: "p",
      },
      bar:{
        tag: "progress",
        max: "100",
        value: "0",
      }
    },
    grade: {
      tag: "div",
      class: St.resultContainer,
      textCont: {
        tag:"div",
        class: St.gradeTxtCont,
        txt:{
          tag: "p",
          detail:{
          tag:"small",
          }
        },
      },
      number:{
        tag:"div"
      }
    }
  },
  ht:{},
  setResults: function() {
    console.clear();
    evalSession.evaluate().then(()=>{
      let body = document.body;
      body.innerHTML = "";
      let htFrame = webQuiz.htFiller(resultsFrame.model);

      htFrame.head.title.element.innerHTML = "Resultados";
      htFrame.percentage.txt.element.innerHTML = `respondiste el ${Math.round(evalSession.percentageResult(evalSession.assessed)*100)/100}%
       del examen correctamente`;
     	console.log("valor problematico: ", evalSession.percentageResult(evalSession.assessed))
      htFrame.percentage.bar.element.value = Math.round(evalSession.percentageResult(evalSession.assessed));

      htFrame.grade.textCont.txt.element.innerHTML = "Nota ";
      htFrame.grade.textCont.txt.detail.element.innerHTML = `(Escala de ${actualTest.scaleRange.min} a ${actualTest.scaleRange.max})`;
      htFrame.grade.number.element.innerHTML = Math.round(evalSession.scaleResult(actualTest)*100)/100;

      resultsFrame.ht = htFrame;
      console.log("printed: ", resultsFrame.ht);
      webQuiz.htPrinter(htFrame, body);
    },(message)=> console.log("evaluate says: ", message.text));
  }
}