
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

/* =========================
   NEXI SHOPPING ASSISTANT
========================= */

const chatToggle = document.getElementById("chatToggle");
const chatWidget = document.getElementById("chatWidget");
const chatClose = document.getElementById("chatClose");
const chatMessages = document.getElementById("chatMessages");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");

function toggleChat(open) {
  chatWidget.classList.toggle("open", open);
  chatWidget.setAttribute("aria-hidden", String(!open));
  chatToggle.setAttribute("aria-expanded", String(open));

  if (open) {
    chatInput.focus();
  }
}

chatToggle.addEventListener("click", () => {
  toggleChat(!chatWidget.classList.contains("open"));
});

chatClose.addEventListener("click", () => {
  toggleChat(false);
});

function addChatMessage(text, sender = "bot", extraHTML = "") {
  const message = document.createElement("div");
  message.className = `chat-message ${sender}-message`;

  const bubble = document.createElement("div");
  bubble.className = "message-bubble";

  // Use textContent for user and bot text to avoid HTML injection.
  bubble.textContent = text;

  if (sender === "bot") {
    const avatar = document.createElement("span");
    avatar.className = "message-avatar";
    avatar.textContent = "🤖";
    message.appendChild(avatar);
  }

  message.appendChild(bubble);

  if (extraHTML) {
    const extras = document.createElement("div");
    extras.innerHTML = extraHTML;
    bubble.appendChild(extras);
  }

  chatMessages.appendChild(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function chatProductCards(items) {
  return items.map(product => `
    <div class="chat-product">
      <img
        src="https://images.unsplash.com/${product.image}?auto=format&fit=crop&w=150&q=70"
        alt=""
      >
      <div class="chat-product-info">
        <strong>${product.name}</strong>
        <small>${money(product.price)}</small>
      </div>
      <button type="button" data-chat-add="${product.id}">
        Add +
      </button>
    </div>
  `).join("");
}

function handleChat(text) {
  const message = text.toLowerCase().trim();

  if (!message) return;

  if (/\b(hi|hello|hey|howdy)\b/.test(message)) {
    return {
      text: "Hey superstar! 💜 Welcome to NEXORA. What are you shopping for today?"
    };
  }

  if (message.includes("cart")) {
    if (!cart.length) {
      return {
        text: "Your cart is empty right now! 🛍️ Explore our products and tap Add to Cart to get started."
      };
    }

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const counts = {};

    cart.forEach(item => {
      counts[item.id] = (counts[item.id] || 0) + 1;
    });

    const summary = Object.entries(counts).map(([id, qty]) => {
      const product = products.find(p => p.id === Number(id));
      return `${product.name} × ${qty}`;
    }).join(", ");

    return {
      text: `Here's your cart! 🛒 ${summary}. Total: ${money(total)}.`
    };
  }

  if (/\b(shipping|delivery|deliver|ship)\b/.test(message)) {
    return {
      text: "🚚 Great question! This demo store doesn't yet have a live delivery service or shipping policy. Connect a backend to provide actual delivery estimates and shipping charges."
    };
  }

  if (/\b(return|refund|exchange)\b/.test(message)) {
    return {
      text: "💜 Our demo doesn't have a configured returns policy yet. Before selling real products, add your actual return and refund terms to your store."
    };
  }

  if (/\b(pay|payment|checkout|order|buy)\b/.test(message)) {
    return {
      text: "🛍️ You can add products to your cart here! Online checkout and payment processing haven't been connected yet."
    };
  }

  if (/\b(discount|offer|sale|cheap|budget)\b/.test(message)) {
    const affordable = [...products]
      .sort((a, b) => a.price - b.price)
      .slice(0, 3);

    return {
      text: "🎉 Looking for a great deal? Here are three of our lowest-priced demo products!",
      products: affordable
    };
  }

  if (/\b(popular|product|products|recommend|recommendation|shop|browse|show me|catalog)\b/.test(message)) {
    let results = products;

    if (message.includes("audio") || message.includes("headphone") || message.includes("earbud")) {
      results = products.filter(p => p.category === "Audio");
    } else if (message.includes("watch") || message.includes("wearable")) {
      results = products.filter(p => p.category === "Wearables");
    } else if (message.includes("accessor") || message.includes("shoe") || message.includes("sunglass")) {
      results = products.filter(p => p.category === "Accessories");
    } else if (message.includes("popular")) {
      results = products.slice(0, 4);
    }

    return {
      text: `I've found ${results.length} product(s) for you! ✨ Tap Add to pop a favorite into your cart.`,
      products: results.slice(0, 4)
    };
  }

  const matched = products.filter(p =>
    `${p.name} ${p.category}`.toLowerCase().includes(message)
  );

  if (matched.length) {
    return {
      text: "I found a match for you! 💖",
      products: matched.slice(0, 4)
    };
  }

  return {
    text: "I'm your NEXORA shopping buddy! 💜 Try asking me to show audio products, watches, accessories, deals, or your cart."
  };
}

function sendChat(text) {
  const cleanText = text.trim();
  if (!cleanText) return;

  addChatMessage(cleanText, "user");

  const reply = handleChat(cleanText);

  // Build product cards safely with DOM APIs.
  const productItems = reply.products || [];
  addChatMessage(reply.text, "bot");

  if (productItems.length) {
    const holder = document.createElement("div");
    holder.className = "quick-replies";
    holder.style.display = "block";

    productItems.forEach(product => {
      const card = document.createElement("div");
      card.className = "chat-product";

      const img = document.createElement("img");
      img.src = `https://images.unsplash.com/${product.image}?auto=format&fit=crop&w=150&q=70`;
      img.alt = product.name;

      const info = document.createElement("div");
      info.className = "chat-product-info";

      const name = document.createElement("strong");
      name.textContent = product.name;

      const price = document.createElement("small");
      price.textContent = money(product.price);

      const button = document.createElement("button");
      button.type = "button";
      button.textContent = "Add +";
      button.dataset.chatAdd = product.id;

      info.append(name, price);
      card.append(img, info, button);
      holder.appendChild(card);
    });

    chatMessages.appendChild(holder);
  }

  chatMessages.scrollTop = chatMessages.scrollHeight;
}

chatForm.addEventListener("submit", event => {
  event.preventDefault();

  const text = chatInput.value;
  chatInput.value = "";

  sendChat(text);
});

chatMessages.addEventListener("click", event => {
  const quickReply = event.target.closest("[data-chat]");
  const addButton = event.target.closest("[data-chat-add]");

  if (quickReply) {
    sendChat(quickReply.dataset.chat);
  }

  if (addButton) {
    const product = products.find(
      p => p.id === Number(addButton.dataset.chatAdd)
    );

    if (product) {
      addToCart(product.id);
      addButton.textContent = "Added ✓";
      addButton.disabled = true;
      addButton.style.opacity = "0.65";

      addChatMessage(
        `Added ${product.name} to your cart! 💖`,
        "bot"
      );
    }
  }
});

