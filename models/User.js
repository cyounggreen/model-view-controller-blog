const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
//Bcrypt for password hashing
const bcrypt = require('bcrypt');

class User extends Model {
  checkPassword(loginPW) {
    return bcrypt.compareSync(loginPW, this.password);
  }
}

User.init(
  {
    //define ID column
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    //define Username column
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    //define password
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      // password must be at least five characters long
      validate: {
        len: [7],
      },
    },
  },
  {
    // hooks for password hashing.
    hooks: {
      beforeCreate: async (newDataUser) => {
        newDataUser.password = await bcrypt.hash(newDataUser.password, 10);
        return newDataUser;
      },
      async beforeUpdate(updatedDataUser) {
        updatedDataUser.password = await bcrypt.hash(
          updatedDataUser.password,
          10
        );
        return updatedDataUser;
      },
    },
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'user',
  }
);

module.exports = User;
