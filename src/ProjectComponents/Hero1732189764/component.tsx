import React from 'react';

const Hero: React.FC = () => {
  
  return (
    <div className="bg-gradient-to-r from-purple-800 to-indigo-900 py-16 text-white w-full h-full">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center h-full">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <h1 className="text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-300">See the World Through New Eyes</h1>
          <p className="text-xl mb-8 text-gray-300">Revolutionizing eye care with cutting-edge technology and personalized solutions for your vision needs.</p>
          <button className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105">
            <i className='bx bx-glasses-alt mr-2'></i>
            Get Started
          </button>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Vision Score Calculator</h2>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="age">
                Age
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="age" type="number" placeholder="Enter your age" />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="hours">
                Daily Screen Time (hours)
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="hours" type="number" placeholder="Enter daily screen time" />
            </div>
            <button className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out">
              <i className='bx bx-calculator mr-2'></i>
              Calculate Score
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Hero as component }