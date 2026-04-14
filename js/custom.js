/*
Custom script
This file will not be overwritten by the updater
*/

// JavaScript code
function search_animal() {
  let input = document.getElementById("searchbar").value;
  input = input.toLowerCase();
  let x = document.getElementsByClassName("animals");

  for (i = 0; i < x.length; i++) {
    if (!x[i].innerHTML.toLowerCase().includes(input)) {
      x[i].style.display = "none";
    } else {
      x[i].style.display = "block";
    }
  }
}

// Logic: Show overlay IMMEDIATELY on page load
window.addEventListener('load', function () {
    const overlay = document.getElementById('tinyPromoOverlay');
    if (overlay) {
        overlay.style.display = 'flex';
    }
});