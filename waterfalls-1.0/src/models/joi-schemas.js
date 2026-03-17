import Joi from "joi";

export const UserSpec = {
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
};

export const UserCredentialsSpec = {
  email: Joi.string().email().required(),
  password: Joi.string().required(),
};

export const WaterfallSpec = {
  name: Joi.string().required(),
  description: Joi.string().required(),
  x: Joi.number().required(),
  y: Joi.number().required(),
};

export const POISpec = {
  type: Joi.string().required(),
  description: Joi.string().required(),
  xCoordinate: Joi.number().required(),
  yCoordinate: Joi.number().required(),
};
