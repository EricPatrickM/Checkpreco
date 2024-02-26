import { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { Container } from '../../../components/container';

interface Establishment {
  id: number;
  name: string;
  fk_stablishment_types_id: number;
  fk_address_id: number;
}

interface Address {
  id: number;
  city: string;
  state: string;
  neighborhood: string;
}

function useDebounce(value: any, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function Estabelecimento() {
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [establishmentToDelete, setEstablishmentToDelete] = useState<Establishment | null>(null);
  const [addressInfo, setAddressInfo] = useState<Record<number, Address>>({});
  const establishmentsPerPage = 6;
  const location = useLocation();
  const pathParts = location.pathname.split('/');
  const establishmentType = pathParts[pathParts.length - 2];
  const batchId = pathParts[pathParts.length - 1];
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchEstablishments();
  }, [establishmentType, currentPage, searchQuery]);

  async function fetchEstablishments() {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${apiUrl}/stablishment/${establishmentType}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: currentPage, per_page: establishmentsPerPage, search: searchQuery },
      });

      const { data, last_page } = response.data;
      setTotalPages(last_page);

      setEstablishments(data);
      setError(null);
      await fetchAddressInfo(data);
    } catch (error) {
      handleFetchError(error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchAddressInfo(establishments: Establishment[]) {
    try {
      const token = localStorage.getItem('token');
      const addresses: Address[] = [];
      for (const establishment of establishments) {
        if (!addressInfo[establishment.id]) {
          const response = await axios.get(`${apiUrl}/address/search/${establishment.fk_address_id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          addresses.push(response.data);
          setAddressInfo(prevState => ({
            ...prevState,
            [establishment.id]: response.data,
          }));
        } else {
          addresses.push(addressInfo[establishment.id]);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar informações do endereço:', error);
    }
  }

  function handleFetchError(error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 429) {
        setError('Muitas solicitações foram feitas ao servidor. Por favor, tente novamente mais tarde.');
      } else {
        setError('Erro ao carregar os estabelecimentos.');
      }
    } else {
      setError('Erro desconhecido ao carregar os estabelecimentos.');
    }
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

  const handleDelete = (establishment: Establishment) => {
    setEstablishmentToDelete(establishment);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      if (establishmentToDelete) {
        const token = localStorage.getItem('token');
        await axios.delete(`${apiUrl}/stablishment/${establishmentToDelete.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDeleteModalOpen(false);
        fetchEstablishments();
      }
    } catch (error) {
      setError('Erro ao excluir o estabelecimento.');
    }
  };

  return (
    <Container>
      <div className="w-full min-h-screen flex flex-col items-center gap-4">
        <h1 className="text-4xl font-bold text-black mb-6">Lista de Estabelecimentos</h1>
        <div className="w-full flex justify-center mb-4">
          <input
            type="text"
            placeholder="Buscar estabelecimento"
            className="border border-gray-300 p-2 rounded-md w-1/2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Pagination />
        <div className="w-full flex justify-center mb-4">
          {loading ? (
            <p>Carregando...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {establishments
                .filter(establishment => establishment.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((establishment, index) => (
                  <div key={index} className="bg-green-100 rounded-md shadow-md overflow-hidden transition duration-300 hover:shadow-lg">
                    <div className="p-4">
                      <Link to={`/produto/${establishmentType}/${batchId}/${establishment.id}`}>
                      <div className="flex justify-between items-center">
                        <p className="text-xl font-semibold mb-2">{establishment.name}</p>
                        </div>
                        <div className="address-info">
                          <p><strong>Cidade:</strong> {addressInfo[establishment.id]?.city}</p>
                          <p><strong>Estado:</strong> {addressInfo[establishment.id]?.state}</p>
                          <p><strong>Bairro:</strong> {addressInfo[establishment.id]?.neighborhood}</p>
                        </div>
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
