import Joi from "joi";

export const IdSpec = Joi.alternatives().try(Joi.string(), Joi.object()).description("a valid ID");

export const UserSpec = Joi.object().keys({
  firstName: Joi.string().example("Homer").required(),
  lastName: Joi.string().example("Simpson").required(),
  email: Joi.string().email().example("homers@simpson.com").required(),
  password: Joi.string().example("secret").required(),
  _id: IdSpec,
  __v: Joi.number(),
}).label("UserDetails");

export const UserArray = Joi.array().items(UserSpec).label("UserArray");

export const UserCredentialsSpec = Joi.object().keys({
  email: Joi.string().email().example("homers@simpson.com").required(),
  password: Joi.string().example("secret").required(),
}).label("UserCredentials");

export const UserCredentialsArray = Joi.array().items(UserCredentialsSpec).label("UserCredentialsArray");

export const WaterfallSpec = Joi.object().keys({
  name: Joi.string().example("Powerscourt Waterfall").required(),
  description: Joi.string().example("A beautiful waterfalL").required(),
  latitude: Joi.number().min(-90).max(90).example(53.1461).required(),
  longitude: Joi.number().min(-180).max(180).example(-6.2112).required(),
}).label("WaterfallDetails");

export const WaterfallArray = Joi.array().items(WaterfallSpec).label("WaterfallArray");

export const POISpec = Joi.object().keys( {
  type: Joi.string().example("Powerscourt House & Gardens").required(),
  description: Joi.string().example("Beautiful gardens").required(),
  latitude: Joi.number().min(-90).max(90).example(53.18472).required(),
  longitude: Joi.number().min(-180).max(180).example(-6.18694).required(),
}).label("POIDetails");

export const POIArray = Joi.array().items(POISpec).label("POIArray");
