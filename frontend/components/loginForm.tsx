'use client';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import * as Yup from 'yup';

const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().required('Required'),
});
export default function LoginForm() {
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    return (<Formik
        initialValues={{
            email: '',
            password: '',
        }}

        validationSchema={LoginSchema}

        onSubmit={async values => {
            const formBody = new URLSearchParams();
            Object.entries(values).forEach(([key, value]) => {
                formBody.append(key, value);
            });
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login/password`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: formBody,
                    credentials: 'include',
                });
                if (response.ok) {
                    router.push('/dashboard')
                }
                else {
                    setError("Invalid email or password")
                }
            } catch (error) {
                setError("Invalid email or password")
            }
        }}

    >{({ errors, touched }) => (
        <Form>
            <div>
                <Field name="email" type="email" />

                {errors.email && touched.email ? (
                    <div>{errors.email}</div>
                ) : null}
            </div>
            <div>
                <Field name="password" type="password" />
                {errors.password && touched.password ? (
                    <div>{errors.password}</div>
                ) : null}
            </div>
            <button type="submit">Login</button>
            <div className="error">{error}</div>
        </Form>
    )}

    </Formik>
    );
}
