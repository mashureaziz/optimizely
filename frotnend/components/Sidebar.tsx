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
