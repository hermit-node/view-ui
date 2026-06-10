import { MongoClient, ObjectId } from 'mongodb'
import { defineEventHandler, readBody, createError } from 'h3'

const client = new MongoClient('mongodb://khzz.boga-dace.ts.net:27023')
const dbName = '1675d'

// Utility: Tries to cast _id to ObjectId if it looks valid
function tryCastObjectId(id: string) {
    return ObjectId.isValid(id) && id.length === 24 ? new ObjectId(id) : id
}

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { collection, _id, update } = body

    if (!collection || !_id || !update) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing required fields: collection, _id, or update'
        })
    }

    try {
        const db = client.db(dbName)
        const col = db.collection(collection)

        const result = await col.updateOne(
            { _id: tryCastObjectId(_id) as ObjectId },
            { $set: update }
        )

        return { success: result.modifiedCount === 1 }
    } catch (err: any) {
        console.error('Update failed with error:', err)
        console.error('Payload:', { collection, _id, update })
        throw createError({
            statusCode: 500,
            statusMessage: 'Update failed on server'
        })
    }
})
