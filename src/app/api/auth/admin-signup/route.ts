import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      name,
      email,
      password,
    } = body

    if (!name || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
        },
        { status: 400 }
      )
    }

    const existing = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase().trim(),
      },
    })

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email already exists',
        },
        { status: 400 }
      )
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        passwordHash,
        role: 'admin',
      },
    })

    return NextResponse.json({
      success: true,
      data: user,
    })
  } catch (err) {
    console.error('[ADMIN SIGNUP]', err)

    return NextResponse.json(
      {
        success: false,
        error: 'Signup failed',
      },
      { status: 500 }
    )
  }
}