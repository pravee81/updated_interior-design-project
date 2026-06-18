import React, { useEffect, useRef, useState } from 'react';

const heroImages = [
  'https://www.asenseinterior.com/assets/uploads/00c00b862b5a04ce70158ac6f91ee8f1.jpg',
  'https://centuryply.com/blogimage/bedroom_1.png',
  'https://5.imimg.com/data5/SELLER/Default/2022/12/DI/WX/PB/46611623/home-interior-design.jpg',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVCV7-FQGsj45s9Y5W6W0eb07cJQP8_2KsGA&s',
  'https://i.pinimg.com/736x/c6/b9/98/c6b998827968834bdaec1cdf1bc6f097.jpg',
  'https://interiosplash.com/wp-content/uploads/2024/10/Swapnas-Residence-21.webp',
];

const galleryImages = [
  { id: 1, title: 'Full Home Interiors', image: 'https://images.pexels.com/photos/3316924/pexels-photo-3316924.jpeg?cs=srgb&dl=pexels-jonathanborba-3316924.jpg&fm=jpg' },
  { id: 2, title: 'Modular Wardrobes', image: 'https://static.asianpaints.com/content/dam/asian_paints/services/beautiful-homes-service-webp-images/bhs-new-page-new-images/home-decor-solutions/modular-wardrobes-desktop.webp' },
  { id: 3, title: 'Furniture', image: 'https://static.asianpaints.com/content/dam/asian_paints/services/beautiful-homes-service-webp-images/bhs-new-page-new-images/categories-we-offer/furniture/furniture-one.webp' },
  { id: 4, title: 'Design 4', image: 'https://images5.alphacoders.com/134/1347174.png' },
  { id: 5, title: 'Design 5', image: 'https://w0.peakpx.com/wallpaper/117/421/HD-wallpaper-living-room-modern-interior-design-stylish-interior-design-of-the-living-room-gray-green-living-room-luxurious-interiors.jpg' },
  { id: 6, title: 'Design 6', image: 'https://i.pinimg.com/736x/27/9f/45/279f45bff6602c6315bbc470234aba11.jpg' },
];

export default function Home() {
  const [currentHero, setCurrentHero] = useState(0);
  const galleryRef = useRef(null);

  // Hero Section - Auto Slide Every 3 Seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Gallery Slider - Auto Horizontal Scroll Every 1 Second
  useEffect(() => {
    const interval = setInterval(() => {
      if (galleryRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = galleryRef.current;
        const nextScroll = scrollLeft + 1;

        if (scrollLeft + clientWidth >= scrollWidth) {
          galleryRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          galleryRef.current.scrollTo({ left: nextScroll, behavior: 'smooth' });
        }
      }
    }, 20); // smoother continuous scroll (adjust speed)

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white text-gray-800 px-0">
      {/* Hero Section Slider */}
      <div className="relative h-screen overflow-hidden">
        <img
          src={heroImages[currentHero]}
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center p-16">
          <div className="text-white text-center">
            <h2 className="text-6xl font-bold mb-4 hover:text-orange-400 transition-colors duration-300">
              Designing your own home
            </h2>
          </div>
        </div>
      </div>

      {/* Auto Scrolling Horizontal Gallery */}
      <div className="py-12 px-8 relative">
        <div className="flex justify-center items-center mb-6">
          <h2 className="text-3xl font-bold">Designs</h2>
        </div>
        <div
          ref={galleryRef}
          className="flex overflow-x-auto space-x-4 p-4 scrollbar-hide scroll-smooth"
        >
          {galleryImages.map((image) => (
            <div key={image.id} className="min-w-[300px] md:min-w-[400px] rounded-lg shadow-lg overflow-hidden relative group">
              <img src={image.image} alt={image.title} className="w-full h-96 object-cover transition-transform duration-300 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                <button className="bg-white text-black px-6 py-3 rounded-full font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Book Free Visit Site
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Second Hero-like Section */}
      <div className="relative h-screen overflow-hidden">
        <img
          src="https://img.freepik.com/free-photo/armchair-green-living-room-with-copy-space_43614-910.jpg"
          alt="Luxury interior design"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center p-16">
          <div className="w-1/2 text-white p-8">
            <h2 className="text-4xl font-bold mb-4">
              The custom-made wall panels from the Stars collection, finished in burnished copper, cover the interiors of the villa from floor to ceiling.
            </h2>
          </div>
          <div className="w-1/2 text-white p-8 space-y-4">
            <p className="text-xl">Project by Ankitha, Chandrika, Priyanka</p>
            <p>
              The project focuses on developing a modern villa design that ensures comfort, efficient space utilization, and a well-structured layout for better living.
            </p>
          </div>
        </div>
      </div>

      {/* Extraordinary Projects Section */}
      <div className="bg-black text-white p-12 flex justify-between items-center my-12">
        <div className="w-1/2 pr-8">
          <h3 className="text-4xl font-bold mb-4">Extraordinary Projects</h3>
          <p className="mb-6 text-gray-300">
            Discover the made-to-measure projects created by Laurameroni in collaboration with the most prestigious studios and professionals in the interior design and architecture field.
          </p>
          <button className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-200">
            Download catalogue
          </button>
        </div>
        <div className="w-1/2">
          <img
            src="https://media.istockphoto.com/id/1226856019/photo/talking-designer-and-client.jpg?s=612x612&w=0&k=20&c=i84SXIb7Ifmjik1gFF5E9NGbds4xlCKd_JQGbdN0msQ="
            alt="Extraordinary project"
            className="w-full h-[400px] object-cover rounded-lg shadow-lg"
          />
        </div>
      </div>

      {/* Contact Us Section */}
      <div className="text-center py-16">
        <button className="bg-black text-white px-8 py-4 rounded-full text-xl font-bold hover:bg-gray-800">
          Contact Us
        </button>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 text-gray-600 py-12 px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-semibold text-lg text-gray-800 mb-4">Info & Media</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline">Catalogues</a></li>
              <li><a href="#" className="hover:underline">Projects</a></li>
              <li><a href="#" className="hover:underline">Materials</a></li>
              <li><a href="#" className="hover:underline">CAD Files</a></li>
              <li><a href="#" className="hover:underline">Where to buy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg text-gray-800 mb-4">Systems</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline">Kitchens</a></li>
              <li><a href="#" className="hover:underline">Day Systems</a></li>
              <li><a href="#" className="hover:underline">Night Systems</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg text-gray-800 mb-4">Architecture</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline">Wall Panels</a></li>
              <li><a href="#" className="hover:underline">Hinged Doors</a></li>
              <li><a href="#" className="hover:underline">Sliding Doors</a></li>
              <li><a href="#" className="hover:underline">Pivot Doors</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg text-gray-800 mb-4">Complements</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline">SideBoards</a></li>
              <li><a href="#" className="hover:underline">Consoles</a></li>
              <li><a href="#" className="hover:underline">Sofas</a></li>
              <li><a href="#" className="hover:underline">Low Tables</a></li>
              <li><a href="#" className="hover:underline">Chairs & Tools</a></li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-12 text-gray-400">
          <p>© {new Date().getFullYear()} Famil Home. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
