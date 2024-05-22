import { useEffect, useState } from "react";
import * as yup from "yup";
import "./App.css";
import { useFormik } from "formik";
import { io } from "socket.io-client";

const addServerSchema = {
  server_name: "",
  server_ip_address: "",
  geo_location: "",
  country_code: "",
  port: "",
  isp: "",
  user_name: "",
  password: "",
  pem_key: null,
  type: "",
};

const addServerValidationSchema = yup.object().shape({
  server_name: yup.string().trim().required("*Please enter your server name"),
  server_ip_address: yup.string().required("*Please enter your IP address"),
  geo_location: yup.string().required("*Please enter your geo location"),
  country_code: yup.string().required("*Please enter your country code"),
  port: yup.string().required("*Please enter your port"),
  isp: yup.string().required("*Please enter your isp"),
  user_name: yup.string().required("*Please enter your user name"),
  password: yup.string(),
  pem_key: yup.mixed().required("*Please upload your pem file"),
  type: yup.string().required("*Please enter your Server type"),
});

function App() {
  const [initialValues] = useState(addServerSchema);
  const [executingCmd, setExecutingCmd] = useState([]);
  const [totalCmd, setTotalCmd] = useState([]);
  const [cmdError, setCmdError] = useState("");
  const [progress, setProgress] = useState(0);
  const userId = "nkdnkncejncijenece234";

  useEffect(() => {
    const socket = io("http://localhost:8082/");

    socket.on("connect", () => {
      console.log("Connected to server");
      socket.emit("register", userId);
    });

    socket.on("executingCmd", (data) => {
      setExecutingCmd((prevData) => [...prevData, data]);
    });

    socket.on("progress", (data) => {
      setProgress(data);
    });

    socket.on("cmdError", (data) => {
      setCmdError(data);
    });

    socket.on("totalCmd", (data) => {
      setTotalCmd(data);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  console.log("totalCmd", totalCmd);
  console.log("executingCmd", executingCmd);
  console.log("progress", progress);
  console.log("cmdError", cmdError);

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validateOnBlur: false,
    validateOnChange: true,
    validationSchema: addServerValidationSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
          if (key !== "pem_key") {
            formData.append(key, value);
          }
        });

        if (values.pem_key) {
          formData.append("pem_key", values.pem_key);
        }
        formData.append("userID", "nkdnkncejncijenece234");
        const response = await fetch("http://localhost:8082/api/server", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(
            "Server responded with a non-200 status: " + response.status
          );
        }
        try {
          const responseData = await response.json();
          console.log("Server response:", responseData);
        } catch (jsonError) {
          const textData = await response.text();
          console.log("Server response (non-JSON):", textData);
        }
      } catch (err) {
        console.log("Failed to login:", err);
      }
    },
  });
  const { values, handleChange, handleBlur, handleSubmit, errors } = formik;

  const handleFileChange = (event) => {
    const { files } = event.target;
    formik.setFieldValue("pem_key", files[0]);
  };
  return (
    <>
      <form onSubmit={handleSubmit} action="">
        <div>
          <input
            style={{ outline: "none" }}
            id="server_name"
            name="server_name"
            type="text"
            value={values.server_name}
            onChange={handleChange("server_name")}
            onBlur={handleBlur("server_name")}
            autoComplete="server_name"
            placeholder="Server name"
            className="block w-full outline-none bg-inherit text-gray1 m-1.5 font-poppins font-medium leading-[25px] text-[13px]"
          />
        </div>
        <div>
          <input
            style={{ outline: "none" }}
            id="server_ip_address"
            name="server_ip_address"
            type="text"
            value={values.server_ip_address}
            onChange={handleChange("server_ip_address")}
            onBlur={handleBlur("server_ip_address")}
            autoComplete="server_ip_address"
            placeholder="Server IP Address"
            className="block w-full outline-none bg-inherit text-gray1 m-1.5 font-poppins font-medium leading-[25px] text-[13px]"
          />
        </div>
        <div>
          <input
            style={{ outline: "none" }}
            id="geo_location"
            name="geo_location"
            type="text"
            value={values.geo_location}
            onChange={handleChange("geo_location")}
            onBlur={handleBlur("geo_location")}
            autoComplete="geo_location"
            placeholder="Geo Location"
            className="block w-full outline-none bg-inherit text-gray1 m-1.5 font-poppins font-medium leading-[25px] text-[13px]"
          />
        </div>
        <div>
          <input
            style={{ outline: "none" }}
            id="country_code"
            name="country_code"
            type="text"
            value={values.country_code}
            onChange={handleChange("country_code")}
            onBlur={handleBlur("country_code")}
            autoComplete="country_code"
            placeholder="Country Code"
            className="block w-full outline-none bg-inherit text-gray1 m-1.5 font-poppins font-medium leading-[25px] text-[13px]"
          />
        </div>
        <div>
          <input
            style={{ outline: "none" }}
            id="port"
            name="port"
            type="text"
            value={values.port}
            onChange={handleChange("port")}
            onBlur={handleBlur("port")}
            autoComplete="port"
            placeholder="Port"
            className="block w-full outline-none bg-inherit text-gray1 m-1.5 font-poppins font-medium leading-[25px] text-[13px]"
          />
        </div>
        <div>
          <input
            style={{ outline: "none" }}
            id="isp"
            name="isp"
            type="text"
            value={values.isp}
            onChange={handleChange("isp")}
            onBlur={handleBlur("isp")}
            autoComplete="isp"
            placeholder="isp"
            className="block w-full outline-none bg-inherit text-gray1 m-1.5 font-poppins font-medium leading-[25px] text-[13px]"
          />
        </div>
        <div>
          <input
            style={{ outline: "none" }}
            id="user_name"
            name="user_name"
            type="text"
            value={values.user_name}
            onChange={handleChange("user_name")}
            onBlur={handleBlur("user_name")}
            autoComplete="user_name"
            placeholder="User name"
            className="block w-full outline-none bg-inherit text-gray1 m-1.5 font-poppins font-medium leading-[25px] text-[13px]"
          />
        </div>
        <div>
          <input
            style={{ outline: "none" }}
            id="type"
            name="type"
            type="text"
            value={values.type}
            onChange={handleChange("type")}
            onBlur={handleBlur("type")}
            autoComplete="type"
            placeholder="Server Type"
            className="block w-full outline-none bg-inherit text-gray1 m-1.5 font-poppins font-medium leading-[25px] text-[13px]"
          />
        </div>
        <div>
          <input
            style={{ outline: "none" }}
            id="pem_key"
            name="pem_key"
            type="file"
            onChange={handleFileChange}
            onBlur={handleBlur("pem_key")}
            autoComplete="off"
            placeholder="Pem File"
            className="input-style"
          />
          {errors.pem_key && <div>{errors.pem_key}</div>}
        </div>
        <br />
        <br />
        <button type="submit">Add Server</button>
      </form>
    </>
  );
}

export default App;
