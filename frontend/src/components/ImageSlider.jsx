import React from 'react'
import Slider from 'react-slick'

export default function ImageSlider({images}){
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    autoplay: true,
    autoplaySpeed: 4000
  }
  return (
    <div className="rounded-xl overflow-hidden shadow-lg bg-white">
      <Slider {...settings}>
        {images.map((img,i)=>(
          <div key={i} className="relative">
            <img src={img.image} alt={img.title} className="w-full h-96 object-cover transform hover:scale-105 transition" />
            <div className="absolute bottom-6 left-6 bg-white/80 rounded-md p-3">
              <h3 className="font-semibold">{img.title}</h3>
              <p className="text-sm text-gray-600">{img.description}</p>
              <div className="mt-2 flex gap-2">
                <button className="bg-coral text-white px-3 py-2 rounded">Book Free Site Visit</button>
                <button className="bg-green-500 text-white px-3 py-2 rounded" onClick={()=>{
                  // client-side add to cart will call API in pages
                  const ev = new CustomEvent('addToCart', {detail:{designId: img.id, title: img.title, price: img.price, image: img.image}})
                  window.dispatchEvent(ev)
                }}>Add to Cart</button>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  )
}
