import "./newRoom.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";
import { roomInputs } from "../../formSource";
import axios from "axios";
import useFetch from "../../hooks/useFetch";

const NewRoom = () => {
  const [files, setFiles] = useState(null);
  const [info, setInfo] = useState({});
  const [hotelId, setHotelId] = useState(undefined);
  const [rooms, setRooms] = useState([]);

  const { data, loading } = useFetch("/hotels");

  const handleChange = e => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  }

  const handleRooms = (e) => {
    const value = (e.target.value).split(",").map((roomNum => ({ number: roomNum.replace(/^\s+|\s+$/gm, '') })));
    setRooms(value);
  }

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      if (files) {
        const list = await Promise.all(Object.values(files).map(
          async (file) => {
            const data = new FormData();
            data.append("file", file);
            data.append("upload_preset", "uploadImage");
            try {
              const cloud_name = "dfeeu1i4c";
              const resource_type = "image";
              const uploadRes = await axios.post(`https://api.cloudinary.com/v1_1/${cloud_name}/${resource_type}/upload`, data);
              const { url } = uploadRes.data;
              return url;
            } catch (err) {
              console.log(err);
            }
          }
        ));
        const newRoom = {
          ...info,
          photos: list || null
        }
      } else {
        const newRoom = {
          ...info,
          roomNumbers: rooms
        }
        await axios.post(`/rooms/${hotelId}`, newRoom);
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Add New Room</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img
              src={
                files
                  ? URL.createObjectURL(files[0])
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt=""
            />
          </div>
          <div className="right">
            <form>
              <div className="formInput">
                <label htmlFor="file">
                  Image: <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="file"
                  multiple
                  onChange={(e) => setFiles(e.target.files)}
                  style={{ display: "none" }}
                />
              </div>

              {roomInputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    type={input.type}
                    placeholder={input.placeholder}
                    onChange={handleChange}
                    id={input.id}
                  />
                </div>
              ))}
              <div className="formInput">
                <label>Add Room Numbers </label>
                <textarea
                  name="rooms"
                  id="rooms"
                  cols="30"
                  rows="3"
                  placeholder="give comma between room numbers"
                  onChange={handleRooms}
                />
              </div>
              <div className="formInput">
                <label>Choose a hotel</label>
                <select name="hotelId" id="hotelId" onChange={(e) => setHotelId(e.target.value)}>
                  {
                    loading ? "Loading..." : data && data.map((item) => {
                      return <option value={item._id} key={item._id}>{item.name}</option>
                    })
                  }
                </select>
              </div>
              <button onClick={handleClick}>Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewRoom;
