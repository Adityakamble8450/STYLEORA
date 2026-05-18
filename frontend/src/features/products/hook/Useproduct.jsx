import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import productApi from "../services/product.api.jsx";
import { setError, setLoading, setProducts } from "../state/products.slice";
import { data } from "react-router";

export const Useproduct = () => {
  const dispatch = useDispatch();
  const { loading, error, products } = useSelector((state) => state.product);

  const handleCreateProduct = useCallback(
    async (formData) => {
      dispatch(setLoading(true));
      dispatch(setError(null));

      try {
        const data = await productApi.createProduct(formData);
        dispatch(setProducts([data.product, ...products]));
        return data.product;
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
      dispatch(setProducts(data.products || []));
      return data.products || [];
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
      const productList = data.products || data.allProduct || [];
      dispatch(setProducts(productList));
      return productList;
    } catch (requestError) {
      dispatch(setError(requestError.message));
      throw requestError;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const handleGetprodcutById = async (productId) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const Productdetails = await productApi.getProductByid(productId);
      dispatch(setProducts([Productdetails.product || Productdetails]));
      return Productdetails.product || Productdetails;
    } catch (requestError) {
      dispatch(setError(requestError.message));
      throw requestError;
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    handleCreateProduct,
    handleGetProducts,
    handleGetAllProducts,
    handleGetprodcutById ,
    loading,
    error,
    products,
  };
};

export default Useproduct;
