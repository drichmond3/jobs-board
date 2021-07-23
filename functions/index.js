const functions = require('firebase-functions');
const pluralize = require('pluralize')
const jsonServer = require('json-server')

const main = jsonServer.create()
const api = jsonServer.create()
const router = jsonServer.router('db.json', { foreignKeySuffix: 'Id' })
const middlewares = jsonServer.defaults()
middlewares.readOnly = true;

api.use(middlewares)
api.use(jsonServer.rewriter({
    "/:resource/:id/show": "/:resource/:id"
}))
api.use(router)

exports.main = functions.https.onRequest(api)