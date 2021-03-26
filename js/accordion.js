var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    disableOthers(this);
    switchPanelState(this);
  });
}
function switchPanelState(accItem) {
    accItem.classList.toggle("active");
    var panel = accItem.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
}
function disableOthers(panel) {
    for (i = 0; i < acc.length; i++) {
        if (acc[i] === panel) continue;
        if (acc[i].classList.contains("active")) {
            switchPanelState(acc[i]);
        }
    }
}