
module.exports = (sequelize, DataTypes) => {
    const Categoria = sequelize.define('Categoria', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
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
        imagenUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    }, {
        tableName: 'categorias',
        timestamps: true,
        underscored: true,
    });

    return Categoria;
};