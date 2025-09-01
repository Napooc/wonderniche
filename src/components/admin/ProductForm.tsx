
import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { X, Plus, Minus, Upload, Link, Image } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface ProductFormData {
  id?: string;
  name: string;
  description?: string;
  short_description?: string;
  category_id: string;
  image_url?: string;
  affiliate_url?: string;
  features?: string[];
  rating?: number;
  reviews_count?: number;
  is_featured: boolean;
  is_active: boolean;
  tags?: string[];
}

interface Category {
  id: string;
  name: string;
}

interface ProductFormProps {
  product?: ProductFormData | null;
  categories: Category[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function ProductForm({ product, categories, onClose, onSuccess }: ProductFormProps) {
  const { toast } = useToast();
  const { user, userRole } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [features, setFeatures] = useState<string[]>(product?.features || ['']);
  const [tags, setTags] = useState<string[]>(product?.tags || []);
  const [newTag, setNewTag] = useState('');
  
const [formData, setFormData] = useState({
  name: product?.name || '',
  description: product?.description || '',
  short_description: product?.short_description || '',
  category_id: product?.category_id || '',
  image_url: product?.image_url || '',
  affiliate_url: product?.affiliate_url || '',
  rating: product?.rating || 4.5,
  reviews_count: product?.reviews_count || 0,
  is_featured: product?.is_featured || false,
  is_active: product?.is_active ?? true
});

  const ensureAdminSession = (action: 'upload images' | 'save products') => {
    const isAdmin = !!user && userRole === 'admin';
    if (!isAdmin) {
      console.warn(`[ProductForm] Blocked attempt to ${action} without admin session`, { user, userRole });
      toast({
        title: 'Sign in required',
        description: 'Please sign in as admin to perform this action.',
        variant: 'destructive',
      });
      return false;
    }
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSwitchChange = (name: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  const addFeature = () => {
    setFeatures([...features, '']);
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ensureAdminSession('upload images')) return;

    console.log('File selected:', file.name, file.type, file.size);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select a valid image file",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image size must be less than 5MB",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      // Get admin token from sessionStorage
      const tokenData = sessionStorage.getItem('adminToken');
      if (!tokenData) {
        throw new Error('Admin session expired');
      }
      
      const { token: adminToken, expiry } = JSON.parse(tokenData);
      if (Date.now() > expiry) {
        sessionStorage.removeItem('adminToken');
        throw new Error('Admin session expired');
      }

      // Create FormData for upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('token', adminToken);

      console.log('Uploading via admin-auth function...');

      // Use the admin-auth edge function for upload
      const { data, error } = await supabase.functions.invoke('admin-auth/upload-image', {
        body: formData,
      });

      if (error) {
        console.error('Upload error:', error);
        throw new Error(error.message || 'Upload failed');
      }

      if (!data.success) {
        throw new Error(data.error || 'Upload failed');
      }

      console.log('Upload successful:', data.url);

      setFormData(prev => ({
        ...prev,
        image_url: data.url
      }));

      toast({
        title: "Success",
        description: "Image uploaded successfully"
      });
    } catch (error: any) {
      console.error('Image upload error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload image",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!ensureAdminSession('save products')) return;
    
    if (!formData.name || !formData.category_id) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
const productData: Record<string, any> = {
  ...formData,
  features: features.filter(f => f.trim() !== ''),
  tags: tags,
  rating: Number(formData.rating) || 4.5,
  reviews_count: Number(formData.reviews_count) || 0
};

      console.log('Submitting product data:', productData);

if (product) {
  // Update existing product via edge function
  const tokenData = sessionStorage.getItem('adminToken');
  if (!tokenData) {
    throw new Error('Admin session expired');
  }
  
  const { token: adminToken, expiry } = JSON.parse(tokenData);
  if (Date.now() > expiry) {
    sessionStorage.removeItem('adminToken');
    throw new Error('Admin session expired');
  }
  const { data, error } = await supabase.functions.invoke('admin-auth', {
    body: {
      action: 'update_product',
      token: adminToken,
      data: { id: product.id, ...productData }
    },
  });

  if (error || data?.error) {
    console.error('Update error:', error || data?.error);
    throw new Error(error?.message || data?.error || 'Update failed');
  }
  console.log('Product updated:', data);
  toast({ title: 'Success', description: 'Product updated successfully' });
} else {
  // Create new product via edge function
  const tokenData = sessionStorage.getItem('adminToken');
  if (!tokenData) {
    throw new Error('Admin session expired');
  }
  
  const { token: adminToken, expiry } = JSON.parse(tokenData);
  if (Date.now() > expiry) {
    sessionStorage.removeItem('adminToken');
    throw new Error('Admin session expired');
  }
  const { data, error } = await supabase.functions.invoke('admin-auth', {
    body: {
      action: 'create_product',
      token: adminToken,
      data: productData
    },
  });

  if (error || data?.error) {
    console.error('Insert error:', error || data?.error);
    throw new Error(error?.message || data?.error || 'Insert failed');
  }
  console.log('Product created:', data);
  toast({ title: 'Success', description: 'Product created successfully' });
}

      onSuccess();
    } catch (error: any) {
      console.error('Submit error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save product",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="glass-card w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-xl font-bold">
            {product ? 'Edit Product' : 'Add New Product'}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="bg-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category_id">Category *</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
                >
                  <SelectTrigger className="bg-input">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Descriptions */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="short_description">Short Description</Label>
                <Input
                  id="short_description"
                  name="short_description"
                  value={formData.short_description}
                  onChange={handleInputChange}
                  placeholder="Brief product description for cards"
                  className="bg-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Full Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="bg-input"
                />
              </div>
            </div>

{/* Pricing removed as requested */}

            {/* URLs and Media */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="affiliate_url">Affiliate URL</Label>
                <Input
                  id="affiliate_url"
                  name="affiliate_url"
                  type="url"
                  value={formData.affiliate_url}
                  onChange={handleInputChange}
                  required={false}
                  className="bg-input"
                />
              </div>

              {/* Image Upload Section */}
              <div className="space-y-4">
                <Label>Product Image</Label>
                <Tabs defaultValue="url" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="url" className="flex items-center space-x-2">
                      <Link className="w-4 h-4" />
                      <span>Image URL</span>
                    </TabsTrigger>
                    <TabsTrigger value="upload" className="flex items-center space-x-2">
                      <Upload className="w-4 h-4" />
                      <span>Upload File</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="url" className="space-y-2">
                    <Input
                      name="image_url"
                      type="url"
                      placeholder="Enter image URL"
                      value={formData.image_url}
                      onChange={handleInputChange}
                      className="bg-input"
                    />
                  </TabsContent>
                  
                  <TabsContent value="upload" className="space-y-4">
                    <div 
                      className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Upload className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-2">
                        {isUploading ? 'Uploading...' : 'Click to upload image or drag and drop'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG, GIF up to 5MB
                      </p>
                      {isUploading && (
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mt-2" />
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
                
                {/* Image Preview */}
                {formData.image_url && (
                  <div className="space-y-2">
                    <Label>Preview</Label>
                    <div className="relative w-32 h-32 border border-border rounded-lg overflow-hidden">
                      <img
                        src={formData.image_url}
                        alt="Product preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop';
                        }}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 w-6 h-6 p-0"
                        onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Product Features</Label>
                <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Feature
                </Button>
              </div>
              
              {features.map((feature, index) => (
                <div key={index} className="flex space-x-2">
                  <Input
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    placeholder="Enter product feature"
                    className="bg-input"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeFeature(index)}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Tags */}
            <div className="space-y-4">
              <Label>Tags</Label>
              <div className="flex space-x-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  className="bg-input"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" variant="outline" onClick={addTag}>
                  Add
                </Button>
              </div>
              
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                      {tag}
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Rating and Reviews */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="rating">Rating (1-5)</Label>
                <Input
                  id="rating"
                  name="rating"
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={handleInputChange}
                  className="bg-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reviews_count">Reviews Count</Label>
                <Input
                  id="reviews_count"
                  name="reviews_count"
                  type="number"
                  min="0"
                  value={formData.reviews_count}
                  onChange={handleInputChange}
                  className="bg-input"
                />
              </div>
            </div>

            {/* Switches */}
            <div className="flex space-x-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => handleSwitchChange('is_active', checked)}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => handleSwitchChange('is_featured', checked)}
                />
                <Label htmlFor="is_featured">Featured</Label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-4 pt-6">
              <Button
                type="submit"
                disabled={isLoading}
                className="btn-premium flex-1"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  product ? 'Update Product' : 'Create Product'
                )}
              </Button>
              
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
