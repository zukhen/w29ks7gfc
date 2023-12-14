import React, { ChangeEvent, useEffect, useState } from "react";
import styles from "../../orders/orders.module.scss";
import styles2 from "../products.module.scss";
import { handleQueryCategory } from "@/api/category";
import {
  handleHideProduct,
  handleShowProduct,
  handleUpdateProduct,
} from "@/api/product";
import { ToastContainer, toast } from "react-toastify";
import { convertToVietnamTime } from "@/utils/date-utils";
import { resizeFile } from "@/utils/convert-base64";
import { logError } from "@/api";
import { CircularProgress } from "@mui/material";
import { useDispatch } from "react-redux";
import { SET_PUBLISH_PRODUCT,  actionSetTotalUsers } from "@/redux/action/user-action";

interface ProductDetailsProps {
  selectedRowData: any;
  userData: any;
  isDraft: boolean;
  isUserProduct: boolean;
  setOpen: (value: React.SetStateAction<boolean>) => void;
}
interface Category {
  id: any;
  name: any;
}
const ProductDetail: React.FC<ProductDetailsProps> = ({
  selectedRowData,
  isUserProduct,
  isDraft,
  setOpen,
}) => {
  const [dataCategory, setDataCategory] = useState<CategoryModel[]>([]);
  const [category, setCategory] = useState<Category>();
  const [imageProduct, setImageProduct] = useState("");
  const [count, setCount] = useState<number>(0);
  const [nameProduct, setNameProduct] = useState(selectedRowData.product_name);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [description, setDescription] = useState(
    selectedRowData.product_description
  );
        
        const dispatch = useDispatch()
  const [price, setPrice] = useState(
    selectedRowData.product_price
  );
  const [quanity, setQuantity] = useState(selectedRowData.product_quality);
  const [isClickedUpdate, setIsClickedUpdate] = useState(false);
  const getCategories = async () => {
    const categories: any = await handleQueryCategory(1, 10);
    setDataCategory(categories.data.data);
  };
  const handleOnBlur = () => {
    if (imageProduct != undefined) setImageProduct(imageProduct);
  };

  const handleUpdate = async () => {
    
    try {
      setIsLoading(true)
      const response = await handleUpdateProduct(
        selectedRowData._id,
        imageProduct,
        nameProduct,
        description,
        category?.id,
        Number(price.replace(/\./g, '').replace('₫', '')),
        Number(quanity)
      );
      if (response?.status == 200) {
        toast.success(response.data.message);
        // dispatch(actionSetTotalUsers(SET_TOTAL_PRODUCT,true))
      } else {
        toast.error("Error unable to add Product");
      }
    } catch (error) {
    } finally {
      setOpen(false);
      setIsLoading(false)
    }
  };

  const getCategory = (str: string) => {
    for (let item of dataCategory) {
      if (item._id == str) {
        return setCategory({ id: item._id, name: item.category_name });
      }
    }
  };
  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      try {
        let result: any = await resizeFile(file);
        setImageProduct(result);
      } catch (error) {
        console.error("Error converting file to base64:", error);
      }
    }
  };
  const hideProduct = async (id: string) => {
    try {
      setIsLoading(true);
      console.log(id);

      let response = await handleHideProduct(id);
      if (response?.status == 200) {
        toast.success(response.data.message);
      } else {
        toast.error("Error unable to hide Product");
      }
    } catch (error) {
      logError(error, "hideProduct");
    } finally {
      setOpen(false);
      setIsLoading(false);
    }
  };
  const showProduct = async (id: string) => {
    try {
      setIsLoading(true);
      let res = await handleShowProduct(id);
      if (res?.status == 200) {
        toast.success(res.data.message);
        dispatch(actionSetTotalUsers(SET_PUBLISH_PRODUCT,true))
      } else {
        toast.error("Error unable to show Product");
      }
    } catch (error) {
      logError(error);
    } finally {
      setOpen(false);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getCategories();
  }, []);
  useEffect(() => {
    getCategory(selectedRowData.categoryId);
  }, [dataCategory]);
  return (
    <div className={styles.register}>
      <div className={styles.containerRegister}>
        <div className={styles.titleHeader}>
          <div className={styles.rowContainer}>
            {isClickedUpdate ? (
              <input
                style={{ width: "25%" }}
                placeholder={selectedRowData?.product_name}
                onChange={(value) => setNameProduct(value.target.value)}
              />
            ) : (
              <h1 className={styles.titleRegister}>
                {selectedRowData?.product_name}
              </h1>
            )}
            <img
              src={"/zgulV2zGm8t.png"}
              alt="close"
              onClick={() => setOpen(false)}
              width={30}
              height={30}
            />
          </div>
          <p>Created At:&nbsp; {selectedRowData?.createdAt}</p>
          <p>Updated At: {convertToVietnamTime(selectedRowData?.updatedAt)}</p>
          <hr style={{ marginTop: 10, marginBottom: 10 }} />
          <div className={styles2.contentOrder}>
            <img
              width={200}
              height={200}
              onBlur={handleOnBlur}
              src={selectedRowData?.image}
            />
            <div>
              {isClickedUpdate ? (
                <div>
                  <h3>Image</h3>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
              ) : (
                <div></div>
              )}
              <h3 style={{ marginBottom: 2 }}>Description:</h3>
              {isClickedUpdate ? (
                <textarea
                  style={{ padding: 5 }}
                  cols={60}
                  rows={8}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={selectedRowData?.product_description}
                ></textarea>
              ) : (
                <p>{selectedRowData?.product_description}</p>
              )}
              <div style={{ height: 10 }}></div>
              <div className={styles2.price}>
                <h3>Price: </h3>
                {isClickedUpdate ? (
                  <input
                    placeholder={selectedRowData?.product_price.replace(/\./g, '').replace('₫', '')}
                    onChange={(e) => setPrice(e.target.value)}
                    min={0}
                  />
                ) : (
                  <p>{selectedRowData?.product_price}</p>
                )}
              </div>
              <div style={{ height: 10 }}></div>
              <div className={styles2.price}>
                <h3>Quantity: </h3>
                {isClickedUpdate ? (
                  <input
                    placeholder={selectedRowData?.product_quality}
                    onChange={(e) => setQuantity(e.target.value)}
                    min={0}
                  />
                ) : (
                  <p>{selectedRowData?.product_quality}</p>
                )}
              </div>
              <div className={styles2.price}>
                <h3>Category: </h3>
                {isClickedUpdate ? (
                  <select
                    className="itemSelect"
                    onChange={(value) =>
                      setCategory({
                        id: value.target.value,
                        name: value.target.textContent,
                      })
                    }
                  >
                    {Array.isArray(dataCategory) ? (
                      dataCategory.map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.category_name}
                        </option>
                      ))
                    ) : (
                      <option value={"default"}>Default</option>
                    )}
                  </select>
                ) : (
                  <p>{category?.name}</p>
                )}
              </div>
            </div>
          </div>
        </div>
        {isLoading ? (
          <div className={styles2.buttonContainer}>
            <CircularProgress size={30} />
          </div>
        ) : (
          <div className={styles2.buttonContainer}>
            <div>
             {isUserProduct ?<div></div>:isDraft ? (
                <button
                  style={{ backgroundColor: "#00C853" }}
                  onClick={() => showProduct(selectedRowData._id)}
                >
                  Show
                </button>
              ) : (
                <button
                  style={{ marginRight: 10 }}
                  onClick={() => hideProduct(selectedRowData._id)}
                >
                  Hide
                </button>
              )}
            </div>
            <button
            style={{width:isUserProduct?'100%':""}}
              onClick={() => {
                if (count == 0) {
                  setIsClickedUpdate(true);
                  // console.log(selectedRowData);
                  setCount(1);
                } else {
                  handleUpdate();
                }
              }}
            >
              Update
            </button>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};
export default ProductDetail;
