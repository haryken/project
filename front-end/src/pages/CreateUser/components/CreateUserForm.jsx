import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { FormGroup, FormLabel, Row, Col } from 'react-bootstrap';
import * as Yup from 'yup';
import { differenceInYears, getISODay } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import { createUser } from '../../../actions';
import { createToast } from '../../../utils';

const CreateUserForm = () => {
  const initialValues = {
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'Female',
    joinedDate: '',
    userType: 'Staff',
  };
  const [isSubmitted, setIsSubmitted] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const { loading, error } = useSelector((state) => state.createUserReducer);
  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .required('First name is a required field')
      .max(255)
      .test('firstName', 'First name do not include spaces!', (value) => {
        if (value) {
          return !value.includes(' ');
        }
        return true;
      }),
    lastName: Yup.string()
      .required('Last name is a required field')
      .max(255)
      .test('lastName', 'The end of the last name cannot be a space!', (value) => {
        if (value) {
          return !value.slice(-1).includes(' ');
        }
        return true;
      }),
    dateOfBirth: Yup.date()
      .required('Date of birth is a required field')
      .test(
        'dateOfBirth',
        'Date of birth must be before current date!',
        (value) => new Date(value) < new Date()
      )
      .test(
        'dateOfBirth',
        'User is under 18. Please select a different date',
        (value) => differenceInYears(new Date(), new Date(value)) >= 18
      )
      .test('dateOfBirth', 'User is under 18. Please select a different date', (value, ctx) => {
        if (!ctx.parent.joinedDate) {
          return true;
        }
        return differenceInYears(ctx.parent.joinedDate, new Date(value)) >= 18;
      }),
    gender: Yup.string().required('Gender is a required field').max(10),
    joinedDate: Yup.date()
      .required('Joined date is a required field')
      .min(Yup.ref('dateOfBirth'), 'Joined date must be after Date of Birth.')
      .test(
        'joinedDate',
        'Joined date is Saturday or Sunday. Please select a different date',
        (value) => getISODay(new Date(value)) !== 7 && getISODay(new Date(value)) !== 6
      ),
    userType: Yup.string().required('User type is a required field').max(20),
  });
  useEffect(() => {
    if (isSubmitted) {
      if (!loading && error) {
        createToast(error, 'error');
      }
      if (!loading && !error) {
        setIsSubmitted(false);
        history.push('/users');
      }
    }
  }, [isSubmitted, loading, error]);
  const onSubmit = (values) => {
    dispatch(createUser({ ...values }));
    setIsSubmitted(true);
  };
  const cancel = () => {
    history.push('/users');
  };
  return (
    <>
      <ToastContainer />
      <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
        {({ isSubmitting, dirty, isValid }) => (
          <Form className="formContainer" autoComplete="off">
            <FormGroup as={Row} className="mb-3">
              <FormLabel htmlFor="firstName" column sm="3">
                <sup className="required-icon">*</sup>First Name
              </FormLabel>
              <Col sm="9">
                <Field
                  id="firstName"
                  name="firstName"
                  placeholder="First Name"
                  className="form-control"
                />
                <ErrorMessage name="firstName" component="span" className="error-message" />
              </Col>
            </FormGroup>

            <FormGroup as={Row} className="mb-3">
              <FormLabel htmlFor="lastName" column sm="3">
                <sup className="required-icon">*</sup>Last Name
              </FormLabel>
              <Col sm="9">
                <Field
                  id="lastName"
                  name="lastName"
                  placeholder="Last Name"
                  className="form-control"
                />
                <ErrorMessage name="lastName" component="span" className="error-message" />
              </Col>
            </FormGroup>

            <FormGroup as={Row} className="mb-3">
              <FormLabel htmlFor="dateOfBirth" column sm="3">
                <sup className="required-icon">*</sup>Date Of Birth
              </FormLabel>
              <Col sm="9">
                <Field type="date" id="dateOfBirth" name="dateOfBirth" className="form-control" />
                <ErrorMessage name="dateOfBirth" component="span" className="error-message" />
              </Col>
            </FormGroup>

            <FormGroup as={Row} className="mb-3">
              <FormLabel htmlFor="gender" column sm="3" className="mt-1">
                <sup className="required-icon">*</sup>Gender
              </FormLabel>
              <Col sm="9">
                <Row className="mt-2">
                  <div className="form-check">
                    <Field type="radio" id="female-gender" name="gender" value="Female" />
                    <FormLabel htmlFor="female-gender" className="ml-3 mt-1">
                      Female
                    </FormLabel>
                  </div>

                  <div className="form-check">
                    <Field type="radio" id="male-gender" name="gender" value="Male" />
                    <FormLabel htmlFor="male-gender" className="ml-3 mt-1">
                      Male
                    </FormLabel>
                  </div>
                </Row>

                <ErrorMessage name="gender" component="span" className="error-message" />
              </Col>
            </FormGroup>

            <FormGroup as={Row} className="mb-3">
              <FormLabel htmlFor="joinedDate" column sm="3">
                <sup className="required-icon">*</sup>Joined Date
              </FormLabel>
              <Col sm="9">
                <Field type="date" id="joinedDate" name="joinedDate" className="form-control" />
                <ErrorMessage name="joinedDate" component="span" className="error-message" />
              </Col>
            </FormGroup>

            <FormGroup as={Row} className="mb-3">
              <FormLabel htmlFor="userType" column sm="3">
                <sup className="required-icon">*</sup>Type
              </FormLabel>
              <Col sm="9">
                <Field component="select" id="userType" name="userType" className="custom-select">
                  <option value="Staff">Staff</option>
                  <option value="Admin">Admin</option>
                </Field>
                <ErrorMessage name="userType" component="span" className="error-message" />
              </Col>
            </FormGroup>

            <FormGroup className="text-right mb-0">
              <button
                disabled={!((dirty && isValid) || isSubmitting)}
                type="submit"
                className="btn btn-primary"
              >
                Save
              </button>
              <button type="button" onClick={cancel} className="btn btn-light ml-4">
                Cancel
              </button>
            </FormGroup>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default CreateUserForm;
