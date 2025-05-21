const yup = require('yup');
const { ApiError } = require('../middleware/errorHandler');

/**
 * Validate data against a schema
 * @param {Object} schema - Yup schema to validate against
 * @returns {Function} Express middleware function
 */
const validate = (schema) => async (req, res, next) => {
  try {
    const validatedData = await schema.validate({
      body: req.body,
      query: req.query,
      params: req.params
    }, { abortEarly: false });
    
    // Replace request data with validated data
    req.body = validatedData.body;
    req.query = validatedData.query;
    req.params = validatedData.params;
    
    return next();
  } catch (error) {
    const errors = {};
    
    if (error.inner) {
      error.inner.forEach((err) => {
        const path = err.path.split('.');
        const field = path[path.length - 1];
        errors[field] = err.message;
      });
    }
    
    return next(new ApiError(400, 'Validation error', true, error.stack, { errors }));
  }
};

const userSchemas = {
  register: yup.object({
    body: yup.object({
      firstName: yup.string().trim().required('First name is required'),
      lastName: yup.string().trim().required('Last name is required'),
      email: yup.string().email('Invalid email format').required('Email is required'),
      password: yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(/[a-zA-Z]/, 'Password must contain at least one letter')
        .matches(/[0-9]/, 'Password must contain at least one number')
        .required('Password is required'),
      role: yup.string().oneOf(['ADMIN', 'ATTENDANT', 'USER'], 'Invalid role')
    })
  }),
  
  login: yup.object({
    body: yup.object({
      email: yup.string().email('Invalid email format').required('Email is required'),
      password: yup.string().required('Password is required')
    })
  }),
  
  update: yup.object({
    body: yup.object({
      firstName: yup.string().trim(),
      lastName: yup.string().trim(),
      email: yup.string().email('Invalid email format'),
      password: yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(/[a-zA-Z]/, 'Password must contain at least one letter')
        .matches(/[0-9]/, 'Password must contain at least one number')
    }),
    params: yup.object({
      id: yup.string().uuid('Invalid user ID format').required('User ID is required')
    })
  })
};

const parkingSchemas = {
  create: yup.object({
    body: yup.object({
      code: yup.string().trim().required('Parking code is required'),
      name: yup.string().trim().required('Parking name is required'),
      totalSpaces: yup.number().integer().positive('Total spaces must be a positive integer').required('Total spaces is required'),
      location: yup.string().trim().required('Location is required'),
      hourlyRate: yup.number().positive('Hourly rate must be a positive number').required('Hourly rate is required')
    })
  }),
  
  update: yup.object({
    body: yup.object({
      code: yup.string().trim(),
      name: yup.string().trim(),
      totalSpaces: yup.number().integer().positive('Total spaces must be a positive integer'),
      location: yup.string().trim(),
      hourlyRate: yup.number().positive('Hourly rate must be a positive number')
    }),
    params: yup.object({
      id: yup.string().uuid('Invalid parking ID format').required('Parking ID is required')
    })
  }),
  
  getById: yup.object({
    params: yup.object({
      id: yup.string().uuid('Invalid parking ID format').required('Parking ID is required')
    })
  })
};

const carEntrySchemas = {
  create: yup.object({
    body: yup.object({
      plateNumber: yup.string().trim().required('Plate number is required'),
      parkingId: yup.string().uuid('Invalid parking ID format').required('Parking ID is required')
    })
  }),
  
  update: yup.object({
    body: yup.object({
      exitDateTime: yup.date(),
      chargedAmount: yup.number().min(0, 'Charged amount cannot be negative')
    }),
    params: yup.object({
      id: yup.string().uuid('Invalid car entry ID format').required('Car entry ID is required')
    })
  }),
  
  getById: yup.object({
    params: yup.object({
      id: yup.string().uuid('Invalid car entry ID format').required('Car entry ID is required')
    })
  })
};

const reportSchemas = {
  dateRange: yup.object({
    query: yup.object({
      startDate: yup.date().required('Start date is required'),
      endDate: yup.date().required('End date is required').min(
        yup.ref('startDate'),
        'End date must be after start date'
      )
    })
  })
};

module.exports = {
  validate,
  userSchemas,
  parkingSchemas,
  carEntrySchemas,
  reportSchemas
};