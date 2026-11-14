var currentProduct = null;
var selectedQty = 1;

function goBack() {
if (window.history.length > 1) {
window.history.back();
return false; // cancel the link's own href, we're already going back
}
return true; // no history to go back to, so let the href take over
}

function formatPrice(amount) {
return "RM " + amount.toFixed(2);
}

// Helper to read query values like ?id=1 or ?category=Audio
function getUrlParameter(paramName) {
var query = window.location.search.substring(1);
var pairs = query.split("&");

for (var i = 0; i < pairs.length; i++) {
var parts = pairs[i].split("=");
if (parts[0] == paramName) {
return decodeURIComponent(parts[1].replace(/\+/g, " "));
}
}
return "";
}

/* ---------- Shop Page Functions ---------- */
function initShopPage() {
updateCartCount();
var requestedCategory = getUrlParameter("category");
var categoryFilter = document.getElementById("category-filter");

if (requestedCategory != "") {
categoryFilter.value = requestedCategory;
}

renderProducts();
}

function renderProducts() {
var grid = document.getElementById("shop-grid");
var searchTerm = document.getElementById("search-input").value.toLowerCase();
var category = document.getElementById("category-filter").value;
var htmlOutput = "";

for (var i = 0; i < products.length; i++) {
var product = products[i];
var matchesSearch = product.name.toLowerCase().indexOf(searchTerm) != -1;
var matchesCategory = (category == "all" || product.category == category);

if (matchesSearch && matchesCategory) {
htmlOutput = htmlOutput +
'<a href="product.html?id=' + product.id + '" class="product-card">' +
'<img src="' + product.image + '" alt="' + product.name + '">' +
'<div class="product-info">' +
'<h3>' + product.name + '</h3>' +
'<span class="price">' + formatPrice(product.price) + '</span>' +
'</div>' +
'</a>';
}
}

if (htmlOutput == "") {
grid.innerHTML = '<p class="empty-message">No products match your search.</p>';
} else {
grid.innerHTML = htmlOutput;
}
}

/* ---------- Product Detail Page Functions ---------- */
function initProductPage() {
updateCartCount();
var productId = Number(getUrlParameter("id"));

for (var i = 0; i < products.length; i++) {
if (products[i].id == productId) {
currentProduct = products[i];
break;
}
}

if (currentProduct == null) {
document.getElementById("product-detail-container").innerHTML =
'<p class="empty-message">Product not found. <a href="shop.html">Back to shop</a></p>';
return;
}

document.getElementById("product-image").src = currentProduct.image;
document.getElementById("product-image").alt = currentProduct.name;
document.getElementById("product-name").innerHTML = currentProduct.name;
document.getElementById("product-price").innerHTML = formatPrice(currentProduct.price);
document.getElementById("product-description").innerHTML = currentProduct.description;
}

function changeProductQty(amount) {
selectedQty = selectedQty + amount;
if (selectedQty < 1) {
selectedQty = 1;
}
document.getElementById("qty-value").innerHTML = selectedQty;
}

function handleAddToCart() {
if (currentProduct == null) {
return;
}
addToCart(currentProduct, selectedQty);
var message = document.getElementById("add-to-cart-message");
message.style.display = "block";
}

/* ---------- Cart Page Functions ---------- */
function initCartPage() {
updateCartCount();
renderCartPage();
}

function renderCartPage() {
var container = document.getElementById("cart-content");
var cart = getCart();

if (cart.length == 0) {
container.innerHTML = '<p class="empty-message">Your cart is empty. <a href="shop.html">Browse products</a></p>';
return;
}

var rowsHtml = "";
for (var i = 0; i < cart.length; i++) {
var item = cart[i];
var lineTotal = item.price * item.quantity;

rowsHtml = rowsHtml +
'<div class="cart-row">' +
'<img src="' + item.image + '" alt="' + item.name + '">' +
'<div class="cart-row-info">' +
'<h3>' + item.name + '</h3>' +
'<span class="price">' + formatPrice(item.price) + '</span>' +
'</div>' +
'<div class="qty-selector">' +
'<button type="button" onclick="changeCartItemQty(' + item.id + ', -1)">-</button>' +
'<span>' + item.quantity + '</span>' +
'<button type="button" onclick="changeCartItemQty(' + item.id + ', 1)">+</button>' +
'</div>' +
'<span class="line-total">' + formatPrice(lineTotal) + '</span>' +
'<button type="button" class="remove-btn" onclick="handleRemoveCartItem(' + item.id + ')">Remove</button>' +
'</div>';
}

var total = getCartTotal();

container.innerHTML =
'<div class="cart-items">' + rowsHtml + '</div>' +
'<div class="cart-summary">' +
'<p>Subtotal <span>' + formatPrice(total) + '</span></p>' +
'<p class="total-line">Total <span>' + formatPrice(total) + '</span></p>' +
'<a href="checkout.html" class="btn btn-primary">Proceed to Checkout</a>' +
'</div>';
}

function changeCartItemQty(id, change) {
var cart = getCart();
for (var i = 0; i < cart.length; i++) {
if (cart[i].id == id) {
updateItemQuantity(id, cart[i].quantity + change);
break;
}
}
renderCartPage();
}

function handleRemoveCartItem(id) {
removeFromCart(id);
renderCartPage();
}

/* ---------- Checkout Page Functions ---------- */
function initCheckoutPage() {
updateCartCount();
var cart = getCart();
var layout = document.getElementById("checkout-layout");
var summary = document.getElementById("order-summary");

if (cart.length == 0) {
layout.innerHTML = '<p class="empty-message">Your cart is empty. <a href="shop.html">Browse products</a></p>';
return;
}

var total = getCartTotal();
var itemsHtml = "";

for (var i = 0; i < cart.length; i++) {
var item = cart[i];
itemsHtml = itemsHtml +
'<p>' + item.name + ' x ' + item.quantity + ' <span>' + formatPrice(item.price * item.quantity) + '</span></p>';
}

summary.innerHTML =
'<h2>Order Summary</h2>' +
itemsHtml +
'<p class="total-line">Total <span>' + formatPrice(total) + '</span></p>';
}

// Form validation matching Lesson 16 & 17
function submitOrder() {
var fullName = document.checkoutForm.fullName.value;
if (fullName == "") {
alert("Please enter your Full Name!");
return false;
}

var email = document.checkoutForm.email.value;
if (email == "") {
alert("Please enter your Email address!");
return false;
}

var phone = document.checkoutForm.phone.value;
if (phone == "") {
alert("Please enter your Phone Number!");
return false;
}

var address = document.checkoutForm.address.value;
if (address == "") {
alert("Please enter your Delivery Address!");
return false;
}

var city = document.checkoutForm.city.value;
if (city == "") {
alert("Please enter your City / Postcode!");
return false;
}

if (confirm("Are you sure you want to place this order?") == false) {
return false;
}

var orderNumber = "NOVA-" + Math.floor(100000 + Math.random() * 900000);

document.getElementById("confirm-name").innerHTML = fullName;
document.getElementById("confirm-order-number").innerHTML = orderNumber;
document.getElementById("confirm-email").innerHTML = email;

document.getElementById("checkout-layout").style.display = "none";
document.getElementById("order-confirmation").style.display = "block";

saveCart([]);
updateCartCount();
return false;
}