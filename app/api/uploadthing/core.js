import { createUploadthing } from 'uploadthing/next'
export const dynamic = 'force-dynamic'

const f = createUploadthing()

export const ourFileRouter = {
  designUploader: f({
    pdf: { maxFileSize: '50MB', maxFileCount: 1 },
    image: { maxFileSize: '16MB', maxFileCount: 1 },
  })
    .middleware(async ({ req }) => {
      return { userId: 'guest' }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId, url: file.url, name: file.name }
    }),

  productImageUploader: f({ image: { maxFileSize: '4MB', maxFileCount: 4 } })
    .middleware(async ({ req }) => {
      return { userId: 'admin' }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { url: file.url, name: file.name }
    }),
}