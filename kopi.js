
/* =========================================
   KOPI LUWAK LAWAK
   Interactive Website
========================================= */


/* =========================================
   1. ELEMENT SELECTORS
========================================= */

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

const searchBtn = document.getElementById("searchBtn");
const searchSection = document.getElementById("searchSection");
const searchInput = document.getElementById("searchInput");
const clearSearch = document.getElementById("clearSearch");

const filterButtons = document.querySelectorAll(".filter-btn");
const productCards = document.querySelectorAll(".product-card");
const emptyMessage = document.getElementById("emptyMessage");

const cartBtn = document.getElementById("cartBtn");
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");

const toast = document.getElementById("toast");
const currentYear = document.getElementById("currentYear");


/* =========================================
   2. GLOBAL VARIABLES
========================================= */

let activeCategory = "semua";

let cart = [];

let toastTimeout;


/* =========================================
   3. FORMAT RUPIAH
========================================= */

function formatRupiah(number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(number);
}


/* =========================================
   4. MOBILE NAVIGATION
========================================= */

if (menuToggle && navMenu) {

    menuToggle.addEventListener("click", function () {

        const isOpen = navMenu.classList.toggle("open");

        menuToggle.setAttribute("aria-expanded", String(isOpen));

        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Tutup menu" : "Buka menu"
        );

        menuToggle.textContent = isOpen ? "✕" : "☰";

    });


    // Tutup menu setelah link diklik

    navMenu.querySelectorAll("a").forEach(function (link) {

        link.addEventListener("click", function () {

            navMenu.classList.remove("open");

            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Buka menu");

            menuToggle.textContent = "☰";

        });

    });


    // Tutup menu jika klik di luar navbar

    document.addEventListener("click", function (event) {

        const clickedInsideNavbar =
            navMenu.contains(event.target) ||
            menuToggle.contains(event.target);

        if (!clickedInsideNavbar) {

            navMenu.classList.remove("open");

            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Buka menu");

            menuToggle.textContent = "☰";

        }

    });

}


/* =========================================
   5. ACTIVE NAVBAR LINK
========================================= */

const navLinks = document.querySelectorAll(".nav-link");

navLinks.forEach(function (link) {

    link.addEventListener("click", function () {

        navLinks.forEach(function (item) {
            item.classList.remove("active");
        });

        link.classList.add("active");

    });

});


/* =========================================
   6. SEARCH TOGGLE
========================================= */

if (searchBtn && searchSection && searchInput) {

    searchBtn.addEventListener("click", function () {

        searchSection.classList.toggle("show");

        if (searchSection.classList.contains("show")) {

            searchInput.focus();

            searchSection.scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });

        }

    });

}


/* =========================================
   7. PRODUCT SEARCH
========================================= */

function filterProducts() {

    const keyword = searchInput
        ? searchInput.value.trim().toLowerCase()
        : "";

    let visibleCount = 0;

    productCards.forEach(function (card) {

        const productName = (
            card.dataset.name || ""
        ).toLowerCase();

        const productCategory = (
            card.dataset.category || ""
        ).toLowerCase();

        const productDescription = (
            card.querySelector(".product-content > p")?.textContent || ""
        ).toLowerCase();

        const matchesKeyword =
            productName.includes(keyword) ||
            productCategory.includes(keyword) ||
            productDescription.includes(keyword);

        const matchesCategory =
            activeCategory === "semua" ||
            productCategory === activeCategory;

        const isVisible = matchesKeyword && matchesCategory;

        card.hidden = !isVisible;

        if (isVisible) {
            visibleCount++;
        }

    });


    // Tampilkan pesan jika tidak ada hasil

    if (emptyMessage) {
        emptyMessage.hidden = visibleCount > 0;
    }

}


// Jalankan pencarian setiap kali pengguna mengetik

if (searchInput) {

    searchInput.addEventListener("input", filterProducts);

}


// Tombol hapus pencarian

if (clearSearch && searchInput) {

    clearSearch.addEventListener("click", function () {

        searchInput.value = "";

        filterProducts();

        searchInput.focus();

    });

}


