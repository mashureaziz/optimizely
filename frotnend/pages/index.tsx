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
