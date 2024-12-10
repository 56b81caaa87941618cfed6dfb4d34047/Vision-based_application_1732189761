import React from 'react';

const Footer: React.FC = () => {
  const [option1, setOption1] = React.useState<'A' | 'B'>('A');
  const [option2, setOption2] = React.useState<'A' | 'B'>('A');

  const calculateScore = (): number => {
    let score = 0;
    if (option1 === 'A') score += 1;
    if (option2 === 'A') score += 1;
    return score;
  };

  return (
    <>
      <footer className="bg-gray-800 text-white p-8 w-full h-full bg-cover bg-center" style={{backgroundImage: 'url("https://raw.githubusercontent.com/56b81caaa87941618cfed6dfb4d34047/Vision-based_application_1732189761/main/src/assets/images/6a634b365ca34fc7995a23d039ebb5c4.jpeg")'}}> {/* Full width and height with background image */}
        <div className="container mx-auto h-full">
          <div className="flex flex-wrap justify-between h-full">
            
            {/* FOOTER COPY */}
            <div className="w-full md:w-1/4 mb-6 md:mb-0">
            
            {/* FOOTER COPY */}
            <div className="w-full md:w-1/3 mb-6 md:mb-0">
              <h3 className="text-xl font-bold mb-2">WT</h3>
              <p className="text-gray-400">© 2023 VisioTech. Enhancing vision, empowering lives.</p>
            </div>

            {/* WAT COPY */}
            <div className="w-full md:w-1/4 mb-6 md:mb-0">
              <h3 className="text-xl font-bold mb-2">WAT</h3>
              <p className="text-gray-400">WAT: We Are Tech. Innovating for a brighter future.</p>
            </div>

            {/* WWW COPY */}
            <div className="w-full md:w-1/4 mb-6 md:mb-0">
              <h3 className="text-xl font-bold mb-2">WWW</h3>
              <p className="text-gray-400">WWW: World Wide Web. Connecting people globally.</p>
            </div>

            {/* RRR COPY */}
            <div className="w-full md:w-1/4 mb-6 md:mb-0">
              <h3 className="text-xl font-bold mb-2">RRR</h3>
              <p className="text-gray-400">RRR: Revolutionize, Redefine, Reinvent. Pushing boundaries in tech.</p>
            </div>

            {/* SOCIALS */}

            {/* SOCIALS */}

            {/* SOCIALS */}
            <div className="w-full md:w-1/4 mb-6 md:mb-0">
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
      <div className="bg-gray-100 p-5 rounded-lg shadow-md mt-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Score Calculator</h2>
        <div className="flex flex-col space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Option 1:</label>
            <div className="flex space-x-4">
              <button
                onClick={() => setOption1('A')}
                className={`px-4 py-2 rounded ${option1 === 'A' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                A
              </button>
              <button
                onClick={() => setOption1('B')}
                className={`px-4 py-2 rounded ${option1 === 'B' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                B
              </button>
            </div>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Option 2:</label>
            <div className="flex space-x-4">
              <button
                onClick={() => setOption2('A')}
                className={`px-4 py-2 rounded ${option2 === 'A' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                A
              </button>
              <button
                onClick={() => setOption2('B')}
                className={`px-4 py-2 rounded ${option2 === 'B' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                B
              </button>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xl font-semibold">
              Your Score: <span className="text-blue-600">{calculateScore()}</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export { Footer as component };