'use client';
import { useState, type ChangeEvent, type FormEvent } from 'react';
import { fieldErrors } from '@/services/api';

// Small helper for every form: values, field errors, submit state and API errors.
//   validate(values) -> { field: 'message' }   (optional, runs before onSubmit)
//   onSubmit(values) -> async, may throw ApiError
type FormErrors = Record<string, string | undefined>;

export default function useForm<T extends Record<string, string>>(
  initialValues: T,
  onSubmit: (values: T) => Promise<void> | void,
  validate?: (values: T) => Record<string, string>
) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError('');

    const problems = validate ? validate(values) : {};
    setErrors(problems);
    if (Object.keys(problems).length > 0) return;

    setSubmitting(true);
    try {
      await onSubmit(values);
    } catch (error) {
      const fields = fieldErrors(error);
      setErrors(fields);
      setFormError(Object.keys(fields).length > 0 ? 'Please fix the highlighted fields.' : error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => { setValues(initialValues); setErrors({}); setFormError(''); };

  return { values, errors, formError, submitting, handleChange, handleSubmit, reset, setValues };
}
