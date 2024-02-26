import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Container } from '../../../components/container';

const apiUrl = import.meta.env.VITE_API_URL;
const API_URL_LOTES = `${apiUrl}/batch`;
const LOTES_PER_PAGE = 5;

interface Lote {
  id: number;
  name: string;
}

export function ListaLoteUser() {
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);

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
      
      // Ordena os lotes por data (ano, mês, dia)
      const sortedLotes = data.data.sort((a: Lote, b: Lote) => {
        // Converte 'name' de 'dia/mês/ano' para objetos Date
        const dateA = convertToDate(a.name);
        const dateB = convertToDate(b.name);
        
        return dateB.getTime() - dateA.getTime(); // Ordena do mais recente para o mais antigo
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

  // Função auxiliar para converter 'dia/mês/ano' para um objeto Date
  function convertToDate(dateStr: string): Date {
    const parts = dateStr.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // O mês no JS começa do 0
    const year = parseInt(parts[2], 10);
    
    return new Date(year, month, day);
  }

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
        <span>&nbsp;</span>
        {loading ? (
          <p>Carregando...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : lotes.length > 0 ? (
          <ul>
            {lotes.map((lote) => (
              <Link
                key={lote.id}
                to={`/estabelecimento/${establishmentType}/${lote.id}`}
                className="block mb-4"
              >
                <li className="bg-green-100 border border-green-400 text-green-800 rounded-md p-4 mb-4 flex justify-between items-center">
                  <span className='font-bold'>{lote.name}</span>
                </li>
              </Link>
            ))}
          </ul>
        ) : (
          <p>Nenhum lote encontrado</p>
        )}
      </div>
    </Container>
  );
}
