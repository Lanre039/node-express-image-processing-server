const {Router} = require('express');
const multer = require('multer');
const path = require('path');
const imageProcessor = require('./imageProcessor');

const photoPath = path.resolve(__dirname, '../../client/photo-viewer.html');

const router = new Router();

const filename = (request, file, callback) => {
  callback(null, file.originalname);
};

const fileFilter = (request, file, callback) => {
  if (file.mimetype !== 'image/png') {
    request.fileValidationError = 'Wrong file type';
    callback(null, false, new Error('Wrong file type'));
  } else {
    callback(null, true);
  }
};

const storage = multer.diskStorage({
  destination: 'api/uploads/',
  filename: filename,
});

const upload = multer({
  fileFilter,
  storage,
});

router.post('/upload', upload.single('photo'), async (request, response) => {
  if (!request.file) {
    return response.status(400).json({error: 'No file uploaded!'});
  }
  if (request.fileValidationError) {
    return response.status(400).json({error: request.fileValidationError});
  }
  try {
    await imageProcessor(request.file.filename);
    return response.status(201).json({success: true});
  } catch (error) {
    return response.status(500).json({error: 'Server Error!'});
  }
});

router.get('/photo-viewer', (request, response) => {
  response.sendFile(photoPath);
});

module.exports = router;
