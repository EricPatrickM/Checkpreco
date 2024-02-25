import { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container } from '../../../../../components/container';
import { FaTrash } from 'react-icons/fa';

interface Permission {
  fk_stablishments_id: any;
  id: number;
  name: string;
  fk_users_id: number;
}

interface User {
  id: number;
  name: string;
}

export function ListaPermissoes() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [permissionToDelete, setPermissionToDelete] = useState<Permission | null>(null);
  const permissionsPerPage = 6;
  const location = useLocation();
  const pathParts = location.pathname.split('/');
  const establishmentType = pathParts[pathParts.length - 3];
  const stablishmentName = pathParts[pathParts.length - 2];
  const stablishmentId = pathParts[pathParts.length - 1];
  let stablishmentNameComEspacos = stablishmentName.replace(/%20/g, " ");
  let stablishmentNameFinal = decodeURIComponent(stablishmentNameComEspacos.replace(/\+/g, ' '));
  const navigate = useNavigate();

  useEffect(() => {
    fetchPermissions();
  }, [searchQuery, currentPage]); // Dependências do useEffect

  async function fetchPermissions() {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8000/api/allowed`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: currentPage, per_page: permissionsPerPage, search: searchQuery },
      });
      let permissionsData: Permission[] = response.data.data || [];
  
      // Filtrar permissionsData pelo fk_stablishments_id
      permissionsData = permissionsData.filter(permission => permission.fk_stablishments_id.toString() === stablishmentId);
  
      setPermissions(permissionsData);
      setError(null);
  
      const userIds = permissionsData.map(permission => permission.fk_users_id);
      fetchUsers(userIds);
  
      const totalPagesFromResponse = response.data.last_page || 0;
      setTotalPages(totalPagesFromResponse);
    } catch (error) {
      handleFetchError(error);
    } finally {
      setLoading(false);
    }
  }
  

  async function fetchUsers(userIds: number[]) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8000/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { ids: userIds },
      });
      let usersData: User[] = response.data || [];

      // Filtra os usuários com base na searchQuery
      if (searchQuery) {
        usersData = usersData.filter(user => user.name.toLowerCase().includes(searchQuery.toLowerCase()));
      }

      // Ordena os usuários em ordem alfabética pelo nome
      usersData.sort((a, b) => a.name.localeCompare(b.name));

      setUsers(usersData);
    } catch (error) {
      handleFetchError(error);
    }
  }

  function handleFetchError(error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 429) {
        setError('Muitas solicitações foram feitas ao servidor. Por favor, tente novamente mais tarde.');
      } else {
        setError('Erro ao carregar as permissões.');
      }
    } else {
      setError('Erro desconhecido ao carregar as permissões.');
    }
  }

  const Pagination = () => {
    if (permissions.length === 0) {
      return null; // Retorna null para não renderizar a paginação se não houver permissões listadas
    }

    return (
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
  };

  const handleDelete = (permission: Permission) => {
    setPermissionToDelete(permission);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      if (permissionToDelete) {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:8000/api/allowed/${permissionToDelete.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDeleteModalOpen(false); // Fecha o modal após a exclusão
        fetchPermissions(); // Atualiza a lista após a exclusão
      }
    } catch (error) {
      setError('Erro ao excluir a permissão.');
    }
  };

  return (
    <Container>
      <div className="w-full min-h-screen flex flex-col items-center gap-4">
        <h1 className="text-4xl font-bold text-black mb-6">{stablishmentNameFinal}</h1>
        <button
          onClick={() => navigate(`/add-permissoes/${establishmentType}/${stablishmentName}/${stablishmentId}`)}
          className="bg-green-600 text-white rounded-full px-6 py-3 mb-4 hover:bg-green-700 transition duration-300"
        >
          Adicionar Permissão
        </button>
        <div className="w-full flex justify-center mb-4">
          <input
            type="text"
            placeholder="Buscar usuário"
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
              {permissions.map((permission, index) => {
                const user = users.find(user => user.id === permission.fk_users_id);
                if (!user || !user.name.toLowerCase().includes(searchQuery.toLowerCase())) {
                  return null;
                }
                return (
                  <div key={index} className="bg-green-100 rounded-md shadow-md overflow-hidden transition duration-300 hover:shadow-lg">
                    <div className="p-4">
                      <div className="flex flex-col justify-center">
                        <div className="text-center mb-2">
                          <p className="text-xl font-semibold">{permission.name}</p>
                          <p>Nome do Usuário: {user ? user.name : 'Usuário não encontrado'}</p>
                        </div>
                        <div className="flex justify-center items-center">
                          <button
                            className="bg-red-700 hover:bg-red-800 text-white py-2 px-4 rounded-full focus:outline-none focus:ring focus:ring-red-200"
                            onClick={() => handleDelete(permission)}
                          >
                            <FaTrash className="inline-block mr-2" /> Excluir
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      {deleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg">
            <p className="mb-4">Tem certeza que deseja excluir a permissão "{permissionToDelete?.name}"?</p>
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
