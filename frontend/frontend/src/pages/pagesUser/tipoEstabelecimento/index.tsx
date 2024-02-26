import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Importar Link do React Router
import { Container } from '../../../components/container';

const apiUrl = import.meta.env.VITE_API_URL;
const API_URL = `${apiUrl}/stablishmentType`;
const TYPES_PER_PAGE = 5;

interface EstablishmentType {
  id: number;
  name: string;
}

export function TipoEstabelecimento() {
  const [establishmentTypes, setEstablishmentTypes] = useState<EstablishmentType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null); // Estado para armazenar o ID do tipo de estabelecimento selecionado

  useEffect(() => {
    fetchEstablishmentTypes();
  }, [currentPage]);

  async function fetchEstablishmentTypes() {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(API_URL, {
        params: { page: currentPage, per_page: TYPES_PER_PAGE },
        headers: { Authorization: `Bearer ${token}` }
      });
      setEstablishmentTypes(data.data);
      setTotalPages(Math.ceil(data.total / TYPES_PER_PAGE));
      setError(null);
    } catch (error) {
      setError('Erro ao carregar os tipos de estabelecimentos.');
    } finally {
      setLoading(false);
    }
  }

  const filteredTypes = establishmentTypes.filter(type =>
    type.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const Pagination = () => (
    <div className="flex justify-center mt-4 space-x-2">
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index}
          onClick={() => paginate(index + 1)}
          className={`cursor-pointer px-5 py-3 rounded-full inline-flex items-center justify-center rounded-full 
                ${currentPage === index + 1 ? 'font-bold bg-green-600 text-white' : 'bg-gray-300 text-gray-800'}`}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );

  // Função para lidar com o clique em um tipo de estabelecimento
  const handleTypeClick = (typeId: number) => {
    setSelectedTypeId(typeId); // Atualiza o ID do tipo de estabelecimento selecionado
  };

  return (
    <Container>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Tipos de Estabelecimento</h1>
        <Pagination />
        <br/>
        <input
          className="border border-gray-300 shadow p-2 rounded-lg mb-4 w-full"
          type="text"
          placeholder="Buscar..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {loading ? (
          <p>Carregando...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <ul>
              {filteredTypes.map((type) => (
                <Link
                  to={`/lista-lote/${type.id}`}
                  key={type.id}
                  className="block mb-4"
                >
                  <li 
                    className={`bg-green-100 border border-green-400 text-green-800 rounded-md p-4 flex justify-between items-center ${
                      selectedTypeId === type.id ? 'bg-green-200' : ''
                    }`}
                    onClick={() => handleTypeClick(type.id)}
                  >
                    <span className='font-bold'>{type.name}</span>
                  </li>
                </Link>
              ))}
            </ul>
          </>
        )}
      </div>
    </Container>
  );
}
