import { useEffect, useState } from 'react';
import axios from 'axios';
import { Container } from "../../../components/container";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const schema = z.object({
  estabelecimentoTipoId: z.string().nonempty("O campo tipo do estabelecimento é obrigatório"), 
  nome: z.string().nonempty("O campo data é obrigatório"), 
});

type FormData = z.infer<typeof schema>;

interface StablishmentType {
  id: number;
  name: string;
}

export function AddLote() {
  const [date, setDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [establishmentTypes, setEstablishmentTypes] = useState<StablishmentType[]>([]);
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null); 
  const { register, handleSubmit, setValue, watch} = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange"
  });
  const [submissionResult, setSubmissionResult] = useState<{ success: boolean, message: string | null }>({ success: false, message: null });

  useEffect(() => {
    const fetchEstablishmentTypes = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/stablishmentType', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.data && Array.isArray(response.data.data)) {
          setEstablishmentTypes(response.data.data);
        }
      } catch (error) {
        console.error('Erro ao buscar tipos de estabelecimento:', error);
      }
    };

    fetchEstablishmentTypes();
  }, []);


  const handleDateChange = (value: Date | (Date | null)[] | null) => {
    let selectedDate: Date | null = null;

    if (Array.isArray(value)) {
      selectedDate = value[0];
    } else {
      selectedDate = value;
    }

    if (selectedDate) {
      setDate(selectedDate);
      const formattedDate = `${selectedDate.getDate().toString().padStart(2, '0')}/${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}/${selectedDate.getFullYear()}`;
      setValue("nome", formattedDate);
      setShowCalendar(false);
    }
  };

  const handleTypeSelection = (id: string) => {
    const typeId = parseInt(id);
    setSelectedTypeId(typeId);
    setValue('estabelecimentoTipoId', typeId.toString(), { shouldValidate: true });
  };

  const onSubmit = async (data: FormData) => {
    try {
      const token = localStorage.getItem('token');
      const requestBody = {
        name: data.nome, 
        fk_stablishment_types_id: selectedTypeId 
      };
      await axios.post('http://localhost:8000/api/batch', requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setSubmissionResult({ success: true, message: "Lote cadastrado com sucesso!" });

    } catch (error) {
      setSubmissionResult({ success: false, message: "Erro ao cadastrar lote. Por favor, tente novamente." });
      console.error("Erro ao cadastrar lote:", error);
    }
  };

  return (
    <Container>
      <div className='w-full flex justify-center items-center flex-col gap-4'>
        <h1 className="text-4xl font-bold mb-6">Adicionar Lote</h1>

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
            <label htmlFor="estabelecimentoTipoId" className="block mb-2 text-sm font-medium text-gray-900">Tipo de Estabelecimento</label>
            <select
              id="estabelecimentoTipoId"
              {...register("estabelecimentoTipoId")}
              onChange={(e) => handleTypeSelection(String(e.target.value))}
              className="form-select mt-1 block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Selecione um tipo</option>
              {establishmentTypes.map((type) => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>

          <div className='mb-4'>
            <label htmlFor="nome" className="block mb-2 text-sm font-medium text-gray-900">Data</label>
            <input
              type="text"
              id="nome"
              onClick={() => setShowCalendar(true)}
              value={watch("nome") || ''}
              readOnly
              className="form-input mt-1 block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 cursor-pointer"
            />
            {showCalendar && (
              <Calendar
                onChange={handleDateChange}
                value={date}
                className="absolute z-10"
              />
            )}
          </div>

          <button
            type="submit"
            className="mt-4 bg-green-600 w-full rounded-md text-white h-10 font-medium hover:bg-green-700"
          >
            Adicionar Lote
          </button>
        </form>
      </div>
    </Container>
  );
}
