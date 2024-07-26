import React from "react";
import { FaTrash } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";

const IconButton = ({ handleClick }) => {
  return (
    <Button
      onClick={(e) => {
        e.stopPropagation(); // parent child ilişkisine göre tüm rowdan değil sadece silme butonuna tıklanıldığında işlem gerçekleşmesi sağlanır.
        handleClick();
      }}
    >
      <FaTrash />
    </Button>
  );
};

export default IconButton;
