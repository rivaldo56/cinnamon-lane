import React, { useState } from 'react';
import { Product, Order, OrderStatus } from '../types';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  toggleProductStatus: (id: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onAddProduct: (product: Omit<Product, 'id' | 'isActive'>) => void;
  onUpdateProduct: (product: Product) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  products, 
  orders, 
  toggleProductStatus, 
  updateOrderStatus,
  onAddProduct,
  onUpdateProduct
}) => {
  
  // --- Modal & Form State ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: 'pastry' as 'pastry' | 'bread' | 'cake',
    stock: 10,
    image: '',
    hoverImage: ''
  });

  // --- Handlers ---

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: 450,
      category: 'pastry',
      stock: 12,
      image: '',
      hoverImage: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      image: product.image,
      hoverImage: product.hoverImage
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'image' | 'hoverImage') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    try {
      const { productService } = await import('../services/productService');
      const publicUrl = await productService.uploadImage(file);
      
      setFormData(prev => ({
        ...prev,
        [field]: publicUrl
      }));
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to process image for database storage.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      onUpdateProduct({
        ...editingProduct,
        ...formData
      });
    } else {
      // If no image provided, use placeholders
      const finalData = {
        ...formData,
        image: formData.image || 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?q=80&w=800&auto=format&fit=crop',
        hoverImage: formData.hoverImage || 'https://images.unsplash.com/photo-1612203985729-107524d433cc?q=80&w=800&auto=format&fit=crop'
      };
      onAddProduct(finalData);
    }
    setIsModalOpen(false);
  };

  // --- Render Helpers ---

  const getNextStatus = (current: OrderStatus): OrderStatus | null => {
    switch (current) {
      case OrderStatus.PENDING: return OrderStatus.BAKING;
      case OrderStatus.BAKING: return OrderStatus.OUT_FOR_DELIVERY;
      case OrderStatus.OUT_FOR_DELIVERY: return OrderStatus.DELIVERED;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-serif text-coffee mb-8">Kitchen Dashboard</h1>

        {/* Inventory Control */}
        <section className="mb-12 bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-stone-800 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
              Inventory Management
            </h2>
            <button 
              onClick={openAddModal}
              className="bg-coffee text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-cinnamon transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add Item
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map(p => (
              <div key={p.id} className={`flex items-center justify-between p-4 rounded-lg border transition-all ${p.isActive ? 'border-stone-200 bg-white' : 'border-red-200 bg-red-50'}`}>
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 flex-shrink-0">
                     <img src={p.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                     {!p.isActive && <div className="absolute inset-0 bg-red-500/20 rounded-lg"></div>}
                  </div>
                  <div className="flex flex-col min-w-0">
                     <span className={`font-medium text-sm truncate ${p.isActive ? 'text-stone-900' : 'text-stone-400 line-through'}`}>{p.name}</span>
                     <span className="text-xs text-stone-500">Stock: {p.stock}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(p)}
                    className="p-2 text-stone-400 hover:text-coffee hover:bg-stone-100 rounded-full transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                  </button>

                  <button
                    onClick={() => toggleProductStatus(p.id)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${p.isActive ? 'bg-green-500' : 'bg-stone-300'}`}
                  >
                    <span className="sr-only">Toggle Active</span>
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${p.isActive ? 'translate-x-5' : 'translate-x-0'}`}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Order Kanban */}
        <section>
          <h2 className="text-xl font-bold text-stone-800 mb-4">Order Queue</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Object.values(OrderStatus).map((status) => (
              <div key={status} className="bg-stone-200/50 rounded-xl p-4 min-h-[500px]">
                <div className="flex justify-between items-center mb-4">
                   <h3 className="font-bold text-stone-600 uppercase text-xs tracking-wider">{status.replace(/_/g, ' ')}</h3>
                   <span className="bg-white text-stone-600 text-xs px-2 py-1 rounded-full">{orders.filter(o => o.status === status).length}</span>
                </div>
                
                <div className="space-y-3">
                  {orders.filter(o => o.status === status).map(order => (
                    <div key={order.id} className="bg-white p-4 rounded-lg shadow-sm border border-stone-100">
                      <div className="flex justify-between items-start mb-2">
                         <span className="font-mono text-xs text-stone-400">#{order.id.slice(0,6)}</span>
                         <span className="text-xs font-bold text-coffee">{new Date(order.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                      <div className="mb-3">
                        {order.items.map((item, i) => (
                          <div key={i} className="text-sm text-stone-700 flex justify-between">
                            <span>{item.quantity}x {item.name}</span>
                          </div>
                        ))}
                      </div>
                      
                      {getNextStatus(order.status) && (
                        <button 
                          onClick={() => updateOrderStatus(order.id, getNextStatus(order.status)!)}
                          className="w-full mt-2 bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-bold py-2 rounded transition-colors"
                        >
                          Move to {getNextStatus(order.status)?.replace(/_/g, ' ')}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* --- Product Modal --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
          <div className="bg-cream w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-200">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6 border-b border-stone-200 pb-4">
                <h2 className="font-serif text-2xl text-coffee">
                  {editingProduct ? 'Edit Pastry' : 'Add New Pastry'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-coffee">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-xs font-bold uppercase text-stone-500 tracking-wider mb-2">Item Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-stone-50 border border-stone-200 rounded-md px-4 py-2 focus:ring-1 focus:ring-cinnamon focus:border-cinnamon outline-none text-coffee font-medium"
                      placeholder="e.g., Saffron Bun"
                    />
                  </div>
                  
                  {/* Category */}
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-xs font-bold uppercase text-stone-500 tracking-wider mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value as any})}
                      className="w-full bg-stone-50 border border-stone-200 rounded-md px-4 py-2 focus:ring-1 focus:ring-cinnamon focus:border-cinnamon outline-none text-coffee"
                    >
                      <option value="pastry">Pastry</option>
                      <option value="bread">Bread</option>
                      <option value="cake">Cake</option>
                    </select>
                  </div>

                  {/* Price */}
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-xs font-bold uppercase text-stone-500 tracking-wider mb-2">Price (KES)</label>
                    <input 
                      type="number" 
                      required
                      min="0"
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                      className="w-full bg-stone-50 border border-stone-200 rounded-md px-4 py-2 focus:ring-1 focus:ring-cinnamon focus:border-cinnamon outline-none text-coffee font-mono"
                    />
                  </div>

                  {/* Stock */}
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-xs font-bold uppercase text-stone-500 tracking-wider mb-2">Inventory Stock</label>
                    <input 
                      type="number" 
                      required
                      min="0"
                      value={formData.stock}
                      onChange={e => setFormData({...formData, stock: Number(e.target.value)})}
                      className="w-full bg-stone-50 border border-stone-200 rounded-md px-4 py-2 focus:ring-1 focus:ring-cinnamon focus:border-cinnamon outline-none text-coffee font-mono"
                    />
                  </div>

                  {/* Description */}
                  <div className="col-span-2">
                    <label className="block text-xs font-bold uppercase text-stone-500 tracking-wider mb-2">Description</label>
                    <textarea 
                      required
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      rows={3}
                      className="w-full bg-stone-50 border border-stone-200 rounded-md px-4 py-2 focus:ring-1 focus:ring-cinnamon focus:border-cinnamon outline-none text-coffee resize-none"
                      placeholder="Describe flavors, textures, and ingredients..."
                    />
                  </div>

                  {/* Upload Images */}
                  <div className="col-span-2 space-y-4 pt-4 border-t border-stone-100">
                    <h4 className="text-sm font-bold text-coffee">Product Photography</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {/* Main Image Uploader */}
                      <div>
                        <label className="block text-xs font-bold uppercase text-stone-500 tracking-wider mb-2">Main Image</label>
                        <div className="relative border-2 border-dashed border-stone-300 rounded-lg h-40 bg-stone-50 hover:bg-stone-100 transition-colors cursor-pointer group flex flex-col items-center justify-center overflow-hidden">
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'image')}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          />
                          
                          {formData.image ? (
                            <>
                              <img src={formData.image} alt="Main" className="absolute inset-0 w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="text-white text-xs font-bold uppercase">Change Image</span>
                              </div>
                            </>
                          ) : (
                            <div className="text-center p-4">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-stone-400 mx-auto mb-2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                              </svg>
                              <span className="text-xs text-stone-500">Click to Upload Main View</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Hover/Texture Image Uploader */}
                      <div>
                        <label className="block text-xs font-bold uppercase text-stone-500 tracking-wider mb-2">Inside/Texture View</label>
                        <div className="relative border-2 border-dashed border-stone-300 rounded-lg h-40 bg-stone-50 hover:bg-stone-100 transition-colors cursor-pointer group flex flex-col items-center justify-center overflow-hidden">
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'hoverImage')}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          />
                          
                          {formData.hoverImage ? (
                            <>
                              <img src={formData.hoverImage} alt="Hover" className="absolute inset-0 w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="text-white text-xs font-bold uppercase">Change Image</span>
                              </div>
                            </>
                          ) : (
                            <div className="text-center p-4">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-stone-400 mx-auto mb-2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                              </svg>
                              <span className="text-xs text-stone-500">Click to Upload Texture View</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-stone-200 mt-6">
                   <button 
                     type="button" 
                     onClick={() => setIsModalOpen(false)}
                     className="px-6 py-3 text-sm font-bold text-stone-500 hover:text-stone-800 transition-colors"
                   >
                     Cancel
                   </button>
                   <button 
                     type="submit" 
                     disabled={isUploading}
                     className={`px-8 py-3 bg-coffee text-white text-sm font-bold uppercase tracking-widest rounded-md hover:bg-cinnamon transition-colors shadow-lg ${isUploading ? 'opacity-50 cursor-wait' : ''}`}
                   >
                     {isUploading ? 'Processing...' : (editingProduct ? 'Save Changes' : 'Create Item')}
                   </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;