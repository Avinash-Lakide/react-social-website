import { Button } from "@mui/material";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const useStyles = makeStyles((theme) => {
  return {
    root: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "100%",
      height: "700px",
      background: "white",
    },
    text: {
      color: "black",
    },
    margin: {
      margin: "10px",
    },
  };
});

export const EditPosts = (props) => {
  const [post, setPost] = useState("");
  const classes = useStyles({});
  const { id } = useParams();
  let navigate = useNavigate();

  async function saveHandler() {
    let header = new Headers({
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "multipart/form-data",
    });
    let sendData = {
      mode: "cors",
      header: header,
    };
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/posts/${id}`, post);
      navigate("/");
    } catch (e) {
      handleErrors(e);
    }
  }

  async function fetchPost() {
    let header = new Headers({
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "multipart/form-data",
    });
    let sendData = {
      mode: "cors",
      header: header,
    };
    try {
      let res = await axios.get(
        `${process.env.REACT_APP_API_URL}/posts/${id}`,
        sendData
      );
      setPost(res.data);
    } catch (e) {
      handleErrors(e);
    }
  }

  useEffect(() => {
    fetchPost();
  }, []);

  function handleErrors(response) {
    if (!response.ok) {
      console.error(response);
      throw Error(response.statusText);
    }
    return response;
  }
  return (
    <div className={classes.root}>
      <h1 className={classes.text}>Edit Post</h1>
      <TextareaAutosize
        className={classes.margin}
        aria-label="minimum height"
        minRows={3}
        placeholder="Title"
        style={{ width: 500 }}
        value={post.title}
        onChange={(e) => {
          setPost({ ...post, title: e.target.value });
        }}
      />
      <TextareaAutosize
        className={classes.margin}
        aria-label="minimum height"
        minRows={3}
        placeholder="Body"
        style={{ width: 500 }}
        value={post.body}
        onChange={(e) => {
          setPost({ ...post, body: e.target.value });
        }}
      />
      <Button className="button" onClick={saveHandler}>
        Save
      </Button>
    </div>
  );
};
