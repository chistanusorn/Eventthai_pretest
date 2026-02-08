import { NextResponse } from 'next/server';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const body = await request.json();
    return NextResponse.json({
        updatedAt: new Date().toISOString(),
        ...body
    });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    return new NextResponse(null, { status: 204 });
}
