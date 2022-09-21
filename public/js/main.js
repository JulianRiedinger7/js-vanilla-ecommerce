const loader = document.querySelector('.loader')
const home = document.querySelector('.home')
const header = document.querySelector('header')
const footer = document.querySelector('footer')
const featured = document.querySelector('.home .featured')
const categoriesSection = document.querySelector('.categories')
const categoryProductsSection = document.querySelector('.category-products')
const modal = document.querySelector('.modal')
const cartIcon = document.querySelector('.cart')
const cartNumber = document.querySelector('.cart p')
const cartSection = document.querySelector('.cart-products')
const btnCheckout = document.querySelector('.cart-products button')

let cartProducts = []
let productsCount = 0

const totalPriceText = document.createElement('h3')
totalPriceText.classList.add('total-price')

cartNumber.innerHTML = productsCount

const getData = async (url) => {
  try {
    const res = await fetch(url)
    const data = await res.json()
    return data
  } catch (error) {
    console.error(error);
  }
}

const showHero = products => {
  loader.classList.add('d-none')
  home.classList.remove('d-none')
  header.classList.remove('d-none')
  footer.classList.remove('d-none')
  const random = Math.floor(Math.random() * products.length)
  const product = products[random]
  featured.innerHTML = `
    <img src='${product.image}' alt='${product.title}'>
    <div>
      <h2>${product.title}</h2>
      <button>Comprar</button>
    </div>
  `
  document.querySelector('.featured div button').addEventListener('click', () => productDescription(products, random))
}

const showCategories = async categories => {
  const allProducts = await products

  const categoriesHTML = categories.map(category => {
    const { image } = allProducts.find(product => product.category === category)
    return `
      <div class='category-card' data-category="${category}">
        <img src='${image}' alt="${category}" data-category="${category}">
        <h2 data-category="${category}">${category.toUpperCase()}</h2>
      </div>
    `
  }).join('')

  categoriesSection.innerHTML = categoriesHTML

  document.querySelectorAll('.category-card').forEach(card => card.addEventListener('click', (evt) => showCategoryProducts(evt.target.dataset.category, allProducts)))
}

const showCategoryProducts = (category, products) => {
  const categoryProducts = products.filter(product => product.category === category)
  const categoryProductsHTML = categoryProducts.map((product,index) => {
    return `
    <div class='category-product'>
      <img src='${product.image}' alt='${product.title}'>
      <h2>${product.title}</h2>
      <p>$ ${product.price}</p>
      <button data-index='${index}'>Comprar</button>
    </div>
    `

  }).join('')

  document.querySelector('.category-products .products-container').innerHTML = categoryProductsHTML
  categoryProductsSection.classList.remove('d-none')
  cartSection.classList.add('d-none')
  home.classList.add('d-none')
  document.querySelector('.category-products .back-arrow').addEventListener('click', () => {
    categoryProductsSection.classList.add('d-none')
    home.classList.remove('d-none')
  })
  document.querySelectorAll('.category-product button').forEach(button => button.addEventListener('click', (evt) => productDescription(categoryProducts, evt.target.dataset.index)))
}

const productDescription = (categoryProducts, index) => {
  const {image, title, description, price} = categoryProducts[index]
  modal.innerHTML = `
  <img src="./images/cancelar.png" alt="cancelar" class='close-description'>
  <div class='modal-product'>
    <img src='${image}' alt='${title}'>
    <div>
      <h2>${title}</h2>
      <p>${description}</p>
      <p>$ ${price}</p>
      <button>Agregar</button>
    </div>
  </div>
  `
  if (!home.classList.contains('d-none')) {
    home.classList.add('d-none')
  } else {
    categoryProductsSection.classList.add('d-none')
  }
  modal.classList.remove('d-none')
  document.querySelectorAll('.modal .close-description').forEach(close => close.addEventListener('click', () => {
    modal.classList.add('d-none')
    
    if(document.querySelector('.products-container').innerHTML === ''){
      home.classList.remove('d-none')
    }else {
      categoryProductsSection.classList.remove('d-none')
    }
  }))
  document.querySelectorAll('.modal-product button').forEach(button => button.addEventListener('click', () => addToCart(categoryProducts[index])))
}

const addToCart = product => {
  cartProducts.push(product)
  modal.classList.add('d-none')
  Swal.fire({
    position: 'center',
    icon: 'success',
    title: 'El producto se ha agregado al carrito',
    showConfirmButton: false,
    timer: 1500
  })
  if(document.querySelector('.products-container').innerHTML === ''){
    home.classList.remove('d-none')
  }else {
    categoryProductsSection.classList.remove('d-none')
  }
  productsCount += 1
  cartNumber.innerHTML = productsCount
}

const showCart = evt => {
  evt.preventDefault()
  cartSection.classList.remove('d-none')
  home.classList.add('d-none')
  categoryProductsSection.classList.add('d-none')

  const totalPrice = cartProducts.reduce((acc, product) => acc + product.price, 0)

  if(cartProducts.length === 0){
    document.querySelector('.cart-products-container').innerHTML = `<h2>No tienes productos en el carrito</h2>`
  } else {
    btnCheckout.classList.remove('d-none')
    document.querySelector('.cart-products-container').innerHTML = cartProducts.map(product => {
      return `
      <div class='cart-product'>
        <img src='${product.image}' alt='${product.title}'>
        <h3>${product.title}</h3>
        <h3>$ ${product.price}</h3>
      </div>
      <hr>
      `
    }).join('')
    totalPriceText.innerHTML = `El precio total es de $${totalPrice}`
    document.querySelector('.cart-products-container').append(totalPriceText)
  }
  

  document.querySelector('.back-cart').addEventListener('click', () => {
    cartSection.classList.add('d-none')
    home.classList.remove('d-none')
  })

  btnCheckout.addEventListener('click', checkout)
}

const checkout = () => {
  cartProducts = []
  productsCount = 0
  cartNumber.innerHTML = productsCount
  document.querySelector('.cart-products-container').innerHTML = `<h2>Listo! Tu compra ha sido registrada!</h2>`
  btnCheckout.classList.add('d-none')
}


const categories = getData('https://fakestoreapi.com/products/categories')
const products = getData('https://fakestoreapi.com/products')

products
  .then(res => showHero(res))
  .catch(err => console.error(err))

categories
  .then(res => showCategories(res))
  .catch(err => console.error(err))


cartIcon.addEventListener('click', (evt) => showCart(evt))


document.querySelectorAll('nav .link-category').forEach(link => link.addEventListener('click', async (evt) => {
  const allProducts = await products
  modal.classList.add('d-none')
  evt.preventDefault()
  showCategoryProducts(evt.target.innerText.toLowerCase(), allProducts)
}))


document.querySelector('.logo-container').addEventListener('click', () => {
  home.classList.remove('d-none')
  if(!modal.classList.contains('d-none')){
    modal.classList.add('d-none')
  } else if(!categoryProductsSection.classList.contains('d-none')){
    categoryProductsSection.classList.add('d-none')
  } else if(!cartSection.classList.contains('d-none')){
    cartSection.classList.add('d-none')
  }
})