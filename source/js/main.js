const menuButton = document.querySelector('.main-header__menu-toggle');
const mobileMenu = document.querySelector('.navigation');

const menuButtonClickHandler = () => {
  if (menuButton.classList.contains('main-header__menu-toggle--closed')) {
    menuButton.classList.replace('main-header__menu-toggle--closed', 'main-header__menu-toggle--opened');
    mobileMenu.classList.add('navigation--opened');
  }
  else {
    menuButton.classList.replace('main-header__menu-toggle--opened', 'main-header__menu-toggle--closed');
    mobileMenu.classList.remove('navigation--opened');
  }
}

menuButton.addEventListener('click', menuButtonClickHandler);
