import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, Heart, Tag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const { toast } = useToast();
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [savedForLater, setSavedForLater] = useState<any[]>([]);

  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === 'save10') {
      setAppliedPromo('SAVE10');
      toast({
        title: "Promo Code Applied!",
        description: "You saved 10% on your order.",
      });
    } else if (promoCode.toLowerCase() === 'freeship') {
      setAppliedPromo('FREESHIP');
      toast({
        title: "Promo Code Applied!",
        description: "You got free shipping on your order.",
      });
    } else {
      toast({
        title: "Invalid Promo Code",
        description: "Please check your promo code and try again.",
        variant: "destructive",
      });
    }
    setPromoCode('');
  };

  const handleSaveForLater = (item: any) => {
    setSavedForLater([...savedForLater, item]);
    removeFromCart(item.id);
    toast({
      title: "Item Saved",
      description: `${item.name} has been saved for later.`,
    });
  };

  const handleMoveToCart = (item: any) => {
    setSavedForLater(savedForLater.filter(saved => saved.id !== item.id));
    // Note: In a real app, you'd use addToCart here
    toast({
      title: "Item Moved to Cart",
      description: `${item.name} has been moved back to your cart.`,
    });
  };

  const getDiscountAmount = () => {
    if (appliedPromo === 'SAVE10') {
      return getCartTotal() * 0.1;
    }
    return 0;
  };

  const getFinalTotal = () => {
    const subtotal = getCartTotal();
    const discount = getDiscountAmount();
    const tax = (subtotal - discount) * 0.08;
    return subtotal - discount + tax;
  };

  if (cart.length === 0 && savedForLater.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div className="relative mx-auto w-32 h-32 mb-4">
                <ShoppingBag className="h-32 w-32 text-gray-300 mx-auto" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🛒</span>
                  </div>
                </div>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet.</p>
            <Link to="/">
              <Button className="w-full">Continue Shopping</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">Review your items and checkout when you're ready</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Cart Items */}
            {cart.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Items in Your Cart ({cart.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      
                      <div className="flex-1">
                        <Link to={`/product/${item.id}`}>
                          <h3 className="font-semibold text-lg hover:text-blue-600 transition-colors">
                            {item.name}
                          </h3>
                        </Link>
                        <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                        <p className="text-xl font-bold text-blue-600 mt-2">${item.price}</p>
                      </div>
                      
                      <div className="flex flex-col items-end space-y-3">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="px-4 py-2 border-x border-gray-300 min-w-[3rem] text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSaveForLater(item)}
                            className="text-gray-600 hover:text-gray-800"
                          >
                            <Heart className="h-4 w-4 mr-1" />
                            Save
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Saved for Later */}
            {savedForLater.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Saved for Later ({savedForLater.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {savedForLater.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-gray-600 text-sm">{item.description}</p>
                        <p className="text-lg font-bold text-blue-600 mt-1">${item.price}</p>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMoveToCart(item)}
                        >
                          Move to Cart
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSavedForLater(savedForLater.filter(saved => saved.id !== item.id))}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Promo Code */}
            {cart.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Tag className="h-5 w-5 mr-2" />
                    Promo Code
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleApplyPromo}>Apply</Button>
                  </div>
                  {appliedPromo && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-800 font-medium">
                        ✓ Promo code "{appliedPromo}" applied successfully!
                      </p>
                    </div>
                  )}
                  <div className="mt-3 text-sm text-gray-600">
                    <p>Try: <code className="bg-gray-100 px-2 py-1 rounded">SAVE10</code> for 10% off or <code className="bg-gray-100 px-2 py-1 rounded">FREESHIP</code> for free shipping</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          {cart.length > 0 && (
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>{item.name} x {item.quantity}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${getCartTotal().toFixed(2)}</span>
                    </div>
                    
                    {appliedPromo && getDiscountAmount() > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount ({appliedPromo})</span>
                        <span>-${getDiscountAmount().toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Shipping</span>
                      <span>{appliedPromo === 'FREESHIP' ? 'Free' : 'Free'}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Tax</span>
                      <span>${((getCartTotal() - getDiscountAmount()) * 0.08).toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${getFinalTotal().toFixed(2)}</span>
                  </div>
                  
                  <div className="space-y-3 pt-4">
                    <Link to="/checkout">
                      <Button className="w-full">
                        Proceed to Checkout
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full" onClick={clearCart}>
                      Clear Cart
                    </Button>
                    <Link to="/">
                      <Button variant="ghost" className="w-full">
                        Continue Shopping
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
