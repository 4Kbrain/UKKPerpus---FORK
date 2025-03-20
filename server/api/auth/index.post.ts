import prisma from '~/lib/prisma'
import bcrypt from 'bcrypt'
import path from 'path'
import fs from 'fs'

export default defineEventHandler(async event => {
  try {
    const formData = await readMultipartFormData(event) || []

    const body: Record<string, any> = {}
    let nikFilePath = ''

    // Folder penyimpanan file (server-side, tidak bisa diakses langsung)
    const uploadDir = path.join(process.cwd(), 'server', 'uploads', 'nik')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    for (const file of formData) {
      if (file.name === 'nik' && file.filename) {  
        const safeFilename = `nik-${Date.now()}-${file.filename}` 
        const filePath = path.join(uploadDir, safeFilename)
        
        fs.writeFileSync(filePath, file.data)

        // Simpan path internal, bukan URL public biar gk bisa diakses semua orang
        nikFilePath = `uploads/nik/${safeFilename}`
      } else if (file.name) {
        body[file.name] = file.data.toString('utf-8')
      }
    }

    body.nik = nikFilePath || ''

    // Validasi input
    if (!body.email || !body.password || !body.confirmPassword) {
      throw createError({ statusCode: 400, statusMessage: 'Missing required fields' })
    }

    if (body.password !== body.confirmPassword) {
      throw createError({ statusCode: 400, statusMessage: 'Passwords do not match' })
    }

    // Cek apakah user sudah ada
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: body.email },
          { username: body.username },
          { phone: body.phone },
          { nik: body.nik }
        ]
      }
    })

    if (existingUser) {
      throw createError({ statusCode: 400, statusMessage: 'Username, email, or NIK already taken' })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(body.password, salt)

    // Simpan user ke database
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: hashedPassword,
        fullname: body.fullname || '',
        username: body.username || '',
        phone: body.phone || '',
        gender: body.gender || '',
        address: body.address || '',
        role: body.role || 'PEMINJAM',
        photo: body.photo || '/default-avatar.png',
        nik: body.nik, 
        is_verify: false,
      }
    })

    return { success: true, user: { ...user, password: undefined } }
  } catch (error) {
    console.error('Error creating user', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'An error occurred while registering the user'
    })
  }
})
