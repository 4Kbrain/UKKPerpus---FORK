import fs from 'fs';
import path from 'path';
import { getServerSession } from '#auth';

export default defineEventHandler(async (event) => {
  // Cek session pengguna
  const session = await getServerSession(event);
  if (!session || !(session.user.role === 'ADMINISTRATOR' || session.user.role === 'PETUGAS')) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' });
  }

  // Ambil nama file
  const filename = event.context.params?.filename;
  if (!filename) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid filename' });
  }

  // Path file (ubah jika pakai `public/`)
  const filePath = path.join(process.cwd(), 'server', 'uploads', 'nik', filename);

  if (!fs.existsSync(filePath)) {
    throw createError({ statusCode: 404, statusMessage: 'File not found' });
  }

  // Kirim file
  return sendStream(event, fs.createReadStream(filePath));
});
