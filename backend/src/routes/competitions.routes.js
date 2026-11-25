// Taruh di: backend/src/routes/competitions.routes.js (ganti)
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { upload, removeUploadedFile } = require('../middleware/upload');

const router = express.Router();
const prisma = new PrismaClient();

const include = {
  participants: true,
  videos: true,
  photos: { orderBy: { createdAt: 'asc' } },
};

const LEVELS = ['Campus', 'Regional', 'National', 'International'];

// Ubah data dari database menjadi bentuk yang dipakai front end
function serialize(c) {
  const participants = c.participants.map((p) => ({ name: p.name, nim: p.nim || '' }));
  const videos = c.videos.map((v) => v.url);
  return {
    id: c.id,
    title: c.title,
    organizer: c.organizer,
    achievement: c.achievement,
    category: c.category,
    year: String(c.year),
    level: c.level || '',
    eventDate: c.eventDate ? c.eventDate.toISOString().slice(0, 10) : '',
    location: c.location || '',
    certificateUrl: c.certificateUrl || '',
    lecturer: c.lecturer || '',
    description: c.description || '',
    story: c.story || '',
    thumbnail: c.thumbnail || '',
    participants,
    teamMembers: participants.map((p) => p.name).join(', '),
    videos,
    videoUrl: videos[0] || '',
    photos: c.photos.map((p) => ({ id: p.id, url: p.url })),
  };
}

// Hanya ambil field yang diizinkan (bukan langsung req.body)
function buildData(body) {
  const {
    title, organizer, achievement, category, year, lecturer, description, story, thumbnail,
    level, eventDate, location, certificateUrl,
  } = body;
  return {
    title,
    organizer,
    achievement,
    category,
    year: parseInt(year, 10),
    level: level || null,
    eventDate: eventDate ? new Date(`${eventDate}T00:00:00Z`) : null,
    location: (location || '').trim() || null,
    certificateUrl: (certificateUrl || '').trim() || null,
    lecturer: lecturer || null,
    description: description || null,
    story: story || null,
    thumbnail: thumbnail || null,
  };
}

function cleanParticipants(list) {
  return (Array.isArray(list) ? list : [])
    .filter((p) => p && p.name && p.name.trim())
    .map((p) => ({ name: p.name.trim(), nim: p.nim ? String(p.nim).trim() : null }));
}

function cleanVideos(list) {
  return (Array.isArray(list) ? list : [])
    .map((v) => (typeof v === 'string' ? v.trim() : ''))
    .filter(Boolean)
    .map((url) => ({ url }));
}

function validate(body) {
  if (!body.title || !body.organizer || !body.achievement) {
    return 'Title, organizer, and achievement are required';
  }
  if (Number.isNaN(parseInt(body.year, 10))) {
    return 'Year must be a number';
  }
  if (body.level && !LEVELS.includes(body.level)) {
    return `Level must be one of: ${LEVELS.join(', ')}`;
  }
  if (body.eventDate && Number.isNaN(new Date(`${body.eventDate}T00:00:00Z`).getTime())) {
    return 'Event date is invalid';
  }
  // Hanya http(s): mencegah tautan berbahaya seperti javascript:
  if (body.certificateUrl && !/^https?:\/\//i.test(body.certificateUrl.trim())) {
    return 'Certificate link must start with http:// or https://';
  }
  return null;
}

// ---------- Publik ----------
router.get('/', async (req, res) => {
  try {
    const items = await prisma.competition.findMany({ include, orderBy: { createdAt: 'desc' } });
    res.json(items.map(serialize));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await prisma.competition.findUnique({ where: { id: req.params.id }, include });
    if (!item) return res.status(404).json({ message: 'Competition not found' });
    res.json(serialize(item));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ---------- Hanya ADMIN ----------
router.post('/', authenticateToken, authorizeRoles('ADMIN'), async (req, res) => {
  try {
    const problem = validate(req.body);
    if (problem) return res.status(400).json({ message: problem });

    const created = await prisma.competition.create({
      data: {
        ...buildData(req.body),
        participants: { create: cleanParticipants(req.body.participants) },
        videos: { create: cleanVideos(req.body.videos) },
      },
      include,
    });
    res.status(201).json(serialize(created));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', authenticateToken, authorizeRoles('ADMIN'), async (req, res) => {
  try {
    const problem = validate(req.body);
    if (problem) return res.status(400).json({ message: problem });

    const updated = await prisma.competition.update({
      where: { id: req.params.id },
      data: {
        ...buildData(req.body),
        participants: { deleteMany: {}, create: cleanParticipants(req.body.participants) },
        videos: { deleteMany: {}, create: cleanVideos(req.body.videos) },
      },
      include,
    });
    res.json(serialize(updated));
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ message: 'Competition not found' });
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', authenticateToken, authorizeRoles('ADMIN'), async (req, res) => {
  try {
    const existing = await prisma.competition.findUnique({
      where: { id: req.params.id },
      include: { photos: true },
    });
    if (!existing) return res.status(404).json({ message: 'Competition not found' });

    await prisma.competition.delete({ where: { id: req.params.id } });
    existing.photos.forEach((p) => removeUploadedFile(p.url)); // hapus file fotonya juga
    res.json({ message: 'Competition deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Unggah foto lomba (field "photos", maksimal 10 file per permintaan)
router.post('/:id/photos', authenticateToken, authorizeRoles('ADMIN'), (req, res) => {
  upload.array('photos', 10)(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });

    const files = req.files || [];
    const cleanup = () => files.forEach((f) => removeUploadedFile(`/uploads/${f.filename}`));
    if (files.length === 0) return res.status(400).json({ message: 'At least one photo is required' });

    try {
      const exists = await prisma.competition.findUnique({
        where: { id: req.params.id },
        select: { id: true },
      });
      if (!exists) {
        cleanup();
        return res.status(404).json({ message: 'Competition not found' });
      }

      const created = await prisma.$transaction(
        files.map((f) =>
          prisma.competitionPhoto.create({
            data: { url: `/uploads/${f.filename}`, competitionId: req.params.id },
          })
        )
      );
      res.status(201).json(created.map((p) => ({ id: p.id, url: p.url })));
    } catch (error) {
      cleanup();
      res.status(500).json({ error: error.message });
    }
  });
});

// Hapus satu foto lomba
router.delete('/:id/photos/:photoId', authenticateToken, authorizeRoles('ADMIN'), async (req, res) => {
  try {
    const photo = await prisma.competitionPhoto.findFirst({
      where: { id: req.params.photoId, competitionId: req.params.id },
    });
    if (!photo) return res.status(404).json({ message: 'Photo not found' });

    await prisma.competitionPhoto.delete({ where: { id: photo.id } });
    removeUploadedFile(photo.url);
    res.json({ message: 'Photo deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;