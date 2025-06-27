import multer from 'multer';

const storage = multer.memoryStorage(); // Armazena a imagem na memória

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limite de 5MB por arquivo
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true); // Aceita imagens
    } else {
      cb(new Error('Apenas arquivos de imagem são permitidos!'));
    }
  },
});

export default upload;
