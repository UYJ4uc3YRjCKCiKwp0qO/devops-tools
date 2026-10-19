
const products = [
  {
    id: 1,
    name: "Sonic Pro Headphones",
    category: "Audio",
    price: 2499,
    image: "photo-1505740420928-5e560c06d30e"
  },
  {
    id: 2,
    name: "Classic Time Watch",
    category: "Wearables",
    price: 1899,
    image: "photo-1523275335684-37898b6baf30"
  },
  {
    id: 3,
    name: "Urban Sneakers",
    category: "Accessories",
    price: 3299,
    image: "photo-1542291026-7eec264c27ff"
  },
  {
    id: 4,
    name: "Smart Fitness Watch",
    category: "Wearables",
    price: 2799,
    image: "photo-1524805444758-089113d48a6d"
  },
  {
    id: 5,
    name: "Wireless Earbuds",
    category: "Audio",
    price: 1499,
    image: "photo-1606220945770-b5b6c2c55bf1"
  },
  {
    id: 6,
    name: "Premium Sunglasses",
    category: "Accessories",
    price: 999,
    image: "photo-1511499767150-a48a237f0083"
  },
  {
    id: 7,
    name: "Studio Headphones",
    category: "Audio",
    price: 2199,
    image: "photo-1484704849700-f032a568e944"
  },
  {
    id: 8,
    name: "Minimalist Watch",
    category: "Wearables",
    price: 1699,
    image: "photo-1524592094714-0f0654e20314"
  }
];

let cart = [];
let activeCategory = "All";
let searchTerm = "";

const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const cartCount = document.getElementById("cartCount");
const toast = document.getElementById("toast");
const emptyMessage = document.getElementById("emptyMessage");

function formatPrice(price) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(price);
}

function renderProducts() {
  const filteredProducts = products.filter(product => {
    const matchesCategory =
      activeCategory === "All" ||
      product.category === activeCategory;

    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm);

    return matchesCategory && matchesSearch;
  });

  productGrid.innerHTML = filteredProducts.map((product, index) => `
    <article class="product-card"
      style="animation-delay: ${index * 70}ms">

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
        <span class="price">${formatPrice(product.price)}</span>
        <button class="add-button" data-add="${product.id}">
          + Add to cart
        </button>
      </div>
    </article>
  `).join("");

  emptyMessage.hidden = filteredProducts.length > 0;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

function addToCart(productId) {
  const product = products.find(item => item.id === productId);

  if (!product) return;

  cart.push(product);
  cartCount.textContent = cart.length;

  showToast(`${product.name} added to your cart! ✓`);
}

productGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");

  if (button) {
    addToCart(Number(button.dataset.add));
  }
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
  if (cart.length === 0) {
    showToast("Your cart is empty. Start shopping!");
    return;
  }

  const total = cart.reduce((sum, product) => sum + product.price, 0);

  showToast(
    `${cart.length} item(s) in cart · Total: ${formatPrice(total)}`
  );
});

document.getElementById("year").textContent =
  new Date().getFullYear();

renderProducts();

