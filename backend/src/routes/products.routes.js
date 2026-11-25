// Taruh di: backend/src/routes/products.routes.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { upload, removeUploadedFile } = require('../middleware/upload');

const router = express.Router();
const prisma = new PrismaClient();

const include = { screenshots: { orderBy: { createdAt: 'asc' } } };

// Daftar (dosen, mahasiswa, tech stack, fitur) disimpan sebagai teks JSON
function parseList(value) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function cleanList(list) {
  return (Array.isArray(list) ? list : [])
    .map((v) => (typeof v === 'string' ? v.trim() : ''))
    .filter(Boolean)
    .slice(0, 50);
}

const isHttpUrl = (value) => /^https?:\/\//i.test(value);
const optional = (value) => (typeof value === 'string' ? value.trim() : '') || null;

// Ubah data dari database menjadi bentuk yang dipakai front end
function serialize(p) {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    shortDescription: p.shortDescription,
    longDescription: p.longDescription || '',
    creators: { lecturers: parseList(p.lecturers), students: parseList(p.students) },
    techStack: parseList(p.techStack),
    features: parseList(p.features),
    videoUrl: p.videoUrl || '',
    demoUrl: p.demoUrl || '',
    githubUrl: p.githubUrl || '',
    screenshots: p.screenshots.map((s) => ({ id: s.id, url: s.url })),
  };
}

// Hanya ambil field yang diizinkan (bukan langsung req.body)
function readBody(body) {
  const creators = body.creators || {};
  return {
    name: (body.name || '').trim(),
    category: (body.category || '').trim(),
    shortDescription: (body.shortDescription || '').trim(),
    longDescription: optional(body.longDescription),
    lecturers: JSON.stringify(cleanList(creators.lecturers)),
    students: JSON.stringify(cleanList(creators.students)),
    techStack: JSON.stringify(cleanList(body.techStack)),
    features: JSON.stringify(cleanList(body.features)),
    videoUrl: optional(body.videoUrl),
    demoUrl: optional(body.demoUrl),
    githubUrl: optional(body.githubUrl),
  };
}

function validate(data) {
  if (!data.name || !data.category || !data.shortDescription) {
    return 'Name, category, and short description are required';
  }
  if (data.name.length > 150) return 'Name must be 150 characters or fewer';
  const links = [
    ['Video link', data.videoUrl],
    ['Demo link', data.demoUrl],
    ['GitHub link', data.githubUrl],
  ];
  for (const [label, value] of links) {
    // Hanya http(s): mencegah tautan berbahaya seperti javascript:
    if (value && !isHttpUrl(value)) return `${label} must start with http:// or https://`;
  }
  return null;
}

// ---------- Publik ----------
router.get('/', async (req, res) => {
  try {
    const items = await prisma.product.findMany({ include, orderBy: { createdAt: 'asc' } });
    res.json(items.map(serialize));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await prisma.product.findUnique({ where: { id: req.params.id }, include });
    if (!item) return res.status(404).json({ message: 'Product not found' });
    res.json(serialize(item));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ---------- Hanya ADMIN ----------
router.post('/', authenticateToken, authorizeRoles('ADMIN'), async (req, res) => {
  try {
    const data = readBody(req.body);
    const problem = validate(data);
    if (problem) return res.status(400).json({ message: problem });

    const created = await prisma.product.create({ data, include });
    res.status(201).json(serialize(created));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', authenticateToken, authorizeRoles('ADMIN'), async (req, res) => {
  try {
    const data = readBody(req.body);
    const problem = validate(data);
    if (problem) return res.status(400).json({ message: problem });

    const updated = await prisma.product.update({ where: { id: req.params.id }, data, include });
    res.json(serialize(updated));
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ message: 'Product not found' });
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', authenticateToken, authorizeRoles('ADMIN'), async (req, res) => {
  try {
    const existing = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { screenshots: true },
    });
    if (!existing) return res.status(404).json({ message: 'Product not found' });

    await prisma.product.delete({ where: { id: req.params.id } });
    existing.screenshots.forEach((s) => removeUploadedFile(s.url)); // hapus file screenshot juga
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Unggah screenshot (field "screenshots", maksimal 10 file per permintaan)
router.post('/:id/screenshots', authenticateToken, authorizeRoles('ADMIN'), (req, res) => {
  upload.array('screenshots', 10)(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });

    const files = req.files || [];
    const cleanup = () => files.forEach((f) => removeUploadedFile(`/uploads/${f.filename}`));
    if (files.length === 0) return res.status(400).json({ message: 'At least one screenshot is required' });

    try {
      const exists = await prisma.product.findUnique({
        where: { id: req.params.id },
        select: { id: true },
      });
      if (!exists) {
        cleanup();
        return res.status(404).json({ message: 'Product not found' });
      }

      const created = await prisma.$transaction(
        files.map((f) =>
          prisma.productScreenshot.create({
            data: { url: `/uploads/${f.filename}`, productId: req.params.id },
          })
        )
      );
      res.status(201).json(created.map((s) => ({ id: s.id, url: s.url })));
    } catch (error) {
      cleanup();
      res.status(500).json({ error: error.message });
    }
  });
});

// Hapus satu screenshot
router.delete('/:id/screenshots/:screenshotId', authenticateToken, authorizeRoles('ADMIN'), async (req, res) => {
  try {
    const shot = await prisma.productScreenshot.findFirst({
      where: { id: req.params.screenshotId, productId: req.params.id },
    });
    if (!shot) return res.status(404).json({ message: 'Screenshot not found' });

    await prisma.productScreenshot.delete({ where: { id: shot.id } });
    removeUploadedFile(shot.url);
    res.json({ message: 'Screenshot deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
