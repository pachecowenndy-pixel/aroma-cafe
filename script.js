const cart = {};
const cartCount = document.querySelector("#cartCount");
const cartBadge = document.querySelector("#cartBadge");
const cartItems = document.querySelector("#cartItems");
const cartTotal = document.querySelector("#cartTotal");
const toast = document.querySelector("#toast");
let toastTimeout;

document.querySelector("#year").textContent = new Date().getFullYear();

function money(value) {
  return "$" + value.toFixed(2);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove("show"), 2300);
}

function renderCart() {
  const entries = Object.entries(cart);
  const totalItems = entries.reduce((sum, [, item]) => sum + item.quantity, 0);
  const totalPrice = entries.reduce((sum, [, item]) => sum + item.price * item.quantity, 0);

  cartCount.textContent = totalItems;
  cartBadge.textContent = totalItems;
  cartTotal.textContent = money(totalPrice);

  if (entries.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        <span>☕</span>
        <p>Tu próxima pausa está esperando.</p>
        <small>Agrega algo rico del menú.</small>
      </div>`;
    return;
  }

  cartItems.innerHTML = "";
  entries.forEach(([name, item]) => {
    const row = document.createElement("div");
    row.className = "cart-item";

    const info = document.createElement("div");
    const title = document.createElement("span");
    title.className = "cart-item-name";
    title.textContent = name;
    const price = document.createElement("span");
    price.className = "cart-item-price";
    price.textContent = `${money(item.price)} c/u`;
    info.append(title, price);

    const controls = document.createElement("div");
    controls.className = "cart-item-controls";

    const decrease = document.createElement("button");
    decrease.className = "quantity-button";
    decrease.type = "button";
    decrease.textContent = "−";
    decrease.setAttribute("aria-label", `Quitar una unidad de ${name}`);
    decrease.addEventListener("click", () => changeQuantity(name, -1));

    const quantity = document.createElement("span");
    quantity.className = "quantity";
    quantity.textContent = item.quantity;

    const increase = document.createElement("button");
    increase.className = "quantity-button";
    increase.type = "button";
    increase.textContent = "+";
    increase.setAttribute("aria-label", `Agregar una unidad de ${name}`);
    increase.addEventListener("click", () => changeQuantity(name, 1));

    const remove = document.createElement("button");
    remove.className = "remove-button";
    remove.type = "button";
    remove.textContent = "×";
    remove.setAttribute("aria-label", `Eliminar ${name} del carrito`);
    remove.addEventListener("click", () => {
      delete cart[name];
      renderCart();
      showToast(`${name} eliminado del carrito`);
    });

    controls.append(decrease, quantity, increase, remove);
    row.append(info, controls);
    cartItems.appendChild(row);
  });
}

function changeQuantity(name, change) {
  if (!cart[name]) return;
  cart[name].quantity += change;
  if (cart[name].quantity <= 0) delete cart[name];
  renderCart();
}

document.querySelectorAll(".add-button").forEach(button => {
  button.addEventListener("click", () => {
    const name = button.dataset.name;
    const price = Number(button.dataset.price);

    if (!cart[name]) cart[name] = { price, quantity: 0 };
    cart[name].quantity += 1;
    renderCart();
    showToast(`${name} agregado al carrito`);
  });
});

document.querySelector("#checkoutButton").addEventListener("click", () => {
  const itemCount = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
  if (itemCount === 0) {
    showToast("Tu carrito está vacío. Elige algo del menú.");
    return;
  }
  showToast(`¡Pedido de prueba listo! Total: ${cartTotal.textContent}`);
});

document.querySelector("#themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  document.querySelector("#themeToggle").textContent = isDark ? "☀" : "☾";
  document.querySelector("#themeToggle").setAttribute(
    "aria-label",
    isDark ? "Activar tema claro" : "Activar tema oscuro"
  );
});

const menuToggle = document.querySelector("#menuToggle");
const mainNav = document.querySelector("#mainNav");

menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
  menuToggle.textContent = isOpen ? "×" : "☰";
});

mainNav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";
  });
});

renderCart();
