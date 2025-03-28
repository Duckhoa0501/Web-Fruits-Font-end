    // Gọi API từ mục product.js
    import products from "./product.js";

    const searchInput = document.getElementById("search-text");
    const productContainerRight = document.querySelector(".order-right");
    const orderImage = document.querySelector(".order-image img");
    const orderName = document.querySelector(".order-span");
    const orderPrice = document.querySelector(".order-prices");
    const kgInput = document.getElementById("kg");
    const totalInput = document.getElementById("total")

    // Dùng để chuyển thẻ class active bằng for
    var items = document.querySelectorAll(".order-nav-link");
    for (var i=0; i < items.length; i++){
        items[i].addEventListener("click", function (){
            for(var j = 0; j < items.length; j++){
                items[j].classList.remove("active");
            }
            this.classList.add("active");
            var loai = this.textContent.trim();

            var LocProducts = [];
            if(loai === "ALL"){
                LocProducts = products;
            }else {
                for(var k = 0; k < products.length; k++){
                    if(products[k].loai == loai){
                        LocProducts.push(products[k]);
                    }
                }
            }
            HienThiProducts(LocProducts);
        });
    }

    // Hàm hiển thị danh sách sản phẩm
    function HienThiProducts(products) {
        productContainerRight.innerHTML = "";

        products.forEach(product => {
            const productItem = document.createElement("div");
            productItem.classList.add("product-list");
            productItem.setAttribute("data-name", product.name);
            productItem.setAttribute("data-price", product.price);
            productItem.setAttribute("data-img", product.img);

            productItem.innerHTML = `
                <div class="product-text">
                    <span>${product.name}</span>
                    <p>$ ${product.price.toFixed(2)} / Kg</p>
                </div>
                <div class="product-img">
                    <img src="${product.img}" alt="${product.name}">
                </div>
            `;

            productContainerRight.appendChild(productItem);
        });
    }

    // Xử lý sự kiện nhập dữ liệu trong ô tìm kiếm
    searchInput.addEventListener("input", function () {
        const searchText = this.value.trim().toLowerCase(); // Lấy giá trị nhập vào & chuyển thành chữ thường
        let activeCategory = document.querySelector(".order-nav-link.active").textContent.trim();
        let LocProducts = [];
        for(let i=0; i<products.length; i++){
            if(activeCategory === "ALL" || products[i].category == activeCategory){
                LocProducts.push(products[i])
            }
        }

        const SearchProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchText) // Lọc sản phẩm theo từ khóa tìm kiếm
        );

        HienThiProducts(SearchProducts);
    });

    // Lắng nghe nút click trên order-right
    productContainerRight.addEventListener("click", function (event) {
        const productItem = event.target.closest(".product-list");
        if (productItem) {
            const name = productItem.getAttribute("data-name");
            const price = parseFloat(productItem.getAttribute("data-price"));
            const img = productItem.getAttribute("data-img");

            orderName.textContent = name;
            orderPrice.textContent = `$ ${price.toFixed(2)} / Kg`;
            orderImage.src = img;

            kgInput.value = 0;
            totalInput.value = "";
            kgInput.setAttribute("data-price", price);
        }
    });

    kgInput.addEventListener("input", function () {
        let kg = parseFloat(this.value);
        let pricePerKg = parseFloat(this.getAttribute("data-price")); // Lấy giá

        if (!isNaN(kg) && kg > 0 && !isNaN(pricePerKg)) { 
            totalInput.value = (kg * pricePerKg).toFixed(2);
        } else {
            totalInput.value = ""; // Nếu sai dữ liệu thì không hiển thị
        }
    });

// Hiển thị danh sách ban đầu
HienThiProducts(products);

// Cập nhật tổng tiền giỏ hàng
function updateCartTotal() {
    let total = 0;
    document.querySelectorAll(".cart-total b").forEach(item => {
        total += parseFloat(item.textContent.replace("$", "")) || 0;
    });

    // Hiển thị tổng tiền trong sidebar
    document.querySelector(".cart-total-amount").textContent = `$${total.toFixed(2)}`;
}

document.addEventListener("DOMContentLoaded", function () {
    const sidebar = document.getElementById("sidebar");
    const openCartBtn = document.getElementById("nav-cart");
    const closeCartBtn = document.querySelector(".sidebar-close");

    // Mở sidebar khi click vào nút "BASKET"
    openCartBtn.addEventListener("click", function () {
        sidebar.classList.add("sidebar-open");
    });

    // Đóng sidebar khi click vào nút đóng
    closeCartBtn.addEventListener("click", function () {
        sidebar.classList.remove("sidebar-open");
    });
});

document.getElementById("order-add-cart").addEventListener("click", function () {
    const cartItemsContainer = document.querySelector(".cart-items");
    const productName = document.querySelector(".order-span").textContent;
    const productPrice = parseFloat(document.querySelector(".order-prices").textContent.replace("$", ""));
    const productImage = document.querySelector(".order-image img").src;
    const kg = parseFloat(document.getElementById("kg").value);
    const totalPrice = kg * productPrice;

    if (!kg || kg <= 0) {
        alert("Vui lòng chọn số lượng hợp lệ!");
        return;
    }

    // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
    let existingItem = Array.from(document.querySelectorAll(".cart-product")).find(item => 
        item.querySelector(".cart-name").textContent === productName
    );

    if (existingItem) {
        // Nếu sản phẩm đã có, tăng số lượng thay vì thêm mới
        let quantityElement = existingItem.querySelector(".cart-kg b");
        let newKg = parseFloat(quantityElement.textContent.replace(" kg", "")) + kg;
        quantityElement.textContent = `${newKg} kg`;

        let totalElement = existingItem.querySelector(".cart-total b");
        let newTotal = newKg * productPrice;
        totalElement.textContent = `$${newTotal.toFixed(2)}`;
    } else {
        // Nếu chưa có, thêm sản phẩm vào giỏ hàng
        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-product");
        cartItem.innerHTML = `
            <img src="${productImage}" alt="${productName}" class="cart-img">
            <div class="cart-details">
                <p class="cart-name">${productName}</p>
                <p class="cart-price">Giá: $${productPrice.toFixed(2)}</p>
                <p class="cart-kg">Số lượng: <b>${kg} kg</b></p>
                <p class="cart-total">Tổng tiền: <b>$${totalPrice.toFixed(2)}</b></p>
            </div>
            <button class="cart-remove"><i class="ri-delete-bin-line"></i></button>
        `;

        cartItemsContainer.appendChild(cartItem);

        // Xóa sản phẩm khi bấm nút "remove"
        cartItem.querySelector(".cart-remove").addEventListener("click", function () {
            cartItem.remove();
            updateCartTotal();
        });
    }

    updateCartTotal();
});

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("order-add-cart").addEventListener("click", function () {
        const kg = parseFloat(document.getElementById("kg").value);
        const cartCount = document.getElementById("cart-count");

        if (kg > 0) { // Chỉ cộng nếu kg > 0
            let currentCount = parseInt(cartCount.textContent) || 0;
            cartCount.textContent = currentCount + 1;

            // Hiển thị nếu đang ẩn
            cartCount.style.display = "flex";
        }
    });
});

