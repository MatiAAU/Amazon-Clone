function getCartItems() {
    db.collection("cart-items").onSnapshot((snapshot) => {
        let cartItems = [];
        snapshot.docs.forEach((doc) => {
            cartItems.push({
                id: doc.id,
                ...doc.data()
            })
        })
        generateCartItems(cartItems);
        getTotalCost(cartItems);
    })
}

function generateCartItems(cartItems) {
    let productHTML = "";

    cartItems.forEach((product) => {
        productHTML += `
        <div class="cart-item flex items-center pb-4 border-b border-gray-100">

        <div class="cart-item-image w-40 h-24 bg-white p-4 rounded-lg">
            <img class="w-full h-full object-contain" src="${product.image}" alt="macBook">
        </div>

        <div class="cart-item-details flex-grow">
            <div class="cart-item-title font-bold text-gray-600">
                ${product.name}
            </div>
            <div class="cart-item-brand text-sm text-gray-400">
            ${product.producer}
            </div>
        </div>

        <div class="cart-item-counter w-48 flex items-center">
            <div data-id="${product.id}" class="cart-item-decrease cursor-pointer bg-gray-100 rounded text-gray-400 h-6 w-6 items-center justify-center flex hover:bg-gray-200">
                <i class="fas fa-chevron-left fa-xs"></i>
            </div>
            <h4 class="text-gray-400 p-2">x${product.quantity}</h4>
            <div data-id="${product.id}" class="cart-item-increase cursor-pointer bg-gray-100 rounded text-gray-400 h-6 w-6 items-center justify-center flex hover:bg-gray-200">
                <i class="fas fa-chevron-right fa-xs"></i>
            </div>
        </div>

        <div class="cart-item-total-cost w-48 font-bold text-gray-400">
            ${numeral(product.price * product.quantity).format('$0,0.00')}
        </div>

        <div data-id="${product.id}" class="cart-item-delete w-10 font-bold text-gray-300 cursor-pointer hover:text-gray-400">
            <i class="fas fa-times"></i>
        </div>
        
    </div>
        `
    })
    document.querySelector(".cart-items").innerHTML = productHTML;
    createEventListeners();
}

function getTotalCost(products) {
    let totalCost = 0;
    products.forEach((product) => {
        totalCost += (product.price * product.quantity);
    })
    document.querySelector(".total-cost-number").innerText = numeral(totalCost).format('$0,0.00');
}

function decreaseCount(productId) {
    let cartItem = db.collection("cart-items").doc(productId);
    cartItem.get().then((doc) => {
        if (doc.exists) {
            if (doc.data().quantity > 1) {
                cartItem.update({
                    quantity: doc.data().quantity - 1
                })
            }
        }
    })
}

function increaseCount(productId) {
    let cartItem = db.collection("cart-items").doc(productId);
    cartItem.get().then((doc) => {
        if (doc.exists) {
            if (doc.data().quantity > 0) {
                cartItem.update({
                    quantity: doc.data().quantity + 1
                })
            }
        }
    })
}

function deleteProduct(productId) {
    let cartItem = db.collection("cart-items").doc(productId);
    cartItem.get().then((doc) => {
        if (doc.exists) {
            if (doc.data().quantity > 0) {
                cartItem.delete();
            }
        }
    })
}

function createEventListeners() {
    let decreaseButtons = document.querySelectorAll(".cart-item-decrease");
    let increaseButtons = document.querySelectorAll(".cart-item-increase");
    let deleteButtons = document.querySelectorAll(".cart-item-delete");


    decreaseButtons.forEach((button) => {
        button.addEventListener("click", () => {
            decreaseCount(button.dataset.id);
        })
    })

    increaseButtons.forEach((button) => {
        button.addEventListener("click", () => {
            increaseCount(button.dataset.id);
        })
    })

    deleteButtons.forEach((button) => {
        button.addEventListener("click", () => {
            deleteProduct(button.dataset.id);
        })
    })
}

getCartItems();