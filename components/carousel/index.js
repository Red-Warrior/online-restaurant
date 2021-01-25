export default class Carousel {

  constructor(slides) {
    this.slides = slides;
    this.elem = this.render(this.slides);
    this.elem.addEventListener("click", (event) => this.onClick(event));

    this.value = 0;
    this.curentSlide = 1;

    this.slideLenght = this.elem.querySelectorAll(".carousel__slide");
    this.left = this.elem.querySelector(".carousel__arrow_left");
    this.right = this.elem.querySelector(".carousel__arrow_right");

    this.left.style.display = "none";

    this.elem.addEventListener("click", (event) => this.slider(event));
  }

  slider(event) {
    let counter = this.elem.querySelector(".carousel__inner").offsetWidth;

    if (event.target.closest(".carousel__arrow_left")) {
      this.elem.querySelector(".carousel__inner").style.transform = `translateX(${this.value += counter}px)`;
      this.curentSlide -= 1;

      if (this.curentSlide === 1) {
        this.left.style.display = "none";
      }
      else if (this.curentSlide !== this.slideLenght.length) {
        this.right.style.display = "";
      } else {
        this.left.style.display = "";
      }
    }

    if (event.target.closest(".carousel__arrow_right")) {
      this.elem.querySelector(".carousel__inner").style.transform = `translateX(${this.value -= counter}px)`;
      this.curentSlide += 1;

      if (this.curentSlide === this.slideLenght.length) {
        this.right.style.display = "none";
      } else if (this.curentSlide !== 1) {
        this.left.style.display = "";
      } else {
        this.right.style.display = "";
      }
    }
  }

  onClick(event) {
    if (event.target.closest(".carousel__button")) {
      let customEvent = new CustomEvent("product-add", { bubbles: true, detail: this.slides[this.curentSlide - 1].id });
      this.elem.dispatchEvent(customEvent);
    }
  }

  render(slides) {

    let carousel = document.createElement("div");
    carousel.classList.add("carousel");
    carousel.insertAdjacentHTML("afterbegin", `
    <div class="carousel__arrow carousel__arrow_right">
      <img src="/assets/images/icons/angle-icon.svg" alt="icon">
    </div>
    <div class="carousel__arrow carousel__arrow_left">
      <img src="/assets/images/icons/angle-left-icon.svg" alt="icon">
    </div>
    `);

    let divCarouselInner = document.createElement("div");
    divCarouselInner.classList.add("carousel__inner");

    for (const value of slides) {

      let divCarouselSlide = document.createElement("div");
      divCarouselSlide.classList.add("carousel__slide");
      divCarouselSlide.setAttribute("data-id", `${value.id}`);

      divCarouselSlide.insertAdjacentHTML("afterbegin", `
      <img src="/assets/images/carousel/${value.image}" class="carousel__img" alt="slide">
      <div class="carousel__caption">
          <span class="carousel__price">€${value.price.toFixed(2)}</span>
          <div class="carousel__title">${value.name}</div>
          <button type="button" class="carousel__button">
              <img src="/assets/images/icons/plus-icon.svg" alt="icon">
          </button>
      </div>
      `);

      divCarouselInner.append(divCarouselSlide);
    }

    carousel.append(divCarouselInner);
    return carousel;
  }
}
