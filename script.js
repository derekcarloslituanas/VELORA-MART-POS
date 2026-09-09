/* =========================================================
   JAVASCRIPT FILE - VELORA MART
   This file contains the system logic, login, products,
   cart, inventory, checkout, sales history, localStorage,
   receipt generation, and printing.
   ========================================================= */

// ==================== JAVASCRIPT: DEFAULT USERS ====================

const defaultUsers = [
    {
        username: "ADMINISTRATOR",
        password: "ADMIN123",
        role: "Administrator"
    },
    {
        username: "CASHIER",
        password: "CASHIER123",
        role: "Cashier"
    }
];

// ==================== JAVASCRIPT: DEFAULT PRODUCTS ====================

const defaultProducts = [
    {id: 1, name: "Apple", category: "Produce", subcategory: "Fruits", price: 15, stock: 50, image: "🍎"},
    {id: 2, name: "Banana", category: "Produce", subcategory: "Fruits", price: 12, stock: 60, image: "🍌"},
    {id: 3, name: "Orange", category: "Produce", subcategory: "Fruits", price: 18, stock: 40, image: "🍊"},
    {id: 4, name: "Lemon", category: "Produce", subcategory: "Fruits", price: 10, stock: 35, image: "🍋"},
    {id: 5, name: "Grapes", category: "Produce", subcategory: "Fruits", price: 80, stock: 25, image: "🍇"},
    {id: 6, name: "Potatoes", category: "Produce", subcategory: "Vegetables", price: 55, stock: 30, image: "🥔"},
    {id: 7, name: "Onions", category: "Produce", subcategory: "Vegetables", price: 65, stock: 30, image: "🧅"},
    {id: 8, name: "Garlic", category: "Produce", subcategory: "Vegetables", price: 75, stock: 20, image: "🧄"},
    {id: 9, name: "Tomatoes", category: "Produce", subcategory: "Vegetables", price: 60, stock: 28, image: "🍅"},
    {id: 10, name: "Carrots", category: "Produce", subcategory: "Vegetables", price: 50, stock: 22, image: "🥕"},
    {id: 11, name: "Chicken Breast", category: "Meat", subcategory: "Poultry", price: 180, stock: 18, image: "🍗"},
    {id: 12, name: "Whole Chicken", category: "Meat", subcategory: "Poultry", price: 260, stock: 15, image: "🍗"},
    {id: 13, name: "Ground Beef", category: "Meat", subcategory: "Beef & Pork", price: 220, stock: 20, image: "🥩"},
    {id: 14, name: "Steak Cuts", category: "Meat", subcategory: "Beef & Pork", price: 350, stock: 12, image: "🥩"},
    {id: 15, name: "Pork Chops", category: "Meat", subcategory: "Beef & Pork", price: 190, stock: 18, image: "🥩"},
    {id: 16, name: "Bacon", category: "Meat", subcategory: "Beef & Pork", price: 160, stock: 15, image: "🥓"},
    {id: 17, name: "Salmon Fillets", category: "Seafood", subcategory: "Seafood", price: 320, stock: 10, image: "🐟"},
    {id: 18, name: "Shrimp", category: "Seafood", subcategory: "Seafood", price: 280, stock: 14, image: "🍤"},
    {id: 19, name: "Tilapia", category: "Seafood", subcategory: "Seafood", price: 150, stock: 16, image: "🐟"},
    {id: 20, name: "Canned Tuna", category: "Pantry", subcategory: "Canned Goods", price: 55, stock: 45, image: "🥫"},
    {id: 21, name: "Whole Milk", category: "Dairy", subcategory: "Milk", price: 95, stock: 20, image: "🥛"},
    {id: 22, name: "Skim Milk", category: "Dairy", subcategory: "Milk", price: 100, stock: 18, image: "🥛"},
    {id: 23, name: "Almond Milk", category: "Dairy", subcategory: "Milk", price: 145, stock: 12, image: "🥛"},
    {id: 24, name: "Cheddar Cheese", category: "Dairy", subcategory: "Cheese", price: 120, stock: 16, image: "🧀"},
    {id: 25, name: "Mozzarella", category: "Dairy", subcategory: "Cheese", price: 135, stock: 14, image: "🧀"},
    {id: 26, name: "Parmesan", category: "Dairy", subcategory: "Cheese", price: 180, stock: 9, image: "🧀"},
    {id: 27, name: "Greek Yogurt", category: "Dairy", subcategory: "Yogurt & Butter", price: 85, stock: 25, image: "🥣"},
    {id: 28, name: "Salted Butter", category: "Dairy", subcategory: "Yogurt & Butter", price: 110, stock: 20, image: "🧈"},
    {id: 29, name: "Margarine", category: "Dairy", subcategory: "Yogurt & Butter", price: 75, stock: 20, image: "🧈"},
    {id: 30, name: "Eggs", category: "Dairy", subcategory: "Yogurt & Butter", price: 10, stock: 70, image: "🥚"}
];

