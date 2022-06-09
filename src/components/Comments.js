import Delete from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Button } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { CommentInput } from "./CommentInput";

export const Comments = (props) => {
  const [comments, setComments] = useState([]);
  const [editedComment, setEditedComment] = useState("");
  const { id, role } = props;

  async function fetchComments() {
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
        `${process.env.REACT_APP_API_URL}/posts/${id}/comments`,
        sendData
      );
      setComments(res.data.map((e) => ({ editing: false, ...e })));
    } catch (e) {
      handleErrors(e);
    }
  }

  async function editComments(data) {
    let header = new Headers({
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "multipart/form-data",
    });
    let sendData = {
      mode: "cors",
      header: header,
      body: JSON.stringify(data),
    };
    try {
      let res = await axios.put(
        `${process.env.REACT_APP_API_URL}/comments/${data.id}`,
        data
      );
      return res.data;
    } catch (e) {
      handleErrors(e);
    }
  }

  async function deleteComments(id) {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/comments/${id}`);
    } catch (e) {
      handleErrors(e);
    }
  }

  useEffect(() => {
    fetchComments();
  }, []);

  function handleErrors(response) {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response;
  }
  return (
    <Paper
      style={{
        maxHeight: 725,
        overflow: "auto",
        display: "flex",
        justifyContent: "center",
      }}
      elevation={3}
    >
      <List component="nav">
        {comments &&
          Array.isArray(comments) &&
          comments.length > 0 &&
          comments.map((comment, id) => (
            <div key={id}>
              <ListItem button divider onClick={(e) => console.log(e)}>
                <ListItemText
                  primary={comment.name}
                  secondary={comment.email}
                />
                {!comment.editing && <ListItemText primary={comment.body} />}
                {role === "admin" && (
                  <div>
                    <EditIcon
                      onClick={(e) => {
                        const mod = [...comments].map((e) => {
                          if (e.id === comment.id) {
                            return { ...e, editing: true };
                          } else {
                            return e;
                          }
                        });
                        setComments(mod);
                        // fetchComments()
                      }}
                    />
                    <Delete
                      onClick={(e) => {
                        deleteComments(comment.id);
                        fetchComments();
                      }}
                    />
                  </div>
                )}
                {comment.editing && (
                  <CommentInput
                    mycomment={comment.body}
                    onEditComment={(e) => {
                      setEditedComment(e);
                    }}
                  />
                )}
                {comment.editing && (
                  <Button
                    title="Save"
                    onClick={(e) => {
                      let { editing, ...rest } = {
                        ...comments.find((e) => e.id === comment.id),
                        body: editedComment,
                      };
                      editComments(rest);
                      const mod = [...comments].map((e) => {
                        if (e.id === comment.id) {
                          return { ...e, body: editedComment, editing: false };
                        } else {
                          return e;
                        }
                      });
                      setComments(mod);
                    }}
                  >
                    {" "}
                    Save{" "}
                  </Button>
                )}
              </ListItem>
            </div>
          ))}
      </List>
      {/* <CommentInput /> */}
    </Paper>
  );
};
