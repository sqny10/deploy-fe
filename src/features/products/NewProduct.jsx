import {useState, useEffect} from "react";
import {useAddNewProductMutation} from "./productsApiSlice";
import {useNavigate} from "react-router-dom";
import useTitle from "../../hooks/useTitle";
import Spinner from "../../components/Spinner";
import useAuth from "../../hooks/useAuth";
import {uploadImages} from "../../utils/uploadImages";

function NewProduct() {
    useTitle("Inventory Management | New Product");

    const {userId} = useAuth();

    const [addNewProduct, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewProductMutation();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState(0);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");

    const navigate = useNavigate();

    // If submitted successfully
    useEffect(() => {
        if(isSuccess){
            setTitle("");
            setDescription("");
            setAmount(0);
            navigate("/dash/products")
        }
    }, [isSuccess, navigate]);
    
    const onTitleChanged = (e) => setTitle(e.target.value);
    const onDescriptionChanged = (e) => setDescription(e.target.value);
    const onAmountChanged = (e) => setAmount(e.target.value);
    const onImagesChanged = (e) => setImages(e.target.files);

    // Checks for every field is valid
    const canSave = [title, description, amount].every(Boolean) && !isLoading;

    const onCreateProductClicked = async (e) => {
        e.preventDefault();

        let imgUrls = [];
        try {
            setLoading(true);
            imgUrls = await uploadImages(images);
        } catch (error) {
            setErr(error);
        } finally{
            setLoading(false);
        }

        if(canSave){
            await addNewProduct({title, description, amount: +amount, imgUrls, userId});
        }
    }

    const errorClass = (isError || err) ? "err-msg" : "d-none";
    const validTitleClass = !title ? "form-input form-error" : "form-input";
    const validDescriptionClass = !description ? "form-input form-error" : "form-input";
    const validAmountClass = !amount ? "form-input form-error" : "form-input";

    if(loading) return <Spinner/>

    return (
        <section className="adjustiable-container">
            <p className={errorClass}>{error?.data?.message || err}</p>
            <form className="form">
                <div className="header-container">
                    <h2>Add New Product</h2>
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
                        className={validAmountClass}
                        type="number"
                        step="1"
                        id="amount"
                        name="amount"
                        min="1"
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
                <button
                    className="form-button"
                    type="submit"  
                    onClick={onCreateProductClicked} 
                    disabled={!canSave} 
                >
                    Create Product
                </button>
            </form>
        </section>
    )
}

export default NewProduct