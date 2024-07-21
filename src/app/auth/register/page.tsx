'use client'
import Link from 'next/link';
import { Formik, Form, Field } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup'
import { useRouter } from 'next/navigation';

const RegisterPage = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const SignupSchema = Yup.object().shape({
    Name: Yup.string()
      .min(2, 'muy corto!')
      .max(20, 'maximo 20 caracteres!')
      .required('El nombre es requerido'),
    password: Yup.string()
      .min(5, 'min 5 caracteres!')
      .max(50, 'Too Long!')
      .required('La contraseña requerida'),
    email: Yup.string().email('email invalido').required('El correo electronico es requerido'),
  });

  const handleRegisterUser = (values: { Name: string, email: string, password: string }) => {

    // Obtengolos usuarios del localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    // Verificosi el usuario ya está registrado
    const userExists = users.some((user: { email: string }) => user.email === values.email);
    
    if (userExists) {
      setErrorMessage('El correo electronico ya está registrado');
      return;
    }
    // Añadimos el nuevo usuario
    users.push(values);
    // Guardamos los usuarios actualizados en el localStorage
    localStorage.setItem('users', JSON.stringify(users));
    console.log('User registered:', values);
    alert("usuario registrado exitosamente")
    setErrorMessage(null)
    router.push('/auth/login')
    
  };
  return (
    <>
     <div className="min-h-[calc(100vh-69px)] md:flex md:items-center md:justify-center ">
        <div className="mx-auto w-full max-w-lg rounded-2xl border-gray-200 p-4 md:my-10 md:border md:p-8">
          <h2 className="sign-text text-4xl font-bold">Crear una cuenta</h2>
          <div className="py-4 text-base font-normal text-gray-500">
            Comencemos con su nueva cuenta.
          </div>
          <div className="error-message text-xl font-bold text-yellow-500 my-2">{errorMessage}</div>
            <Formik
              initialValues={{
                Name: '',
                email: '',
                password: ''
              }}
              validationSchema={SignupSchema}
              onSubmit={(values, { resetForm }) => {
                handleRegisterUser(values);
                resetForm();
               }} >
              {({ errors, touched }) => (
                <Form>
                  <label htmlFor="Name" className="text-gray-500 text-base font-normal">
                    Nombre completo
                  </label>
                  <Field name="Name" className="w-full my-2 p-2 border rounded "/>
                  {errors.Name && touched.Name ? (
                    <div className='text-red-800'>{errors.Name}</div>
                  ) : null}

                  <label htmlFor="email" className="text-gray-500 text-base font-normal">
                    correo electronico
                  </label>
                  <Field name="email" type="email" className="w-full  my-2 p-2 border rounded" />
                  {errors.email && touched.email ? <div className='text-red-800'>{errors.email}</div> : null}

                  <label  htmlFor="password"  className="text-gray-500 text-base font-normal">
                    Contraseña
                  </label>
                  <Field name="password" type="password" className="w-full p-2  my-2 border rounded"/>
                  {errors.password && touched.password ? (
                    <div className='text-red-800'>{errors.password}</div>
                  ) : null}
                  <button type="submit"  className="w-full bg-blue-500 text-white p-2 rounded" >Registrarse</button>
                </Form>
              )}
            </Formik>
            <div>
              <Link  href="/auth/login">
                <div className="mt-8 text-gray-500">
                  Ya tienes una cuenta?{" "}
                  <span className="font-bold text-gray-900 hover:underline">
                    Iniciar sesión
                  </span>
                </div>
              </Link>
        </div>
      </div>
        
    </div>
    </>
  );
};

export default RegisterPage;