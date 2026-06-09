/* Runs synchronously in <head> — creates the loader before any content renders */
(function () {
  if (document.querySelector('[data-loader]')) return;
  var w = document.createElement('div');
  w.innerHTML =
    '<div class="loader" data-loader>' +
      '<div class="loader-top">' +
        '<div class="l"><span class="dot"></span><span>GSDL — Issue №26</span></div>' +
        '<div class="r"><span>MMXXVI · NAIROBI</span></div>' +
      '</div>' +
      '<div class="loader-center">' +
        '<div class="lr-1"><span>Loading</span></div>' +
        '<div class="lr-2"><span>the field.</span></div>' +
        '<div class="lr-3">Paper · Ink · Method · Co-creation</div>' +
      '</div>' +
      '<div class="loader-bottom">' +
        '<div class="l"><span data-loader-meta>Compositing types</span></div>' +
        '<div class="r">' +
          '<div class="loader-bar"><div class="fill" data-loader-fill></div></div>' +
          '<div class="loader-counter"><span data-loader-counter>000</span></div>' +
        '</div>' +
      '</div>' +
    '</div>';
  document.documentElement.appendChild(w.firstElementChild);
  document.documentElement.classList.add('loader-active');
  document.addEventListener('DOMContentLoaded', function () {
    if (document.body) document.body.classList.add('loader-active');
  });
}());
