//Class to simulate a DB to upload all products in the ecommerce.
class DataBase {
  constructor() {
    this.proucts = [];
    //Uploading all products available
    this.addRegister(1, "Helenistica", 225, "White", "");
    this.addRegister(
      2,
      "Evolve 3D Pro Air Jersey",
      225,
      "",
      "images/img-man/maillot-man2.webp"
    );
    this.addRegister(3, "Rosa", 225, "Green Palmer");
    this.addRegister(
      4,
      "Evade Pro Base Jersey 2.0",
      245,
      "",
      "images/img-man/maillot-man4.webp",
      ""
    );
    this.addRegister(5, "Evade Pro Base Jersey 2.0", 245, "Gray", "", "");
  }

  addRegister(id, name, price, color, image, category) {
    const product = new Product(id, name, price, color, image, category);
    this.proucts.push(product);
  }

  bringRegisters() {
    return this.proucts;
  }

  registerById(id) {
    return this.proucts.find((product) => product.id == id);
  }

  registerByName(word) {
    return this.proucts.filter((product) =>
      product.name.toLowerCase().includes(word)
    );
  }
  registerByCategory(keyword) {
    return this.proucts.filter((product) => product.category.includes(keyword));
  }
}

//Cart Class
class Cart {
  constructor() {
    const storageCart = JSON.parse(localStorage.getItem("cart"));
    this.cart = storageCart || [];
    this.total = 0;
    this.totalProducts = 0;
    this.list();
  }

  inCart({ id }) {
    return this.cart.find((product) => product.id === id);
  }

  addToCart(product) {
    let productOnCart = this.inCart(product);
    if (productOnCart) {
      productOnCart.amount++;
    } else {
      this.cart.push({ ...product, amount: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(this.cart));
    this.list();
    Toastify({
      text: `${product.name} added to cart`,
      duration: 2000,
      className: "info",
      gravity: "bottom",
      position: "center",
      style: {
        background: "black",
      },
    }).showToast();
  }

  remove(id) {
    const index = this.cart.findIndex((product) => product.id === id);
    const productName = this.cart[index].name;
    if (this.cart[index].amount > 1) {
      this.cart[index].amount--;
    } else {
      this.cart.splice(index, 1);
      Toastify({
        text: `${productName} removed from cart`,
        duration: 2000,
        className: "info",
        gravity: "bottom",
        position: "right",
        style: {
          background: "black",
        },
      }).showToast();
    }
    localStorage.setItem("cart", JSON.stringify(this.cart));
    this.list();
  }

  add(id) {
    const index = this.cart.findIndex((product) => product.id === id);
    if (this.cart[index].amount >= 1) {
      this.cart[index].amount++;
    }
    localStorage.setItem("cart", JSON.stringify(this.cart));
    this.list();
  }

  list() {
    this.total = 0;
    this.totalProducts = 0;
    cartDiv.innerHTML = "";
    for (const product of this.cart) {
      cartDiv.innerHTML += `
        <ul class="cart list-group">
        <li class="list-group-item">
        <div class="row">
          <div class="col">
            <div class="mt-2">PRODUCT:</div>
            <div class="mt-2">${product.name}</div>
            <div class="mt-2">Price: ${product.price} AUD $</div>
            <div class="mt-2">Color: ${product.color}</div>
            <a class="mt-1 mx-1 btn btn-sm btn-outline-dark border-1 py-1 removeBtn" href="#" data-id="${product.id}"><i class="bi bi-dash-lg"></i></a><a class="mt-1 mx-1 btn border-1 py-1" href="#">${product.amount}</a><a class="mt-1 mx-1 btn btn-sm btn-outline-dark border-1 py-1 addBtn" href="#" data-id="${product.id}"><i class="bi bi-plus-lg"></i></a>
          </div>
          <div class="col">
            <img src="${product.image}" class="img-fluid cart-img">
          </div>
        </div>
      </li>
      </ul>`;
      this.total += product.price * product.amount;
      this.totalProducts += product.amount;
    }
    //Remove Buttons
    const removeButtons = document.querySelectorAll(".removeBtn");
    for (const button of removeButtons) {
      button.onclick = (event) => {
        event.preventDefault();
        this.remove(Number(button.dataset.id));
      };
    }
    //Add Buttons
    const addButtons = document.querySelectorAll(".addBtn");
    for (const button of addButtons) {
      button.onclick = (event) => {
        event.preventDefault();
        this.add(Number(button.dataset.id));
      };
    }
    //Refresh cart variables
    spanProductsOnCart.innerText = this.totalProducts;
    spanCartTotl.innerText = this.total;
  }

  //Empty Cart
  emptyCart() {
    this.cart = [];
    localStorage.removeItem("cart");
    this.total = 0;
    this.totalProducts = 0;
    cartDiv.innerHTML = "";

    // Render HTML elements
    spanProductsOnCart.innerText = this.totalProducts;
    spanCartTotl.innerText = this.total;
  }

  //Print Ticket
  printTicket() {
    const modalList = document.querySelector("#modalList");
    const currentDate = new Date().toLocaleDateString();
    for (const product of this.cart) {
      const productItem = document.createElement("li");
      productItem.innerHTML = `
         <div class="list-group-item">
         <div><strong>Product:</strong> ${product.name}</div>
         <div><strong>Price:</strong> ${product.price} AUD $</div>
         <div><strong>Color:</strong> ${product.color}</div>
         <div><strong>Amount:</strong> ${product.amount}</div>
        </div>
        `;
      modalList.appendChild(productItem);
    }
    const ticketResume = document.querySelector("#resume");
    ticketResume.innerHTML = `<div>Total: ${this.total} AUD $ (${currentDate})</div>`;
    const closeButtons = document.querySelectorAll(".closeTicket");
    closeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        modalList.innerHTML = "";
      });
    });
  }
}

