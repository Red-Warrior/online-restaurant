export default class ProductGrid {
  constructor(products) {
    this.products = products;
    this.filters = {};
    this.elem = this.render(this.products);
    this.elem.addEventListener("click", (event) => this.onClick(event));
    this.gridInner = "";
    this.cardsArr = [];
  }

  onClick(event) {
    if (event.target.closest(".card__button")) {
      let Id = event.target.closest(".card").getAttribute("id");
      let eventCustome = new CustomEvent("product-add", { bubbles: true, detail: Id });
      this.elem.dispatchEvent(eventCustome);
    }
  }

  updateFilter(filters) {

    Object.assign(this.filters, filters)

    let cards = () => {
      this.elem.innerHTML = "";
      let productGridInner = document.createElement("div");
      productGridInner.classList.add("products-grid__inner");

      for (let product of this.products) {
        if (this.filters.noNuts && product.nuts) {
          continue;
        }

        if (this.filters.vegeterianOnly && !product.vegeterian) {
          continue;
        }

        if (this.filters.maxSpiciness !== undefined && product.spiciness > this.filters.maxSpiciness) {
          continue;
        }

        if (this.filters.category && product.category != this.filters.category) {
          continue;
        }
        this.cardsArr.push(product);
      }

      for (let elem of this.cardsArr) {
        this.gridInner += `
  <div class="card" id ="${elem.id}">
    <div class="card__top">
      <img src="/assets/images/products/${elem.image}" class="card__image" alt="product">
      <span class="card__price">€${elem.price.toFixed(2)}</span>
    </div>
    <div class="card__body">
      <div class="card__title">${elem.name}</div>
      <button type="button" class="card__button">
        <img src="/assets/images/icons/plus-icon.svg" alt="icon">
      </button>
    </div>
  </div>`;
      }

      productGridInner.insertAdjacentHTML("afterbegin", this.gridInner);
      this.elem.append(productGridInner);
      this.cardsArr = [];
      this.gridInner = "";

      if (document.querySelector(".products-grid__inner").innerHTML === "") {
        document.querySelector(".products-grid__inner").insertAdjacentHTML("afterbegin", this.gridInnerRender);
      }
    }

    cards();
  }

  render(products) {
    let productGrid = document.createElement("div");
    productGrid.classList.add("products-grid");

    let gridInner = "";

    for (let i = 0; i < this.products.length; i++) {
      gridInner += `
  <div class="card" id ="${this.products[i].id}">
    <div class="card__top">
      <img src="/assets/images/products/${products[i].image}" class="card__image" alt="product">
      <span class="card__price">€${products[i].price.toFixed(2)}</span>
    </div>
    <div class="card__body">
      <div class="card__title">${products[i].name}</div>
      <button type="button" class="card__button">
        <img src="/assets/images/icons/plus-icon.svg" alt="icon">
      </button>
    </div>
  </div>`;
    }

    this.gridInnerRender = gridInner;
    productGrid.insertAdjacentHTML("afterbegin", `
    <div class="products-grid__inner">${gridInner}</div>`);

    return productGrid;
  }
}
