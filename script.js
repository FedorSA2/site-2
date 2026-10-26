// ============ ДАННЫЕ ============
function getData() {
  const saved = localStorage.getItem('siteData');
  return saved ? JSON.parse(saved) : SITE_DATA;
}

// ============ "БАЗА ДАННЫХ" ЗАКАЗОВ (localStorage) ============
const OrdersDB = {
  getAll() {
    return JSON.parse(localStorage.getItem('orders') || '[]');
  },
  add(order) {
    const orders = this.getAll();
    order.id = Date.now();
    order.date = new Date().toLocaleString('ru-RU');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    return order;
  }
};

const data = getData();
let currentProduct = null;

// ============ ОТРИСОВКА САЙТА ============
function render() {
  document.title = data.site.title;
  document.getElementById('logoIcon').textContent = data.site.logo;
  document.getElementById('siteTitle').textContent = data.site.title;

  document.getElementById('heroTitle').textContent = data.hero.title;
  document.getElementById('heroSubtitle').textContent = data.hero.subtitle;
  document.getElementById('heroBtn').textContent = data.hero.buttonText;

  document.getElementById('aboutTitle').textContent = data.about.title;
  document.getElementById('aboutText').textContent = data.about.text;
  document.getElementById('aboutImage').src = data.about.image;

  // Преимущества
  const adv = document.getElementById('advantagesGrid');
  adv.innerHTML = '';
  data.advantages.forEach(a => {
    adv.innerHTML += `
      <div class="adv-card">
        <div class="icon">${a.icon}</div>
        <h3>${a.title}</h3>
        <p>${a.text}</p>
      </div>`;
  });

  // Товары с кнопкой "Купить"
  const prod = document.getElementById('productsGrid');
  prod.innerHTML = '';
  data.products.forEach((p, i) => {
    prod.innerHTML += `
      <div class="product-card">
        <img src="${p.image}" alt="${p.name}" />
        <div class="product-body">
          <h3>${p.name}</h3>
          <p class="desc">${p.description}</p>
          <div class="price-row">
            <div class="price">${p.price}</div>
            <button class="buy-btn" onclick="openOrderModal(${i})">🛒 Купить</button>
          </div>
        </div>
      </div>`;
  });

  // Подвал
  document.getElementById('footerLogo').textContent = `${data.site.logo} ${data.site.title}`;
  document.getElementById('footerAddress').textContent = data.footer.address;
  document.getElementById('footerPhone').textContent = '📞 ' + data.footer.phone;
  document.getElementById('footerEmail').textContent = '✉️ ' + data.footer.email;
  document.getElementById('footerCopyright').textContent = data.footer.copyright;
}

// ============ ОФОРМЛЕНИЕ ЗАКАЗА ============
const orderModal = document.getElementById('orderModal');
const orderForm = document.getElementById('orderForm');
const orderStatus = document.getElementById('orderStatus');
const orderProduct = document.getElementById('orderProduct');

window.openOrderModal = function (index) {
  currentProduct = data.products[index];
  orderProduct.innerHTML = `
    <img src="${currentProduct.image}" alt="" />
    <div>
      <strong>${currentProduct.name}</strong>
      <p class="price">${currentProduct.price}</p>
    </div>`;
  orderForm.reset();
  orderForm.quantity.value = 1;
  orderStatus.textContent = '';
  orderModal.classList.remove('hidden');
};

document.getElementById('orderCancel').onclick = () => {
  orderModal.classList.add('hidden');
  currentProduct = null;
};

orderForm.onsubmit = (e) => {
  e.preventDefault();
  if (!currentProduct) return;

  const formData = new FormData(orderForm);
  const order = {
    product: currentProduct.name,
    price: currentProduct.price,
    quantity: formData.get('quantity'),
    name: formData.get('name').trim(),
    phone: formData.get('phone').trim(),
    email: formData.get('email').trim(),
    address: formData.get('address').trim(),
    comment: formData.get('comment').trim()
  };

  OrdersDB.add(order);

  orderStatus.textContent = '✅ Заказ успешно оформлен! Мы свяжемся с вами в ближайшее время.';
  orderStatus.style.color = '#10b981';

  orderForm.reset();
  setTimeout(() => {
    orderModal.classList.add('hidden');
    currentProduct = null;
  }, 2000);
};

render();