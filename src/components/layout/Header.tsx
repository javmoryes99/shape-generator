import Theme from "./Theme";

function Header() {
  return (
    <header className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 shadow">
      <div className="flex items-center space-x-4 ml-auto">
        <Theme />
      </div>
    </header>
  );
}

export default Header;
