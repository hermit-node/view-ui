// server/api/mong.1675d.ts
import { MongoClient } from 'mongodb'
import { defineEventHandler, getQuery, createError } from 'h3'

const client = new MongoClient('mongodb://khzz.boga-dace.ts.net:27023')
const dbName = '1675d'

export default defineEventHandler(async (event) => {
    const { name } = getQuery(event)

    const db = client.db(dbName)

    // List all collections
    if (name === '_list') {
        const collections = await db.listCollections().toArray()
        return collections.map(c => c.name)
    }

    // Validate name
    if (!name || typeof name !== 'string') {
        throw createError({ statusCode: 400, statusMessage: 'Missing or invalid collection name.' })
    }

    // Return documents
    return await db.collection(name).find().limit(100).toArray()
})
