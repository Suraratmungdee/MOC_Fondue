import { NextResponse, NextRequest } from 'next/server'
import pool from '@/lib/connection'

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams
        const sdate = searchParams.get('sdate')
        const edate = searchParams.get('edate')

        let query = `SELECT SUBSTRING_INDEX(site_name, '_', 1) AS site_prefix, COUNT(*) AS count_site FROM scraped_data`;
        let params: any[] = [];

        if (sdate && edate) {
            query += ` WHERE res_date >= ? AND res_date <= ?`;
            params.push(sdate, edate);
        }

        query += ` GROUP BY site_prefix ORDER BY count_site DESC`;

        const [rows] = await pool.query(query, params);
        let res_total = 0;
        const result = (rows as any[]).map((item: any) => {
            res_total += item.count_category;
            return {
                site_name: item.site_prefix,
                count_site: item.count_site,
            };
        });

        return NextResponse.json({
            res_status: '200',
            res_text: 'success',
            res_total: res_total,
            res_result: result
        })
    } catch (err) {
        console.error('mysql-test error', err)
        return NextResponse.json({ error: 'database error' }, { status: 500 })
    }
}
