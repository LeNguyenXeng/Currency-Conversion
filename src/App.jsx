import { Form, InputGroup } from "react-bootstrap";
import "./App.css";
import { useEffect, useState } from "react";
import { formatCurrency, parseFormattedNumber } from "./utils/formatCurrency";
import { XMLParser } from "fast-xml-parser";
import dayjs from "dayjs";

function App() {
  const [usdValue, setUsdValue] = useState(0);
  const [vndValue, setVndValue] = useState("");
  const [swap, setSwap] = useState("USD");
  const [usdRate, setUsdRate] = useState(null);
  const [date, setDate] = useState("");
  const fetchExchangeRate = async () => {
    try {
      const response = await fetch(
        "https://portal.vietcombank.com.vn/Usercontrols/TVPortal.TyGia/pXML.aspx?b=10"
      );
      const textData = await response.text();

      const parser = new XMLParser({ ignoreAttributes: false });
      const result = parser.parse(textData);
      setDate(result.ExrateList.DateTime);
      const exrates = result.ExrateList.Exrate;

      const findUSD = exrates.find((item) => item["@_CurrencyCode"] === "USD");

      if (findUSD) {
        setUsdRate({
          buy: findUSD["@_Buy"],
          transfer: findUSD["@_Transfer"],
          sell: findUSD["@_Sell"],
        });
      }
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
    }
  };

  useEffect(() => {
    fetchExchangeRate();
  }, []);

  const handleChangeCurrency = (event) => {
    if (swap === "USD") {
      setUsdValue(event.target.value);
      const result = event.target.value * parseFormattedNumber(usdRate?.buy);
      console.log("🚀 ~ handleChangeCurrency ~ result:", result);
      setVndValue(formatCurrency(result));
    } else if (swap === "VND") {
      setUsdValue(event.target.value);
      const result = event.target.value / parseFormattedNumber(usdRate?.buy);
      setVndValue(result.toFixed(2));
    }
  };
  const handleSwap = () => {
    setSwap((prev) => (prev === "USD" ? "VND" : "USD"));
    setUsdValue(0);
    setVndValue(0);
  };
  return (
    <>
      <div className="background">
        <div className="card d-flex">
          <div className="mb-4">
            <h3>Tỷ giá ngày {dayjs(date).format("DD/MM/YYYY")}</h3>
            <span className="px-2">Giá Bán: {usdRate?.sell}</span>
            <span>Giá Mua: {usdRate?.buy}</span>
          </div>
          <div
            className="d-flex align-items-center justify-content-between"
            style={{ width: "90%" }}
          >
            <InputGroup style={{ width: "80%" }}>
              <Form.Control
                value={usdValue}
                type="number"
                min={0}
                aria-label="Dollar amount (with dot and two decimal places)"
                onChange={handleChangeCurrency}
              />
              <InputGroup.Text>
                {swap === "USD" ? (
                  <img
                    className="image-usd"
                    src="https://www.shutterstock.com/image-vector/usa-flag-icons-vector-set-600nw-2491312125.jpg"
                    alt=""
                  />
                ) : (
                  <img
                    className="image-usd"
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Vietnam.svg/1024px-Flag_of_Vietnam.svg.png"
                    alt=""
                  />
                )}
                {swap === "USD" ? "USD" : "VND"}
              </InputGroup.Text>
            </InputGroup>
            <div
              style={{ padding: "0 30px", cursor: "pointer" }}
              onClick={handleSwap}
            >
              <svg
                width={20}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
              >
                <path d="M438.6 150.6c12.5-12.5 12.5-32.8 0-45.3l-96-96c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.7 96 32 96C14.3 96 0 110.3 0 128s14.3 32 32 32l306.7 0-41.4 41.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l96-96zm-333.3 352c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 416 416 416c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0 41.4-41.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-96 96c-12.5 12.5-12.5 32.8 0 45.3l96 96z" />
              </svg>
            </div>
            <InputGroup style={{ width: "80%" }}>
              <Form.Control
                defaultValue={vndValue}
                type="text"
                aria-label="Dollar amount (with dot and two decimal places)"
              />
              <InputGroup.Text>
                {swap === "USD" ? (
                  <img
                    className="image-usd"
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Vietnam.svg/1024px-Flag_of_Vietnam.svg.png"
                    alt=""
                  />
                ) : (
                  <img
                    className="image-usd"
                    src="https://www.shutterstock.com/image-vector/usa-flag-icons-vector-set-600nw-2491312125.jpg"
                    alt=""
                  />
                )}
                {swap === "USD" ? "VND" : "USD"}
              </InputGroup.Text>
            </InputGroup>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
