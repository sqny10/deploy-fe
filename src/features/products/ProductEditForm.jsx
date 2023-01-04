import {useState, useEffect} from "react";
import {useUpdateProductMutation, useDeleteProductMutation} from "./productsApiSlice";
import {useNavigate} from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import {uploadImages} from "../../utils/uploadImages";
import Spinner from "../../components/Spinner";

function ProductEditForm({product}) {
    const [updateProduct, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateProductMutation();

    const [deleteProduct, {
        isSuccess: isDeleteSuccess,
        isError: isDeleteError,
        error: deleteError
    }] = useDeleteProductMutation();

    const [title, setTitle] = useState(product.title);
    const [description, setDescription] = useState(product.description);
    const [amount, setAmount] = useState(0);
    const [imgUrls, setImgUrls] = useState(product.imgUrls);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");

    const {isManager, isAdmin, userId} = useAuth();

    const navigate = useNavigate();

    // If submitted successfully
    useEffect(() => {
        if(isSuccess || isDeleteSuccess){
            setTitle("");
            setDescription("");
            setAmount(0);
            navigate("/dash/products")
        }
    }, [isSuccess, isDeleteSuccess, navigate]);
    
    const onTitleChanged = (e) => setTitle(e.target.value);
    const onDescriptionChanged = (e) => setDescription(e.target.value);
    const onAmountChanged = (e) => setAmount(e.target.value);
    const onImagesChanged = (e) => setImages(e.target.files);

    const getAmount = product?.log.reduce((total, logItem) => {
        return total + logItem.amount
    }, 0);
    
    // Checks for every field is valid
    const canSave = [title, description].every(Boolean) && !isLoading;

    const onSaveProductClicked = async (e) => {
        e.preventDefault();

        let newImageUrls = [];
        if(images){
            try {
                setLoading(true);
                newImageUrls = await uploadImages(images);
            } catch (error) {
                setErr(error);
            } finally{
                setLoading(false);
            }
        }

        if(canSave){
            if(amount !== 0){
                await updateProduct({id: product.id, userId, title, description, imgUrls: [...imgUrls, ...newImageUrls], available: getAmount + (+amount) <= 0 ? false : true, amount: +amount}); // Add userId after authentivation and imgUrls
            }else{
                await updateProduct({id: product.id, userId, title, description, imgUrls: [...imgUrls, ...newImageUrls], available: product.available}); // Add userId after authentivation and imgUrls
            }
        }
    }

    const onDeleteProductClicked = async (e) => {
        e.preventDefault();
        await deleteProduct({id: product.id})
    }

    const onDeleteImageClicked = (index) => {
        let imgUrlsArr = [...imgUrls];
        imgUrlsArr.splice(index, 1);
        setImgUrls(imgUrlsArr);
    }

    const errorClass = (isError || isDeleteError || err) ? "err-msg" : "d-none";
    const validTitleClass = !title ? "form-input form-error" : "form-input";
    const validDescriptionClass = !description ? "form-input form-error" : "form-input";

    const errMsg = (error?.data?.message || deleteError?.data?.message) ?? "";

    if(loading) return <Spinner/>

    return (
        <section className="adjustiable-container">
            <p className={errorClass}>{errMsg}</p>
            <form className="form">
                <div className="header-container">
                    <h2>Edit Product</h2>
                    {(isManager || isAdmin) &&
                        <div className="button-container">
                            <button
                                className="list-button product"
                                onClick={onDeleteProductClicked}
                            >
                                Delete
                            </button>
                        </div>
                    }
                </div>
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input 
                        className={validTitleClass}
                        type="text"
                        id="title"
                        name="title"
                        autoComplete="off"
                        value={title}
                        onChange={onTitleChanged}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        className={validDescriptionClass}
                        id="description"
                        name="description"
                        value={description}
                        onChange={onDescriptionChanged}
                    ></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="amount">Amount</label>
                    <input 
                        className="form-input"
                        type="number"
                        step="1"
                        id="amount"
                        name="amount"
                        min={`${-1 * getAmount}`}
                        value={amount}
                        onChange={onAmountChanged}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="images">Images</label>
                    <input 
                        className="form-input"
                        type="file"
                        id="images"
                        name="images"
                        max="6"
                        accept=".jpg,.png,.jpeg,.webp"
                        multiple
                        onChange={onImagesChanged}
                    />
                </div>
                <div className="edit-images">
                    {imgUrls.map((url, index) => (
                        <div key={index} className="img-container">
                            <img src={url} alt={`${product.title} - ${index}`}/>
                            <button 
                                className="delete-button"
                                type="button"
                                onClick={() => onDeleteImageClicked(index)}
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                </div>
                <button
                    className="form-button"
                    type="submit"  
                    onClick={onSaveProductClicked} 
                    disabled={!canSave} 
                >
                    Save Changes
                </button>
            </form>
        </section>
    )
}

export default ProductEditForm