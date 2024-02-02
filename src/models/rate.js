import { client } from '../utils/db.js';
import { DataTypes, Sequelize } from 'sequelize';

export const Rate = client.define('Rate', {
  value: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.fn('NOW'),
  },
}, {
  tableName: 'rates',
  createdAt: false,
  updatedAt: false,
});
