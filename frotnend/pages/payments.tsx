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
