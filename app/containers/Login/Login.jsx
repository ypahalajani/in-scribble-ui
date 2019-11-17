import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import styled from 'styled-components';
import axios from 'axios';

const FormWrapper = styled.div`
  width: 320px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  > div {
    margin-bottom: 8px;
  }
`;

const ErrorMessageWrapper = styled.div`
  color: red;
`;

const FieldWrapper = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;

  ${ErrorMessageWrapper} {
    margin-top: 4px;
  }
`;

const StyledHeader = styled.h1`
  color: #41addd;
`;

class Login extends React.PureComponent {
  constructor(props) {
    super(props);
    this.formValidationSchema = yup.object().shape({
      email: yup
        .string()
        .email('The entered email is invalid.')
        .required('This field is required.'),
      password: yup.string().required('This field is required.'),
    });
  }

  componentDidMount = () => {
    localStorage.removeItem('user');
  };

  render = () => {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <StyledHeader>
          <i className="material-icons">gesture</i>
          <span
            style={{
              marginLeft: 8,
              fontWeight: '200',
            }}
          >
            Welcome to InScribble
          </span>
        </StyledHeader>
        <div>
          <Formik
            initialValues={{
              email: '',
              password: '',
            }}
            validationSchema={this.formValidationSchema}
            onSubmit={(values, formikBag) => {
              const basePath = 'https://isscribble.azurewebsites.net/api';
              const loginURL = `/login?code=yahihai`;
              axios
                .post(`${basePath}${loginURL}`, values)
                .then(({ data: response }) => {
                  localStorage.setItem(
                    'user',
                    JSON.stringify({
                      authenticated: true,
                      ...response.data,
                    }),
                  );
                  formikBag.setSubmitting(false);
                  this.props.history.push(`/`);
                })
                .catch(error => {
                  console.log(error);
                  formikBag.setSubmitting(false);
                });
            }}
          >
            {({ values, errors, handleChange, isSubmitting }) => {
              console.log('values: ', JSON.stringify(values, null, 2));
              console.log('errors: ', JSON.stringify(errors, null, 2));
              return (
                <Form>
                  <FormWrapper>
                    <FieldWrapper>
                      <Field
                        type="email"
                        name="email"
                        placeholder="Enter email"
                      />
                      <ErrorMessageWrapper>
                        <ErrorMessage name="email" />
                      </ErrorMessageWrapper>
                    </FieldWrapper>
                    <FieldWrapper>
                      <input
                        name="password"
                        type="password"
                        placeholder="Enter Password"
                        value={values.password}
                        onChange={handleChange}
                      />
                      <ErrorMessageWrapper>
                        <ErrorMessage name="password" />
                      </ErrorMessageWrapper>
                    </FieldWrapper>
                    <FieldWrapper>
                      <div
                        style={{ display: 'flex', justifyContent: 'center' }}
                      >
                        <button type="submit" disabled={isSubmitting}>
                          Submit
                        </button>
                      </div>
                    </FieldWrapper>
                  </FormWrapper>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    );
  };
}

export default Login;
