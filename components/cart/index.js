import createElement from '../../assets/lib/create-element.js';
import escapeHtml from '../../assets/lib/escape-html.js';

export default class Cart {
  cartItems = []; // [product: {...}, count: N]

  constructor(cartIcon) {
    this.cartIcon = cartIcon;
    this.addEventListeners();
    this.targetId;
  }

  addProduct(product) {
    let target = this.cartItems.findIndex(item => item.product.id === product.id);
    if (target >= 0) {
      this.cartItems[target].count += 1;
    } else {
      this.cartItems.push({ product: product, count: 1 })
    }
    this.onProductUpdate(this.cartItems);
  }

  updateProductCount(productId, amount) {
    let targetIndex = this.cartItems.findIndex(item => item.product.id === productId);

    if (this.cartItems[targetIndex].count > 0) {
      this.cartItems.find(item => item.product.id === productId).count += (amount);
    }
    if (this.cartItems[targetIndex].count === 0) {
      this.cartItems.splice(targetIndex, 1);
      document.querySelector(`[data-product-id="${this.targetId}"]`).remove();
    }

    this.onProductUpdate(this.cartItems);
  }

  isEmpty() {
    return this.cartItems.length === 0;
  }

  getTotalCount() {
    let totalCount = 0
    for (let elem of this.cartItems) {
      totalCount += elem.count;
    }
    return totalCount;
  }

  getTotalPrice() {
    let totalPrice = 0;
    for (let elem of this.cartItems) {
      totalPrice += elem.product.price * elem.count;
    }
    return totalPrice;
  }

  renderProduct(product, count) {
    return createElement(`
    <div class="cart-product" data-product-id="${product.id}">
      <div class="cart-product__img">
        <img src="/assets/images/products/${product.image}" alt="product">
      </div>
      <div class="cart-product__info">
        <div class="cart-product__title">${escapeHtml(product.name)}</div>
        <div class="cart-product__price-wrap">
          <div class="cart-counter">
            <button type="button" class="cart-counter__button cart-counter__button_minus">
              <img src="/assets/images/icons/square-minus-icon.svg" alt="minus">
            </button>
            <span class="cart-counter__count">${count}</span>
            <button type="button" class="cart-counter__button cart-counter__button_plus">
              <img src="/assets/images/icons/square-plus-icon.svg" alt="plus">
            </button>
          </div>
          <div class="cart-product__price">€${product.price.toFixed(2)}</div>
        </div>
      </div>
    </div>`);
  }

  renderOrderForm() {
    return createElement(`<form class="cart-form">
      <h5 class="cart-form__title">Delivery</h5>
      <div class="cart-form__group cart-form__group_row">
        <input name="name" type="text" class="cart-form__input" placeholder="Name" required value="Santa Claus">
        <input name="email" type="email" class="cart-form__input" placeholder="Email" required value="john@gmail.com">
        <input name="tel" type="tel" class="cart-form__input" placeholder="Phone" required value="+1234567">
      </div>
      <div class="cart-form__group">
        <input name="address" type="text" class="cart-form__input" placeholder="Address" required value="North, Lapland, Snow Home">
      </div>
      <div class="cart-buttons">
        <div class="cart-buttons__buttons btn-group">
          <div class="cart-buttons__info">
            <span class="cart-buttons__info-text">total</span>
            <span class="cart-buttons__info-price">€${this.getTotalPrice().toFixed(2)}</span>
          </div>
          <button type="submit" class="cart-buttons__button btn-group__button button">order</button>
        </div>
      </div>
    </form>`);
  }

