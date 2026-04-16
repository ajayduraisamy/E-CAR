import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AppToast() {
  return (
    <ToastContainer
      position="top-right"     // where toast appears
      autoClose={3000}         // 3 seconds
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnHover
      draggable
      theme="colored"          // looks better UI
    />
  );
}

export default AppToast;