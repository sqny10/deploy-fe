import {useGetProductsQuery} from "./productsApiSlice";
import {useNavigate} from "react-router-dom";
import {memo} from "react";

function Product({productId}) {
    const {product} = useGetProductsQuery("productsList", {
        selectFromResult: ({data}) => ({
            product: data?.entities[productId]
        })
    });

    const navigate = useNavigate();

    if(product){
        const onViewClicked = () => navigate(`/dash/products/${productId}`);
        const onEditClicked = () => navigate(`/dash/products/edit/${productId}`);

        let amount = 0;
        for(let i = 0; i < product.log.length; i++){
            amount += product.log[i].amount;
        }

        const rowClass = (amount && amount > 0) ? "row" : "row row-error";

        return (
            <tr className={rowClass}>
                <td className="nowrap">{`# ${product.no}`}</td>
                <td className="expand">{product.title}</td>
                <td className="nowrap">{amount ?? 0}</td>
                <td className="nowrap">
                    <button
                        className="list-button"
                        onClick={onViewClicked}    
                    >
                        View
                    </button>
                    <button
                        className="list-button"
                        onClick={onEditClicked}    
                    >
                        Edit
                    </button>
                </td>
            </tr>
        )
    }else return null
}

const memoizedProduct = memo(Product);

export default memoizedProduct