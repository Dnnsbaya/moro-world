/* =======================
   NAVIGATION & LOADER
   ======================= */
function toggleMenu() {
  document.getElementById("navLinks").classList.toggle("active");
}

window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("loader").classList.add("hide");
  }, 1200);
});

/* =======================
   PRODUCTS DATA
   ======================= */
const products = [
  {
    name: "MORØ Heavy Hoodie",
    price: 3500,
    desc: "Oversized fit. Heavy cotton. Minimal front logo.",
    badge: "New",
    tag: "Limited",
    image: "hoodie.png"
  },
  {
    name: "MORØ Essential Tee",
    price: 1800,
    desc: "Clean aesthetic tee with bold typography.",
    badge: "Essential",
    tag: "Street Fit",
    image: "t-shirt2.png"
  },
  {
    name: "MORØ Cap",
    price: 1200,
    desc: "Minimal embroidered symbol. Everyday street piece.",
    badge: "Drop 01",
    tag: "Minimal",
    image: "cap.png"
  },
  {
    name: "MORØ Tote Bag",
    price: 1500,
    desc: "Premium canvas everyday carry with MORØ identity.",
    badge: "Soon",
    tag: "Pre-order",
    image: "Tote 3.png"
  }
];

let cart = JSON.parse(localStorage.getItem("moroCart")) || [];
let wishlist = JSON.parse(localStorage.getItem("moroWishlist")) || [];
let selectedProduct = null;

/* =======================
   PRODUCT GRID
   ======================= */
function renderProducts(list = products) {
  const grid = document.getElementById("productsGrid");
  document.getElementById("productCount").innerText = `${list.length} products`;

  grid.innerHTML = list.map((product, index) => `
    <div class="product-card">
      <div class="product-badge">${product.badge}</div>
      <div class="product-img" style="background-image:url('${product.image}')"></div>

      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${product.desc}</p>

        <div class="price-row">
          <span>KSh ${product.price.toLocaleString()}</span>
          <small>${product.tag}</small>
        </div>

        <div class="product-actions">
          <button onclick="openQuickView(${index})">Quick View</button>
          <button class="wish-btn" onclick="addToWishlist(${index})">♡</button>
        </div>
      </div>
    </div>
  `).join("");
}

function sortProducts() {
  const value = document.getElementById("sortProducts").value;
  let sorted = [...products];

  if (value === "low") sorted.sort((a, b) => a.price - b.price);
  if (value === "high") sorted.sort((a, b) => b.price - a.price);
  if (value === "newest") sorted.reverse();

  renderProducts(sorted);
}

/* =======================
   QUICK VIEW
   ======================= */
function openQuickView(index) {
  selectedProduct = products[index];

  document.getElementById("quickName").innerText = selectedProduct.name;
  document.getElementById("quickDesc").innerText = selectedProduct.desc;
  document.getElementById("quickPrice").innerText = `KSh ${selectedProduct.price.toLocaleString()}`;
  document.getElementById("quickImg").style.backgroundImage = `url('${selectedProduct.image}')`;
  document.getElementById("quickQty").value = 1;

  document.getElementById("quickView").classList.add("active");
  document.body.classList.add("modal-open"); // Lock page scroll
}

function closeQuickView() {
  document.getElementById("quickView").classList.remove("active");
  document.body.classList.remove("modal-open"); // Unlock page scroll
}

function addQuickToCart() {
  const size = document.getElementById("quickSize").value;
  const qty = parseInt(document.getElementById("quickQty").value);

  for (let i = 0; i < qty; i++) {
    cart.push({
      name: selectedProduct.name,
      price: selectedProduct.price,
      size
    });
  }

  saveCart();
  updateCart();
  closeQuickView();
  openCart();
}

/* =======================
   CART
   ======================= */
function saveCart() {
  localStorage.setItem("moroCart", JSON.stringify(cart));
}

function updateCart() {
  const cartItems = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const cartTotal = document.getElementById("cartTotal");

  cartCount.innerText = cart.length;

  if (cart.length === 0) {
    cartItems.innerHTML = `<p class="empty-cart">Your cart is empty.</p>`;
    cartTotal.innerText = "KSh 0";
    return;
  }

  let total = 0;

  cartItems.innerHTML = cart.map((item, index) => {
    total += item.price;

    return `
      <div class="cart-item">
        <h4>${item.name}</h4>
        <p>Size: ${item.size || "Standard"}</p>
        <p>KSh ${item.price.toLocaleString()}</p>
        <button onclick="removeFromCart(${index})">Remove</button>
      </div>
    `;
  }).join("");

  cartTotal.innerText = `KSh ${total.toLocaleString()}`;
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  updateCart();
}

