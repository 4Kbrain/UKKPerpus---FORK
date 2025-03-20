export default defineEventHandler(() => {
  return {
    operationalHours: [
      { day: 'Senin - Jumat', hours: '08:00 - 20:00' },
      { day: 'Sabtu', hours: '09:00 - 17:00' },
      { day: 'Minggu', hours: '12:00 - 16:00' },
      { day: 'Hari Libur Nasional', hours: 'Tutup' }
    ],
  }
})
