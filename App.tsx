import React, { useState } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import MenuGrid from './components/MenuGrid';
import CartSidebar from './components/CartSidebar';
import AdminDashboard from './components/AdminDashboard';
import BoxBuilder from './components/BoxBuilder';
import Home from './components/Home';
import ChatBot from './components/ChatBot';
import { INITIAL_PRODUCTS } from './constants';
import { Product, CartItem, Order, OrderStatus, ViewMode, BoxState, Page } from './types';
import { productService } from './services/productService';
import { orderService } from './services/orderService';
import { useEffect } from 'react';

const App: React.FC = () => {
  // --- State ---
  const [viewMode, setViewMode] = useState<ViewMode>('CUSTOMER');
  const [currentPage, setCurrentPage] = useState<Page>('HOME'); // Routing State
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Fetch products from database on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getProducts();
        if (data && data.length > 0) {
          setProducts(data);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };
    fetchProducts();
  }, []);
  
  // Box Builder State
  const [boxState, setBoxState] = useState<BoxState>({
    isOpen: false,
    size: 6,
    items: []
  });

  const [loyaltyDb, setLoyaltyDb] = useState<Record<string, number>>({});
  
  // Orders for Admin
  const [orders, setOrders] = useState<Order[]>([]);

  // Fetch products and orders from database on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, ordersData] = await Promise.all([
          productService.getProducts(),
          orderService.getOrders()
        ]);
        
        if (productsData && productsData.length > 0) {
          setProducts(productsData);
        }
        
        setOrders(ordersData);
        
        // Also sync loyalty counts from orders if needed, 
        // but for now let's just use the phone lookup
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchData();
  }, []);

  // --- Navigation ---
  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // --- Customer Actions ---

  const addToCart = (product: Product, quantity: number = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id && !item.variant);
      if (existing) {
        return prev.map(item => (item.id === product.id && !item.variant) ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...product, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    // Basic remove logic (might remove all variants of ID in real app, but simplified here)
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  // --- Box Logic ---
  
  const openBoxBuilder = () => {
    setBoxState({ isOpen: true, size: 6, items: [] });
    // Ensure we are on menu page if box builder is opened? Or keep overlay?
    // Let's ensure we are on menu page because products are there
    setCurrentPage('MENU');
    setTimeout(() => {
        window.scrollTo({ top: window.innerHeight * 0.2, behavior: 'smooth' });
    }, 100);
  };

  const addItemToBox = (product: Product) => {
    if (boxState.items.length < boxState.size) {
      setBoxState(prev => ({ ...prev, items: [...prev.items, product] }));
    }
  };

  const removeBoxItem = (index: number) => {
    setBoxState(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const completeBox = () => {
    // Add all box items to cart grouped or individual?
    // Let's add them individually but with a variant tag
    const newItems: CartItem[] = boxState.items.map(p => ({
      ...p,
      quantity: 1,
      variant: 'Custom Box'
    }));

    // Consolidate in cart
    setCartItems(prev => {
      const updated = [...prev];
      newItems.forEach(newItem => {
        const existing = updated.find(i => i.id === newItem.id && i.variant === 'Custom Box');
        if (existing) {
          existing.quantity += 1;
        } else {
          updated.push(newItem);
        }
      });
      return updated;
    });

    setBoxState(prev => ({ ...prev, isOpen: false, items: [] }));
    setIsCartOpen(true);
  };

  // --- Checkout & Loyalty ---

  const getCustomerPurchaseCount = (phone: string) => {
    return loyaltyDb[phone] || 0;
  };

  const handleCheckoutComplete = async (phone: string) => {
    const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0) + 150; // + delivery
    
    try {
      // 1. Save to Database
      await orderService.createOrder(phone, cartItems, total);
      
      // 2. Update Local State (optimistic or refresh)
      const ordersData = await orderService.getOrders();
      setOrders(ordersData);
      
      // 3. Update Loyalty locally
      setLoyaltyDb(prev => ({
        ...prev,
        [phone]: (prev[phone] || 0) + 1
      }));

      setCartItems([]);
      setTimeout(() => {
          setIsCartOpen(false);
      }, 500);
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Checkout failed. Please try again.');
    }
  };

  // --- Admin Actions ---

  const toggleProductStatus = (id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p));
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, status);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const handleAddProduct = async (productData: Omit<Product, 'id' | 'isActive'>) => {
    const newProduct: Product = {
      id: Date.now().toString(),
      isActive: true,
      ...productData
    };
    
    try {
      await productService.addProduct(newProduct);
      setProducts(prev => [...prev, newProduct]);
    } catch (error) {
      console.error('Failed to add product to database:', error);
      // Still update UI for immediate feedback, or show error? 
      // For now, let's keep it optimistic but log the error
    }
  };

  const handleUpdateProduct = async (updatedProduct: Product) => {
    try {
      await productService.updateProduct(updatedProduct);
      setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    } catch (error) {
      console.error('Failed to update product in database:', error);
    }
  };

  // --- Render ---

  return (
    <div className="bg-cream min-h-screen text-coffee font-sans selection:bg-cinnamon selection:text-white">
      <Navigation 
        cartCount={cartItems.reduce((a, b) => a + b.quantity, 0)} 
        toggleCart={() => setIsCartOpen(!isCartOpen)}
        viewMode={viewMode}
        setViewMode={setViewMode}
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />

      {viewMode === 'CUSTOMER' ? (
        <>
          {currentPage === 'HOME' && (
            <>
              <Hero 
                onOpenBoxBuilder={openBoxBuilder} 
                onNavigateToMenu={() => handleNavigate('MENU')}
              />
              <Home onNavigateToMenu={() => handleNavigate('MENU')} />
              <footer className="relative z-10 bg-deep-walnut text-cream-dark py-12 border-t border-stone-800">
                <div className="max-w-7xl mx-auto px-6 text-center">
                  <h2 className="font-serif text-2xl italic mb-4">Cinnamon Lane</h2>
                  <p className="text-sm opacity-60 mb-8">Nairobi, Kenya</p>
                  <div className="flex justify-center gap-6 text-xs tracking-widest uppercase opacity-40">
                    <span>Instagram</span>
                    <span>WhatsApp</span>
                    <span>Maps</span>
                  </div>
                </div>
              </footer>
            </>
          )}

          {currentPage === 'MENU' && (
            <div className="pt-20 min-h-screen">
              <MenuGrid 
                products={products} 
                onAddToCart={(p) => addToCart(p, 1)}
                isBoxMode={boxState.isOpen}
                onAddToBox={addItemToBox}
                itemsInBoxCount={boxState.items.length}
                boxLimit={boxState.size}
              />
              {/* Simple Footer for Menu Page */}
              <footer className="bg-cream text-coffee/40 py-8 text-center text-xs tracking-widest uppercase">
                Cinnamon Lane • Nairobi
              </footer>
            </div>
          )}

          {boxState.isOpen && (
            <BoxBuilder 
              items={boxState.items}
              size={boxState.size}
              onRemoveItem={removeBoxItem}
              onCompleteBox={completeBox}
              onCancel={() => setBoxState(prev => ({ ...prev, isOpen: false, items: [] }))}
            />
          )}

          {/* Add ChatBot */}
          <ChatBot products={products} onAddToCart={addToCart} />
        </>
      ) : (
        <AdminDashboard 
          products={products}
          orders={orders}
          toggleProductStatus={toggleProductStatus}
          updateOrderStatus={updateOrderStatus}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
        />
      )}

      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cartItems} 
        onRemoveItem={removeFromCart}
        onCheckoutComplete={handleCheckoutComplete}
        getCustomerPurchaseCount={getCustomerPurchaseCount}
      />
    </div>
  );
};

export default App;