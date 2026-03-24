import { createUploadthing } from 'uploadthing/next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

const f = createUploadthing()

export const ourFileRouter = {
  designUploader: f({
    pdf: { maxFileSize: '50MB', maxFileCount: 1 },
    image: { maxFileSize: '16MB', maxFileCount: 1 },
  })
    .middleware(async ({ req }) => {
      // Allow both guests and authenticated users
      const session = await getServerSession(authOptions)
      return { userId: session?.user?.id || 'guest' }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId, url: file.url, name: file.name }
    }),

  productImageUploader: f({ image: { maxFileSize: '4MB', maxFileCount: 4 } })
    .middleware(async ({ req }) => {
      const session = await getServerSession(authOptions)
      if (!session || session.user.role !== 'admin') throw new Error('Unauthorized')
      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { url: file.url, name: file.name }
    }),
}
