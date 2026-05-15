import { useDispatch, useSelector } from 'react-redux'
import productApi from '../services/product.api.jsx'
import { setError, setLoading, setProducts } from '../state/products.slice'

export const Useproduct = () => {
  const dispatch = useDispatch()
  const { loading, error, products } = useSelector((state) => state.product)

  const handleCreateProduct = async (formData) => {
    dispatch(setLoading(true))
    dispatch(setError(null))

    try {
      const data = await productApi.createProduct(formData)
      dispatch(setProducts([data.product, ...products]))
      return data.product
    } catch (requestError) {
      dispatch(setError(requestError.message))
      throw requestError
    } finally {
      dispatch(setLoading(false))
    }
  }

  const handleGetProducts = async () => {
    dispatch(setLoading(true))
    dispatch(setError(null))

    try {
      const data = await productApi.getProducts()
      dispatch(setProducts(data.products || []))
      return data.products || []
    } catch (requestError) {
      dispatch(setError(requestError.message))
      throw requestError
    } finally {
      dispatch(setLoading(false))
    }
  }

  return { handleCreateProduct, handleGetProducts, loading, error, products }
}

export default Useproduct
