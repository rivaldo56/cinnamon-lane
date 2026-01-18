import React, { useState } from 'react';

interface HomeProps {
  onNavigateToMenu: () => void;
}

const Home: React.FC<HomeProps> = ({ onNavigateToMenu }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    { question: "Do you accept custom cake orders?", answer: "Absolutely. We offer custom cakes for birthdays, weddings, and special occasions. Please place your order at least 3-5 days in advance." },
    { question: "Do you bake fresh every day?", answer: "Yes! Our ovens start at 4 AM every single morning to ensure every item is warm and fresh when you arrive." },
    { question: "Do you use preservatives or artificial ingredients?", answer: "Never. We believe in clean baking using only high-quality, natural, and organic ingredients." },
    { question: "Can I place an order online?", answer: "Yes, you can order directly through this website or via WhatsApp for larger catering orders." },
    { question: "Do you offer delivery services?", answer: "We deliver within Nairobi via trusted courier partners. Fees are calculated at checkout." }
  ];

  return (
    <div className="relative z-10 bg-cream w-full shadow-[0_-25px_50px_rgba(0,0,0,0.1)]">
      
      {/* --- ABOUT US SECTION --- */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="flex-1 space-y-8">
            <span className="text-xs font-bold tracking-widest uppercase text-coffee/60">About Us</span>
            <h2 className="font-serif text-5xl md:text-6xl text-coffee leading-tight">
              Baking Happiness <span className="italic text-cinnamon block mt-2">Every Day</span>
            </h2>
            <div className="space-y-6 text-stone-600 font-light leading-relaxed text-lg">
              <p>
                At Cinnamon Lane, we believe great baking starts with passion. From early mornings to the final glaze, every product is crafted by hand using carefully selected ingredients. No shortcuts, no preservatives—just honest, delicious baking.
              </p>
              <p>
                Whether you're stopping by for your daily bread or celebrating a special moment, we're here to make it sweeter.
              </p>
            </div>
            <button className="flex items-center gap-2 text-coffee font-medium border-b border-coffee pb-1 hover:text-cinnamon hover:border-cinnamon transition-colors">
              Our Process 
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>
          <div className="flex-1 relative">
             <img 
               src="https://images.pexels.com/photos/5964500/pexels-photo-5964500.jpeg" 
               alt="Bakers kneading dough" 
               className="rounded-lg shadow-2xl w-full h-[600px] object-cover"
             />
             {/* Small overlap image */}
             <div className="hidden md:block absolute -bottom-10 -left-10 w-48 h-48 border-8 border-cream shadow-xl rounded-lg overflow-hidden">
                <img src="https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=400&auto=format&fit=crop" alt="Bread loaf" className="w-full h-full object-cover" />
             </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24 border-t border-stone-200 pt-12">
          {[
            { label: 'Years of Experience', value: '3+' },
            { label: 'Loaves Baked Monthly', value: '5K+' },
            { label: 'Freshly Baked', value: '100%' },
            { label: 'Happy Customers', value: '1K+' }
          ].map((stat, i) => (
            <div key={i} className="text-center md:text-left">
              <h4 className="font-serif text-4xl text-coffee mb-2">{stat.value}</h4>
              <p className="text-xs uppercase tracking-wider text-stone-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- CURATED PACKAGES (TARGET AUDIENCE) --- */}
      <section className="py-20 bg-almond-cream/20">
        <div className="max-w-7xl mx-auto px-6 text-center mb-12">
          <h2 className="font-serif text-4xl text-coffee mb-3">Curated <span className="italic">Packages</span></h2>
          <p className="text-stone-500 max-w-lg mx-auto text-sm">Hand-picked selections designed for your specific needs, from slow mornings to boardroom meetings.</p>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* AUDIENCE 1: THE WEEKEND TREATER */}
          <div className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col border border-stone-100">
            <div className="relative h-48 overflow-hidden">
              <img 
                src="https://i.pinimg.com/736x/dc/4f/16/dc4f16b883e16a0c38cae1627f6c95b0.jpg" 
                alt="Weekend Coffee and Pastry" 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-coffee rounded-sm shadow-sm">
                For You
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col items-start">
               <h3 className="font-serif text-xl font-bold text-coffee mb-2">The Weekend Ritual</h3>
               <p className="text-stone-500 text-sm mb-4 leading-snug">
                 Treat yourself to a slow Sunday. Includes 2 Signature Cinnamon Rolls, 2 Cardamom Knots, and our House Cold Brew blend.
               </p>
               <div className="mt-auto w-full pt-4 border-t border-stone-100 flex justify-between items-center">
                  <span className="font-bold text-base text-coffee">KES 1,200</span>
                  <button onClick={onNavigateToMenu} className="text-cinnamon text-xs font-bold uppercase tracking-widest hover:text-coffee transition-colors">
                    Add to Cart →
                  </button>
               </div>
            </div>
          </div>

          {/* AUDIENCE 2: THE GIFT GIVER */}
          <div className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col border border-stone-100">
            <div className="relative h-48 overflow-hidden">
              <img 
                src="https://i.pinimg.com/736x/49/d3/1a/49d31af269f6d3f656af3c283ff8b4dd.jpg" 
                alt="Beautiful Gift Box" 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute top-3 left-3 bg-cinnamon text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm shadow-sm">
                Best Seller
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col items-start">
               <h3 className="font-serif text-xl font-bold text-coffee mb-2">Signature Gift Box</h3>
               <p className="text-stone-500 text-sm mb-4 leading-snug">
                 The perfect "Thank You." 6 assorted pastries (Sweet & Savory) wrapped in our premium Cinnamon Lane ribbon packaging.
               </p>
               <div className="mt-auto w-full pt-4 border-t border-stone-100 flex justify-between items-center">
                  <span className="font-bold text-base text-coffee">KES 2,400</span>
                  <button onClick={onNavigateToMenu} className="text-cinnamon text-xs font-bold uppercase tracking-widest hover:text-coffee transition-colors">
                    Send Gift →
                  </button>
               </div>
            </div>
          </div>

          {/* AUDIENCE 3: EVENT PLANNER */}
          <div className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col border border-stone-100">
            <div className="relative h-48 overflow-hidden">
              <img 
                src="https://i.pinimg.com/1200x/16/5e/96/165e96a14b0db1b227b18ef8d296268e.jpg" 
                alt="Catering Platter" 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-coffee rounded-sm shadow-sm">
                For The Office
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col items-start">
               <h3 className="font-serif text-xl font-bold text-coffee mb-2">The Boardroom Bundle</h3>
               <p className="text-stone-500 text-sm mb-4 leading-snug">
                 Impress the team. A curated dozen of our finest pastries, halved for sharing. Perfect for morning meetings or team brunches.
               </p>
               <div className="mt-auto w-full pt-4 border-t border-stone-100 flex justify-between items-center">
                  <span className="font-bold text-base text-coffee">KES 4,500</span>
                  <button onClick={onNavigateToMenu} className="text-cinnamon text-xs font-bold uppercase tracking-widest hover:text-coffee transition-colors">
                    Order Catering →
                  </button>
               </div>
            </div>
          </div>

        </div>
      </section>

      {/* --- SIGNATURE MENU HIGHLIGHT --- */}
      <section className="py-24 bg-stone-900 text-cream relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
             <img src="https://images.pexels.com/photos/16637679/pexels-photo-16637679.jpeg" alt="Cinnamon Roll Deluxe" className="rounded-sm shadow-2xl border-4 border-white/10 w-full object-cover" />
             <div className="bg-cream text-coffee p-6 max-w-xs mx-auto -mt-20 relative z-20 shadow-xl text-center">
                <img src="https://images.pexels.com/photos/4993991/pexels-photo-4993991.jpeg" alt="Roll detail" className="w-full h-48 object-cover mb-4" />
                <h4 className="font-serif text-xl">Cinnamon Roll</h4>
             </div>
          </div>
          <div className="flex-1 space-y-6">
             <span className="text-cinnamon tracking-[0.2em] text-sm font-bold uppercase">Signature Menu</span>
             <h2 className="font-serif text-6xl">Cinnamon <br/>Roll <span className="italic font-light">Deluxe</span></h2>
             <p className="text-white/70 text-lg font-light max-w-md leading-relaxed">
               Soft, buttery rolls filled with aromatic Ceylon cinnamon and topped with our signature smooth cream cheese glaze. Warm, gooey, and unforgettable.
             </p>
             <button onClick={onNavigateToMenu} className="mt-8 px-10 py-4 border border-white/30 hover:bg-white hover:text-coffee transition-all text-sm font-bold uppercase tracking-widest">
               Order Now
             </button>
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS --- */}
      <section className="py-24 bg-almond-cream/40">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
           <div className="flex-shrink-0 w-full md:w-1/3">
             <div className="relative aspect-[3/4] rounded-full md:rounded-lg overflow-hidden">
                <img src="https://i.pinimg.com/736x/c2/9a/39/c29a39893c43e7e9a39581d1019eb6a6.jpg" alt="Angel Akinyi" className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 bg-cream w-12 h-12 rounded-full"></div>
             </div>
           </div>
           <div className="flex-1">
              <span className="text-xs font-bold uppercase tracking-widest text-coffee/60 mb-4 block">Testimonials</span>
              <h3 className="font-serif text-3xl md:text-5xl text-coffee leading-tight mb-8">
                "Fresh, delicious, and <span className="italic">beautifully made</span>. I ordered cakes for a family celebration, and everyone loved them. Not too sweet, perfectly balanced, and stunning presentation. <span className="italic font-bold">Will definitely order again.</span>"
              </h3>
              <div>
                <h4 className="font-bold text-coffee text-lg">Angel Lorenza</h4>
                <p className="text-cinnamon text-sm">Influencer</p>
              </div>
              <div className="flex gap-4 mt-8">
                 <button className="w-12 h-12 rounded-full border border-stone-300 flex items-center justify-center hover:bg-coffee hover:text-white transition-colors">
                   ←
                 </button>
                 <button className="w-12 h-12 rounded-full border border-stone-300 flex items-center justify-center hover:bg-coffee hover:text-white transition-colors">
                   →
                 </button>
              </div>
           </div>
        </div>
      </section>

      {/* --- FAQ --- */}
      <section className="py-24 max-w-4xl mx-auto px-6">
         <h2 className="text-center font-serif text-5xl text-coffee mb-2">Frequently <span className="italic">Asked Questions</span></h2>
         <p className="text-center text-stone-500 mb-16">Common questions, simple answers.</p>

         <div className="space-y-4">
           {faqs.map((faq, index) => (
             <div key={index} className="border border-stone-200 rounded-lg overflow-hidden bg-white">
               <button 
                 onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                 className={`w-full text-left px-8 py-6 flex justify-between items-center transition-colors ${openFaqIndex === index ? 'bg-coffee text-white' : 'bg-white text-coffee hover:bg-stone-50'}`}
               >
                 <span className="font-medium text-lg">{faq.question}</span>
                 <span className="text-2xl">{openFaqIndex === index ? '−' : '+'}</span>
               </button>
               <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openFaqIndex === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                 <div className="px-8 py-6 text-stone-600 leading-relaxed">
                   {faq.answer}
                 </div>
               </div>
             </div>
           ))}
         </div>
      </section>

      {/* --- BOTTOM CTA --- */}
      <section className="relative h-[600px] flex items-center justify-center">
         <div className="absolute inset-0">
           <img src="https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=2000&auto=format&fit=crop" alt="Bread Basket" className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-black/50"></div>
         </div>
         <div className="relative z-10 text-center text-white px-4">
            <h2 className="font-serif text-5xl md:text-7xl mb-6">Freshly Baked, <br/><span className="italic">Just for You</span></h2>
            <p className="max-w-xl mx-auto text-white/80 mb-10 text-lg">Order today and enjoy handcrafted breads and pastries made fresh every morning.</p>
            <button 
              onClick={onNavigateToMenu}
              className="bg-cream text-coffee px-12 py-5 rounded-sm font-bold uppercase tracking-widest hover:bg-cinnamon hover:text-white transition-all duration-300"
            >
              See Full Menu →
            </button>
         </div>
      </section>

    </div>
  );
};

export default Home;