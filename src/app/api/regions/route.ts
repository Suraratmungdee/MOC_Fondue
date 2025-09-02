import { NextResponse, NextRequest } from 'next/server'
import pool from '@/lib/connection'

export async function GET() {
    try {
        const [result] = await pool.query(`SELECT region_id, name FROM regions WHERE status = 1 ORDER BY sort ASC`);
        return NextResponse.json({ 
            res_status: '200',
            res_text: 'success',
            res_result: result 
        })
    } catch (err) {
        console.error('mysql-test error', err)
        return NextResponse.json({ error: 'database error' }, { status: 500 })
    }
}
