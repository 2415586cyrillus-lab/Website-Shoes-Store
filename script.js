/* script.js final
 - carousel, catalog rendering, filters
 - cart + checkout
 - dropdowns rely on CSS hover (no JS)
*/

const DATA = [
  {
    id:1,
    name:"Running Pro Max",
    category:"men",
    brand:"FastRun",
    price:899000,
    img:"assets/runningpro.png",
    latest:true
  },
  {
    id:2,
    name:"Urban Streetwear",
    category:"men",
    brand:"CityWalk",
    price:749000,
    img:"assets/urbanstreet.jpg",
    latest:false
  },
  {
    id:3,
    name:"Black Elite Runner",
    category:"men",
    brand:"ProSport",
    price:1199000,
    img:"assets/blackelite.png",
    latest:true
  },
  {
    id:4,
    name:"Women Fitness Pro",
    category:"women",
    brand:"FitHer",
    price:750000,
    img:"assets/womenfit.jpg",
    latest:true
  },
  {
  id:10,
  name:"Casual Slip",
  category:"women",
  brand:"CityWalk",
  price:520000,
  img:"assets/casualslip.png",
  latest:false
},
  {
    id:5,
    name:"Designer Lux",
    category:"designer",
    brand:"Bgenx",
    price:2999000,
    img:"assets/designerlux.png",
    latest:false
  },
  {
    id:6,
    name:"Sport Xtreme",
    category:"sports",
    brand:"ProSport",
    price:1299000,
    img:"assets/sportxtreme.jpg",
    latest:true
  },
  {
  id:11,
  name:"Trail Master",
  category:"sports",
  brand:"TrailCo",
  price:980000,
  img:"assets/trailmaster.jpg",
  latest:true
},
  {
    id:7,
    name:"Kids MiniRun",
    category:"kids",
    brand:"TinyFeet",
    price:399000,
    img:"assets/kidsminirun.png",
    latest:false
  }
];


/* ===== CART ===== */
function getCart(){ return JSON.parse(localStorage.getItem('bgenx_cart')||'[]'); }
function saveCart(c){ localStorage.setItem('bgenx_cart', JSON.stringify(c)); }

function addToCart(id){
  const product = DATA.find(p=>p.id===id);
  if(!product) return;
  const cart = getCart();
  const item = cart.find(x=>x.id===id);
  if(item) item.qty++;
  else cart.push({id:product.id,name:product.name,price:product.price,img:product.img,qty:1});
  saveCart(cart);
  renderCart();
  toast('Ditambahkan ke keranjang');
}

function removeFromCart(id){
  let cart = getCart();
  cart = cart.filter(x=>x.id!==id);
  saveCart(cart);
  renderCart();
}

function renderCart(){
  const el = document.getElementById('cartDrawer');
  if(!el) return;
  const cart = getCart();
  el.innerHTML = '<h3>Keranjang</h3>';
  if(cart.length===0){
    el.innerHTML += '<p>Keranjang kosong</p>';
    el.innerHTML += '<div style="margin-top:12px"><button class="btn btn-primary" onclick="checkout()">Checkout</button></div>';
    return;
  }
  cart.forEach(i=>{
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `<img src="${i.img}"><div style="flex:1"><strong>${i.name}</strong><div>Rp ${i.price.toLocaleString()} x ${i.qty}</div></div>
      <div style="display:flex;flex-direction:column;gap:6px"><button class="btn btn-outline" onclick="removeFromCart(${i.id})">Hapus</button></div>`;
    el.appendChild(row);
  });
  const total = cart.reduce((s,i)=>s+i.price*i.qty,0);
  const footer = document.createElement('div');
  footer.style.marginTop = '10px';
  footer.innerHTML = `<div style="font-weight:700">Total: Rp ${total.toLocaleString()}</div>
    <div style="margin-top:10px;display:flex;gap:10px"><button class="btn btn-primary" onclick="checkout()">Checkout</button>
    <button class="btn btn-outline" onclick="clearCart()">Kosongkan</button></div>`;
  el.appendChild(footer);
}

function clearCart(){ localStorage.removeItem('bgenx_cart'); renderCart(); toast('Keranjang dikosongkan'); }

function checkout(){
  const cart = getCart();
  if(cart.length===0){ alert('Keranjang kosong'); return; }
  const total = cart.reduce((s,i)=>s+i.price*i.qty,0);
  const confirmMsg = `Total pembayaran: Rp ${total.toLocaleString()}\n\nLanjutkan checkout?`;
  if(confirm(confirmMsg)){
    // Simulate success -> clear cart
    localStorage.removeItem('bgenx_cart');
    renderCart();
    alert('Checkout berhasil. Terima kasih!');
  }
}

