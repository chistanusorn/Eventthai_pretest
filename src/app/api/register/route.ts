import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
        return NextResponse.json({ error: 'Missing email or username' }, { status: 400 });
    }

    // Simulate Reqres behavior
    if (email === 'eve.holt@reqres.in') {
        return NextResponse.json({
            id: 4,
            token: 'QpwL5tke4Pnpja7X4'
        });
    }

    return NextResponse.json({ error: 'Note: Only defined "eve.holt@reqres.in" succeeds in this mock' }, { status: 400 });
}
