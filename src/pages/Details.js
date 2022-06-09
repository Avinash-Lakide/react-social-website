import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import List from "@mui/material/List";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Comments } from "../components/Comments";

export const Details = ({ role }) => {
  const [post, setPost] = useState([]);
  const { id } = useParams();

  async function fetchPosts() {
    let header = new Headers({
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "multipart/form-data",
    });
    let sendData = {
      mode: "cors",
      header: header,
    };
    try {
      let res = await axios.get(`${process.env.REACT_APP_API_URL}/posts/${id}`);
      setPost([res.data]);
    } catch (e) {
      handleErrors(e);
    }
  }

  useEffect(() => {
    fetchPosts();
  }, [id]);

  function handleErrors(response) {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response;
  }
  return (
    <div>
      <Paper
        style={{
          maxHeight: 725,
          overflow: "auto",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
        elevation={3}
      >
        <List component="nav">
          {post &&
            Array.isArray(post) &&
            post.length > 0 &&
            post.map((post, id) => (
              <Card sx={{ maxWidth: 600, marginTop: 5 }}>
                <CardContent>
                  <Typography
                    sx={{ fontSize: 14 }}
                    color="text.primary"
                    gutterBottom
                  >
                    {post.id} - {post.title}
                  </Typography>
                  <Typography paragraph color="text.secondary">
                    {post.body}
                  </Typography>
                </CardContent>
              </Card>
            ))}
        </List>
        <Comments id={id} role={role} />
      </Paper>
    </div>
  );
};
