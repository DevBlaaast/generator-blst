// Polyfills:
// - classList

export default class SmoothScroll {

  constructor() {
    this.init();
  }

  init() {
    let navLinks = document.querySelectorAll('.js-smooth-link, .js-nav-link');

    [].forEach.call(navLinks, (el) => {
      el.addEventListener('click', (ev) => {
        let navLinksActive = document.querySelectorAll('.js-smooth-link, .js-nav-link');
        const elClasses = ev.target.classList;

        [].forEach.call(navLinksActive, (el) => {
          el.parentNode.classList.remove('active');
        });

        ev.preventDefault();

        if (!ev.target.href) {
          return this.smoothScroll(ev.target.parentNode.href.split('#')[1]);
        }
        this.smoothScroll(ev.target.href.split('#')[1]);

        if (elClasses.contains('js-nav-link') && !elClasses.contains('active')) {
          ev.target.parentNode.classList.add('active');
        }
      }, false);
    });
  }

  smoothScroll(el) {
    let element = document.querySelector(`#${el}`);
    Velocity(element, "scroll", {
      duration: 400,
      easing: "easeOutSine"
    });
  }

}
