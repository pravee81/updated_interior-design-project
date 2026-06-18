import React, { useEffect, useState, useRef } from 'react';

const services = [
  { id: 1, title: 'Full Home Interiors', image: 'https://www.orientbell.com/blog/wp-content/uploads/2024/03/850x450-Pix_16-2.jpg' },
  { id: 2, title: 'Modular Wardrobes', image: 'https://d28pk2nlhhgcne.cloudfront.net/assets/app/uploads/sites/3/2021/11/living-room-decoration-720x533.jpg' },
  { id: 3, title: 'Furniture', image: 'https://www.decorpot.com/images/1510358626main%20(4).jpg' },
  { id: 4, title: 'Design 4', image: 'https://talatiandpartners.com/wp-content/uploads/2022/01/TRENDS-1.webp' },
  { id: 5, title: 'Design 5', image: 'https://5.imimg.com/data5/SELLER/Default/2022/5/HV/ZZ/LI/106321217/luxury-bedroom-interior-design-service.jpg' },
  { id: 6, title: 'Design 6', image: 'https://5.imimg.com/data5/SELLER/Default/2022/3/ZT/UR/FV/149749854/luxury-bedroom-interior-500x500.jpg' },
];

export default function Services() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % services.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white text-gray-800" style={{ fontFamily: "'Poppins', sans-serif" }}>

      {/* Hero Section */}
      <div className="relative h-screen bg-cover bg-center" style={{ backgroundImage: `url(${services[currentIndex].image})` }}>
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-center p-16">
          <div className="text-white">
            <h1 className="text-5xl font-bold mb-4">Transform Your Space</h1>
            <p className="text-lg mb-6">Book a free consultation and start your journey towards a beautiful home!</p>
            <button className="bg-coral text-white px-6 py-3 rounded-full hover:bg-coral/80">Book a Free Consultation</button>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-brown-600 text-pink py-16 px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-6">Why Choose Our Site Services for Your Home?</h2>
          <p className="text-xl mb-4">We offer the following benefits:</p>
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-6 mb-12">
          <div className="w-full md:w-1/3 text-center px-4 py-6 bg-blue text-purple-800 shadow-lg rounded-md">
            <h3 className="text-xl font-semibold mb-4">Quality & Workmanship</h3>
            <ul className="list-inside text-sm space-y-2">
              <li>False ceiling services at an unbeatable price</li>
              <li>High-quality materials used for a luxurious home</li>
              <li>Top-notch workmanship</li>
            </ul>
          </div>

          <div className="w-full md:w-1/3 text-center px-4 py-6 bg-white text-purple-800 shadow-lg rounded-md">
            <h3 className="text-xl font-semibold mb-4">Service Guarantees</h3>
            <ul className="list-inside text-sm space-y-2">
              <li>1-year warranty on services</li>
              <li>Seamless project planning & management</li>
              <li>Real-time project updates</li>
            </ul>
          </div>

          <div className="w-full md:w-1/3 text-center px-4 py-6 bg-white text-purple-800 shadow-lg rounded-md">
            <h3 className="text-xl font-semibold mb-4">Transparency & Quality</h3>
            <ul className="list-inside text-sm space-y-2">
              <li>Transparency on quality and no hidden charges</li>
              <li>Superior quality at every step</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Slider */}
      <div className="relative py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Our Design Portfolio</h2>
        <div className="overflow-hidden relative">
          <div
            className="flex transition-all duration-1000 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            ref={scrollRef}
          >
            {services.map((service) => (
              <div key={service.id} className="min-w-full">
                <img src={service.image} alt={service.title} className="w-full h-[400px] object-cover" />
              </div>
            ))}
          </div>

          {/* Controls */}
          <button
            className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow-lg"
            onClick={() => setCurrentIndex((prevIndex) => (prevIndex - 1 + services.length) % services.length)}
          >
            &#10094;
          </button>
          <button
            className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow-lg"
            onClick={() => setCurrentIndex((prevIndex) => (prevIndex + 1) % services.length)}
          >
            &#10095;
          </button>
        </div>
      </div>
    </div>
  );
}
