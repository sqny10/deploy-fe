import {useParams, useNavigate} from "react-router-dom";
import {useGetProductsQuery} from "./productsApiSlice";
import {useState, useRef} from "react";
import LogModal from "./LogModal";
import useTitle from "../../hooks/useTitle";
import Spinner from "../../components/Spinner";

function ProductDetails() {
    useTitle("Inventory Management | Product Details");

    const {productId} = useParams();
    const navigate = useNavigate();
    const modalRef = useRef();

    const [imageIndex, setImageIndex] = useState(0);

    const {product} = useGetProductsQuery("productsList", {
        selectFromResult: ({data}) => ({
            product: data?.entities[productId]
        })
    });

    if(!product) return <Spinner/>

    const getAmount = product?.log.reduce((total, logItem) => {
        return total + logItem.amount
    }, 0);

    const lastUpdate = new Date(product?.updatedAt).toLocaleString("en-GB", {day: "numeric", month: "long", year: "numeric", hour: "numeric", minute: "numeric", second: "numeric"})

    const onEditClicked = () => navigate(`/dash/products/edit/${productId}`);

    const onViewLogClicked = () => {
        modalRef.current.openModal();
    };

    const onPrevClicked = () => {
        (imageIndex === 0) ? setImageIndex(product?.imgUrls.length - 1) : setImageIndex(prev => prev - 1);
        console.log(imageIndex)
    }

    const onNextClicked = () => {
        (imageIndex === product?.imgUrls.length - 1) ? setImageIndex(0) : setImageIndex(prev => prev + 1);
        console.log(imageIndex);
    }

    console.log(product);

    

    return (
        <>
            <div className="adjustiable-container">
                <div className="header-container">
                    <h2>{product?.title} <span className="err-msg nowrap">{!product?.available && "(Not Available)"}</span></h2>
                    <div className="button-container">
                        <button
                            className="list-button product"
                            onClick={onEditClicked}
                        >
                            Edit
                        </button>
                        <button
                            className="list-button product"
                            onClick={onViewLogClicked}
                        >
                            View Log
                        </button>
                    </div>
                </div>
                <div className="info-container">
                    <div className="images">
                        <div className="carousel">
                            <img src={product?.imgUrls[imageIndex]} alt={`${imageIndex} - ${imageIndex}`} />
                        </div>
                        
                        <div className="carousel-nav">
                            <button onClick={onPrevClicked} className="carousel-nav-button">&lsaquo;</button>
                            <div className="indexes">
                                {product?.imgUrls.map((url, index) => {
                                    if(imageIndex !== index){
                                        return <span key={index} onClick={() => setImageIndex(index)} className="dot-nav"></span>
                                    }else return <span key={index} onClick={() => setImageIndex(index)} className="dot-nav current"></span>
                                })}
                            </div>
                            <button onClick={onNextClicked} className="carousel-nav-button">&rsaquo;</button>
                        </div>
                    </div>
                    <div className="details">
                        <p>Item No: # {product?.no}</p>
                        <p>Amount: {getAmount}</p>
                        <p>Last Update: {lastUpdate}</p>
                        <p>{product?.description}</p>
                    </div>
                </div>
            </div>
            <LogModal ref={modalRef} productLog={product?.log}/>
        </>
    )
}

export default ProductDetails