import { useState, useEffect } from 'react';
import logoImg from '../../assets/logo.svg';
import axios from 'axios';
import { Container } from '../../components/container';
import { Input } from '../../components/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';

const schema = z.object({
  email: z.string().email("Insira um email válido").nonempty("O campo email é obrigatório"),
  password: z.string().nonempty("O campo senha é obrigatório"),
});

type FormData = z.infer<typeof schema>;

export function Login() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange"
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const userType = localStorage.getItem('userType');
      if (userType === 'admin') {
        navigate('/perfil');
      } else {
        navigate('/tipo-estabelecimento');
      }
    }
  }, [navigate]);
  const onSubmit = async (data: FormData) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    try {
      const response = await axios.post(`${apiUrl}/login`, {
        email: data.email,
        password: data.password
      });

      const token = response.data.token;
      const userType = response.data.type;
      const userEmail = response.data.email;

      localStorage.setItem('token', token);
      localStorage.setItem('userType', userType);
      localStorage.setItem('userEmail', userEmail);
          
      if (userType === 'admin') {
        navigate('/perfil');
      } else {
        navigate('/tipo-estabelecimento');
      }
    } catch (error) {
      setError('Credenciais inválidas. Por favor, verifique seu email e senha.');
      console.error('Erro ao fazer login:', error);
    }
  };

  return (
    <Container>
      <div className='w-full min-h-screen flex justify-center items-center flex-col gap-4'>
        <img
          src={logoImg}
          alt="Logo do site"
          className="mb-6 max-w-sm w-full"
        />

        <form
          className='bg-white max-w-xl w-full rounded-lg flex flex-col p-4'
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className='mb-3'>  
            <Input
              type="email"
              placeholder="Digite seu email..."
              name="email"
              error={errors.email?.message}
              register={register}
            />
          </div>

          <div className='mb-3'>  
            <Input
              type="password"
              placeholder="Digite sua senha..."
              name="password"
              error={errors.password?.message}
              register={register}
            />
          </div>

          {error && <p className="text-red-500 mb-2">{error}</p>}

          <button type="submit" className="bg-green-600 w-full rounded-full text-white h-10 font-medium">
            Acessar
          </button>
        </form>
      </div>
    </Container>
  );
}