/* =========================================
   8. PRODUCT CATEGORY FILTER
========================================= */

filterButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        // Simpan kategori yang dipilih

        activeCategory = button.dataset.category || "semua";


        // Perbarui tombol aktif

        filterButtons.forEach(function (item) {
            item.classList.remove("active");
        });

        button.classList.add("active");


        // Jalankan filter

        filterProducts();

    });

});


/* =========================================
   9. TOAST NOTIFICATION
========================================= */

function showToast(message) {

    if (!toast) {
        return;
    }

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimeout);

    toastTimeout = setTimeout(function () {

        toast.classList.remove("show");

    }, 2500);

}


/* =========================================
   10. ADD PRODUCT TO CART
========================================= */

const addCartButtons = document.querySelectorAll(".add-cart");

addCartButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const name = button.dataset.name;

        const price = Number(button.dataset.price);


        // Validasi data produk

        if (!name || !Number.isFinite(price) || price < 0) {

            showToast("Maaf, data produk tidak valid.");

            return;

        }


        // Cari produk yang sudah ada di keranjang

        const existingProduct = cart.find(function (item) {

            return item.name === name;

        });


        if (existingProduct) {

            existingProduct.quantity++;

        } else {

            cart.push({
                name: name,
                price: price,
                quantity: 1
            });

        }


        // Perbarui tampilan keranjang

        renderCart();


        // Notifikasi

        showToast(name + " berhasil ditambahkan! ☕");

    });

});


/* =========================================
   11. RENDER SHOPPING CART
========================================= */

function renderCart() {

    if (!cartItems || !cartCount || !cartTotal) {
        return;
    }


    // Hitung jumlah seluruh barang

    const totalQuantity = cart.reduce(function (total, item) {

        return total + item.quantity;

    }, 0);


    // Hitung harga keseluruhan

    const totalPrice = cart.reduce(function (total, item) {

        return total + (item.price * item.quantity);

    }, 0);


    // Perbarui indikator keranjang

    cartCount.textContent = totalQuantity;

    cartTotal.textContent = formatRupiah(totalPrice);


    // Reset isi keranjang

    cartItems.replaceChildren();


    // Jika keranjang kosong

    if (cart.length === 0) {

        const emptyText = document.createElement("p");

        emptyText.className = "cart-empty";

        emptyText.textContent =
            "Keranjangmu masih kosong. Yuk, pilih kopi favoritmu!";

        cartItems.appendChild(emptyText);

        return;

    }


    // Buat setiap item keranjang

    cart.forEach(function (item, index) {

        const itemElement = document.createElement("div");

        itemElement.className = "cart-item";


        // Informasi produk

        const info = document.createElement("div");

        info.className = "cart-item-info";


        const title = document.createElement("h4");

        title.textContent = item.name;


        const subtotal = document.createElement("p");

        subtotal.textContent = formatRupiah(
            item.price * item.quantity
        );


        info.append(title, subtotal);


        // Tombol kuantitas

        const actions = document.createElement("div");

        actions.className = "cart-item-actions";


        const decreaseButton = document.createElement("button");

        decreaseButton.className = "quantity-btn";

        decreaseButton.textContent = "−";

        decreaseButton.setAttribute(
            "aria-label",
            "Kurangi " + item.name
        );


        const quantity = document.createElement("span");

        quantity.className = "quantity-number";

        quantity.textContent = item.quantity;


        const increaseButton = document.createElement("button");

        increaseButton.className = "quantity-btn";

        increaseButton.textContent = "+";

        increaseButton.setAttribute(
            "aria-label",
            "Tambah " + item.name
        );


        // Tombol hapus

        const removeButton = document.createElement("button");

        removeButton.className = "remove-item";

        removeButton.textContent = "Hapus";


        // Kurangi kuantitas

        decreaseButton.addEventListener("click", function () {

            changeQuantity(index, -1);

        });


        // Tambah kuantitas

        increaseButton.addEventListener("click", function () {

            changeQuantity(index, 1);

        });


        // Hapus produk

        removeButton.addEventListener("click", function () {

            const removedName = cart[index].name;

            cart.splice(index, 1);

            renderCart();

            showToast(removedName + " dihapus dari keranjang.");

        });


        actions.append(
            decreaseButton,
            quantity,
            increaseButton,
            removeButton
        );


        itemElement.append(info, actions);

        cartItems.appendChild(itemElement);

    });

}


