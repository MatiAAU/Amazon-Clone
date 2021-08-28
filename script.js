
function getProducts() {
    db.collection("products").get().then((querySnapshot) => {
        let products = [];

        querySnapshot.forEach((doc) => {

            products.push({
                id: doc.id,
                image: doc.data().image,
                name: doc.data().name,
                producer: doc.data().producer,
                rating: doc.data().rating,
                price: doc.data().price,
            })
        });
        generateProducts(products);
    });
}

function addToCart(product) {
    let cartItem = db.collection("cart-items").doc(product.id);
    cartItem.get().then((doc) => {
        if (doc.exists) {
            cartItem.update({
                quantity: doc.data().quantity + 1
            })
        } else {
            cartItem.set({
                image: product.image,
                name: product.name,
                producer: product.producer,
                rating: product.rating,
                price: product.price,
                quantity: 1
            })
        }
    })
    

}


function generateProducts(products) {

    products.forEach((product) => {

        let doc = document.createElement("div");
        doc.classList.add("main-product", "mr-5");
        doc.innerHTML = `

                <div class="product-image w-48 h-36 bg-white rounded-lg p-4">
                    <img class="w-full h-full object-contain" src="${product.image}" alt="nintendo-switch">
                </div>

                <div class="product-name text-gray-700 font-bold mt-2 text-sm">
                    ${product.name}
                </div>

                <div class="product-make text-green-700 font-bold">
                    ${product.producer}
                </div>

                <div class="product-rating text-yellow-300 font-bold my-1">
                    ⭐⭐⭐⭐⭐ ${product.rating}
                </div>

                <div class="product-price font-bold text-gray-700 text-lg">
                ${numeral(product.price).format('$0,0.00')}
                </div>

        `
        let addToCartEl = document.createElement("div");

        addToCartEl.classList.add("h-8", "w-28", "bg-yellow-500", "text-white", "text-md", "hover:bg-yellow-600", "rounded", "flex", "justify-center", "items-center", "cursor-pointer");
        addToCartEl.innerText = "Add to cart";
        addToCartEl.addEventListener("click", function() {
            addToCart(product);
        })
        doc.appendChild(addToCartEl);
        document.querySelector(".main-section-products").appendChild(doc);
    })
}

getProducts();