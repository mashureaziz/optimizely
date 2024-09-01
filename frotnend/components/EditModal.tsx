import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
}

const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState(initialData || {});

  useEffect(() => {
    setFormData(initialData || {});
  }, [initialData]);

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
  });

  const formik = useFormik({
    initialValues: formData,
    validationSchema,
    onSubmit: (values) => {
      onSave(values);
      onClose();
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded">
        <h2>Edit Item</h2>
        <form onSubmit={formik.handleSubmit}>
          <div>
            <input
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              placeholder="Title"
              className={`border ${formik.errors.title ? 'border-red-500' : 'border-gray-300'}`}
            />
            {formik.errors.title && typeof formik.errors.title === 'string' && (
              <p className="text-red-500">{formik.errors.title}</p>
            )}
          </div>
          <div>
            <input
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              placeholder="Description"
              className={`border ${formik.errors.description ? 'border-red-500' : 'border-gray-300'}`}
            />
            {formik.errors.description && typeof formik.errors.description === 'string' && (
              <p className="text-red-500">{formik.errors.description}</p>
            )}
          </div>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">Save</button>
        </form>
        <button onClick={onClose} className="ml-2 bg-gray-300 p-2 rounded">Close</button>
      </div>
    </div>
  );
};

export default EditModal;