/* =========================================
   12. CHANGE PRODUCT QUANTITY
========================================= */

function changeQuantity(index, amount) {

    if (!cart[index]) {
        return;
    }


    cart[index].quantity += amount;


    // Hapus jika jumlahnya mencapai nol

    if (cart[index].quantity <= 0) {

        const removedName = cart[index].name;

        cart.splice(index, 1);

        showToast(removedName + " dihapus dari keranjang.");

    }


    renderCart();

}


/* =========================================
   13. CART BUTTON
========================================= */

if (cartBtn) {

    cartBtn.addEventListener("click", function () {

        const cartSection = document.getElementById("keranjang");

        if (cartSection) {

            cartSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    });

}


/* =========================================
   14. CHECKOUT
========================================= */

if (checkoutBtn) {

    checkoutBtn.addEventListener("click", function () {

        // Pastikan ada produk yang dipilih

        if (cart.length === 0) {

            showToast(
                "Keranjang masih kosong. Pilih kopi dulu, ya!"
            );

            return;

        }


        // Hitung total pesanan

        const total = cart.reduce(function (sum, item) {

            return sum + item.price * item.quantity;

        }, 0);


        // Susun ringkasan pesanan

        const orderLines = cart.map(function (item) {

            return (
                "- " +
                item.name +
                " x" +
                item.quantity +
                " = " +
                formatRupiah(item.price * item.quantity)
            );

        });


        const message = [
            "Halo Kopi Luwak Lawak!",
            "",
            "Saya ingin memesan:",
            ...orderLines,
            "",
            "Total: " + formatRupiah(total),
            "",
            "Mohon informasi cara pemesanannya."
        ].join("\n");


        /*
         * DEMO CHECKOUT
         *
         * Website ini belum terhubung dengan sistem
         * pembayaran atau WhatsApp toko.
         *
         * Untuk mengaktifkan pemesanan WhatsApp,
         * ganti bagian ini dengan nomor WhatsApp
         * resmi milik toko.
         */

        const whatsappNumber = "";


        if (!whatsappNumber) {

            // Tampilkan ringkasan pesanan jika nomor belum diatur

            alert(
                "RINGKASAN PESANAN\n\n" +
                message +
                "\n\nCheckout masih dalam mode demo. " +
                "Nomor WhatsApp toko belum diatur."
            );

            return;

        }


        // Buka WhatsApp jika nomor sudah diatur

        const whatsappURL =
            "https://wa.me/" +
            whatsappNumber +
            "?text=" +
            encodeURIComponent(message);

        window.open(whatsappURL, "_blank", "noopener,noreferrer");

    });

}


/* =========================================
   15. FOOTER YEAR
========================================= */

if (currentYear) {

    currentYear.textContent = new Date().getFullYear();

}


/* =========================================
   16. SCROLL REVEAL ANIMATION
========================================= */

const revealElements = document.querySelectorAll(
    ".product-card, .feature-card, .about-heading, .cta-card"
);


if ("IntersectionObserver" in window) {

    const revealObserver = new IntersectionObserver(
        function (entries, observer) {

            entries.forEach(function (entry) {

                if (entry.isIntersecting) {

                    entry.target.classList.add("revealed");

                    observer.unobserve(entry.target);

                }

            });

        },
        {
            threshold: 0.12
        }
    );


    revealElements.forEach(function (element) {

        element.classList.add("reveal");

        revealObserver.observe(element);

    });

}


/* =========================================
   17. INITIALIZE WEBSITE
========================================= */

filterProducts();

renderCart();

console.log(
    "☕ Kopi Luwak Lawak siap! Saatnya ngopi, baru lawak!"
);