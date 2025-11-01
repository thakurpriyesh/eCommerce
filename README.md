# 🛍️ GrabIt! E-commerce Project

A clean, responsive, and feature-rich front-end for a modern e-commerce store. This project is built with vanilla HTML, CSS, and JavaScript, demonstrating a complete user flow from browsing products to "checking out."

It uses `localStorage` to persist the user's cart and wishlist, providing a seamless experience even after closing the browser.

## ✨ Features

* **Responsive Design:** Looks great on desktop, tablets, and mobile devices.
* **Product Catalog:** Fetches products dynamically from a `products.json` file.
* **Search Functionality:** Filter products by name or description on the homepage.
* **Product Detail Page:** Click any product to see more details, including an image gallery.
* **Shopping Cart:**
    * Add/Remove items.
    * Increase/Decrease item quantity.
    * View running subtotal.
* **Wishlist:**
    * Add/Remove items from the wishlist.
    * Toggle wishlist status from product cards or the detail page.
* **Persistent State:** Your cart and wishlist are saved in your browser's `localStorage`.
* **Notifications:** User-friendly, non-blocking notifications for actions like "Added to Cart" or "Item removed."

## 💻 Tech Stack

* **HTML5:** Semantic HTML for structure.
* **CSS3:** Modern CSS with Flexbox, Grid, and media queries for styling and responsiveness.
* **JavaScript (ES6+):** Vanilla JS for all dynamic functionality, including DOM manipulation, event handling, and state management.
* **JSON:** Used as a simple "database" for product information.

## 📁 File Structure

```

eCommerce/
├── 📄 index.html        (Homepage / Product Listing)
├── 📄 product.html      (Product Detail Page)
├── 📄 cart.html         (Shopping Cart Page)
├── 📄 wishlist.html     (Wishlist Page)
├── 📄 profile.html      (Static User Profile Page)
├── 🎨 style.css         (All styles for the project)
├── 🚀 script.js         (All application logic)
├── 📦 products.json     (Product data)
└── 🖼️ image\_deed7f.jpg  (Project screenshot)

````

## 🚀 How to Run

Because this project uses the `fetch()` API to load `products.json`, you cannot run it by just opening the `index.html` file directly in your browser (due to security/CORS policies).

You must run it from a **local server**. The easiest way is:

**Using the VS Code "Live Server" Extension:**
1.  Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension in VS Code.
2.  Right-click on `index.html` in your file explorer.
3.  Click "Open with Live Server".

**Using a Terminal:**
1.  Open your terminal in the `eCommerce/` directory.
2.  If you have Python 3 installed, run:
    ```sh
    python -m http.server
    ```
3.  If you have Node.js installed, run:
    ```sh
    npx serve
    ```
4.  Open `http://localhost:8000` (or the port specified) in your browser.
