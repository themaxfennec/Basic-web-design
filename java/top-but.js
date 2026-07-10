// Grab the button element from the page
const btn = document.getElementById("scroll-top-btn");

// Listen for the user scrolling on the page
window.addEventListener("scroll", function () {

  if (window.scrollY > 1) {
    // show the button
    btn.style.display = "block";
  } else {
    // otherwise keep it hidden
    btn.style.display = "none";
  }

});

// When the button is clicked, smoothly scroll back to the top
function scrollToTop() {
  window.scrollTo({
    top: 0,          // top of the page
    behavior: "smooth" // Animate the scroll
  });
}