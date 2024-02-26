import { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, Link } from 'react-router-dom';
import { Container } from '../../../../../components/container';
import { FaTrash } from 'react-icons/fa';

interface Product {
  id: number;
  name: string;
  description: string;
  measurementUnit: string;
  barCode: string | null;
}

export function ListaProduto() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0); // Adicionando o estado para o número total de páginas
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const productsPerPage = 6;
  const location = useLocation();
  const establishmentType = location.pathname.split('/').pop() || '';
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
        <Link to="/add-produto" className="bg-green-600 text-white rounded-full px-6 py-3 mb-4 hover:bg-green-700 transition duration-300">Adicionar Produto</Link>
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
                    <div className="flex justify-between items-center">
                      <p className="text-xl font-semibold mb-2">{product.name}</p>
                    </div>
                    <div>
                      <p>{product.description}</p>
                      <p>Unidade: {product.measurementUnit}</p>
                      <p>Código de Barras: {product.barCode || 'Não informado'}</p>
                    </div>
                    <div className="flex justify-center mt-4">
                      <Link
                        to={`/lista-historico-admin/${establishmentType}/${product.id}`}
                        className="bg-green-600 text-white rounded-full px-4 py-2 ml-2"
                      >
                        Gerenciar Histórico
                      </Link>
                      <span>&nbsp;&nbsp;</span>
                      <button className="bg-red-700 hover:bg-red-800 text-white py-2 px-4 rounded-full focus:outline-none focus:ring focus:ring-red-200 mr-2" onClick={() => handleDeleteProduct(product.id)}>
                        <FaTrash className="inline-block mr-2" /> Excluir
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Confirmar exclusão */}
        {confirmDeleteId && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded-lg">
              <p className="mb-4">Tem certeza de que deseja excluir este produto?</p>
              <div className="flex justify-center">
                <button
                  onClick={() => handleDeleteConfirmed(confirmDeleteId)}
                  className="mr-4 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded focus:outline-none focus:ring focus:ring-red-200"
                >
                  Sim
                </button>
                <button
                  onClick={() => setConfirmDeleteId(null)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded focus:outline-none focus:ring focus:ring-gray-200"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}