// ==================== JAVASCRIPT: DATA ====================

let users = JSON.parse(localStorage.getItem("veloraUsers")) || defaultUsers;
let products = JSON.parse(localStorage.getItem("veloraProducts")) || defaultProducts;
let sales = JSON.parse(localStorage.getItem("veloraSales")) || [];
let cart = [];
let currentUser = null;
let selectedCategory = "All";
let editingProductId = null;

saveProducts();

// ==================== JAVASCRIPT: HELPER FUNCTIONS ====================

function saveProducts() {
    localStorage.setItem("veloraProducts", JSON.stringify(products));
}

function saveSales() {
    localStorage.setItem("veloraSales", JSON.stringify(sales));
}

function money(value) {
    return "₱" + Number(value).toFixed(2);
}

function getProduct(id) {
    return products.find(product => product.id === Number(id));
}

function nextProductId() {
    return products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
}

function generateReceiptNumber() {
    return "VM-" + Date.now();
}

// ==================== JAVASCRIPT: LOGIN ====================

document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    const user = users.find(
        u => u.username.toUpperCase() === username.toUpperCase()
            && u.password === password
            && u.role === role
    );

    if (!user) {
        document.getElementById("loginMessage").textContent =
            "Invalid username, password, or role.";
        return;
    }

    currentUser = user;

    document.getElementById("loginPage").classList.add("hidden");
    document.getElementById("systemPage").classList.remove("hidden");
    document.getElementById("loggedUser").textContent =
        `${user.username} - ${user.role}`;

    applyRoleAccess();
    renderAll();
});

document.getElementById("logoutBtn").addEventListener("click", function() {
    currentUser = null;
    cart = [];

    document.getElementById("systemPage").classList.add("hidden");
    document.getElementById("loginPage").classList.remove("hidden");
    document.getElementById("loginForm").reset();
});

// ==================== JAVASCRIPT: ROLE ACCESS ====================

function applyRoleAccess() {
    const adminOnly = document.querySelectorAll(".admin-only");

    adminOnly.forEach(element => {
        if (currentUser.role === "Administrator") {
            element.classList.remove("hidden");
        } else {
            element.classList.add("hidden");
        }
    });
}

// ==================== JAVASCRIPT: TABS ====================

document.querySelectorAll(".tab-btn").forEach(button => {
    button.addEventListener("click", function() {
        document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
        this.classList.add("active");

        document.querySelectorAll(".content-section").forEach(section => {
            section.classList.add("hidden");
        });

        document.getElementById(this.dataset.section).classList.remove("hidden");

        renderAll();
    });
});

// ==================== JAVASCRIPT: PRODUCT DISPLAY ====================

