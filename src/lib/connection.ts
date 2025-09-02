import mysql from 'mysql2/promise'

type Pool = mysql.Pool

const poolConfig = process.env.DATABASE_URL || undefined

declare global {
    // allow the pool to be cached across module reloads in development
    // eslint-disable-next-line no-var
    var __mysqlPool: Pool | undefined
}

function createPool(): Pool {
    if (poolConfig) {
        // create from connection string
        return mysql.createPool(poolConfig)
    }

    // fallback to individual env vars
    if (!process.env.DB_NAME) {
        throw new Error('Database not configured. Set DATABASE_URL or DB_NAME in environment. Make sure to create a .env.local file with your database credentials.')
    }

    const config = {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
    }

    console.log('Creating MySQL pool with config:', {
        host: config.host,
        user: config.user,
        database: config.database,
        // don't log password for security
    })

    return mysql.createPool(config)
}

const pool: Pool = (global.__mysqlPool ??= createPool())

export default pool
