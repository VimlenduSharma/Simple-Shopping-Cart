import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import { Product, useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
  isListView?: boolean;
}

const ProductCard = ({ product, isListView = false }: ProductCardProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
  };

  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${isListView ? 'flex' : ''}`}>
      <Link to={`/product/${product.id}`} className={`block ${isListView ? 'flex w-full' : ''}`}>
        <div className={`relative overflow-hidden ${isListView ? 'w-48 flex-shrink-0' : 'aspect-square'}`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <Badge className="absolute top-2 left-2 bg-white text-gray-800 shadow-md">
            {product.category}
          </Badge>
        </div>
        
        <div className={`${isListView ? 'flex-1 flex flex-col' : ''}`}>
          <CardContent className="p-4 flex-1">
            <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {product.name}
            </h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {product.description}
            </p>
            <div className="flex items-center space-x-2 mb-3">
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="ml-1 text-sm font-medium">{product.rating}</span>
              </div>
              <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">${product.price}</p>
          </CardContent>
          
          <CardFooter className="p-4 pt-0">
            <Button 
              onClick={handleAddToCart}
              className="w-full group-hover:bg-blue-700 transition-colors"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </CardFooter>
        </div>
      </Link>
    </Card>
  );
};

export default ProductCard;
