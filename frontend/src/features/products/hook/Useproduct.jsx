import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import productApi from "../services/product.api.jsx";
import { setError, setLoading, setProducts } from "../state/products.slice";
import { normalizeProduct } from "../services/product.normalize.js";

export const Useproduct = () => {
  const dispatch = useDispatch();
  const { loading, error, products } = useSelector((state) => state.product);

  const handleCreateProduct = useCallback(
    async (formData) => {
      dispatch(setLoading(true));
      dispatch(setError(null));

      try {
        const data = await productApi.createProduct(formData);
        const nextProduct = normalizeProduct(data.product);
        dispatch(setProducts([nextProduct, ...products]));
        return nextProduct;
      } catch (requestError) {
        dispatch(setError(requestError.message));
        throw requestError;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, products],
  );

  const handleGetProducts = useCallback(async () => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const data = await productApi.getProducts();
      const normalizedProducts = (data.products || []).map(normalizeProduct);
      dispatch(setProducts(normalizedProducts));
      return normalizedProducts;
    } catch (requestError) {
      dispatch(setError(requestError.message));
      throw requestError;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const handleGetAllProducts = useCallback(async () => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const data = await productApi.getAllProducts();
      const productList = (data.products || data.allProduct || []).map(normalizeProduct);
      dispatch(setProducts(productList));
      return productList;
    } catch (requestError) {
      dispatch(setError(requestError.message));
      throw requestError;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const handleGetprodcutById = useCallback(async (productId) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const Productdetails = await productApi.getProductByid(productId);
      const normalizedProduct = normalizeProduct(Productdetails.product || Productdetails);
      dispatch(setProducts([normalizedProduct]));
      return normalizedProduct;
    } catch (requestError) {
      dispatch(setError(requestError.message));
      throw requestError;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

 const handleaddProductVeriant = useCallback(async (productId, variantPayload) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const response = await productApi.addProductVeriant(productId, variantPayload);
      const normalizedProduct = normalizeProduct(response.product || response);
      dispatch(setProducts([normalizedProduct]));
      return normalizedProduct;
    } catch (requestError) {
      dispatch(setError(requestError.message));
      throw requestError;
    } finally {
      dispatch(setLoading(false));
    }
 }, [dispatch])

  return {
    handleCreateProduct,
    handleGetProducts,
    handleGetAllProducts,
    handleGetprodcutById ,
    handleaddProductVeriant,
    loading,
    error,
    products,
  };
};

export default Useproduct;
