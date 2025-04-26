// Ürün verileri
const products = {
    1: { id: 1, name: 'Ürün 1', price: 199.99, image: 'https://via.placeholder.com/200' },
    2: { id: 2, name: 'Ürün 2', price: 299.99, image: 'https://via.placeholder.com/200' },
    3: { id: 3, name: 'Ürün 3', price: 399.99, image: 'https://via.placeholder.com/200' }
};

// Sepet işlemleri
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let cartCount = cart.length;

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function addToCart(productId) {
    cart.push(products[productId]);
    cartCount++;
    updateCartCount();
    saveCart();
    showNotification('Başarıyla sepete eklendi!');
    // Sepet sayfasına yönlendir
    window.location.href = 'cart.html';
}

function updateCartCount() {
    const cartElement = document.getElementById('cart');
    if (cartElement) {
        cartElement.textContent = `Sepet (${cartCount})`;
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function removeFromCart(index) {
    cart.splice(index, 1);
    cartCount--;
    updateCartCount();
    saveCart();
    showNotification('Ürün sepetten kaldırıldı!');
    displayCart(); // Sepet görünümünü güncelle
}

// Kredi kartı formatını düzenle (4 haneli gruplar)
function formatCardNumber(e) {
    let input = e.target;
    let value = input.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let matches = value.match(/.{1,4}/g);
    if (matches) {
        input.value = matches.join(' ');
    }
}

// Son kullanma tarihi formatını düzenle (AA/YY)
function formatExpiry(e) {
    let input = e.target;
    let value = input.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (value.length > 2) {
        input.value = value.substr(0, 2) + '/' + value.substr(2);
    }
}

// Ödeme işlemini gerçekleştir
function processPayment(event) {
    event.preventDefault();
    
    // Form verilerini al
    const fullname = document.getElementById('fullname').value;
    const address = document.getElementById('address').value;
    const phone = document.getElementById('phone').value;
    const cardNumber = document.getElementById('card-number').value;
    const expiry = document.getElementById('expiry').value;
    const cvv = document.getElementById('cvv').value;

    // Basit doğrulama
    if (!fullname || !address || !phone || !cardNumber || !expiry || !cvv) {
        showNotification('Lütfen tüm alanları doldurun!');
        return false;
    }

    // Başarılı ödeme simülasyonu
    showNotification('Ödeme başarıyla tamamlandı!');
    
    // Sepeti temizle
    cart = [];
    cartCount = 0;
    saveCart();
    updateCartCount();

    // Ana sayfaya yönlendir
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);

    return false;
}

// Sayfa yüklenirken kredi kartı input olaylarını ekle
document.addEventListener('DOMContentLoaded', function() {
    const cardNumber = document.getElementById('card-number');
    const expiry = document.getElementById('expiry');
    
    if (cardNumber) {
        cardNumber.addEventListener('input', formatCardNumber);
    }
    
    if (expiry) {
        expiry.addEventListener('input', formatExpiry);
    }

    // Ödeme sayfasındaysak sipariş özetini göster
    displayCheckoutSummary();
});

// Sipariş özetini göster
function displayCheckoutSummary() {
    const checkoutItems = document.getElementById('checkout-items');
    const checkoutTotal = document.getElementById('checkout-total');
    
    if (!checkoutItems || !checkoutTotal) return;

    let total = 0;
    checkoutItems.innerHTML = cart.map(item => {
        total += item.price;
        return `
            <div class="checkout-item">
                <span>${item.name}</span>
                <span>${item.price.toFixed(2)} TL</span>
            </div>
        `;
    }).join('');

    checkoutTotal.textContent = total.toFixed(2) + ' TL';
}

function displayCart() {
    const cartItems = document.getElementById('cart-items');
    if (!cartItems) return; // Sepet sayfasında değilsek çık

    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">Sepetiniz boş</div>';
        document.getElementById('cart-total').textContent = '0.00 TL';
        return;
    }

    let total = 0;
    cartItems.innerHTML = cart.map((item, index) => {
        total += item.price;
        return `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                </div>
                <div class="cart-item-price">${item.price.toFixed(2)} TL</div>
                <button class="remove-item" onclick="removeFromCart(${index})">Çıkar</button>
            </div>
        `;
    }).join('');

    document.getElementById('cart-total').textContent = total.toFixed(2) + ' TL';
}

// Sayfa yüklenirken sepet sayısını güncelle ve sepet içeriğini göster
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    displayCart();
});

// Giriş işlemi
function login(event) {
    event.preventDefault();
    
    const fullname = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Normalde burada bir API'ye istek atılır
    // Şimdilik basit bir kontrol yapıyoruz
    if (fullname && email && password) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', fullname);
        alert('Başarıyla giriş yaptınız!');
        window.location.href = 'index.html';
    } else {
        alert('Lütfen tüm alanları doldurun!');
    }
}

// Kayıt işlemi
function register(event) {
    event.preventDefault();
    
    const fullname = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        alert('Şifreler eşleşmiyor!');
        return;
    }

    // Normalde burada bir API'ye istek atılır
    // Şimdilik basit bir kontrol yapıyoruz
    if (fullname && email && password) {
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', fullname);
        alert('Kayıt başarılı! Giriş yapabilirsiniz.');
        window.location.href = 'login.html';
    } else {
        alert('Lütfen tüm alanları doldurun!');
    }
}

// Sayfa yüklendiğinde giriş kontrolü
document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userEmail = localStorage.getItem('userEmail');
    
    if (isLoggedIn && userEmail) {
        // Kullanıcı girişi yapılmışsa bazı UI elementlerini güncelle
        const loginLink = document.querySelector('a[href="login.html"]');
        if (loginLink) {
            loginLink.textContent = userEmail;
            loginLink.href = '#';
        }
    }
});
