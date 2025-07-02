import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, Download, Mail, Share2, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

const OrderConfirmation = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [emailCopyChecked, setEmailCopyChecked] = useState(false);
  
  const orderData = location.state || {
    orderNumber: 'ORD123456',
    shippingInfo: {
      firstName: 'John',
      lastName: 'Doe',
      address: '123 Main St',
      city: 'Anytown',
      state: 'ST',
      zipCode: '12345'
    },
    total: 99.99
  };

  const { orderNumber, shippingInfo, total } = orderData;

  const handleDownloadReceipt = () => {
    toast({
      title: "Receipt Downloaded",
      description: "Your receipt has been downloaded as a PDF.",
    });
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleEmailCopy = () => {
    if (emailCopyChecked) {
      toast({
        title: "Receipt Sent",
        description: "A copy of your receipt has been sent to your email.",
      });
    }
  };

  const handleShare = (platform: string) => {
    toast({
      title: "Shared Successfully",
      description: `Order shared on ${platform}!`,
    });
  };

  const handleEmailCheckboxChange = (checked: boolean | "indeterminate") => {
    setEmailCopyChecked(checked === true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Thank You for Your Order!</h1>
          <p className="text-gray-600">Your order has been successfully placed and confirmed.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Information */}
            <Card>
              <CardHeader>
                <CardTitle>Order Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">Order Number</h3>
                    <p className="text-lg font-mono text-blue-600">#{orderNumber}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Order Date</h3>
                    <p className="text-gray-600">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Shipping Address</h3>
                  <div className="text-gray-600">
                    <p>{shippingInfo.firstName} {shippingInfo.lastName}</p>
                    <p>{shippingInfo.address}</p>
                    <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Estimated Delivery</h3>
                  <p className="text-gray-600">
                    Your order will be delivered within 5-7 business days.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    You'll receive a tracking number via email once your order ships.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Receipt Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Receipt Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="email-copy" 
                    checked={emailCopyChecked}
                    onCheckedChange={handleEmailCheckboxChange}
                  />
                  <label htmlFor="email-copy" className="text-sm font-medium">
                    Email me a copy of this receipt
                  </label>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleDownloadReceipt}
                    className="flex items-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download PDF</span>
                  </Button>

                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handlePrintReceipt}
                    className="flex items-center space-x-2"
                  >
                    <Printer className="h-4 w-4" />
                    <span>Print Receipt</span>
                  </Button>

                  {emailCopyChecked && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleEmailCopy}
                      className="flex items-center space-x-2"
                    >
                      <Mail className="h-4 w-4" />
                      <span>Send Email</span>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Social Share */}
            <Card>
              <CardHeader>
                <CardTitle>Share Your Purchase</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-3">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleShare('Twitter')}
                    className="flex items-center space-x-2"
                  >
                    <Share2 className="h-4 w-4" />
                    <span>Twitter</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleShare('Facebook')}
                    className="flex items-center space-x-2"
                  >
                    <Share2 className="h-4 w-4" />
                    <span>Facebook</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleShare('Instagram')}
                    className="flex items-center space-x-2"
                  >
                    <Share2 className="h-4 w-4" />
                    <span>Instagram</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${(total / 1.08).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${(total - (total / 1.08)).toFixed(2)}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total Paid</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                <Separator />

                <div className="space-y-3 pt-4">
                  <Link to="/">
                    <Button className="w-full">Continue Shopping</Button>
                  </Link>
                  <Link to="/cart">
                    <Button variant="outline" className="w-full">View Cart</Button>
                  </Link>
                </div>

                <div className="text-center pt-4">
                  <p className="text-sm text-gray-500">
                    Questions about your order?
                  </p>
                  <p className="text-sm">
                    <a href="mailto:support@shopcart.com" className="text-blue-600 hover:underline">
                      Contact Support
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
