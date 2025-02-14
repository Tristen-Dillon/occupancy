import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { ValidatedAddress } from '@/lib/types'

export async function GET() {
  const filePath = path.join(process.cwd(), 'public', 'data', 'validated.json')
  const fileContent = fs.readFileSync(filePath, 'utf8')
  const data = JSON.parse(fileContent)

  return NextResponse.json(data, { status: 200 })
}

export async function PUT(request: Request) {
  try {
    const data = await request.json() as ValidatedAddress
    const filePath = path.join(
      process.cwd(),
      'public',
      'data',
      'updated_validated.json'
    )
    const oldData = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as ValidatedAddress[]
    const updatedData = [...oldData.filter((a) => a.pk_occupancy !== data.pk_occupancy), data]
    fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2))
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to write file', stack_trace: String(error) },
      { status: 500 }
    )
  }

  return NextResponse.json('success', { status: 200 })
}

export async function POST(request: Request) {
  try {
    const notUpdated = path.join(
      process.cwd(),
      'public',
      'data',
      'validated.json'
    )
    const updated = path.join(
      process.cwd(),
      'public',
      'data',
      'updated_validated.json'
    )
    const updatedData = fs.readFileSync(updated, 'utf-8')
    fs.writeFileSync(notUpdated, JSON.stringify(updatedData, null, 2))
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to write file', stack_trace: String(error) },
      { status: 500 }
    )
  }

  return NextResponse.json('success', { status: 200 })
}
