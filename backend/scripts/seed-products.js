// Taruh di: backend/scripts/seed-products.js
// Memindahkan isi frontend/data/dummyProducts.js ke database (sekali jalan).
// Jalankan dari folder backend:  node scripts/seed-products.js
// Produk dengan nama yang sudah ada di database dilewati.
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const file = path.join(__dirname, '..', '..', 'frontend', 'data', 'dummyProducts.js');

function loadDummyProducts() {
  const source = fs
    .readFileSync(file, 'utf8')
    .replace(/export\s+const\s+dummyProducts\s*=/, 'module.exports =');
  const holder = { exports: null };
  new Function('module', source)(holder);
  if (!Array.isArray(holder.exports)) throw new Error('dummyProducts is not an array');
  return holder.exports;
}

const list = (value) => (Array.isArray(value) ? value.filter((v) => typeof v === 'string' && v.trim()) : []);
const url = (value) => (typeof value === 'string' && /^https?:\/\//i.test(value) ? value : null);

async function main() {
  const products = loadDummyProducts();
  let created = 0;

  for (const p of products) {
    const name = p.name || p.title;
    if (!name) continue;

    const exists = await prisma.product.findFirst({ where: { name } });
    if (exists) {
      console.log('Dilewati (sudah ada):', name);
      continue;
    }

    await prisma.product.create({
      data: {
        name,
        category: p.category || 'Uncategorized',
        shortDescription: p.shortDescription || p.description || name,
        longDescription: p.longDescription || p.description || null,
        lecturers: JSON.stringify(list(p.creators?.lecturers)),
        students: JSON.stringify(list(p.creators?.students)),
        techStack: JSON.stringify(list(p.techStack || p.tech)),
        features: JSON.stringify(list(p.features)),
        videoUrl: url(p.videoUrl),
        demoUrl: url(p.demoUrl),
        githubUrl: url(p.githubUrl),
        // Hanya screenshot berupa tautan http(s); file lokal diunggah ulang lewat web
        screenshots: {
          create: list(p.screenshots).filter((s) => url(s)).map((s) => ({ url: s })),
        },
      },
    });
    created += 1;
    console.log('Ditambahkan:', name);
  }

  console.log(`Selesai. ${created} produk ditambahkan.`);
}

main()
  .catch((e) => {
    console.error('Gagal membaca atau memindahkan dummyProducts.js:', e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
