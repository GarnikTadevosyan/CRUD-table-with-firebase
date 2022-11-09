import * as yup from 'yup';

export const validationSchema = yup.object({
    email: yup
      .string()
      .email('invalid email format')
      .required("Required"),
    name: yup
      .string()
      .matches(/[A-Z a-z]{2,40}$/g, {
        message: `invalid 
             name format`})
      .required("Required")
  });