function renderCategories() {
    const container = document.getElementById("categoryButtons");
    const categories = ["All", ...new Set(products.map(p => p.category))];

    container.innerHTML = "";

    categories.forEach(category => {
        const button = document.createElement("button");
        button.textContent = category;
        button.className = category === selectedCategory ? "active" : "";

        button.addEventListener("click", function() {
            selectedCategory = category;
            renderProducts();
            renderCategories();
        });

        container.appendChild(button);
    });
}

function renderProducts() {
    const grid = document.getElementById("productGrid");
    const search = document.getElementById("productSearch").value.toLowerCase();

    let filtered = products.filter(product => {
        const matchesCategory =
            selectedCategory === "All" || product.category === selectedCategory;

        const matchesSearch =
            product.name.toLowerCase().includes(search) ||
            product.subcategory.toLowerCase().includes(search);

        return matchesCategory && matchesSearch;
    });

    grid.innerHTML = "";

    filtered.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";

        card.innerHTML = `
            <div class="product-image">${product.image || "🛒"}</div>
            <h3>${product.name}</h3>
            <p>${product.category} / ${product.subcategory}</p>
            <p class="price">${money(product.price)}</p>
            <p>Stock: ${product.stock}</p>
            <button ${product.stock <= 0 ? "disabled" : ""}>
                ${product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
            </button>
        `;

        card.querySelector("button").addEventListener("click", function() {
            addToCart(product.id);
        });

        grid.appendChild(card);
    });
}

document.getElementById("productSearch").addEventListener("input", renderProducts);

// ==================== JAVASCRIPT: CART ====================

function addToCart(productId) {
    const product = getProduct(productId);

    if (!product || product.stock <= 0) {
        alert("This product is out of stock.");
        return;
    }

    const existing = cart.find(item => item.productId === product.id);

    if (existing) {
        if (existing.quantity >= product.stock) {
            alert("Quantity cannot exceed available stock.");
            return;
        }

        existing.quantity++;
    } else {
        cart.push({
            productId: product.id,
            quantity: 1
        });
    }

    renderCart();
}

function changeQuantity(productId, amount) {
    const product = getProduct(productId);
    const item = cart.find(item => item.productId === Number(productId));

    if (!item || !product) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        cart = cart.filter(i => i.productId !== Number(productId));
    }

    if (item.quantity > product.stock) {
        item.quantity = product.stock;
        alert("Quantity cannot exceed available stock.");
    }

    renderCart();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.productId !== Number(productId));
    renderCart();
}

function renderCart() {
    const container = document.getElementById("cartItems");

    if (cart.length === 0) {
        container.innerHTML = "<p>No products added to the order.</p>";
    } else {
        container.innerHTML = "";

        cart.forEach(item => {
            const product = getProduct(item.productId);
            if (!product) return;

            const lineTotal = product.price * item.quantity;

            const div = document.createElement("div");
            div.className = "cart-item";

            div.innerHTML = `
                <div class="cart-item-top">
                    <span>${product.name}</span>
                    <strong>${money(lineTotal)}</strong>
                </div>
                <small>${money(product.price)} each</small>

                <div class="quantity-controls">
                    <button>-</button>
                    <span>${item.quantity}</span>
                    <button>+</button>
                    <button class="danger-btn">Remove</button>
                </div>
            `;

            const buttons = div.querySelectorAll("button");
            buttons[0].addEventListener("click", () => changeQuantity(product.id, -1));
            buttons[1].addEventListener("click", () => changeQuantity(product.id, 1));
            buttons[2].addEventListener("click", () => removeFromCart(product.id));

            container.appendChild(div);
        });
    }

    updateTotals();
}

function calculateTotals() {
    const subtotal = cart.reduce((sum, item) => {
        const product = getProduct(item.productId);
        return sum + (product ? product.price * item.quantity : 0);
    }, 0);

    let discountPercent = Number(document.getElementById("discount").value) || 0;

    if (discountPercent < 0) discountPercent = 0;
    if (discountPercent > 100) discountPercent = 100;

    document.getElementById("discount").value = discountPercent;

    const discountAmount = subtotal * (discountPercent / 100);
    const total = subtotal - discountAmount;

    return {
        subtotal,
        discountPercent,
        discountAmount,
        total
    };
}

