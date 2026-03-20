import Joi from "joi";

export const IdSpec = Joi.alternatives().try(Joi.string(), Joi.object()).description("a valid ID");

export const UserCredentialsSpec = Joi.object()
  .keys({
    email: Joi.string().email().example("homer@simpson.com").required(),
    password: Joi.string().example("secret").required(),
  })
  .label("UserCredentials");

export const UserSpec = UserCredentialsSpec.keys({
  firstName: Joi.string().example("Homer").required(),
  lastName: Joi.string().example("Simpson").required(),
}).label("UserDetails");

export const UserSpecPlus = UserSpec.keys({
  _id: IdSpec,
  __v: Joi.number(),
}).label("UserDetailsPlus");

export const UserArray = Joi.array().items(UserSpecPlus).label("UserArray");

export const WaterfallSpec = Joi.object()
  .keys({
    name: Joi.string().example("Powerscourt Waterfall").required(),
    description: Joi.string().example("A beautiful waterfalL").required(),
    latitude: Joi.number().min(-90).max(90).example(53.1461).required(),
    longitude: Joi.number().min(-180).max(180).example(-6.2112).required(),
    userid: IdSpec,
    _id: IdSpec,
    __v: Joi.number(),
  })
  .label("WaterfallDetails");

export const WaterfallSpecPlus = WaterfallSpec.keys({
  _id: IdSpec,
  __v: Joi.number(),
}).label("WaterfallDetailsPlus");

export const WaterfallArray = Joi.array().items(WaterfallSpecPlus).label("WaterfallArray");

export const POISpec = Joi.object()
  .keys({
    type: Joi.string().example("Powerscourt House & Gardens").required(),
    description: Joi.string().example("Beautiful gardens").required(),
    latitude: Joi.number().min(-90).max(90).example(53.18472).required(),
    longitude: Joi.number().min(-180).max(180).example(-6.18694).required(),
    waterfallid: IdSpec,
    _id: IdSpec,
    __v: Joi.number(),
  })
  .label("POIDetails");

export const POISpecPlus = POISpec.keys({
  _id: IdSpec,
  __v: Joi.number(),
}).label("POIDetailsPlus");

export const POIArray = Joi.array().items(POISpecPlus).label("POIArray");
