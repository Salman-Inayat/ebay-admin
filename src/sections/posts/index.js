import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  TextField,
  Container,
  Card,
} from "@mui/material";
import postInstance from "src/axios/postInstance";
import { DeleteOutline } from "@mui/icons-material";

const PostsSection = () => {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setTitle("");
    setOpen(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await postInstance.get("/");
      setPosts(response.data.posts);
    } catch (error) {
      console.log(error);
    }
  };

  const addPost = async () => {
    try {
      const response = await postInstance.post("/", {
        title,
      });
      setPosts((prevPosts) => [...prevPosts, response.data.post]);
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  const deletePost = async (id) => {
    try {
      await postInstance.delete(`/${id}`);
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Button variant="outlined" size="medium" onClick={handleClickOpen}>
            Add post
          </Button>
        </Grid>

        <Grid item xs={12} mt={2}>
          <Grid container spacing={2}>
            {posts?.map((post) => (
              <Grid item xs={12} key={post._id}>
                <Card sx={{ p: 2 }}>
                  <Stack
                    direction="row"
                    spacing={2}
                    justifyContent="space-between"
                  >
                    <Typography variant="body1">{post.title}</Typography>
                    <DeleteOutline
                      color="error"
                      onClick={() => {
                        deletePost(post._id);
                      }}
                      sx={{
                        cursor: "pointer",
                      }}
                    />
                  </Stack>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiDialog-paper": {
            width: "100%",
            maxWidth: 500,
          },
        }}
      >
        <DialogTitle>Add a new post</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            multiline
            maxRows={4}
            minRows={4}
            id="title"
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={() => {
              addPost();
            }}
            disabled={title.length === 0}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PostsSection;
