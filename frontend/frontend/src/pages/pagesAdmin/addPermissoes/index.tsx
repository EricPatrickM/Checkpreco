import { useEffect, useState } from 'react';
import axios from 'axios';
import { Container } from "../../../components/container";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation } from 'react-router-dom';

const schema = z.object({
  userId: z.string(),
});

type FormData = z.infer<typeof schema>;

interface User {
  id: string;
  name: string;
}

export function AddPermissoes() {
  const [users, setUsers] = useState<User[]>([]);
  const { register, handleSubmit} = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange"
  });
  const [submissionResult, setSubmissionResult] = useState<{ success: boolean, message: string | null }>({ success: false, message: null });
  const location = useLocation();
  const pathParts = location.pathname.split('/');
  const stablishmentId = pathParts[pathParts.length - 1];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
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

        setUsers(response.data.sort((a, b) => a.name.localeCompare(b.name)));
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      }
    };

    fetchUsers();
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      const token = localStorage.getItem('token');
      const requestBody = {
        fk_users_id: data.userId,
        fk_stablishments_id: stablishmentId
      };
      const response = await axios.post('http://localhost:8000/api/allowed', requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      setSubmissionResult({ success: true, message: "Permissão adicionada com sucesso!" });
    } catch (error) {
      setSubmissionResult({ success: false, message: "Erro ao adicionar permissão. Por favor, tente novamente." });
      console.error("Erro ao adicionar permissão:", error);
    }
  };

  return (
    <Container>
      <div className='w-full flex justify-center items-center flex-col gap-4'>
        <h1 className="text-4xl font-bold mb-6">Adicionar Permissão</h1>

        {submissionResult.message && (
          <div className={`text-white p-3 rounded-md ${submissionResult.success ? 'bg-green-500' : 'bg-red-500'}`}>
            {submissionResult.message}
          </div>
        )}

        <form
          className='bg-white max-w-xl w-full rounded-lg flex flex-col p-6 shadow-lg'
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className='mb-4'>
            <label htmlFor="userId" className="block mb-2 text-sm font-medium text-gray-900">Usuário</label>
            <select
              id="userId"
              {...register("userId")}
              className="form-select mt-1 block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Selecione um usuário</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="mt-4 bg-green-600 w-full rounded-md text-white h-10 font-medium hover:bg-green-700"
          >
            Adicionar Permissão
          </button>
        </form>
      </div>
    </Container>
  );
}