//Class to create all products
class Product {
  constructor(id, name, price, color, image = fasle, category) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.color = color;
    this.image = image;
    this.category = category;
  }
}

//DB inicialization
const DB = new DataBase();

//Elements
const productsDiv = document.querySelector("#products");
const cartDiv = document.querySelector("#cart");
const spanProductsOnCart = document.querySelector("#productsOnCart");
const spanCartTotl = document.querySelector("#cartTotal");
const searchInput = document.querySelector("#searchInput");
const emptyCartButton = document.querySelector("#emptyCartBtn");
const bannerTop = document.querySelector("#bannerTop");
const newCategory = document.querySelector("#newCategory");
const manCategory = document.querySelector("#manCategory");
const womanCategory = document.querySelector("#womanCategory");
const accCategory = document.querySelector("#accCategory");
const iframe = document.querySelector("#iframe");

//Print ticket

const checkoutBtn = document.querySelector("#checkoutBtn");
checkoutBtn.addEventListener("click", () => {
  cart.printTicket();
});

//Call to load products
loadProducts(DB.bringRegisters());

//Prints the DB registers on the HTML
function loadProducts(products) {
  productsDiv.innerHTML = "";
  for (const product of products) {
    productsDiv.innerHTML += `
      <div class="p-1 col-sm-6 col-md-3 col-lg-2 d-inline-block m-2 text-center card text-center">
                <img
                  src="${product.image}"
                  class="img-fluid card-img-top"
                  alt="evade pro base ls jersey brown"
                />
                <div class="card-body">
                  <button
                    class="addToCartBtn btn btn-dark"
                    data-id="${product.id}"
                  >
                    ADD TO CART
                  </button>
                </div>
              </div>
      `;
  }
  //Add to cart buttons
  const addToCartButtons = document.querySelectorAll(".addToCartBtn");
  for (const button of addToCartButtons) {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      const id = Number(button.dataset.id);
      const product = DB.registerById(id);
      cart.addToCart(product);
    });
  }
}

//Search event
searchInput.addEventListener("keyup", (event) => {
  event.preventDefault();
  const word = searchInput.value;
  loadProducts(DB.registerByName(word.toLowerCase()));
  bannerTop.innerHTML = "";
  iframe.classList.add("d-none");
});

//Filter by Categories
newCategory.addEventListener("click", (event) => {
  event.preventDefault();
  loadProducts(DB.registerByCategory("new"));
  bannerTop.innerHTML = `
        <div class="bg-image img-fluid position-relative">
          <img src= class="w-100" />
          <div class="position-absolute bottom-50 text-light section-title">
            <h1 class="p-2 m-0">VIVERO MAL PAIS</h1>
          </div>
        </div>
    `;
  iframe.classList.remove("d-none");
});

manCategory.addEventListener("click", (event) => {
  event.preventDefault();
  loadProducts(DB.registerByCategory("men"));
  bannerTop.innerHTML = `
        <div id="man" class="mt-5 bg-image img-fluid position-relative">
          <img src=class="w-100" />
          <div class="position-absolute bottom-50 text-light section-title">
            <h2 class=
          </div>
        </div>
    `;
});

womanCategory.addEventListener("click", (event) => {
  event.preventDefault();
  loadProducts(DB.registerByCategory("woman"));
  bannerTop.innerHTML = `
        <div id="woman" class="mt-5 bg-image img-fluid position-relative">
          <img src= class="w-100" />
          <div class="position-absolute bottom-50 text-light section-title">
            <h2 class=
          </div>
        </div>
    `;
});

accCategory.addEventListener("click", (event) => {
  event.preventDefault();
  loadProducts(DB.registerByCategory("acc"));
  bannerTop.innerHTML = `
        <div id="accessories" class="mt-5 bg-image img-fluid position-relative">
          <img src=" class="w-100" />
          <div class="position-absolute bottom-50 text-light section-title">
            <h2 class=
          </div>
        </div>
    `;
});

//Empty Cart
emptyCartButton.addEventListener("click", () => {
  cart.emptyCart();
});

//Cart Object
const cart = new Cart();

//Scroll Up
const scrollUpButton = document.getElementById("scrollUpButton");

scrollUpButton.addEventListener("click", () => {
  // Scroll smoothly to the top
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});
