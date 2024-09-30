import { ErrorMessage, Field, Form, Formik } from "formik";
import { useContext } from "react";
import AuthContext from "../../store/AuthProvider/Auth.context";
import { RegisterData } from "../../types/Auth";

const SignupPage = () => {
  const { signup } = useContext(AuthContext);

  return (
    <div>
      signup page
      <Formik
        initialValues={
          { username: "", password: "", fullName: "" } as RegisterData
        }
        validate={(values) => {
          const errors: { username?: string } = {};
          if (!values.username) {
            errors.username = "Required";
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          const res = signup(values);
          console.log(res);
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Field type="text" name="fullName" />
            <Field type="text" name="username" />
            <ErrorMessage name="username" component="div" />
            <Field type="password" name="password" />
            <ErrorMessage name="password" component="div" />
            <button type="submit" disabled={isSubmitting}>
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SignupPage;
