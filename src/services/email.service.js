import { Sequelize } from 'sequelize';
import { ApiError } from '../exeptions/api.error.js';
import { Email } from '../models/email.js';

export const getOne = async(email) => {
  const isEmailExist = await Email.findOne({
    where: { email },
  });

  return isEmailExist;
};

export const getAll = async() => {
  const emails = await Email.findAll({
    attributes: {
      exclude: ['id', 'createdAt', 'deletedAt'],
    },
  });

  return emails;
};

export const create = async(email) => {
  try {
    const existingEmail = await getOne(email);

    if (existingEmail && existingEmail.status === 'unsubscribed') {
      existingEmail.status = 'subscribed';
      existingEmail.deletedAt = null;
      existingEmail.createdAt = Sequelize.fn('NOW');

      await existingEmail.save();
    } else {
      await Email.create({ email });
    }
  } catch (error) {
    throw ApiError.cannotPost('Cannot create');
  }
};

export const remove = async(email) => {
  try {
    const existingEmail = await getOne(email);

    existingEmail.status = 'unsubscribed';
    existingEmail.deletedAt = Sequelize.fn('NOW');

    await existingEmail.save();
  } catch (error) {
    throw ApiError.cannotPost('Cannot delete');
  }
};
