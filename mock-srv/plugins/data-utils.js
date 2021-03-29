'use strict'
const fp = require('fastify-plugin') 

const catToPrefix = {
  electronics: 'A',
  confectionery: 'B'
}

const calculateID = (idPrefix, data) => {
  const sorted = [...(new Set(data.map(({id}) => id)))]
  const next = Number(sorted.pop().slice(1)) + 1
  return `${idPrefix}${next}`
}

module.exports = fp(async function (fastify, opts) {
  fastify.decorateRequest('mockDataInsert', function insert (category, data) {
    const request = this
    const idPrefix = catToPrefix[category]
    const id = calculateID(idPrefix, data)
    data.push({id, ...request.body})
  })
})

/*  

 The fastify-plugin module is used to de-encapsulate a plugin.
 We pass the exported plugin function into fp to achieve this. 
 What this means is, any modifications we make to the fastify 
 instance will apply across our service. If we did not pass 
 the exported function to fastify-plugin any modifications to 
 the fastify instance that is passed to it would only apply to 
 itself and any descendent plugins that it could register. 
 
 Since the plugin is loaded as a sibling to our routes we need 
 to indicate we want our plugin to apply laterally. 
 For more information on the Fastify plugin system see Fastify's Documentation.  
 
 We use the fastify.decorateRequest method to decorate the request object that
 is passed to route handler functions with a method we name mockDataInsert. 
 For more information on Fastify decorators see Fastify's Documentation.

 The insert function that we provide for the mockDataInsert decorator accepts
 two arguments: category and data. The data that is expected is an array of 
 mocked data items, the same as we currently return from our GET routes. 
 We use the category and data to calculate a new ID for an incoming item by
 mapping the category to an ID prefix and then sorting the IDs of the items 
 in the data set, then incrementing the numerical portion of the last ID and coupling it with the prefix.

 The this keyword of the insert function will be the request object on which it is called. 
 This means we can access request.body to get the incoming payload of a POST request. 
 We then modify the data array by pushing a new item object on to it containing our new ID 
 and the request.body copied into the new item object using the spread operator (...). 

*/