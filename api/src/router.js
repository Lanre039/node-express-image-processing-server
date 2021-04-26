const {Router} = require('express');
const multer = require('multer');

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

const upload = multer({fileFilter: fileFilter, storage: storage});

router.post('/upload', upload.single('photo'), (request, response) => {
  const error = request['fileValidationError '];
  if (error) {
    response.status(400).json({error});
  }

  response.status(201).json({success: true});
});

module.exports = router;
