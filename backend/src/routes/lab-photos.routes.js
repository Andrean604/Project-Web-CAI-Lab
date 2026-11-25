// Taruh di: backend/src/routes/lab-photos.routes.js (ganti)
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { upload, removeUploadedFile } = require('../middleware/upload');

const router = express.Router();
const prisma = new PrismaClient();

const MAX_CAPTION = 500;

// Publik: semua orang boleh melihat
router.get('/', async (req, res) => {
    try {
        const photos = await prisma.labPhoto.findMany({ orderBy: { createdAt: 'desc' } });
        res.json(photos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Hanya ADMIN: unggah satu foto (field "photo", caption opsional)
router.post('/', authenticateToken, authorizeRoles('ADMIN'), (req, res) => {
    upload.single('photo')(req, res, async (err) => {
        if (err) return res.status(400).json({ message: err.message });
        if (!req.file) return res.status(400).json({ message: 'Photo file is required' });

        const url = `/uploads/${req.file.filename}`;
        const caption = (req.body.caption || '').trim();

        if (caption.length > MAX_CAPTION) {
            removeUploadedFile(url);
            return res.status(400).json({ message: `Caption must be ${MAX_CAPTION} characters or fewer` });
        }

        try {
            const photo = await prisma.labPhoto.create({
                data: { url, caption: caption || null },
            });
            res.status(201).json(photo);
        } catch (error) {
            removeUploadedFile(url);
            res.status(500).json({ error: error.message });
        }
    });
});

// Hanya ADMIN: ubah caption (penjelasan fasilitas)
router.patch('/:id', authenticateToken, authorizeRoles('ADMIN'), async (req, res) => {
    try {
        const caption = (req.body.caption || '').trim();
        if (caption.length > MAX_CAPTION) {
            return res.status(400).json({ message: `Caption must be ${MAX_CAPTION} characters or fewer` });
        }

        const photo = await prisma.labPhoto.update({
            where: { id: req.params.id },
            data: { caption: caption || null },
        });
        res.json(photo);
    } catch (error) {
        if (error.code === 'P2025') return res.status(404).json({ message: 'Photo not found' });
        res.status(500).json({ error: error.message });
    }
});

// Hanya ADMIN: hapus foto (record dan file)
router.delete('/:id', authenticateToken, authorizeRoles('ADMIN'), async (req, res) => {
    try {
        const photo = await prisma.labPhoto.delete({ where: { id: req.params.id } });
        removeUploadedFile(photo.url);
        res.json({ message: 'Photo deleted' });
    } catch (error) {
        if (error.code === 'P2025') return res.status(404).json({ message: 'Photo not found' });
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;