import fs from 'fs'
import path from 'path'
import { defineEventHandler } from 'h3'

export default defineEventHandler(() => {
    const dummyDir = path.resolve('./public/dummy')
    return fs.readdirSync(dummyDir)
        .filter(file => file.endsWith('.csv'))
})
