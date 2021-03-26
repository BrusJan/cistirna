/* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */
function menuSwitch() {
  console.info('menu click');
  var x = document.getElementById("mainMenu");
  if (x.className === "menu") {
    x.className += " responsive";
  } else {
    x.className = "menu";
  }
} 

function gotoObjednat() {
  document.getElementById("form-order").style.maxHeight = "50em";
  document.getElementById("cf-close").style.display = "block";
  document.getElementById("cf-open").style.display = "none";
  document.getElementById("cf-panel").scrollIntoView();
  return false;
}

/** OBJEDNAVKOVY FORMULAR **/
function openForm() {
  document.getElementById("form-order").style.maxHeight = "50em";
  document.getElementById("cf-close").style.display = "block";
  document.getElementById("cf-open").style.display = "none";
  return false;
}
function closeForm() {
  document.getElementById("form-order").style.maxHeight = "0";
  document.getElementById("cf-close").style.display = "none";
  document.getElementById("cf-open").style.display = "block";
  return false;
}


function sendEmail() {
  // validation
  if (!form.email.validity.valid) {
    document.getElementById("mailResponseText").innerHTML = "Prosím vyplňte Váš e-mail";
    return;
  }
  if (!form.phone.validity.valid) {
    document.getElementById("mailResponseText").innerHTML = "Prosím vyplňte Váš telefon";
    return;
  }
  if (!form.order.validity.valid) {
    document.getElementById("mailResponseText").innerHTML = "Prosím popište co bude potřeba.";
    return;
  }

  document.getElementById("btn-send-email").disabled = true;
  const XHR = new XMLHttpRequest();

    // Bind the FormData object and the form element
    const FD = new FormData( form );

    XHR.onreadystatechange = function(event) { // Call a function when the state changes.
    console.info('response: ' + this.responseText + ', status: ' + this.status + ', readyState: ' + this.readyState);
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        var response = JSON.parse(this.responseText);
        document.getElementById("mailResponseText").innerHTML = response.message;
        document.getElementById("btn-send-email").disabled = true;
      } else if (this.status > 0) {        
        document.getElementById("mailResponseText").innerHTML = "Cyba serveru " + this.status;
        document.getElementById("btn-send-email").disabled = false;
      } else {
        document.getElementById("mailResponseText").innerHTML = "Zasílám objednávku...";
      }
    }

    // Set up our request
    XHR.open( "POST", "emailHandler.php" );

    // The data sent is what the user provided in the form
    try {
      XHR.send( FD );
    } catch (err) {
      document.getElementById("mailResponseText").innerHTML = err;
      document.getElementById("btn-send-email").disabled = false;
    }
}
// Access the form element...
  const form = document.getElementById("form-order");
  // ...and take over its submit event.
  form.addEventListener( "submit", function ( event ) {
    event.preventDefault();
    sendEmail();
  } );

/** end OBJEDNAVKOVY FORMULAR **/

var result;
var filterPrimaryOptions = [];
var filterSecondaryOptions = [];
var filterPrimary = [];
var filterSecondary = [];
var partsListOriginal = [];
var partsListFiltered = [];
var partsSelected = [];
var searchInput = "";

function partTemplate(part) {
  var imgSrc = part["Obrázek"];
  if (!imgSrc || imgSrc.length <= 0) imgSrc = "unknown.png";
  var selectedClass = "";
  var inputValue = "";
  var selectedPart = partsSelected.find((p) => p.id === part["id"]);
  if (selectedPart) {
    selectedClass = " piece-selected";
    inputValue = selectedPart.count;
  }
  return `
  <div class="piece${selectedClass}">
      <span class="title">${part["Zboží"]}</span>
    <img src="img/${imgSrc}" alt="${part["Zboží"]}">
    <span class="price">${part["Cena"]} Kč</span>
    <div class="selection">
      <div class="selection-inner">
        <button class="outline" onclick="removePart('${part["id"]}')">-</button>
        <input type="number" onchange="inputChanged('${part["id"]}')" id="${part["id"]}" value="${inputValue}">
        <button class="outline" onclick=\"addPart('${part["id"]}')">+</button>
      </div>
    </div>
  </div>`;
}
function filterPrimaryOptionTemplate(option) {
  return `
    <input type="checkbox" id="filter-prim-${option}" name="${option}" value="${option}" onclick="doFilterPrimary('${option}', this)">
    <label class="chb-filter-primary" for="filter-prim-${option}">${option}</label>
  `;
}
function filterSecondaryOptionTemplate(option) {
  return `
    <input type="checkbox" id="filter-sec-${option}" name="${option}" value="${option}" onclick="doFilterSecondary('${option}', this)">
    <label class="chb-filter-secondary" for="filter-sec-${option}">${option}</label>
  `;
}

