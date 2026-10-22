const whatsappNumber = "237676756564";
const services = {
    logo: "Logo",
    flyer: "Flyer",
    advert: "Advert",
    website: "Website"
};
const cart = new Map();

const cartToggle = document.querySelector("#cart-toggle");
const cartCount = document.querySelector("#cart-count");
const cartDialog = document.querySelector("#cart-dialog");
const cartClose = document.querySelector("#cart-close");
const cartItems = document.querySelector("#cart-items");
const cartEmpty = document.querySelector("#cart-empty");
const cartStatus = document.querySelector("#cart-status");
const checkoutButton = document.querySelector("#checkout-button");

function getCartQuantity() {
    return Array.from(cart.values()).reduce((total, quantity) => total + quantity, 0);
}

function renderCart() {
    cartItems.replaceChildren();

    for (const [serviceId, quantity] of cart) {
        const item = document.createElement("li");
        const label = document.createElement("span");
        const removeButton = document.createElement("button");

        label.textContent = `${services[serviceId]} x ${quantity}`;
        removeButton.type = "button";
        removeButton.className = "remove-item";
        removeButton.textContent = "Remove";
        removeButton.setAttribute("aria-label", `Remove ${services[serviceId]} from cart`);
        removeButton.addEventListener("click", () => {
            cart.delete(serviceId);
            cartStatus.textContent = `${services[serviceId]} removed from cart.`;
            renderCart();
        });

        item.append(label, removeButton);
        cartItems.append(item);
    }

    const quantity = getCartQuantity();
    cartCount.textContent = quantity;
    cartCount.hidden = quantity === 0;
    cartEmpty.hidden = quantity !== 0;
    checkoutButton.disabled = quantity === 0;
}

document.querySelectorAll("[data-service-id]").forEach((button) => {
    button.addEventListener("click", () => {
        const serviceId = button.dataset.serviceId;

        if (!services[serviceId]) return;

        cart.set(serviceId, (cart.get(serviceId) || 0) + 1);
        cartStatus.textContent = `${services[serviceId]} added to cart.`;
        renderCart();
    });
});

cartToggle.addEventListener("click", () => cartDialog.showModal());
cartClose.addEventListener("click", () => cartDialog.close());
cartDialog.addEventListener("click", (event) => {
    if (event.target === cartDialog) cartDialog.close();
});

checkoutButton.addEventListener("click", () => {
    const order = Array.from(cart, ([serviceId, quantity]) => `${services[serviceId]} x ${quantity}`);
    if (order.length === 0) return;

    const message = `Hello, I'd like to confirm an order for:\n${order.join("\n")}`;
    window.location.assign(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`);
});

renderCart();