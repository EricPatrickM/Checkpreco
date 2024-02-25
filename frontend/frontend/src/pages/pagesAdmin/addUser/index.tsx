import { useState } from 'react';
import axios from 'axios';
import { Container } from '../../../components/container';
import { Input } from '../../../components/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  name: z.string().nonempty("O campo nome é obrigatório"),
  email: z.string().email("Insira um email válido").max(100, "O email deve ter no máximo 100 caracteres").nonempty("O campo email é obrigatório"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres").max(100, "A senha deve ter no máximo 100 caracteres").nonempty("O campo senha é obrigatório"),
});

type FormData = z.infer<typeof schema>;

export function AddUser() {
  const [userType, setUserType] = useState('admin');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange"
  });

  const onSubmit = async (data: FormData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:8000/api/users', {
        name: data.name,
        email: data.email,
        password: data.password,
        type: userType
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setShowSuccessPopup(true);
      setEmailError(null);
      reset();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const responseData = error.response.data;
        if (responseData.errors?.email) {
          setEmailError('O email já está cadastrado. Por favor, escolha outro.');
        }
      }
    }
  };

  const closeSuccessPopup = () => {
    setShowSuccessPopup(false);
  };

  return (
    <Container>
      <div className=' w-full flex justify-center items-center flex-col gap-4'>
        <h1 className="text-4xl font-bold mb-6">Adicionar Usuário</h1>

        <form
          className='bg-white max-w-xl w-full rounded-lg flex flex-col p-4'
          onSubmit={handleSubmit(onSubmit)}
        >
          {emailError && <p className="text-center text-red-600 mb-4">{emailError}</p>}

          <div className='mb-3'>  
            <Input
              type="name"
              placeholder="Digite seu nome..."
              name="name"
              error={errors.name?.message}
              register={register}
            />
          </div>
          
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

          <div className='mb-3 flex gap-4'>
            <button
              type="button"
              className={`flex-1 rounded-full p-2 transition-all duration-300 ${
                userType === 'admin'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-black'
              }`}
              onClick={() => setUserType('admin')}
            >
              Admin
            </button>
            <button
              type="button"
              className={`flex-1 rounded-full p-2 transition-all duration-300 ${
                userType === 'colaborator'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-black'
              }`}
              onClick={() => setUserType('colaborator')}
            >
              Aluno
            </button>
          </div>

          <button type="submit" className="bg-green-600 w-full rounded-md text-white h-10 font-medium">
            Cadastrar Usuário
          </button>
        </form>

        {showSuccessPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded-lg">
              <p className="text-center text-green-600 mb-4">Usuário cadastrado com sucesso!</p>
              <button
                onClick={closeSuccessPopup}
                className="bg-green-600 w-full rounded-md text-white h-10 font-medium"
              >
                Ok
              </button>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}
