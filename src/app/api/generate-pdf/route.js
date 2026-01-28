import { NextResponse } from 'next/server';
import ReactPDF from '@react-pdf/renderer';
import { PDFDocument } from '@/components/PDFDocument';

export async function POST(request) {
  try {
    const data = await request.json();

    // Generate PDF buffer
    const pdfStream = await ReactPDF.renderToStream(PDFDocument({ data }));

    // Convert stream to buffer
    const chunks = [];
    for await (const chunk of pdfStream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // Return PDF as downloadable file
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="content-package-${Date.now()}.pdf"`,
        'Content-Length': buffer.length.toString()
      }
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
