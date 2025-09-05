import logo from "../assets/logo-oto-visual-flow-horizontal.png";

const Header = () => {
  return (
    <div className="flex justify-between items-center mt-1 mb-1 p-1">
      <div className="flex items-center gap-4">
        <a href="https://omartobon.com" target="_blank">
          <img
            src={logo}
            alt="Logo OTO Visual Flow"
            className="w-30"
            />
        </a>
        <a href="https://omartobon.com" target="_blank">
            <h1
                className="text-2xl font-bold"
            >
                Su mejor aliado para optimizar su Customer Success
            </h1>
        </a>
      </div>
    </div>
  );
};

export default Header;