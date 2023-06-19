import {
  Box,
  Button,
  Grid,
  Modal,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Draggable from "react-draggable";
import { ApiBox } from "@/axios-api/api";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const theme = createTheme({});

const Some = (props) => {
  useEffect(() => {
    if (props.id) {
      setHeight(props.height);
      setWidth(props.width);
      setPositionX(props.x);
      setPositionY(props.y);
      setColor(props.background);
      setIsLoaded(true);
    }
  }, [props]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setHeight(data.height);
    setWidth(data.width);
    setColor(data.color);
    await ApiBox.updateBoxProperties({
      height: Number(data.height),
      width: Number(data.width),
      background: data.color,
    });
    setOpen(false);
  };

  const stopHandler = async (e, p) => {
    setPositionX(p.x);
    setPositionY(p.y);
    await ApiBox.updateBoxProperties({
      x: Math.round(p.x),
      y: Math.round(p.y),
    });
  };

  const [open, setOpen] = useState(false);
  const [width, setWidth] = useState(200);
  const [height, setHeight] = useState(200);
  const [color, setColor] = useState("red");
  const [positionX, setPositionX] = useState(100);
  const [positionY, setPositionY] = useState(100);
  const [displayedPositionX, setDisplayedPositionX] = useState(positionX);
  const [displayedPositionY, setDisplayedPositionY] = useState(positionY);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setDisplayedPositionX(positionX);
  }, [positionX]);

  useEffect(() => {
    setDisplayedPositionY(positionY);
  }, [positionY]);

  return (
    <ThemeProvider theme={theme}>
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container rowGap={3}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Change block properties
              </Typography>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <TextField
                    defaultValue={width}
                    {...register("width", {
                      min: {
                        value: 1,
                        message: "Min length of width should be 1",
                      },
                    })}
                    type="number"
                    label="Width"
                    variant="standard"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    defaultValue={height}
                    type="number"
                    {...register("height", {
                      min: {
                        value: 1,
                        message: "Min length of height should be 1",
                      },
                    })}
                    label="Height"
                    variant="standard"
                  />
                </Grid>
                <Grid item xs={12}>
                  <input
                    {...register("color")}
                    min={0}
                    defaultValue={color}
                    type="color"
                  />
                </Grid>
              </Grid>
              <Grid container>
                <div>{errors.height?.message}</div>
                <div>{errors.width?.message}</div>
              </Grid>
              <Grid container>
                <Button type="submit" variant="contained">
                  Save
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Modal>

      <div
        style={{
          width: "100vw",
          height: "100vh",
          position: "relative",
        }}
      >
        <div className="properties-block">
          <div style={{ display: "flex" }}>
            <div>Width:</div>
            <div>{width}</div>
          </div>
          <div style={{ display: "flex" }}>
            <div>Height:</div>
            <div>{height}</div>
          </div>
          <div style={{ display: "flex" }}>
            <div>Position x:</div>
            <div>{displayedPositionX}</div>
          </div>
          <div style={{ display: "flex" }}>
            <div>Position y:</div>
            <div>{displayedPositionY}</div>
          </div>
          <div style={{ display: "flex" }}>
            <div>Background:</div>
            <div>{color}</div>
          </div>
          <div></div>
        </div>
        <Draggable
          bounds={"body"}
          position={{ x: positionX, y: positionY }}
          onStop={stopHandler}
          onDrag={(e, p) => {
            setDisplayedPositionX(p.x);
            setDisplayedPositionY(p.y);
          }}
        >
          {isLoaded ? (
            <div
              onContextMenu={(e) => {
                e.preventDefault();
                setOpen(true);
              }}
              style={{
                width: `${width}px`,
                height: `${height}px`,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: `${color}`,
              }}
            >
              Click me
            </div>
          ) : (
            <div></div>
          )}
        </Draggable>
      </div>
    </ThemeProvider>
  );
};

export const getServerSideProps = async () => {
  const res = await ApiBox.getBoxParameters();
  if (res.data === "No data") {
    const newBox = await ApiBox.createBox({
      width: 200,
      height: 200,
      x: 200,
      y: 200,
      background: "red",
    });
    return { props: newBox };
  }
  return { props: res.data };
};

export default Some;
