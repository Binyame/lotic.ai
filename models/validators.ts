import Joi from 'joi';

const clinicianSchema = Joi.array().items(
  Joi.object({
    id: Joi.number().required(),
    provider: Joi.string().required(),
    providerId: Joi.string().required(),
    providerKey: Joi.string().required(),
    updatedAt: Joi.date().required(),
    createdAt: Joi.date().required(),
  })
);

export function isString(value) {
  if (value === undefined) return;
  if (typeof value !== 'string') {
    throw new Error('Must be a string');
  }
}

export function isNumber(value) {
  if (typeof value !== 'number') {
    throw new Error('Must be a number');
  }
}

export function isURL(value) {
  if (value === undefined) return;
  const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
  if (!urlRegex.test(value)) {
    throw new Error('Not a valid URL');
  }
}

export function isValidProvider(value) {
  if (['patient', 'clinician', 'loticUser', 'github'].indexOf(value) < 0) {
    throw new Error('Not a valid provider type');
  }
}

export function isValidUserType(value) {
  if (['patient', 'clinician', 'loticUser'].indexOf(value) < 0) {
    throw new Error('Not a valid user type');
  }
}

export function isValidAgreementContent(value) {
  if (['markdown'].indexOf(value) < 0) {
    throw new Error('Not an agreement content');
  }
}

export function isValidPatientAssessmentType(value) {
  if (['lotic', 'clinician'].indexOf(value) < 0) {
    throw new Error('Not a patient assessment type');
  }
}

export function isDateCheck(value) {
  if (!value) return;
  if (
    new Date(value).getFullYear() < 1980 ||
    Object.prototype.toString.call(new Date(value)) !== '[object Date]'
  ) {
    throw new Error('Must be a date');
  }
}

export function isValidMomentType(value) {
  if (['audio', 'video'].indexOf(value) < 0) {
    throw new Error('Not a valid moment type');
  }
}

export function isJSON(value) {
  if (typeof value !== 'object') {
    throw new Error('Not valid JSON');
  }

  const keys = Object.keys(value);

  if (!keys || !keys.length) {
    throw new Error('Not valid JSON');
  }
}

export function isValidClinicians(value) {
  if (typeof value !== 'string') {
    throw new Error('Must be a JSON');
  }
  if (typeof value === 'string') {
    const clinicians = JSON.parse(value);
    const isArrayCheck = Array.isArray(clinicians);

    if (!isArrayCheck) {
      throw new Error('Must be an Array');
    }

    if (isArrayCheck) {
      const { error } = clinicianSchema.validate(clinicians);
      if (error) {
        throw new Error('Wrong clinician object structure');
      }
    }
  }
}

export function isValidOwnerType(value) {
  if (['clinician', 'lotic'].indexOf(value) < 0) {
    throw new Error('Not a valid ownerType');
  }
}

export function isValidEmail(value) {
  const mail = /\S+@\S+\.\S+/;
  if (mail.test(value)) {
    throw new Error('Not a valid email');
  }
}

export function isValidPhone(value) {
  const urlRegex = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;
  if (urlRegex.test(value)) {
    throw new Error('Not a valid phone number');
  }
}

export function isValidEmailOrPhoneNumber(value) {
  if (value.indexOf('(')) {
    isValidPhone(value);
  } else {
    isValidEmail(value);
  }
}

export function isValidCodeDeliveryMethod(value) {
  if (['email', 'sms'].indexOf(value) < 0) {
    throw new Error('Not a valid method');
  }
}
