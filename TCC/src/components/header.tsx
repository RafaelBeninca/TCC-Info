import { signOut } from "firebase/auth";
import { useContext, useEffect, useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import logo from "../assets/images/Logo.png";
import blankpfp from "../assets/images/blankpfp.jpg";
import { FirebaseAuthContext } from "../contexts/AuthenticationProvider/FirebaseAuthContext";
import { auth } from "../contexts/firebase/firebaseConfig";
import useTableUserContext from "../hooks/useTableUserContext";

const Header = () => {
  const { user } = useTableUserContext();
  const context = useContext(FirebaseAuthContext);

  if (!context) {
    throw new Error("FirebaseAuthContext must be used within a FirebaseAuthContextProvider");
  }


  const {dispatch} = context;

  const [dropdownIsOpen, setDropdownIsOpen] = useState<boolean>(false);

  const dropRef = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = () => {
    setDropdownIsOpen(!dropdownIsOpen);
  };

  const handleClicksOutside = (event: MouseEvent) => {
    if (dropRef.current && !dropRef.current.contains(event.target as Node)) {
      setDropdownIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClicksOutside);
    return () => {
      document.addEventListener("mousedown", handleClicksOutside);
    };
  }, []);

  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        dispatch({
          type: "LOGOUT",
        });
        console.log("Deslogado com sucesso!");
        navigate("/login");
        toggleDropdown();
      })
      .catch((error) => console.log(error));
  };

  return (
    <>
      <nav className="bg-white border-gray-200 dark:bg-gray-900 border-b-2 shadow-lg">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a
            href="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <div className="flex flex-row transform hover:scale-105 transition-transform duration-300">
              <img src={logo} className="h-11 mr-1" alt="Flowbite Logo" />
              <p className="mt-1.5">
                <span className="self-center text-4xl font-semibold whitespace-nowrap text-primary-dark">
                  Work
                </span>
                <span className="self-center text-2xl font-semibold whitespace-nowrap text-primary-light">
                  Space
                </span>
              </p>
            </div>
          </a>
          <div className="hidden w-full md:block md:w-auto" id="navbar-default">
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <a
                  href="/servicos"
                  className="block py-2 px-3 text-gray-900 md:hover:bg-transparent transform hover:scale-105 hover:bg-gray-100 hover:text-primary-dark transition-transform duration-300"
                  aria-current="page"
                >
                  Serviços
                </a>
              </li>
              <li>
                <a
                  href="/login"
                  className="block py-2 px-3 text-gray-900 md:hover:bg-transparent transform hover:scale-105 hover:bg-gray-100 hover:text-primary-dark transition-transform duration-300"
                >
                  Login
                </a>
              </li>
            </ul>
          </div>
          <div ref={dropRef}>
            <button
              onClick={toggleDropdown}
              id="dropdownDefaultButton"
              data-dropdown-toggle="dropdown"
              className="flex items-center space-x-3 rtl:space-x-reverse hover:scale-105 transition-transform duration-300"
              type="button"
            >
              <img
                className="w-10 h-10 rounded-full object-cover"
                src={user?.profilePicture ? user.profilePicture : blankpfp}
                alt="Profile"
              />
              <p className="block text-gray-900 md:hover:bg-transparent transform hover:scale-105 hover:bg-gray-100 hover:text-primary-light font-bold">
                {user ? user.name : "Sem conta"}
              </p>
            </button>
            {dropdownIsOpen && (
              <div className="absolute bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="py-1">
                  {user ? (
                    <>
                      <a href={`/usuario/${user.uid}`} className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <svg
                          className="w-6 h-6 mr-3 text-gray-800 dark:text-white"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M12 20a7.966 7.966 0 0 1-5.002-1.756l.002.001v-.683c0-1.794 1.492-3.25 3.333-3.25h3.334c1.84 0 3.333 1.456 3.333 3.25v.683A7.966 7.966 0 0 1 12 20ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10c0 5.5-4.44 9.963-9.932 10h-.138C6.438 21.962 2 17.5 2 12Zm10-5c-1.84 0-3.333 1.455-3.333 3.25S10.159 13.5 12 13.5c1.84 0 3.333-1.455 3.333-3.25S13.841 7 12 7Z"
                            clip-rule="evenodd"
                          />
                        </svg>
                        Usuário
                      </a>
                      <button
                        onClick={handleLogout}
                        className="flex px-4 py-2 w-full text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <svg
                          className="w-6 h-6 mr-3 text-gray-800 dark:text-white"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M20 12H8m12 0-4 4m4-4-4-4M9 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h2"
                          />
                        </svg>
                        Sair
                      </button>{" "}
                    </>
                  ) : (
                    <a
                      href="/login"
                      className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <svg
                        className="w-6 h-6 mr-3 text-gray-800 dark:text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 12H4m12 0-4 4m4-4-4-4m3-4h2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-2"
                        />
                      </svg>
                      Login
                    </a>
                  )}
                </div>
              </div>
            )}
            <div
              id="dropdown"
              className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
            ></div>
          </div>
        </div>
      </nav>
      <Outlet />
    </>
  );
};

export default Header;
