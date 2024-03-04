import { createBrowserRouter } from "react-router-dom";
import { Login } from "./pages/login";
import { Produto } from "./pages/pagesUser/produto";
import { Estabelecimento } from "./pages/pagesUser/estabelecimento";
import { TipoEstabelecimento } from "./pages/pagesUser/tipoEstabelecimento";

import { AddEstabelecimento } from "./pages/pagesAdmin/addEstabelecimento";
import { AddLote } from "./pages/pagesAdmin/addLote";
import { AddProduto } from "./pages/pagesAdmin/addProduto";
import { AddUser } from "./pages/pagesAdmin/addUser";
import { Perfil } from "./pages/pagesAdmin/perfil";
import { AdminOnly } from "./routes/AdminOnly";

import { Layout } from "./components/layout";
import { ListaUser } from "./pages/pagesAdmin/perfil/listaUser";
import { ListaTipoEstabelecimento } from "./pages/pagesAdmin/perfil/listaTipoEstabelecimento";
import { ListaLote } from "./pages/pagesAdmin/perfil/listaTipoEstabelecimento/listaLote";
import { ListaProduto } from "./pages/pagesAdmin/perfil/listaTipoEstabelecimento/listaProduto";
import { Private } from "./routes/Private";
import { ListaEstabelecimento } from "./pages/pagesAdmin/perfil/listaTipoEstabelecimento/listaEstabelecimento";
import { ListaLoteUser } from "./pages/pagesUser/lote";
import { AddPreco } from "./pages/pagesUser/addPreco";
import { AddPermissoes } from "./pages/pagesAdmin/addPermissoes";
import { ListaPermissoes } from "./pages/pagesAdmin/perfil/listaTipoEstabelecimento/listaPermissoes";
import { ListaHistorico } from "./pages/pagesAdmin/perfil/listaTipoEstabelecimento/listaProduto/listaHistorico";


const router = createBrowserRouter([
  {
    element: <Layout/>,
    children: [
      {
        path: "/tipo-estabelecimento",
        element: <Private><TipoEstabelecimento/></Private>
      },
      {
        path: "/estabelecimento/:typeId/:batchId",
        element: <Private><Estabelecimento/></Private>
      },
      {
        path: "/lista-lote/:typeId",
        element: <Private><ListaLoteUser/></Private>
      },
      {
        path: "/produto/:typeId/:batchId/:stablishmentId",
        element: <Private><Produto/></Private>
      },
      {
        path: "/add-preco/:typeId/:batchId/:stablishmentId/:productId/:productName",
        element: <Private><AddPreco/></Private>
      },
      {
        path: "/add-estabelecimento",
        element: <AdminOnly><AddEstabelecimento/></AdminOnly>
      },
      {
        path: "/add-lote",
        element: <AdminOnly><AddLote/></AdminOnly>
      },
      {
        path: "/add-produto",
        element: <AddProduto/>
      },
      {
        path: "/add-user",
        element: <AdminOnly><AddUser/></AdminOnly>
      },
      {
        path: "/add-permissoes/:typeId/:stablishmentName/:stablishmentId",
        element: <AdminOnly><AddPermissoes/></AdminOnly>
      },
      {
        path: "/perfil",
        element: <AdminOnly><Perfil/></AdminOnly>
      },
      {
        path: "/lista-user-admin",
        element: <AdminOnly><ListaUser/></AdminOnly>
      },
      {
        path: "/lista-lote-admin/:typeId",
        element: <AdminOnly><ListaLote/></AdminOnly>
      },
      {
        path: "/lista-tipo-estabelecimento-admin",
        element: <AdminOnly><ListaTipoEstabelecimento/></AdminOnly>
      },
      {
        path: "/lista-estabelecimento-admin/:typeId",
        element: <AdminOnly><ListaEstabelecimento/></AdminOnly>
      },
      {
        path: "/lista-produto-admin/:typeId",
        element: <AdminOnly><ListaProduto/></AdminOnly>
      },
      {
        path: "/lista-historico-admin/:typeId/:productId/:productName",
        element: <AdminOnly><ListaHistorico/></AdminOnly>
      },
      {
        path: "/lista-permissoes-admin/:typeId/:stablishmentName/:stablishmentId",
        element: <AdminOnly><ListaPermissoes/></AdminOnly>
      },
    ]
  },
  {
    path: "/",
    element: <Login/>
  },
])

export { router };