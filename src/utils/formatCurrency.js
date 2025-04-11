const formatCurrency = (value) => {
  console.log("🚀 ~ formatCurrency ~ value:", value);
  // Loại bỏ mọi ký tự không phải số trước khi format
  const number = Number(value.toString().replace(/\D/g, ""));
  // Format theo kiểu Việt Nam (dấu chấm ngăn cách hàng nghìn)
  return number.toLocaleString("vi-VN");
};

export default formatCurrency;