function toggleCart() {
  document.getElementById("cartDrawer").classList.toggle("active");
  document.getElementById("overlay").classList.toggle("active");
  document.body.classList.toggle("modal-open");
}

function openCart() {
  document.getElementById("cartDrawer").classList.add("active");
  document.getElementById("overlay").classList.add("active");
}

/* =======================
   WISHLIST
   ======================= */
function addToWishlist(index) {
  const product = products[index];

  if (!wishlist.find(item => item.name === product.name)) {
    wishlist.push(product);
  }

  localStorage.setItem("moroWishlist", JSON.stringify(wishlist));
  updateWishlist();
}

function updateWishlist() {
  const wishlistItems = document.getElementById("wishlistItems");
  const wishCount = document.getElementById("wishCount");

  wishCount.innerText = wishlist.length;

  if (wishlist.length === 0) {
    wishlistItems.innerHTML = `<p class="empty-cart">Your wishlist is empty.</p>`;
    return;
  }

  wishlistItems.innerHTML = wishlist.map((item, index) => `
    <div class="cart-item">
      <h4>${item.name}</h4>
      <p>KSh ${item.price.toLocaleString()}</p>
      <button onclick="moveWishToCart(${index})">Add to Cart</button>
      <button onclick="removeWishlist(${index})">Remove</button>
    </div>
  `).join("");
}

function moveWishToCart(index) {
  cart.push({
    name: wishlist[index].name,
    price: wishlist[index].price,
    size: "M"
  });

  wishlist.splice(index, 1);
  localStorage.setItem("moroWishlist", JSON.stringify(wishlist));
  saveCart();
  updateWishlist();
  updateCart();
}

function removeWishlist(index) {
  wishlist.splice(index, 1);
  localStorage.setItem("moroWishlist", JSON.stringify(wishlist));
  updateWishlist();
}

function toggleWishlist() {
  document.getElementById("wishlistDrawer").classList.toggle("active");
  document.getElementById("overlay").classList.toggle("active");
  document.body.classList.toggle("modal-open");
}

function closeDrawers() {
  document.getElementById("cartDrawer").classList.remove("active");
  document.getElementById("wishlistDrawer").classList.remove("active");
  document.getElementById("overlay").classList.remove("active");
  document.body.classList.remove("modal-open"); // Unlock
}

/* =======================
   CHECKOUT
   ======================= */
function checkoutMpesa() {
  alert("M-Pesa checkout coming soon. For now, use WhatsApp checkout.");
}

function checkoutCard() {
  alert("Card / PayPal checkout coming soon.");
}

/* =======================
   FORMS
   ======================= */
// function joinWaitlist(e) {
//   e.preventDefault();
//   alert("You have joined the MORØ tote bag waitlist.");
//   e.target.reset();
// }

// function joinNewsletter(e) {
//   e.preventDefault();
//   alert("You have joined the MORØ drop list.");
//   e.target.reset();
// }

/* =======================
   COUNTDOWN
   ======================= */
const dropDate = new Date("June 30, 2026 20:00:00").getTime();

setInterval(() => {
  const days = document.getElementById("days");
  const hours = document.getElementById("hours");
  const minutes = document.getElementById("minutes");
  const seconds = document.getElementById("seconds");

  if (!days || !hours || !minutes || !seconds) return;

  const now = new Date().getTime();
  const distance = dropDate - now;

  if (distance <= 0) {
    days.innerText = "00";
    hours.innerText = "00";
    minutes.innerText = "00";
    seconds.innerText = "00";
    return;
  }

  days.innerText = String(Math.floor(distance / (1000 * 60 * 60 * 24))).padStart(2, "0");
  hours.innerText = String(Math.floor((distance / (1000 * 60 * 60)) % 24)).padStart(2, "0");
  minutes.innerText = String(Math.floor((distance / (1000 * 60)) % 60)).padStart(2, "0");
  seconds.innerText = String(Math.floor((distance / 1000) % 60)).padStart(2, "0");
}, 1000);

/* =======================
   CUSTOM CURSOR
   ======================= */
document.addEventListener("mousemove", (e) => {
  const cursor = document.querySelector(".cursor");
  if (!cursor) return;

  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";
});

/* =======================
   INIT
   ======================= */
renderProducts();
updateCart();
updateWishlist();