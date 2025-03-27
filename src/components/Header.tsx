import Settings from "./Settings";

const Header = () => {
  return (
    <header className="flex justify-between items-center mb-2">
      <h1 className="text-2xl font-bold">Google Sheets Cell Extractor</h1>
      <Settings />
    </header>
  );
};

export default Header;
