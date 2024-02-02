import * as emailService from '../services/email.service.js';
import { ApiError } from '../exeptions/api.error.js';

export const get = async(req, res) => {
  const emails = await emailService.getAll();

  res.send(emails);
};

export const create = async(req, res) => {
  const { email } = req.body;

  if (!email || typeof email !== 'string') {
    throw ApiError.badRequest('Bad request', {
      name: 'Email is not valid',
    });
  }

  const isExist = await emailService.getOne(email);

  if (isExist && isExist.status === 'subscribed') {
    throw ApiError.exist();
  }

  await emailService.create(email);

  res.status(200).json({ message: 'Email added' });
};

export const remove = async(req, res) => {
  const { email } = req.body;

  const isExist = await emailService.getOne(email);

  if (!isExist) {
    throw ApiError.notFound('Cannot delete', {
      email: 'Email not found',
    });
  }

  await emailService.remove(email);

  res.status(200).json({ message: 'Email deleted' });
};