window.onload = () => {
  if (localStorage.getItem("cookies-consent-given") == 1) {
    document.getElementById("cookie-consent").style.top = "-120px";
  } else {
    document.getElementById("cookie-consent").style.transition =
      "top 0.2s ease-out";
  }

  var xhttp = new XMLHttpRequest();
  xhttp.open("GET", "cenik.json", true);
  xhttp.onreadystatechange = function (req, e) {
    if (req.readyState == 4 && req.status == 200) {
      // load cenik here
      partsListOriginal = JSON.parse(xhttp.responseText);
      partsListOriginal = partsListOriginal.List1; // vytahni prvky z listu
      partsListFiltered = partsListOriginal;

      // load objects and filter
      var container = document.getElementById("container");
      if (container) {
        container.innerHTML = `${partsListFiltered.map(partTemplate).join("")}`;
      }

      partsListOriginal.forEach((part) => {
        filterPrimaryOptions.indexOf(part["Druh Čistění/Opravy"]) === -1 &&
          filterPrimaryOptions.push(part["Druh Čistění/Opravy"]);
        filterSecondaryOptions.indexOf(part["Druh oděvu"]) === -1 &&
          filterSecondaryOptions.push(part["Druh oděvu"]);
      });

      var filterPrimaryDiv = document.getElementById("filter-primary");
      if (filterPrimaryDiv) {
        filterPrimaryDiv.innerHTML = `${filterPrimaryOptions
          .map(filterPrimaryOptionTemplate)
          .join("")}`;
      }
      var filterSecondaryDiv = document.getElementById("filter-secondary");
      if (filterSecondaryDiv) {
        filterSecondaryDiv.innerHTML = `${filterSecondaryOptions
          .map(filterSecondaryOptionTemplate)
          .join("")}`;
      }
    }
  }.bind(this, xhttp);
  xhttp.send();
};

function doFilterPrimary(value, checkbox) {
  if (checkbox.checked) {
    filterPrimary.indexOf(value) !== 1 && filterPrimary.push(value);
  } else {
    filterPrimary.splice(filterPrimary.indexOf(value), 1);
  }
  applyFilters();
}
function doFilterSecondary(value, checkbox) {
  if (checkbox.checked) {
    filterSecondary.indexOf(value) !== 1 && filterSecondary.push(value);
  } else {
    filterSecondary.splice(filterSecondary.indexOf(value), 1);
  }
  applyFilters();
}

function searchInputChanged(str) {
  searchInput = str.toLowerCase();
  applyFilters();
}

function applyFilters() {
  partsListFiltered = [];
  partsListOriginal.forEach((part) => {
    if (
      filterPrimary.length <= 0 ||
      filterPrimary.includes(part["Druh Čistění/Opravy"])
    ) {
      if (
        filterSecondary.length <= 0 ||
        filterSecondary.includes(part["Druh oděvu"])
      ) {
        if (part["Zboží"].toLowerCase().includes(searchInput))
          partsListFiltered.push(part);
      }
    }
  });
  var container = document.getElementById("container");
  if (container) {
    container.innerHTML = `${partsListFiltered.map(partTemplate).join("")}`;
  }
}

function printResult() {
  var p = document.getElementById("result");
  var prettyString = "";
  var sum = 0;
  partsSelected.forEach((part) => {
    prettyString += part.Zboží + " " + part.count + "ks<br>";
    sum += part.count * part.Cena;
  });
  prettyString += "<hr>Celkem: " + sum + "Kč";
  p.innerHTML = prettyString;
}

function addPart(id) {
  var input = document.getElementById(id);
  var selectedPart = partsSelected.find((p) => p.id === id);
  if (selectedPart) {
    selectedPart.count = selectedPart.count + 1;
    input.value = selectedPart.count;
  } else {
    var partToAdd = partsListOriginal.find((p) => p.id === id);
    partToAdd.count = 1;
    partsSelected.push(partToAdd);
    input.value = partToAdd.count;
  }
  printResult();
}

function removePart(id) {
  var input = document.getElementById(id);
  var selectedPart = partsSelected.find((p) => p.id === id);
  if (selectedPart) {
    selectedPart.count = selectedPart.count - 1;
    if (selectedPart.count <= 0) {
      partsSelected.splice(partsSelected.indexOf(selectedPart), 1);
      input.value = "";
    } else input.value = selectedPart.count;
  } else input.value = "";
  printResult();
}

function inputChanged(id) {
  var input = document.getElementById(id);
  var selectedPart = partsSelected.find((p) => p.id === id);
  if (input.value === "" && selectedPart)
    partsSelected.splice(partsSelected.indexOf(selectedPart), 1);
  if (input.value < 0) input.value = 0;

  if (selectedPart) {
    selectedPart.count = +input.value;
  } else {
    var partToAdd = partsListOriginal.find((p) => p.id === id);
    partToAdd.count = +input.value;
    partsSelected.push(partToAdd);
  }
  printResult();
}

function hideConsent() {
  var consentDiv = document.getElementById("cookie-consent");
  consentDiv.style.top = "-120px";
  localStorage.setItem("cookies-consent-given", 1);
}
