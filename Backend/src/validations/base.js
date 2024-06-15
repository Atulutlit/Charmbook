const Joi = require("joi");

class Base {
  isNumber(isRequired) {
    let schema = Joi.number();
    if (isRequired) {
      schema = schema.required();
    }
    return schema;
  }

  isDate(isRequired) {
    let schema = Joi.date();
    if (isRequired) {
      schema = schema.required();
    }
    return schema;
  }

  isString(isRequired) {
    let schema = Joi.string().trim();
    if (isRequired) {
      schema = schema.required();
    }
    return schema;
  }
  
  role(isRequired) {
    let schema = Joi.string().trim().valid(
      "STUDENT", 
      "TEACHER"
    );

    if (isRequired) {
      schema = schema.required();
    }
    return schema;
  }

  isStringAlpha(isRequired) {
    let schema = Joi.string().trim().alphanum();
    if (isRequired) {
      schema = schema.required();
    }
    return schema;
  }

  isBoolean(isRequired) {
    let schema = Joi.bool();
    if (isRequired) {
      schema = schema.required();
    }
    return schema;
  }

  isEmail(isRequired) {
    let schema = Joi.string().trim().email();
    if (isRequired) {
      schema = schema.required();
    }
    return schema;
  }

  isPhone(isRequired) {
    let schema = Joi.string()
      .regex(/^\d{10}$/) 
      .message(`"phone" number is not valid!`);
    if (isRequired) {
      schema = schema.required();
    }
    return schema;
  }
  

  isSort(isRequired) {
    let schema = Joi.string().trim().valid('asc', 'desc');
    if (isRequired) {
      schema = schema.required();
    }
    return schema;
  }

  isStringArray(isRequired) {
    let schema = isRequired
      ? Joi.array().items(Joi.string().trim().required())
      : Joi.array().items(Joi.string().trim());

    if (isRequired) {
      schema = schema.required();
    }
    return schema;
  }
}

module.exports = Base;
