
const fetcher = async (url, token) => {
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'An error occurred while fetching the data.');
  }
  return response.json();
};

export const getCategories = () => fetcher('/api/categories');
export const getColors = () => fetcher('/api/colors');
export const getSizes = () => fetcher('/api/sizes');
export const getSubcategories = (categorySlug) => fetcher(`/api/subcategories/${categorySlug}`);
export const getProduct = (id, token) => fetcher(`/api/products/vendor/update/${id}`, token);

export const createProduct = async (product, token) => {
  const response = await fetch('/api/products/vendor/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(product),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'An error occurred while creating the product.');
  }
  return response.json();
};

export const updateProduct = async (id, product, token) => {
  const response = await fetch(`/api/products/vendor/update/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(product),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'An error occurred while updating the product.');
  }
  return response.json();
};
