import { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, Link } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { Container } from '../../../components/container';

interface Product {
  id: number;
  name: string;
  description: string;
  measurementUnit: string;
  barCode: string | null;
}

export function Produto() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0); // Adicionando o estado para o número total de páginas
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const productsPerPage = 6;
  const location = useLocation();
  const pathParts = location.pathname.split('/');
  const establishmentType = pathParts[pathParts.length - 3];
  const batchId = pathParts[pathParts.length - 2];
  const stablishmentId = pathParts[pathParts.length - 1];
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${apiUrl}/product/${establishmentType}?page=${currentPage}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const responseData = Array.isArray(response.data) ? response.data : [response.data];

        if (responseData[0].hasOwnProperty('data')) {
          const { data, last_page } = responseData[0];
          setTotalPages(last_page); // Atualizando o número total de páginas

          const productsWithNames = data.map((product: any) => ({
            ...product,
            name: product.name || 'Nome não disponível'
          }));

          productsWithNames.sort((a: Product, b: Product) => {
            if (a.name !== b.name) {
              return a.name.localeCompare(b.name);
            } else if (a.description !== b.description) {
              return a.description.localeCompare(b.description);
            } else {
              return a.measurementUnit.localeCompare(b.measurementUnit);
            }
          });

          setProducts(productsWithNames);
          setError(null);
        } else {
          throw new Error('Resposta da API não contém dados de produtos');
        }
      } catch (error) {
        setError('Erro ao carregar os produtos.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [establishmentType, currentPage]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleDeleteProduct = async (productId: number) => {
    setConfirmDeleteId(productId);
  };

  const handleDeleteConfirmed = async (productId: number) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${apiUrl}/product/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(products.filter(product => product.id !== productId));
    } catch (error) {
      console.error('Erro ao excluir o produto:', error);
    } finally {
      setConfirmDeleteId(null);
    }
  };

  return (
    <Container>
      <div className="w-full min-h-screen flex flex-col items-center gap-4">
        <h1 className="text-4xl font-bold text-black mb-6">Lista de Produtos</h1>
        <div className="w-full flex justify-center mb-4">
          <input
            type="text"
            placeholder="Buscar produto"
            className="border border-gray-300 p-2 rounded-md w-1/2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full flex justify-center mt-4">
          <div className="flex items-center space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`cursor-pointer px-4 py-2 rounded-full inline-flex items-center justify-center rounded-full 
                  ${currentPage === i + 1 ? 'font-bold bg-green-600 text-white' : 'bg-gray-300 text-gray-800 hover:bg-gray-400 transition duration-300'}`}
                onClick={() => paginate(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
        <div className="w-full flex justify-center mb-4">
          {loading ? (
            <p>Carregando...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product, index) => (
                <div key={index} className="bg-green-100 rounded-md shadow-md overflow-hidden transition duration-300 hover:shadow-lg">
                  <div className="p-4">
                    <Link to={`/add-preco/${establishmentType}/${batchId}/${stablishmentId}/${product.id}/${product.name}`}>
                    <div className="flex justify-between items-center">
                      <p className="text-xl font-semibold mb-2">{product.name}</p>
                    </div>
                    <div>
                      <p>{product.description}</p>
                      <p>Unidade: {product.measurementUnit}</p>
                      <p>Código de Barras: {product.barCode || 'Não informado'}</p>
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
