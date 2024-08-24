fetch('products.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }
    return response.json();
  })
  .then(products => {
    const cards = document.querySelectorAll('.Card');
    products.forEach((product, index) => {
      if (cards[index]) {
        let imageContainer = cards[index].querySelector('.book');
        imageContainer.src = product.Cover;
        imageContainer.alt = product.Title;
        let NameTag = cards[index].querySelector('.Title');
        NameTag.innerText = product.Title;
        let PriceTag = cards[index].querySelector('.price');
        PriceTag.innerText = product.Price;
        let RatingTag = cards[index].querySelector('.rating_button');
        RatingTag.innerText='';
        let rating = Math.round(product.Rating);
        for (let i = 0; i < rating; i++) {
          const star = document.createElement('i');
          star.className = 'fa-solid fa-star';
          RatingTag.appendChild(star);
        }
        let discountTag = cards[index].querySelector('.discount_button .discount');
        if (discountTag) {
            discountTag.innerText = product.Discount;
          }else{
            discountTag.style.display = 'none';
          }
          let saleTag = cards[index].querySelector('.saleTag');
          if (product.Status === 'NEW') {
            saleTag.style.display = 'block';
          } else {
            saleTag.style.display = 'none';
          }
          let cartButton = cards[index].querySelector('.cart_button');
          cartButton.setAttribute('data-name', product.Title);
          cartButton.setAttribute('data-price', product.Price);

          cartButton.addEventListener('click', () => {
            addToCart(product);
          });

          let WishButton = cards[index].querySelector('.wish_button');
          WishButton.setAttribute('data-name', product.Title);
          WishButton.addEventListener('click', () => {
            addToWish(product);
          });

        cards[index].dataset.genre = product.Genre;
        }
    });
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });

  function addToWish(product) {
    console.log('Product Description:', product.Description);

    const wishlistItem = {
      title: product.Title,
      description: product.Description,
      rating: product.Rating,
      author: product.Author,
      genre: product.Genre,
      description: product.Description,
      cover: product.Cover
    };
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const existingItem = wishlist.find(item => item.title === wishlistItem.title);
    if (!existingItem) {
        wishlist.push(wishlistItem);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        alert(`${product.Title} was Wishlisted!`)
        console.log('Wishlist:', wishlist);
        updateWishlistUI(wishlistItem); 
    } else {
      alert(`${product.Title} has ALREADY been wishlisted!`)
        console.log('Item is already in the wishlist');
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const wishlistContainer = document.getElementById('wishlistContainer');

    wishlist.forEach(item => {
        const wishlistItem = document.createElement('div');
        wishlistItem.classList.add('wishlist-item');
        
        wishlistItem.innerHTML = `
        <article>
        <div class='wish'>
        <aside><img src="${item.cover}" alt="${item.title}"/></aside>
        <aside>
          <h3>${item.title}</h3>
          <p><span>${item.author}</span></p>
          <p>${item.genre}</p>
          <p>Rating: ${item.rating}</p>
          <p>${item.description}</p>
        </aside>
        <button class="remove-button" data-title="${item.title}"><i class='fa-solid fa-heart'></i></button>        
        </div>
        </article>
        `;
        wishlistContainer.appendChild(wishlistItem);
    });
    document.querySelectorAll('.remove-button').forEach(button => {
      button.addEventListener('click', () => {
          const title = button.getAttribute('data-title');
          removeFromWish(title);
      });
  });
});



