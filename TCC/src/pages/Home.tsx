import "flowbite";
import { Flowbite } from "flowbite-react";
import useTableUserContext from "../hooks/useTableUserContext";
import Banner from "../assets/images/Banner.png";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user } = useTableUserContext();
  const navigate = useNavigate();

  const handleClick = () => {
    if (user) {
      navigate('/servicos')
    } else {
      navigate('/login')
    }
  }
  


  return (
    <>
      <Flowbite>
        {user && (
            <div className="mx-10">
              <div className="flex flex-row mt-10">
                <p className="pt-5 text-6xl font-medium">Bem-Vindo,</p>{" "}
                <p className="pt-5 ml-4 text-6xl font-bold text-primary-default">
                  {user?.name}!
                </p>
              </div>
              <div className="h-0.5 mt-3 mb-10 w-auto bg-primary-default" />
            </div>
          )}
        <div className=" h-1/2 mt-8 bg bg-white dark:bg-slate-900">
          <div className="relative flex flex-col bg-gray-200 mx-auto rounded-xl w-full h-full shadow-xl">
            <img className="absolute w-full h-full object-cover" src={Banner}/>
            <div className="w-1/2 z-10 text-7xl hover:scale-105 duration-300 ml-10 text-shadow-xl">
              <h1 className="text-white pt-5 font-medium z-10 ml-10"> Aqui temos </h1>
              <h1 className="text-white font-medium z-10 ml-10"> o que {<p className="text-purple-950 inline font-bold">você</p>} precisa! </h1>
            </div>
            <button className="bg-primary-light w-1/4 h-16 rounded-full text-white text-2xl font-semibold shadow-md hover:shadow-xl hover:scale-105 hover:bg-primary-default duration-300 z-10 ml-20 mt-10" onClick={handleClick}>Comece agora!</button>
          </div>
        </div>


        {user && (
        <div className="bg-transparent mt-20 mx-5 p-5 border-2 border-primary-default border-dotted rounded-xl">
          <h1 className="relative inline-block group text-4xl font-bold text-primary-dark mb-5">
          Como eu começo?
            <span
              className="absolute left-0 bottom-0 h-[3px] w-0 bg-primary-default transition-all duration-300 group-hover:w-full"
            ></span>
          </h1>
          <p className="font-semibold text-2xl">Você pode começar editando suas informações na {<a className="inline text-primary-light hover:text-primary-default" href={`/usuario/${user?.uid}`}>Página de Usuário</a>}, ou você pode já procurar por algum serviço na {<a className="inline text-primary-light hover:text-primary-default" href={`/servicos`}>Página de Serviços</a>}!</p>
          <p className="font-semibold text-2xl">{<p className="inline font-bold">Obs:</p>} Para que você consiga requisitar um serviço, é necessário anteriormente que insira um e-mail de contato, e a cidade onde mora na {<a className="inline text-primary-light hover:text-primary-default" href={`/usuario/${user?.uid}`}>Página de Usuário</a>}.</p>
        </div>
        )}

        <hr className="w-full mr-10 h-1 my-10 bg-gray-200"/>

        <div className="mx-10">
          <h1 className="relative inline-block group text-4xl font-bold text-primary-dark mb-5">
          O que é o WorkSpace?
            <span
              className="absolute left-0 bottom-0 h-[3px] w-0 bg-primary-default transition-all duration-300 group-hover:w-full"
            ></span>
          </h1>
          <p className="font-semibold text-2xl">Bem-vindo ao Workspace, a sua plataforma confiável para conectar prestadores de serviços e clientes de forma simples, segura e eficiente. Aqui, acreditamos no poder da colaboração e na importância de criar oportunidades para profissionais e empresas alcançarem seus objetivos juntos.</p>
        </div>

        <hr className="w-full mr-10 h-1 my-10 bg-gray-200"/>

        <div className="mx-10">
          <h1 className="relative inline-block group text-4xl font-bold text-primary-dark mb-5">
          Como nasceu o Workspace?
            <span
              className="absolute left-0 bottom-0 h-[3px] w-0 bg-primary-default transition-all duration-300 group-hover:w-full"
            ></span>
          </h1>
          <p className="font-semibold text-2xl">O Workspace surgiu da vontade de conectar pessoas de maneira mais eficiente e confiável. Tudo começou quando percebemos uma dificuldade comum: tanto profissionais quanto clientes enfrentavam desafios para encontrar parcerias ideais para seus projetos. Faltava um espaço onde ambas as partes pudessem se encontrar de forma rápida, segura e com a garantia de qualidade.</p>
        </div>
        <div className="h-12"/>
      </Flowbite>
    </>
  );
};

export default Home;
