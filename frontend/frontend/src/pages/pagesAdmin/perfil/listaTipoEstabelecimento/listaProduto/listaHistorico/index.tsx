import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container } from '../../../../../../components/container';
import { useLocation } from 'react-router-dom';

interface User {
  id: number;
  name: string;
}

interface Stablishment {
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
  const [stablishments, setStablishments] = useState<Stablishment[]>([]);
  const [selectedStablishmentId, setSelectedStablishmentId] = useState<number | null>(null);
  const location = useLocation();
  const pathParts = location.pathname.split('/');
  const stablishmentTypeId = pathParts[pathParts.length - 3];
  const productId = pathParts[pathParts.length - 2];
  const productName = pathParts[pathParts.length - 1];
  let productNameComEspacos = productName.replace(/%20/g, " ");
  let productNameFinal = decodeURIComponent(productNameComEspacos.replace(/\+/g, ' '));
  const apiUrl = import.meta.env.VITE_API_URL;

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

        const response = await axios.get(`${apiUrl}/users`, config);
        setUsers(response.data);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      }
    };

    const fetchStablishments = async () => {
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

        const response = await axios.get(`${apiUrl}/stablishment/${stablishmentTypeId}`, config);
        console.log('Response from fetchStablishments:', response.data);

        // Extrair os estabelecimentos do campo "data" da resposta
        const stablishmentsData = response.data.data;
        setStablishments(stablishmentsData);
      } catch (error) {
        console.error('Erro ao buscar estabelecimentos:', error);
      }
    };

    fetchUsers();
    fetchStablishments();
  }, [stablishmentTypeId]);

  useEffect(() => {
    const fetchPriceHistory = async () => {
      try {
        if (!selectedStablishmentId) return;

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

        const response = await axios.get<RegisterItem[]>(`${apiUrl}/register/history/${selectedStablishmentId}/${productId}`, config);
        
        const historyWithUserNames = response.data.map(item => {
          const user = users.find(user => user.id === item.fk_users_id);
          return { ...item, userName: user ? user.name : 'Usuário desconhecido' };
        });
        setPriceHistory(historyWithUserNames);
      } catch (error) {
        console.error('Erro ao buscar o histórico de preços:', error);
      }
    };

    fetchPriceHistory();
  }, [selectedStablishmentId, productId, users]);

  const formatDateTime = (dateTimeString: string | number | Date) => {
    const date = new Date(dateTimeString);
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    const formattedTime = `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
    return `${formattedDate} ${formattedTime}`;
  };

  const handleStablishmentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = parseInt(event.target.value);
    setSelectedStablishmentId(selectedId);
  };

  const filteredPriceHistory = priceHistory.filter(item => !isNaN(parseFloat(item.price)));

  return (
    <Container>
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-4xl font-bold text-black mb-6">Histórico de Preços ({productNameFinal})</h1>
        <div className="mb-4">
          <label htmlFor="stablishmentSelect" className="block text-sm font-medium text-gray-700">
            Selecione o estabelecimento:
          </label>
          <select
            id="stablishmentSelect"
            value={selectedStablishmentId || ''}
            onChange={handleStablishmentChange}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Selecione...</option>
            {stablishments.map(stablishment => (
              <option key={stablishment.id} value={stablishment.id}>{stablishment.name}</option>
            ))}
          </select>
        </div>
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
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {parseFloat(item.price) === 999 ? 'Não Disponível' : parseFloat(item.price).toFixed(2)}
                    </td>
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
