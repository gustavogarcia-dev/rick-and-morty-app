'use client'
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from "next/link";

const Login: React.FC = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string>("");
  // const [loading, setLoading] = useState<boolean>(false);

  const signInValidationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Correo electrónico inválido")
      .required("El correo electrónico es requerido"),
    password: Yup.string()
      .required("La contraseña es requerida")
      .min(5, "La contraseña debe tener al menos 5 caracteres"),
  });

  const submitSignInForm = (values: { email: string; password: string }) => {
    // setLoading(true);
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    const user = users.find((user: { email: string; password: string }) =>
      user.email === values.email && user.password === values.password
    );

    if (user) {
      // Generamos un token sencillo
      const token = Math.random().toString(36).substring(2);
      // Guardamos el token en el localStorage
      localStorage.setItem('token', token);
      router.push('/'); // Redirige a la página principal
    } else {
      setErrorMessage('Email o contraseña incorrectos');
    }

    // setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-69px)] md:flex md:items-center md:justify-center">
      <div className="mx-auto w-full max-w-lg rounded-2xl border-gray-200 p-4 md:my-10 md:border md:p-8">
        <h2 className="sign-text text-4xl font-bold">Iniciar sesión</h2>
        <div className="py-4 text-base font-normal text-gray-500">
          Bienvenido, introduce tus datos.
        </div>

        <Formik
          validateOnMount
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={signInValidationSchema}
          onSubmit={submitSignInForm}
        >
          {({ errors,touched, values }) => (
            <Form id="signin-form" method="post">
              <label
                htmlFor="email"
                className="text-gray-500 font-normal my-2"
              >
                Correo electrónico
              </label>
              <Field
                type="email"
                name="email"
                className="w-full  my-2 p-2 border rounded"
                placeholder="Ingrese su correo electrónico"
              />
              {errors.email && touched.email ? <div className='text-red-800'>{errors.email}</div> : null}
              

              <label
                htmlFor="password"
                className="text-gray-500 text-base font-normal"
              >
                Contraseña
              </label>
              <Field
                type="password"
                name="password"
                className="w-full  my-2 p-2 border rounded"

              />
              {errors.password && touched.password ? <div className='text-red-800'>{errors.password}</div> : null}

                <button type="submit"  className="w-full bg-blue-500 text-white p-2 rounded" >Iniciar sesion</button>
              <div className="error-message my-2">{errorMessage}</div>
            </Form>
          )}
        </Formik>

        <div>
          <Link href="/auth/register">
            <div className="mt-8 text-gray-500">
              ¿No tienes una cuenta?{" "}
              <span className="font-bold text-gray-900 hover:underline">
                Regístrate
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
