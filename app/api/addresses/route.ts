import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  const filePath = path.join(process.cwd(), 'public', 'data', 'validated.json')
  const fileContent = fs.readFileSync(filePath, 'utf8')
  const data = JSON.parse(fileContent)

  return NextResponse.json(data, { status: 200 })
}

export async function PUT(request: Request) {
  try {
    const data = await request.json()
    const filePath = path.join(
      process.cwd(),
      'public',
      'data',
      'updated_validated.json'
    )
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to write file', stack_trace: String(error) },
      { status: 500 }
    )
  }

  return NextResponse.json('success', { status: 200 })
}
