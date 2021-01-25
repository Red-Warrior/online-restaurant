export default class RibbonMenu {

  constructor(categories) {

    this.categories = categories;
    this.elem = this.render(this.categories);

    this.scrollInner = this.elem.querySelector(".ribbon__inner");

    this.elem.querySelector(".ribbon__arrow_left").classList.remove("ribbon__arrow_visible")
    this.elem.querySelector(".ribbon__arrow_right").classList.add("ribbon__arrow_visible")

    this.elem.addEventListener("click", (event) => this.onClick(event));

    this.scrollInner.addEventListener("scroll", (event) => this.buttonHide(event));

    this.scrollInner.addEventListener("click", (event) => this.selection(event));
  }

  selection(event) {

    event.preventDefault();
    let element = event.target;
    let selectionElement = this.scrollInner.querySelector(".ribbon__item_active");
    element.classList.add("ribbon__item_active");
    let selectionAllElements = this.scrollInner.querySelectorAll(".ribbon__item_active");

    if (selectionAllElements.length > 1) {
      selectionElement.classList.remove("ribbon__item_active")
    }

    let eventCustome = new CustomEvent("ribbon-select", { bubbles: true, detail: element.getAttribute("data-id") });
    this.elem.dispatchEvent(eventCustome);
  }

  onClick(event) {

    if (event.target.closest(".ribbon__arrow_left")) {
      this.scrollInner.scrollBy(-350, 0);
    }

    if (event.target.closest(".ribbon__arrow_right")) {
      this.scrollInner.scrollBy(350, 0);
    }
  }

  buttonHide(event) {
    let scrollRight = this.scrollInner.scrollWidth - this.scrollInner.scrollLeft - this.scrollInner.clientWidth;

    if (this.scrollInner.scrollLeft === 0) {
      this.elem.querySelector(".ribbon__arrow_left").classList.remove("ribbon__arrow_visible")
    }
    if (this.scrollInner.scrollLeft > 0) {
      this.elem.querySelector(".ribbon__arrow_left").classList.add("ribbon__arrow_visible")
    }
    if (scrollRight > 1) {
      this.elem.querySelector(".ribbon__arrow_right").classList.add("ribbon__arrow_visible")
    }
    if (scrollRight < 1) {
      this.elem.querySelector(".ribbon__arrow_right").classList.remove("ribbon__arrow_visible")
    }
  }

  render(categories) {

    let divRibbon = document.createElement("div");
    divRibbon.classList.add("ribbon");

    divRibbon.insertAdjacentHTML("afterbegin", `
    <button class="ribbon__arrow ribbon__arrow_left ribbon__arrow_visible">
      <img src="/assets/images/icons/angle-icon.svg" alt="icon">
    </button>`);

    let navElement = document.createElement("nav");
    navElement.classList.add("ribbon__inner");

    for (let target of this.categories) {

      let aElement = document.createElement("a");

      aElement.setAttribute("href", "#");
      aElement.classList.add("ribbon__item");
      aElement.setAttribute("data-id", `${target.id}`);
      aElement.innerHTML = `${target.name}`;

      if (target.id === '') {
        aElement.classList.add("ribbon__item_active");
      } else if (target.id === "on-the-side") {
        aElement.setAttribute("data-id", "on-the-side ribbon__item_active");
      }
      navElement.append(aElement);
    }

    divRibbon.append(navElement);

    divRibbon.insertAdjacentHTML("beforeend", `
    <button class="ribbon__arrow ribbon__arrow_right">
      <img src="/assets/images/icons/angle-icon.svg" alt="icon">
    </button>`);

    return divRibbon;
  }
}
