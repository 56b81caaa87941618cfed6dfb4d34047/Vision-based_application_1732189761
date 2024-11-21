import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white p-8 w-full h-full bg-cover bg-center" style={{backgroundImage: 'url("https://raw.githubusercontent.com/56b81caaa87941618cfed6dfb4d34047/Vision-based_application_1732189761/main/src/assets/images/6a634b365ca34fc7995a23d039ebb5c4.jpeg")'}}> {/* Full width and height with background image */}
      <div className="container mx-auto h-full">
        <div className="flex flex-wrap justify-between h-full">
          
          {/* FOOTER COPY */}
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-xl font-bold mb-2">VisioTech</h3>
            <p className="text-gray-400">© 2023 VisioTech. Enhancing vision, empowering lives.</p>
          </div>

          {/* SOCIALS */}
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h4 className="text-lg font-semibold mb-2">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">Facebook</a>
              <a href="#" className="text-gray-400 hover:text-white">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-white">Instagram</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export { Footer as component };