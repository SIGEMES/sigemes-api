import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma: PrismaClient = new PrismaClient()

export async function seedCityHalls(): Promise<void> {
    await prisma.cityHall.createMany({
        data: [
            {
                name: "Gedung Adam Malik",
                description: "Gedung Adam Malik adalah gedung pertemuan yang dapat digunakan untuk berbagai kegiatan, baik sosial, komersial, maupun pemerintahan. Gedung ini terletak di pusat Kota Padangsidimpuan, sehingga memiliki lokasi yang strategis dan mudah dijangkau, menjadikannya pilihan ideal untuk berbagai acara. Dengan kapasitas yang cukup luas, Gedung Adam Malik sering digunakan untuk pertemuan resmi, seminar, resepsi pernikahan, serta berbagai kegiatan lainnya. \n\nGedung ini merupakan aset milik Pemerintah Kota Padangsidimpuan dan dikelola langsung oleh pemerintah. Selain digunakan untuk kepentingan pemerintahan, Gedung Adam Malik juga dapat disewa oleh masyarakat umum untuk berbagai keperluan pribadi maupun komersial.",
                areaM2: 1000,
                peopleCapacity: 1000,
                address: "Jl. Adam Malik No. 1",
                latitude: 1.3786243456,
                longitude: 99.272306,
                status: "tersedia",
                contactPerson: "081234567890",
            },
        ],
    });

    console.log('City Hall seeded successfully');
};