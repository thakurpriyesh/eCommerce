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

    /**
     * Shows a non-blocking notification message.
     * @param {string} message The message to display.
     * @param {string} type 'success' or 'error' for styling.
     */
    const showNotification = (message, type = 'success') => {
        const container = document.getElementById('notification-container');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        container.appendChild(notification);

        // Trigger the animations
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 10);

        // Remove the notification after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 500); // Wait for fade-out animation
        }, 3000);
    };

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
                <img src="${product.images[0]}" alt="${product.name}" onerror="this.src='https://placehold.co/300x200/eee/ccc?text=Image+N/A'">
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
        if (!product) return;
        
        const isWishlisted = wishlist.some(item => item.id == productId);

        if (isWishlisted) {
            wishlist = wishlist.filter(item => item.id != productId);
            showNotification(`${product.name} removed from wishlist!`);
        } else {
            wishlist.push(product);
            showNotification(`${product.name} added to wishlist!`);
        }
        saveWishlist();

        // Update UI everywhere
        if (productList) renderProducts(allProducts);
        if (wishlistItemsList) renderWishlist();

        // Update button on product detail page, if present
        const productDetailContainer = document.getElementById('product-detail-container');
        if (productDetailContainer) {
            const productDetailButton = productDetailContainer.querySelector(`.wishlist-btn[data-id="${productId}"]`);
            if (productDetailButton) {
                const icon = productDetailButton.querySelector('i');
                if (isWishlisted) { // The *old* state was wishlisted, so now it's not
                    icon.classList.remove('active');
                } else {
                    icon.classList.add('active');
                }
            }
        }
    };

    const addToCart = (productId) => {
        const product = allProducts.find(p => p.id == productId);
        if (!product) return;

        const cartItem = cart.find(item => item.id == productId);
        if (cartItem) {
            cartItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        saveCart();
        showNotification(`${product.name} added to cart!`);
    };

    const renderCart = () => {
        if (!cartItemsList) return;
        cartItemsList.innerHTML = '';
        if (cart.length === 0) {
            cartItemsList.innerHTML = '<p>Your cart is empty.</p>';
            return;
        }

        let subtotal = 0;
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;

            const cartItem = document.createElement('li');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.images[0]}" alt="${item.name}" onerror="this.src='https://placehold.co/80x80/eee/ccc?text=N/A'">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)}</p>
                    <p>Total: $${itemTotal.toFixed(2)}</p>
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

        // Add subtotal
        const subtotalElement = document.createElement('li');
        subtotalElement.style.textAlign = 'right';
        subtotalElement.style.paddingTop = '1rem';
        subtotalElement.style.fontWeight = 'bold';
        subtotalElement.style.fontSize = '1.2rem';
        subtotalElement.innerHTML = `<strong>Subtotal: $${subtotal.toFixed(2)}</strong>`;
        cartItemsList.appendChild(subtotalElement);
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
                <img src="${product.images[0]}" alt="${product.name}" onerror="this.src='https://placehold.co/300x200/eee/ccc?text=Image+N/A'">
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
            thumbnailsHtml += `<img src="${image}" class="thumbnail" data-image-url="${image}" onerror="this.src='https://placehold.co/80x80/eee/ccc?text=N/A'">`;
        });

        const isWishlisted = wishlist.some(item => item.id == product.id);
        const wishlistIconClass = isWishlisted ? 'ri-heart-line active' : 'ri-heart-line';

        productDetailContainer.innerHTML = `
            <div class="product-image-gallery">
                <img id="main-image" src="${product.images[0]}" alt="${product.name}" class="main-image" onerror="this.src='https://placehold.co/600x600/eee/ccc?text=Image+N/A'">
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
                    <!-- FIX: Changed class from add-to-car to add-to-cart -->
                    <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                    <!-- FIX: Changed class from wishlist-bt to wishlist-btn -->
                    <button class="wishlist-btn" data-id="${product.id}"><i class="${wishlistIconClass}"></i></button>
                </div>
            </div>
        `;

        // Add event listeners for new thumbnails
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

        // Check for product card click (but not on a button inside it)
        if (productCard && !addToCartBtn && !wishlistBtn && !removeWishlistBtn && !removeCartBtn) {
            window.location.href = `product.html?id=${productCard.dataset.id}`;
            return;
        }

        // Add to cart (works on grid and product page)
        if (addToCartBtn) {
            addToCart(addToCartBtn.dataset.id);
            return;
        }

        // Toggle wishlist (works on grid and product page)
        if (wishlistBtn) {
            toggleWishlist(wishlistBtn.dataset.id);
            return;
        }

        // Remove from wishlist (only on wishlist page)
        if (removeWishlistBtn) {
            const id = removeWishlistBtn.dataset.id;
            wishlist = wishlist.filter(item => item.id != id);
            saveWishlist();
            renderWishlist(); // Re-render wishlist page
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
            // If we are on the homepage, filter products
            if (productList) {
                const filteredProducts = allProducts.filter(product =>
                    product.name.toLowerCase().includes(searchTerm) ||
                    product.description.toLowerCase().includes(searchTerm)
                );
                renderProducts(filteredProducts);
            } else {
                // Otherwise, redirect to homepage with search query
                window.location.href = `index.html?search=${encodeURIComponent(searchTerm)}`;
            }
        });
    }

    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            if (cart.length > 0) {
                showNotification('Checkout successful! Your order has been placed.');
                cart = [];
                saveCart();
                renderCart();
            } else {
                showNotification('Your cart is empty!', 'error');
            }
        });
    }

    // --- Initial Page Load ---
    const init = async () => {
        try {
            const response = await fetch('products.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            allProducts = await response.json();

            // Check for search query in URL (for redirect from other pages)
            const searchQuery = urlParams.get('search');

            if (productList) {
                let productsToRender = allProducts;
                if (searchQuery) {
                    searchInput.value = searchQuery; // Populate search bar
                    productsToRender = allProducts.filter(product =>
                        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        product.description.toLowerCase().includes(searchQuery.toLowerCase())
                    );
                }
                renderProducts(productsToRender);
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
            if (productList) {
                productList.innerHTML = '<p>Error loading products. Please try again later.</p>';
            }
        }
    };

    init();
});

