import { client } from '../utils/db.js';
import { DataTypes, Sequelize } from 'sequelize';

export const Email = client.define('Email', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  status: {
    type: DataTypes.ENUM('subscribed', 'unsubscribed'),
    allowNull: false,
    defaultValue: 'subscribed',
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.fn('NOW'),
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'emails',
  updatedAt: false,
});
