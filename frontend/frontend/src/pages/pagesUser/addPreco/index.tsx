import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container } from "../../../components/container";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation } from 'react-router-dom';
import Modal from '../../../components/modal';

const schema = z.object({
  price: z.string()
    .regex(/^\d+(\.\d{1,2})?$/, "O preço deve ser um valor numérico válido")
    .transform((value) => parseFloat(value))
    .refine((value) => value > 0, "O preço deve ser um valor maior que zero"),
});

type FormData = z.infer<typeof schema>;

interface RegisterItem {
  id: number;
  fk_products_id: string | number;
  fk_users_id: string | number;
  fk_stablishments_id: string | number;
  fk_batchs_id: string | number;
  price: string;
  created_at: string;
  updated_at: string;
}

export function AddPreco() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      price: 1.00
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [registerId, setRegisterId] = useState<number | null>(null);
  const [priceHistory, setPriceHistory] = useState<RegisterItem[]>([]);
  const [actionStatus, setActionStatus] = useState<string | null>(null);
  const [newPrice, setNewPrice] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); 
  const location = useLocation();
  const pathParts = location.pathname.split('/');
  const batchId = pathParts[pathParts.length - 4];
  const establishmentId = pathParts[pathParts.length - 3];
  const productId = pathParts[pathParts.length - 2];
  const productName = pathParts[pathParts.length - 1];
  let productNameComEspacos = productName.replace(/%20/g, " ");
  let productNameFinal = decodeURIComponent(productNameComEspacos.replace(/\+/g, ' '));
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('userEmail');
        const response = await axios.get(`${apiUrl}/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data && response.data.length > 0) {
          const user = response.data.find((user: any) => user.email === email);
          if (user) {
            setUserId(user.id);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar o usuário:', error);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchRegisterId = async () => {
      if (!userId) return;
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get<{ data: RegisterItem[] }>(`${apiUrl}/register/${establishmentId}/${batchId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const filteredItem = response.data.data.find((item) =>
          item.fk_batchs_id.toString() === batchId.toString() &&
          item.fk_products_id.toString() === productId.toString()
        );
        if (filteredItem) {
          setRegisterId(filteredItem.id);
        } else {
          console.log("ID do registro não encontrado.");
        }
      } catch (error) {
        console.error('Erro ao obter o ID do registro:', error);
      }
    };

    fetchRegisterId();
  }, [userId, establishmentId, batchId, productId]);

  useEffect(() => {
    const fetchPriceHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get<RegisterItem[]>(`${apiUrl}/register/history/${establishmentId}/${productId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.data) {
          console.error("Dados não encontrados na resposta da API");
          return;
        }

        setPriceHistory(response.data);
      } catch (error) {
        console.error('Erro ao buscar o histórico de preços:', error);
      }
    };

    fetchPriceHistory();
  }, [establishmentId, productId]);

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    const formattedTime = `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
    return `${formattedDate} ${formattedTime}`;
  };

  const isNewPriceWithinRange = (newPrice: number, lastPrice: number): boolean => {
    return Math.abs(newPrice - lastPrice) <= 5;
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);
  
    if (!registerId) {
      setError('ID do registro não encontrado.');
      setLoading(false);
      return;
    }
  
    const lastPrice = parseFloat(priceHistory[0]?.price || '0');
  
    const proposedPrice = data.price;
  
    if (priceHistory[0]?.price !== null && !isNewPriceWithinRange(proposedPrice, lastPrice)) {
      setNewPrice(proposedPrice); 
      setIsModalOpen(true); 
      setLoading(false); 
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${apiUrl}/register/${registerId}`, {
        price: proposedPrice
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(response);
      reset();
      setActionStatus('Preço adicionado com sucesso!');
      
      const updatedPriceHistory = await axios.get<RegisterItem[]>(`${apiUrl}/register/history/${establishmentId}/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPriceHistory(updatedPriceHistory.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response){
        const status = error.response.status;
        if (status === 401){
          setActionStatus('Você não tem permissão para alterar o preço deste produto.');
        }else{
          setActionStatus('Erro ao adicionar o preço. Por favor, tente novamente.');
        }
      }
    } finally {
      setLoading(false);
    }
  };  

  const handleModalConfirmation = async (confirmed: boolean) => {
    setIsModalOpen(false); 

    if (confirmed) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.put(`${apiUrl}/register/${registerId}`, {
          price: newPrice, 
          fk_products_id: productId,
          fk_users_id: userId,
          fk_stablishments_id: establishmentId,
          fk_batchs_id: batchId
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        reset();
        setActionStatus('Preço adicionado com sucesso!');
        
        const updatedPriceHistory = await axios.get<RegisterItem[]>(`${apiUrl}/register/history/${establishmentId}/${productId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPriceHistory(updatedPriceHistory.data);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response){
          const status = error.response.status;
          if (status === 401){
            setActionStatus('Você não tem permissão para alterar o preço deste produto.');
          }else{
            setActionStatus('Erro ao adicionar o preço. Por favor, tente novamente.');
          }
        }
      }
    }
  };

  const handleProductNotAvailable = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${apiUrl}/register/${registerId}`, {
      price: 999
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(response);
    reset();
    setActionStatus('Preço alterado para "Produto não disponível" com sucesso!');
    
    const updatedPriceHistory = await axios.get<RegisterItem[]>(`${apiUrl}/register/history/${establishmentId}/${productId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setPriceHistory(updatedPriceHistory.data);
  };

  return (
    <Container>
      <div className="w-full min-h-screen flex flex-col items-center gap-4">
        <h1 className="text-4xl font-bold text-black mb-6">{productNameFinal}</h1>
        <form className='bg-white max-w-xl w-full p-4 rounded-lg shadow' onSubmit={handleSubmit(onSubmit)}>
          <div className='mb-4'>
            <label htmlFor='price' className='block text-gray-700 text-sm font-bold mb-2'>Preço:</label>
            <input
              id='price'
              type='text'
              {...register('price')}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.price ? 'border-red-500' : ''}`}
            />
            {errors.price && <p className='text-red-500 text-xs italic'>{errors.price.message}</p>}
          </div>
          <button
            type='submit'
            className="mt-4 bg-green-600 w-full rounded-md text-white h-10 font-medium hover:bg-green-700"
            disabled={loading}
          >
            {loading ? 'Adicionando...' : 'Adicionar Preço'}
          </button>
          {error && <p className='text-red-500 text-xs italic mt-2'>{error}</p>}
          {actionStatus && <p className={`text-xs mt-2 ${actionStatus.includes('sucesso') ? 'text-green-500' : 'text-red-500'}`}>{actionStatus}</p>}
          <button
            className="mt-4 bg-red-700 w-full rounded-md text-white h-10 font-medium hover:bg-red-700"
            onClick={handleProductNotAvailable}
          >
            Produto não disponível
          </button>
        </form>
        <div className="mt-8">
          <h2 className="text-lg flex items-center font-semibold mb-2"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>Histórico de Preços</h2>
          {priceHistory.length > 0 ? (
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2">Data e Hora</th>
                  <th className="border border-gray-300 px-4 py-2">Preço</th>
                </tr>
              </thead>
              <tbody>
                {priceHistory
                .filter(item => item.price !== null && !isNaN(parseFloat(item.price)))
                .map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                    <td className="border border-gray-300 px-4 py-2">{formatDateTime(item.updated_at ? item.updated_at : item.created_at)}</td>
                    <td className="border border-gray-300 px-4 py-2">{parseFloat(item.price) === 999 ? 'Não Disponível' : parseFloat(item.price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}

        </div>
      </div>
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}> 
        <div>
          <p className="mb-2">O preço inserido é {newPrice && newPrice - parseFloat(priceHistory[0]?.price || '0') > 0 ? 'mais caro' : 'mais barato'} do que o último preço registrado em mais de R$5. Deseja continuar?</p>
          <div className="flex justify-end">
            <button onClick={() => handleModalConfirmation(false)} className="mr-4 bg-red-600 text-white px-4 py-2 rounded-md">Cancelar</button>
            <button onClick={() => handleModalConfirmation(true)} className="bg-green-600 text-white px-4 py-2 rounded-md">Continuar</button>
          </div>
        </div>
      </Modal>
    </Container>
  );
}