  renderModal() {
    document.body.classList.add("is-modal-open");
    let divModal = document.createElement("div");
    divModal.classList.add("modal");
    divModal.insertAdjacentHTML("afterbegin", `
    <div class="modal__overlay"></div>
    <div class="modal__inner">
      <div class="modal__header">
        <!--Кнопка закрытия модального окна-->
        <button type="button" class="modal__close">
          <img src="/assets/images/icons/cross-icon.svg" alt="close-icon" />
        </button>
        <h3 class="modal__title">Your order</h3>
      </div>
      <div class="modal__body">

      </div>
    </div>
    `);

    document.body.append(divModal);

    for (let elem of this.cartItems) {
      document.querySelector(".modal__body").append(this.renderProduct(elem.product, elem.count));
    }

    document.querySelector(".modal__body").append(this.renderOrderForm());
    document.querySelector(".modal").addEventListener("click", (event) => counter(event));

    let counter = (event) => {
      if (event.target.closest(".cart-counter__button_minus")) {
        this.targetId = event.target.closest(".cart-product").getAttribute("data-product-id");

        for (let elem of this.cartItems) {
          if (this.targetId === elem.product.id) {
            this.updateProductCount(this.targetId, -1)
            this.onProductUpdate(this.cartItems);
          }
        }
      }

      if (event.target.closest(".cart-counter__button_plus")) {
        this.targetId = event.target.closest(".cart-product").getAttribute("data-product-id");

        for (let elem of this.cartItems) {
          if (this.targetId === elem.product.id) {
            this.updateProductCount(this.targetId, 1)
            this.onProductUpdate(this.cartItems);
          }
        }
      }
    }

    if (document.querySelector(".cart-form")) {
      document.querySelector(".cart-form").addEventListener("submit", (event) => {
        event.preventDefault();
        this.onSubmit();
      });
    }
    document.querySelector(".modal__close").addEventListener("click", () => this.buttonClose());
    document.addEventListener("keydown", (event) => this.keyHandler(event));
  }

  onProductUpdate(elem) {
    if (document.querySelector(".is-modal-open")) {

      for (let elem of this.cartItems) {
        if (this.targetId === elem.product.id) {
          document.querySelector(`[data-product-id="${this.targetId}"] .cart-counter__count`)
            .textContent = elem.count;
          document.querySelector(`[data-product-id="${this.targetId}"] .cart-product__price`)
            .textContent = `€${(elem.product.price * elem.count).toFixed(2)}`;
          document.querySelector(".cart-buttons__info-price").innerHTML = `€${this.getTotalPrice().toFixed(2)}`;
        }
      }
    }

    if (this.cartItems.length === 0) {
      document.body.classList.remove("is-modal-open");
      if (document.querySelector(".modal")) {
        document.querySelector(".modal").remove();
      }
    }
    this.cartIcon.update(this);
  }

  onSubmit() {
    document.querySelector("[type=submit]").classList.add("is-loading");

    let formElem = document.querySelector(".cart-form");
    let userFormData = new FormData(formElem);

    let result = fetch('https://httpbin.org/post', {
      method: 'POST',
      body: userFormData
    });

    result.then(() => {
      document.querySelector(".modal__title").textContent = "Success!";
      this.cartItems = [];

      document.querySelector(".modal__body").innerHTML = `
        <div class="modal__body-inner">
          <p>
             Order successful! Your order is being cooked :) <br>
             We’ll notify you about delivery time shortly.<br>
             <img src="/assets/images/delivery.gif">
          </p>
        </div>`;
    });
  };

  addEventListeners() {
    this.cartIcon.elem.onclick = () => this.renderModal();
  }


  close() {
    document.body.classList.remove("is-modal-open");
    if (document.querySelector(".modal")) {
      document.querySelector(".modal").remove();
    }

  }

  buttonClose() {
    if (document.querySelector(".modal__body-inner")) {
      this.cartIcon.update(this);
    }


    document.body.classList.remove("is-modal-open");
    if (document.querySelector(".modal")) {
      document.querySelector(".modal").remove();
    }
  }

  keyHandler(event) {
    if (document.querySelector(".modal__body-inner")) {
      this.cartIcon.update(this);
    }

    if (event.code === "Escape") {
      document.body.classList.remove("is-modal-open");
      if (document.querySelector(".modal")) {
        document.querySelector(".modal").remove();
      }
    }
  }
}
