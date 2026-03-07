const categoria = require("/Users/aleja/OneDrive/Documentos/Empresa/carta/backend/src/models/categoria");

module.exports = (sequelize, DataTypes) => {
    const Producto = sequelize.define('Producto', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        categoriaId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'categorias',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT',
        },
        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        estado: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        descripcion: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        precio: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        imagenUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    }, {
        tableName: 'productos',
        timestamps: true,
        underscored: true,
    });

    return Producto;
};