import { NextResponse, NextRequest } from 'next/server'
import pool from '@/lib/connection'

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams
        const regionId = searchParams.get('region_id')
        const sdate = searchParams.get('sdate')
        const edate = searchParams.get('edate')
        const category = searchParams.get('category')

        let query = `SELECT province_id, name, region_id, province_no FROM province`;
        let params: any[] = [];

        if (regionId && regionId !== `10`) {
            query += ` WHERE region_id = ?`;
            // query += ` WHERE province_id = ?`;
            params.push(regionId);
        }

        query += ` ORDER BY name ASC`;

        const [rows] = await pool.query(query, params);

        const provinceNames = (rows as any[]).map((item: any) => item.name);
        // const provincePattern = provinceNames.join('|');
        const provincePattern = ['all', ...provinceNames].join('|');

        let scrapedData = [];
        let totalNews = 0;
        let counts: { [key: string]: number } = {};
        let provinceNewsIds: { [key: string]: number[] } = {}; // เก็บ id ของข่าวแต่ละจังหวัด


        if (sdate && edate && provinceNames.length > 0) {
            const [data] = await pool.query(`SELECT * FROM scraped_data WHERE (res_date >= ? AND res_date <= ? AND category = ?) AND (JSON_EXTRACT(res_data, '$.province') REGEXP ?)`, [sdate, edate, category, provincePattern]);

            // console.log(`SELECT * FROM scraped_data WHERE (res_date >= '${sdate}' AND res_date <= '${edate}' AND category = '${category}') AND (JSON_EXTRACT(res_data, '$.province') REGEXP '${provincePattern}')`);
            
            // const [rows] = await pool.query(`SELECT JSON_EXTRACT(res_data, '$.province') AS provinces, scraped_data.* FROM scraped_data WHERE (res_date >= ? AND res_date <= ?) AND category = ?`, [sdate, edate, category]);

            scrapedData = data as any[];
            // แยกข่าวตามจังหวัดจากข้อมูลจริง
            scrapedData.forEach((item: any) => {
                try {
                    const resData = JSON.parse(item.res_data);
                    const provinceData = resData.province;
                    if (provinceData) {
                        // จัดการกรณี province เป็น string หรือ array
                        let provinces: string[] = [];
                        
                        if (typeof provinceData === 'string') {
                            // ถ้าเป็น string ให้แยกด้วย comma หรือ delimiter อื่นๆ
                            provinces = provinceData.split(/[,\/\|;]/).map(p => p.trim()).filter(p => p.length > 0);
                        } else if (Array.isArray(provinceData)) {
                            // ถ้าเป็น array ใช้ตรงๆ
                            provinces = provinceData.filter(p => p && typeof p === 'string');
                        } else {
                            // ถ้าไม่ใช่ string หรือ array ให้แปลงเป็น string
                            provinces = [String(provinceData)];
                        }
                        
                        provinces.forEach(province => {
                            if (province.toLowerCase().includes("all")) {
                                // ถ้าเจอ "all" ให้วนใส่ทุกจังหวัด
                                provinceNames.forEach(provinceName => {
                                    counts[provinceName] = (counts[provinceName] || 0) + 1;
                                    // เก็บ id ของข่าวสำหรับจังหวัดนี้
                                    if (!provinceNewsIds[provinceName]) {
                                        provinceNewsIds[provinceName] = [];
                                    }
                                    provinceNewsIds[provinceName].push(item.id);
                                });
                            } else {
                                // ตรวจสอบว่าจังหวัดนี้มีในรายการจังหวัดหรือไม่
                                const matchedProvince = provinceNames.find(pName => 
                                    province.includes(pName) || pName.includes(province)
                                );
                                
                                if (matchedProvince) {
                                    counts[matchedProvince] = (counts[matchedProvince] || 0) + 1;
                                    // เก็บ id ของข่าวสำหรับจังหวัดนี้
                                    if (!provinceNewsIds[matchedProvince]) {
                                        provinceNewsIds[matchedProvince] = [];
                                    }
                                    provinceNewsIds[matchedProvince].push(item.id);
                                }
                            }
                        });
                    }
                } catch (error) {
                    console.error('Error parsing item:', error);
                }
            });

            totalNews = Object.values(counts).reduce((sum, count) => sum + count, 0);
        }

        // สร้าง result พร้อม percentage
        const result = (rows as any[]).map((item: any) => {
            const newsCount = counts[item.name] || 0;
            const ids = provinceNewsIds[item.name] || []; // ดึง id ของข่าวสำหรับจังหวัดนี้
            const percentage = totalNews > 0 ? ((newsCount / totalNews) * 100).toFixed(2) : '0.00';

            return {
                province_id: item.province_id,
                name: item.name,
                region_id: item.region_id,
                province_no: item.province_no,
                ids: ids,
                news_count: newsCount,
                percentage: parseFloat(percentage)
            };
        }).sort((a, b) => b.news_count - a.news_count); // เรียงตาม news_count จากมากไปน้อย

        return NextResponse.json({
            res_status: '200',
            res_text: 'success',
            res_total: totalNews,
            res_result: result
        })
    } catch (err) {
        console.error('provinces api error', err)
        return NextResponse.json({ error: 'database error' }, { status: 500 })
    }
}
