import { useEffect, useState } from 'react';
import axios from 'axios';
import { Container } from '../../../../components/container';
import { FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

interface User {
  id: number;
  name: string;
  email: string;
  type: string;
}

export function ListaUser() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [userTypeFilter, setUserTypeFilter] = useState<string | null>(null);
  const usersPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');

        if (!token) {
          console.error('Token de autenticação não encontrado no localStorage');
          return;
        }

        const response = await axios.get<User[]>('http://localhost:8000/api/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        const sortedUsers = response.data.sort((a, b) => a.name.localeCompare(b.name));
        setUsers(sortedUsers);
        setError(null);
      } catch (error) {
        setError('Erro ao carregar os usuários. Por favor, tente novamente.');
        console.error('Erro ao buscar usuários:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, [deleteSuccess]);

  const handleDeleteUser = async (userId: number) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('Token de autenticação não encontrado no localStorage');
        return;
      }

      await axios.delete(`http://localhost:8000/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      setDeleteSuccess(true);
      setError(null);
    } catch (error) {
      setError('Erro ao deletar o usuário. Por favor, tente novamente.');
      console.error('Erro ao deletar usuário:', error);
    } finally {
      setLoading(false);
      setConfirmDelete(null);
    }
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const filterUsersByType = (type: string | null) => {
    setUserTypeFilter(type);
    setCurrentPage(1);
  };

  const filteredUsers = userTypeFilter ? users.filter(user => user.type === userTypeFilter) : users;

  const filteredUsersByName = searchQuery
    ? filteredUsers.filter(user => user.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : filteredUsers;

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsersByName.slice(indexOfFirstUser, indexOfLastUser);

  const currentUserEmail = localStorage.getItem('userEmail') || '';

  const filteredUsersWithoutCurrentUser = currentUsers.filter(user => user.email !== currentUserEmail);

  return (
    <Container>
      <div>
      <h1 className="text-2xl font-bold mb-4">Lista de Usuários</h1>
        <div className="flex justify-center mb-4">
          <button
            className={`mr-2 px-4 py-2 rounded ${
              userTypeFilter !== 'admin' && userTypeFilter !== 'colaborator'
                ? 'bg-green-600 text-white'
                : 'bg-gray-300 text-gray-800'
            }`}
            onClick={() => filterUsersByType(null)}
          >
            Todos
          </button>
          <button
            className={`mr-2 px-4 py-2 rounded ${
              userTypeFilter === 'admin' ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-800'
            }`}
            onClick={() => filterUsersByType('admin')}
          >
            Admins
          </button>
          <button
            className={`px-4 py-2 rounded ${
              userTypeFilter === 'colaborator' ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-800'
            }`}
            onClick={() => filterUsersByType('colaborator')}
          >
            Alunos
          </button>
        </div>

        <div className="flex justify-center space-x-2 mb-4 text-xl">
            {Array.from({ length: Math.ceil(filteredUsers.length / usersPerPage) }, (_, i) => (
              <span
                key={i}
                className={`cursor-pointer px-4 py-2 rounded-full inline-flex items-center justify-center rounded-full 
                ${currentPage === i + 1 ? 'font-bold bg-green-600 text-white' : 'bg-gray-300 text-gray-800'}`}
                onClick={() => paginate(i + 1)}
              >
              {i + 1}
              </span>
            ))}
        </div>
        <button
          onClick={() => navigate('/add-user')}
          className="bg-green-600 text-white rounded-full px-6 py-3 mb-4"
          >
          Adicionar Usuário
        </button>
        <input
          className="border border-gray-300 shadow p-2 rounded-lg mb-4 w-full"
          type="text"
          placeholder="Buscar..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {loading && <p>Carregando...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {filteredUsersWithoutCurrentUser.length === 0 && !loading && !error && <p>Nenhum usuário encontrado.</p>}
        {filteredUsersWithoutCurrentUser.length > 0 && (
          <ul>
            {filteredUsersWithoutCurrentUser.map(user => (
              <li
                key={user.id}
                className="bg-green-100 border border-green-400 text-green-800 rounded-md p-4 mb-4 flex justify-between items-center relative"
              >
                <div>
                  <p className="font-bold">Nome: {user.name}</p>
                  <p>Email: {user.email}</p>
                  <p>Tipo: {user.type === 'admin' ? 'Administrador' : 'Aluno'}</p>
                </div>
                <button
                  onClick={() => setConfirmDelete(user.id)}
                  className="flex items-center justify-center bg-red-500 rounded-full w-10 h-10 text-white text-2xl hover:bg-red-600"
                  style={{ width: '40px', height: '40px' }}
                >
                    <FaTrash />
                </button>
              </li>
            ))}
          </ul>
        )}

        {confirmDelete && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded-lg">
              <p className="mb-4">Tem certeza que deseja excluir este usuário?</p>
              <div className="flex justify-center">
                <button
                  onClick={() => handleDeleteUser(confirmDelete)}
                  className="mr-4 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded focus:outline-none focus:ring focus:ring-red-200"
                >
                  Sim
                </button>
                <button
                  onClick={() => setConfirmDelete(null)}
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
