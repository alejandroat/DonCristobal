const { Producto } = require('../models');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Canonical upload dir (independent from process CWD)
const UPLOAD_DIR = path.join(__dirname, '../../uploads/producto');

// Legacy dirs (in case older runs saved files elsewhere)
const LEGACY_UPLOAD_DIRS = [
	path.join(__dirname, '../../uploads/producto'),
	path.join(__dirname, '../../uploads/productos'),
	path.join(__dirname, '../uploads/producto'),
	path.join(__dirname, '../uploads/productos'),
];

function ensureDir(dirPath) {
	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath, { recursive: true });
	}
}

function findImagePath(imagenUrl) {
	if (!imagenUrl) return null;
	const filename = path.basename(imagenUrl);
	for (const dir of LEGACY_UPLOAD_DIRS) {
		const candidate = path.join(dir, filename);
		if (fs.existsSync(candidate)) return candidate;
	}
	return null;
}

ensureDir(UPLOAD_DIR);

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, UPLOAD_DIR);
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
		const extension = path.extname(file.originalname);
		cb(null, 'producto-' + uniqueSuffix + extension);
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

exports.getAll = async (req, res, next) => {
	try {
		const productos = await Producto.findAll({
			attributes: ['id', 'nombre', 'descripcion', 'precio', 'estado', 'imagenUrl', 'categoriaId', 'createdAt', 'updatedAt'],
			order: [['id', 'ASC']]
		});
		res.json(productos);
	} catch (err) {
		next(err);
		console.error(err);
	}
};

exports.getByCategoria = async (req, res, next) => {
	try {
		const categoriaId = Number(req.params.categoriaId);
		if (!Number.isFinite(categoriaId)) {
			return res.status(400).json({ message: 'categoriaId inválido' });
		}

		const productos = await Producto.findAll({
			where: { categoriaId },
			attributes: ['id', 'nombre', 'descripcion', 'precio', 'estado', 'imagenUrl', 'categoriaId', 'createdAt', 'updatedAt'],
			order: [['id', 'ASC']]
		});

		return res.json(productos);
	} catch (err) {
		next(err);
		console.error(err);
	}
};

exports.getById = async (req, res, next) => {
	try {
		const { id } = req.params;
		const producto = await Producto.findByPk(id, {
			attributes: ['id', 'nombre', 'descripcion', 'precio', 'estado', 'imagenUrl', 'categoriaId']
		});
		if (!producto) return res.status(404).json({ message: 'Producto no encontrado' });
		res.json(producto);
	} catch (err) {
		next(err);
		console.error(err);
	}
};

exports.createProducto = async (req, res, next) => {
	try {
		const itemData = { ...req.body };
		if (req.file) {
			itemData.imagenUrl = `/uploads/producto/${req.file.filename}`;
		}

		const item = await Producto.create(itemData);
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

exports.updateProducto = async (req, res, next) => {
	try {
		const item = await Producto.findByPk(req.params.id);
		if (!item) return res.status(404).json({ message: 'Producto no encontrado' });

		const itemData = { ...req.body };
		let oldImagePath = null;

		if (req.file) {
			oldImagePath = findImagePath(item.imagenUrl);
			itemData.imagenUrl = `/uploads/producto/${req.file.filename}`;
		}

		await item.update(itemData);

		if (oldImagePath && fs.existsSync(oldImagePath)) {
			fs.unlink(oldImagePath, (unlinkErr) => {
				if (unlinkErr) console.error('Error al eliminar archivo antiguo:', unlinkErr);
			});
		}

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

exports.deleteProducto = async (req, res, next) => {
	try {
		const item = await Producto.findByPk(req.params.id);
		if (!item) return res.status(404).json({ message: 'Producto no encontrado' });

		const imagePath = findImagePath(item.imagenUrl);
		if (imagePath && fs.existsSync(imagePath)) {
			fs.unlink(imagePath, (unlinkErr) => {
				if (unlinkErr) console.error('Error al eliminar archivo:', unlinkErr);
			});
		}

		await item.destroy();
		res.json({ message: 'Producto eliminado' });
	} catch (err) {
		next(err);
		console.error(err);
	}
};

exports.getProductoImage = async (req, res, next) => {
	try {
		const item = await Producto.findByPk(req.params.id);
		if (!item || !item.imagenUrl) return res.status(404).end();

		const imagePath = findImagePath(item.imagenUrl);
		if (!imagePath) return res.status(404).end();

		console.log(`Enviando imagen de producto con id ${req.params.id}`);
		return res.sendFile(imagePath);
	} catch (error) {
		next(error);
		console.error(error);
	}
}
exports.uploadMiddleware = upload;

