import React, { useState, useEffect } from 'react';
import { Container } from '../../../components/container';
import { Input } from '../../../components/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';

const schema = z.object({
  tipoDeEstabelecimento: z.string().nonempty('O campo tipo de estabelecimento é obrigatório'),
  nome: z.string().nonempty('O campo nome é obrigatório'),
  marca: z.string().nonempty('O campo descrição é obrigatório'),
  codigoDeBarras: z.string(),
  unidadeDeMedida: z.string().nonempty('O campo unidade de medida é obrigatório'),
  quantidade: z.string().min(1, 'A quantidade deve ser maior que zero'),
});

type FormData = z.infer<typeof schema>;

interface EstablishmentType {
  id: number;
  name: string;
}

export function AddProduto() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

  const [isUnidadeSelected, setIsUnidadeSelected] = useState(false);
  const [tipoEstabelecimento, setTipoEstabelecimento] = useState("");
  const [stablishmentTypes, setStablishmentTypes] = useState<EstablishmentType[]>([]);
  const [filteredTypes, setFilteredTypes] = useState([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchEstablishmentTypes = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${apiUrl}/stablishmentType`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.data && Array.isArray(response.data.data)) {
          setStablishmentTypes(response.data.data);
          setFilteredTypes(response.data.data);
        }
      } catch (error) {
        console.error('Erro ao buscar tipos de estabelecimento', error);
      }
    };

    fetchEstablishmentTypes();
  }, []);

  const handleUnidadeDeMedidaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setIsUnidadeSelected(event.target.value === 'unidade');
  };

  const handleTipoEstabelecimentoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTipoEstabelecimento(event.target.value);
  };

  async function onSubmit(data: FormData) {
    const { tipoDeEstabelecimento, nome, marca, codigoDeBarras, unidadeDeMedida, quantidade } = data;

    const tipoEstabelecimentoSelecionado = stablishmentTypes.find((tipo) => tipo.name === tipoDeEstabelecimento);

    if (!tipoEstabelecimentoSelecionado) {
      setErrorMessage('Tipo de estabelecimento selecionado não encontrado');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setErrorMessage('Token de autenticação não encontrado no localStorage');
      return;
    }

    const produto = {
      name: nome,
      description: marca,
      measurementUnit: `${quantidade} ${unidadeDeMedida}`,
      barCode: codigoDeBarras || '',
      fk_stablishment_types_id: tipoEstabelecimentoSelecionado.id,
    };
    console.log(produto);
    try {
      const response = await axios.post(`${apiUrl}/product`, produto, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
      setSuccessMessage('Produto adicionado com sucesso');
      setErrorMessage(null);
      reset();
      setTimeout(() => {
        setSuccessMessage(null);
        setErrorMessage(null);
      }, 2000);
    } catch (error) {
      setErrorMessage('Erro ao adicionar produto');
      setSuccessMessage(null);
      console.error('Erro ao adicionar produto:', error);
    }
  }

  const unidadesDeMedida = ['Kg', 'g', 'L', 'ml', 'unidade'];

  return (
    <Container>
      <div className='w-full flex justify-center items-center flex-col gap-4'>
        <h1 className="text-4xl font-bold mb-6">Adicionar Produto</h1>
        <form
          className='bg-white max-w-xl w-full rounded-lg flex flex-col p-4'
          onSubmit={handleSubmit(onSubmit)}
        >
          {successMessage && <p className='text-green-600 bg-green-100 p-2 rounded'>{successMessage}</p>}
          {errorMessage && <p className='text-red-600 bg-red-100 p-2 rounded'>{errorMessage}</p>}
          <div className='mb-3'>
            <label className='block text-sm font-medium text-gray-700'>Tipo de Estabelecimento</label>
            <select
              {...register('tipoDeEstabelecimento')}
              className='mt-1 p-2 border border-gray-300 rounded-md w-full'
              onChange={handleTipoEstabelecimentoChange}
            >
              {stablishmentTypes.map((tipo: any, index: number) => (
                <option key={index} value={tipo.name}>
                  {tipo.name}
                </option>
              ))}
            </select>
            {errors.tipoDeEstabelecimento && (
              <p className='mt-1 text-sm text-red-600'>{errors.tipoDeEstabelecimento.message}</p>
            )}
          </div>

          <div className='mb-3'>
            <Input
              type='text'
              placeholder='Digite o nome do produto...'
              name='nome'
              error={errors.nome?.message}
              register={register}
            />
          </div>

          <div className='mb-3'>
            <Input
              type='text'
              placeholder='Digite a descrição do produto...'
              name='marca'
              error={errors.marca?.message}
              register={register}
            />
          </div>

          <div className='mb-3' style={{ width: '100%', overflow: 'visible' }}>
            <Input
              type='text'
              placeholder='Digite o código de barras do produto... (Opcional)'
              name='codigoDeBarras'
              error={errors.codigoDeBarras?.message}
              register={register}
            />
          </div>

          <div className='mb-3'>
            <label className='block text-sm font-medium text-gray-700'>Unidade de Medida</label>
            <select
              {...register('unidadeDeMedida')}
              className='mt-1 p-2 border border-gray-300 rounded-md w-full'
              onChange={handleUnidadeDeMedidaChange}
            >
              {unidadesDeMedida.map((unidade, index) => (
                <option key={index} value={unidade}>
                  {unidade}
                </option>
              ))}
            </select>
            {errors.unidadeDeMedida && (
              <p className='mt-1 text-sm text-red-600'>{errors.unidadeDeMedida.message}</p>
            )}
          </div>

          <div className='mb-3'>
            <Input
              type='number'
              placeholder='Digite o peso ou número de unidades...'
              name='quantidade'
              register={register}
              error={errors.quantidade?.message}
              min={1}
              defaultValue={1}
            />
          </div>

          <button type='submit' className='bg-green-600 w-full rounded-full text-white h-10 font-medium'>
            Adicionar Produto
          </button>
        </form>
      </div>
    </Container>
  );
}
