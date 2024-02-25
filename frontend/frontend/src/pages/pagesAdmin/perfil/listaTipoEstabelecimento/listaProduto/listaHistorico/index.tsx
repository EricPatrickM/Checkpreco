import { useEffect, useState } from 'react';
import axios from 'axios';
import { Container } from '../../../../../../components/container';
import { useLocation } from 'react-router-dom';

interface User {
  id: number;
  name: string;
}

interface RegisterItem {
  id: number;
  fk_products_id: string | number;
  fk_users_id: string | number;
  price: string;
  created_at: string;
  updated_at: string;
  userName?: string;
}

export function ListaHistorico() {
  const [priceHistory, setPriceHistory] = useState<RegisterItem[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const location = useLocation();
  const pathParts = location.pathname.split('/');
  const stablishmentId = pathParts[pathParts.length - 2];
  const productId = pathParts[pathParts.length - 1];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          console.error('Token não encontrado');
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        const response = await axios.get('http://localhost:8000/api/users', config);
        setUsers(response.data);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchPriceHistory = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          console.error('Token não encontrado');
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        const response = await axios.get<RegisterItem[]>(`http://localhost:8000/api/register/history/${stablishmentId}/${productId}`, config);
        
        const historyWithUserNames = response.data.map(item => {
          const user = users.find(user => user.id === item.fk_users_id);
          return { ...item, userName: user ? user.name : 'Usuário desconhecido' };
        });
        setPriceHistory(historyWithUserNames);
      } catch (error) {
        console.error('Erro ao buscar o histórico de preços:', error);
      }
    };

    if (users.length > 0) {
      fetchPriceHistory();
    }
  }, [users]);

  const formatDateTime = (dateTimeString: string | number | Date) => {
    const date = new Date(dateTimeString);
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    const formattedTime = `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
    return `${formattedDate} ${formattedTime}`;
  };

  const filteredPriceHistory = priceHistory.filter(item => !isNaN(parseFloat(item.price)));

  return (
    <Container>
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-4xl font-bold text-black mb-6">Histórico de Preços</h1>
        {filteredPriceHistory.length > 0 ? (
          <div className="w-full max-w-screen-lg">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2 text-center w-1/3">Data e Hora</th>
                  <th className="border border-gray-300 px-4 py-2 text-center w-1/3">Preço</th>
                  <th className="border border-gray-300 px-4 py-2 text-center w-1/3">Usuário</th>
                </tr>
              </thead>
              <tbody>
                {filteredPriceHistory.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                    <td className="border border-gray-300 px-4 py-2 text-center">{formatDateTime(item.updated_at)}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">{parseFloat(item.price).toFixed(2)}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">{item.userName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>Nenhum histórico de preços disponível.</p>
        )}
      </div>
    </Container>
  );
}
