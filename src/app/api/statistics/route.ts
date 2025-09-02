import { NextResponse, NextRequest } from 'next/server'
import pool from '@/lib/connection'

export async function GET() {
    try {
        const [result] = await pool.query(`
            SELECT 
                r.region_id,
                r.name as region_name,
                COUNT(p.province_id) as province_count
            FROM regions r
            LEFT JOIN provinces p ON r.region_id = p.region_id AND p.status = 1
            WHERE r.status = 1
            GROUP BY r.region_id, r.name
            ORDER BY r.sort ASC
        `);
        return NextResponse.json({ 
            res_status: '200',
            res_text: 'success',
            res_result: result 
        })
    } catch (err) {
        console.error('statistics api error', err)
        return NextResponse.json({ error: 'database error' }, { status: 500 })
    }
}
