import logo from "../assets/logo-oto-visual-flow.png";

const Header = () => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
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
                Customer Success Audit Gratuito
            </h1>
        </a>
      </div>
    </div>
  );
};

export default Header;