import { Select, Space } from "antd";
import "./FilterProduct.scss";

const FilterProduct = (props) => {
  const { onTypeChange } = props;

  const options = [
    {
      value: "",
      label: "Phổ biến",
    },
    {
      value: "selling",
      label: "Bán chạy",
    },
    {
      value: "new-product",
      label: "Hàng mới",
    },
  ];

  const optionsSize = [
    {
      value: "",
      label: "Kích thướt",
    },
    {
      value: "30",
      label: "30",
    },
    {
      value: "31",
      label: "31",
    },
  ];

  const optionsPrice = [
    {
      value: "",
      label: "Giá",
    },
    {
      value: "desc",
      label: "Giảm dần",
    },
    {
      value: "asc",
      label: "Tăng dần",
    },
  ];

  const handleChange = (type, value) => {
    onTypeChange(type, value);
  };

  return (
    <div className="filter__product">
      <Space>
        <Select defaultValue="" options={options} style={{ width: "180px" }} />
        <Select
          defaultValue=""
          options={optionsSize}
          onChange={(e) => handleChange("size", e)}
          style={{ width: "180px" }}
        />
        <Select
          defaultValue=""
          options={optionsPrice}
          onChange={(e) => handleChange("price", e)}
          style={{ width: "180px" }}
        />
      </Space>
    </div>
  );
};

export default FilterProduct;
