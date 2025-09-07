const Footer = () => {
  return (
    <div className="bottom-0 w-full p-4 place-items-center bg-white">
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
                    <h1
                        className="text-m"
                    >
                        Copyright © 2025 Omar Tóbon. Todos los derechos reservados | <a
                            className="text-blue-600 underline hover:text-blue-800 font-bold"
                            href="https://omartobon.com"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                          https://www.omartobon.com
                        </a> | Teléfono / WhatsApp: <a
                            className="text-blue-600 underline hover:text-blue-800 font-bold"
                            title="OTO Visual Flow on Whatsapp"
                            aria-label="OTO Visual Flow on Whatsapp"
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://wa.me/573135600347"
                        >
                            +57 313-560-0347
                        </a>
                    </h1>
            </div>
        </div>
    </div>
  );
};

export default Footer;