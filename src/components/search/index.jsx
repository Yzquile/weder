import searchIcon from "../../img/search.svg";

export default function Search({ search, setSearch, handleSearch, inputError }) {
const handleKeyPress = (event) => {
  event.key === "Enter" && handleSearch();
}

  return (
    <div className="relative flex justify-center text-center w-full p-2 mb-8">
      <div className="absolute flex justify-end">
        <input
          type="text"
          name="search"
          placeholder="Search City..."
          className="my-5 py-3 px-5 border-solid rounded border-white border-b w-80 focus:shadow-outline placeholder-white bg-transparent"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          onKeyPress={handleKeyPress}
          required
          />
         
        <img
          src={searchIcon}
          alt=""
          className="absolute m-auto mt-7 h-6 w-6 cursor-pointer mr-2"
          onClick={handleSearch}
        />
      {inputError && <div style={{color: "red", position: "absolute", display: "flex", justifyContent: "center", borderRadius: "10px", width: "100%", backgroundColor: "white", }}>{inputError}</div>}
      </div>
    </div>
  );
}
