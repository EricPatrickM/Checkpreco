import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { Container } from '../../../../../components/container';

const API_URL_LOTES = 'http://localhost:8000/api/batch';
const LOTES_PER_PAGE = 5;

interface Lote {
  id: number;
  name: string;
}

export function ListaLote() {
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [establishmentToDelete, setEstablishmentToDelete] = useState<Lote | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false); 

  const establishmentType = location.pathname.split('/').pop() || '';

  useEffect(() => {
    fetchLotes();
  }, [currentPage]);

  async function fetchLotes() {
    setLoading(true);
    const token = localStorage.getItem('token');
  
    try {
      const { data } = await axios.get(`${API_URL_LOTES}/${establishmentType}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { page: currentPage, per_page: LOTES_PER_PAGE},
      });
      
      const sortedLotes = data.data.sort((a: Lote, b: Lote) => {
        const dateA = convertToDate(a.name);
        const dateB = convertToDate(b.name);
        
        return dateB.getTime() - dateA.getTime(); 
      });
      
      setLotes(sortedLotes);
      setTotalPages(Math.ceil(data.total / LOTES_PER_PAGE));
      setError(null);
    } catch (error) {
      setError('Erro ao carregar os lotes.');
    } finally {
      setLoading(false);
    }
  }

  function convertToDate(dateStr: string): Date {
    const parts = dateStr.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; 
    const year = parseInt(parts[2], 10);
    
    return new Date(year, month, day);
  }

  const handleDelete = async (lote: Lote) => {
    setEstablishmentToDelete(lote); 
    setDeleteModalOpen(true); 
  };

  const confirmDelete = async () => {
    const token = localStorage.getItem('token');
  
    try {
      setError(null); 
      await axios.delete(`${API_URL_LOTES}/${establishmentToDelete?.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Erro ao excluir o lote:', error);
    } finally {
      setDeleteModalOpen(false); 
      fetchLotes(); 
    }
  };

  const Pagination = () => (
    <div className="flex justify-center mt-4 space-x-2">
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index}
          onClick={() => setCurrentPage(index + 1)}
          className={`cursor-pointer px-5 py-3 rounded-full inline-flex items-center justify-center
                ${currentPage === index + 1 ? 'font-bold bg-green-600 text-white' : 'bg-gray-300 text-gray-800'}`}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );

  return (
    <Container>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Lista de Lotes</h1>
        <Pagination />
        <div>
          <Link
            to="/add-lote"
            className="bg-green-600 text-white rounded-full px-6 py-3 inline-block"
          >
            Adicionar Lote
          </Link>
        </div>
        <span>&nbsp;</span>
        {loading ? (
          <p>Carregando...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : lotes.length > 0 ? (
          <ul>
            {lotes.map((lote) => (
              <li key={lote.id} className="bg-green-100 border border-green-400 text-green-800 rounded-md p-4 mb-4 flex justify-between items-center">
                <Link to={`/estabelecimento/${establishmentType}/${lote.id}`} className='font-bold'>{lote.name}</Link>
                <div className="flex">
                  <button
                    onClick={() => handleDelete(lote)}
                    className="flex items-center justify-center bg-red-500 rounded-full w-10 h-10 text-white text-2xl hover:bg-red-600"
                  >
                    <FaTrash />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhum lote encontrado</p>
        )}
      </div>

      {deleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg">
            <p className="mb-4">Tem certeza que deseja excluir o estabelecimento "{establishmentToDelete?.name}"?</p>
            <div className="flex justify-center">
              <button onClick={confirmDelete} className="mr-4 bg-red-500 text-white px-4 py-2 rounded-md">Confirmar</button>
              <button onClick={() => setDeleteModalOpen(false)} className="bg-gray-300 px-4 py-2 rounded-md">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}
