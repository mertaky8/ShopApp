import { useEffect, useState } from "react";
import "react-bootstrap";
import Table from "react-bootstrap/Table";
import { nanoid } from "nanoid";
import Form from "react-bootstrap/Form";
import Fuse from "fuse.js";
import { Button } from "react-bootstrap";
import styled from "styled-components";
import IconButton from "./components/IconButton";

const TableRow = styled.tr`
  text-decoration: ${(props) =>
    props.isBought === true ? "line-through" : "unset"};
`;

function App() {
  const shops = ["Migros", "Teknosa", "BİM"];
  const categories = ["Elektronik", "Gıda", "Oyuncak"];
  const shopsObj = shops.map((shop, index) => ({
    id: index,
    name: shop,
  }));
  const categoriesObj = categories.map((category, index) => ({
    id: index,
    name: category,
  }));

  const [productName, setProductName] = useState("");
  const [products, setProducts] = useState([]);
  const [productShop, setProductShop] = useState("");
  const [productCategory, setProductCategory] = useState("");

  const [filteredName, setFilteredName] = useState("");
  const [filteredShopId, setFilteredShopId] = useState("");
  const [filteredCategoryId, setFilteredCategoryId] = useState("");
  const [filteredStatus, setFilteredStatus] = useState("");

  const handleAddProduct = () => {
    const product = {
      id: nanoid(),
      name: productName,
      shop: productShop,
      category: productCategory,
    };

    setProducts([...products, product]);
  };

  const filteredProducts = products.filter((product) => {
    //name
    const fuse = new Fuse(products, {
      keys: ["name"],
    });
    const res = fuse.search(filteredName);
    if (filteredName !== "" && !res.find((r) => r.item.id === product.id)) {
      return false;
    }
    //Shop
    if (filteredShopId !== "" && filteredShopId !== product.shop) {
      return false;
    }
    //Category
    if (filteredCategoryId !== "" && filteredCategoryId !== product.category) {
      return false;
    }
    //Status
    if (
      filteredStatus !== "reset" &&
      ((product.isBought === true && filteredStatus !== true) ||
        (product.isBought === undefined && filteredStatus !== false))
    ) {
      return false;
    }
    return true;
  });

  return (
    <>
      <div
        style={{
          display: "flex",
          margin: "1rem",
          alignItems: "end",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <Form className="d-flex align-items-end gap-3">
          <Form.Group controlId="exampleForm.ControlInput1">
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={productName}
              onChange={(e) => {
                setProductName(e.target.value);
              }}
              type="text"
            />
          </Form.Group>
          <Form.Select
            style={{ maxWidth: "120px" }}
            aria-label="Default select example"
            value={productShop}
            onChange={(e) => {
              setProductShop(e.target.value);
            }}
          >
            <option>Shop</option>
            {shopsObj.map((shop) => (
              <option key={shop.id} value={shop.id}>
                {shop.name}
              </option>
            ))}
          </Form.Select>
          <Form.Select
            style={{ maxWidth: "120px" }}
            aria-label="Default select example"
            value={productCategory}
            onChange={(e) => {
              setProductCategory(e.target.value);
            }}
          >
            <option>Category</option>
            {categoriesObj.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Form.Select>
        </Form>
        <Button onClick={handleAddProduct} variant="success">
          Ekle
        </Button>
      </div>
      <Form className="d-flex align-items-end m-3 gap-3">
        <Form.Group controlId="exampleForm.ControlInput1">
          <Form.Label>Filter Name</Form.Label>
          <Form.Control
            value={filteredName}
            onChange={(e) => {
              setFilteredName(e.target.value); //filtrelenen isim set edildi controlde girilen değerden
            }}
            type="text"
          />
        </Form.Group>
        <Form.Group
          value={filteredStatus}
          onChange={(e) => {
            const val = e.target.value;
            setFilteredStatus(
              val === "reset" ? val : val === "true" ? true : false //radio statusa göre booleandaki string değer hatası için dönüştürme işlemi yapıldı.
            );
          }}
          className="d-flex flex-column"
        >
          <Form.Check
            inline
            value={"reset"}
            type="radio"
            label="Sıfırla"
            name="group1"
            id={`inline-radio-1`}
          />
          <Form.Check
            inline
            value={true}
            type="radio"
            label="Alınmış"
            name="group1"
            id={`inline-radio-2`}
          />
          <Form.Check
            inline
            value={false}
            type="radio"
            label="Alınmamış"
            name="group1"
            id={`inline-radio-3`}
          />
        </Form.Group>
        <Form.Select
          aria-label="Default select example"
          value={filteredShopId}
          onChange={(e) => {
            setFilteredShopId(e.target.value);
          }}
        >
          <option value={""}>Filter Shop</option>
          {shopsObj.map((shop) => (
            <option key={shop.id} value={shop.id}>
              {shop.name}
            </option>
          ))}
        </Form.Select>
        <Form.Select
          aria-label="Default select example"
          value={filteredCategoryId}
          onChange={(e) => {
            setFilteredCategoryId(e.target.value);
          }}
        >
          <option value={""}>Filter Category</option>
          {categoriesObj.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Form.Select>
      </Form>
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Shop</th>
            <th>Category</th>
            <th>ID</th>
            <th>Sil</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <TableRow
              isBought={product.isBought}
              onClick={() => {
                // o rowdaki elemanın üstüne tıklanıldığında alınmış duruma getiriliyor her güncellenen ürünün status true ise alert basılıyor ekrana
                setProducts((oldProducts) => {
                  const updatedProducts = oldProducts.map((oldProduct) => {
                    if (oldProduct.id === product.id) {
                      return { ...oldProduct, isBought: true };
                    } else {
                      return oldProduct;
                    }
                  });
                  if (updatedProducts.every((up) => Boolean(up.isBought))) {
                    alert("Alışveriş Tamamlandı.");
                  }
                  return updatedProducts;
                });
              }}
              key={product.id}
            >
              <td>{product.name}</td>
              <td>
                {
                  shopsObj.find(
                    (shopObj) => shopObj.id === parseInt(product.shop)
                  )?.name
                }
              </td>
              <td>
                {
                  categoriesObj.find(
                    (categoryObj) =>
                      categoryObj.id === parseInt(product.category)
                  )?.name
                }
              </td>
              <td>{product.id}</td>
              <td>
                <IconButton
                  handleClick={() => {
                    setProducts(
                      products.filter(
                        (filterProduct) => filterProduct.id !== product.id
                      )
                    );
                  }}
                />
              </td>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default App;
