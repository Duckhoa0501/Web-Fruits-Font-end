$(document).ready(function() {
    // Kiểm tra nhập tên (chỉ cho phép chữ, không số & ký tự đặc biệt)
    $("#name").on("input", function() {
        let nameRegex = /^[a-zA-ZÀ-Ỹà-ỹ\s]+$/;
        $("#name-error").toggleClass("d-none", nameRegex.test($(this).val()));
    });

    // Kiểm tra số điện thoại (chỉ cho phép số, 10-11 ký tự)
    $("#phone").on("input", function() {
        let phoneRegex = /^[0-9]{10,11}$/;
        $("#phone-error").toggleClass("d-none", phoneRegex.test($(this).val()));
    });

    // Kiểm tra địa chỉ (chỉ cho phép chữ và số, không ký tự đặc biệt)
    $("#address").on("input", function() {
        let addressRegex = /^[a-zA-Z0-9À-Ỹà-ỹ\s,]+$/;
        $("#address-error").toggleClass("d-none", addressRegex.test($(this).val()));
    });

    // Xử lý khi gửi form
    $("#shipping-form").submit(function(event) {
        event.preventDefault();

        let name = $("#name").val().trim();
        let phone = $("#phone").val().trim();
        let address = $("#address").val().trim();
        let shippingMethod = $("#shipping-method").val();

        // Kiểm tra nếu có lỗi hiển thị thì không gửi form
        if (!$("#name-error").hasClass("d-none") || 
            !$("#phone-error").hasClass("d-none") || 
            !$("#address-error").hasClass("d-none")) {
            alert("⚠️ Vui lòng kiểm tra lại thông tin!");
            return;
        }

        // Hiển thị thông tin đơn hàng
        $("#summary-name").text(name);
        $("#summary-phone").text(phone);
        $("#summary-address").text(address);
        $("#summary-method").text(shippingMethod === "Nhanh" ? "Giao Hàng Nhanh" : "Nhận tại Shop");

        // Hiển thị phần thông tin đơn hàng với hiệu ứng fadeIn
        $("#order-summary").fadeIn();
        $("#shipping-form")[0].reset();
    });

    // Hủy đơn hàng
    $("#cancel-order").click(function() {
        $("#order-summary").fadeOut();
    });
});