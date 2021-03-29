const API = 'http://localhost:3000'

const populateProducts = async (category, method = 'GET', payload) => {
  const products = document.querySelector('#products')
  products.innerHTML = ''
  const send = method === 'GET' ? {} : {
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(payload)
  }
  const res = await fetch(`${API}/${category}`, { method, ...send })
  const data = await res.json()
  for (const product of data) {
    const item = document.createElement('product-item')
    for (const key of ['name', 'rrp', 'info']) {
      const span = document.createElement('span')
      span.slot = key
      span.textContent = product[key]
      item.appendChild(span)
    }
    products.appendChild(item)
  }
}

const category = document.querySelector('#category')
const add = document.querySelector('#add')

category.addEventListener('input', async ({ target }) => {
  add.style.display = 'block'
  await populateProducts(target.value)
})

add.addEventListener('submit', async (e) => {
  e.preventDefault()
  const { target } = e
  const payload = {
    name: target.name.value,
    rrp: target.rrp.value,
    info: target.info.value
  }
  await populateProducts(category.value, 'POST', payload)
  target.reset()
})

customElements.define('product-item', class Item extends HTMLElement {
  constructor() {
    super()
    const itemTmpl = document.querySelector('#item').content
    this.attachShadow({mode: 'open'}).appendChild(itemTmpl.cloneNode(true))
  }
})


/*The populateProducts function has been upgraded to handle both GET and POST scenarios. 
A POST scenario occurs when the form is submitted. In the add form's submit event listener 
function the populateProducts function is called with the currently selected category, 
the method argument as 'POST' and a payload to send to the server based on the form values. 
The browser native fetch function can also perform post requests which is configured via a 
second options argument. So if the method is 'POST', the headers and body are built and then
 a POST request is made to the /{cat} route where {cat} is the selected category. 
 
 The POST route will store the incoming item and send back updated data, so populateProducts 
 then continues as normal to render the data from the response.

It's highly recommended that production Node.js services are stateless. 
That is, they don't store their own state, but retrieve it from an upstream service 
or database. When we're creating mock services, however, storing state in-process is fine. 
We're just trying to carve out a happy path for the application or service that we're actually implementing. 
In order to store state we're going to need to create the minimum database-like abstractions for a POST request 
to make sense. Namely, we'll need to create an ID for each new entry. Since we have two routes and we don't want 
duplicate logic - even in mock services the Don't Repeat Yourself principle applies - we can create a small
 data utility library plugin that both routes can use ( we will create a file in the mock-srv/plugins folder called data-utils.js) */