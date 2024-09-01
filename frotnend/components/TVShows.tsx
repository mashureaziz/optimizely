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
