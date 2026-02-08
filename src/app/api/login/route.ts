import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
        return NextResponse.json({ error: 'Missing email or username' }, { status: 400 });
    }

    // Simulate Reqres Login
    if (email === 'eve.holt@reqres.in') {
        return NextResponse.json({
            token: 'QpwL5tke4Pnpja7X4'
        });
    }

    return NextResponse.json({ error: 'user not found' }, { status: 400 });
}
