import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('files')

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    // If UploadThing is configured, use it
    // Otherwise just return success (file stored in cart state)
    return NextResponse.json({
      url: '',
      name: file.name,
      size: file.size,
      message: 'File received'
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
