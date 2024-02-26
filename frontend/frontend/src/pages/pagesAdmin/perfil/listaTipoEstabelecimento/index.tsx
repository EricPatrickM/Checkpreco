import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTrash, FaPencilAlt } from 'react-icons/fa';
import Modal from '../../../../components/modal';
import { Container } from '../../../../components/container';
import { Link } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_URL;
const API_URL = `${apiUrl}/stablishmentType`;
const TYPES_PER_PAGE = 5;

interface EstablishmentType {
  id: number;
  name: string;
}

export function ListaTipoEstabelecimento() {
  const [establishmentTypes, setEstablishmentTypes] = useState<EstablishmentType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editedTypeName, setEditedTypeName] = useState('');
  const [editedTypeId, setEditedTypeId] = useState<number | null>(null);
  const [newTypeName, setNewTypeName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [typeToDelete, setTypeToDelete] = useState<EstablishmentType | null>(null);
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);

  useEffect(() => {
    fetchEstablishmentTypes();
  }, [currentPage]);

  async function fetchEstablishmentTypes() {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(API_URL, {
        params: { page: currentPage, per_page: TYPES_PER_PAGE },
        headers: { Authorization: `Bearer ${token}` }
      });
      setEstablishmentTypes(data.data);
      setTotalPages(Math.ceil(data.total / TYPES_PER_PAGE));
      setError(null);
    } catch (error) {
      setError('Erro ao carregar os tipos de estabelecimentos.');
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (type: EstablishmentType) => {
    setTypeToDelete(type);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!typeToDelete) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/${typeToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchEstablishmentTypes();
      setDeleteModalOpen(false);
    } catch (error) {
      setError('Erro ao excluir o tipo de estabelecimento.');
    }
  };

  const handleUpdate = async () => {
    if (!editedTypeId) return;
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/${editedTypeId}`, { name: editedTypeName }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchEstablishmentTypes();
      setModalOpen(false);
      setEditedTypeId(null);
      setEditedTypeName('');
    } catch (error) {
      setError('Erro ao atualizar o tipo de estabelecimento.');
    }
  };

  const handleAddNewType = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(API_URL, { name: newTypeName }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchEstablishmentTypes();
      setNewTypeName('');
      setModalOpen(false);
    } catch (error) {
      setError('Erro ao adicionar o tipo de estabelecimento.');
    }
  };

  const openModalToAdd = () => {
    setEditedTypeId(null);
    setNewTypeName('');
    setModalOpen(true);
  };

  const openModalToEdit = (typeId: number, typeName: string) => {
    setEditedTypeId(typeId);
    setEditedTypeName(typeName);
    setModalOpen(true);
  };

  const filteredTypes = establishmentTypes.filter(type =>
    type.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const Pagination = () => (
    <div className="flex justify-center mt-4 space-x-2">
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index}
          onClick={() => paginate(index + 1)}
          className={`cursor-pointer px-5 py-3 rounded-full inline-flex items-center justify-center rounded-full 
                ${currentPage === index + 1 ? 'font-bold bg-green-600 text-white' : 'bg-gray-300 text-gray-800'}`}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );

  const handleTypeClick = (typeId: number) => {
    setSelectedTypeId(typeId);
  };

  return (
    <Container>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Tipos de Estabelecimento</h1>
        <Pagination />
        <div>
          <button
            onClick={openModalToAdd}
            className="flex justify-center bg-green-600 text-white rounded-full px-6 py-3 mt-4"
          >
            Adicionar Tipo de Estabelecimento
          </button>
          <br />
        </div>
        <input
          className="border border-gray-300 shadow p-2 rounded-lg mb-4 w-full"
          type="text"
          placeholder="Buscar..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {loading ? (
          <p>Carregando...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <ul>
              {filteredTypes.map((type) => (
                <li 
                  key={type.id} 
                  className={`bg-green-100 border border-green-400 text-green-800 rounded-md p-4 mb-4 flex justify-between items-center ${
                    selectedTypeId === type.id ? 'bg-green-200' : ''
                  }`}
                  onClick={() => handleTypeClick(type.id)}
                >
                  <span className='font-bold'>{type.name}</span>
                  {selectedTypeId === type.id && (
                    <div className="flex">
                       <Link
                        to={`/lista-lote-admin/${type.id}`}
                        className="bg-green-600 text-white rounded-full px-4 py-2"
                      >
                        Gerenciar Lotes
                      </Link>
                      <span>&nbsp;&nbsp;</span>
                      <Link
                        to={`/lista-estabelecimento-admin/${type.id}`}
                        className="bg-green-600 text-white rounded-full px-4 py-2"
                      >
                        Gerenciar Estabelecimentos
                      </Link>
                      <Link
                        to={`/lista-produto-admin/${type.id}`}
                        className="bg-green-600 text-white rounded-full px-4 py-2 ml-2"
                      >
                        Gerenciar Produtos
                      </Link>
                    </div>
                  )}
                  <div className="flex">
                    <button
                      onClick={() => openModalToEdit(type.id, type.name)}
                      className="flex items-center justify-center bg-blue-500 rounded-full w-10 h-10 text-white text-2xl hover:bg-blue-600 mr-2"
                    >
                      <FaPencilAlt />
                    </button>
                    <button
                      onClick={() => handleDelete(type)}
                      className="flex items-center justify-center bg-red-500 rounded-full w-10 h-10 text-white text-2xl hover:bg-red-600"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <div className="bg-white p-4 rounded-lg">
            <h3 className="mb-4">{editedTypeId ? 'Atualizar Nome do Tipo de Estabelecimento' : 'Novo Tipo de Estabelecimento'}</h3>
            <input
              type="text"
              className="border border-gray-300 shadow p-2 rounded-lg mb-4 w-full"
              placeholder="Nome do Tipo"
              value={editedTypeId ? editedTypeName : newTypeName}
              onChange={(e) => editedTypeId ? setEditedTypeName(e.target.value) : setNewTypeName(e.target.value)}
            />
            <div className="flex justify-center">
              <button
                onClick={editedTypeId ? handleUpdate : handleAddNewType}
                className="mr-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded focus:outline-none focus:ring focus:ring-green-200"
              >
                {editedTypeId ? 'Atualizar' : 'Adicionar'}
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded focus:outline-none focus:ring focus:ring-gray-200"
              >
                Cancelar
              </button>
            </div>
          </div>
        </Modal>
        {deleteModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded-lg">
              <p className="mb-4">Tem certeza que deseja excluir o tipo de estabelecimento "{typeToDelete?.name}"?</p>
              <div className="flex justify-center">
                <button onClick={confirmDelete} className="mr-4 bg-red-500 text-white px-4 py-2 rounded-md">Confirmar</button>
                <button onClick={() => setDeleteModalOpen(false)} className="bg-gray-300 px-4 py-2 rounded-md">Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}
