import { PrismaClient } from '@prisma/client'

const prisma: PrismaClient = new PrismaClient()

export async function seedGuesthouses(): Promise<void> {
    await prisma.guesthouse.createMany({
        data: [
            {
                name: "Mess Kota Padangsidempuan",
                description: "Mess Kota Padangsidempuan merupakan mess yang dapat disewa untuk para pejabat, pegawai negeri, maupun masyarakat umum yang membutuhkan tempat tinggal sementara.",
                facilities: "Ruang lobby; TV; Sofa; WiFi; Kamar mandi umum; Parkir",
                areaM2: 1000,
                address: "Jl. Adam Malik No. 1",
                latitude: 1.3666500703089492,
                longitude: 99.27607939682193,
                contactPerson: "081234567890",
            },
        ],
    });

    console.log('City Hall seeded successfully');
};