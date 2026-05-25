import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { role, email, password, name, phone, ...profileData } = body

    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Name, email, password and role are required' } },
        { status: 400 }
      )
    }

    if (!['artist', 'fan', 'khapeetar'].includes(role)) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid role' } },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Password must be at least 8 characters' } },
        { status: 400 }
      )
    }

    // Check email already exists
    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } })
    if (existing) {
      return NextResponse.json(
        { success: false, error: { code: 'EMAIL_EXISTS', message: 'An account with this email already exists' } },
        { status: 409 }
      )
    }

    const passwordHash = await bcrypt.hash(password, 12)

    // Create user + role profile in a transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email:        email.toLowerCase().trim(),
          passwordHash,
          name:         name.trim(),
          role,
          phone:        phone || null,
        },
      })

      if (role === 'artist') {
        await tx.artistProfile.create({
          data: {
            userId:    newUser.id,
            stageName: profileData.stageName || null,
            genre:     profileData.genre     || null,
            bio:       profileData.bio       || null,
            city:      profileData.city      || null,
            country:   profileData.country   || null,
            instagram: profileData.instagram || null,
            spotify:   profileData.spotify   || null,
            youtube:   profileData.youtube   || null,
          },
        })
      }

      if (role === 'fan') {
        await tx.fanProfile.create({
          data: {
            userId:              newUser.id,
            investmentInterests: profileData.investmentInterests || [],
            city:                profileData.city                || null,
            country:             profileData.country             || null,
          },
        })
      }

      if (role === 'khapeetar') {
        await tx.khapeetarProfile.create({
          data: {
            userId:            newUser.id,
            name:              name.trim(),
            email:             email.toLowerCase().trim(),
            phone:             phone             || null,
            skills:            profileData.skills            || [],
            primaryRole:       profileData.primaryRole       || '',
            city:              profileData.city              || null,
            state:             profileData.state             || null,
            country:           profileData.country           || 'India',
            workMode:          profileData.workMode          || 'Remote',
            availability:      profileData.availability      || 'Available Now',
            startingBudget:    Number(profileData.startingBudget)    || 0,
            experienceYears:   Number(profileData.experienceYears)   || 0,
            projectsCompleted: Number(profileData.projectsCompleted) || 0,
            bio:               profileData.bio               || null,
            instagram:         profileData.instagram         || null,
            youtube:           profileData.youtube           || null,
            spotifyCredits:    profileData.spotifyCredits    || null,
          },
        })
      }

      return newUser
    })

    return NextResponse.json(
      { success: true, data: { userId: user.id, role: user.role }, message: 'Account created successfully' },
      { status: 201 }
    )
  } catch (err) {
    console.error('[POST /api/auth/signup]', err)
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to create account' } },
      { status: 500 }
    )
  }
}