function updateWishlistUI(item) {
  const wishlistContainer = document.getElementById('wishlistContainer');
  const wishlistItem = document.createElement('div');
  wishlistItem.classList.add('wishlist-item');
  
  wishlistItem.innerHTML = `
  <article>
  <div class='wish'>
  <aside><img src="${item.cover}" alt="${item.title}"/></aside>
  <aside>
    <h3>${item.title}</h3>
    <p><span>${item.author}</span></p>
    <p>${item.genre}</p>
    <p>Rating: ${item.rating}</p>
    <p>${item.description}</p>

  </aside>
  <button class="remove-button" data-title="${item.title}"><i class='fa-solid fa-heart'></i></button>
  </div>
  </article>
  `;
  
  wishlistContainer.appendChild(wishlistItem);
  document.querySelector(`.remove-button[data-title="${item.title}"]`).addEventListener('click', () => {
      removeFromWish(item.title);
  });
}


  function removeFromWish(title) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    wishlist = wishlist.filter(item => item.title !== title);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    document.getElementById('wishlistContainer').innerHTML = '';
    wishlist.forEach(item => updateWishlistUI(item));
    alert(`${item.title} was REMOVED from WISHLIST!`)
}


  function GenreSelect() {
    const selectedGenre = document.getElementById('dropdown').value;
    const cards = document.querySelectorAll('.Card');

    cards.forEach(card => {
      const genre = card.dataset.genre;
      if (selectedGenre === 'all' || genre === selectedGenre) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  }

document.addEventListener('DOMContentLoaded', () => {
    const searchbar = document.getElementById('Searchbar');
    searchbar.addEventListener('input', Search);
});

function Search() {
    const searchbar = document.getElementById('Searchbar').value.toUpperCase();
    const cards = document.querySelectorAll('.Card');

    cards.forEach(card => {
        const title = card.querySelector('.Title').innerText.toUpperCase();
        if (title.includes(searchbar)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}
let cart = JSON.parse(localStorage.getItem('cart')) || [];

const cartstock = document.getElementById('cart_stock');
if (cartstock) {
    cartstock.innerText = `${cart.length}`;
    if (cart.length === 0) {
        cartstock.style.display = 'none';
    } else {
        cartstock.style.display = 'flex';
    }
}

function updateCartDisplay() {
  const cartContainer = document.getElementById('cartContainer');

  if (!cartContainer) return;

  cartContainer.innerHTML = '';

  let totalQuantity = 0;

  cart.forEach(item => {
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.innerHTML = `
      <li>
        <div class='left'>
          <h3>${item.Title}</h3>
          <div class='options'>
          <p>Price: $${item.Price}</p>
          <p>Quantity: ${item.quantity}</p>
          </div>
        </div>
        <div class='right'>
          <button class="remove_button" data-title="${item.Title}" onclick='removeFromCart(event.target.dataset.title)'>Remove</button>
        </div>
      </li>
    `;
    cartContainer.appendChild(cartItem);

    totalQuantity += item.quantity;
  });

  const cartstock = document.getElementById('cart_stock');
  if (cartstock) {
    cartstock.innerText = `${totalQuantity}`;
    cartstock.style.display = totalQuantity === 0 ? 'none' : 'flex';
  }

  const removeButtons = cartContainer.querySelectorAll('.remove_button');
  removeButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      removeFromCart(event.target.dataset.title);

    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartDisplay();
});

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    cartstock.innerText = `${cart.length}`;
}

function addToCart(product) {
    const existingProduct = cart.find(item => item.Title === product.Title);

    console.log('Adding product:', product);

    if (typeof product.Price === 'string') {
      product.Price = parseFloat(product.Price.replace(/[^0-9.-]+/g, ''));
    }

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    alert(`${product.Title} added to Cart!`)
    saveCart();
    updateCartDisplay();
    updateTotalPrice();
}

function removeFromCart(title) {
    cart = cart.filter(item => item.Title !== title);
    saveCart();
    alert(`${item.Title} removed from Cart!`)
    updateCartDisplay();
    updateTotalPrice(); 
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartDisplay();
    updateTotalPrice();
});

document.querySelectorAll('.cart_button').forEach(button => {
  button.addEventListener('click', (event) => {
    const buttonElement = event.currentTarget;
    const product = {
      Title: buttonElement.dataset.name,
      Price: buttonElement.dataset.price
    };
  });
});

document.querySelectorAll('.wish_button').forEach(button => {
  button.addEventListener('click', (event) => {
    const buttonElement = event.currentTarget;
    const product = {
      Title: buttonElement.dataset.name,
    };
    console.log(buttonElement.dataset.name)
  });
});


var flag1 = false;
var flag2 = false;

function toggle(){
  if(flag2==true){
  flag1=!flag1;
  var popup = document.getElementById('popup1')
  popup.classList.toggle('active')
  var popup = document.getElementById('popup')
  popup.classList.toggle('active')
  }else{
  flag1=!flag1;
  var blur = document.getElementById('blur')
  blur.classList.toggle('active')
  var popup = document.getElementById('popup')
  popup.classList.toggle('active')
  }
}

function toggleSignup(){
  if(flag1==true){
  flag2=!flag2;
  var popup = document.getElementById('popup')
  popup.classList.toggle('active')
  var popup = document.getElementById('popup1')
  popup.classList.toggle('active')
  }else{
  flag2=!flag2;
  var blur = document.getElementById('blur')
  blur.classList.toggle('active')
  var popup = document.getElementById('popup1')
  popup.classList.toggle('active')
  }
}

function removeFromCart(title) {
  cart = cart.filter(item => item.Title !== title);
  updateCartDisplay();
}


window.onscroll = function() {
  var popup = document.getElementById('popup');
  if (popup.classList.contains('active')) {
      var offset = window.pageYOffset;
      popup.style.top = (offset + window.innerHeight * 0.25) + 'px'; 
      popup.style.transition = "0.1s";
    }
  var popup1 = document.getElementById('popup1');
  if (popup1.classList.contains('active')) {
      var offset = window.pageYOffset;
      popup1.style.top = (offset + window.innerHeight * 0.25) + 'px'; 
      popup1.style.transition = "0.1s";
    }
};

document.addEventListener('DOMContentLoaded', () => {
  updateCartDisplay();
});

let isNewArrivalsFiltered = false;
  document.getElementById('newArrivals').addEventListener('click', () => {
    const cards = document.querySelectorAll('.Card');
    if (isNewArrivalsFiltered) {
      cards.forEach(card => {
        card.style.display = 'block';
      });
      isNewArrivalsFiltered = false;
    } else {
      cards.forEach(card => {
        const saleTag = card.querySelector('.saleTag');
        if (saleTag && saleTag.style.display === 'block') {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
      isNewArrivalsFiltered = true;
    }
  });


  document.getElementById('Deals').addEventListener('click', function() {
    const discountButtons = document.querySelectorAll('.discount_button');
    discountButtons.forEach(button => {
        const discountElement = button.querySelector('.discount');
        const iconElement = button.querySelector('i');
        if (discountElement && discountElement.innerText.trim() === "0%") {
            button.style.display = 'none';
            discountElement.style.display = 'none';
            if (iconElement) iconElement.style.display = 'block';
        } else {
            if (button.style.display === 'flex' && discountElement.style.display === 'flex') {
                button.style.display = 'none';
                discountElement.style.display = 'none';
                if (iconElement) iconElement.style.display = 'block';
            } else {
                button.style.display = 'flex';
                discountElement.style.display = 'flex';
                if (iconElement) iconElement.style.display = 'none';
            }
        }
    });
});


function calculateTotal() {
  let totalPrice = 0;

  cart.forEach(item => {
    totalPrice += item.Price * item.quantity;
  });

  return totalPrice.toFixed(2);
}

function updateTotalPrice() {
  const totalElement = document.getElementById('Total');
  
  if (totalElement) { 
    const totalPrice = calculateTotal();
    totalElement.innerText = `Total: $${totalPrice}`;
  }
}