function updateTotals() {
    const totals = calculateTotals();

    document.getElementById("subtotal").textContent = money(totals.subtotal);
    document.getElementById("discountAmount").textContent = money(totals.discountAmount);
    document.getElementById("total").textContent = money(totals.total);

    updateChange();
}

document.getElementById("discount").addEventListener("input", updateTotals);
document.getElementById("cashReceived").addEventListener("input", updateChange);

function updateChange() {
    const total = calculateTotals().total;
    const cash = Number(document.getElementById("cashReceived").value) || 0;
    const change = Math.max(cash - total, 0);

    document.getElementById("change").textContent = money(change);
}

// ==================== JAVASCRIPT: PAYMENT ====================

document.getElementById("paymentMethod").addEventListener("change", function() {
    const cashBox = document.getElementById("cashBox");

    if (this.value === "Cash") {
        cashBox.classList.remove("hidden");
    } else {
        cashBox.classList.add("hidden");
    }
});

// ==================== JAVASCRIPT: CLEAR ORDER ====================

document.getElementById("clearCartBtn").addEventListener("click", function() {
    if (cart.length === 0) return;

    if (confirm("Clear the current order?")) {
        cart = [];
        document.getElementById("discount").value = 0;
        document.getElementById("cashReceived").value = 0;
        renderCart();
    }
});

// ==================== JAVASCRIPT: CHECKOUT ====================

document.getElementById("checkoutBtn").addEventListener("click", completeSale);

function completeSale() {
    if (cart.length === 0) {
        alert("Cannot complete checkout because the cart is empty.");
        return;
    }

    const totals = calculateTotals();
    const paymentMethod = document.getElementById("paymentMethod").value;
    const cashReceived =
        paymentMethod === "Cash"
            ? Number(document.getElementById("cashReceived").value) || 0
            : totals.total;

    if (paymentMethod === "Cash" && cashReceived < totals.total) {
        alert("Cash received is not enough.");
        return;
    }

    // Check stock one more time before completing the sale.
    for (const item of cart) {
        const product = getProduct(item.productId);

        if (!product || item.quantity > product.stock) {
            alert(`Not enough stock for ${product ? product.name : "a product"}.`);
            renderAll();
            return;
        }
    }

    // Deduct inventory after successful validation.
    cart.forEach(item => {
        const product = getProduct(item.productId);
        product.stock -= item.quantity;
    });

    const receiptNo = generateReceiptNumber();
    const date = new Date().toLocaleString();

    const sale = {
        receiptNo,
        date,
        cashier: currentUser.username,
        items: cart.map(item => {
            const product = getProduct(item.productId);
            return {
                name: product.name,
                price: product.price,
                quantity: item.quantity,
                total: product.price * item.quantity
            };
        }),
        itemCount: cart.reduce((sum, item) => sum + item.quantity, 0),
        subtotal: totals.subtotal,
        discountPercent: totals.discountPercent,
        discountAmount: totals.discountAmount,
        total: totals.total,
        paymentMethod,
        cashReceived,
        change: paymentMethod === "Cash" ? cashReceived - totals.total : 0
    };

    sales.unshift(sale);

    saveProducts();
    saveSales();

    showReceipt(sale);
    renderAll();
}

// ==================== JAVASCRIPT: RECEIPT ====================

