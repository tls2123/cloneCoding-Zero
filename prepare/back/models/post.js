module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('Post', {
        content: {
            type: DataTypes.TEXT,
            allowNull: false, //필수
        },
    },{
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci', //한글 저장, md4 이모티콘도 넣으려면
    });
    Post.associate = (db) => {
        db.Post.belongsTo(db.User);
        db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });
        db.Post.hasMany(db.Comment);
        db.Post.hasMany(db.Image);
        db.Post.belongsTo(db.Post, {as : 'Retweet'});
        db.Post.belongsToMany(db.User, { through: 'Like', as: 'Likers' });
    };
    return Post;
}