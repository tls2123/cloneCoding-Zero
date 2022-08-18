module.exports = (sequelize, DataTypes) => {
    const Hashtag = sequelize.define('Hashtag', {
        name: {
            type: DataTypes.STRING(20),
            allowNull: false, //필수
        },
    },{
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci', //한글 저장, md4 이모티콘도 넣으려면
    });
    Hashtag.associate = (db) => {
        db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag' });
    };
    return Hashtag;
}