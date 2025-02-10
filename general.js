let homeWindow = document.querySelector('.home-window');
let homeWindowBg = document.querySelector('.home-window-bg');
let homeWindowBgImages = document.querySelectorAll('.home-window-bg img');

// -------------------------header---------------------------
(function () {

  var doc = document.documentElement;
  var w = window;

  var prevScroll = w.scrollY || doc.scrollTop;
  var curScroll;
  var direction = 0;
  var prevDirection = 0;
  var header = document.getElementById('header');

  var checkScroll = function () {
    curScroll = w.scrollY || doc.scrollTop;
    if (curScroll > prevScroll) {
      //scrolled up
      direction = 2;
    }

    else if (curScroll < prevScroll) {
      direction = 1;
    }

    if (direction !== prevDirection) {
      toggleHeader(direction, curScroll);
    }
    prevScroll = curScroll;
  };

  var toggleHeader = function (direction, curScroll) {
    if (direction === 2 && curScroll > 126) {
      header.classList.add('hide');
      prevDirection = direction;
    }
    else if (direction === 1) {
      header.classList.remove('hide');
      prevDirection = direction;
    }
  };
  window.addEventListener('scroll', checkScroll);
})();


let arrowRight = document.querySelectorAll('.genre-container .right-arrow');
let arrowLeft = document.querySelectorAll('.genre-container .left-arrow');
let gameContainer = document.querySelectorAll('.game-card-container');
let gameCard = document.querySelector('.game-card-container .game-card');

for (let i = 0; i < gameContainer.length; i++) {
  arrowRight[i].addEventListener('click', () => {
    const slideWidth = gameCard.clientWidth;
    gameContainer[i].scrollLeft += slideWidth;
  })
  arrowLeft[i].addEventListener('click', () => {
    const slideWidth = gameCard.clientWidth;
    gameContainer[i].scrollLeft -= slideWidth;
  });
};

//   -----------checkbox------------

function onlyOne(check) {
  var checkbox = document.getElementsByName('check')
  checkbox.forEach((item) => {
    if (item !== check) item.checked = false
  })
}


function goBack() {
  window.history.back();
}
// ----------------------------------------------------------------


let leftLoginWindow = document.querySelector('.login-window .left-content');
let rightLoginWindow = document.querySelector('.login-window .right-content');
let signButton = document.querySelector('.login-window .sign');
let signWindow = document.querySelector('.sign-window');
let continueButton = document.querySelector('.sign-window .continue-button');

signButton.addEventListener('click', () => {
  leftLoginWindow.style.left = '-600px';
  rightLoginWindow.style.width = '100%';
  rightLoginWindow.style.border = '0px';
  setTimeout(function() {
    rightLoginWindow.style.right = '2000px';
    signWindow.style.right = '-600px';
  }, 1000);
})

continueButton.addEventListener('click', () => {
  signWindow.style.right = '0px';
  continueButton.style.right = '700px';
});

function goBack() {
  window.history.back();
}

function handleLogin(event) {
  event.preventDefault();
  window.location.href = "homepage.html";
}

// confirmation match
function handleSignup(event) {
  event.preventDefault();

  const password = document.getElementById("reg-password").value;
  const confirmPassword = document.getElementById("reg-password-confirm").value;

  if (password !== confirmPassword) {
    alert("Passwords do not match. Please try again.");
    return; // dont redirect
  }

  window.location.href = "logged.html";
}

