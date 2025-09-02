import { NextResponse, NextRequest } from 'next/server'
import pool from '@/lib/connection'

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams
        const manu = searchParams.get('manu')
        const site_name = searchParams.get('site_name')
        const category = searchParams.get('category')
        const province = searchParams.get('provinces')
        const sdate = searchParams.get('sdate')
        const edate = searchParams.get('edate')

        let query = ``;
        let params: any[] = [];

        if (manu === 'news') {
            query = `SELECT title, link_href, JSON_EXTRACT(res_data, '$.province') AS provinces FROM scraped_data WHERE (SUBSTRING_INDEX(site_name, '_', 1) = ?) AND (res_date >= ? AND res_date <= ?)`;
            params.push(site_name, sdate, edate);
        }

        if (manu === 'category') {
            query = `SELECT title, link_href, JSON_EXTRACT(res_data, '$.province') AS provinces FROM scraped_data WHERE (category = ?) AND (res_date >= ? AND res_date <= ?)`;
            params.push(category, sdate, edate);
        }

        if (manu === 'province') {
            query = `SELECT title, link_href, JSON_EXTRACT(res_data, '$.province') AS provinces FROM scraped_data WHERE (JSON_EXTRACT(res_data, '$.province') REGEXP ?) AND (res_date >= ? AND res_date <= ?) `;
            params.push(province, sdate, edate);
        }

        if (manu === 'category-list') {
            const ids = searchParams.get('ids') || '';
            const idsArray = ids.split(',').map(id => parseInt(id)).filter(id => !isNaN(id));

            const placeholders = idsArray.map(() => '?').join(',');
            query = `SELECT title, link_href, JSON_EXTRACT(res_data, '$.province') AS provinces FROM scraped_data WHERE id IN (${placeholders})`;
            params.push(...idsArray);
        }

        // console.log(query, params);
        
        const [rows] = await pool.query(query, params);
        const rowsArray = rows as any[];
        let res_total = rowsArray.length;

        const result = rowsArray.map((item: any) => {

            const provinces = JSON.parse(item.provinces || '[]');
            const provinceString = Array.isArray(provinces) ? provinces.join(', ') : item.provinces;

            return {
                title: item.title,
                link_href: item.link_href,
                province: provinceString,
            };
        });

        return NextResponse.json({
            res_status: '200',
            res_text: 'success',
            res_total: res_total,
            res_result: result
        })
    } catch (err) {
        console.error('API /program error:', err)
        return NextResponse.json({
            res_status: '500',
            res_text: 'database error',
            error: err instanceof Error ? err.message : 'Unknown error'
        }, { status: 500 })
    }
}
