#!/bin/bash

# Create a new Next.js project
npx create-next-app@latest frotnend --typescript

# Navigate into the project directory
cd frotnend || exit

# Create necessary directories
mkdir -p components services styles types pages

# Install additional dependencies
npm install axios tailwindcss yup

# Create files with initial content
cat <<EOL > components/Sidebar.tsx
import Link from 'next/link';

const Sidebar = () => {
  return (
    <div className="w-64 h-full bg-gray-800 text-white">
      <h2 className="text-2xl p-4">Dashboard</h2>
      <ul>
        <li className="p-4 hover:bg-gray-700">
          <Link href="/">TV Shows</Link>
        </li>
        <li className="p-4 hover:bg-gray-700">
          <Link href="/payments">Payments</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
EOL

cat <<EOL > components/EditModal.tsx
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
              className={\`border \${formik.errors.title ? 'border-red-500' : 'border-gray-300'}\`}
            />
            {formik.errors.title && <p className="text-red-500">{formik.errors.title}</p>}
          </div>
          <div>
            <input
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              placeholder="Description"
              className={\`border \${formik.errors.description ? 'border-red-500' : 'border-gray-300'}\`}
            />
            {formik.errors.description && <p className="text-red-500">{formik.errors.description}</p>}
          </div>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">Save</button>
        </form>
        <button onClick={onClose} className="ml-2 bg-gray-300 p-2 rounded">Close</button>
      </div>
    </div>
  );
};

export default EditModal;
EOL

cat <<EOL > components/TVShows.tsx
import React, { useEffect, useState } from 'react';
import { fetchTVSeries, updateTVSeries } from '../services/api';
import EditModal from './EditModal';
import { TVSeries } from '../types';

const TVShows = () => {
  const [tvShows, setTvShows] = useState<TVSeries[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedShow, setSelectedShow] = useState<TVSeries | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchTVSeries();
      setTvShows(response.data);
    };
    fetchData();
  }, []);

  const handleEdit = (show: TVSeries) => {
    setSelectedShow(show);
    setModalOpen(true);
  };

  const handleSave = async (data: TVSeries) => {
    await updateTVSeries(data.id, data);
    setTvShows(tvShows.map(show => (show.id === data.id ? data : show)));
  };

  return (
    <div>
      <h1 className="text-2xl">TV Shows</h1>
      <table className="min-w-full">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tvShows.map(show => (
            <tr key={show.id}>
              <td>{show.title}</td>
              <td>{show.description}</td>
              <td>
                <button onClick={() => handleEdit(show)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <EditModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} initialData={selectedShow} />
    </div>
  );
};

export default TVShows;
EOL

cat <<EOL > components/Payments.tsx
import React, { useEffect, useState } from 'react';
import { fetchPayments } from '../services/api';
import { Payment } from '../types';

const Payments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchPayments();
      setPayments(response.data);
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-2xl">Payments</h1>
      <table className="min-w-full">
        <thead>
          <tr>
            <th>Client ID</th>
            <th>Amount</th>
            <th>Series</th>
            <th>Season</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {payments.map(payment => (
            <tr key={payment.id}>
              <td>{payment.userId}</td>
              <td>{payment.amount}</td>
              <td>{payment.seasonId}</td>
              <td>
                <button>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Payments;
EOL

cat <<EOL > services/api.ts
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const fetchTVSeries = () => axios.get(\`\${API_URL}/tvseries\`);
export const fetchSeasons = (tvSeriesId: string) => axios.get(\`\${API_URL}/seasons/\${tvSeriesId}\`);
export const fetchEpisodes = (seasonId: string) => axios.get(\`\${API_URL}/episodes/\${seasonId}\`);
export const fetchPayments = () => axios.get(\`\${API_URL}/payments\`);

export const createTVSeries = (data: any) => axios.post(\`\${API_URL}/tvseries\`, data);
export const updateTVSeries = (id: string, data: any) => axios.put(\`\${API_URL}/tvseries/\${id}\`, data);
export const deleteTVSeries = (id: string) => axios.delete(\`\${API_URL}/tvseries/\${id}\`);

export const createSeason = (data: any) => axios.post(\`\${API_URL}/seasons\`, data);
export const updateSeason = (id: string, data: any) => axios.put(\`\${API_URL}/seasons/\${id}\`, data);
export const deleteSeason = (id: string) => axios.delete(\`\${API_URL}/seasons/\${id}\`);

export const createEpisode = (data: any) => axios.post(\`\${API_URL}/episodes\`, data);
export const updateEpisode = (id: string, data: any) => axios.put(\`\${API_URL}/episodes/\${id}\`, data);
export const deleteEpisode = (id: string) => axios.delete(\`\${API_URL}/episodes/\${id}\`);

export const createPayment = (data: any) => axios.post(\`\${API_URL}/payments\`, data);
export const updatePayment = (id: string, data: any) => axios.put(\`\${API_URL}/payments/\${id}\`, data);
export const deletePayment = (id: string) => axios.delete(\`\${API_URL}/payments/\${id}\`);
EOL

cat <<EOL > types/index.ts
export interface TVSeries {
  id: string;
  title: string;
  description: string;
  seasons: Season[];
}

export interface Season {
  id: string;
  title: string;
  tvSeriesId: string;
  userIds: string[];
  episodes: Episode[];
}

export interface Episode {
  id: string;
  title: string;
  seasonId: string;
}

export interface Payment {
  id: string;
  userId: string;
  seasonId: string;
  amount: number;
  date: string;
}
EOL

cat <<EOL > styles/globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;
EOL

cat <<EOL > tailwind.config.js
module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
EOL

cat <<EOL > pages/_app.tsx
import '../styles/globals.css';
import { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
EOL

cat <<EOL > pages/index.tsx
import Sidebar from '../components/Sidebar';
import TVShows from '../components/TVShows';

const Home = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4">
        <TVShows />
      </div>
    </div>
  );
};

export default Home;
EOL

cat <<EOL > pages/payments.tsx
import Sidebar from '../components/Sidebar';
import Payments from '../components/Payments';

const PaymentsPage = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4">
        <Payments />
      </div>
    </div>
  );
};

export default PaymentsPage;
EOL

# Initialize Tailwind CSS
npx tailwindcss init

echo "Project created successfully! Navigate to the 'frotnend' directory and run 'npm run dev' to start the application."
