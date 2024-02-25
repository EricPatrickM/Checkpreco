import { Link } from 'react-router-dom';
import { Container } from '../../../components/container';

export function Perfil() {
  return (
    <Container>
      <div className='w-full min-h-screen flex flex-col items-center gap-4'>
        <h1 className='text-6xl font-bold text-black mb-6'>PERFIL</h1>

        <div className='w-full max-w-md'>
          <Link to="/lista-user-admin">
            <div className='mb-4 bg-green-600 rounded-lg p-4 text-center transition duration-300 hover:bg-green-700'>
              <p className='text-xl font-bold text-white'>GERENCIAR USUÁRIOS</p>
            </div>
          </Link>

          <Link to="/lista-tipo-estabelecimento-admin">
            <div className='mb-4 bg-green-600 rounded-lg p-4 text-center transition duration-300 hover:bg-green-700'>
              <p className='text-xl font-bold text-white'>GERENCIAR ESTABELECIMENTOS</p>
            </div>
          </Link>
        </div>
      </div>
    </Container>
  );
}
