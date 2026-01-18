import { supabase } from './supabase';
import { Order, OrderStatus, CartItem } from '../types';

export const orderService = {
  async getOrders(): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        id,
        customer_phone,
        total,
        status,
        timestamp,
        order_items (
          product_id,
          quantity,
          variant,
          price_at_time,
          products (
            name,
            image,
            hover_image,
            price,
            category,
            description,
            stock,
            is_active
          )
        )
      `)
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }

    return (data || []).map(order => ({
      id: order.id,
      customerPhone: order.customer_phone,
      total: order.total,
      status: order.status as OrderStatus,
      timestamp: new Date(order.timestamp),
      items: order.order_items.map((item: any) => ({
        id: item.product_id,
        name: item.products.name,
        price: item.price_at_time,
        quantity: item.quantity,
        variant: item.variant,
        image: item.products.image,
        hoverImage: item.products.hover_image,
        category: item.products.category,
        description: item.products.description,
        stock: item.products.stock,
        isActive: item.products.is_active
      }))
    }));
  },

  async createOrder(phone: string, items: CartItem[], total: number): Promise<void> {
    // 1. Ensure customer exists
    const { error: customerError } = await supabase
      .from('customers')
      .upsert({ phone }, { onConflict: 'phone' });

    if (customerError) {
      console.error('Error ensuring customer exists:', customerError);
      throw customerError;
    }

    // 2. Create order
    const orderId = `ord_${Math.random().toString(36).substr(2, 9)}`;
    const { error: orderError } = await supabase
      .from('orders')
      .insert({
        id: orderId,
        customer_phone: phone,
        total,
        status: OrderStatus.PENDING
      });

    if (orderError) {
      console.error('Error creating order:', orderError);
      throw orderError;
    }

    // 3. Create order items
    const orderItems = items.map(item => ({
      order_id: orderId,
      product_id: item.id,
      quantity: item.quantity,
      variant: item.variant || null,
      price_at_time: item.price
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      throw itemsError;
    }
    
    // 4. Update customer purchase count
    const { error: countError } = await supabase.rpc('increment_customer_purchase_count', { customer_phone_param: phone });
    
    if (countError) {
        // If RPC doesn't exist, we can do it manually, but let's assume it might not be there yet
        // and just ignore for now as it's secondary to order logging
        console.warn('Could not increment purchase count via RPC, attempting manual update');
        const { data: customer } = await supabase.from('customers').select('purchase_count').eq('phone', phone).single();
        if (customer) {
            await supabase.from('customers').update({ purchase_count: (customer.purchase_count || 0) + 1 }).eq('phone', phone);
        }
    }
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }
};