/* ===== TOAST ===== */
function toast(msg){
  const t = document.createElement('div');
  t.textContent = msg;
  Object.assign(t.style,{position:'fixed',left:'50%',top:'14%',transform:'translateX(-50%)',background:'rgba(0,0,0,0.8)',color:'#fff',padding:'8px 12px',borderRadius:'8px',zIndex:9999});
  document.body.appendChild(t);
  setTimeout(()=> t.style.opacity='0',1200);
  setTimeout(()=> t.remove(),1700);
}

/* ===== CAROUSEL ===== */
function initCarousel(){
  const wrap = document.querySelector('.carousel');
  if(!wrap) return;
  wrap.innerHTML = '';
  const latest = DATA.filter(p=>p.latest);
  // ensure at least 5 items (duplicate if needed) to avoid empty gap on edges
  let arr = [...latest];
  while(arr.length < 5){
    arr = arr.concat(latest.map(x=>({...x})));
    if(latest.length===0) break;
  }
  arr.forEach(p=>{
    const div = document.createElement('div');
    div.className = 'carousel-item';
    div.innerHTML = `<img src="${p.img}" alt="${p.name}"><div style="margin-top:8px">${p.name}</div><div style="font-weight:700;margin-top:6px">Rp ${p.price.toLocaleString()}</div>`;
    wrap.appendChild(div);
  });

  // buttons
  const prev = document.querySelector('.carousel-btn.prev');
  const next = document.querySelector('.carousel-btn.next');

  function step(){ return Math.max(240, wrap.clientWidth - 120); }

  if(prev) prev.onclick = ()=> wrap.scrollBy({left:-step(), behavior:'smooth'});
  if(next) next.onclick = ()=> wrap.scrollBy({left:step(), behavior:'smooth'});
}

/* ===== CATALOG ===== */
function populateBrands(category){
  const sel = document.getElementById('filterBrand');
  if(!sel) return;
  sel.innerHTML = '<option value="all">All Brands</option>';
  const brands = Array.from(new Set(DATA.filter(p=>p.category===category).map(p=>p.brand)));
  brands.forEach(b=>{
    const o = document.createElement('option'); o.value=b; o.textContent=b; sel.appendChild(o);
  });
}

function renderCatalog(category){
  const grid = document.getElementById('productGrid');
  if(!grid) return;
  grid.innerHTML = '';
  const brandSel = document.getElementById('filterBrand');
  const search = document.getElementById('filterSearch');
  const brand = brandSel ? brandSel.value : 'all';
  const keyword = search ? search.value.trim().toLowerCase() : '';

  let list = DATA.filter(p=>p.category===category);
  if(brand && brand!=='all') list = list.filter(p=>p.brand===brand);
  if(keyword) list = list.filter(p=>p.name.toLowerCase().includes(keyword));

  if(list.length===0){ grid.innerHTML = '<p>Tidak ada produk</p>'; return; }

  list.forEach(p=>{
    const d = document.createElement('div'); d.className='prod-card';
    d.innerHTML = `<img src="${p.img}"><h4>${p.name}</h4><div class="meta">${p.brand}</div><p><b>Rp ${p.price.toLocaleString()}</b></p>
      <div style="display:flex;gap:8px;margin-top:8px"><button class="btn btn-primary" onclick="addToCart(${p.id})">Add to cart</button>
      <button class="btn btn-outline" onclick="viewDetail(${p.id})">Detail</button></div>`;
    grid.appendChild(d);
  });
}

/* detail modal stub */
function viewDetail(id){
  const p = DATA.find(x=>x.id===id);
  if(!p) return;
  const modal = document.getElementById('detailModal');
  if(!modal) return;
  modal.querySelector('.d-img').src = p.img;
  modal.querySelector('.d-title').textContent = p.name;
  modal.querySelector('.d-meta').textContent = `${p.brand} • Rp ${p.price.toLocaleString()}`;
  modal.style.display = 'block';
  window._lastDetailId = id;
}

/* close detail */
function closeDetail(){ const m=document.getElementById('detailModal'); if(m) m.style.display='none'; }

/* init */
document.addEventListener('DOMContentLoaded', ()=>{
  initCarousel();
  renderCart();
  // cart toggle
  const cartToggle = document.getElementById('cartToggle');
  if(cartToggle) cartToggle.addEventListener('click', ()=>{
    const cd = document.getElementById('cartDrawer');
    if(cd.style.display === 'block'){ cd.style.display='none'; } else { cd.style.display='block'; renderCart(); }
  });

  // catalog pages
  const bodyCat = document.body.getAttribute('data-category');
  if(bodyCat){
    populateBrands(bodyCat);
    renderCatalog(bodyCat);
    const sel = document.getElementById('filterBrand');
    const search = document.getElementById('filterSearch');
    if(sel) sel.addEventListener('change', ()=> renderCatalog(bodyCat));
    if(search) search.addEventListener('input', ()=> renderCatalog(bodyCat));
  }

  const detailClose = document.getElementById('detailClose');
  if(detailClose) detailClose.addEventListener('click', closeDetail);
});
