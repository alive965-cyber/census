import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import * as XLSX from 'xlsx';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const status = searchParams.get('status') || '';
    const ward = searchParams.get('ward') || '';

    const supabase = await createClient();

    let q = supabase.from('houses').select('*');

    if (query) {
      q = q.or(
        `house_number.ilike.%${query}%,head_of_family.ilike.%${query}%,address.ilike.%${query}%`
      );
    }
    if (status) q = q.eq('status', status);
    if (ward) q = q.eq('ward_id', ward);

    q = q.order('house_number', { ascending: true });

    const { data: houses, error } = await q;
    if (error) throw error;

    // Transform data for Excel
    const rows = (houses || []).map((h: any, i: number) => ({
      'S.No': i + 1,
      'House Number': h.house_number,
      'Head of Family': h.head_of_family,
      'Address': h.address,
      'Contact Number': h.contact_number || '',
      'Status': h.status,
      'Ward ID': h.ward_id,
      'Created Date': new Date(h.created_at).toLocaleDateString('en-IN'),
    }));

    // Create workbook
    const ws = XLSX.utils.json_to_sheet(rows);

    // Set column widths
    ws['!cols'] = [
      { wch: 6 },   // S.No
      { wch: 14 },  // House Number
      { wch: 24 },  // Head of Family
      { wch: 30 },  // Address
      { wch: 16 },  // Contact
      { wch: 14 },  // Status
      { wch: 36 },  // Ward ID
      { wch: 14 },  // Date
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Census Data');

    // Generate buffer
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    const filename = `census-data-${new Date().toISOString().slice(0, 10)}.xlsx`;

    return new NextResponse(buf, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Excel export failed' }, { status: 500 });
  }
}
