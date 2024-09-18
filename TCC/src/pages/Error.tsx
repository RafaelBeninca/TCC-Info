const Error = () => {
  return (
    <div className="flex flex-row">
      <svg
        className="w-[48px] h-[48px] mr-6  text-red-600"
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
          strokeWidth="2.3"
          d="M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
      <p className="text-red-600 text-4xl">Página não encontrada!</p>
    </div>
  );
};

export default Error;
