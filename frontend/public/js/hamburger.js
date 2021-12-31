$(function() {
  hamburgerBtnEventListener();
})

function hamburgerBtnEventListener() {
  let hamburgerOpen = false;
  let hamburgerBtnWrapper = document.getElementById('hamburger-btn-wrap')
  hamburgerBtnWrapper.addEventListener('click', e => {
    console.log('clicked hamburger');
    if(!hamburgerOpen) {
      hamburgerBtnWrapper.classList.add('open');
      hamburgerOpen = true;
      document.getElementById("myNav").style.width = "50%";
      document.getElementById("sidebar-right").style.width = "50%";
      const rightOverlay = document.getElementById("sidebar-right");

      rightOverlay.addEventListener('click', () => {
        hamburgerBtnWrapper.classList.remove('open');
        hamburgerOpen = false;
        document.getElementById("myNav").style.width = "0%";
        document.getElementById("sidebar-right").style.width = "0%";
      });

      document.querySelectorAll(".overlay-links").forEach(link => {
        link.addEventListener('click', event => {
          hamburgerBtnWrapper.classList.remove('open');
          hamburgerOpen = false;
          document.getElementById("myNav").style.width = "0%";
          document.getElementById("sidebar-right").style.width = "0%";
        });
      });

    } else {
        hamburgerBtnWrapper.classList.remove('open');
        hamburgerOpen = false;
        document.getElementById("myNav").style.width = "0%";
        document.getElementById("sidebar-right").style.width = "0%";
    }
  })
}