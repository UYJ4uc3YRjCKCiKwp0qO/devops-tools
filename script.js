
const products = [
  { id: 1, name: "Sonic Pro Headphones", category: "Audio", price: 2499, image: "photo-1505740420928-5e560c06d30e" },
  { id: 2, name: "Classic Time Watch", category: "Wearables", price: 1899, image: "photo-1523275335684-37898b6baf30" },
  { id: 3, name: "Urban Sneakers", category: "Accessories", price: 3299, image: "photo-1542291026-7eec264c27ff" },
  { id: 4, name: "Smart Fitness Watch", category: "Wearables", price: 2799, image: "photo-1524805444758-089113d48a6d" },
  { id: 5, name: "Wireless Earbuds", category: "Audio", price: 1499, image: "photo-1606220945770-b5b6c2c55bf1" },
  { id: 6, name: "Premium Sunglasses", category: "Accessories", price: 999, image: "photo-1511499767150-a48a237f0083" },
  { id: 7, name: "Studio Headphones", category: "Audio", price: 2199, image: "photo-1484704849700-f032a568e944" },
  { id: 8, name: "Minimalist Watch", category: "Wearables", price: 1699, image: "photo-1524592094714-0f0654e20314" }
];

let cart = [];
let activeCategory = "All";
let searchTerm = "";

const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const cartCount = document.getElementById("cartCount");
const toast = document.getElementById("toast");
const emptyMessage = document.getElementById("emptyMessage");

function money(price) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(price);
}

function renderProducts() {
  const filtered = products.filter(product => {
    const categoryMatch =
      activeCategory === "All" || product.category === activeCategory;

    const searchMatch =
      `${product.name} ${product.category}`
        .toLowerCase()
        .includes(searchTerm);

    return categoryMatch && searchMatch;
  });

  productGrid.innerHTML = filtered.map((product, index) => `
    <article class="product-card" style="animation-delay:${index * 60}ms">
      <div class="product-image-wrap">
        <img
          class="product-image"
          src="https://images.unsplash.com/${product.image}?auto=format&fit=crop&w=600&q=80"
          alt="${product.name}"
          loading="lazy"
        >
      </div>
      <span class="product-category">${product.category}</span>
      <h3>${product.name}</h3>
      <div class="product-bottom">
        <span class="price">${money(product.price)}</span>
        <button class="add-button" data-add="${product.id}">
          + Add to cart
        </button>
      </div>
    </article>
  `).join("");

  emptyMessage.hidden = filtered.length > 0;
}

function notify(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(notify.timer);
  notify.timer = setTimeout(() => toast.classList.remove("show"), 2300);
}

productGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (!button) return;

  const product = products.find(p => p.id === Number(button.dataset.add));
  if (!product) return;

  cart.push(product);
  cartCount.textContent = cart.length;

  // Small cart counter bounce
  cartCount.animate(
    [
      { transform: "scale(1)" },
      { transform: "scale(1.5)" },
      { transform: "scale(1)" }
    ],
    { duration: 350, easing: "ease-out" }
  );

  notify(`💖 ${product.name} added to your cart!`);
});

searchInput.addEventListener("input", event => {
  searchTerm = event.target.value.trim().toLowerCase();
  renderProducts();
});

document.getElementById("filters").addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;

  activeCategory = button.dataset.category;

  document.querySelectorAll(".filter").forEach(filter => {
    filter.classList.toggle("active", filter === button);
  });

  renderProducts();
});

document.getElementById("cartButton").addEventListener("click", () => {
  if (!cart.length) {
    notify("🛍️ Your cart is waiting for something special!");
    return;
  }

  const total = cart.reduce((sum, product) => sum + product.price, 0);
  notify(`🛒 ${cart.length} items · Total ${money(total)}`);
});

document.getElementById("year").textContent = new Date().getFullYear();

renderProducts();

