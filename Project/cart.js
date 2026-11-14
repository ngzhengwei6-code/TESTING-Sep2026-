var CART_KEY = "novaCart";

// Reads saved cart items from localStorage so they stay across pages
function getCart() {
var data = localStorage.getItem(CART_KEY);
if (data != null && data != "") {
return JSON.parse(data);
}
return [];
}

// Saves cart array to localStorage
function saveCart(cart) {
localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// Adds product to cart or increases quantity if already added
function addToCart(product, quantity) {
var cart = getCart();
var found = false;

for (var i = 0; i < cart.length; i++) {
if (cart[i].id == product.id) {
cart[i].quantity = cart[i].quantity + quantity;
found = true;
break;
}
}

if (found == false) {
cart.push({
id: product.id,
name: product.name,
price: product.price,
image: product.image,
quantity: quantity
});
}

saveCart(cart);
updateCartCount();
}

// Removes a product completely from the cart
function removeFromCart(id) {
var cart = getCart();
var updatedCart = [];

for (var i = 0; i < cart.length; i++) {
if (cart[i].id != id) {
updatedCart.push(cart[i]);
}
}

saveCart(updatedCart);
updateCartCount();
}

// Updates item quantity or removes it if quantity reaches 0
function updateItemQuantity(id, quantity) {
if (quantity <= 0) {
removeFromCart(id);
return;
}

var cart = getCart();
for (var i = 0; i < cart.length; i++) {
if (cart[i].id == id) {
cart[i].quantity = quantity;
break;
}
}

saveCart(cart);
updateCartCount();
}

// Calculates total price of all items in cart
function getCartTotal() {
var cart = getCart();
var total = 0;

for (var i = 0; i < cart.length; i++) {
total = total + (cart[i].price * cart[i].quantity);
}

return total;
}

// Updates the Cart (0) counter in the navigation bar
function updateCartCount() {
var countEl = document.getElementById("cart-count");
if (countEl == null) {
return;
}

var cart = getCart();
var totalItems = 0;

for (var i = 0; i < cart.length; i++) {
totalItems = totalItems + cart[i].quantity;
}

countEl.innerHTML = totalItems;
}