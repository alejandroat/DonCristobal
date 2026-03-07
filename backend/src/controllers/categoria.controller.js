const { Categoria } = require('../models');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		const uploadPath = 'uploads/categorias';
		if (!fs.existsSync(uploadPath)) {
			fs.mkdirSync(uploadPath, { recursive: true });
		}
		cb(null, uploadPath);
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
		const extension = path.extname(file.originalname);
		cb(null, 'categoria-' + uniqueSuffix + extension);
	}
});

const fileFilter = (req, file, cb) => {
	if (file.mimetype.startsWith('image/')) {
		cb(null, true);
	} else {
		cb(new Error('Solo se permiten archivos de imagen'), false);
	}
};

const upload = multer({
	storage: storage,
	fileFilter: fileFilter,
	limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

exports.uploadImage = upload.single('imagen');

exports.createCategoria = async (req, res, next) => {
	try {
		const itemData = { ...req.body };
		if (req.file) {
			itemData.imagenUrl = `/uploads/categoria/${req.file.filename}`;
		}

		const item = await Categoria.create(itemData);
		console.log(item);
		res.status(201).json(item);
	} catch (err) {

		if (req.file) {
			fs.unlink(req.file.path, (unlinkErr) => {
				if (unlinkErr) console.error('Error al eliminar archivo:', unlinkErr);
			});
		}
		next(err);
		console.error(err);
	}
};

exports.getAll = async (req, res, next) => {
	try {
		const categorias = await Categoria.findAll({ attributes: ['id', 'nombre', 'estado', 'imagenUrl', 'createdAt', 'updatedAt'], order: [['id', 'ASC']] });
		console.log(categorias);
		res.json(categorias);
	} catch (err) {
		next(err);
		console.error(err);
	}
};


exports.getById = async (req, res, next) => {
	try {
		const { id } = req.params;
		const categoria = await Categoria.findByPk(id, { attributes: ['id', 'nombre', 'estado', 'imagenUrl'] });
		if (!categoria) return res.status(404).json({ message: 'Categoria no encontrada' });
		console.log(categoria);
		res.json(categoria);
	} catch (err) {
		next(err);
		console.error(err);
	}
};

exports.updateCategoria = async (req, res, next) => {
	try {
		const item = await Categoria.findByPk(req.params.id);
		if (!item) return res.status(404).json({ message: 'Categoria no encontrada' });

		const itemData = { ...req.body };
		let oldImagePath = null;

		if (req.file) {
			if (item.imagenUrl) {
				oldImagePath = path.join('uploads/categoria', path.basename(item.imagenUrl));
			}
			itemData.imagenUrl = `/uploads/categoria/${req.file.filename}`;
		}

		await item.update(itemData);

		if (oldImagePath && fs.existsSync(oldImagePath)) {
			fs.unlink(oldImagePath, (unlinkErr) => {
				if (unlinkErr) console.error('Error al eliminar archivo antiguo:', unlinkErr);
			});
		}
		console.log(item);

		res.json(item);

	} catch (err) {

		if (req.file) {
			fs.unlink(req.file.path, (unlinkErr) => {
				if (unlinkErr) console.error('Error al eliminar archivo:', unlinkErr);
			});
		}
		next(err);
		console.error(err);
	}
};

exports.deleteCategoria = async (req, res, next) => {
	try {
		const item = await Categoria.findByPk(req.params.id);
		if (!item) return res.status(404).json({ message: 'Categoria no encontrada' });

		if (item.imagenUrl) {
			const imagePath = path.join('uploads/categoria', path.basename(item.imagenUrl));
			if (fs.existsSync(imagePath)) {
				fs.unlink(imagePath, (unlinkErr) => {
					if (unlinkErr) console.error('Error al eliminar archivo:', unlinkErr);
				});
			}
		}

		await item.destroy();
		console.log(`Categoria con id ${req.params.id} eliminada`);
		res.json({ message: 'Categoria eliminada' });
		
	} catch (err) {
		next(err);
		console.error(err);
	}
};

exports.getCategoriaImage = async (req, res, next) => {
	try {
		const item = await Categoria.findByPk(req.params.id);
		if (!item || !item.imagenUrl) {
			return res.sendFile(path.join(__dirname, '../assets/default-category.png'));
		}

		const imagePath = path.join(__dirname, '../../uploads/categoria', path.basename(item.imagenUrl));
		if (fs.existsSync(imagePath)) {
			console.log(`Enviando imagen de categoria con id ${req.params.id}`);
			res.sendFile(imagePath);
		} else {
			console.warn(`Imagen no encontrada para categoria con id ${req.params.id}, enviando imagen por defecto`);
			res.sendFile(path.join(__dirname, '../assets/default-category.png'));
		}
		
	} catch (error) {
		next(error);
		console.error(error);
	}
}

exports.uploadMiddleware = upload;