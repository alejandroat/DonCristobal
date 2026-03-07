const { Producto } = require('../models');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		const uploadPath = 'uploads/productos';
		if (!fs.existsSync(uploadPath)) {
			fs.mkdirSync(uploadPath, { recursive: true });
		}
		cb(null, uploadPath);
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
		const productos = await Producto.findAll({ attributes: ['id', 'nombre', 'descripcion', 'precio', 'estado', 'imagenUrl', 'categoria_id', 'createdAt', 'updatedAt'], order: [['id', 'ASC']] });
		console.log(productos);
		res.json(productos);
	} catch (err) {
		next(err);
		console.error(err);
	}
};


exports.getById = async (req, res, next) => {
	try {
		const { id } = req.params;
		const producto = await Producto.findByPk(id, { attributes: ['id', 'nombre', 'descripcion', 'precio', 'estado', 'imagenUrl', 'categoria_id'] });
		if (!producto) return res.status(404).json({ message: 'Producto not found' });
		console.log(producto);
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
		console.log(item);
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
		if (!item) return res.status(404).json({ message: 'Producto no encontrada' });

		const itemData = { ...req.body };
		let oldImagePath = null;

		if (req.file) {
			if (item.imagenUrl) {
				oldImagePath = path.join('uploads/producto', path.basename(item.imagenUrl));
			}
			itemData.imagenUrl = `/uploads/producto/${req.file.filename}`;
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


exports.deleteProducto = async (req, res, next) => {
	try {
		const item = await Producto.findByPk(req.params.id);
		if (!item) return res.status(404).json({ message: 'Producto no encontrado' });

		if (item.imagenUrl) {
			const imagePath = path.join('uploads/producto', path.basename(item.imagenUrl));
			if (fs.existsSync(imagePath)) {
				fs.unlink(imagePath, (unlinkErr) => {
					if (unlinkErr) console.error('Error al eliminar archivo:', unlinkErr);
				});
			}
		}
		console.log(`Producto con id ${req.params.id} eliminado`);
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
		if (!item || !item.imagenUrl) {
			return res.sendFile(path.join(__dirname, '../assets/default-product.png'));
		}

		const imagePath = path.join(__dirname, '../../uploads/producto', path.basename(item.imagenUrl));
		if (fs.existsSync(imagePath)) {
			console.log(`Enviando imagen de producto con id ${req.params.id}`);
			res.sendFile(imagePath);
		} else {
			console.log(`Imagen no encontrada para producto con id ${req.params.id}, enviando imagen por defecto`);
			res.sendFile(path.join(__dirname, '../assets/default-product.png'));
		}
		
	} catch (error) {
		next(error);
		console.error(error);
	}
}

exports.uploadMiddleware = upload;
