
var St = {
		"editor-field": "editor-field",
		"edit-answers": "edit-answers",
		"answer-row" :"answer-row",
		required: "required"
	};

function generateDocument() {
		var doc = "";
		for (let key in St) {
			doc += "." + St[key] + " { }";
		}
		return doc;
	}

//takes element and a class to explore it and remove it
function cleanClass(elGroup,cssClass)
{
	let dirties = elGroup.querySelectorAll("." + cssClass);
    for(let i = 0; i < dirties.length; i++){
        dirties[i].classList.remove(cssClass);           
    }
}
function debugging(){
    alert("empty for now");
}