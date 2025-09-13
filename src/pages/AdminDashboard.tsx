import { useState, useEffect } from 'react';
import { useSecureAuth } from '@/contexts/SecureAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Navigate, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import {
  Package,
  Users,
  BarChart3,
  Plus,
  LogOut,
  ShoppingCart,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Search,
  Shield
} from 'lucide-react';
import ProductForm from '@/components/admin/ProductForm';
import SecurityDashboard from '@/components/security/SecurityDashboard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';

interface Product {
  id: string;
  name: string;
  description?: string;
  short_description?: string;
  price: number;
  category_id: string;
  affiliate_url?: string;
  image_url?: string;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function AdminDashboard() {
  // All hooks must be called before any conditional logic or early returns
  const { user, signOut, isAdmin, userRole } = useSecureAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Define fetchData function before useEffect
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (productsError) throw productsError;

      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (categoriesError) throw categoriesError;

      setProducts(productsData || []);
      setCategories(categoriesData || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load data: " + error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect hook must be declared before any conditional returns
  useEffect(() => {
    fetchData();
  }, []);

  // Redirect if not authenticated or not admin
  if (!user) {
    return <Navigate to="/secure-auth" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="glass-card p-8 text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">You don't have admin permissions to access this area.</p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </Card>
      </div>
    );
  }


const handleSignOut = async () => {
  try {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out."
    });
  } catch (error: any) {
    toast({
      title: "Error",
      description: "Failed to sign out: " + error.message,
      variant: "destructive"
    });
  }
};

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product permanently? This action cannot be undone.')) return;

    const productToDelete = products.find(p => p.id === productId);
    if (!productToDelete) {
      toast({
        title: "Error",
        description: "Product not found",
        variant: "destructive"
      });
      return;
    }

    try {
      // Get admin token from sessionStorage
      const tokenData = sessionStorage.getItem('adminToken');
      if (!tokenData) {
        toast({
          title: "Authentication Error",
          description: "Please sign in again to continue",
          variant: "destructive"
        });
        navigate('/secure-auth');
        return;
      }
      
      const { token: adminToken, expiry } = JSON.parse(tokenData);
      if (Date.now() > expiry) {
        sessionStorage.removeItem('adminToken');
        toast({
          title: "Session Expired",
          description: "Please sign in again to continue",
          variant: "destructive"
        });
        navigate('/secure-auth');
        return;
      }

      console.log(`Attempting to delete product: ${productId}`);

      // Call the admin-auth edge function to delete the product
      const { data, error } = await supabase.functions.invoke('admin-auth', {
        body: {
          action: 'delete_product',
          token: adminToken,
          data: { id: productId }
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Failed to call deletion service');
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Deletion failed');
      }

      console.log('Product deleted successfully via edge function');

      // Refetch data to ensure UI and database are in sync
      await fetchData();

      toast({
        title: "Success",
        description: "Product and all associated data deleted successfully."
      });
      
    } catch (error: any) {
      console.error('Delete product error:', error);
      toast({
        title: "Error",
        description: "Failed to delete product: " + (error.message || 'Unknown error occurred'),
        variant: "destructive"
      });
    }
  };

  const handleToggleActive = async (productId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: !currentStatus })
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Product ${!currentStatus ? 'activated' : 'deactivated'} successfully.`
      });
      fetchData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update product: " + error.message,
        variant: "destructive"
      });
    }
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId)?.name || 'Unknown';
  };

  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getCategoryName(product.category_id).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalProducts: products.length,
    activeProducts: products.filter(p => p.is_active).length,
    featuredProducts: products.filter(p => p.is_featured).length,
    categories: categories.length
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold gradient-text">Admin Dashboard</h1>
              <Badge variant="secondary">Administrator</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Welcome, {user?.email?.split('@')[0] || 'Admin'}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Products</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeProducts}</div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Featured</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.featuredProducts}</div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.categories}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-1 lg:w-[200px]">
            <TabsTrigger value="products">Products</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Product Management</h2>
              <Button 
                onClick={() => setShowProductForm(true)}
                className="btn-premium"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search products by name, description, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Card className="glass-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        {searchTerm ? `No products found matching "${searchTerm}"` : 'No products found'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{getCategoryName(product.category_id)}</TableCell>
                      <TableCell>${product.price}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={product.is_active ? "default" : "secondary"}
                          className="cursor-pointer"
                          onClick={() => handleToggleActive(product.id, product.is_active)}
                        >
                          {product.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {product.is_featured && (
                          <Badge variant="outline">Featured</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingProduct(product);
                              setShowProductForm(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>


        </Tabs>
      </div>

      {/* Product Form Modal */}
      {showProductForm && (
        <ProductForm
          product={editingProduct}
          categories={categories}
          onClose={() => {
            setShowProductForm(false);
            setEditingProduct(null);
          }}
          onSuccess={() => {
            fetchData();
            setShowProductForm(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
}