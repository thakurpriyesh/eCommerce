document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
    const cartItemsList = document.getElementById('cart-items');
    const checkoutButton = document.getElementById('checkout-btn');
    const wishlistItemsList = document.getElementById('wishlist-items');
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    // --- State Management ---
    let allProducts = [];
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    // --- Helper Functions ---
    const saveCart = () => localStorage.setItem('cart', JSON.stringify(cart));
    const saveWishlist = () => localStorage.setItem('wishlist', JSON.stringify(wishlist));

    const renderProducts = (productsToRender) => {
        if (!productList) return;
        productList.innerHTML = '';
        productsToRender.forEach(product => {
            const isWishlisted = wishlist.some(item => item.id == product.id);
            const wishlistIconClass = isWishlisted ? 'ri-heart-line active' : 'ri-heart-line';

            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.dataset.id = product.id;
            productCard.innerHTML = `
                <img src="${product.images[0]}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>$${product.price.toFixed(2)}</p>
                <div class="actions">
                    <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                    <button class="wishlist-btn" data-id="${product.id}"><i class="${wishlistIconClass}"></i></button>
                </div>
            `;
            productList.appendChild(productCard);
        });
    };

    const toggleWishlist = (productId) => {
        const product = allProducts.find(p => p.id == productId);
        const isWishlisted = wishlist.some(item => item.id == productId);

        if (isWishlisted) {
            wishlist = wishlist.filter(item => item.id != productId);
            alert(`${product.name} removed from wishlist!`);
        } else {
            wishlist.push(product);
            alert(`${product.name} added to wishlist!`);
        }
        saveWishlist();
        if (productList) renderProducts(allProducts);
        if (wishlistItemsList) renderWishlist();
    };

    const addToCart = (productId) => {
        const product = allProducts.find(p => p.id == productId);
        const cartItem = cart.find(item => item.id == productId);
        if (cartItem) {
            cartItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        saveCart();
        alert(`${product.name} added to cart!`);
    };

    const renderCart = () => {
        if (!cartItemsList) return;
        cartItemsList.innerHTML = '';
        if (cart.length === 0) {
            cartItemsList.innerHTML = '<p>Your cart is empty.</p>';
            return;
        }

        cart.forEach(item => {
            const cartItem = document.createElement('li');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.images[0]}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)}</p>
                    <p>Quantity: ${item.quantity}</p>
                </div>
                <div class="quantity-controls">
                    <button class="decrease-quantity" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="increase-quantity" data-id="${item.id}">+</button>
                </div>
                <button class="remove-from-cart" data-id="${item.id}">Remove</button>
            `;
            cartItemsList.appendChild(cartItem);
        });
    };

    const renderWishlist = () => {
        if (!wishlistItemsList) return;
        wishlistItemsList.innerHTML = '';
        if (wishlist.length === 0) {
            wishlistItemsList.innerHTML = '<p>Your wishlist is empty.</p>';
            return;
        }
        wishlist.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.dataset.id = product.id;
            productCard.innerHTML = `
                <img src="${product.images[0]}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>$${product.price.toFixed(2)}</p>
                <div class="actions">
                    <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                    <button class="remove-from-wishlist" data-id="${product.id}">Remove</button>
                </div>
            `;
            wishlistItemsList.appendChild(productCard);
        });
    };

    const displayProductDetails = (product) => {
        const productDetailContainer = document.getElementById('product-detail-container');
        if (!productDetailContainer) return;

        let specificationsHtml = '<table>';
        for (const key in product.specifications) {
            specificationsHtml += `<tr><td><strong>${key}:</strong></td><td>${product.specifications[key]}</td></tr>`;
        }
        specificationsHtml += '</table>';

        let thumbnailsHtml = '';
        product.images.forEach((image) => {
            thumbnailsHtml += `<img src="${image}" class="thumbnail" data-image-url="${image}">`;
        });

        const isWishlisted = wishlist.some(item => item.id == product.id);
        const wishlistIconClass = isWishlisted ? 'ri-heart-line active' : 'ri-heart-line';

        productDetailContainer.innerHTML = `
            <div class="product-image-gallery">
                <img id="main-image" src="${product.images[0]}" alt="${product.name}" class="main-image">
                <div class="thumbnail-container">
                    ${thumbnailsHtml}
                </div>
            </div>
            <div class="product-detail-info">
                <h1>${product.name}</h1>
                <h2>$${product.price.toFixed(2)}</h2>
                <p>${product.description}</p>
                <div class="specifications">
                    <h3>Specifications</h3>
                    ${specificationsHtml}
                </div>
                <div class="buttonsa">
                    <button class="add-to-car" data-id="${product.id}">Add to Cart</button>
                    <button class="wishlist-bt" data-id="${product.id}"><i class="${wishlistIconClass}"></i></button>
                </div>
            </div>
        `;

        const thumbnails = document.querySelectorAll('.thumbnail');
        const mainImage = document.getElementById('main-image');
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                mainImage.src = thumb.dataset.imageUrl;
            });
        });
    };

    // --- Event Listeners ---
    document.body.addEventListener('click', (e) => {
        const target = e.target;
        const productCard = target.closest('.product-card');
        const addToCartBtn = target.closest('.add-to-cart');
        const wishlistBtn = target.closest('.wishlist-btn');
        const removeWishlistBtn = target.closest('.remove-from-wishlist');
        const removeCartBtn = target.closest('.remove-from-cart');

        if (productCard && !addToCartBtn && !wishlistBtn && !removeWishlistBtn && !removeCartBtn) {
            window.location.href = `product.html?id=${productCard.dataset.id}`;
            return;
        }

        if (addToCartBtn) {
            addToCart(addToCartBtn.dataset.id);
            return;
        }

        if (wishlistBtn) {
            const icon = wishlistBtn.querySelector('i');
            icon.classList.toggle('active');
            toggleWishlist(wishlistBtn.dataset.id);
            return;
        }

        if (removeWishlistBtn) {
            const id = removeWishlistBtn.dataset.id;
            wishlist = wishlist.filter(item => item.id != id);
            saveWishlist();
            renderWishlist();
        }

        // --- Cart Page Specific Event Listeners ---
        if (cartItemsList) {
            const id = e.target.closest('button')?.dataset.id;
            if (!id) return;

            const item = cart.find(p => p.id == id);
            if (!item) return;

            if (e.target.classList.contains('increase-quantity')) {
                item.quantity++;
            } else if (e.target.classList.contains('decrease-quantity')) {
                if (item.quantity > 1) {
                    item.quantity--;
                } else {
                    cart = cart.filter(p => p.id != id);
                }
            } else if (e.target.classList.contains('remove-from-cart')) {
                cart = cart.filter(p => p.id != id);
            }

            saveCart();
            renderCart();
            return;
        }
    });

    if (searchButton) {
        searchButton.addEventListener('click', () => {
            const searchTerm = searchInput.value.toLowerCase();
            const filteredProducts = allProducts.filter(product =>
                product.name.toLowerCase().includes(searchTerm)
            );
            renderProducts(filteredProducts);
        });
    }

    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            alert('Checkout successful! Your order has been placed.');
            cart = [];
            saveCart();
            renderCart();
        });
    }

    if (wishlistItemsList) {
        wishlistItemsList.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-from-wishlist')) {
                const id = e.target.dataset.id;
                wishlist = wishlist.filter(item => item.id != id);
                saveWishlist();
                renderWishlist();
            }
        });
    }

    // --- Initial Page Load ---
    const init = async () => {
        try {
            const response = await fetch('products.json');
            allProducts = await response.json();

            if (productList) {
                renderProducts(allProducts);
            }
            if (cartItemsList) {
                renderCart();
            }
            if (wishlistItemsList) {
                renderWishlist();
            }
            if (productId) {
                const product = allProducts.find(p => p.id == productId);
                if (product) {
                    displayProductDetails(product);
                } else {
                    document.getElementById('product-detail-container').innerHTML = '<p>Product not found.</p>';
                }
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    init();
});