import {useGetProductsQuery} from "./productsApiSlice";
import {useParams} from "react-router-dom";
import ProductEditForm from "./ProductEditForm";
import useTitle from "../../hooks/useTitle";
import Spinner from "../../components/Spinner";

function ProductEdit() {
    useTitle("Inventory Management | Edit Product");
    
    const {productId} = useParams();

    const {product} = useGetProductsQuery("productsList", {
        selectFromResult: ({data}) => ({
            product: data?.entities[productId]
        })
    });

    return product ? <ProductEditForm product={product}/> : <Spinner/>
}

export default ProductEdit