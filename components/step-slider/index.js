export default class StepSlider {
  constructor({ steps, value = 0 }) {
    this.steps = steps;
    this.value;
    this.valuePercents;
    this.elem = this.render();
    this.elem.querySelector('.slider__thumb').addEventListener("pointerdown", (event) => this.pointerdown(event));
    this.elem.addEventListener('click', (event) => this.onClick(event));
  }

  onClick(event) {
    if (this.elem.querySelector(".slider__step-active")) {
      this.elem.querySelector(".slider__step-active").classList.remove("slider__step-active");
    }

    let newLeft = (event.clientX - this.elem.getBoundingClientRect().left) / this.elem.offsetWidth;
    let segments = this.steps - 1;

    let value = Math.round(segments * newLeft);
    this.value = value;
    let valuePercents = (this.value / (this.steps - 1)) * 100;
    this.elem.querySelectorAll("span")[this.value + 1].classList.add("slider__step-active");
    this.elem.querySelector('.slider__thumb').style.left = `${valuePercents}%`;
    this.elem.querySelector('.slider__progress').style.width = `${valuePercents}%`;
    this.elem.querySelector('.slider__value').innerHTML = this.value;
    this.elem.dispatchEvent(new CustomEvent('slider-change', { detail: this.value, bubbles: true }));
  }

  pointerdown(event) {
    if (this.elem.querySelector(".slider__step-active")) {
      this.elem.querySelector(".slider__step-active").classList.remove("slider__step-active");
    }

    this.elem.classList.add("slider_dragging");

    let pointermove = (event) => {
      let sliderThumb = this.elem.querySelector(".slider__thumb");
      let progress = this.elem.querySelector(".slider__progress");

      sliderThumb.ondragstart = () => false;
      sliderThumb.pointermove = () => false;
      sliderThumb.pointerdown = () => false;

      let left = event.clientX - this.elem.getBoundingClientRect().left;
      let leftRelative = left / this.elem.offsetWidth;

      if (leftRelative < 0) {
        leftRelative = 0;
      }
      if (leftRelative > 1) {
        leftRelative = 1;
      }

      let leftPersent = leftRelative * 100;
      this.leftPersent = leftPersent;
      let segments = this.steps - 1;
      let approximateValue = leftRelative * segments;
      let value = Math.round(approximateValue);

      value = (value < 0) ? value = 0 : (value > this.steps - 1) ? value = this.steps - 1 : value;
      this.value = value;

      document.querySelector(".slider__value").innerHTML = `${value}`;
      sliderThumb.style.left = `${leftPersent}%`;
      progress.style.width = `${leftPersent}%`;

      this.elem.querySelectorAll("span")[this.value + 1].classList.add("slider__step-active");
      this.elem.querySelectorAll("span")[this.value].classList.remove("slider__step-active");

      if (this.elem.querySelectorAll("span")[this.value + 2]) {
        this.elem.querySelectorAll("span")[this.value + 2].classList.remove("slider__step-active");
      }
    }

    let pointerup = () => {
      this.elem.classList.remove("slider_dragging");
      let valuePercents = (this.value / (this.steps - 1)) * 100;

      this.elem.querySelector('.slider__thumb').style.left = `${valuePercents}%`;
      this.elem.querySelector('.slider__progress').style.width = `${valuePercents}%`;
      this.elem.querySelector('.slider__value').innerHTML = this.value;

      document.removeEventListener("pointermove", pointermove);
      document.removeEventListener("pointerup", pointerup);
      this.elem.dispatchEvent(new CustomEvent('slider-change', { detail: this.value, bubbles: true }));
    }

    document.addEventListener("pointermove", pointermove);
    document.addEventListener("pointerup", pointerup);
  }

  render() {
    let divSlider = document.createElement("div");
    divSlider.classList.add("slider");
    divSlider.insertAdjacentHTML(
      "afterbegin",
      `
        <div class="slider__thumb" style="left: 0%;">
            <span class="slider__value">0</span>
        </div>
        <div class="slider__progress" style="width: 0%;"></div>
        <div class="slider__steps"></div>`
    );

    for (let i = this.steps; i > 0; i--) {
      let spanElem = document.createElement("span");
      divSlider.querySelector(".slider__steps").append(spanElem);
    }

    let one = divSlider.querySelectorAll("div.slider__steps > span")[0];
    one.classList.add("slider__step-active");
    return divSlider;
  }
}