function showReceipt(sale) {
    const receipt = document.getElementById("receiptPreview");

    let itemsHTML = "";

    sale.items.forEach(item => {
        itemsHTML += `
            <div class="receipt-line">
                <span>${item.name} x${item.quantity}</span>
                <span>${money(item.total)}</span>
            </div>
        `;
    });

    receipt.innerHTML = `
        <div class="receipt">
            <h2>VELORA MART</h2>
            <p class="center">Official Sales Receipt</p>
            <hr><br>

            <p>Receipt: ${sale.receiptNo}</p>
            <p>Date: ${sale.date}</p>
            <p>Cashier: ${sale.cashier}</p>

            <br>
            ${itemsHTML}

            <div class="receipt-line receipt-total">
                <span>Subtotal</span>
                <span>${money(sale.subtotal)}</span>
            </div>

            <div class="receipt-line">
                <span>Discount (${sale.discountPercent}%)</span>
                <span>- ${money(sale.discountAmount)}</span>
            </div>

            <div class="receipt-line receipt-total">
                <span>TOTAL</span>
                <span>${money(sale.total)}</span>
            </div>

            <br>
            <p>Payment: ${sale.paymentMethod}</p>
            <p>Cash Received: ${money(sale.cashReceived)}</p>
            <p>Change: ${money(sale.change)}</p>

            <br>
            <p class="center">Thank you for shopping!</p>
        </div>
    `;

    document.getElementById("receiptModal").classList.remove("hidden");
}

document.getElementById("newCheckoutBtn").addEventListener("click", function() {
    document.getElementById("receiptModal").classList.add("hidden");

    cart = [];
    document.getElementById("discount").value = 0;
    document.getElementById("cashReceived").value = 0;
    document.getElementById("paymentMethod").value = "Cash";
    document.getElementById("cashBox").classList.remove("hidden");

    renderCart();
});

document.getElementById("printReceiptBtn").addEventListener("click", function() {
    const receiptHTML = document.getElementById("receiptPreview").innerHTML;

    const printWindow = window.open("", "_blank", "width=450,height=700");

    printWindow.document.write(`
        <html>
        <head>
            <title>VELORA MART Receipt</title>
            <style>
                body {
                    font-family: "Courier New", monospace;
                    padding: 20px;
                }
                .receipt {
                    max-width: 380px;
                    margin: auto;
                }
                h2, .center {
                    text-align: center;
                }
                .receipt-line {
                    display: flex;
                    justify-content: space-between;
                    margin: 5px 0;
                }
                .receipt-total {
                    border-top: 1px dashed #333;
                    padding-top: 8px;
                    margin-top: 8px;
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            ${receiptHTML}
            <script>
                window.onload = function() {
                    window.print();
                };
            <\/script>
        </body>
        </html>
    `);

    printWindow.document.close();
});

// ==================== JAVASCRIPT: PRODUCT CRUD ====================

document.getElementById("addProductBtn").addEventListener("click", function() {
    editingProductId = null;
    document.getElementById("modalTitle").textContent = "Add Product";
    document.getElementById("productForm").reset();
    document.getElementById("productId").value = "";
    document.getElementById("productModal").classList.remove("hidden");
});

document.getElementById("closeModalBtn").addEventListener("click", closeProductModal);

function closeProductModal() {
    document.getElementById("productModal").classList.add("hidden");
}

document.getElementById("productForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("productName").value.trim();
    const category = document.getElementById("productCategory").value.trim();
    const subcategory = document.getElementById("productSubcategory").value.trim();
    const price = Number(document.getElementById("productPrice").value);
    const stock = Number(document.getElementById("productStock").value);
    const image = document.getElementById("productImage").value.trim() || "🛒";

    if (price < 0 || stock < 0) {
        alert("Price and stock cannot be negative.");
        return;
    }

    if (editingProductId) {
        const product = getProduct(editingProductId);

        product.name = name;
        product.category = category;
        product.subcategory = subcategory;
        product.price = price;
        product.stock = stock;
        product.image = image;
    } else {
        products.push({
            id: nextProductId(),
            name,
            category,
            subcategory,
            price,
            stock,
            image
        });
    }

    saveProducts();
    closeProductModal();
    renderAll();
});

