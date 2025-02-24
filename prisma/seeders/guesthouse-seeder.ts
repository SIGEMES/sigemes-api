import { PrismaClient } from '@prisma/client'

const prisma: PrismaClient = new PrismaClient()

export async function seedGuesthouses(): Promise<void> {
    await prisma.guesthouse.createMany({
        data: [
            {
                name: "Mess Pemko Padangsidimpuan",
                description: "Mess Pemko Padangsidimpuan adalah fasilitas penginapan yang dikelola oleh Pemerintah Kota Padangsidimpuan, Sumatera Utara. Mess ini berlokasi di Kota Medan dan berfungsi sebagai akomodasi bagi aparatur sipil negara (ASN) serta tamu pemerintah yang melakukan perjalanan dinas. Biasanya, mess ini digunakan oleh pegawai dari Padangsidimpuan yang memiliki keperluan resmi di Kota Medan, seperti rapat, koordinasi antarinstansi, atau kegiatan pemerintahan lainnya.\n\nSelain diperuntukkan bagi ASN dan tamu pemerintah, Mess Pemko Padangsidimpuan juga terbuka untuk masyarakat umum yang membutuhkan tempat menginap di Medan. Dengan fasilitas yang nyaman dan tarif yang terjangkau, mess ini menjadi pilihan akomodasi yang cocok baik untuk keperluan dinas maupun perjalanan pribadi.",
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