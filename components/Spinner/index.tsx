function Spinner() {
  return (
    <div className="fixed top-0 right-0 bottom-0 left-0 z-[9000] backdrop-blur-lg  flex justify-center items-center">
      <div className="w-16 h-16 border-8 rounded-[50%] animate-spin border-solid border-t-primary-green border-b-primary-green  border-l-transparent border-r-transparent"></div>
    </div>
  );
}

export default Spinner;
