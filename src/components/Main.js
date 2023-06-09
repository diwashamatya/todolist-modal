import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Main.css";
import Edit from "./Edit";

function Main() {
  const [about, setAbout] = useState([]);
  const [name, setName] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [searchItem, setSearchItem] = useState("");
  const [updatedName, setUpdatedName] = useState("");
  const [updatedAbout, setUpdatedAbout] = useState("");
  const [addInfo, setAdd] = useState(true);
  const [search, setSearch] = useState(true);

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    extractData();
  }, []);

  function extractData() {
    axios
      .get("http://localhost:3030/about")
      .then((res) => {
        setAbout(res.data);
      })
      .catch((err) => console.log(err));
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3030/about", {
        name: name,
        about: aboutMe,
      });
      setName("");
      setAboutMe("");
      setAdd(!addInfo);
      extractData();
    } catch (error) {
      console.error(error);
    }
  };
  function toggleButton() {
    setAdd(!addInfo);
  }
  function toggleSearch() {
    setSearch(!search);
  }

  function handleDelete(id) {
    axios
      .delete(`http://localhost:3030/about/${id}`)
      .then(() => {
        setAbout(about.filter((data) => data.id !== id));
      })
      .catch((err) => console.log(err));
  }
  function handleSearch(e) {
    setSearchItem(e.target.value);
  }
  const searchList = about.filter((data) => {
    return data.name.toLowerCase().includes(searchItem.toLowerCase());
  });

  function handleUpdate(id) {
    const dataToUpdate = about.find((data) => data.id === id);

    setUpdatedName(dataToUpdate.name);
    setUpdatedAbout(dataToUpdate.about);
    setEditingId(id);
  }

  function handleSave() {
    const updatedData = {
      id: editingId,
      name: updatedName,
      about: updatedAbout,
    };
    axios
      .put(`http://localhost:3030/about/${editingId}`, updatedData)
      .then(() => {
        setAbout((prevAbout) => {
          return prevAbout.map((data) => {
            if (data.id === editingId) {
              return {
                ...data,
                name: updatedName,
                about: updatedAbout,
              };
            }
            return data;
          });
        });
        setUpdatedName("");
        setUpdatedAbout("");
        setEditingId(null);
      })
      .catch((err) => console.log(err));
  }
  function handleName(e) {
    setUpdatedName(e.target.value);
  }
  function handleAbout(e) {
    setUpdatedAbout(e.target.value);
  }

  return (
    <div className="main">
      <div className="search">
        {!search ? (
          <div className="search-input">
            <input
               
                name="search"
                value={searchItem}
                onChange={handleSearch}
                placeholder="Search"
              ></input>
            <button onClick={toggleSearch}>
              
              <img
                width="32"
                height="32"
                src="https://img.icons8.com/windows/32/search--v1.png"
                alt="search--v1"
              />
            </button>
          </div>
        ) : (
          <button onClick={toggleSearch}>
            <img
              width="32"
              height="32"
              src="https://img.icons8.com/windows/32/search--v1.png"
              alt="search--v1"
            />
          </button>
        )}
      </div>
      <div className="add">
        {!addInfo ? (
          <form onSubmit={handleSubmit} className="add-form">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter a name"
              required
            ></input>
            <label>Aboutme</label>
            <textarea
              type="text"
              name="about"
              value={aboutMe}
              onChange={(e) => setAboutMe(e.target.value)}
              placeholder="Enter about yourself"
              required
            ></textarea>
            <button type="submit">Add</button>
          </form>
        ) : (
          <button className="sub-button" type="submit" onClick={toggleButton}>
            Add
          </button>
        )}
      </div>

      <div>
        <ul>
          {searchList.map((data) => (
            <div className="inside-ul" key={data.id}>
              <h2>{data.name}</h2>
              <p>{data.about}</p>
              {editingId === data.id ? (
                <Edit
                  updatedName={updatedName}
                  updatedAbout={updatedAbout}
                  handleSave={handleSave}
                  handleName={handleName}
                  handleAbout={handleAbout}
                />
              ) : (
                <div className="btn">
                  <button onClick={() => handleUpdate(data.id)}>Edit</button>
                  <button onClick={() => handleDelete(data.id)}>Delete</button>
                </div>
              )}
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Main;
