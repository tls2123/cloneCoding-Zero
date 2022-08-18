module.exports = (sequelize, DataTypes) => {
    const Image = sequelize.define('Image', {
        src: {
            type: DataTypes.STRING(200),
            allowNull: false, //필수
        },
    },{
        charset: 'utf8',
        collate: 'utf8_general_ci', //한글 저장, md4 이모티콘도 넣으려면
    });
    Image.associate = (db) => {
        db.Image.belongsTo(db.Post);
    };
    return Image;
}