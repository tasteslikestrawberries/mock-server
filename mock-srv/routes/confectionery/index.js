'use strict'

const data = [
  {id: 'B1', name: 'Chocolate Bar', rrp: '22.40', info: 'Delicious overpriced chocolate.'}
]

module.exports = async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    return data
  })
  fastify.post('/', async function (request, reply) {
    request.mockDataInsert(opts.prefix.slice(1), data)
    return data
  })
}


/*
Fastify works by dividing the service up into plugins. A plugin is a module that exports a function. 
We've placed the array with our single confectionery item into a constant called data. 
We now just return that data array from our fastify.get route. 
Our new fastify.post route also returns the data array but first it uses the 
request.mockDataInsert method that our plugins/data-util.js library plugin added via fastify.decorateRequest. 

The opts.prefix contains the route prefix for our route, in this case it will be /confectionery because
the name of the folder that this index.js file is in is named confectionery. 
We pass opts.prefix.slice(1) (which strips the leading forward slash) into request.mockDataInsert as
the first argument. This is the category parameter of the insert function in plugins/data-util.js. 
We pass the data array as the second argument. This will then update the data with the new item as 
based on the request.body (which is the incoming POST body payload) along with its newly calculated ID. 
The data array with its new item is then returned from the POST request.


*/