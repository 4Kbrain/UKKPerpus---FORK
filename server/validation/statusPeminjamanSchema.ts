import { z } from "zod";
import type { StatusPinjaman } from "~/types"; 

// Validasi status peminjaman
export const peminjamanStatusSchema = z.object({
  status: z.enum([
    "PENDING",
    "DIAJUKAN",
    "DISETUJUI",
    "MENUNGGU_PENGAMBILAN",
    "DIPINJAM",
    "DIPERPANJANG",
    "DIKEMBALIKAN",
    "DIBATALKAN"
  ] as [StatusPinjaman, ...StatusPinjaman[]]) 
});
