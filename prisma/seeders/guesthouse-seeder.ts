import { PrismaClient } from '@prisma/client'

const prisma: PrismaClient = new PrismaClient()

export async function seedGuesthouses(): Promise<void> {
    await prisma.guesthouse.createMany({
        data: [
            {
                name: "Mess Pemko Padangsidimpuan",
                description: "Mess Pemko PadangSidimpuan adalah fasilitas penginapan yang dikelola oleh Pemerintah Kota Padangsidimpuan,Sumatera Utara.Mess ini biasanya digunakan untuk keperluan resmi,seperti akomodasi bagi tamu pemerintah,pegawai negeri yang sedang melakukan perjalanan dinas,atau keperluan lainnya yang terkait dengan kegiatan pemerintahan.",
                facilities: "Ruang lobby; TV; Sofa; WiFi; Kamar mandi umum; Parkir",
                areaM2: 969.255,
                address: "Jl. Teladan No.45a, Teladan Bar., Kec. Medan Kota, Kota Medan, Sumatera Utara 20214",
                latitude: 3.565151175062011,
                longitude: 98.69103587869016,
                contactPerson: "081269402020",
            },
        ],
    });

    console.log('City Hall seeded successfully');
};