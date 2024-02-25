import { Container } from "../../../components/container";
import { useEffect, useState, ChangeEvent } from 'react';
import { Input } from '../../../components/input';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
    name: z.string().nonempty("O campo nome é obrigatório"),
    stablishmentType: z.string().nonempty("O campo tipo do estabelecimento é obrigatório"),
    address: z.object({
        city: z.string().nonempty("O campo cidade é obrigatório"),
        neighborhood: z.string().nonempty("O campo bairro é obrigatório"),
        uf: z.string().nonempty("O campo UF é obrigatório"),
    }),
});

type FormData = z.infer<typeof schema>;

interface Establishment {
    id: number;
    name: string;
}

interface Address {
    id?: number;
    state?: string;
    city: string;
    neighborhood?: string;
    uf?: string;
}

interface State {
    Nome: string;
    Uf: string;
    Regiao: number;
}

export function AddEstabelecimento() {
    const [stablishmentTypes, setStablishmentTypes] = useState<Establishment[]>([]);
    const [filteredTypes, setFilteredTypes] = useState<Establishment[]>([]);
    const [showTypeOptions, setShowTypeOptions] = useState<boolean>(false);
    const [address, setAddress] = useState<Address | null>();
    const [states, setStates] = useState<State[]>([]);
    const [cities, setCities] = useState<string[]>([]);
    const [showCityList, setShowCityList] = useState<boolean>(false);
    const [neighborhoods, setNeighborhoods] = useState<string[]>([]);
    const [showNeighborhoodList, setShowNeighborhoodList] = useState<boolean>(false);
    const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>(''); // Novo estado para o bairro selecionado
    const [manualInput, setManualInput] = useState<boolean>(false); // Novo estado para controlar se o usuário está digitando manualmente
    const [message, setMessage] = useState<string | null>(null);
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange"
    });

    // Lista de siglas de estados do Brasil
    const stateOptions = [
        "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", 
        "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
    ];

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
                    setStablishmentTypes(response.data.data);
                    setFilteredTypes(response.data.data);
                }
            } catch (error) {
                setMessage('Erro ao buscar tipos de estabelecimento');
            }
        };

        const fetchStates = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8000/api/address/search/state', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (response.data && Array.isArray(response.data.data)) {
                    setStates(response.data.data);
                }
            } catch (error) {
                setMessage('Erro ao buscar estados');
            }
        };

        fetchEstablishmentTypes();
        fetchStates();
    }, []);

    const handleTypeInputClick = () => {
        setShowTypeOptions(true);
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const searchText = event.target.value.toLowerCase();
        const filtered = stablishmentTypes.filter(type =>
            type.name.toLowerCase().includes(searchText)
        );
        setFilteredTypes(filtered);
    };

    const handleTypeOptionClick = (type: string) => {
        reset({ stablishmentType: type });
        setShowTypeOptions(false);
    };

    const handleAddressInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const city = event.target.value.trim();
        if (!city) {
            setAddress(null);
            setCities([]);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const cityResponse = await axios.get(`http://localhost:8000/api/address/search/city/${city}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const cityData = cityResponse.data;
            if (cityData && Array.isArray(cityData)) {
                const citiesArray = cityData.map((city: { city: string }) => city.city);
                setAddress({
                    city: city,
                    id: undefined,
                    state: undefined,
                    neighborhood: undefined,
                    uf: undefined
                });
                setCities(citiesArray);
                setShowCityList(true);
            }
        } catch (error) {
            setMessage('Erro ao buscar endereço');
        }
    };

    const handleCityClick = (city: string) => {
        reset({ address: { city: city, neighborhood: '', uf: ''} });
        setAddress({
            city: city,
            id: undefined,
            state: undefined,
            neighborhood: undefined,
            uf: undefined
        });
        setShowCityList(false);
    };

    const handleNeighborhoodInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const neighborhood = event.target.value; // Remover o trim() aqui
        if (!neighborhood) {
            setNeighborhoods([]);
            setShowNeighborhoodList(false);
            setManualInput(false); // Quando o usuário apaga o input, voltamos ao modo de seleção da lista
            return;
        }

        setManualInput(true); // O usuário está digitando manualmente
        setSelectedNeighborhood(neighborhood); // Atualiza o valor do bairro selecionado
        try {
            const token = localStorage.getItem('token');
            const neighborhoodResponse = await axios.get(`http://localhost:8000/api/address/search/neighborhood/${address?.city}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const neighborhoodData = neighborhoodResponse.data;
            if (neighborhoodData && Array.isArray(neighborhoodData.data)) {
                const neighborhoodsArray = neighborhoodData.data.map((n: { neighborhood: string }) => n.neighborhood);
                const filteredNeighborhoods = neighborhoodsArray.filter((n: string) => n.toLowerCase().includes(neighborhood.toLowerCase()));
                setNeighborhoods(filteredNeighborhoods);
                setShowNeighborhoodList(true);
            }
        } catch (error) {
            setMessage('Erro ao buscar bairros');
        }
    };

    const handleNeighborhoodClick = (neighborhood: string) => {
        setSelectedNeighborhood(neighborhood); // Atualiza o valor do bairro selecionado ao clicar na lista
        setShowNeighborhoodList(false);
    };

    const onSubmit = async (data: FormData) => {
        try {
            const token = localStorage.getItem('token');
            const { city, neighborhood, uf } = data.address;
            const stablishmentTypeName = data.stablishmentType;
            
            const stablishmentType = stablishmentTypes.find(type => type.name === stablishmentTypeName);
            if (!stablishmentType) {
                console.error('Tipo de estabelecimento não encontrado.');
                return;
            }
            const stablishmentTypeId = stablishmentType.id;
    
            const requestBody = {
                city: city,
                neighborhood: neighborhood,
                state: uf
            };
            try {
                await axios.post('http://localhost:8000/api/address', requestBody, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }  catch (error) {
                console.log('');
            }
    
            let addressId;
            const addressResponse = await axios.get(`http://localhost:8000/api/address/search/neighborhood/${city}/${neighborhood}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
    
            if (addressResponse.data && Array.isArray(addressResponse.data) && addressResponse.data.length > 0) {
                addressId = addressResponse.data[0].id;
            } else {
                setMessage('Endereço não encontrado.');
                return;
            }
    
            const stablishmentRequestBody = {
                name: data.name,
                fk_stablishment_types_id: stablishmentTypeId,
                fk_address_id: addressId,
            };
    
            await axios.post('http://localhost:8000/api/stablishment', stablishmentRequestBody, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setMessage('Estabelecimento adicionado com sucesso!');
            reset();
            setTimeout(() => {
                setMessage(null);
            }, 3000);
        } catch (error) {
            setMessage('Erro ao criar estabelecimento.');
        }
    };
  
    return (
        <Container>
            <div className='w-full flex justify-center items-center flex-col gap-4'>
                <h1 className="text-4xl font-bold mb-6">Adicionar Estabelecimento</h1>

                {message && <p className={message.includes('sucesso') ? 'text-green-600' : 'text-red-600'}>{message}</p>}
                <form className='bg-white max-w-xl w-full rounded-lg flex flex-col p-4' onSubmit={handleSubmit(onSubmit)}>
                    <div className='mb-3 relative'>
                        <Input
                            type="text"
                            placeholder="Tipo do Estabelecimento"
                            name="stablishmentType"
                            register={register}
                            onClick={handleTypeInputClick}
                            onChange={handleInputChange}
                        />
                        {errors.stablishmentType && <p className="text-red-600">{errors.stablishmentType.message}</p>}
                        {showTypeOptions && (
                            <ul className="absolute z-10 bg-white border border-gray-300 rounded-md shadow-md w-full mt-1">
                                {filteredTypes.map((type, index) => (
                                    <li
                                        key={index}
                                        onClick={() => handleTypeOptionClick(type.name)}
                                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                    >
                                        {type.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className='mb-3 relative'>
                        <Input
                            type="text"
                            placeholder="Nome do Estabelecimento"
                            name="name"
                            register={register}
                        />
                        {errors.name && <p className="text-red-600">{errors.name.message}</p>}
                    </div>

                    <div className='mb-3 relative flex gap-4'>
                        <div className="flex-grow w-full" style={{ width: '70%' }}>
                            <Input
                                type="text"
                                placeholder="Cidade"
                                name="address.city"
                                register={register}
                                onChange={handleAddressInputChange}
                            />
                            {errors.address?.city && <p className="text-red-600">{errors.address.city.message}</p>}
                  
                            {showCityList && cities.length > 0 && (
                                <ul className="mt-2 absolute z-10 bg-white border border-gray-300 rounded-md shadow-md w-full">
                                    {cities.map((city, index) => (
                                        <li key={index} onClick={() => handleCityClick(city)} className="px-4 py-2 cursor-pointer hover:bg-gray-100">
                                            {city}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="flex-grow w-full" style={{ width: '10%' }}>
                            {/* Renderizando opções de estado */}
                            <select
                                {...register("address.uf")}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-md"
                            >
                                {stateOptions.map((state, index) => (
                                    <option key={index} value={state}>{state}</option>
                                ))}
                            </select>
                            {errors.address?.uf && <p className="text-red-600">{errors.address.uf.message}</p>}
                        </div>
                    </div>

                    <div className='mb-3 relative'>
                        <Input
                            type="text"
                            placeholder="Bairro"
                            name="address.neighborhood"
                            register={register}
                            onChange={handleNeighborhoodInputChange}
                            value={manualInput ? selectedNeighborhood : address?.neighborhood} // Use o valor do bairro selecionado apenas se não estiver digitando manualmente
                        />
                        {errors.address?.neighborhood && <p className="text-red-600">{errors.address.neighborhood.message}</p>}

                        {showNeighborhoodList && neighborhoods.length > 0 && (
                            <ul className="mt-2 absolute z-10 bg-white border border-gray-300 rounded-md shadow-md w-full">
                                {neighborhoods.map((neighborhood, index) => (
                                    <li key={index} onClick={() => handleNeighborhoodClick(neighborhood)} className="px-4 py-2 cursor-pointer hover:bg-gray-100">
                                        {neighborhood}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="bg-green-600 w-full rounded-md text-white h-10 font-medium"
                    >
                        Adicionar Estabelecimento
                    </button>
                </form>
            </div>
        </Container>
    );
}
