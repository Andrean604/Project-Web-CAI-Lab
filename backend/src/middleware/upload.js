// Taruh di: backend/src/middleware/upload.js
// Upload gambar ke folder backend/uploads (dipakai bersama oleh foto lab dan foto lomba).
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// backend/src/middleware -> naik dua tingkat -> backend/uploads
const uploadDir = path.join(__dirname, '..', '..', 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const allowed = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp' };

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    // Nama file acak: nama asli dari pengguna tidak pernah dipakai di disk
    filename: (req, file, cb) => cb(null, `${crypto.randomUUID()}${allowed[file.mimetype]}`),
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB per file
    fileFilter: (req, file, cb) => {
        if (allowed[file.mimetype]) return cb(null, true);
        cb(new Error('Only JPG, PNG, or WebP images are allowed'));
    },
});

// url berbentuk "/uploads/xxxx.jpg"
function removeUploadedFile(url) {
    if (!url || !url.startsWith('/uploads/')) return;
    fs.unlink(path.join(uploadDir, path.basename(url)), () => { });
}

module.exports = { upload, uploadDir, removeUploadedFile };