import {useGetProductsQuery} from "./productsApiSlice";
import Product from "./Product";
import Spinner from "../../components/Spinner";
import useTitle from "../../hooks/useTitle";

function ProductsList() {
    useTitle("Inventory Management | Products");

    const {
        data: produts,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetProductsQuery("productsList", {
        pollingInterval: 15 * 1000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    });

    let content;
    if(isLoading) content = <Spinner/>;

    if(isError) content = <p className="err-msg">{error?.data?.message}</p>;

    if(isSuccess){
        const {ids} = produts;

        const tableBody = ids?.length && ids.map(productId => <Product productId={productId} key={productId}/>)

        content = (
            <>
                <div className="header-container">
                    <h2>All Products</h2>
                </div>
                <table className="list-table">
                    <thead>
                        <tr>
                            <th className="nowrap">Item No</th>
                            <th className="nowrap">Title</th>
                            <th className="nowrap">Amount</th>
                            <th className="nowrap">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableBody}
                    </tbody>
                </table>
            </>
        );
    }

    return content
}

export default ProductsList