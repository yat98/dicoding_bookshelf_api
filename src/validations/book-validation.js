/* eslint-disable max-len */
import Joi from 'joi';
import {schemaOption} from './validate.js';
import failHandler from '../handlers/fail-handler.js';

const storeBookValidation = {
  options: schemaOption,
  failAction: failHandler,
  payload: Joi.object({
    name: Joi.string().required().messages({
      'string.base': 'Gagal menambahkan buku. nama harus berupa text',
      'any.required': 'Gagal menambahkan buku. Mohon isi nama buku',
    }),
    pageCount: Joi.number().positive().messages({
      'number.base': 'Gagal menambahkan buku. pageCount harus berupa angka',
      'number.positive': 'Gagal menambahkan buku. pageCount harus angka positif',
    }),
    readPage: Joi.number().positive().when('pageCount', {
      is: Joi.number().required(),
      then: Joi.number().max(Joi.ref('pageCount')).messages({
        'number.max': 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      }),
    }),
  }),
};

export {
  storeBookValidation,
};