function editProduct(id) {
    const product = getProduct(id);
    if (!product) return;

    editingProductId = product.id;

    document.getElementById("modalTitle").textContent = "Edit Product";
    document.getElementById("productId").value = product.id;
    document.getElementById("productName").value = product.name;
    document.getElementById("productCategory").value = product.category;
    document.getElementById("productSubcategory").value = product.subcategory;
    document.getElementById("productPrice").value = product.price;
    document.getElementById("productStock").value = product.stock;
    document.getElementById("productImage").value = product.image;

    document.getElementById("productModal").classList.remove("hidden");
}

function deleteProduct(id) {
    const product = getProduct(id);
    if (!product) return;

    if (!confirm(`Delete ${product.name}?`)) return;

    products = products.filter(p => p.id !== Number(id));
    cart = cart.filter(item => item.productId !== Number(id));

    saveProducts();
    renderAll();
}

// ==================== JAVASCRIPT: INVENTORY ====================

function renderInventory() {
    const tbody = document.getElementById("inventoryTable");

    tbody.innerHTML = products.map(product => {
        const lowStock = product.stock <= 10;

        return `
            <tr>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>${money(product.price)}</td>
                <td>${product.stock}</td>
                <td class="${lowStock ? "low-stock" : "in-stock"}">
                    ${lowStock ? "LOW STOCK" : "IN STOCK"}
                </td>
                <td>
                    <button onclick="adjustStock(${product.id}, 1)">+1</button>
                    <button onclick="adjustStock(${product.id}, -1)">-1</button>
                    <button onclick="editProduct(${product.id})">Edit</button>
                </td>
            </tr>
        `;
    }).join("");

    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    const lowStockCount = products.filter(p => p.stock <= 10).length;
    const inventoryValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

    document.getElementById("statProducts").textContent = products.length;
    document.getElementById("statStock").textContent = totalStock;
    document.getElementById("statLowStock").textContent = lowStockCount;
    document.getElementById("statValue").textContent = money(inventoryValue);
}

function adjustStock(id, amount) {
    const product = getProduct(id);
    if (!product) return;

    product.stock += amount;

    if (product.stock < 0) {
        product.stock = 0;
    }

    saveProducts();
    renderAll();
}

// ==================== JAVASCRIPT: PRODUCT TABLE ====================

function renderProductsTable() {
    const tbody = document.getElementById("productsTable");

    tbody.innerHTML = products.map(product => `
        <tr>
            <td class="table-image">${product.image || "🛒"}</td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>${product.subcategory}</td>
            <td>${money(product.price)}</td>
            <td>${product.stock}</td>
            <td class="action-buttons">
                <button onclick="editProduct(${product.id})">Edit</button>
                <button class="danger-btn" onclick="deleteProduct(${product.id})">Delete</button>
            </td>
        </tr>
    `).join("");
}

// ==================== JAVASCRIPT: SALES HISTORY ====================

function renderSales() {
    const tbody = document.getElementById("salesTable");

    if (sales.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7">No completed sales yet.</td></tr>`;
        return;
    }

    tbody.innerHTML = sales.map(sale => `
        <tr>
            <td>${sale.receiptNo}</td>
            <td>${sale.date}</td>
            <td>${sale.cashier}</td>
            <td>${sale.itemCount}</td>
            <td>${sale.paymentMethod}</td>
            <td>${money(sale.total)}</td>
            <td><button onclick="viewSaleReceipt('${sale.receiptNo}')">View Receipt</button></td>
        </tr>
    `).join("");
}

function viewSaleReceipt(receiptNo) {
    const sale = sales.find(s => s.receiptNo === receiptNo);
    if (sale) {
        showReceipt(sale);
    }
}

// ==================== JAVASCRIPT: RENDER ALL ====================

function renderAll() {
    renderCategories();
    renderProducts();
    renderCart();
    renderInventory();
    renderProductsTable();
    renderSales();
}

// ==================== JAVASCRIPT: INITIAL SETUP ====================

document.getElementById("cashBox").classList.remove("hidden");
renderAll();
