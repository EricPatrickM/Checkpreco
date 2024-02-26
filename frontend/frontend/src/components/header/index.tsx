import { Link, useLocation, useNavigate } from 'react-router-dom';
import logoImg from '../../assets/logoHeader.svg';
import { FiArrowLeft, FiLogOut } from 'react-icons/fi';
import { useState } from 'react';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const isPreviousPageLogin = location.state && location.state.from === '/';

  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleConfirmLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="w-full flex items-center justify-center h-16 bg-white drop-shadow mb-4">
      <header className="flex w-full max-w-7xl items-center justify-between px-4 mx-auto relative">
        {!isPreviousPageLogin && (
          <Link to="#" onClick={() => window.history.back()}>
            <div className="border-2 rounded-full p-1 border-gray-900 flex items-center justify-center">
              <FiArrowLeft size={24} color="#000" />
              <span className="ml-2">Voltar </span>
            </div>
          </Link>
        )}
        <Link to="/">
        <span className="flex items-center justify-center mr-12">
          <img src={logoImg} alt="Logo do site" />
        </span>
        </Link>
        <button onClick={handleLogout} className="relative">
          <div className="border-2 rounded-full p-1 border-gray-900">
            <FiLogOut size={24} color="#000" />
          </div>
        </button>
        {showModal && (
          <div className="absolute top-full right-0 mt-2 mr-2">
            <div className="bg-white p-4 rounded-lg">
              <p className="mb-4">Tem certeza que deseja sair?</p>
              <div className="flex justify-center">
                <button onClick={handleConfirmLogout} className="mr-4 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded focus:outline-none focus:ring focus:ring-red-200">
                  Sim
                </button>
                <button onClick={handleCloseModal} className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded focus:outline-none focus:ring focus:ring-gray-200">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}
