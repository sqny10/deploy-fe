export const uploadImages = async (images) => {
    let imgUrls = [];
    const url = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/image/upload`;
    const formData = new FormData();

    for (let i = 0; i < images.length; i++) {
        let file = images[i];
        formData.append("file", file);
        formData.append("upload_preset", "zr6z2zq5");
    
        const response = await fetch(url, {
            method: "POST",
            body: formData
        });

        if(!response.ok){
            throw new Error("Upload failed");
        }

        const data = await response.json();
        imgUrls.push(data.url);
    }

    return imgUrls
}